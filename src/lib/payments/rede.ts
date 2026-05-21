/**
 * Cliente compartilhado da e-Rede.
 * Centraliza endpoint, autenticação, sanitização e logging.
 * SERVER-ONLY (lê process.env).
 */

export const REDE_API_BASE = "https://api.userede.com.br/erede/v1";

export function onlyDigits(v: string | null | undefined): string {
  return (v ?? "").replace(/\D+/g, "");
}

export function normalizeExpYear(year: string): string {
  const d = onlyDigits(year);
  return d.length === 2 ? `20${d}` : d;
}

export function toCents(amountBRL: number): number {
  if (!Number.isFinite(amountBRL) || amountBRL <= 0) {
    throw new Error(`Valor inválido para cobrança: ${amountBRL}`);
  }
  return Math.round(amountBRL * 100);
}

export function getRedeCredentials(): { pv: string; token: string } {
  const pv = process.env.REDE_PV;
  const token = process.env.REDE_TOKEN;
  if (!pv || !token) {
    throw new Error(
      "Credenciais e-Rede ausentes (REDE_PV/REDE_TOKEN). Configure as secrets antes de cobrar.",
    );
  }
  return { pv, token };
}

function authHeader(pv: string, token: string): string {
  return "Basic " + btoa(`${pv}:${token}`);
}

export type CreditChargeInput = {
  orderId: string;
  amountCents: number;
  installments: number;
  cardNumber: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  softDescriptor?: string;
};

export type RedeRawResponse = {
  tid?: string;
  returnCode?: string;
  returnMessage?: string;
  [k: string]: unknown;
};

export type RedeChargeResult = {
  approved: boolean;
  tid: string | null;
  returnCode: string | null;
  returnMessage: string;
  httpStatus: number;
  raw: RedeRawResponse | null;
};

/**
 * Cobra no crédito via e-Rede com logging estruturado.
 * Nunca lança em erro de gateway — devolve approved=false com diagnóstico.
 */
export async function chargeCreditCard(input: CreditChargeInput): Promise<RedeChargeResult> {
  const { pv, token } = getRedeCredentials();

  const payload = {
    capture: true,
    kind: "credit",
    reference: input.orderId,
    amount: input.amountCents, // inteiro em centavos
    installments: input.installments,
    cardholderName: input.cardholderName.trim().slice(0, 50),
    cardNumber: onlyDigits(input.cardNumber),
    expirationMonth: onlyDigits(input.expirationMonth).padStart(2, "0"),
    expirationYear: normalizeExpYear(input.expirationYear),
    securityCode: onlyDigits(input.securityCode),
    softDescriptor: (input.softDescriptor ?? "CENTERFRIOS").slice(0, 22),
  };

  let httpStatus = 0;
  let raw: RedeRawResponse | null = null;
  try {
    const res = await fetch(`${REDE_API_BASE}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(pv, token),
      },
      body: JSON.stringify(payload),
    });
    httpStatus = res.status;
    raw = (await res.json().catch(() => null)) as RedeRawResponse | null;

    const approved = res.ok && raw?.returnCode === "00";
    const tid = raw?.tid ?? null;
    const returnCode = raw?.returnCode ?? null;
    const returnMessage = raw?.returnMessage ?? (res.ok ? "Sem mensagem" : res.statusText);

    if (!approved) {
      console.error("[rede] charge rejected", {
        orderId: input.orderId,
        httpStatus,
        returnCode,
        returnMessage,
        tid,
        raw,
      });
    } else {
      console.log("[rede] charge approved", { orderId: input.orderId, tid, httpStatus });
    }

    return { approved, tid, returnCode, returnMessage, httpStatus, raw };
  } catch (err) {
    const e = err as Error;
    console.error("[rede] charge network error", {
      orderId: input.orderId,
      name: e.name,
      message: e.message,
      stack: e.stack,
    });
    return {
      approved: false,
      tid: null,
      returnCode: null,
      returnMessage: `Erro de rede: ${e.message}`,
      httpStatus,
      raw,
    };
  }
}

export type PixChargeResult = {
  ok: boolean;
  qrCodeBase64: string | null;
  qrCodeString: string | null;
  tid: string | null;
  returnCode: string | null;
  returnMessage: string;
  raw: unknown;
};

export async function chargePix(input: {
  orderId: string;
  amountCents: number;
}): Promise<PixChargeResult> {
  const { pv, token } = getRedeCredentials();

  try {
    const res = await fetch(`${REDE_API_BASE}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader(pv, token),
      },
      body: JSON.stringify({
        kind: "pix",
        reference: input.orderId,
        amount: input.amountCents,
      }),
    });
    const raw = (await res.json().catch(() => null)) as
      | (RedeRawResponse & {
          pix?: { qrCodeBase64?: string; qrCodeString?: string };
        })
      | null;

    if (res.ok && raw?.pix?.qrCodeBase64 && raw?.pix?.qrCodeString) {
      return {
        ok: true,
        qrCodeBase64: raw.pix.qrCodeBase64,
        qrCodeString: raw.pix.qrCodeString,
        tid: raw.tid ?? null,
        returnCode: raw.returnCode ?? null,
        returnMessage: raw.returnMessage ?? "PIX gerado",
        raw,
      };
    }

    console.error("[rede] pix rejected", {
      orderId: input.orderId,
      httpStatus: res.status,
      raw,
    });
    return {
      ok: false,
      qrCodeBase64: null,
      qrCodeString: null,
      tid: raw?.tid ?? null,
      returnCode: raw?.returnCode ?? null,
      returnMessage: raw?.returnMessage ?? res.statusText,
      raw,
    };
  } catch (err) {
    const e = err as Error;
    console.error("[rede] pix network error", {
      orderId: input.orderId,
      name: e.name,
      message: e.message,
    });
    return {
      ok: false,
      qrCodeBase64: null,
      qrCodeString: null,
      tid: null,
      returnCode: null,
      returnMessage: `Erro de rede: ${e.message}`,
      raw: null,
    };
  }
}
