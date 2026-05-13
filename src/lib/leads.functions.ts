import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const QuoteSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("E-mail inválido").max(255),
  phone: z.string().trim().min(8, "Telefone inválido").max(40),
  segment: z.string().trim().max(60).optional().or(z.literal("")),
  product_interest: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.string().trim().max(120).optional().or(z.literal("")),
});

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => QuoteSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("quote_leads").insert({
      name: data.name,
      company: data.company || null,
      email: data.email,
      phone: data.phone,
      segment: data.segment || null,
      product_interest: data.product_interest || null,
      message: data.message || null,
      source: data.source || null,
    });

    if (error) {
      console.error("[submitQuote] insert error:", error);
      throw new Error("Não foi possível enviar seu pedido. Tente novamente.");
    }

    return { ok: true };
  });
