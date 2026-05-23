import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { Product } from "@/data/site";
import { SpecGrid } from "./SpecGrid";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <Link
      to="/produtos/$slug"
      params={{ slug: product.slug }}
      className="group metal-surface metal-hover flex h-full flex-col rounded-2xl border border-white/10 p-4"
    >
      <div className="metal-image-stage mb-5 aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.015]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width={1024}
            height={1024}
            className="relative z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative z-10 grid h-full w-full place-items-center text-center text-xs uppercase tracking-widest text-muted-foreground">
            {product.name}
          </div>
        )}
      </div>
      <span className="w-fit rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
        {product.category}
      </span>
      <h3 className="mt-2 text-xl font-medium text-foreground transition-colors group-hover:text-accent">
        {product.name}
      </h3>
      {compact && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>}
      {product.specs.length > 0 && (
        <div className="mt-4">
          <SpecGrid specs={product.specs.slice(0, compact ? 3 : 2)} />
        </div>
      )}
      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-accent">
        {product.detailed ? "Ver detalhes" : "Consultar equipamento"}{" "}
        {product.detailed ? <ArrowRight className="size-3.5" /> : <MessageCircle className="size-3.5" />}
      </span>
    </Link>
  );
}
