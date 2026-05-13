import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteDialog } from "@/components/site/QuoteDialog";
import { SpecGrid } from "@/components/site/SpecGrid";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Pa7ProLanding } from "@/components/site/pa7/Pa7ProLanding";
import { getProduct } from "@/data/site";

export const Route = createFileRoute("/produtos/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Produto — Center Frios" }] };
    const title = `${p.name} — Center Frios`;
    return {
      meta: [
        { title },
        { name: "description", content: p.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: p.tagline },
        ...(p.image ? [{ property: "og:image", content: p.image }] : []),
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="text-3xl font-semibold">Produto não encontrado</h1>
      <p className="mt-2 text-muted-foreground">
        O equipamento que você procura não está em nosso catálogo.
      </p>
      <Button asChild className="mt-6">
        <Link to="/produtos">Voltar ao catálogo</Link>
      </Button>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();

  if (product.slug === "processador-pa7-pro-skymsen") {
    return <Pa7ProLanding />;
  }

  return (
    <>
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Catálogo
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-2">
            <div className="aspect-square overflow-hidden rounded-2xl bg-card outline outline-1 -outline-offset-1 outline-border">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-sm uppercase tracking-widest text-muted-foreground">
                  {product.name}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                {product.category}
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">{product.tagline}</p>
              {product.longDescription && (
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {product.longDescription}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <QuoteDialog
                  source={`produto-${product.slug}`}
                  defaultProduct={product.name}
                  trigger={
                    <Button size="lg" className="rounded-full">
                      Solicite Orçamento
                    </Button>
                  }
                />
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <a href="https://wa.me/558232232497" target="_blank" rel="noreferrer">
                    Falar com especialista
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-semibold text-foreground">Especificações</h2>
          <div className="mt-6">
            <SpecGrid specs={product.specs} columns={3} />
          </div>
        </div>
      </section>

      {product.applications && product.applications.length > 0 && (
        <section className="border-t border-border py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-semibold text-foreground">Aplicações</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.applications.map((a: string) => (
                <li
                  key={a}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <Check className="mt-0.5 size-5 text-accent" />
                  <span className="text-sm text-foreground">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {product.compliance && product.compliance.length > 0 && (
        <section className="border-t border-border py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-6 text-accent" />
              <h2 className="text-2xl font-semibold text-foreground">
                Normas e conformidade
              </h2>
            </div>
            <ul className="mt-6 space-y-2">
              {product.compliance.map((c: string) => (
                <li key={c} className="text-sm text-muted-foreground">
                  • {c}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBanner
        source={`cta-produto-${product.slug}`}
        defaultProduct={product.name}
        title={`Pronto para integrar o ${product.name} ao seu negócio?`}
        description="Receba um orçamento técnico com prazo de entrega e condições para sua operação."
      />
    </>
  );
}
