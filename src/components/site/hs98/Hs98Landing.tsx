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
import { Badge } from "@/components/ui/badge";
import {
  HS98_IMAGES,
  HS98_HIGHLIGHTS,
  HS98_FEATURES,
  HS98_SPECS,
  HS98_PRICE,
  HS98_PROOF,
  HS98_COMPARISON,
  HS98_ROI,
  HS98_FAQ,
  HS98_TESTIMONIAL,
} from "@/data/hs98";
import { getProduct } from "@/data/site";
import { CheckoutSection } from "@/components/site/pa7/CheckoutSection";
import { Hs98Gallery } from "@/components/site/hs98/Hs98Gallery";

/* ──────────────────────────────────────────────────────────── HERO */
function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* Cinematic light layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* deep base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_60%)]" />
        {/* warm under-glow */}
        <div className="absolute bottom-[-30%] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#f59e0b40,transparent_70%)] blur-3xl" />
        {/* cool rim */}
        <div className="absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,#3b82f640,transparent_70%)] blur-3xl" />
        {/* conic spin */}
        <div
          className="absolute right-[-15%] top-[15%] h-[700px] w-[700px] rounded-full opacity-30 mix-blend-screen"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--accent) 30%, transparent) 60deg, transparent 180deg, color-mix(in oklab, #3b82f6 25%, transparent) 240deg, transparent 360deg)",
            animation: "spin 28s linear infinite",
            filter: "blur(40px)",
          }}
        />
        {/* grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-28 md:pb-32 md:pt-36 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Badge
            variant="outline"
            className="mb-6 border-accent/40 bg-accent/10 text-accent"
          >
            Linha Skymsen Profissional · Homogeneização contínua
          </Badge>
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            900 kg/h. Vermelho de vitrine.{" "}
            <span className="text-accent">Margem de volta no caixa.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Moedor comum entrega carne branca e até 12% de quebra no balcão.
            O HS-98 mói e homogeneíza no mesmo ciclo — devolve cada quilo
            como produto que vende pelo preço cheio.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full px-7 py-6 text-base font-semibold shadow-lg shadow-accent/20"
            >
              <a href="#roi">
                Ver quanto vou recuperar em margem
                <ArrowRight className="ml-2 size-5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-7 py-6 text-base font-semibold"
            >
              <a
                href="https://wa.me/558232232497?text=Olá! Quero conversar sobre o HS-98."
                target="_blank"
                rel="noreferrer"
              >
                Demonstração no meu PDV
              </a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Resposta em até 2h úteis · Atendimento técnico, não comercial · Sem compromisso
          </p>
        </div>

        {/* Hero visual — premium studio composition */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-[580px]">
            {/* rotating conic spotlight behind product */}
            <div
              aria-hidden
              className="absolute inset-[6%] rounded-full opacity-60 mix-blend-screen"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--accent) 40%, transparent) 80deg, transparent 180deg, color-mix(in oklab, #3b82f6 30%, transparent) 260deg, transparent 360deg)",
                animation: "spin 28s linear infinite",
                filter: "blur(36px)",
              }}
            />
            {/* warm halo */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 32%, transparent), transparent 70%)",
              }}
            />
            {/* cool rim halo */}
            <div
              aria-hidden
              className="absolute inset-[10%] rounded-full opacity-70 blur-2xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, #3b82f6 22%, transparent), transparent 70%)",
              }}
            />

            {/* concentric pedestal rings */}
            <div
              aria-hidden
              className="absolute inset-[4%] rounded-full border border-white/10"
            />
            <div
              aria-hidden
              className="absolute inset-[14%] rounded-full border border-white/[0.06]"
            />

            {/* product */}
            <motion.img
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              src={HS98_IMAGES.main}
              alt="Moedor Homogeneizador HS-98 Skymsen"
              className="relative z-10 h-full w-full object-contain"
              style={{
                filter:
                  "drop-shadow(0 24px 28px rgba(0,0,0,0.55)) drop-shadow(0 8px 12px rgba(0,0,0,0.4))",
              }}
              loading="eager"
              fetchPriority="high"
            />

            {/* contact shadow ellipse */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[6%] left-1/2 h-[8%] w-[60%] -translate-x-1/2 rounded-[50%]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 70%)",
                filter: "blur(8px)",
              }}
            />
          </div>

          {/* floating chip — pronta entrega */}
          <div className="absolute -bottom-2 left-2 z-20 flex items-center gap-3 rounded-2xl border border-accent/30 bg-card/70 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur-xl">
            <div className="relative grid place-items-center">
              <div className="absolute size-3 animate-ping rounded-full bg-emerald-400/60" />
              <div className="relative size-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-xs leading-tight">
              <div className="font-semibold text-foreground">Pronta entrega</div>
              <div className="text-muted-foreground">7 dias úteis · Brasil todo</div>
            </div>
          </div>

          {/* floating badge — compliance */}
          <div className="absolute -top-2 right-2 z-20 hidden items-center gap-2 rounded-full border border-white/10 bg-background/60 px-3.5 py-2 shadow-xl shadow-black/30 backdrop-blur-xl md:flex">
            <ShieldCheck className="size-3.5 text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">
              NR-12 · INMETRO
            </span>
          </div>
        </div>
      </div>

      {/* Proof bar */}
      <div className="border-t border-border bg-card/40 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-border px-6 py-6 sm:grid-cols-4 sm:divide-x">
          {HS98_PROOF.map((p) => (
            <div
              key={p.label}
              className="px-4 first:pl-0 sm:px-8 sm:first:pl-0"
            >
              <div className="flex items-baseline gap-1.5 tabular-nums">
                <span className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {p.value}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {p.unit}
                </span>
              </div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {p.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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

/* ──────────────────────────────────────────────────────── HIGHLIGHTS */
function Highlights() {
  return (
    <section className="border-b border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Coluna imagem + título */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
                Quatro decisões que mudam o sábado de manhã.
              </h2>
              <p className="mt-5 max-w-md text-sm text-muted-foreground md:text-base">
                Cada componente foi escolhido para suportar o regime mais duro
                do varejo brasileiro: pico de movimento, sem margem pra parada.
              </p>

            </div>
          </div>

          {/* Coluna cards 2x2 */}
          <div className="lg:col-span-7">
            <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2">
              {HS98_HIGHLIGHTS.map((h, idx) => (
                <div
                  key={h.title}
                  className="group relative bg-background p-8 transition-colors hover:bg-card"
                >
                  <div className="text-xs font-bold tabular-nums text-muted-foreground">
                    0{idx + 1}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                    {h.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {h.desc}
                  </p>
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
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
            Projetado para o regime contínuo das maiores indústrias e
            supermercados do país.
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
                <div className="text-xl font-semibold text-white">
                  Caçamba de 41 litros
                </div>
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
                Diferente dos moedores comuns, o sistema HS mistura a carne
                enquanto mói. A gordura é distribuída de forma uniforme,
                eliminando aquele aspecto de "carne branca" e entregando o
                vermelho vibrante que vende no PDV.
              </p>
              <ul className="mt-8 space-y-3">
                {HS98_FEATURES.productivity.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div className="mt-0.5 grid size-5 place-items-center rounded-full bg-accent/20 text-accent">
                      <Check className="size-3" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {f}
                    </span>
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
                Equipado com o Conjunto Único de Segurança Skymsen. Sensores e
                travas na tampa interrompem o motor instantaneamente — em
                conformidade total com a NR-12, sem perder agilidade no chão de
                fábrica.
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
            Moedor comum vs. HS-98 Skymsen.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Mesmo lote de carne. Dois resultados no balcão.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border">
          <div className="grid grid-cols-12 border-b border-border bg-card/60 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <div className="col-span-4 p-5">Critério</div>
            <div className="col-span-4 flex items-center gap-2 p-5">
              <TrendingDown className="size-4 text-muted-foreground" /> Moedor comum
            </div>
            <div className="col-span-4 flex items-center gap-2 bg-accent/10 p-5 text-accent">
              <TrendingUp className="size-4" /> HS-98 Skymsen
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
              <div className="col-span-4 p-5 text-sm text-muted-foreground">
                {row.common}
              </div>
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
              <div className="font-semibold text-foreground">
                {HS98_TESTIMONIAL.author}
              </div>
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
    <section
      id="roi"
      className="relative overflow-hidden border-b border-border py-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_30%,color-mix(in_oklab,var(--accent)_15%,transparent),transparent_60%)]"
      />
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            {HS98_ROI.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {HS98_ROI.body}
          </p>
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
                <div className="mt-1 text-4xl font-semibold tabular-nums text-foreground">
                  ~6%
                </div>
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
                  Com HS-98
                </div>
                <div className="mt-1 text-4xl font-semibold tabular-nums text-accent">
                  &lt; 1%
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Payback
                </div>
                <div className="mt-1 text-4xl font-semibold tabular-nums text-accent">
                  ~4 meses
                </div>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="mt-8 w-full rounded-full py-6 text-base font-semibold"
            >
              <a href="#checkout">
                Garantir o meu HS-98
                <ArrowRight className="ml-2 size-5" />
              </a>
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Estimativa baseada em operações reais. Solicite o memorial técnico
              para o seu cenário.
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
          Cada quilo mal apresentado{" "}
          <span className="text-accent">é margem indo embora</span>.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          Fale agora com um especialista técnico da Center Frios.
          A gente entende de operação de PDV — não vamos te empurrar
          uma máquina que não cabe no seu balcão.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-7 text-base font-semibold shadow-lg shadow-accent/30"
          >
            <a
              href="https://wa.me/558232232497?text=Olá! Quero falar com um especialista da Center Frios sobre o HS-98."
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
  const product = getProduct("moeder-homogeneizador-hs-98")!;

  return (
    <div className="bg-background text-foreground">
      <Hero />
      <Manifesto />
      <Highlights />
      <Showcase />
      <Comparison />
      <Hs98Gallery />
      <RoiBlock />
      <Specs />

      <div id="checkout">
        <CheckoutSection
          product={{
            id: product.slug,
            name: product.name,
            image: HS98_IMAGES.main,
            price: HS98_PRICE.amount,
            installments: HS98_PRICE.installments,
            pixDiscount: HS98_PRICE.pixDiscountPct,
          }}
        />
      </div>

      <Faq />
      <FinalCta />
    </div>
  );
}
