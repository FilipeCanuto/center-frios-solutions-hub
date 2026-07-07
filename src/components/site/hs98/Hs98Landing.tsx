import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ShieldCheck,
  ArrowRight,
  Phone,
  Clock,
  FileCheck,
  Truck,
  Wrench,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  HS98_IMAGES,
  HS98_FEATURES,
  HS98_SPECS,
  HS98_COMPARISON,
  HS98_ROI,
  HS98_FAQ,
  HS98_TESTIMONIAL,
} from "@/data/hs98";
import { Hs98Gallery } from "@/components/site/hs98/Hs98Gallery";
import { TechHero } from "@/components/site/hs98/TechHero";
import { UniversalBenefits } from "@/components/site/hs98/UniversalBenefits";
import { ModelBifurcation } from "@/components/site/hs98/ModelBifurcation";
import { Hs98TabuleiroSection } from "@/components/site/hs98/Hs98TabuleiroSection";

/* ──────────────────────────────────────────────────────── MANIFESTO */
function Manifesto() {
  return (
    <section className="relative overflow-hidden border-b border-border py-28 md:py-36">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_70%)]"
      />
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-balance text-3xl font-semibold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
          Não é um moedor. É a diferença entre vender a{" "}
          <span className="text-accent">R$ 39,90</span> ou rebaixar para{" "}
          <span className="text-muted-foreground line-through decoration-accent/60">R$ 29,90</span>{" "}
          às seis da tarde.
        </p>
        <div className="mx-auto mt-10 h-px w-24 bg-accent" />
        <p className="mt-6 text-sm uppercase tracking-[0.25em] text-muted-foreground">
          Sistema patenteado de homogeneização contínua · Skymsen
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── SHOWCASE */
function Showcase() {
  return (
    <section className="border-b border-border bg-card/30 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 max-w-2xl">
          <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Engenharia em cada detalhe.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Projetado para o regime contínuo das maiores indústrias e supermercados do país.
          </p>
        </div>

        <div className="space-y-32">
          {/* Feature 1 — asymmetric 7/5 */}
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-background shadow-2xl lg:col-span-7"
            >
              <img
                src={HS98_IMAGES.internal}
                alt="Caçamba interna em aço inox"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7">
                <div className="text-xl font-semibold text-white">Caçamba de 41 litros</div>
                <div className="mt-1 max-w-xs text-sm text-white/75">
                  Capacidade para até 31 kg de carne por ciclo de processamento.
                </div>
              </div>
            </motion.div>
            <div className="lg:col-span-5">
              <h3 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Homogeneização que valoriza o produto.
              </h3>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Diferente dos moedores comuns, o sistema HS mistura a carne enquanto mói. A gordura
                é distribuída de forma uniforme, eliminando aquele aspecto de "carne branca" e
                entregando o vermelho vibrante que vende no PDV.
              </p>
              <ul className="mt-8 space-y-3">
                {HS98_FEATURES.productivity.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className="mt-0.5 grid size-5 place-items-center rounded-full bg-accent/20 text-accent">
                      <Check className="size-3" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 2 — reverse asymmetric 5/7 */}
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:order-1 lg:col-span-5">
              <h3 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Segurança total, sem improviso.
              </h3>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Equipado com o Conjunto Único de Segurança Skymsen. Sensores e travas na tampa
                interrompem o motor instantaneamente — em conformidade total com a NR-12, sem perder
                agilidade no chão de fábrica.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-5">
                  <div className="flex items-center gap-2 text-foreground">
                    <ShieldCheck className="size-4 text-accent" />
                    <span className="text-sm font-semibold">Sensor magnético</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Interrupção imediata do ciclo ao abrir a tampa.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <div className="flex items-center gap-2 text-foreground">
                    <ShieldCheck className="size-4 text-accent" />
                    <span className="text-sm font-semibold">Trava mecânica</span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Bloqueio físico das partes móveis em operação.
                  </p>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-background shadow-2xl lg:order-2 lg:col-span-7"
            >
              <img
                src={HS98_IMAGES.switch}
                alt="Chave geral com bloqueio de segurança NR-12"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── COMPARISON */
function Comparison() {
  return (
    <section className="border-b border-border py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Moedor comum vs. Homogeneizador Skymsen.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Mesmo lote de carne. Dois resultados no balcão — vale para HS-22 e HS-98.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border">
          <div className="grid grid-cols-12 border-b border-border bg-card/60 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <div className="col-span-4 p-5">Critério</div>
            <div className="col-span-4 flex items-center gap-2 p-5">
              <TrendingDown className="size-4 text-muted-foreground" /> Moedor comum
            </div>
            <div className="col-span-4 flex items-center gap-2 bg-accent/10 p-5 text-accent">
              <TrendingUp className="size-4" /> Linha HS Skymsen
            </div>
          </div>
          {HS98_COMPARISON.map((row, i) => (
            <div
              key={row.point}
              className={`grid grid-cols-12 border-b border-border last:border-0 ${
                i % 2 === 0 ? "bg-background" : "bg-card/20"
              }`}
            >
              <div className="col-span-4 p-5 text-sm font-semibold text-foreground">
                {row.point}
              </div>
              <div className="col-span-4 p-5 text-sm text-muted-foreground">{row.common}</div>
              <div className="col-span-4 bg-accent/[0.04] p-5 text-sm font-medium text-foreground">
                {row.hs98}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <figure className="mt-14 rounded-3xl border border-border bg-card/40 p-8 md:p-12">
          <blockquote className="text-balance text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl">
            <span className="text-accent">"</span>
            {HS98_TESTIMONIAL.quote}
            <span className="text-accent">"</span>
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="size-10 rounded-full bg-gradient-to-br from-accent/40 to-accent/10" />
            <div>
              <div className="font-semibold text-foreground">{HS98_TESTIMONIAL.author}</div>
              <div>{HS98_TESTIMONIAL.role}</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── ROI */
function RoiBlock() {
  return (
    <section id="roi" className="relative overflow-hidden border-b border-border py-28">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_30%,color-mix(in_oklab,var(--accent)_15%,transparent),transparent_60%)]"
      />
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {HS98_ROI.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{HS98_ROI.body}</p>
          <ul className="mt-8 space-y-3">
            {HS98_ROI.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <div className="mt-0.5 grid size-5 place-items-center rounded-full bg-accent text-accent-foreground">
                  <Check className="size-3" strokeWidth={3} />
                </div>
                <span className="text-sm font-medium text-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-border bg-card/60 p-8 backdrop-blur-xl md:p-10">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Cenário típico — açougue 200 kg/dia
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Quebra atual
                </div>
                <div className="mt-1 text-4xl font-semibold tabular-nums text-foreground">~6%</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Perda mensal
                </div>
                <div className="mt-1 text-4xl font-semibold tabular-nums text-foreground">
                  R$ 11k
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Com homogeneizador
                </div>
                <div className="mt-1 text-4xl font-semibold tabular-nums text-accent">&lt; 1%</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Payback
                </div>
                <div className="mt-1 text-4xl font-semibold tabular-nums text-accent">~4 meses</div>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="mt-8 w-full rounded-full py-6 text-base font-semibold"
            >
              <a href="#bifurcacao">
                Escolher minha máquina
                <ArrowRight className="ml-2 size-5" />
              </a>
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Estimativa baseada em operações reais. Solicite o memorial técnico para o seu cenário.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── SPECS */
function Specs() {
  return (
    <section className="border-b border-border bg-card/10 py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-3">
        <div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Dados de engenharia.
          </h2>
          <p className="mt-5 text-muted-foreground">
            Use no memorial descritivo e no projeto elétrico antes da entrega.
          </p>
          <div className="mt-8 space-y-3 text-sm text-foreground">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-accent" />
              Certificação INMETRO · NR-12
            </div>
            <div className="flex items-center gap-3">
              <Wrench className="size-4 text-accent" />
              Assistência autorizada Skymsen em todo o Brasil
            </div>
            <div className="flex items-center gap-3">
              <Truck className="size-4 text-accent" />
              Logística refrigerada Center Frios
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
            {HS98_SPECS.map((s) => (
              <div key={s.label} className="bg-background p-6">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-2 text-lg font-semibold tabular-nums text-foreground">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── FAQ */
function Faq() {
  return (
    <section className="border-b border-border py-28">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Perguntas que recebemos do chão de fábrica.
        </h2>
        <Accordion type="single" collapsible className="mt-10">
          {HS98_FAQ.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── FINAL CTA */
function FinalCta() {
  return (
    <section className="relative overflow-hidden py-32">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_50%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)]"
      />
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Cada quilo mal apresentado <span className="text-accent">é margem indo embora</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          Fale agora com um especialista técnico da Center Frios. A gente entende de operação de PDV
          — não vamos te empurrar uma máquina que não cabe no seu balcão.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-7 text-base font-semibold shadow-lg shadow-accent/30"
          >
            <a
              href="https://wa.me/558232232497?text=Olá! Quero falar com um especialista da Center Frios sobre os homogeneizadores Skymsen HS-22 e HS-98."
              target="_blank"
              rel="noreferrer"
            >
              Falar agora com um especialista
              <ArrowRight className="ml-2 size-5" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-7 text-base font-semibold"
          >
            <a href="tel:+558232232497">
              <Phone className="mr-2 size-5" /> (82) 3223-2497
            </a>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
          {[
            { Icon: Truck, t: "Entrega em 7 dias úteis" },
            { Icon: FileCheck, t: "NF-e e CNPJ aceitos" },
            { Icon: ShieldCheck, t: "Garantia 12 meses em campo" },
            { Icon: Clock, t: "Atendimento técnico em 2h" },
          ].map(({ Icon, t }) => (
            <div
              key={t}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur"
            >
              <Icon className="mt-0.5 size-5 shrink-0 text-accent" />
              <span className="text-xs font-medium text-foreground">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── PAGE */
export function Hs98Landing() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Skymsen HS-98",
      brand: { "@type": "Brand", name: "Skymsen" },
      category: "Homogeneizador de Carne Industrial",
      image: [HS98_IMAGES.hero],
      description:
        "Homogeneizador industrial Skymsen HS-98 — 900 kg/h, caçamba 41 L, motor 3 CV, sistema patenteado, NR-12.",
      sku: "hs-98",
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: HS98_PRICE.amount.toFixed(2),
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "CENTERFRIOS" },
        url: "https://ofertas.centerfrios.com/produtos/homogeneizador-hs-98-skymsen",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "CENTERFRIOS",
      image: "https://ofertas.centerfrios.com/favicon.png",
      url: "https://ofertas.centerfrios.com",
      telephone: "+55-82-3223-2497",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Maceió",
        addressLocality: "Maceió",
        addressRegion: "AL",
        addressCountry: "BR",
      },
      geo: { "@type": "GeoCoordinates", latitude: -9.6658, longitude: -35.7353 },
    },
  ];

  return (
    <div className="bg-background text-foreground">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TechHero />
      <Manifesto />
      <UniversalBenefits />
      <Showcase />
      <Comparison />
      <Hs98TabuleiroSection />
      <Hs98Gallery />
      <RoiBlock />
      <Specs />
      <ModelBifurcation />
      <Faq />
      <FinalCta />
    </div>
  );
}
