
## Guardrails (non-negotiable)

- Do NOT touch `CheckoutDialog.tsx`, `src/lib/payments.functions.ts`, `src/lib/payments/*`, the `product` payload shape, or any token/gateway state.
- All optional-disc selection lives in a strict local state `selectedOptionalDiscs: string[]` inside a new client component. It only drives **UI text totals** (displayed total = `PA7_PRICE.amount + sum(optional)`). The `<CheckoutDialog product={...}>` prop keeps the original base price — billing payload is never polluted.

## 1) Data layer — hardcoded optional discs

File: `src/data/pa7.ts`

Append a new export, no edits to existing exports:

```ts
export type OptionalDisc = {
  code: string;
  group: "Fatiador" | "Grade de cubo";
  desc: string;
  price: number;       // BRL, ERP reference
  image: string;       // asset url
  requiresSlicer?: boolean; // true for GC*
};

export const PA7_OPTIONAL_DISCS: OptionalDisc[] = [
  { code: "E5",  group: "Fatiador",      desc: "5 mm",         price: 404.60, image: discE5.url },
  { code: "E8",  group: "Fatiador",      desc: "8 mm",         price: 404.60, image: discE8.url },
  { code: "E10", group: "Fatiador",      desc: "10 mm",        price: 366.01, image: discE10.url },
  { code: "E14", group: "Fatiador",      desc: "14 mm",        price: 366.01, image: discE14.url },
  { code: "GC8", group: "Grade de cubo", desc: "8 × 8 mm",     price: 523.91, image: discGC8.url,  requiresSlicer: true },
  { code: "GC10",group: "Grade de cubo", desc: "10 × 10 mm",   price: 596.92, image: discGC10.url, requiresSlicer: true },
  { code: "GC14",group: "Grade de cubo", desc: "14 × 14 mm",   price: 555.76, image: discGC14.url, requiresSlicer: true },
  { code: "GC20",group: "Grade de cubo", desc: "20 × 20 mm",   price: 591.82, image: discGC20.url, requiresSlicer: true },
];

export const PA7_NICHE_PRESETS = [
  { id: "pizzaria",    label: "Pizzaria",          picks: ["E5", "GC8"] },
  { id: "hamburgueria",label: "Hamburgueria",      picks: ["E8", "GC10"] },
  { id: "buffet",      label: "Buffet livre",      picks: ["E5", "GC8", "GC14"] },
  { id: "seleta",      label: "Seleta de legumes", picks: ["E10", "GC14", "GC20"] },
];
```

Asset pipeline (build mode):
- Upload the 8 attached PNGs via `lovable-assets create` into `src/assets/pa7/discs-optional/` (`e5.png`, `e8.png`, `e10.png`, `e14.png`, `gc8.png`, `gc10.png`, `gc14.png`, `gc20.png`).
- Import the 8 `.asset.json` pointers at the top of `pa7.ts`.

## 2) Pre-Checkout Configurator (replaces static use-cases grid)

New file: `src/components/site/pa7/CrossSellConfigurator.tsx` — `"use client"`-style client component (TanStack Start is fine, just no server-only deps).

State:
```ts
const [selected, setSelected] = useState<string[]>([]);
const [activePreset, setActivePreset] = useState<string | null>(null);
```

Layout:
- Header with the 4 niche preset chips (Pizzaria / Hamburgueria / Buffet livre / Seleta de legumes). Clicking a chip sets `selected = preset.picks` and highlights it.
- Two-column responsive grid of disc cards (image + code + group + desc + price + checkbox). Hovering an unchecked card shows price delta; clicking toggles.
- **Combo guardrail** computed at render:
  - `hasCube = selected.some(c => PA7_OPTIONAL_DISCS.find(d=>d.code===c)?.requiresSlicer)`
  - `hasSlicer = selected.some(c => PA7_OPTIONAL_DISCS.find(d=>d.code===c)?.group === "Fatiador") || PA7_INCLUDED_DISCS.some(d => d.group.startsWith("Fatiador"))` (the unit already ships with E1/E3, so the rule mainly nudges; we still surface the warning when *only* GC is added with no slicer awareness).
  - When `hasCube` and the user has not explicitly picked an *optional* slicer, render an amber industrial badge:

    ```tsx
    <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
      ⚠️ Combinação de Fábrica Requerida: Grades de cubo exigem
      obrigatoriamente um Disco Fatiador combinado para operar.
    </div>
    ```

  - Auto-suggest pairing: each cube card carries a `recommendedWith` (e.g. `GC8 → E5`). A "Adicionar combo" link toggles both at once and shows the combined delta (`+R$ 928,51` for GC8+E5).
- **Master summary card** (sticky on `lg:` at the right of the configurator, full-width on mobile):
  - "Configuração atual"
  - List of selected optionals with individual prices
  - `Total de adicionais: R$ X,XX`
  - `Preço final estimado: R$ {(PA7_PRICE.amount + total).toLocaleString(...)}`
  - Microcopy: "Os adicionais selecionados aparecem no orçamento final emitido pelo time Center Frios. O checkout abaixo cobra o equipamento base; os acessórios entram na nota junto." → keeps e-Rede flow untouched and sets correct legal expectation.
  - Primary CTA scrolls to `#checkout-pa7` (same anchor used today).

Wiring in `Pa7ProLanding.tsx`:
- Replace the existing "Os cortes certos para cada operação" section (currently fed by `PA7_USE_CASES`) with `<CrossSellConfigurator />`.
- `PA7_USE_CASES` stays in `pa7.ts` for now (no destructive removal) but is no longer rendered.

## 3) Scroll-driven blade turbine on the 7 included discs

Edit only the included-discs grid block inside `Pa7ProLanding.tsx`. Wrap that section in a `ref` and use Framer Motion:

```tsx
const gridRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({
  target: gridRef,
  offset: ["start end", "end start"],
});
// Each disc gets a slightly different multiplier for a turbine feel.
const rotations = PA7_INCLUDED_DISCS.map((_, i) =>
  useTransform(scrollYProgress, [0, 1], [0, 180 + i * 35])
);
```

Render each disc image inside `<motion.img style={{ rotate: rotations[i] }} className="will-change-transform" />`. Preserve existing `hover:rotate-12` on the parent card by moving rotation to `<motion.img>` (no compound conflict). `prefers-reduced-motion` short-circuit: if true, skip the transform and keep the static drop-shadow.

## 4) Glassmorphic mask for `HardwareGrid` panel images

Edit `src/components/site/pa7/HardwareGrid.tsx`, image column only. Replace the bare `<img>` with a masked canvas:

```tsx
<div className="relative rounded-2xl border border-white/10 bg-neutral-900/60 p-6 shadow-2xl backdrop-blur-md">
  <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl
       bg-[radial-gradient(circle_at_center,rgba(10,81,168,0.18),transparent_70%)]" />
  <img
    src={current.image}
    alt={current.title}
    loading="lazy"
    decoding="async"
    className="relative mx-auto h-auto w-full max-w-[420px] object-contain
               mix-blend-luminosity drop-shadow-[0_22px_45px_rgba(0,0,0,0.55)]"
    style={{ maskImage: "radial-gradient(circle at center, #000 70%, transparent 100%)" }}
  />
</div>
```

The `bg-neutral-900/60 backdrop-blur-md` plate kills the white halo on `Item03–Item09`. `mix-blend-luminosity` + radial mask softens the residual border without external editing. No other panel logic changes (tabs, AnimatePresence, copy stay).

## 5) Proof Wall rebuild + Checkout anchor cutout

### 5a) `UgcWall.tsx` — premium vertical-reel layout

Refactor into a center-stage layout:
- Center column: large 9:16 phone chassis (`<LazyVideo variant="phone" aspect="9/16" />`) rendering `thomas-burguer.mp4`, with a floating accented badge `🔥 Cliente Real Center Frios` (`bg-accent text-accent-foreground rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]`). Muted + loop + autoplay already handled by `LazyVideo`.
- Flanking columns (md+): two smaller 9:16 phones for `batata-fatiada.mp4` and `calabresa.mp4`, slightly scaled down (`scale-90`) and dimmed (`opacity-80 hover:opacity-100`).
- On mobile collapse to a single vertical stack (Thomas first).
- Headline + subhead block above the reel ("Provado e Aprovado · cozinhas reais de clientes Center Frios").

### 5b) `CheckoutSection.tsx` — anchored isometric cutout

- Hardcode `Item01.jpg` (already in `src/assets/products/pa7-pro/01.png` per existing imports — reuse `img01`) inside the **left column** product canvas built in the previous plan.
- Replace the current product image with:
  ```tsx
  <img
    src={img01}
    alt="PA7 Pro Skymsen — vista isométrica"
    className="h-[28rem] w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
  />
  ```
- Floor-glow radial halo stays. Right column (pricing card + `<CheckoutDialog />`) untouched.

## Module tree (files affected, scope per file)

```text
src/
  assets/pa7/discs-optional/        ← NEW: e5/e8/e10/e14/gc8/gc10/gc14/gc20 .asset.json
  data/
    pa7.ts                          ← add PA7_OPTIONAL_DISCS + PA7_NICHE_PRESETS, imports for 8 new assets. PA7_USE_CASES kept (not rendered).
  components/site/pa7/
    Pa7ProLanding.tsx               ← swap use-cases block for <CrossSellConfigurator/>;
                                       wrap included-discs grid with useScroll/useTransform turbine rotation
    CrossSellConfigurator.tsx       ← NEW client component (state, presets, combo guardrail, summary card)
    HardwareGrid.tsx                ← image column wrapped in glassmorphic masked canvas
    UgcWall.tsx                     ← vertical-reel layout, Thomas Burguer center-stage with badge
    CheckoutSection.tsx             ← left column uses img01 (Item01) cutout, h-[28rem] object-contain, deep drop-shadow

Not touched: CheckoutDialog.tsx, payments.functions.ts, payments/rede.ts,
             payments/error-messages.ts, StickyBuyBar.tsx, LazyVideo.tsx,
             catalog.server.ts, .env, supabase/*.
```

## Verification (after build mode)

1. `bun run build` green.
2. Playwright at 1280×1800 on `/produtos/processador-pa7-pro-skymsen`:
   - Configurator renders 8 optional disc cards; selecting GC8 alone shows amber warning + "Adicionar combo GC8 + E5" link.
   - Selecting preset "Buffet livre" auto-checks E5 + GC8 + GC14 and summary shows `R$ 1.484,27` added on top of `R$ 6.299` → final estimated `R$ 7.783,27`.
   - Scrolling through the 7 included discs visibly spins each disc image at staggered speeds.
   - Hardware tabs no longer show white halos around Item03–Item09.
   - Proof Wall has Thomas video centered with the red 🔥 badge.
   - Checkout left column shows `img01` isometric at ~28rem with strong drop-shadow.
   - Opening CheckoutDialog → request body still posts the base `PA7_PRICE.amount` only (network tab confirms no addon contamination).
