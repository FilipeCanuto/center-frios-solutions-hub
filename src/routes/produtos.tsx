import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { PRODUCTS } from "@/data/site";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — Center Frios | Equipamentos para Gastronomia" },
      {
        name: "description",
        content:
          "Catálogo de equipamentos de alta performance: processadores, abridoras de massa, climatizadores, fornos, câmaras frias e mais.",
      },
      { property: "og:title", content: "Produtos Center Frios" },
      {
        property: "og:description",
        content:
          "Equipamentos certificados para regime de trabalho contínuo. Veja o catálogo completo.",
      },
    ],
  }),
  component: ProdutosPage,
});

function ProdutosPage() {
  const detailed = PRODUCTS.filter((p) => p.detailed);
  const others = PRODUCTS.filter((p) => !p.detailed);

  return (
    <>
      <section className="border-b border-border py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Catálogo"
            title="Equipamentos para alta performance"
            description="Linha completa para refrigeração comercial e gastronomia profissional. Solicite orçamento personalizado para o seu projeto."
          />
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 text-xl font-semibold text-foreground">
            Linha em destaque
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {detailed.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 text-xl font-semibold text-foreground">
            Outros equipamentos do nosso catálogo
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <div
                key={p.slug}
                className="rounded-xl border border-border bg-card p-6"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {p.category}
                </span>
                <h3 className="mt-2 text-lg font-medium text-foreground">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                  {p.specs.map((s) => (
                    <li key={s.label}>
                      <span className="text-foreground">{s.label}:</span> {s.value}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner source="produtos" />
    </>
  );
}
