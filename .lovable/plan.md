## Goal
Embed 4 product videos into `/produtos/processador-pa7-pro-skymsen` with zero impact on e-Rede checkout logic and minimal performance cost.

## Assets — upload to Lovable CDN
Upload each MP4 via `lovable-assets create` and write the `.asset.json` pointer to `src/assets/pa7/videos/`:
- `hero-processador.mp4.asset.json` ← `PA7 PRO - PROPROCESSADOR DE ALIMENTOS.mp4`
- `versatilidade.mp4.asset.json` ← `PA7 PRO - Skymsen.mp4`
- `circuito-experience.mp4.asset.json` ← `PA7 PRO video evento Circuito Experience 2026.mp4`
- `calabresa.mp4.asset.json` ← `PA7 PRO - Calabresa.mp4`

## New component — `src/components/site/pa7/LazyVideo.tsx`
Single reusable primitive. Props: `src`, `poster?`, `aspect` (e.g. `aspect-video`, `aspect-[9/16]`), `className?`, `showMuteToggle?` (default false), `rounded?` (default true).

Behavior:
- Uses `IntersectionObserver` (rootMargin `200px`) to flip an `inView` flag.
- Before `inView`: renders `<video preload="none">` with no `src` — zero network.
- After `inView`: assigns `src`, calls `.load()` then `.play()`. Sets `autoPlay muted loop playsInline` and `disableRemotePlayback`.
- Optional mute toggle: minimal circular button (top-right, `absolute`, Tailwind `bg-black/40 backdrop-blur` + lucide `Volume2`/`VolumeX`). Local state only.
- All styling via Tailwind v4 utilities + existing semantic tokens (`border-white/10`, `metal-surface`, `rounded-3xl`, etc.). No inline colors.

## Layout integration tree (Pa7ProLanding.tsx)

```text
HERO section
└─ grid lg:grid-cols-2
   ├─ left col: <Gallery /> (kept)
   │   └─ (new) <LazyVideo  ── VIDEO 1
   │             src={heroProcessador.url}
   │             aspect="aspect-video"
   │             showMuteToggle
   │             className="mt-4 rounded-3xl border border-white/10 metal-surface" />
   └─ right col: pricing/CTA (untouched)

HIGHLIGHTS (unchanged)
SHOWCASE list (unchanged)
INCLUDED DISCS section
└─ (new) VERSATILIDADE block above the disc grid       ── VIDEO 2
   ├─ headline "Versatilidade em ação: do palito à vinagrete"
   └─ grid md:grid-cols-[1.4fr_1fr] gap-6
      ├─ <LazyVideo src={versatilidade.url} aspect="aspect-video" showMuteToggle />
      └─ 3 mini bullet cards (batata palha · folhas · vinagrete)

SPECS section
└─ grid md:grid-cols-[1fr_360px] gap-8                  ── VIDEO 3
   ├─ <SpecGrid />
   └─ aside: portrait frame
      ├─ <LazyVideo src={circuitoExperience.url} aspect="aspect-[9/16]"
      │              className="rounded-3xl border border-white/10 metal-surface" />
      └─ caption: "Provado ao Vivo no Circuito Experience 2026: …gravidade…"

USE CASES, APPLICATIONS, FAQ (unchanged)

CHECKOUT SECTION
└─ wrap in relative container                           ── VIDEO 4
   ├─ <LazyVideo src={calabresa.url} aspect="aspect-[9/16]"
   │              rounded={false}
   │              className="absolute right-6 top-10 hidden lg:block w-[220px]
   │                         opacity-70 mix-blend-luminosity pointer-events-none" />
   └─ <CheckoutSection /> (untouched, including all e-Rede props)
```

## Files touched
- **new** `src/assets/pa7/videos/*.asset.json` (×4, via CLI)
- **new** `src/components/site/pa7/LazyVideo.tsx`
- **edit** `src/components/site/pa7/Pa7ProLanding.tsx` — add imports + 4 insertion points above
- **no changes** to `CheckoutDialog.tsx`, `CheckoutSection.tsx`, `payments.functions.ts`, `rede.ts`, hooks, or any API logic

## Performance guarantees
- `preload="none"` until viewport intersection → 0 bytes downloaded at initial paint
- `IntersectionObserver` cleaned up on unmount
- `autoPlay muted playsInline` satisfies mobile autoplay policies; no audio track loaded
- No third-party player; native `<video>` only
- Tailwind v4 utilities only; no hardcoded hex/rgb values

## Verification
- Build passes
- DevTools Network: videos appear only after scrolling each section into view
- Checkout dialog opens, PIX + card flows untouched (smoke check)
