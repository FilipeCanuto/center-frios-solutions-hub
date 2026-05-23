# Design System Industrial — Aplicação Integral

Refinamento puramente visual baseado na referência enviada. Zero alteração de texto, rotas, lógica de pagamento, server functions, schemas ou conteúdo.

## 1. Tokens — `src/styles.css` (reescrita do bloco de variáveis)

Paleta exata da referência, convertida para `oklch` (mantendo nomes shadcn para não quebrar componentes):

```text
Midnight       #1C222B  → --background (dark)
Steel          #2A313C  → --border, --input
Graphite       #3B434F  → --card, --popover, --secondary, --muted
Silver         #AAB1BB  → --muted-foreground
Platinum       #E6E9ED  → --foreground
Electric Blue  #1A73FF  → --primary, --ring, --accent (interativo)
```

Gradientes e sombras (vars reutilizáveis):
- `--gradient-steel` — linear graphite→steel→graphite (botões secundários, headers de tabela)
- `--gradient-brushed` — CSS puro: `repeating-linear-gradient` horizontal + overlay SVG turbulence inline (data URI) para o aço escovado
- `--gradient-blue-glow` — radial electric-blue → transparente
- `--shadow-elevation-1..4` — escala de elevação igual à da referência
- `--shadow-glow-blue` — halo azul para foco/hover de CTAs

Light mode refinado: Platinum como background, Midnight como foreground, Electric Blue mantido como primary (ajuste fino de L para AA), Steel como border.

## 2. Tipografia — Inter (escala exata da referência)

Classes utilitárias em `@layer base`:
- `.text-display-1` 56/64 SemiBold
- `.text-display-2` 40/48 SemiBold
- `.text-h1` 28/36 SemiBold
- `.text-h2` 22/28 Medium
- `.text-subtitle` 16/24 Medium
- `.text-body` 14/20 Regular
- `.text-caption` 12/16 Regular
- `.text-overline` 10/12 Medium uppercase tracking 0.12em

Aplicadas em títulos/labels existentes sem mudar o conteúdo.

## 3. Border radius e espaçamento

Escala da referência:
- `--radius-sm` 4px (chips, badges)
- `--radius` 8px (inputs, botões)
- `--radius-md` 12px (cards pequenos)
- `--radius-lg` 16px (cards principais, dialogs)
- `--radius-xl` 24px (heros)

Espaçamento 4pt grid (4/8/12/16/24/32/40/48/64/80/96/128) já compatível com Tailwind.

## 4. Componentes shadcn — variantes (API inalterada)

Reestilizar somente os arquivos de variante:
- `button.tsx` — Primary (electric-blue + glow no hover), Secondary (steel-gradient), Tertiary (outline steel), Ghost (transparente, hover graphite). Estados focus com ring electric-blue + offset.
- `input.tsx`, `textarea.tsx` — fundo graphite, border steel, focus border electric-blue + glow sutil, ícone de clear como na imagem
- `select.tsx`, `dropdown-menu.tsx` — surface graphite, item ativo com fundo `electric-blue/12` + barra lateral electric-blue
- `badge.tsx` (status chips) — Success/Info/Warning/Error/Neutral com dot + texto, tons exatos da referência
- `checkbox.tsx`, `radio-group.tsx`, `switch.tsx` — checked em electric-blue com glow
- `card.tsx` — graphite + border steel/60 + shadow-elevation-2
- `table.tsx` — header em steel-gradient, linhas hover graphite, status chips reaproveitando Badge
- `tabs.tsx` — aba ativa com underline electric-blue + glow (igual à referência)
- `dialog.tsx`, `sheet.tsx`, `popover.tsx`, `tooltip.tsx` — surface graphite + shadow-elevation-4

Disabled: opacidade 40%, sem glow.

## 5. Ícones (Lucide já é o padrão)

Padronização global:
- stroke-width 2
- tamanhos 16 (inline) / 20 (botões) / 24 (nav)
- `currentColor` para herdar o glow azul em hover/ativo

## 6. Aço escovado em pontos estratégicos

Aplicar `.bg-brushed-metal` apenas em:
- Header sticky (com blur)
- Hero das landings (PA7, HS98) — faixa de fundo
- `StickyBuyBar` PA7
- `CtaBanner`
- Footer
- Topbar/sidebar do admin
- Cards "Built for precision" / destaque de marca

Não usar em formulários, tabelas e dialogs (preservar legibilidade).

## 7. Micro-interações

- Hover em CTAs primários: `translateY(-1px)` + `shadow-glow-blue`
- Focus-visible global: ring 2px electric-blue + offset 2px
- Transições 200ms ease-out
- `tech-grid` recalibrada para o novo background midnight

## Arquivos editados

- `src/styles.css` — tokens, gradientes, utilities, escala tipográfica
- `src/components/ui/*.tsx` — apenas variantes (button, input, textarea, select, dropdown-menu, badge, card, table, tabs, checkbox, radio-group, switch, dialog, sheet, popover, tooltip)
- `src/components/site/Header.tsx`, `Footer.tsx`, `CtaBanner.tsx` — classes de fundo
- `src/components/site/pa7/StickyBuyBar.tsx`, `Pa7ProLanding.tsx` — classes
- `src/components/site/hs98/TechHero.tsx`, `Hs98Landing.tsx` — classes
- `src/routes/_authenticated.tsx`, `_authenticated.admin.pedidos.tsx`, `_authenticated.admin.teste-pagamento.tsx`, `login.tsx` — wrappers/classes
- `src/components/site/ProductCard.tsx`, `SegmentCard.tsx`, `SpecGrid.tsx`, `SectionHeading.tsx` — alinhar com tokens novos

## Garantias

- Zero alteração em `src/lib/payments/rede.ts`, server functions, rotas, schema Supabase, textos, conteúdo, funcionalidade.
- Nenhum componente removido, nenhuma rota nova.
- Contraste AA verificado nos pares principais (Platinum/Midnight, Silver/Graphite, Electric Blue/Midnight).
- Dark padrão + Light refinado funcionando em paralelo.
- Verificação visual no preview após implementação.
