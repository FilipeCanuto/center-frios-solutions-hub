/**
 * Cliente compartilhado da e-Rede.
 * SERVER-ONLY (lê process.env). PAN/CVV nunca são logados nem persistidos.
 *
 * TODO (v2 pós-launch): migrar para e-Rede Zero (tokenização client-side)
 * para reduzir o escopo PCI-DSS de SAQ D para SAQ A — o servidor passa a
 * receber apenas um token de cartão de uso único, nunca o PAN/CVV cru.
 */

export const REDE_OAUTH_URL = "https://api.userede.com.br/redelabs/oauth2/token";
export const REDE_API_BASE = "https://api.userede.com.br/erede/v2";

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
  const pvRaw = process.env.REDE_PV;
  const token = process.env.REDE_TOKEN;
  // Auditoria de Secrets (nunca loga o valor, só presença/tamanho).
  console.log("[rede] env audit", {
    REDE_PV_present: !!pvRaw,
    REDE_PV_len: pvRaw ? String(pvRaw).length : 0,
    REDE_TOKEN_present: !!token,
    REDE_TOKEN_len: token ? String(token).length : 0,
  });
  if (!pvRaw || !token) {
    throw new Error(
      "Erro de Configuração de Variável de Ambiente: " +
        `REDE_PV=${pvRaw ? "ok" : "undefined"}, REDE_TOKEN=${token ? "ok" : "undefined"}. ` +
        "Configure os Secrets no Lovable Cloud antes de cobrar.",
    );
  }
  // Pág. 16 do manual v1.32: PV não pode conter zeros à esquerda
  // (sob pena de HTTP 401 "invalid_client" no OAuth2).
  const pv = String(pvRaw).replace(/^0+/, "");
  return { pv, token };
}

/**
 * Gera e cacheia token OAuth2 (client_credentials) — pág. 15-17 do manual v1.32.
 * clientId = REDE_PV (sem zeros à esquerda), clientSecret = REDE_TOKEN.
 */
let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getRedeAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.value;
  }
  const { pv, token } = getRedeCredentials();
  const basic = btoa(`${pv}:${token}`);

  const res = await fetch(REDE_OAUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
      Accept: "application/json",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }).toString(),
  });

  const json = (await res.json().catch(() => null)) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  } | null;

  if (!res.ok || !json?.access_token) {
    const msg = json?.error_description || json?.error || res.statusText;
    console.error("[rede] oauth2 failure", { httpStatus: res.status, error: msg });
    throw new Error(`[rede] Falha OAuth2 (${res.status}): ${msg}`);
  }

  cachedToken = {
    value: json.access_token,
    expiresAt: now + (json.expires_in ?? 3600) * 1000,
  };
  return json.access_token;
}

function bearerHeader(accessToken: string): string {
  return `Bearer ${accessToken}`;
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
  ipAddress?: string;
  phoneNumber?: string;
};

/** Formata CEP no padrão estrito "XXXXX-XXX" (9 chars com hífen) — pág. 43/61 do manual. */
export function formatPostalCode(raw: string | null | undefined): string {
  const digits = onlyDigits(raw).slice(0, 8);
  if (digits.length !== 8) return digits; // deixa a validação a montante reclamar
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** Remove acentos e caracteres especiais, mantendo apenas letras/números/espaços. */
function stripSpecials(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Formata telefone BR como "(XX)XXXXX-XXXX" ou "(XX)XXXX-XXXX", máx 32 chars. */
function formatBillingPhone(raw: string | null | undefined): string {
  const d = onlyDigits(raw);
  // remove DDI 55 se presente
  const local = d.startsWith("55") && d.length > 11 ? d.slice(2) : d;
  if (local.length === 11) {
    return `(${local.slice(0, 2)})${local.slice(2, 7)}-${local.slice(7)}`.slice(0, 32);
  }
  if (local.length === 10) {
    return `(${local.slice(0, 2)})${local.slice(2, 6)}-${local.slice(6)}`.slice(0, 32);
  }
  return local.slice(0, 32);
}

/** Garante IPv4 válido (≤15 chars). Faz fallback para 10.0.0.1 em IPv6/inválido. */
function ensureIPv4(raw: string | null | undefined): string {
  const fallback = "10.0.0.1";
  if (!raw) return fallback;
  const v = raw.trim();
  const m = v.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return fallback;
  if (m.slice(1).some((o) => Number(o) > 255)) return fallback;
  return v;
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
  const accessToken = await getRedeAccessToken();

  // 3DS desativado temporariamente — serviço de autenticação não contratado
  // no PV (Code 203: "Authentication service not registered for the merchant").
  // Rodando fluxo transacional ordinário sem nó `threeDSecure` nem `urls`.
  // input.threeDS / callbackBaseUrl permanecem na assinatura para reativação futura.
  void input.threeDS;
  void input.callbackBaseUrl;
  void buildThreeDSUrls;
  void stripSpecials;
  void formatPostalCode;
  void formatBillingPhone;
  void ensureIPv4;

  // Higienização do holderName: remove acentos, caracteres especiais e força maiúsculas.
  const sanitizedHolderName = input.cardholderName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z ]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ")
    .slice(0, 50);

  // Payload mínimo de venda direta — sem storageCard (Code 130) nem nós extras.
  // Apenas campos puros do Ordinary Transactional Cycle conforme manual e-Rede.
  void input.installments;
  void input.softDescriptor;
  const payload = {
    capture: true,
    kind: "credit",
    reference: input.orderId,
    amount: input.amountCents,
    cardholderName: sanitizedHolderName,
    cardNumber: onlyDigits(input.cardNumber),
    expirationMonth: onlyDigits(input.expirationMonth).padStart(2, "0"),
    expirationYear: normalizeExpYear(input.expirationYear),
    securityCode: onlyDigits(input.securityCode),
  };

  let httpStatus = 0;
  let raw: RedeRawResponse | null = null;
  let rawText = "";
  try {
    const res = await fetch(`${REDE_API_BASE}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerHeader(accessToken),
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    httpStatus = res.status;
    rawText = await res.text().catch(() => "");
    try {
      raw = rawText ? (JSON.parse(rawText) as RedeRawResponse) : null;
    } catch {
      raw = null;
    }

    // HTTP não-2xx: a Rede recusou a requisição (auth, validação, gateway).
    // Exige throw explícito com o corpo bruto para ver a verdade do servidor.
    if (!res.ok) {
      console.error("[rede] charge HTTP error", {
        orderId: input.orderId,
        httpStatus,
        rawText: rawText.slice(0, 2000),
      });
      throw new Error(
        `e-Rede HTTP ${httpStatus} em /v2/transactions — resposta crua: ${
          rawText || res.statusText || "(corpo vazio)"
        }`,
      );
    }

    const approved = raw?.returnCode === "00";
    const tid = raw?.tid ?? null;
    const returnCode = raw?.returnCode ?? null;
    const returnMessage = raw?.returnMessage ?? "Sem mensagem";
    const threeDS = raw?.threeDSecure?.url
      ? { url: raw.threeDSecure.url, paReq: raw.threeDSecure.paReq }
      : null;

    if (!approved) {
      console.error("[rede] charge denied by issuer", {
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
    console.error("[rede] charge failure", {
      orderId: input.orderId,
      name: e.name,
      message: e.message,
      httpStatus,
      rawText: rawText.slice(0, 2000),
    });
    // Propaga a exceção — sem mocks, sem falso positivo.
    throw new Error(`Falha real na e-Rede (HTTP ${httpStatus || "network"}): ${e.message}`);
  }
}

export type PixChargeResult = {
  ok: boolean;
  qrCodeBase64: string | null;
  qrCodeString: string | null;
  tid: string | null;
  returnCode: string | null;
  returnMessage: string;
  httpStatus: number;
  raw: unknown;
};

export type RedePixTransactionPayload = {
  Capture: true;
  Amount: number;
  Reference: string;
  QrCode: true;
};

export function buildPixTransactionPayload(
  orderId: string,
  amountCents: number,
  now = Date.now(),
): RedePixTransactionPayload {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error(`[rede] Valor PIX inválido em centavos: ${amountCents}`);
  }

  return {
    Capture: true,
    Amount: amountCents,
    Reference: `${orderId}-${now}`,
    QrCode: true,
  };
}

function assertNativeJsonObject(payload: unknown, label: string): asserts payload is object {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(`[rede] ${label} precisa ser um objeto JSON nativo antes do envio.`);
  }
}

export async function chargePix(input: {
  orderId: string;
  amountCents: number;
}): Promise<PixChargeResult> {
  const accessToken = await getRedeAccessToken();
  let httpStatus = 0;
  let rawText = "";

  try {
    // Contrato PIX e-Rede: payload raiz em PascalCase estrito para evitar
    // falha de desserialização .NET (Error 167). Nenhum alias camelCase,
    // nenhum wrapper e nenhuma string JSON pré-serializada.
    const payload = buildPixTransactionPayload(input.orderId, input.amountCents);
    assertNativeJsonObject(payload, "payload PIX e-Rede");

    const res = await fetch(`${REDE_API_BASE}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerHeader(accessToken),
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    httpStatus = res.status;
    rawText = await res.text().catch(() => "");
    let raw:
      | (RedeRawResponse & {
          pix?: { qrCodeBase64?: string; qrCodeString?: string };
        })
      | null = null;
    try {
      raw = rawText
        ? (JSON.parse(rawText) as RedeRawResponse & {
            pix?: { qrCodeBase64?: string; qrCodeString?: string };
          })
        : null;
    } catch {
      raw = null;
    }

    if (res.ok && raw?.pix?.qrCodeBase64 && raw?.pix?.qrCodeString) {
      return {
        ok: true,
        qrCodeBase64: raw.pix.qrCodeBase64,
        qrCodeString: raw.pix.qrCodeString,
        tid: raw.tid ?? null,
        returnCode: raw.returnCode ?? null,
        returnMessage: raw.returnMessage ?? "PIX gerado",
        httpStatus,
        raw,
      };
    }

    console.error("[rede] pix rejected", {
      orderId: input.orderId,
      httpStatus,
      returnCode: raw?.returnCode ?? null,
      returnMessage: raw?.returnMessage ?? (rawText || res.statusText),
      rawText: rawText.slice(0, 2000),
    });
    return {
      ok: false,
      qrCodeBase64: null,
      qrCodeString: null,
      tid: raw?.tid ?? null,
      returnCode: raw?.returnCode ?? null,
      returnMessage: raw?.returnMessage ?? (rawText || res.statusText),
      httpStatus,
      raw: raw ?? { rawText: rawText.slice(0, 2000) },
    };
  } catch (err) {
    const e = err as Error;
    console.error("[rede] pix network error", {
      orderId: input.orderId,
      name: e.name,
      message: e.message,
      httpStatus,
      rawText: rawText.slice(0, 2000),
    });
    return {
      ok: false,
      qrCodeBase64: null,
      qrCodeString: null,
      tid: null,
      returnCode: null,
      returnMessage: `Erro de rede: ${e.message}`,
      httpStatus,
      raw: rawText ? { rawText: rawText.slice(0, 2000) } : null,
    };
  }
}

/** Saneia a resposta bruta para persistência em banco (remove eco sensível). */
export function sanitizeRawForStorage(raw: unknown): unknown {
  return redactForLog(raw);
}
