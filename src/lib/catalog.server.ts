// Authoritative server-side product price catalog.
// Never trust client-supplied prices.
import { PA7_BASE_PRICE, PA7_OPTIONAL_DISCS } from "@/data/pa7";

export type CatalogEntry = {
  slug: string;
  name: string;
  price: number;
  /** Acessórios opcionais vendidos junto (código → preço). */
  addons?: Record<string, { name: string; price: number }>;
};

const PA7_ADDONS = Object.fromEntries(
  PA7_OPTIONAL_DISCS.map((d) => [
    d.code,
    { name: `${d.group} ${d.code} (${d.desc})`, price: d.price },
  ]),
);

export const PRODUCT_CATALOG: Record<string, CatalogEntry> = {
  "processador-pa7-pro-skymsen": {
    slug: "processador-pa7-pro-skymsen",
    name: "Processador de Alimentos PA7 Pro Skymsen",
    price: PA7_BASE_PRICE,
    addons: PA7_ADDONS,
  },
  "moedor-homogeneizador-hs-98": {
    slug: "moedor-homogeneizador-hs-98",
    name: "Moedor Homogeneizador HS-98 Skymsen",
    price: 32900,
  },
};

export function getCatalogProduct(slug: string): CatalogEntry | null {
  return PRODUCT_CATALOG[slug] ?? null;
}

/** Resolve os acessórios pedidos contra o catálogo; ignora códigos desconhecidos. */
export function resolveAddons(entry: CatalogEntry, codes: string[] | undefined) {
  const unique = Array.from(new Set(codes ?? []));
  return unique
    .map((code) => (entry.addons?.[code] ? { code, ...entry.addons[code] } : null))
    .filter((a): a is { code: string; name: string; price: number } => a !== null);
}
