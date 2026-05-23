import { Link } from "@tanstack/react-router";
import type { Segment } from "@/data/site";

export function SegmentCard({ segment }: { segment: Segment }) {
  return (
    <Link
      to="/segmentos/$slug"
      params={{ slug: segment.slug }}
      className="group metal-hover relative block h-full min-h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-card ring-1 ring-white/10"
    >
      <img
        src={segment.image}
        alt={segment.name}
        loading="lazy"
        decoding="async"
        width={800}
        height={800}
        className="h-full w-full object-cover opacity-45 transition-all duration-500 group-hover:scale-105 group-hover:opacity-65"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,color-mix(in_oklab,var(--brand-blue)_18%,transparent),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
        <span className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
          Segmento
        </span>
        <span className="mt-3 text-base font-semibold text-foreground">{segment.name}</span>
        <span className="mt-1 text-xs text-muted-foreground">{segment.short}</span>
      </div>
    </Link>
  );
}
