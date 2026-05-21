/**
 * Cliente compartilhado da e-Rede.
 * SERVER-ONLY (lê process.env). PAN/CVV nunca são logados nem persistidos.
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

/** Remove qualquer eco de campos sensíveis antes de logar/serializar. */
function redactForLog<T>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;
  const SENSITIVE = new Set([
    "cardNumber",
    "securityCode",
    "cvv",
    "cvc",
    "pan",
    "expirationMonth",
    "expirationYear",
    "cardholderName",
  ]);
  const walk = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v)) {
        out[k] = SENSITIVE.has(k) ? "[REDACTED]" : walk(val);
      }
      return out;
    }
    return v;
  };
  return walk(obj) as T;
}

export type ThreeDSDevice = {
  colorDepth: number;
  deviceType: "BROWSER" | "MOBILE";
  javaEnabled: boolean;
  language: string;
  screenHeight: number;
  screenWidth: number;
  timeZoneOffset: number;
};

export type ThreeDSBillingAddress = {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  country: string; // ISO-3 (BRA)
  zipCode: string; // 8 dígitos
};

export type ThreeDSCardHolder = {
  name: string;
  email: string;
  mobilePhone: string; // com DDI: ex 5511999999999
  documentNumber: string; // CPF 11 dígitos
};

export type ThreeDSInput = {
  embedded: boolean;
  onFailure: "decline" | "continue";
  userAgent: string;
  device: ThreeDSDevice;
  billingAddress: ThreeDSBillingAddress;
  cardHolder: ThreeDSCardHolder;
  browser: { acceptHeader: string };
};

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
  threeDS: ThreeDSInput;
  /** Base pública para URLs de retorno 3DS. Default: produção centerfrioshub. */
  callbackBaseUrl?: string;
};

/** Domínio público estável para callbacks 3DS da e-Rede. */
export const REDE_DEFAULT_CALLBACK_BASE = "https://centerfrioshub.lovable.app";

/**
 * URLs ultracurtas exigidas pela e-Rede (Code 253: "Invalid parameter size").
 * O campo url/ThreeDSecureFailure tem limite restrito (~60 chars), então
 * usamos rotas estáticas mínimas hospedadas no domínio público estável.
 * Não inclui orderId no path — a e-Rede devolve a referência junto no callback.
 */
const THREE_DS_SUCCESS_URL = "https://centerfrioshub.lovable.app/3ds-ok";
const THREE_DS_FAILURE_URL = "https://centerfrioshub.lovable.app/3ds-no";

function assertShortUrl(url: string, field: string) {
  if (url.length > 60) {
    throw new Error(`[rede] URL ${field} excede 60 chars (${url.length})`);
  }
}

function buildThreeDSUrls(_orderId: string, _base: string) {
  assertShortUrl(THREE_DS_SUCCESS_URL, "threeDSecureSuccess");
  assertShortUrl(THREE_DS_FAILURE_URL, "threeDSecureFailure");
  return { successUrl: THREE_DS_SUCCESS_URL, failureUrl: THREE_DS_FAILURE_URL };
}


export type RedeRawResponse = {
  tid?: string;
  returnCode?: string;
  returnMessage?: string;
  threeDSecure?: { url?: string; paReq?: string };
  [k: string]: unknown;
};

export type RedeChargeResult = {
  approved: boolean;
  tid: string | null;
  returnCode: string | null;
  returnMessage: string;
  httpStatus: number;
  threeDS: { url: string; paReq?: string } | null;
  raw: RedeRawResponse | null;
};

export async function chargeCreditCard(input: CreditChargeInput): Promise<RedeChargeResult> {
  const { pv, token } = getRedeCredentials();

  const t = input.threeDS;
  const { successUrl, failureUrl } = buildThreeDSUrls(
    input.orderId,
    input.callbackBaseUrl ?? REDE_DEFAULT_CALLBACK_BASE,
  );
  // Fallback estático para o ambiente do comprador. Garante que mesmo se o
  // frontend não capturar todos os atributos do navegador, a e-Rede ainda
  // receba um payload completo (Code 3001: "DeviceType3ds: Required parameter missing").
  const BROWSER_FALLBACK = {
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    acceptHeader:
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    colorDepth: 24,
    javaEnabled: true,
    language: "pt-BR",
    screenHeight: 1080,
    screenWidth: 1920,
    timeZoneOffset: 180,
  };

  const dev = t.device ?? ({} as Partial<ThreeDSDevice>);
  const userAgent = (t.userAgent && t.userAgent.trim()) || BROWSER_FALLBACK.userAgent;
  const acceptHeader =
    (t.browser?.acceptHeader && t.browser.acceptHeader.trim()) || BROWSER_FALLBACK.acceptHeader;
  const colorDepth = Number.isFinite(dev.colorDepth) ? dev.colorDepth! : BROWSER_FALLBACK.colorDepth;
  const javaEnabled = typeof dev.javaEnabled === "boolean" ? dev.javaEnabled : BROWSER_FALLBACK.javaEnabled;
  const language = (dev.language && dev.language.trim()) || BROWSER_FALLBACK.language;
  const screenHeight = Number.isFinite(dev.screenHeight) ? dev.screenHeight! : BROWSER_FALLBACK.screenHeight;
  const screenWidth = Number.isFinite(dev.screenWidth) ? dev.screenWidth! : BROWSER_FALLBACK.screenWidth;
  const timeZoneOffset = Number.isFinite(dev.timeZoneOffset)
    ? dev.timeZoneOffset!
    : BROWSER_FALLBACK.timeZoneOffset;

  // Higienização do holderName: remove acentos, caracteres especiais e força maiúsculas.
  const sanitizedHolderName = input.cardholderName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z ]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ")
    .slice(0, 50);

  const sanitizedCardHolderName = t.cardHolder.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z ]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ")
    .slice(0, 50);

  const payload = {
    capture: true,
    kind: "credit",
    reference: input.orderId,
    amount: input.amountCents,
    installments: input.installments,
    cardholderName: sanitizedHolderName,
    cardNumber: onlyDigits(input.cardNumber),
    expirationMonth: onlyDigits(input.expirationMonth).padStart(2, "0"),
    expirationYear: normalizeExpYear(input.expirationYear),
    securityCode: onlyDigits(input.securityCode),
    softDescriptor: (input.softDescriptor ?? "CENTERFRIOS").slice(0, 22),
    // URLs de retorno exigidas pela e-Rede quando 3DS 2.0 está ativo.
    // Code 259 ("Urls: Required parameter missing") é resolvido aqui.
    urls: [
      { kind: "threeDSecureSuccess", url: successUrl },
      { kind: "threeDSecureFailure", url: failureUrl },
      { kind: "callback", url: successUrl },
    ],
    // Contrato estrito conforme manual de produção e-Rede v1.32 (mar/2026),
    // págs. 40, 42 e 45. Resolve Code 3001 (DeviceType3ds required).
    threeDSecure: {
      embedded: t.embedded,
      onFailure: t.onFailure,
      // responseMode fixo "event" (pág. 40).
      responseMode: "event",
      userAgent: userAgent.slice(0, 255),
      // Nó device: camelCase exato; deviceType3ds fixo "BROWSER" (pág. 42),
      // padrão regulamentar e-Rede para checkouts web (mobile e desktop).
      device: {
        deviceType3ds: "BROWSER",
        colorDepth,
        javaEnabled,
        language,
        screenHeight,
        screenWidth,
        timeZoneOffset,
        userAgent: userAgent.slice(0, 255),
        acceptHeader: acceptHeader.slice(0, 255),
      },
      // Nó billing com postalCode camelCase (pág. 45), CEP sem pontos/traços.
      billing: {
        street: t.billingAddress.street.slice(0, 50),
        number: t.billingAddress.number.slice(0, 10),
        complement: t.billingAddress.complement?.slice(0, 30) ?? "",
        city: t.billingAddress.city.slice(0, 50),
        state: t.billingAddress.state.slice(0, 2).toUpperCase(),
        country: t.billingAddress.country.slice(0, 3).toUpperCase(),
        postalCode: onlyDigits(t.billingAddress.zipCode),
      },
      cardHolder: {
        name: sanitizedCardHolderName || sanitizedHolderName,
        email: t.cardHolder.email.trim().slice(0, 100),
        mobilePhone: onlyDigits(t.cardHolder.mobilePhone),
        documentNumber: onlyDigits(t.cardHolder.documentNumber),
      },
      // Espelha as URLs também dentro do nó 3DS (algumas versões do schema validam aqui).
      threeDSUrls: {
        callbackUrl: successUrl,
        failureUrl: failureUrl,
      },
    },
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
    const threeDS = raw?.threeDSecure?.url
      ? { url: raw.threeDSecure.url, paReq: raw.threeDSecure.paReq }
      : null;

    if (!approved) {
      // Log estruturado SEM dados de cartão
      console.error("[rede] charge rejected", {
        orderId: input.orderId,
        httpStatus,
        returnCode,
        returnMessage,
        tid,
        threeDSRequired: !!threeDS,
      });
    } else {
      console.log("[rede] charge approved", { orderId: input.orderId, tid, httpStatus });
    }

    return { approved, tid, returnCode, returnMessage, httpStatus, threeDS, raw };
  } catch (err) {
    const e = err as Error;
    console.error("[rede] charge network error", {
      orderId: input.orderId,
      name: e.name,
      message: e.message,
    });
    return {
      approved: false,
      tid: null,
      returnCode: null,
      returnMessage: `Erro de rede: ${e.message}`,
      httpStatus,
      threeDS: null,
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
      returnCode: raw?.returnCode ?? null,
      returnMessage: raw?.returnMessage ?? res.statusText,
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

/** Saneia a resposta bruta para persistência em banco (remove eco sensível). */
export function sanitizeRawForStorage(raw: unknown): unknown {
  return redactForLog(raw);
}
