/**
 * Cotação de frete via Melhor Envio (SERVER-ONLY — lê process.env).
 * Doc: https://docs.melhorenvio.com.br/reference/calculo-de-fretes-por-produtos
 *
 * Secrets (Lovable Cloud):
 *   MELHOR_ENVIO_TOKEN     token de API (obrigatório)
 *   MELHOR_ENVIO_FROM_CEP  CEP de origem do despacho (obrigatório)
 *   MELHOR_ENVIO_ENV       "sandbox" para testes; padrão produção
 *   MELHOR_ENVIO_CONTACT   e-mail de contato no User-Agent (padrão vendas)
 */
import { isAlagoasCep, onlyDigits } from "@/lib/pricing";

export type ShippingQuote = {
  id: string;
  carrier: string;
  service: string;
  price: number;
  days: number | null;
};

// Volume do PA7 Pro embalado (dossiê: embalagem 640 × 400 × 620 mm, 29,70 kg).
const PA7_PACKAGE = { height: 64, width: 40, length: 62, weight: 29.7 };
// Discos/grades avulsos são leves; somamos uma margem por item.
const ADDON_WEIGHT_KG = 0.4;

const FREE_AL: ShippingQuote = {
  id: "gratis-al",
  carrier: "Center Frios",
  service: "Entrega grátis em Alagoas",
  price: 0,
  days: null,
};

function apiBase() {
  return process.env.MELHOR_ENVIO_ENV === "sandbox"
    ? "https://sandbox.melhorenvio.com.br"
    : "https://melhorenvio.com.br";
}

type MeService = {
  id: number;
  name: string;
  price?: string;
  custom_price?: string;
  delivery_time?: number;
  custom_delivery_time?: number;
  error?: string;
  company?: { name?: string };
};

export class ShippingUnavailableError extends Error {}

/**
 * Lista as opções de frete para o CEP. Alagoas é sempre grátis; para os
 * demais estados consulta o Melhor Envio e devolve as opções disponíveis,
 * da mais barata para a mais cara.
 */
export async function quoteShipping(input: {
  cep: string;
  insuranceValue: number;
  addonCount?: number;
}): Promise<ShippingQuote[]> {
  const to = onlyDigits(input.cep);
  if (to.length !== 8) throw new ShippingUnavailableError("CEP inválido.");
  if (isAlagoasCep(to)) return [FREE_AL];

  const token = process.env.MELHOR_ENVIO_TOKEN;
  const from = onlyDigits(process.env.MELHOR_ENVIO_FROM_CEP);
  if (!token || from.length !== 8) {
    console.error("[shipping] Melhor Envio não configurado", {
      token: !!token,
      fromCep: from.length === 8,
    });
    throw new ShippingUnavailableError("Cotação de frete indisponível no momento.");
  }

  const contact = process.env.MELHOR_ENVIO_CONTACT ?? "vendasweb01@centerfrios.com";
  const res = await fetch(`${apiBase()}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": `Center Frios Ofertas (${contact})`,
    },
    body: JSON.stringify({
      from: { postal_code: from },
      to: { postal_code: to },
      volumes: [
        {
          ...PA7_PACKAGE,
          weight: PA7_PACKAGE.weight + (input.addonCount ?? 0) * ADDON_WEIGHT_KG,
          insurance: Math.round(input.insuranceValue * 100) / 100,
        },
      ],
      options: { receipt: false, own_hand: false },
    }),
  });

  const raw = (await res.json().catch(() => null)) as MeService[] | { message?: string } | null;
  if (!res.ok || !Array.isArray(raw)) {
    console.error("[shipping] Melhor Envio error", { status: res.status, body: raw });
    throw new ShippingUnavailableError("Não foi possível calcular o frete para este CEP.");
  }

  const quotes = raw
    .filter((s) => !s.error && (s.custom_price ?? s.price))
    .map((s) => ({
      id: String(s.id),
      carrier: s.company?.name ?? "Transportadora",
      service: s.name,
      price: Math.round(Number(s.custom_price ?? s.price) * 100) / 100,
      days: s.custom_delivery_time ?? s.delivery_time ?? null,
    }))
    .filter((q) => Number.isFinite(q.price) && q.price > 0)
    .sort((a, b) => a.price - b.price);

  if (quotes.length === 0) {
    throw new ShippingUnavailableError("Nenhuma transportadora atende este CEP para este volume.");
  }
  return quotes;
}
