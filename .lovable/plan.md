## Escopo

Refazer **somente** a página `/produtos/processador-pa7-pro-skymsen` como landing page premium de alta conversão. Nada mais no site é alterado.

Conteúdo técnico definitivo virá no flyer — implemento a estrutura agora com as specs já existentes em `src/data/site.ts` como placeholder. Quando o flyer chegar, atualizo só o conteúdo (texto/specs), sem mexer no layout.

## Imagens

Copio as 10 fotos enviadas para `src/assets/products/pa7-pro/` (01, 06, 07, 09, 10, 14, 19, 20, 23 + capa). Eleger:
- **Capa** (hero / galeria principal): `PA7PRO.png`
- **Showcase** (seções com parallax): 06, 10, 14, 19, 20, 23
- **Detalhes técnicos** (cards): 01, 07, 09

## Estrutura da landing page

1. **Hero split** — galeria à esquerda (imagem grande + 4 thumbnails com troca animada e zoom on hover) e à direita: badge "Skymsen · Linha Profissional", H1, tagline, 3 bullets de valor, CTA primário "Comprar agora" (abre checkout mock) + CTA secundário "Falar com especialista" (WhatsApp). Trust strip abaixo (NR-12, RDC 91, garantia 12m, frete BR).
2. **Sticky buy bar** — barra que aparece no scroll com nome + preço (mock) + botão Comprar.
3. **Diferenciais** — 4 cards com glassmorfismo (backdrop-blur sobre gradiente sutil), hover lift.
4. **Showcase parallax** — 2-3 seções alternadas (texto + imagem) com `translateY` no scroll, usando fotos 06/14/20.
5. **Specs técnicas** — `SpecGrid` existente, com leve refinamento visual (ícones).
6. **Aplicações** — chips/cards com ícone por segmento.
7. **Conformidade & Garantia** — selos NR-12 / RDC 91 / 12 meses.
8. **FAQ** — Accordion (shadcn) com 5-6 perguntas-padrão.
9. **CTA final** — banner com gradiente + glass, dois botões (Comprar / WhatsApp).

## Checkout mock (visual, não persiste)

Componente `CheckoutDialog` (shadcn Dialog em modo full-screen no mobile) com 3 passos:
1. **Identificação** — nome, empresa, CNPJ (opcional), email, telefone, CEP (Zod).
2. **Entrega** — endereço (auto-preenche por CEP via ViaCEP, sem chave), método de envio (placeholders).
3. **Pagamento** — tabs com 5 métodos:
   - **PIX** (QR code SVG decorativo + chave fake + copy)
   - **Boleto** (linha digitável fake + botão "Gerar boleto")
   - **Transferência** (dados bancários fictícios)
   - **Cartão de crédito** (form com bandeiras, parcelamento até 12x)
   - **Cartão de débito** (form simples)
   
   Resumo do pedido sticky à direita (produto + foto + subtotal + frete + total).

Submit de qualquer método mostra tela de sucesso com aviso "Plataforma de pagamento em integração — entraremos em contato para confirmar." Não grava em banco. Toast de confirmação.

Selos de confiança no rodapé do checkout (SSL, LGPD, "Compra Segura", bandeiras).

## Design

- Mantém tema dark (zinc-950) + acentos azul/amarelo já definidos.
- **Glassmorfismo**: `bg-white/5 backdrop-blur-xl border border-white/10` em cards de diferenciais e checkout summary.
- **Parallax**: hook `useParallax` simples baseado em `scroll` + `translate3d` (sem libs).
- **Hover**: scale-[1.02], glow do acento, transições 300ms.
- **Reveal on scroll**: IntersectionObserver + `animate-fade-in`.
- Tudo via tokens semânticos do `src/styles.css`.

## Arquivos

- **Novo**: `src/components/site/pa7/Gallery.tsx`, `Showcase.tsx`, `StickyBuyBar.tsx`, `CheckoutDialog.tsx`, `FaqPa7.tsx`, `useParallax.ts`, `useReveal.ts`.
- **Editado**: `src/routes/produtos.$slug.tsx` — quando `slug === "processador-pa7-pro-skymsen"`, renderiza componente dedicado `<Pa7ProLanding />`; demais produtos seguem layout atual intocado.
- **Novo**: `src/components/site/pa7/Pa7ProLanding.tsx` (composição da landing).
- **Assets**: `src/assets/products/pa7-pro/*.png` (10 arquivos copiados).
- **Data**: pequeno bloco `PA7_CONTENT` em `src/data/pa7.ts` (preço mock, parcelamento, FAQ, copy) — fácil de trocar quando flyer chegar.

## Fora de escopo

- Integração real de pagamento.
- Persistência do pedido no Lovable Cloud.
- Mudanças em outras páginas, header, footer, dados gerais.
- SEO da página será atualizado, mas só os campos do PA7.

## Próximo passo após aprovação

Implemento a estrutura. Quando você enviar o flyer, faço um segundo passe trocando texto/specs/preço sem refatorar.