import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

import {
  Check,
  MapPin,
  MessageCircle,
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
const CheckoutDialog = lazy(() =>
  import("./CheckoutDialog").then((m) => ({ default: m.CheckoutDialog })),
);
import { CheckoutSection } from "./CheckoutSection";
import { FaqPa7 } from "./FaqPa7";
import { LazyVideo } from "./LazyVideo";
import { HardwareGrid } from "./HardwareGrid";
import { UgcWall } from "./UgcWall";
import { CrossSellConfigurator } from "./CrossSellConfigurator";

import versatilidadeVideo from "@/assets/pa7/videos/versatilidade.mp4.asset.json";
import circuitoVideo from "@/assets/pa7/videos/circuito-experience.mp4.asset.json";
import calabresaVideo from "@/assets/pa7/videos/calabresa.mp4.asset.json";
import batataVideo from "@/assets/pa7/videos/batata-fatiada.mp4.asset.json";

import {
  PA7_GALLERY,
  PA7_HIGHLIGHTS,
  PA7_IMAGES,
  PA7_INCLUDED_DISCS,
  PA7_OPTIONAL_DISCS,
  PA7_PRICE,
  PA7_SHOWCASE,
} from "@/data/pa7";
import { SALES_WHATSAPP, STORE_WHATSAPP, getProduct, whatsappLink } from "@/data/site";
import { ecommerce, pushEvent, trackWhatsappClick } from "@/lib/tracking";
import { formatBRL } from "@/lib/pricing";

export const PA7_WHATSAPP_MESSAGE = `Olá, ${SALES_WHATSAPP.name}! Tenho interesse no Processador PA7 Pro Skymsen.`;

const HIGHLIGHT_ICONS = [Gauge, Disc3, ShieldCheck, Power];

const SITE_URL = "https://ofertas.centerfrios.com";

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

  // Topo de funil: GA4 `view_item` ao abrir a landing.
  useEffect(() => {
    pushEvent(
      "view_item",
      ecommerce(PA7_PRICE.amount, [
        {
          item_id: "pa7-pro",
          item_name: "Processador PA7 Pro Skymsen",
          item_brand: "Skymsen",
          item_category: "Processador de Alimentos",
          price: PA7_PRICE.amount,
        },
      ]),
    );
  }, []);

  const selectedAddons = selectedOptionalDiscs
    .map((code) => PA7_OPTIONAL_DISCS.find((x) => x.code === code))
    .filter((d): d is (typeof PA7_OPTIONAL_DISCS)[number] => Boolean(d))
    .map((d) => ({ code: d.code, label: `${d.group} ${d.code} (${d.desc})`, price: d.price }));

  const additionalTotal = selectedOptionalDiscs.reduce((acc, code) => {
    const d = PA7_OPTIONAL_DISCS.find((x) => x.code === code);
    return acc + (d?.price ?? 0);
  }, 0);
  const discsGridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: discsScrollProgress } = useScroll({
    target: discsGridRef,
    offset: ["start end", "end start"],
  });
  const installment = formatBRL(PA7_PRICE.installmentValue);
  const totalBRL = formatBRL(PA7_PRICE.amount);
  const pixBRL = formatBRL(PA7_PRICE.pixAmount);
  const savingsBRL = formatBRL(PA7_PRICE.savings);

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

  const jsonLd = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Skymsen PA7 Pro",
        brand: { "@type": "Brand", name: "Skymsen" },
        category: "Processador de Alimentos Industrial",
        image: [`${SITE_URL}${PA7_IMAGES.main}`],
        description:
          "Processador de alimentos profissional Skymsen PA7 Pro — 250 kg/h, 07 discos inclusos, bivolt, aço inox, NR-12.",
        sku: "702609",
        gtin13: "7895707702608",
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: PA7_PRICE.pixAmount.toFixed(2),
          priceValidUntil: `${new Date().getFullYear()}-12-31`,
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "CENTERFRIOS" },
          url: "https://ofertas.centerfrios.com/produtos/processador-pa7-pro-skymsen",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "CENTERFRIOS",
        image: `${SITE_URL}/favicon.png`,
        url: SITE_URL,
        telephone: "+55-82-3223-2497",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Maceió",
          addressRegion: "AL",
          addressCountry: "BR",
        },
        geo: { "@type": "GeoCoordinates", latitude: -9.6658, longitude: -35.7353 },
      },
    ],
    [],
  );

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* HERO — sem animação de entrada: o conteúdo já chega visível do servidor */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 tech-grid opacity-20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
          style={{
            background:
              "radial-gradient(80% 50% at 50% 0%, color-mix(in oklab, var(--brand-blue) 26%, transparent), transparent 70%)",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-14 pt-6 sm:px-6 md:pb-24 md:pt-12 lg:grid-cols-[1.15fr_1fr] lg:gap-x-16">
          {/* A — Título */}
          <div className="lg:col-start-1 lg:row-start-1">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="size-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                Skymsen · Linha Profissional
              </span>
            </div>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Processador de Alimentos{" "}
              <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                PA7 Pro Skymsen
              </span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Até 250 kg/h de legumes, queijos e frios cortados em segundos — fatias, ralados,
              palitos e cubos padronizados, sem depender da faca.
            </p>
          </div>

          {/* B — Oferta (no mobile vem logo após o título) */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="metal-surface relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-start gap-4">
                <img
                  src={PA7_IMAGES.main}
                  alt="Processador PA7 Pro Skymsen em aço inox"
                  width={112}
                  height={112}
                  fetchPriority="high"
                  className="size-24 shrink-0 rounded-xl bg-white/[0.04] object-contain p-1.5 sm:size-28"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">
                    À vista no PIX · 5% off
                  </p>
                  <p className="mt-1 text-4xl font-black leading-none tracking-tight text-foreground md:text-5xl">
                    {pixBRL}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-emerald-400">
                    Você economiza {savingsBRL}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-base text-foreground">
                  ou <strong>{PA7_PRICE.installments}x de {installment}</strong> sem juros
                </p>
                <p className="text-sm text-muted-foreground">no cartão · total {totalBRL}</p>
              </div>

              <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
                <Truck className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                <p className="text-sm text-emerald-100">
                  <strong className="text-emerald-300">Frete grátis para todo o estado de Alagoas.</strong>{" "}
                  Pronta entrega. Demais estados: R$ 89,90.
                </p>
              </div>

              <div className="mt-5 grid gap-3">
                <Button
                  size="lg"
                  variant="conversion"
                  className="h-14 w-full text-base"
                  onClick={() => setOpen(true)}
                  id="cta-buy-pa7-hero"
                >
                  Comprar agora
                  <ChevronRight className="ml-1 size-5" />
                </Button>
                <a
                  href={whatsappLink(PA7_WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWhatsappClick("hero")}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--color-brand-whatsapp)]/50 bg-[var(--color-brand-whatsapp)]/10 px-4 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--color-brand-whatsapp)]/20"
                >
                  <MessageCircle className="size-4 text-[color:var(--color-brand-whatsapp)]" />
                  Tirar dúvidas com a {SALES_WHATSAPP.name} no WhatsApp
                </a>
              </div>

              <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-accent" /> Nota fiscal
                </span>
                <span className="inline-flex items-center gap-1">
                  <Wrench className="size-3.5 text-accent" /> Garantia 12 meses
                </span>
                <span className="inline-flex items-center gap-1">
                  <Check className="size-3.5 text-accent" /> Pagamento seguro e-Rede
                </span>
              </p>
            </div>
          </div>

          {/* C — Benefícios e confiança */}
          <div className="lg:col-start-1 lg:row-start-2">
            <ul className="grid gap-3">
              {[
                "Produção contínua de até 250 kg/h · motor 0,5 CV · 600 W",
                "07 discos inclusos: fatiadores, raladores e julienne (palito)",
                "Cubos perfeitos com grades opcionais de 8 a 20 mm",
                "Aço inox, sensor de segurança na tampa (NR-12) e bivolt 127/220 V",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-base text-foreground">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent">
                    <Check className="size-3" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin className="size-4 text-accent" /> Center Frios · Maceió, Alagoas
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Empresa alagoana: entrega grátis em todo o estado e suporte técnico próprio em
                campo, durante e depois da garantia. Dúvidas gerais: loja{" "}
                <a
                  href={`https://wa.me/${STORE_WHATSAPP.number}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWhatsappClick("hero_loja")}
                  className="font-medium text-foreground underline underline-offset-2"
                >
                  {STORE_WHATSAPP.display}
                </a>
                .
              </p>
            </div>
          </div>

          {/* D — Demonstração em vídeo */}
          <div className="lg:col-start-2 lg:row-start-3">
            <LazyVideo
              src={circuitoVideo.url}
              poster={PA7_IMAGES.main}
              aspect="aspect-[9/16]"
              showMuteToggle
              variant="phone"
            />
            <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Demonstração · Circuito Experience 2026
            </p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="border-b border-white/5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl">
            <Gallery items={PA7_GALLERY} />
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
            Quer cubos? Adicione grades de cubo (GC8 a GC20) e fatiadores extras no
            configurador abaixo — eles entram no mesmo pedido.
          </motion.p>
        </div>
      </section>

      {/* SPECS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden border-t border-white/5 py-20 md:py-28"
      >
        <div className="relative z-20 mx-auto max-w-6xl px-6">
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
              Para quem é
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Feito para cozinhas que não podem parar
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

      {/* CHECKOUT SECTION — success handled globally at /obrigado via redirect */}
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
        onBuy={() => setOpen(true)}
      />

      <StickyBuyBar
        name="PA7 Pro Skymsen"
        image={PA7_IMAGES.main}
        price={PA7_PRICE.amount}
        pixPrice={PA7_PRICE.pixAmount}
        additionalTotal={additionalTotal}
        onBuy={() => setOpen(true)}
      />

      {open && (
        <Suspense fallback={null}>
          <CheckoutDialog
            open={open}
            onOpenChange={setOpen}
            product={{
              slug: product.slug,
              name: "Processador de Alimentos PA7 Pro Skymsen",
              image: PA7_IMAGES.main,
              price: PA7_PRICE.amount,
            }}
            addons={selectedAddons}
          />
        </Suspense>
      )}

    </>
  );
}
