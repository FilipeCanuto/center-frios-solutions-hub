## Diagnóstico de imagens na página /produtos/moeder-homogeneizador-hs-98

Auditoria do que está montado hoje vs. o que existe em `src/assets/products/hs-98/`:

| Local | Imagem atual | Problema |
|---|---|---|
| Hero (produto principal + reflexo no chão) | `ambient-butchers.png` (cena de açougue com pessoas) | Foto ambiente sendo usada como **shot limpo do produto**. O reflexo "espelhado no chão" fica com pessoas de cabeça para baixo — visualmente quebrado. |
| Reflexo do chão no Hero | `ambient-butchers.png` (mesma) | Idem — não é uma silhueta limpa do equipamento. |
| Card do catálogo `/produtos` | `Hs98 (1).png` (nome técnico, sem padrão) | Não é o shot escolhido como "foto principal" da linha. |
| Thumb do checkout (CheckoutSection) | `HS98_IMAGES.main` = `ambient-butchers.png` | Mesma foto ambiente — não funciona em miniatura 64x64 (vira mancha). |
| Seção "Quatro decisões que mudam o sábado de manhã" (Highlights) | (sem imagem) | Bloco 100% texto, quebra o ritmo visual entre Manifesto e Showcase. |

A imagem correta `homogeneizador foto principal.png` já existe em `src/assets/products/hs-98/` mas não está sendo importada em lugar nenhum.

## Mudanças propostas

### 1. `src/data/hs98.ts`
- Adicionar `import heroMain from "@/assets/products/hs-98/homogeneizador foto principal.png"`.
- Em `HS98_IMAGES`: trocar `main` e `hero` para apontar para `heroMain` (mantendo `ambientButchers` disponível para a seção Showcase / Manifesto, onde a cena com pessoas faz sentido).

Resultado: o Hero passa a exibir o produto limpo, e o reflexo no chão fica coerente. Como o checkout usa `HS98_IMAGES.main`, a thumb do checkout passa a mostrar a foto principal automaticamente — sem alterar `Hs98Landing.tsx`.

### 2. `src/data/site.ts`
- Trocar o import `import hs98 from "@/assets/products/hs-98/Hs98 (1).png"` para apontar para `homogeneizador foto principal.png`.

Resultado: o card do catálogo `/produtos` que abre a landing do HS-98 passa a usar a foto principal, alinhado com hero e checkout (mesma identidade em todos os pontos de entrada).

### 3. `src/components/site/hs98/Hs98Landing.tsx` — seção `Highlights`
Adicionar uma coluna de imagem estratégica do produto ao lado dos 4 cards "Quatro decisões…", transformando o bloco em um layout de 12 colunas:

- Coluna esquerda (5/12, sticky no desktop): título + parágrafo de apoio + foto do `homogeneizador foto principal.png` em moldura arredondada com halo do accent (mesmo tratamento do hero), dando peso visual ao "porquê" das 4 decisões.
- Coluna direita (7/12): grid de 2x2 com os 4 cards (em vez do grid 1x4 atual), preservando o conteúdo e o efeito de underline accent no hover.

Mobile: stack normal (imagem em cima, depois os 4 cards um abaixo do outro).

## Fora de escopo
- Não toco em `Hs98Gallery` (já usa imagens corretas).
- Não toco em `Showcase` (`internal-clean.png` e `switch-locked.png` estão corretos para os contextos).
- Sem mudanças de cópia, preço, dados ou rotas.
