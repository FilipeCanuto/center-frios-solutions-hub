import { Link } from "@tanstack/react-router";
import type { Segment } from "@/data/site";

export function SegmentCard({ segment }: { segment: Segment }) {
  return (
    <Link
      to="/segmentos/$slug"
      params={{ slug: segment.slug }}
      className="group relative aspect-square overflow-hidden rounded-xl bg-card ring-1 ring-border"
    >
      <img
        src={segment.image}
        alt={segment.name}
        loading="lazy"
        width={800}
        height={800}
        className="h-full w-full object-cover opacity-40 transition-all duration-500 group-hover:opacity-60 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
        <span className="text-base font-semibold text-foreground">{segment.name}</span>
        <span className="mt-1 text-xs text-muted-foreground">{segment.short}</span>
      </div>
    </Link>
  );
}
