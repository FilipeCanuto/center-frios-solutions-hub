import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Truck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteDialog } from "@/components/site/QuoteDialog";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SegmentCard } from "@/components/site/SegmentCard";
import { ProductCard } from "@/components/site/ProductCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { FEATURED_PRODUCT_SLUGS, IMAGES, SEGMENTS, getProductsBySlugs } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Center Frios — Equipamentos de Alta Performance para Gastronomia" },
      {
        name: "description",
        content:
          "Soluções em refrigeração comercial e equipamentos de alta performance para supermercados, restaurantes, redes, cozinhas industriais e hotéis.",
      },
      {
        property: "og:title",
        content: "Center Frios — Equipamentos de Alta Performance",
      },
      {
        property: "og:description",
        content: "Para o seu negócio não parar. Acredite em quem entende do seu setor.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = getProductsBySlugs(FEATURED_PRODUCT_SLUGS);

  return (
    <>
      {/* HERO */}
      <section className="tech-grid relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="flex flex-col items-center text-center">
            <span className="mb-6 inline-flex items-center rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
              Engenharia para gastronomia profissional
            </span>
            <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Soluções em Equipamentos de Alta Performance para seu negócio{" "}
              <span className="text-accent">não parar</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Refrigeração comercial e equipamentos robustos para quem não pode parar. Acredite em
              quem entende do seu setor.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <QuoteDialog
                source="home-hero"
                trigger={
                  <Button size="lg" className="rounded-full">
                    Solicite Orçamento
                  </Button>
                }
              />
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/produtos">
                  Ver catálogo <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mt-16 md:mt-20">
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-card outline outline-1 -outline-offset-1 outline-border">
              <img
                src={IMAGES.hero}
                alt="Equipamento profissional Center Frios em ambiente de cozinha industrial"
                width={1600}
                height={896}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -left-2 top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="rounded-lg border border-border bg-card/90 p-4 backdrop-blur-md">
                <div className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Performance
                </div>
                <div className="mt-1 text-2xl font-medium text-foreground">-18 °C constante</div>
                <div className="mt-1 text-xs text-muted-foreground">Recuperação térmica em 40s</div>
              </div>
            </div>
            <div className="absolute -right-2 bottom-6 hidden lg:block">
              <div className="rounded-lg border border-border bg-card/90 p-4 backdrop-blur-md">
                <div className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Eficiência
                </div>
                <div className="mt-1 text-2xl font-medium text-foreground">−38% kWh</div>
                <div className="mt-1 text-xs text-muted-foreground">vs. linha convencional</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-border md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Conformidade RDC 216 / NR-12",
              desc: "Equipamentos prontos para auditoria sanitária.",
            },
            {
              icon: Wrench,
              title: "Assistência técnica própria",
              desc: "Suporte em campo e reposição rápida de peças.",
            },
            {
              icon: Truck,
              title: "Entrega e instalação",
              desc: "Logística e montagem com equipe especializada.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 bg-background p-6">
              <item.icon className="mt-1 size-6 text-accent" />
              <div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEGMENTOS */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Segmentos"
              title="Soluções para cada operação"
              description="Equipamentos especificados para o ritmo e a escala do seu negócio."
            />
            <Link
              to="/segmentos"
              className="hidden text-sm font-semibold text-accent hover:underline md:inline"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {SEGMENTS.map((s) => (
              <SegmentCard key={s.slug} segment={s} />
            ))}
          </div>
        </div>
      </section>

      {/* PRODUTOS DESTAQUE */}
      <section className="border-y border-border py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Destaques"
              title="Equipamentos de alta performance"
              description="Linha campeã para regime de trabalho contínuo."
            />
            <Link
              to="/produtos"
              className="hidden text-sm font-semibold text-accent hover:underline md:inline"
            >
              Ver catálogo →
            </Link>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* AUTORIDADE */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 text-center md:grid-cols-3 md:text-left">
            <div>
              <div className="text-4xl font-semibold text-foreground md:text-5xl">+25 anos</div>
              <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                de mercado em refrigeração comercial
              </p>
            </div>
            <div>
              <div className="text-4xl font-semibold text-foreground md:text-5xl">3.200+</div>
              <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                clientes ativos atendidos
              </p>
            </div>
            <div>
              <div className="text-4xl font-semibold text-foreground md:text-5xl">100%</div>
              <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                cobertura de assistência técnica
              </p>
            </div>
          </div>

          <p className="mx-auto mt-16 max-w-3xl text-center text-xl font-medium leading-relaxed text-foreground md:text-2xl">
            “Nossa experiência e autoridade no mercado garantem a produtividade do seu negócio. Não
            pare sua operação — confie nos líderes em equipamentos para gastronomia.”
          </p>
        </div>
      </section>

      <CtaBanner source="home-bottom" />
    </>
  );
}
