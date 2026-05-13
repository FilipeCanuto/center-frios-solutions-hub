import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Beef,
  Carrot,
  Check,
  ChevronRight,
  Disc3,
  Gauge,
  Pizza,
  Power,
  Salad,
  ShieldCheck,
  
  Truck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpecGrid } from "@/components/site/SpecGrid";
import { Gallery } from "./Gallery";
import { Showcase } from "./Showcase";
import { StickyBuyBar } from "./StickyBuyBar";
import { CheckoutDialog } from "./CheckoutDialog";
import { FaqPa7 } from "./FaqPa7";
import {
  PA7_GALLERY,
  PA7_HIGHLIGHTS,
  PA7_IMAGES,
  PA7_INCLUDED_DISCS,
  PA7_PRICE,
  PA7_SHOWCASE,
  PA7_USE_CASES,
} from "@/data/pa7";
import { getProduct } from "@/data/site";

const HIGHLIGHT_ICONS = [Gauge, Disc3, ShieldCheck, Power];
const USE_CASE_ICONS = { Pizza, Beef, Salad, Carrot } as const;

export function Pa7ProLanding() {
  const product = getProduct("processador-pa7-pro-skymsen")!;
  const [open, setOpen] = useState(false);
  const installment = (PA7_PRICE.amount / PA7_PRICE.installments).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const totalBRL = PA7_PRICE.amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 tech-grid opacity-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--brand-blue) 24%, transparent), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 md:pb-24 md:pt-12">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Catálogo
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Gallery items={PA7_GALLERY} />

            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">
                <span className="size-1.5 rounded-full bg-accent" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                  Skymsen · Linha Profissional
                </span>
              </div>

              <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
                Processador de Alimentos{" "}
                <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                  PA7 Pro Skymsen
                </span>
              </h1>
              <p className="mt-3 text-base font-medium uppercase tracking-[0.18em] text-accent">
                O melhor que a sua cozinha merece
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Cortes precisos e sem esforço, alta produtividade e grande variedade de cortes —
                agora também em cubos e palitos (julienne).
              </p>

              <ul className="mt-6 grid gap-2.5">
                {[
                  "Produção contínua de até 250 kg/h · 600 W · 440 rpm",
                  "07 discos com suporte inclusos (fatiadores, raladores e julienne)",
                  "Aço inox, sensor de segurança na tampa e bivolt 127/220 V",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
                      À vista no PIX
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-foreground md:text-4xl">
                      {(PA7_PRICE.amount * 0.95).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      ou {totalBRL} em até{" "}
                      <strong className="text-foreground">
                        {PA7_PRICE.installments}x de {installment}
                      </strong>{" "}
                      sem juros
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Button
                    size="lg"
                    className="w-full rounded-full sm:w-auto sm:flex-1"
                    onClick={() => setOpen(true)}
                  >
                    Comprar agora
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full sm:w-auto"
                  >
                    <a href="https://wa.me/558232232497" target="_blank" rel="noreferrer">
                      Falar com especialista
                    </a>
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                {[
                  { icon: ShieldCheck, label: "NR-12" },
                  { icon: Wrench, label: "Garantia 12m" },
                  { icon: Truck, label: "Entrega Brasil" },
                  { icon: Power, label: "127/220 V" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
                  >
                    <Icon className="size-4 text-accent" /> {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="border-b border-white/5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Por que o PA7 Pro
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Engenharia profissional em cada detalhe
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PA7_HIGHLIGHTS.map((h, i) => {
              const Icon = HIGHLIGHT_ICONS[i];
              return (
                <div
                  key={h.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 60%, transparent), transparent 70%)",
                    }}
                  />
                  <Icon className="size-7 text-accent" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      {PA7_SHOWCASE.map((item, i) => (
        <Showcase key={i} item={item} reverse={i % 2 === 1} />
      ))}

      {/* INCLUDED DISCS */}
      <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 tech-grid opacity-30"
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Já vem completo
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              07 discos com suporte inclusos
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Pronto para fatiar, ralar e cortar em palitos desde o primeiro dia. Disco de 203 mm
              de diâmetro, fixados em suporte para troca rápida.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-7">
            {PA7_INCLUDED_DISCS.map((d) => (
              <div
                key={d.code}
                className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.07]"
              >
                <div
                  className="relative grid size-16 place-items-center rounded-full border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-inner"
                  aria-hidden
                >
                  <div
                    className="absolute inset-1 rounded-full border border-white/10"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--brand-blue) 22%, transparent), transparent 70%)",
                    }}
                  />
                  <span className="relative text-base font-bold tracking-tight text-foreground">
                    {d.code}
                  </span>
                </div>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-accent">
                  {d.group}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{d.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Grades de cubo (GC8, GC10, GC14 e GC20 PRO) e discos adicionais disponíveis sob
            consulta.
          </p>
        </div>
      </section>

      {/* SPECS */}
      <section className="border-t border-white/5 py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
                Ficha técnica
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Especificações completas
              </h2>
            </div>
          </div>
          <div className="mt-8">
            <SpecGrid specs={product.specs} columns={3} />
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="border-t border-white/5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Ideal para o seu negócio
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Os cortes certos para cada operação
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Combinações de discos recomendadas pela Skymsen para os principais segmentos.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PA7_USE_CASES.map((u) => {
              const Icon = USE_CASE_ICONS[u.icon as keyof typeof USE_CASE_ICONS];
              return (
                <div
                  key={u.name}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 55%, transparent), transparent 70%)",
                    }}
                  />
                  <Icon className="size-7 text-accent" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{u.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {u.discs.map((d) => (
                      <span
                        key={d}
                        className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[11px] font-semibold text-foreground"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* APPLICATIONS */}
      {product.applications && (
        <section className="border-t border-white/5 py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
              Onde já está em operação
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Para operações que exigem padrão
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {product.applications.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20"
                >
                  <ChevronRight className="mt-0.5 size-5 text-accent" />
                  <span className="text-sm text-foreground">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      <FaqPa7 />

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 50%, color-mix(in oklab, var(--brand-blue) 22%, transparent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl md:p-12">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Pronto para acelerar o pré-preparo da sua cozinha?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              Compre online com nota fiscal, garantia de fábrica e suporte técnico próprio em
              campo da Center Frios.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="rounded-full px-8" onClick={() => setOpen(true)}>
                Comprar agora
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <a href="https://wa.me/558232232497" target="_blank" rel="noreferrer">
                  Falar com especialista
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <StickyBuyBar
        name="PA7 Pro Skymsen"
        image={PA7_IMAGES.main}
        price={PA7_PRICE.amount}
        onBuy={() => setOpen(true)}
      />

      <CheckoutDialog
        open={open}
        onOpenChange={setOpen}
        product={{
          name: "Processador de Alimentos PA7 Pro Skymsen",
          image: PA7_IMAGES.main,
          price: PA7_PRICE.amount,
        }}
      />
    </>
  );
}
