import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { rateLimit, rateLimitDb } from "@/lib/rate-limit.server";

const QuoteSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("E-mail inválido").max(255),
  phone: z.string().trim().min(8, "Telefone inválido").max(40),
  segment: z.string().trim().max(60).optional().or(z.literal("")),
  product_interest: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.string().trim().max(120).optional().or(z.literal("")),
  // Honeypot — bots fill hidden fields; humans don't.
  website: z.string().max(0).optional().or(z.literal("")),
});

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => QuoteSchema.parse(input))
  .handler(async ({ data }) => {
    // Honeypot tripped — silently succeed to avoid signaling bots.
    if (data.website && data.website.length > 0) {
      return { ok: true };
    }

    // Fast in-memory pre-check (per-isolate), then durable DB-backed check.
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const ipFast = rateLimit(`quote:ip:${ip}`, { limit: 8, windowMs: 60_000 });
    if (!ipFast.ok) {
      throw new Error("Muitas solicitações. Aguarde um minuto e tente novamente.");
    }
    const ipDb = await rateLimitDb(`quote:ip:${ip}`, 12, 60);
    if (!ipDb.ok) {
      throw new Error("Muitas solicitações. Aguarde um minuto e tente novamente.");
    }
    const emailKey = `quote:email:${data.email.toLowerCase()}`;
    const emailFast = rateLimit(emailKey, { limit: 5, windowMs: 5 * 60_000 });
    if (!emailFast.ok) {
      throw new Error("Você já enviou várias solicitações. Aguarde alguns minutos.");
    }
    const emailDb = await rateLimitDb(emailKey, 5, 5 * 60);
    if (!emailDb.ok) {
      throw new Error("Você já enviou várias solicitações. Aguarde alguns minutos.");
    }

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
