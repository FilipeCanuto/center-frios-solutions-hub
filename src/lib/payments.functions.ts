import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { chargeCreditCard, chargePix, onlyDigits, toCents } from "@/lib/payments/rede";

const PaymentSchema = z.object({
  customer_name: z.string().trim().min(2),
  customer_email: z.string().trim().email(),
  customer_phone: z.string().trim().min(8),
  customer_company: z.string().trim().optional(),
  customer_cnpj: z.string().trim().optional(),
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
});

export const processPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PaymentSchema.parse(input))
  .handler(async ({ data }) => {
    // 1. Total
    const subtotal = data.product_price;
    const discountPix = data.payment_method === "pix" ? subtotal * 0.05 : 0;
    const total = subtotal - discountPix + data.shipping_price;

    // 2. Order — telefone/CNPJ limpos antes de gravar
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

    // 3. Crédito
    if (data.payment_method === "credit_card") {
      if (!data.card_data) {
        throw new Error("Dados do cartão ausentes.");
      }
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
      });

      await supabaseAdmin.from("transactions").insert({
        order_id: order.id,
        gateway: "rede",
        gateway_transaction_id: result.tid,
        amount: total,
        status: result.approved ? "captured" : "denied",
        raw_response: (result.raw ?? { error: result.returnMessage }) as never,
      });

      if (result.approved) {
        await supabaseAdmin.from("orders").update({ status: "paid" }).eq("id", order.id);
        return { success: true, orderId: order.id, status: "paid" };
      }

      await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
      throw new Error(
        `Transação recusada pela operadora (${result.returnCode ?? "sem código"}): ${result.returnMessage}`,
      );
    }

    // 4. PIX
    const pix = await chargePix({ orderId: order.id, amountCents });

    await supabaseAdmin.from("transactions").insert({
      order_id: order.id,
      gateway: "rede",
      gateway_transaction_id: pix.tid,
      amount: total,
      status: pix.ok ? "pending" : "failed",
      pix_qr_code: pix.qrCodeBase64,
      pix_copia_cola: pix.qrCodeString,
      raw_response: (pix.raw ?? { error: pix.returnMessage }) as never,
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
