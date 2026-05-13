import { useState } from "react";
import { ZoomIn } from "lucide-react";

type Item = { src: string; alt: string };

export function Gallery({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const main = items[active];

  return (
    <div className="flex flex-col gap-4">
      <div
        className="group relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-xl"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--brand-blue) 18%, transparent), transparent 60%)",
          }}
        />
        <img
          key={main.src}
          src={main.src}
          alt={main.alt}
          width={1200}
          height={1200}
          className="relative h-full w-full animate-fade-in object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04] md:p-10"
        />
        <div className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest text-white/80 backdrop-blur">
          <ZoomIn className="size-3.5" /> Hover
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {items.map((it, i) => (
          <button
            key={it.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ver imagem ${i + 1}`}
            className={`group relative aspect-square overflow-hidden rounded-xl border bg-white/[0.03] transition-all ${
              active === i
                ? "border-accent shadow-[0_0_0_2px_color-mix(in_oklab,var(--accent)_40%,transparent)]"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <img
              src={it.src}
              alt={it.alt}
              loading="lazy"
              className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
