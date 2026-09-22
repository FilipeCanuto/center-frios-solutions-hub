// Eventos de e-commerce no formato GA4 para o dataLayer do GTM.
// As tags (GA4, Google Ads, Meta Pixel) são configuradas no contêiner GTM
// a partir destes eventos — o site não chama nenhuma plataforma diretamente.

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type TrackedItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_brand?: string;
  item_category?: string;
};

export function pushEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Limpa o objeto ecommerce anterior (recomendação do GA4 para o GTM).
  if ("ecommerce" in params) window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ...params });
}

export function ecommerce(value: number, items: TrackedItem[], extra: Record<string, unknown> = {}) {
  return {
    ecommerce: {
      currency: "BRL",
      value: Math.round(value * 100) / 100,
      items: items.map((i) => ({ quantity: 1, ...i })),
      ...extra,
    },
  };
}

/** Clique em WhatsApp — microconversão para Google Ads / Meta. */
export function trackWhatsappClick(placement: string) {
  pushEvent("whatsapp_click", { placement });
}

/** Garante que o `purchase` de um pedido só dispare uma vez por navegador. */
export function markPurchaseTracked(orderId: string): boolean {
  try {
    const key = `cf_purchase_${orderId}`;
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
}
