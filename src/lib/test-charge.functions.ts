import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { chargeCreditCard, sanitizeRawForStorage, toCents } from "@/lib/payments/rede";

const ThreeDSSchema = z.object({
  userAgent: z.string().min(1).max(500),
  acceptHeader: z.string().min(1).max(255),
  device: z.object({
    colorDepth: z.number().int().min(1).max(64),
    deviceType: z.enum(["BROWSER", "MOBILE"]),
    javaEnabled: z.boolean(),
    language: z.string().min(2).max(10),
    screenHeight: z.number().int().min(1).max(10000),
    screenWidth: z.number().int().min(1).max(10000),
    timeZoneOffset: z.number().int().min(-720).max(840),
  }),
  cardHolder: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(100),
    mobilePhone: z.string().trim().min(10).max(20),
    documentNumber: z.string().trim().min(11).max(14),
  }),
  billingAddress: z.object({
    street: z.string().trim().min(2).max(50),
    number: z.string().trim().min(1).max(10),
    complement: z.string().trim().max(30).optional(),
    city: z.string().trim().min(2).max(50),
    state: z.string().trim().length(2),
    country: z.string().trim().length(3).default("BRA"),
    zipCode: z.string().trim().min(8).max(9),
  }),
});

const TestChargeSchema = z.object({
  amount: z.number().positive().max(10000),
  description: z.string().trim().min(1).max(200),
  cardholderName: z.string().trim().min(2).max(100),
  cardNumber: z.string().trim().min(13).max(25),
  expirationMonth: z.string().trim().regex(/^\d{1,2}$/),
  expirationYear: z.string().trim().regex(/^\d{2}$|^\d{4}$/),
  securityCode: z.string().trim().regex(/^\d{3,4}$/),
  installments: z.number().int().min(1).max(12).default(1),
  threeDS: ThreeDSSchema,
});

export const chargeTestPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TestChargeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      throw new Error("Acesso restrito a administradores.");
    }

    const { data: userInfo } = await supabaseAdmin.auth.admin.getUserById(userId);
    const adminEmail = userInfo?.user?.email ?? data.threeDS.cardHolder.email;

    // PAN/CVV/expiração NÃO são gravados — apenas em memória nesta função.
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: "TESTE ADMIN",
        customer_email: adminEmail,
        customer_phone: data.threeDS.cardHolder.mobilePhone.replace(/\D/g, ""),
        shipping_address: { teste: true },
        product_name: data.description,
        product_price: data.amount,
        shipping_price: 0,
        total_price: data.amount,
        payment_method: "credit_card",
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("[chargeTestPayment] order insert failed:", orderError);
      throw new Error("Falha ao criar pedido de teste.");
    }

    const result = await chargeCreditCard({
      orderId: order.id,
      amountCents: toCents(data.amount),
      installments: data.installments,
      cardNumber: data.cardNumber,
      cardholderName: data.cardholderName,
      expirationMonth: data.expirationMonth,
      expirationYear: data.expirationYear,
      securityCode: data.securityCode,
      softDescriptor: "CF TESTE",
      threeDS: {
        embedded: true,
        onFailure: "decline",
        userAgent: data.threeDS.userAgent,
        device: data.threeDS.device,
        billingAddress: data.threeDS.billingAddress,
        cardHolder: data.threeDS.cardHolder,
        browser: { acceptHeader: data.threeDS.acceptHeader },
      },
    });

    await supabaseAdmin.from("transactions").insert({
      order_id: order.id,
      gateway: "rede",
      gateway_transaction_id: result.tid,
      amount: data.amount,
      status: result.approved ? "captured" : "denied",
      raw_response: sanitizeRawForStorage(
        result.raw ?? { error: result.returnMessage },
      ) as never,
    });

    const newOrderStatus = result.approved ? "paid" : "failed";
    await supabaseAdmin.from("orders").update({ status: newOrderStatus }).eq("id", order.id);

    // Resposta para o cliente sem PAN/CVV nem payload bruto
    return {
      orderId: order.id,
      tid: result.tid,
      returnCode: result.returnCode,
      returnMessage: result.returnMessage,
      httpStatus: result.httpStatus,
      status: newOrderStatus,
      approved: result.approved,
      threeDSUrl: result.threeDS?.url ?? null,
    };
  });
