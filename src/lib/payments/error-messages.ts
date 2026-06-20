/**
 * Tradução de erros e-Rede → mensagens humanizadas PT-BR.
 * Códigos de retorno extraídos do Anexo A do manual e-Rede v1.32.
 */

export type ErrorCategory =
  | "retry"
  | "other_card"
  | "use_pix"
  | "invalid_input"
  | "temporary"
  | "rate_limit"
  | "fatal";

export type HumanizedError = {
  title: string;
  message: string;
  category: ErrorCategory;
};

export type RedeErrorPayload = {
  kind?: "rede_declined" | "pix_failed" | "rate_limit" | string;
  code?: string | null;
  message?: string | null;
  http?: number | null;
};

const MAP: Record<string, HumanizedError> = {
  "51": {
    title: "Limite insuficiente",
    message:
      "Seu cartão não tem limite suficiente. Tente outro cartão, mais parcelas ou pague no PIX com 5% de desconto.",
    category: "use_pix",
  },
  "54": {
    title: "Cartão vencido",
    message: "Cartão vencido. Verifique a data de validade e tente novamente.",
    category: "invalid_input",
  },
  "57": {
    title: "Operação não permitida",
    message:
      "Seu cartão não permite compras online. Contate o emissor ou tente outro cartão.",
    category: "other_card",
  },
  "62": {
    title: "Operação não permitida",
    message:
      "Seu cartão não permite este tipo de compra. Contate o emissor ou tente outro cartão.",
    category: "other_card",
  },
  "78": {
    title: "Cartão bloqueado",
    message: "Cartão bloqueado pelo emissor. Tente outro cartão ou use PIX.",
    category: "other_card",
  },
  "83": {
    title: "Cartão bloqueado",
    message: "Cartão bloqueado pelo emissor. Tente outro cartão ou use PIX.",
    category: "other_card",
  },
  "14": {
    title: "Cartão inválido",
    message: "Número do cartão inválido. Confira os dígitos e tente novamente.",
    category: "invalid_input",
  },
  "56": {
    title: "Cartão inválido",
    message: "Número do cartão inválido. Confira os dígitos e tente novamente.",
    category: "invalid_input",
  },
  "82": {
    title: "CVV incorreto",
    message: "Código de segurança (CVV) incorreto. Confira o verso do cartão.",
    category: "invalid_input",
  },
  "91": {
    title: "Banco indisponível",
    message:
      "Banco emissor temporariamente indisponível. Tente novamente em 1 minuto ou use PIX.",
    category: "temporary",
  },
  "96": {
    title: "Banco indisponível",
    message:
      "Banco emissor temporariamente indisponível. Tente novamente em 1 minuto ou use PIX.",
    category: "temporary",
  },
  "05": {
    title: "Pagamento não autorizado",
    message:
      "Pagamento não autorizado pelo emissor. Tente outro cartão ou use PIX (5% off).",
    category: "use_pix",
  },
  "30": {
    title: "Pagamento não autorizado",
    message:
      "Pagamento não autorizado pelo emissor. Tente outro cartão ou use PIX (5% off).",
    category: "use_pix",
  },
};

const GENERIC_DECLINE: HumanizedError = {
  title: "Pagamento não autorizado",
  message:
    "Não conseguimos autorizar este pagamento. Tente outro cartão ou pague no PIX com 5% de desconto.",
  category: "use_pix",
};

const NETWORK: HumanizedError = {
  title: "Conexão instável",
  message:
    "Conexão instável com o processador. Verifique sua internet e tente novamente.",
  category: "temporary",
};

const RATE_LIMIT: HumanizedError = {
  title: "Muitas tentativas",
  message:
    "Muitas tentativas em sequência. Aguarde 1 minuto e tente novamente.",
  category: "rate_limit",
};

const PIX_FAILED: HumanizedError = {
  title: "Falha ao gerar PIX",
  message:
    "Não conseguimos gerar o QR Code agora. Tente novamente em instantes.",
  category: "temporary",
};

export function parseErrorPayload(raw: string): RedeErrorPayload | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as RedeErrorPayload;
    }
  } catch {
    // not JSON
  }
  return null;
}

export function humanizeRedeError(input: {
  raw?: string;
  payload?: RedeErrorPayload | null;
}): HumanizedError {
  const payload = input.payload ?? (input.raw ? parseErrorPayload(input.raw) : null);

  if (!payload) {
    // Fallback genérico — mensagem crua não é exibida.
    return GENERIC_DECLINE;
  }

  if (payload.kind === "rate_limit") return RATE_LIMIT;
  if (payload.kind === "pix_failed") return PIX_FAILED;

  // Erros internos da Rede que não devem chegar ao usuário com detalhe.
  if (payload.code === "203" || payload.code === "253") {
    return GENERIC_DECLINE;
  }

  if (payload.code && MAP[payload.code]) {
    return MAP[payload.code];
  }

  // HTTP/network sem código de retorno → tratar como temporário.
  if (!payload.code && payload.http && payload.http >= 500) {
    return NETWORK;
  }

  return GENERIC_DECLINE;
}
