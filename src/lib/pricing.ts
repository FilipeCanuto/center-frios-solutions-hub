// Regras de preço compartilhadas entre a landing, o checkout (cliente) e
// o servidor. O servidor continua sendo a fonte de verdade da cobrança,
// mas usa exatamente estas funções — assim o valor anunciado é o cobrado.

export const PIX_DISCOUNT_RATE = 0.05;
export const MAX_INSTALLMENTS = 12;

// Frete fixo fora de Alagoas até existir cálculo por CEP.
export const FIXED_SHIPPING_PRICE = 89.9;

export type PaymentMethod = "pix" | "credit_card";

const round2 = (n: number) => Math.round(n * 100) / 100;

export function onlyDigits(v: string | null | undefined): string {
  return (v ?? "").replace(/\D+/g, "");
}

/** CEP de Alagoas (57xxx-xxx) tem frete grátis. */
export function isAlagoasCep(cep: string | null | undefined): boolean {
  return onlyDigits(cep).startsWith("57");
}

export function shippingFor(cep: string | null | undefined): number {
  return isAlagoasCep(cep) ? 0 : FIXED_SHIPPING_PRICE;
}

export function pixPrice(amount: number): number {
  return round2(amount * (1 - PIX_DISCOUNT_RATE));
}

export function pixSavings(amount: number): number {
  return round2(amount - pixPrice(amount));
}

export function installmentValue(amount: number, count = MAX_INSTALLMENTS): number {
  return round2(amount / count);
}

export type OrderTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

/** Totais do pedido: desconto PIX incide sobre os itens, não sobre o frete. */
export function computeTotals(
  subtotal: number,
  method: PaymentMethod,
  cep: string | null | undefined,
): OrderTotals {
  const discount = method === "pix" ? pixSavings(subtotal) : 0;
  const shipping = shippingFor(cep);
  return {
    subtotal: round2(subtotal),
    discount,
    shipping,
    total: round2(subtotal - discount + shipping),
  };
}

export function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
