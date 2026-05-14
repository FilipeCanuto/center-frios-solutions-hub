## Objetivo

Refundar a paleta do Design System para a identidade Premium/Executive inspirada na PA7 PRO — Dark Mode default, azul elétrico de conversão e ouro/amarelo premium — preservando a arquitetura Tailwind v4 CSS-first já em uso (sem criar `tailwind.config.ts`, sem downgrade).

## Por que adaptar (e não colar literal)

O projeto roda Tailwind v4. Nele:
- Não existe `tailwind.config.ts`; o tema vive em `src/styles.css` via `@theme inline`.
- `@tailwind base/components/utilities` e `@apply border-border` (v3) quebram o build.
- Tokens são `oklch(...)`, não `hsl(var(--x))`.
- `tailwindcss-animate` é substituído por `tw-animate-css` (já instalado).

Vou converter sua paleta HSL para `oklch` equivalente, mantendo exatamente as mesmas cores percebidas.

## Mudanças

### 1. `src/styles.css` — nova paleta

Substituir o bloco `:root` (e adicionar `.light`) com a tradução das suas variáveis:

| Token | HSL pedido | OKLCH equivalente |
|---|---|---|
| `--background` | 240 10% 4% | `oklch(0.12 0.012 270)` |
| `--foreground` | 0 0% 100% | `oklch(1 0 0)` |
| `--card` / `--popover` | 240 10% 8% | `oklch(0.18 0.012 270)` |
| `--primary` (azul) | 221 83% 53% | `oklch(0.58 0.22 258)` |
| `--secondary` / `--muted` / `--border` / `--input` | 240 10% 15% | `oklch(0.26 0.012 270)` |
| `--accent` (ouro) | 45 93% 47% | `oklch(0.78 0.17 85)` |
| `--accent-foreground` | 240 10% 4% | `oklch(0.12 0.012 270)` |
| `--muted-foreground` | 240 5% 65% | `oklch(0.70 0.008 270)` |
| `--ring` | 221 83% 53% | `oklch(0.58 0.22 258)` |
| `--radius` | 0.75rem | `0.75rem` |

- Atualizar `--brand-blue` e `--brand-yellow` para refletir os novos primary/accent.
- Adicionar variante `.light` com a tradução do bloco light pedido.
- Manter `@theme inline`, `@import "tailwindcss"`, `@import "tw-animate-css"` e `.tech-grid` intactos.
- Manter `font-family: "Inter"` (já é o default).

### 2. Container, radius e fontes

Já atendidos pela config v4 atual:
- `--radius: 0.75rem` propaga em `--radius-sm/md/lg/xl`.
- `--font-sans: Inter, ...` já definido em `@theme inline`.
- Container central com padding pode ser adicionado via utilitários por página; não precisa de plugin.

### 3. Não fazer

- Não criar `tailwind.config.ts` (não é usado em v4 deste template).
- Não instalar `tailwindcss-animate` (já temos `tw-animate-css`).
- Não tocar em componentes — eles consomem `bg-primary`, `bg-accent`, `bg-card`, etc., e herdam a nova paleta automaticamente.

### 4. Verificação pós-mudança

1. Build automático passa.
2. Conferir visualmente em `/produtos/processador-pa7-pro-skymsen` (rota atual) e na home: botões primários azul elétrico, badges/realces em ouro, fundo near-black, cards levemente mais claros que o background.
3. Conferir contraste do `accent-foreground` sobre `accent` (ouro) — texto escuro em botões dourados.

## Escopo fora desta tarefa

- Refatorar componentes para usar mais `accent` em CTAs premium (pode vir num passo seguinte).
- Light mode toggle de UI (variáveis ficam prontas, mas o switch fica para depois).
