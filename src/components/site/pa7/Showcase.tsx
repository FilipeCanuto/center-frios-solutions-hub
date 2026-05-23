import { useParallax } from "./useParallax";
import { useReveal } from "./useReveal";

type Item = {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
};

export function Showcase({ item, reverse = false }: { item: Item; reverse?: boolean }) {
  const { ref: pRef, offset } = useParallax<HTMLDivElement>(1.4);
  const { ref: rRef, shown } = useReveal<HTMLDivElement>();

  return (
    <section ref={rRef} className="relative overflow-hidden border-t border-white/5 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
        <div
          className={`${reverse ? "md:order-2" : ""} transition-all duration-700 ${
            shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            {item.eyebrow}
          </span>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {item.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {item.body}
          </p>
        </div>

        <div ref={pRef} className={`${reverse ? "md:order-1" : ""}`}>
          <div
            style={{ transform: `translate3d(0, ${offset}px, 0)` }}
            className="metal-surface metal-hover metal-image-stage relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.01] backdrop-blur-xl"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(80% 60% at 50% 30%, color-mix(in oklab, var(--brand-blue) 22%, transparent), transparent 65%)",
              }}
            />
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="relative z-10 h-full w-full object-contain p-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
