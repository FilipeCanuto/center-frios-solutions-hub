import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { PremiumCard } from "@/components/site/PremiumCard";
import { SEGMENTS, getProductsBySlugs } from "@/data/site";

export const Route = createFileRoute("/segmentos/$slug")({
  loader: ({ params }) => {
    const segment = SEGMENTS.find((s) => s.slug === params.slug);
    if (!segment) throw notFound();
    return { segment };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.segment;
    if (!s) return { meta: [{ title: "Segmento — Center Frios" }] };
    const title = `${s.name} — Center Frios`;
    return {
      meta: [
        { title },
        { name: "description", content: s.description },
        { property: "og:title", content: title },
        { property: "og:description", content: s.description },
        { property: "og:image", content: s.image },
      ],
    };
  },
  component: SegmentoPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="text-3xl font-semibold">Segmento não encontrado</h1>
      <Button asChild className="mt-6">
        <Link to="/segmentos">Ver todos os segmentos</Link>
      </Button>
    </div>
  ),
});

function SegmentoPage() {
  const { segment } = Route.useLoaderData();
  const products = getProductsBySlugs(segment.recommendedProducts);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={segment.image}
          alt={segment.name}
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_45%_at_50%_0%,color-mix(in_oklab,var(--brand-blue)_18%,transparent),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <Link
            to="/segmentos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Segmentos
          </Link>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {segment.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{segment.description}</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Por que escolher a Center Frios para esse segmento
            </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {segment.benefits.map((b: string) => (
              <li
                key={b}
                className="metal-hover flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <Check className="mt-0.5 size-5 text-accent" />
                <span className="text-sm text-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {products.length > 0 && (
        <section className="border-t border-border py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Equipamentos recomendados para {segment.name}
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        source={`segmento-${segment.slug}`}
        defaultSegment={segment.name}
        title={`Quer uma consultoria personalizada para ${segment.name}?`}
        description="Nossos especialistas elaboram um projeto sob medida para a sua operação."
      />
    </>
  );
}
