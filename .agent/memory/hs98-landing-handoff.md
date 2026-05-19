# Handoff — HS-98 Landing (Hero + Vídeos Tabuleiro)

## Objetivo atual

Ajustar a seção HS-98 em `/produtos/moeder-homogeneizador-hs-98`:

1. corrigir robustez do Hero (imagem principal),
2. adicionar seção de vídeos/depoimentos do evento da Tabuleiro.

## Estado do que já foi feito (até agora)

- `Hero` usa `HS98_IMAGES.main` em `src/components/site/hs98/Hs98Landing.tsx`.
- `HS98_IMAGES.main` vem de `src/data/hs98.ts` apontando atualmente para:
  - `@/assets/products/hs-98/homogeneizador foto principal.png`
- Existe imagem alternativa no repositório: `src/assets/products/hs-98/hero.png` (nome sem espaço, mais estável).
- `src/data/site.ts` também importa `hs98` com o nome com espaço para card/lista de produto.
- Não existe seção de vídeo/depimento no componente HS-98 ainda.
- Não há `onError`/fallback de imagem no `motion.img` do Hero.
- Página rota correta: `produtos.$slug.tsx` para slug `moeder-homogeneizador-hs-98`.

## Próximos passos definidos

1. Em `src/data/hs98.ts`, migrar `HS98_IMAGES.main` para `hero.png` (e manter fallback secundário se necessário).
2. Em `src/components/site/hs98/Hs98Landing.tsx`, adicionar fallback no Hero `motion.img` para evitar imagem quebrada.
3. Criar `src/components/site/hs98/Hs98TabuleiroSection.tsx` com cards de vídeos (`iframe`).
4. Adicionar dados em `src/data/hs98.ts`:
   - novo export (ex.: `HS98_TABULEIRO_MEDIA`) com `title`, `speaker`, `role`, `embedUrl`, `poster`.
5. Inserir a seção no `Hs98Landing` entre `Comparison` e `Hs98Gallery`.
6. Rodar validação: `npm run build` + `npm run lint`.

## Arquivos-alvo

- `src/data/hs98.ts`
- `src/components/site/hs98/Hs98Landing.tsx`
- `src/components/site/hs98/Hs98TabuleiroSection.tsx` (novo)

## Observações

- Ordem de rota/slug preservada: `moeder-homogeneizador-hs-98` (sem alterar links existentes).
- Prioridade: correção mínima + adição de valor no ponto certo da página.
