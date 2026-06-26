// Authoritative server-side product price catalog.
// Never trust client-supplied prices.

export type CatalogEntry = {
  slug: string;
  name: string;
  price: number;
};

export const PRODUCT_CATALOG: Record<string, CatalogEntry> = {
  "processador-pa7-pro-skymsen": {
    slug: "processador-pa7-pro-skymsen",
    name: "Processador de Alimentos PA7 Pro Skymsen",
    // TEMP QA: preço reduzido para validação end-to-end do gateway.
    // Restaurar para 6299 após o teste de cartão.
    price: 20,
  },
  "moedor-homogeneizador-hs-98": {
    slug: "moedor-homogeneizador-hs-98",
    name: "Moedor Homogeneizador HS-98 Skymsen",
    price: 32900,
  },
};

// Fixed shipping until CEP-based calculation is implemented.
export const FIXED_SHIPPING_PRICE = 89.9;

export function getCatalogProduct(slug: string): CatalogEntry | null {
  return PRODUCT_CATALOG[slug] ?? null;
}
