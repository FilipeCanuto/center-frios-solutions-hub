## Goal

Repair PA7 Pro landing visual/layout issues without touching any e-Rede checkout, payment hook, or transaction state. Restore the full 4-video pipeline, give every video a polished chassis matched to its orientation, rebalance the checkout grid, and eliminate the duplicate WhatsApp CTA.

## Hard guardrails

- No edits to `CheckoutDialog.tsx`, `src/lib/payments.functions.ts`, `src/lib/payments/*`, `payments.functions` props, or any e-Rede payload/state.
- Keep all existing `LazyVideo` props (`src`, `aspect`, `showMuteToggle`, `className`, `rounded`, `variant`) backwards compatible — only add new variant tokens.
- Keep existing IntersectionObserver, autoplay, and mute logic in `LazyVideo` intact.

## 1) The 4-video asset matrix (canonical mapping)

Each landing slot is pinned to one asset file. The asset filenames the user references map to our already-uploaded `.asset.json` pointers as follows:

| Slot | Asset pointer | Orient. | Location in `Pa7ProLanding.tsx` | LazyVideo variant |
|------|--------------|---------|----------------------------------|-------------------|
| A — Hero focus | `circuito-experience.mp4.asset.json` (`PA7 PRO video evento Circuito Experience 2026_2`) | 9:16 | Hero right column (already there) | `phone` |
| B — Product features | `hero-processador.mp4.asset.json` (`PA7 PRO - PROPROCESSADOR DE ALIMENTOS_2`) | 16:9 | Gallery section (already there) | `monitor` (NEW) |
| C — Discs/versatility | `versatilidade.mp4.asset.json` (`PA7 PRO - Skymsen_2`) | 9:16 | Included-discs intro (already there) | `phone` |
| D — Pre-checkout immersion | `calabresa.mp4.asset.json` (`PA7 PRO - Calabresa_2`) | 9:16 | NEW section placed immediately above `<CheckoutSection />` | `phone` |

Slot D is the missing 4th asset — currently dropped from the page. It will be re-injected as its own narrow section directly preceding `CheckoutSection`, with conversion copy on one side and the phone-mockup video on the other.

## 2) `LazyVideo.tsx` — chassis variants + ambient glow

Extend the existing `variant` prop:

- `variant="phone"` — keep current premium smartphone mockup (already implemented). Add a richer outer radial glow layer.
- `variant="monitor"` — NEW. Industrial stainless/dark metallic monitor chassis for 16:9 videos: outer bezel uses `metal-surface border border-white/10` with `rounded-2xl`, inner screen `rounded-xl bg-black overflow-hidden`, a slim brushed-metal "stand foot" strip below, and a `bg-[radial-gradient(circle_at_center,rgba(10,81,168,0.18)_0%,transparent_70%)]` back-glow behind the chassis.
- `variant="default"` — keep, but always wrap in an ambient `bg-[radial-gradient(...)]` halo div so the media never sits flat on the page.

Crop policy: keep `object-contain` only inside `default`; switch `phone` and `monitor` to `object-cover` because both chassis already enforce the correct aspect ratio, eliminating the empty black-bar effect from the screenshot.

## 3) Checkout prestige refactor (`CheckoutSection.tsx`)

- Remove the absolute-positioned floating product cutout (`absolute -top-24 right-2 z-20 ...`).
- Convert the section grid to `lg:grid-cols-[1fr_1.1fr]`:
  - Left column: a dedicated product canvas — large centered `<img>` of `product.image`, `h-80 md:h-[28rem] object-contain`, with `drop-shadow-[0_25px_50px_rgba(0,0,0,0.4)]` and a soft radial floor-glow underneath. Trust grid (Truck/Shield/Card/Check) moves under it.
  - Right column: the pricing card, now visually balanced (no overlap), with the conversion copy heading moved above it.
- Keep the `CheckoutDialog` trigger, `product` prop shape, and PIX/installment math identical.

## 4) WhatsApp CTA redundancy sanitization

- `StickyBuyBar.tsx` already toggles `body.sticky-buybar-active`. Strengthen the CSS rule in `src/styles.css` for `[data-floating-whatsapp]` to use `display: none !important` when that class is present (current rule only hides via opacity/transform, which still leaves the element interactive on some screens).
- Additionally hide it whenever the CheckoutDialog is open (already inert) — out of scope, no change needed.
- `WhatsAppButton.tsx` keeps `data-floating-whatsapp` attribute; no markup change.

## Component tree (files modified)

```text
src/
  components/site/pa7/
    Pa7ProLanding.tsx         ← import calabresaVideo; add Slot D section above <CheckoutSection />;
                                 swap Gallery's LazyVideo to variant="monitor"
    LazyVideo.tsx             ← add variant="monitor"; richer glow on "phone"; object-cover for
                                 chassis variants; keep IO + mute logic untouched
    CheckoutSection.tsx       ← remove floating cutout; rebuild grid with dedicated product canvas
                                 column + drop-shadow; pricing card unchanged structurally
  styles.css                  ← harden body.sticky-buybar-active [data-floating-whatsapp] to
                                 display:none !important
```

Files explicitly NOT touched: `CheckoutDialog.tsx`, `payments.functions.ts`, `payments/rede.ts`, `payments/error-messages.ts`, `StickyBuyBar.tsx` logic, `data/pa7.ts`, `catalog.server.ts`.

## Verification (after build mode)

1. `bun run build` is green.
2. Playwright screenshot at 1280×1800 of `/produtos/processador-pa7-pro-skymsen`:
   - Confirms 4 distinct video chassis render (hero phone, gallery monitor, versatilidade phone, calabresa phone above checkout).
   - No horizontal black bars inside any video frame.
   - Checkout product image sits in its own column, no overlap with pricing card.
   - Scroll past hero → sticky bar appears AND floating WhatsApp button is removed from DOM rendering (display:none).
