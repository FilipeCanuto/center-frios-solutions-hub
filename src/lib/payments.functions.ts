import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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
    // 1. Calculate total price
    const subtotal = data.product_price;
    const discountPix = data.payment_method === "pix" ? subtotal * 0.05 : 0;
    const total = subtotal - discountPix + data.shipping_price;

    // 2. Insert order into public.orders using supabaseAdmin (bypassing RLS safely)
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        customer_company: data.customer_company || null,
        customer_cnpj: data.customer_cnpj || null,
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
      console.error("[processPayment] Order insertion failed:", orderError);
      throw new Error("Erro ao registrar o pedido. Tente novamente.");
    }

    const REDE_PV = process.env.REDE_PV;
    const REDE_TOKEN = process.env.REDE_TOKEN;
    const isSandbox = !REDE_PV || !REDE_TOKEN;

    // 3. Process with Rede API
    if (data.payment_method === "credit_card") {
      if (!data.card_data) {
        throw new Error("Dados do cartão ausentes.");
      }

      const amountCents = Math.round(total * 100);
      const cardData = data.card_data;

      let transactionStatus = "pending";
      let gatewayTransId = null;
      let rawResponse = null;

      if (isSandbox) {
        // High fidelity simulation for Sandbox/Local development when credentials aren't set yet
        console.log("[processPayment] Simulating e-Rede payment in Sandbox mode.");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulates approval (almost always true, except if card ends with '0000' or similar)
        const isApproved = !cardData.cardNumber.endsWith("0000");
        transactionStatus = isApproved ? "captured" : "denied";
        gatewayTransId = "sim_" + Math.random().toString(36).substr(2, 9);
        rawResponse = {
          simulated: true,
          approved: isApproved,
          message: isApproved ? "Transação Aprovada" : "Transação Negada",
        };
      } else {
        // Real API call to e-Rede
        try {
          const authHeader = "Basic " + btoa(`${REDE_PV}:${REDE_TOKEN}`);
          const res = await fetch("https://api.userede.com.br/erede/v1/transactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
            body: JSON.stringify({
              capture: true,
              kind: "credit",
              reference: order.id,
              amount: amountCents,
              installments: cardData.installments,
              cardholderName: cardData.cardholderName,
              cardNumber: cardData.cardNumber.replace(/\s+/g, ""),
              expirationMonth: cardData.expirationMonth,
              expirationYear: cardData.expirationYear,
              securityCode: cardData.securityCode,
              softDescriptor: "CENTERFRIOS",
            }),
          });

          rawResponse = await res.json();
          if (res.ok && rawResponse.returnCode === "00") {
            transactionStatus = "captured";
            gatewayTransId = rawResponse.tid;
          } else {
            transactionStatus = "denied";
            gatewayTransId = rawResponse.tid || null;
          }
        } catch (apiError) {
          console.error("[processPayment] e-Rede API request error:", apiError);
          transactionStatus = "failed";
        }
      }

      // Update Order & Transaction in DB
      await supabaseAdmin.from("transactions").insert({
        order_id: order.id,
        gateway: "rede",
        gateway_transaction_id: gatewayTransId,
        amount: total,
        status: transactionStatus,
        raw_response: rawResponse,
      });

      if (transactionStatus === "captured") {
        await supabaseAdmin.from("orders").update({ status: "paid" }).eq("id", order.id);
        return { success: true, orderId: order.id, status: "paid" };
      } else {
        await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
        throw new Error("Transação recusada pela operadora de cartão.");
      }
    } else {
      // 4. Process PIX
      let pixQrCode = "";
      let pixCopiaCola = "";

      if (isSandbox) {
        // High fidelity Pix Simulation
        console.log("[processPayment] Simulating e-Rede PIX generation.");
        await new Promise((resolve) => setTimeout(resolve, 800));

        pixQrCode =
          "iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+5pAAAABlBMVEUAAAD///+l2Z/dAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAXklEQVRIie3BwQ3AIAwEwS+5J/fksSgN6I4iVfQ5H2BtbVtsCjP/l+Z8NlP6XqVd9fC7aG4lO/3/6kQfD06/v+Z8Ns2tzK0057MZt9jaFub+L82tbYtNYeb+7gDWG3P3j2D2jQAAAABJRU5ErkJggg==";
        pixCopiaCola = `00020101021226870014br.gov.bcb.pix2565yccozvanwyxtseayqdwv.supabase.co/pay/${order.id}5204000053039865405${total.toFixed(2)}5802BR5924Center Frios Ltda6009Maceio62070503***6304`;
      } else {
        // Real e-Rede PIX Generation API Call
        try {
          const authHeader = "Basic " + btoa(`${REDE_PV}:${REDE_TOKEN}`);
          const res = await fetch("https://api.userede.com.br/erede/v1/transactions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authHeader,
            },
            body: JSON.stringify({
              kind: "pix",
              reference: order.id,
              amount: Math.round(total * 100),
            }),
          });

          const rawResponse = await res.json();
          if (res.ok && rawResponse.pix) {
            pixQrCode = rawResponse.pix.qrCodeBase64;
            pixCopiaCola = rawResponse.pix.qrCodeString;
          } else {
            console.error("[processPayment] Pix generation failed:", rawResponse);
            throw new Error("Falha ao gerar o QR Code do PIX.");
          }
        } catch (apiError) {
          console.error("[processPayment] Pix API request error:", apiError);
          throw new Error("Erro ao conectar com a e-Rede PIX.");
        }
      }

      // Record PIX transaction in database
      await supabaseAdmin.from("transactions").insert({
        order_id: order.id,
        gateway: "rede",
        amount: total,
        status: "pending",
        pix_qr_code: pixQrCode,
        pix_copia_cola: pixCopiaCola,
      });

      return {
        success: true,
        orderId: order.id,
        status: "pending",
        pix: {
          qrCode: pixQrCode,
          copiaCola: pixCopiaCola,
        },
      };
    }
  });
