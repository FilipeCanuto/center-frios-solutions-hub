# Plano — Site Center Frios

Direção visual escolhida: **Technical Premium (dark)**. Fundo zinc-950, tipografia Inter, azul (#2563eb) e amarelo (#fbbf24) como acentos, grid técnico sutil no hero.

## 1. Tokens & estilo base
- Atualizar `src/styles.css`: tema dark por padrão, `--background` zinc-950, `--foreground` zinc-100, `--primary` azul Center Frios, `--accent` amarelo, raio menor (0.75rem), classe utilitária `.tech-grid`.
- Importar Inter via tag `<link>` no `__root.tsx` (head).
- Aplicar classe `dark` no `<html>` para já nascer no tema escuro.

## 2. Estrutura de rotas (TanStack file-based)
```
src/routes/
  __root.tsx              (head global + Header/Footer + Toaster)
  index.tsx               (Home)
  produtos.tsx            (hub catálogo + cards)
  produtos.$slug.tsx      (landing detalhada por produto)
  segmentos.tsx           (hub de segmentos)
  segmentos.$slug.tsx     (página por segmento)
  solucoes.tsx
  contato.tsx             (form + dados + WhatsApp)
  blog.tsx                ("Em breve")
```
Cada rota com `head()` próprio (title, description, og:title, og:description) em PT-BR e palavras-chave do briefing.

## 3. Componentes compartilhados
- `components/site/Header.tsx` — nav sticky com logo CENTER**FRIOS**, links (Produtos, Segmentos, Soluções, Blog, Contato), CTA "Solicite Orçamento" (abre dialog do form).
- `components/site/Footer.tsx` — contato (82 3223-2497, marketing@centerfrios.com), Instagram @centerfriosoficial, links rápidos.
- `components/site/QuoteDialog.tsx` — dialog shadcn com formulário (nome, empresa, e-mail, telefone, segmento, produto interesse, mensagem) + Zod + envia para server fn.
- `components/site/WhatsAppButton.tsx` — botão flutuante fixo bottom-right com link `https://wa.me/558232232497`.
- `components/site/SectionHeading.tsx`, `ProductCard.tsx`, `SegmentCard.tsx`, `SpecGrid.tsx`.

## 4. Home (`/`)
Seções na ordem do protótipo escolhido:
1. Hero centralizado com badge amarelo "Engenharia de Refrigeração Profissional", H1, subtítulo, CTAs ("Catálogo Técnico" → /produtos, "Solicite Orçamento" → abre dialog) + imagem hero com overlays de specs.
2. Faixa de segmentos (5 cards quadrados com imagem ao fundo).
3. Produtos em destaque (3 cards com SpecGrid 2x2: PA7 Pro, AMP40, Tudo Brisa).
4. Autoridade — 3 stats (anos de mercado, clientes, cobertura).
5. CTA azul "Pronto para elevar seu padrão operacional?" (orçamento + WhatsApp).

## 5. Catálogo de produtos
**3 detalhados** com landing dedicada:
- `processador-pa7-pro-skymsen`
- `abridora-de-massa-amp40`
- `climatizador-tudo-brisa`

**6 placeholders** apenas listados em `/produtos` com card e página simples "em breve detalhamento + CTA orçamento": Forno de Lastro, Câmara Fria Modular, Balcão Refrigerado, Fritadeira Industrial, Liquidificador Industrial, Masseira Espiral.

Dados em `src/data/products.ts` (array tipado). Página `/produtos/$slug` consome do array; 404 via `notFoundComponent` se slug não existir.

Estrutura da landing de produto: hero com imagem + título + categoria, descrição persuasiva, SpecGrid de características técnicas, seção de aplicações/casos de uso, bloco de normas sanitárias, CTA "Solicite Orçamento".

## 6. Segmentos
5 segmentos com página própria: supermercados, bares-restaurantes, redes-franquias, cozinhas-industriais, hoteis. Cada uma: hero do segmento, lista de produtos recomendados (filtra do array por `segments`), benefícios específicos, CTA consulta personalizada.

## 7. Imagens
Gerar via `imagegen` (fast) e salvar em `src/assets/`:
- 1 hero principal (equipamento premium escuro)
- 3 produtos em destaque
- 5 segmentos
- 3 imagens auxiliares (autoridade/aplicações)

≈12 imagens. Importadas como ES6.

## 8. Backend (Lovable Cloud)
Habilitar Cloud. Migration cria tabela `quote_leads`:
```
id uuid pk default gen_random_uuid()
created_at timestamptz default now()
name text not null
company text
email text not null
phone text not null
segment text
product_interest text
message text
source text  -- página de origem
```
RLS: ativar; policy só de **INSERT público** (anônimo permitido), sem SELECT público. Admin pode ler depois via dashboard do Cloud.

Server function `submitQuote` em `src/lib/leads.functions.ts`:
- `inputValidator` com Zod (trim, email, telefone obrigatório, max lengths).
- `handler` insere via cliente Supabase server.
- Retorna `{ ok: true }`.

Form chama via `useServerFn`, mostra toast de sucesso/erro (sonner já existe).

## 9. SEO & técnico
- Meta tags pt-BR em todas as rotas com palavras-chave: "equipamentos para gastronomia profissional", "refrigeração comercial", "alta performance".
- `<html lang="pt-BR">`.
- Imagens com `alt` descritivo e `loading="lazy"` (exceto hero).
- Mobile-first: classes responsivas Tailwind, breakpoints `md`/`lg`.
- H1 único por página, hierarquia semântica.

## 10. Detalhes técnicos importantes
- Não criar entry-client/server, manter shell atual em `__root.tsx`.
- `src/routeTree.gen.ts` é auto-gerado — não editar.
- Server fn em `src/lib/leads.functions.ts` (client-safe path), só com declarações de server fn.
- Toaster do sonner adicionado em `RootComponent`.
- WhatsApp button visível em todas as páginas (renderizado no `__root`).

## Entregas finais
- Home, Produtos (hub + 3 detalhadas + 6 cards placeholder), Segmentos (hub + 5), Soluções, Contato, Blog (em breve).
- Formulário funcional persistindo leads no Cloud.
- Tema dark Technical Premium aplicado.
- 12 imagens geradas.
- SEO básico em todas as rotas.
