import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { HS98_GALLERY } from "@/data/hs98";

export function Hs98Gallery() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const next = useCallback(
    () => setActive((i) => (i + 1) % HS98_GALLERY.length),
    [],
  );
  const prev = useCallback(
    () => setActive((i) => (i - 1 + HS98_GALLERY.length) % HS98_GALLERY.length),
    [],
  );

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightbox, next, prev]);

  const current = HS98_GALLERY[active];

  return (
    <section className="border-y border-border bg-card/10 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
              05 — Galeria
            </span>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Cada ângulo entrega uma decisão técnica.
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            Use as setas do teclado para navegar. Clique para abrir em tela cheia.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main viewer */}
          <div className="lg:col-span-8">
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-background"
              aria-label="Abrir imagem em tela cheia"
            >
              <img
                src={current.src}
                alt={current.alt}
                className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute right-5 top-5 rounded-full bg-background/70 p-2.5 text-foreground backdrop-blur-md transition-opacity group-hover:bg-background">
                <Expand className="size-4" />
              </div>
              <div className="absolute bottom-5 left-5 max-w-[70%] rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-medium text-foreground backdrop-blur-md">
                {String(active + 1).padStart(2, "0")} / {String(HS98_GALLERY.length).padStart(2, "0")} · {current.alt}
              </div>
            </button>
          </div>

          {/* Thumbs */}
          <div className="grid grid-cols-3 gap-3 lg:col-span-4 lg:grid-cols-2">
            {HS98_GALLERY.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActive(idx)}
                className={`group relative aspect-square overflow-hidden rounded-xl border bg-card/60 transition-all ${
                  active === idx
                    ? "border-accent shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_25%,transparent)]"
                    : "border-border opacity-70 hover:opacity-100"
                }`}
                aria-label={`Ver imagem ${idx + 1}: ${img.alt}`}
              >
                <img
                  src={img.src}
                  alt=""
                  className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(false);
            }}
            className="absolute right-6 top-6 rounded-full border border-border bg-card p-3 text-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card p-3 text-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Anterior"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card p-3 text-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Próxima"
          >
            <ChevronRight className="size-6" />
          </button>
          <img
            src={current.src}
            alt={current.alt}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card px-5 py-2 text-xs text-foreground">
            {String(active + 1).padStart(2, "0")} / {String(HS98_GALLERY.length).padStart(2, "0")} · {current.alt}
          </div>
        </div>
      )}
    </section>
  );
}
