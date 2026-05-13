## Plano: Elevar página HS-98 (hero, galeria, copy, spotlight)

### Objetivo
Corrigir falhas de imagens, eliminar a "cara de IA", entregar uma galeria horizontal profissional com slides/hover, copy estilo hard-copy moderado e um efeito de spotlight realmente perceptível.

---

### 1. Reorganizar imagens (causa raiz dos erros)

Os arquivos atuais têm **espaços e parênteses** nos nomes (ex.: `Hs98 (6) vista superior completa.png`), o que quebra `<img src>` no build de produção e em SSR/edge. Vou copiar os 10 uploads novos para nomes limpos e padronizados:

```
src/assets/products/hs-98/
  hero.png              (homogeneizador_foto_principal.png — nova hero)
  front.png             (Hs98_3.png — vista frontal real)
  three-quarter.png     (Hs98_5.png)
  top.png               (Hs98_6_vista_superior_completa.png)
  side.png              (Hs98_8_vista_lateral.png)
  rear.png              (Hs98_9.png)
  bocal.png             (Hs98_14_bocal.png)
  switch.png            (Hs98_2.png — chave on/off)
  pedal.png             (pedal.png)
  internal.png          (vistaínterna.png)
```

Atualizar `src/data/hs98.ts` para importar só esses caminhos limpos. Os arquivos antigos com espaço/parêntese ficam (não removo) mas deixam de ser referenciados.

---

### 2. Hero — usar a imagem certa

Trocar a hero principal para `hero.png` (a foto editorial 3/4 com pedal, que valoriza o produto inteiro). Adicionar ring-light cônico animado por trás, com reflexo de chão via `mask-image`, e parallax leve no produto ao scroll — mantém o trabalho cinematográfico já feito, só com a imagem correta.

---

### 3. Galeria horizontal profissional

Reescrever `Hs98Gallery.tsx` do zero como **slider horizontal**:

- Embla Carousel (`embla-carousel-react`, instalado via `bun add`) — drag livre, snap por slide, momentum
- Cards em proporção 4/3, largura ~70% no desktop / 90% no mobile, peek do próximo slide à direita
- Hover: zoom suave + tilt 3D leve (transform-perspective) + brilho varrendo a imagem
- Setas circulares flutuantes (prev/next), barra de progresso fina embaixo, contador `03/10`
- Click abre lightbox em tela cheia (mantém o atual, com setas e ESC)
- Autoplay opcional desligado por padrão (pausa em hover de qualquer forma)
- Reveal on scroll com framer-motion stagger

---

### 4. Copy estilo "hard copy" (moderado)

Reescrever os textos de hero, manifesto, highlights, comparativo, ROI e CTA final em `src/data/hs98.ts` com tom mais direto/persuasivo (sem soar gritado ou genérico de IA). Diretrizes:

- Frases curtas, verbos fortes, números no início
- 1 dor concreta + 1 consequência financeira por bloco
- Zero adjetivos vagos ("incrível", "revolucionário")
- Microcopy de CTA: "Quero ver no meu PDV", "Falar com especialista agora", "Receber proposta em 1h"

Exemplo de tom (hero):
> **900 kg/h. Vermelho de vitrine. Margem de volta no caixa.**
> O moedor comum entrega carne branca e quebra de até 12% no balcão. O HS-98 mói e homogeneíza no mesmo ciclo — e devolve cada quilo como produto que vende sozinho.

---

### 5. Remover títulos numerados das seções

Tirar todos os `01 — Posicionamento`, `02 — Por dentro`, `03 — Engenharia`, `04 — Comparativo`, `05 — Galeria`, `06 — Retorno`. No lugar, eyebrows curtos e pontuais (ou nenhum), apenas o H2.

---

### 6. Spotlight do mouse — tornar perceptível

Reescrever `MouseSpotlight.tsx`:

- Trocar `mix-blend-soft-light` (quase invisível em fundos escuros) por `mix-blend-screen`
- Subir opacidade base para `0.85`, raio para 720×720, gradiente com `oklch` do `--accent` no centro
- Manter o spring suave (sem ficar grudado no cursor)
- Expor escala/intensidade via CSS var para a hero pulsar mais forte
- Manter `pointer-events-none` e `z-[9999]`

---

### Arquivos modificados / criados

- `src/assets/products/hs-98/*.png` — 10 imagens copiadas com nomes limpos
- `src/data/hs98.ts` — imports limpos + copy reescrita
- `src/components/site/MouseSpotlight.tsx` — efeito mais visível
- `src/components/site/hs98/Hs98Gallery.tsx` — refeito como slider Embla horizontal
- `src/components/site/hs98/Hs98Landing.tsx` — remover títulos numerados, atualizar hero/copy
- `package.json` / `bun.lock` — `embla-carousel-react`

### Fora de escopo
- Página PA7 PRO, outras páginas, integração de pagamento real, geração de novas fotos por IA.
