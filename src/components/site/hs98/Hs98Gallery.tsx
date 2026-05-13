import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { motion } from "framer-motion";
import { HS98_GALLERY } from "@/data/hs98";

export function Hs98Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
    skipSnaps: false,
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setProgress(emblaApi.scrollProgress());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Lightbox keyboard
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((i) => (i === null ? null : (i + 1) % HS98_GALLERY.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) =>
          i === null ? null : (i - 1 + HS98_GALLERY.length) % HS98_GALLERY.length,
        );
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const currentLightbox = lightbox !== null ? HS98_GALLERY[lightbox] : null;

  return (
    <section className="relative overflow-hidden border-y border-border bg-card/10 py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_60%)]"
      />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 flex flex-wrap items-end justify-between gap-6"
        >
          <h2 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Cada ângulo entrega uma <span className="text-accent">decisão técnica</span>.
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            Arraste, use as setas ou o teclado. Clique para ver em tela cheia.
          </p>
        </motion.div>
      </div>

      {/* Embla viewport — full bleed */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y pl-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
            {HS98_GALLERY.map((img, idx) => {
              const isActive = idx === selected;
              return (
                <div
                  key={idx}
                  className="relative shrink-0 grow-0 basis-[88%] pr-4 md:basis-[62%] md:pr-6 lg:basis-[52%]"
                >
                  <button
                    type="button"
                    onClick={() => setLightbox(idx)}
                    className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl border bg-gradient-to-br from-card to-background transition-all duration-700 ${
                      isActive
                        ? "border-accent/40 shadow-[0_30px_80px_-20px_color-mix(in_oklab,var(--accent)_40%,transparent)]"
                        : "border-border opacity-60 [transform:scale(0.94)]"
                    }`}
                    style={{ willChange: "transform, opacity" }}
                  >
                    {/* Subtle radial glow behind product */}
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-70"
                      style={{
                        background:
                          "radial-gradient(ellipse at 50% 60%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
                      }}
                    />

                    <img
                      src={img.src}
                      alt={img.alt}
                      loading={idx < 3 ? "eager" : "lazy"}
                      className="relative h-full w-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.06] md:p-12"
                    />

                    {/* Sweeping shine on hover */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
                    />

                    {/* Top-right expand chip */}
                    <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground backdrop-blur-md">
                      <Expand className="size-3" />
                      Tela cheia
                    </div>

                    {/* Bottom caption */}
                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                      <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-2 backdrop-blur-md">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")} / {String(HS98_GALLERY.length).padStart(2, "0")}
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-foreground">
                          {img.alt}
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating arrows */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 p-3.5 text-foreground shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-accent hover:text-accent-foreground md:flex"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Próxima"
          className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 p-3.5 text-foreground shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-accent hover:text-accent-foreground md:flex"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Footer controls — progress + counter + mobile arrows */}
      <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Anterior"
            className="rounded-full border border-border bg-background p-2.5 text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Próxima"
            className="rounded-full border border-border bg-background p-2.5 text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="relative h-px flex-1 bg-border">
          <div
            className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-300"
            style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
          />
        </div>

        <div className="text-xs font-bold tabular-nums uppercase tracking-[0.22em] text-muted-foreground">
          <span className="text-foreground">{String(selected + 1).padStart(2, "0")}</span>
          <span className="mx-2 text-border">/</span>
          {String(HS98_GALLERY.length).padStart(2, "0")}
        </div>
      </div>

      {/* Lightbox */}
      {currentLightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
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
              setLightbox((i) =>
                i === null ? null : (i - 1 + HS98_GALLERY.length) % HS98_GALLERY.length,
              );
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
              setLightbox((i) =>
                i === null ? null : (i + 1) % HS98_GALLERY.length,
              );
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card p-3 text-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Próxima"
          >
            <ChevronRight className="size-6" />
          </button>
          <img
            src={currentLightbox.src}
            alt={currentLightbox.alt}
            className="max-h-[88vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card px-5 py-2 text-xs text-foreground">
            {String((lightbox ?? 0) + 1).padStart(2, "0")} / {String(HS98_GALLERY.length).padStart(2, "0")} · {currentLightbox.alt}
          </div>
        </div>
      )}
    </section>
  );
}
