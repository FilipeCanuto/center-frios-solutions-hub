import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/site";
import { SpecGrid } from "./SpecGrid";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produtos/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col"
    >
      <div className="mb-6 aspect-square w-full overflow-hidden rounded-2xl bg-card outline outline-1 -outline-offset-1 outline-border">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs uppercase tracking-widest text-muted-foreground">
            {product.name}
          </div>
        )}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
        {product.category}
      </span>
      <h3 className="mt-2 text-xl font-medium text-foreground transition-colors group-hover:text-accent">
        {product.name}
      </h3>
      {product.specs.length > 0 && (
        <div className="mt-4">
          <SpecGrid specs={product.specs.slice(0, 2)} />
        </div>
      )}
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Ver detalhes <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}
