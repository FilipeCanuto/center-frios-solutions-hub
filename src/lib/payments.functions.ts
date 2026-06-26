import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  chargeCreditCard,
  chargePix,
  onlyDigits,
  sanitizeRawForStorage,
  toCents,
} from "@/lib/payments/rede";
import {
  FIXED_SHIPPING_PRICE,
  PRODUCT_CATALOG,
  getCatalogProduct,
} from "@/lib/catalog.server";
import { rateLimit, rateLimitDb } from "@/lib/rate-limit.server";

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
  customer_name: z.string().trim().min(2).max(160),
  customer_email: z.string().trim().email().max(255),
  customer_phone: z.string().trim().min(8).max(40),
  customer_company: z.string().trim().max(160).optional(),
  customer_cnpj: z.string().trim().max(32).optional(),
  customer_cpf: z.string().trim().max(20).optional(),
  shipping_address: z.object({
    cep: z.string().min(8).max(12),
    street: z.string().min(1).max(160),
    number: z.string().min(1).max(20),
    complement: z.string().max(80).optional(),
    district: z.string().min(1).max(120),
    city: z.string().min(1).max(120),
    state: z.string().min(2).max(2),
  }),
  // Server is the source of truth for product identity & price.
  product_slug: z.enum(
    Object.keys(PRODUCT_CATALOG) as [string, ...string[]],
  ),
  payment_method: z.enum(["pix", "credit_card"]),
  card_data: z
    .object({
      cardNumber: z.string().min(13).max(25),
      cardholderName: z.string().min(2).max(80),
      expirationMonth: z.string().min(1).max(2),
      expirationYear: z.string().min(2).max(4),
      securityCode: z.string().min(3).max(4),
      installments: z.number().int().min(1).max(12),
    })
    .optional(),
  three_ds: ThreeDSSchema.optional(),
});

export const processPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PaymentSchema.parse(input))
  .handler(async ({ data }) => {
    // Rate limit: in-memory fast path + durable DB-backed check.
    // Error payloads são JSON serializável para que o cliente humanize sem vazar internals.
    const rateLimitError = () =>
      new Error(JSON.stringify({ kind: "rate_limit" }));

    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const ipFast = rateLimit(`pay:ip:${ip}`, { limit: 10, windowMs: 60_000 });
    if (!ipFast.ok) throw rateLimitError();
    const ipDb = await rateLimitDb(`pay:ip:${ip}`, 15, 60);
    if (!ipDb.ok) throw rateLimitError();
    const emailKey = `pay:email:${data.customer_email.toLowerCase()}`;
    const emailFast = rateLimit(emailKey, { limit: 5, windowMs: 60_000 });
    if (!emailFast.ok) throw rateLimitError();
    const emailDb = await rateLimitDb(emailKey, 5, 60);
    if (!emailDb.ok) throw rateLimitError();

    // Authoritative product lookup — never trust client-supplied prices.
    const catalog = getCatalogProduct(data.product_slug);
    if (!catalog) throw new Error("Produto inválido.");
    const productName = catalog.name;
    const productPrice = catalog.price;
    // CENTERFRIOS — frete grátis para Alagoas (CEP iniciando com 57).
    const cepDigits = onlyDigits(data.shipping_address.cep);
    const isAlagoas = cepDigits.startsWith("57");
    const shippingPrice = isAlagoas ? 0 : FIXED_SHIPPING_PRICE;

    const subtotal = productPrice;
    const discountPix = data.payment_method === "pix" ? subtotal * 0.05 : 0;
    const total = subtotal - discountPix + shippingPrice;

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
        product_name: productName,
        product_price: productPrice,
        shipping_price: shippingPrice,
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
        JSON.stringify({
          kind: "rede_declined",
          code: result.returnCode ?? null,
          message: result.returnMessage ?? null,
          http: result.httpStatus ?? null,
        }),
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
      throw new Error(
        JSON.stringify({
          kind: "pix_failed",
          code: pix.returnCode ?? null,
          message: pix.returnMessage ?? null,
        }),
      );
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
