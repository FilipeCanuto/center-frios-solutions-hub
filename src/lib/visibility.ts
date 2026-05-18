/**
 * Allowlist de rotas públicas enquanto o site segue em construção.
 * Tudo o que NÃO estiver listado aqui exibe a tela <ComingSoon /> para
 * visitantes externos. Admins liberam o site inteiro no próprio navegador
 * acessando qualquer URL com ?preview=<PREVIEW_KEY>.
 */
export const PUBLIC_ROUTES: ReadonlyArray<string> = [
  "/produtos/processador-pa7-pro-skymsen",
  "/produtos/moedor-homogeneizador-hs-98",
];

/** Chave usada para liberar o modo preview via ?preview=<key>. */
export const PREVIEW_KEY = "cf-2026-bastidores";

/** Nome da flag persistida em localStorage. */
export const PREVIEW_STORAGE_KEY = "cf_preview";

export function isPublicPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return PUBLIC_ROUTES.some((route) => {
    const r = route.replace(/\/+$/, "") || "/";
    return normalized === r;
  });
}
