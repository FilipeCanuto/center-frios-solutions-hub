import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  chargeCreditCard,
  chargePix,
  onlyDigits,
  sanitizeRawForStorage,
  toCents,
} from "@/lib/payments/rede";

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
});

const PaymentSchema = z.object({
  customer_name: z.string().trim().min(2),
  customer_email: z.string().trim().email(),
  customer_phone: z.string().trim().min(8),
  customer_company: z.string().trim().optional(),
  customer_cnpj: z.string().trim().optional(),
  customer_cpf: z.string().trim().optional(),
  shipping_address: z.object({
    cep: z.string(),
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    district: z.string(),
    city: z.string(),
    state: z.string(),
  }),
  product_name: z.string(),
  product_price: z.number(),
  shipping_price: z.number(),
  payment_method: z.enum(["pix", "credit_card"]),
  card_data: z
    .object({
      cardNumber: z.string(),
      cardholderName: z.string(),
      expirationMonth: z.string(),
      expirationYear: z.string(),
      securityCode: z.string(),
      installments: z.number(),
    })
    .optional(),
  three_ds: ThreeDSSchema.optional(),
});

export const processPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PaymentSchema.parse(input))
  .handler(async ({ data }) => {
    const subtotal = data.product_price;
    const discountPix = data.payment_method === "pix" ? subtotal * 0.05 : 0;
    const total = subtotal - discountPix + data.shipping_price;

    const cleanPhone = onlyDigits(data.customer_phone);
    const cleanCnpj = data.customer_cnpj ? onlyDigits(data.customer_cnpj) : null;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: cleanPhone,
        customer_company: data.customer_company || null,
        customer_cnpj: cleanCnpj,
        shipping_address: data.shipping_address,
        product_name: data.product_name,
        product_price: data.product_price,
        shipping_price: data.shipping_price,
        total_price: total,
        payment_method: data.payment_method,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("[processPayment] order insert failed:", orderError);
      throw new Error("Erro ao registrar o pedido. Tente novamente.");
    }

    const amountCents = toCents(total);

    if (data.payment_method === "credit_card") {
      if (!data.card_data) throw new Error("Dados do cartão ausentes.");
      if (!data.three_ds) throw new Error("Dados de autenticação 3DS ausentes.");
      if (!data.customer_cpf) {
        throw new Error("CPF do portador é obrigatório para autenticação 3DS.");
      }

      const cleanCpf = onlyDigits(data.customer_cpf);
      const cleanZip = onlyDigits(data.shipping_address.cep);
      const cd = data.card_data;

      const result = await chargeCreditCard({
        orderId: order.id,
        amountCents,
        installments: cd.installments,
        cardNumber: cd.cardNumber,
        cardholderName: cd.cardholderName,
        expirationMonth: cd.expirationMonth,
        expirationYear: cd.expirationYear,
        securityCode: cd.securityCode,
        softDescriptor: "CENTERFRIOS",
        threeDS: {
          embedded: true,
          onFailure: "decline",
          userAgent: data.three_ds.userAgent,
          device: data.three_ds.device,
          browser: { acceptHeader: data.three_ds.acceptHeader },
          billingAddress: {
            street: data.shipping_address.street,
            number: data.shipping_address.number,
            complement: data.shipping_address.complement,
            city: data.shipping_address.city,
            state: data.shipping_address.state,
            country: "BRA",
            zipCode: cleanZip,
          },
          cardHolder: {
            name: data.customer_name,
            email: data.customer_email,
            mobilePhone: cleanPhone.length < 12 ? `55${cleanPhone}` : cleanPhone,
            documentNumber: cleanCpf,
          },
        },
      });

      await supabaseAdmin.from("transactions").insert({
        order_id: order.id,
        gateway: "rede",
        gateway_transaction_id: result.tid,
        amount: total,
        status: result.approved ? "captured" : "denied",
        raw_response: sanitizeRawForStorage(
          result.raw ?? { error: result.returnMessage },
        ) as never,
      });

      if (result.approved) {
        await supabaseAdmin.from("orders").update({ status: "paid" }).eq("id", order.id);
        return { success: true, orderId: order.id, status: "paid" as const };
      }

      await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
      throw new Error(
        `Transação recusada (${result.returnCode ?? "—"}): ${result.returnMessage}`,
      );
    }

    // PIX
    const pix = await chargePix({ orderId: order.id, amountCents });

    await supabaseAdmin.from("transactions").insert({
      order_id: order.id,
      gateway: "rede",
      gateway_transaction_id: pix.tid,
      amount: total,
      status: pix.ok ? "pending" : "failed",
      pix_qr_code: pix.qrCodeBase64,
      pix_copia_cola: pix.qrCodeString,
      raw_response: sanitizeRawForStorage(pix.raw ?? { error: pix.returnMessage }) as never,
    });

    if (!pix.ok) {
      await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
      throw new Error(`Falha ao gerar PIX: ${pix.returnMessage}`);
    }

    return {
      success: true,
      orderId: order.id,
      status: "pending" as const,
      pix: {
        qrCode: pix.qrCodeBase64,
        copiaCola: pix.qrCodeString,
      },
    };
  });
