import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

import {
  ArrowLeft,
  Check,
  ChevronRight,
  Disc3,
  Gauge,
  Power,
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
import { CheckoutSection } from "./CheckoutSection";
import { FaqPa7 } from "./FaqPa7";
import { LazyVideo } from "./LazyVideo";
import { HardwareGrid } from "./HardwareGrid";
import { UgcWall } from "./UgcWall";
import { CrossSellConfigurator } from "./CrossSellConfigurator";
import { SectionVideoBg } from "./SectionVideoBg";
import { OptimizedVideoBg } from "./OptimizedVideoBg";
import heroPoster from "@/assets/products/pa7-pro/main.png";
import heroVideo from "@/assets/pa7/videos/hero-processador.mp4.asset.json";
import versatilidadeVideo from "@/assets/pa7/videos/versatilidade.mp4.asset.json";
import circuitoVideo from "@/assets/pa7/videos/circuito-experience.mp4.asset.json";
import calabresaVideo from "@/assets/pa7/videos/calabresa.mp4.asset.json";

import {
  PA7_GALLERY,
  PA7_HIGHLIGHTS,
  PA7_IMAGES,
  PA7_INCLUDED_DISCS,
  PA7_OPTIONAL_DISCS,
  PA7_PRICE,
  PA7_SHOWCASE,
} from "@/data/pa7";
import { getProduct } from "@/data/site";

const HIGHLIGHT_ICONS = [Gauge, Disc3, ShieldCheck, Power];

type TurbineDiscProps = {
  disc: { code: string; group: string; desc: string; image?: string; utility?: string };
  index: number;
  scrollYProgress: MotionValue<number>;
  itemVariants: Record<string, unknown>;
};

function TurbineDisc({ disc, index, scrollYProgress, itemVariants }: TurbineDiscProps) {
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180 + index * 35]);
  const hasImage = !!disc.image;
  return (
    <motion.div
      variants={itemVariants as never}
      className="group metal-surface metal-hover relative flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-500 hover:border-accent/40 hover:bg-white/[0.07] hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)]"
    >
      <div className="relative grid size-20 place-items-center rounded-full" aria-hidden>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 55%, color-mix(in oklab, var(--brand-blue) 28%, transparent), transparent 70%)",
          }}
        />
        {hasImage ? (
          <motion.img
            src={disc.image as string}
            alt={`Disco ${disc.code} — ${disc.group} ${disc.desc}`}
            loading="lazy"
            decoding="async"
            style={{ rotate }}
            className="relative size-20 object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)] will-change-transform motion-reduce:rotate-0"
          />
        ) : (
          <span className="relative text-base font-bold tracking-tight text-foreground">
            {disc.code}
          </span>
        )}
      </div>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-accent">
        {disc.group}
      </p>
      <p className="mt-1 text-center text-sm font-semibold text-foreground">
        {disc.code} <span className="text-xs font-normal text-muted-foreground">· {disc.desc}</span>
      </p>
      {disc.utility && (
        <p className="mt-2 text-center text-[11px] leading-snug text-muted-foreground/90">
          {disc.utility}
        </p>
      )}
    </motion.div>
  );
}


export function Pa7ProLanding() {
  const product = getProduct("processador-pa7-pro-skymsen")!;
  const [open, setOpen] = useState(false);
  const [selectedOptionalDiscs, setSelectedOptionalDiscs] = useState<string[]>([]);
  const additionalTotal = selectedOptionalDiscs.reduce((acc, code) => {
    const d = PA7_OPTIONAL_DISCS.find((x) => x.code === code);
    return acc + (d?.price ?? 0);
  }, 0);
  const discsGridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: discsScrollProgress } = useScroll({
    target: discsGridRef,
    offset: ["start end", "end start"],
  });
  const installment = PA7_PRICE.installmentValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const totalBRL = PA7_PRICE.amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const pixBRL = PA7_PRICE.pixAmount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const savingsBRL = PA7_PRICE.savings.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number] },
    },
  };

  return (
    <>
      {/* HERO */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden border-b border-white/5"
      >
        <SectionVideoBg src={heroVideo.url} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 tech-grid opacity-20 animate-pulse"
          style={{ animationDuration: "10s" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[500px]"
          style={{
            background:
              "radial-gradient(80% 50% at 50% 0%, color-mix(in oklab, var(--brand-blue) 26%, transparent), transparent 70%)",
          }}
        />

        <div className="relative z-20 mx-auto max-w-7xl px-6 pb-16 pt-8 md:pb-24 md:pt-12">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Catálogo
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:items-start">
            {/* LEFT — Conversion copy + benefits + trust */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur"
              >
                <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">
                  Skymsen · Linha Profissional
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
              >
                Processador de Alimentos{" "}
                <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                  PA7 Pro Skymsen
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="mt-3 text-base font-medium uppercase tracking-[0.18em] text-accent"
              >
                O melhor que a sua cozinha merece
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="mt-4 text-lg leading-relaxed text-muted-foreground"
              >
                Cortes precisos e sem esforço, alta produtividade e grande variedade de cortes —
                agora também em cubos e palitos (julienne).
              </motion.p>

              <motion.ul variants={itemVariants} className="mt-6 grid gap-3">
                {[
                  "Produção contínua de até 250 kg/h · 600 W · 440 rpm",
                  "07 discos com suporte inclusos (fatiadores, raladores e julienne)",
                  "Aço inox, sensor de segurança na tampa e bivolt 127/220 V",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
                    <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20 text-accent">
                      <Check className="size-3" />
                    </div>
                    <span className="ml-1">{b}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div
                variants={itemVariants}
                className="mt-7 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4"
              >
                {[
                  { icon: ShieldCheck, label: "NR-12" },
                  { icon: Wrench, label: "Garantia 12m" },
                  { icon: Truck, label: "Entrega Brasil" },
                  { icon: Power, label: "127/220 V" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="group flex items-center gap-2 rounded-xl border border-white/5 bg-neutral-900/40 px-4 py-2 text-xs font-medium tracking-wide text-foreground/90 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:border-accent/30 hover:bg-neutral-900/60"
                  >
                    <Icon className="size-3.5 text-accent transition-transform group-hover:scale-110" />
                    <span className="uppercase tracking-[0.12em]">{label}</span>
                  </div>
                ))}

              </motion.div>
            </motion.div>

            {/* RIGHT — Circuito Experience video + Pricing card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5 lg:sticky lg:top-24"
            >
              {/* Premium smartphone-mockup video frame */}
              <div className="relative mx-auto w-full">
                <LazyVideo
                  src={circuitoVideo.url}
                  aspect="aspect-[9/16]"
                  showMuteToggle
                  variant="phone"
                />
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Ao vivo · Circuito Experience 2026
                  </span>
                </div>
              </div>


              {/* Pricing Card */}
              <div className="metal-surface metal-hover relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full opacity-15 blur-2xl"
                  style={{ background: "radial-gradient(circle, var(--accent) 50%, transparent)" }}
                />
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    PREÇO À VISTA NO PIX
                  </p>
                  <p className="mt-1.5 text-4xl md:text-5xl font-black text-foreground tracking-tighter leading-none">
                    {pixBRL}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                      Economia imediata de {savingsBRL} no PIX
                    </span>
                  </div>

                  <div className="mt-5 border-t border-white/5 pt-4 opacity-90">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      OU PARCELADO NO CARTÃO
                    </p>
                    <p className="mt-1 text-base font-medium text-muted-foreground">{totalBRL}</p>
                    <p className="mt-0.5 text-sm text-foreground/80">
                      Ou em até {PA7_PRICE.installments}x de {installment} sem juros no cartão
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button
                      size="lg"
                      variant="conversion"
                      className="w-full sm:flex-1 group/btn"
                      onClick={() => setOpen(true)}
                    >
                      Ir para o checkout
                      <ChevronRight className="ml-1 size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full rounded-full sm:w-auto font-semibold"
                    >
                      <a
                        href="https://wa.me/558232232497?text=Olá! Tenho interesse no Processador PA7 Pro Skymsen."
                        target="_blank"
                        rel="noreferrer"
                      >
                        Falar com especialista
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* GALLERY */}
      <section className="border-b border-white/5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <Gallery items={PA7_GALLERY} />
            <LazyVideo
              src={heroVideo.url}
              aspect="aspect-video"
              showMuteToggle
              variant="monitor"
            />
          </div>
        </div>
      </section>


      {/* HIGHLIGHTS */}
      <section className="relative overflow-hidden border-b border-white/5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.span
              variants={itemVariants}
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent"
            >
              Por que o PA7 Pro
            </motion.span>
            <motion.h2
              variants={itemVariants}
              className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
            >
              Engenharia profissional em cada detalhe
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {PA7_HIGHLIGHTS.map((h, i) => {
              const Icon = HIGHLIGHT_ICONS[i];
              return (
                <motion.div
                  key={h.title}
                  variants={itemVariants}
                  className="group metal-surface metal-hover relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-500 hover:border-accent/40 hover:bg-white/[0.06] hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle, color-mix(in oklab, var(--brand-blue) 60%, transparent), transparent 70%)",
                    }}
                  />
                  <div className="relative z-10 flex size-12 items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="relative z-10 mt-5 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
                    {h.title}
                  </h3>
                  <p className="relative z-10 mt-2 text-sm leading-relaxed text-muted-foreground">
                    {h.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SHOWCASE */}
      {PA7_SHOWCASE.map((item, i) => (
        <Showcase key={i} item={item} reverse={i % 2 === 1} />
      ))}

      {/* HARDWARE ENGINEERING INTERACTIVE GRID */}
      <HardwareGrid />

      {/* INCLUDED DISCS */}
      <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-28">
        <SectionVideoBg src={calabresaVideo.url} maskClassName="pointer-events-none absolute inset-0 z-10 bg-neutral-950/85 backdrop-blur-[2px]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand-blue)_8%,transparent),transparent_80%)] opacity-50"
        />

        <div className="relative z-20 mx-auto max-w-7xl px-6">
          <div className="mb-16 grid items-center gap-12 md:grid-cols-[auto_1fr] md:gap-16">
            <div className="relative">
              <LazyVideo
                src={versatilidadeVideo.url}
                aspect="aspect-[9/16]"
                showMuteToggle
                variant="phone"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
                Versatilidade em ação
              </span>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                Do palito de batata à folha mais delicada — em segundos
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Um único equipamento substitui horas de preparo manual: batata palha,
                vegetais folhosos e mix para vinagrete, sem trocar de máquina.
              </p>
              <ul className="mt-5 grid gap-2 text-sm text-foreground">
                {["Batata palha contínua", "Folhas e verduras delicadas", "Mix para vinagrete em segundos"].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                      <Check className="size-3" />
                    </div>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.span
              variants={itemVariants}
              className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent"
            >
              Já vem completo
            </motion.span>
            <motion.h2
              variants={itemVariants}
              className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
            >
              07 discos com suporte inclusos
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-3 text-base text-muted-foreground">
              Pronto para fatiar, ralar e cortar em palitos desde o primeiro dia. Discos de 203 mm
              de diâmetro, fixados em suporte para troca rápida.
            </motion.p>
          </motion.div>

          <motion.div
            ref={discsGridRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-7"
          >
            {PA7_INCLUDED_DISCS.map((d, i) => (
              <TurbineDisc
                key={d.code}
                disc={d}
                index={i}
                scrollYProgress={discsScrollProgress}
                itemVariants={itemVariants}
              />
            ))}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-xs text-muted-foreground"
          >
            Grades de cubo (GC8, GC10, GC14 e GC20 PRO) e discos adicionais disponíveis sob
            consulta.
          </motion.p>
        </div>
      </section>

      {/* SPECS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-white/5 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-6">
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
      </motion.section>

      {/* USE CASES — Pre-Checkout Configurator */}
      <section className="relative overflow-hidden border-t border-white/5">
        <SectionVideoBg src={versatilidadeVideo.url} />
        <div className="relative z-20">
          <CrossSellConfigurator
            selected={selectedOptionalDiscs}
            onChange={setSelectedOptionalDiscs}
          />
        </div>
      </section>



      {/* APPLICATIONS */}
      {product.applications && (
        <section className="border-t border-white/5 py-20 md:py-28">
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
                    className="metal-hover flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20"
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

      {/* IMMERSIVE PRE-CHECKOUT — Slot D (Calabresa) */}
      <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand-blue)_10%,transparent),transparent_75%)] opacity-60"
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-16">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
                Velocidade industrial
              </span>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Calabresa fatiada em segundos — sem esforço
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Ritmo de produção real numa pizzaria. O PA7 Pro transforma minutos de faca em
                segundos de máquina — fatias uniformes, cortes precisos, padronização absoluta.
              </p>
              <ul className="mt-6 grid gap-2.5 text-sm text-foreground">
                {[
                  "Bocal extra largo · alimentação contínua",
                  "Fatias uniformes para padronização do produto final",
                  "Higiene simplificada · câmara injetada em aço inox",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                      <Check className="size-3" />
                    </div>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <LazyVideo
                src={calabresaVideo.url}
                aspect="aspect-[9/16]"
                showMuteToggle
                variant="phone"
              />
            </div>
          </div>
        </div>
      </section>

      {/* UGC VIDEO TESTIMONIAL WALL */}
      <UgcWall />

      {/* CHECKOUT SECTION */}
      <CheckoutSection
        product={{
          id: product.slug,
          name: product.name,
          image: PA7_IMAGES.main,
          price: PA7_PRICE.amount,
          installments: PA7_PRICE.installments,
          installmentValue: PA7_PRICE.installmentValue,
          pixDiscount: PA7_PRICE.pixDiscountPct,
          pixPrice: PA7_PRICE.pixAmount,
          savings: PA7_PRICE.savings,
          subtitle: "Linha Industrial · Bivolt",
        }}
        selectedOptionalDiscs={selectedOptionalDiscs}
        additionalTotal={additionalTotal}
      />


      <StickyBuyBar
        name="PA7 Pro Skymsen"
        image={PA7_IMAGES.main}
        price={PA7_PRICE.amount}
        pixPrice={PA7_PRICE.pixAmount}
        additionalTotal={additionalTotal}
        onBuy={() => setOpen(true)}
      />

      <CheckoutDialog
        open={open}
        onOpenChange={setOpen}
        product={{
          slug: product.slug,
          name: "Processador de Alimentos PA7 Pro Skymsen",
          image: PA7_IMAGES.main,
          price: PA7_PRICE.amount,
        }}
      />
    </>
  );
}
