## Objetivo

Manter `ofertas.centerfrios.com` no ar, mas com **acesso externo liberado apenas** para:

- `/produtos/processador-pa7-pro-skymsen`
- `/produtos/moeder-homogeneizador-hs-98 (editar para: /produtos/moedor-homogeneizador-hs-98)`

Qualquer outra rota (Home, catálogo, segmentos, contato, blog, etc.), inclusive ao clicar na logo, mostra uma tela de **"Em breve"** em vez do conteúdo real — sem precisar tirar o site do ar nem mexer no domínio.

Você (admin) continua conseguindo navegar normalmente em todas as páginas para editar.

## Abordagem recomendada

Criar um **gate de visibilidade no `__root.tsx**` com uma allowlist de rotas públicas + um "modo preview" para você.

### Como funciona

1. **Allowlist de rotas públicas** (hardcoded no código):
  ```
   /produtos/processador-pa7-pro-skymsen
   /produtos/moeder-homogeneizador-hs-98
  ```
   Quando quiser liberar mais alguma página, eu só adiciono à lista.
2. **Visitante externo** em qualquer rota fora da allowlist (inclusive `/`, clicar na logo, `/produtos`, `/contato`, etc.) → vê uma página **"Site em construção — em breve"** com:
  - Logo Center Frios
  - Mensagem curta
  - 2 botões: "Ver PA7 Pro" e "Ver HS-98"
  - Link de WhatsApp
3. **Você (admin)** acessa `/` (ou qualquer rota) com `?preview=<chave>` uma única vez — isso grava um cookie/`localStorage` (`cf_preview=1`) e libera tudo no seu navegador permanentemente, até você limpar. Não interfere em SEO porque o gate roda no cliente após a hidratação.
4. **SEO / indexação**:
  - `robots.txt` passa a permitir só as duas páginas liberadas (`Disallow: /` + `Allow` específico para PA7 e HS-98).
  - `sitemap.xml` (se existir, ou criamos) lista apenas as duas URLs.
  - As duas páginas-alvo mantêm `head()` com title/description próprios (já têm).

### Por que não usar autenticação / "private publish"

- "Private publish" no Lovable exigiria login Lovable para qualquer visitante — derrubaria também o acesso público às páginas PA7 e HS-98, que é justamente o que você quer manter aberto.
- Auth real (Supabase) seria exagero para um gate temporário de visibilidade.

## Detalhes técnicos

Arquivos afetados:

- `**src/routes/__root.tsx**` — adicionar componente `VisibilityGate` que:
  - lê `useLocation().pathname`
  - checa allowlist
  - checa `localStorage.getItem('cf_preview') === '1'` (e seta a partir de `?preview=...`)
  - se bloqueado, renderiza `<ComingSoon />` em vez do `<Outlet />`
- `**src/components/site/ComingSoon.tsx**` (novo) — tela "em breve" com logo + 2 CTAs (PA7 / HS-98) + WhatsApp, usando os tokens do design system.
- `**src/components/site/Header.tsx**` — logo continua linkando para `/`, mas no modo bloqueado o `__root` substitui o conteúdo pela `ComingSoon`, então clicar na logo cai naturalmente nela. (Sem mexer no Header.)
- `**public/robots.txt**` — restringir indexação a `/produtos/processador-pa7-pro-skymsen` e `/produtos/moeder-homogeneizador-hs-98`.
- `**src/routes/sitemap[.]xml.ts**` (novo) — sitemap só com as duas URLs apontando para `https://ofertas.centerfrios.com`.

### Chave de preview

Vou gerar uma chave aleatória (ex.: `cf-2026-xyz`). Você abre uma vez:

```
https://ofertas.centerfrios.com/?preview=cf-2026-xyz
```

A partir daí, seu navegador vê o site inteiro. Para sair do modo preview: `?preview=off`.

## Fluxo para liberar páginas no futuro

Você me diz "libera a Home" ou "libera /contato" → eu adiciono o caminho na allowlist e atualizo `robots.txt` + sitemap. Sem deploy manual; só republicar.

## Confirmações antes de implementar

1. Confirma a allowlist inicial exatamente como acima (só PA7 e HS-98)?
2. OK usar um `?preview=<chave>` + `localStorage` como porta dos fundos (sem login)? Ou prefere que eu sempre te peça pra trocar a chave manualmente quando quiser revogar?
3. A tela "Em breve" pode mostrar os dois CTAs (PA7 e HS-98) ou você prefere uma tela neutra só com "em breve" + WhatsApp?  
  
  
(Lembre-se que, o usuário precisa navegar livremente dentro da página do PA7 PRO e do HS-98)