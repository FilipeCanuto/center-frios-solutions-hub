
# Plano — HS-98 Skymsen | Landing nível agência

## Diagnóstico (o que está errado hoje)

1. **Bug crítico de texto** — Todos os textos no `Hs98Landing.tsx` e `hs98.ts` estão com escapes Unicode literais (`\u00E7`, `\u00E3`, `\u00F3`…) renderizando como código no navegador. É a causa real do "texto misturado com código" que você viu. Precisa ser convertido para caracteres PT-BR reais (`ç`, `ã`, `ó`).
2. **Imagem principal ruim** — Está usando `Hs98 (1).png` (vista isolada técnica). Existe `homogeneizador foto principal.png` no diretório, claramente a foto editorial correta.
3. **Efeito de luz inativo** — Hoje é só um `blur-[100px]` estático atrás do produto. Sem profundidade, sem rim-light, sem reflexo de chão, sem gradiente cônico animado.
4. **Galeria fraca** — Layout 8/4 quebra no zoom (`object-contain p-12` deixa o produto pequeno), thumbnails opacos, sem lightbox, sem navegação por teclado, legenda flutuante com fundo preto cobrindo o produto.
5. **CTA genérico** — "Solicitar Proposta" / "Falar com Especialista" / "Impulsione seu PDV agora" são frases vazias. Falta gancho de dor (margem, quebra de carne, fila no PDV), prova social, urgência real e oferta clara.
6. **Cara de "IA"** — Estrutura previsível (hero + 4 cards + 2 features + galeria + specs + CTA), tipografia uniforme, paleta sem hierarquia, ausência de elementos editoriais (números grandes, citações, comparativos antes/depois, ticker de dados).

## Direção criativa (referência: agência premium B2B industrial — DJI, Leica, Hobart, Rational)

- **Tom**: editorial técnico. Frases curtas, números grandes, palavras em destaque por peso/cor, não por emoji.
- **Hierarquia**: 1 herói cinematográfico → 1 manifesto de valor (uma frase enorme) → prova em números → showcase técnico → galeria imersiva → comparativo "moedor comum vs HS-98" → ROI/payback → checkout → FAQ → CTA final ancorado em dor real.
- **Luz**: gradiente cônico atrás do produto (rim-light azul frio + key-light quente embaixo), reflexo no "chão" via `mask-image`, partículas sutis com `mix-blend-screen`.
- **Tipografia**: display tracking-tighter, números em tabular-nums, eyebrows em uppercase 0.3em.

## Mudanças por bloco

### A. Conteúdo & dados
- `src/data/hs98.ts`: reescrever todos os textos em PT-BR real (sem `\u00xx`); adicionar `HS98_PROOF` (números de impacto), `HS98_COMPARISON` (comum vs HS-98), `HS98_ROI` (payback estimado), `HS98_FAQ` (5 perguntas reais de açougue/supermercado), `HS98_TESTIMONIAL` (1 depoimento de operação), atualizar `HS98_GALLERY` priorizando as fotos editoriais (`homogeneizador foto principal.png`, fotos em ambiente, vistas técnicas).
- Trocar `HS98_IMAGES.main` para `homogeneizador foto principal.png`.

### B. Componentização (decompor o monólito)
Dividir `Hs98Landing.tsx` em componentes em `src/components/site/hs98/`:
- `Hero.tsx` — herói com luz cinematográfica real
- `ProofBar.tsx` — ticker horizontal com 4 métricas
- `Manifesto.tsx` — frase grande de posicionamento
- `Showcase.tsx` — features alternadas (substitui o bloco atual)
- `Comparison.tsx` — moedor comum vs HS-98 (tabela visual lado a lado)
- `Gallery.tsx` — nova galeria com lightbox, navegação por teclado, zoom on hover
- `RoiBlock.tsx` — calculadora visual de payback
- `Specs.tsx` — grid de specs (mantém estrutura, melhora densidade)
- `Faq.tsx` — accordion shadcn
- `FinalCta.tsx` — CTA persuasivo com dor + oferta + microcopy de confiança

### C. Efeito de luz cinematográfico (no Hero)
- Gradiente cônico animado atrás do produto (`background: conic-gradient(...)`, `animation: spin 20s linear infinite`)
- Rim-light: `radial-gradient` azul frio no topo + `radial-gradient` âmbar quente embaixo
- Reflexo do produto no chão via `transform: scaleY(-1)` + `mask-image: linear-gradient(to bottom, black, transparent)`
- Partículas sutis (CSS-only, 6 divs com `animation: float`)
- Shadow do produto reagindo ao mouse (parallax leve com `useParallax`)

### D. Nova galeria
- Layout principal: 1 imagem grande à esquerda (60%) + grid 2x3 de thumbnails à direita (40%)
- Click → abre lightbox fullscreen com navegação ←/→ e ESC
- Hover na thumb → preview cresce 1.05, brilho aumenta
- Legenda discreta no canto inferior esquerdo, fora da imagem (não sobreposta)
- Padding reduzido (`p-6` em vez de `p-12`) para o produto preencher

### E. CTAs persuasivos (substituir os atuais)
- **Hero CTA primário**: "Calcular meu ROI em 30 segundos" (abre RoiBlock) + secundário: "Quero uma demonstração no meu PDV"
- **Sticky bar de conversão**: aparece após scroll do hero, com preço + "Garanta o seu — entrega em 7 dias úteis"
- **CTA final**: headline com dor real ("Cada quilo mal apresentado é margem indo embora") + bullets de garantia (entrega, NF-e, assistência, garantia 12m) + botão "Falar agora com um especialista da Center Frios" + telefone clicável + horário de atendimento
- **Microcopy de confiança** sob cada CTA: "Resposta em até 2h úteis · Sem compromisso · Atendimento técnico, não comercial"

### F. Toques editoriais anti-IA
- Números grandes em `tabular-nums` com unidade pequena ao lado (ex.: **900** kg/h)
- 1 citação técnica destacada do tipo manual ("Sistema patenteado de homogeneização contínua — Skymsen")
- Quebra de grid intencional em 1 seção (assimetria 7/5 em vez de 6/6)
- Eyebrows numerados (`01 — Produtividade`, `02 — Segurança`, `03 — Apresentação`)

## Fora de escopo (não mexer agora)
- PA7 PRO (já entregue)
- Outras páginas, header, footer
- Integração real de pagamento (mantém `CheckoutSection` mock)
- Novas fotos geradas por IA — usaremos só as que já estão em `src/assets/products/hs-98/`

## Critérios de aceitação
- Zero ocorrências de `\u00` no DOM renderizado da página HS-98
- LCP ≤ 2.5s no preview, sem warnings de console
- Imagem principal = `homogeneizador foto principal.png`
- Gallery navegável por teclado (←, →, ESC) e com lightbox funcional
- Pelo menos 3 CTAs distintos, todos ancorados em dor/benefício específico (não genéricos)
- Build verde

## Como vou executar (multi-agente, conforme maestro)
1. **implementer** — corrige `hs98.ts` (textos PT-BR + novos blocos de dados) e troca imagem principal
2. **ui-designer** — quebra `Hs98Landing.tsx` em componentes, implementa Hero com luz cinematográfica, nova Gallery, Comparison, RoiBlock, Manifesto e FinalCta
3. **qa-guardian** — verifica build, console, LCP, render PT-BR e teclado na galeria
4. Relatório final com lista de arquivos alterados

Posso começar?
