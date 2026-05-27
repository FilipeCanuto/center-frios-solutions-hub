import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HS22_IMAGES } from "@/data/hs22";
import { HS98_IMAGES } from "@/data/hs98";

interface Hotspot {
  id: string;
  x: string;
  y: string;
  title: string;
  description: string;
  placement: "left" | "right" | "top" | "bottom";
  product: "hs22" | "hs98";
}

// Coordinates relative to the stage container.
// HS-22 sits on the LEFT (~25% center), HS-98 on the RIGHT (~72% center).
const HOTSPOTS: Hotspot[] = [
  // HS-98 (right, dominant)
  {
    id: "hs98-body",
    x: "72%",
    y: "26%",
    title: "Aço Inox AISI 304",
    description: "Construção ultra robusta com cavalete integrado para operação intensa 24/7.",
    placement: "left",
    product: "hs98",
  },
  {
    id: "hs98-safety",
    x: "82%",
    y: "48%",
    title: "Segurança NR-12",
    description: "Chave geral selada IP54 e sensores redundantes de interrupção instantânea.",
    placement: "left",
    product: "hs98",
  },
  {
    id: "hs98-capacity",
    x: "68%",
    y: "68%",
    title: "Caçamba de 41 L",
    description: "Homogeneização de 31 kg de carne por ciclo. Acaba com a quebra de cor.",
    placement: "left",
    product: "hs98",
  },
  // HS-22 (left, smaller)
  {
    id: "hs22-lid",
    x: "26%",
    y: "44%",
    title: "Tampa Translúcida",
    description: "Inspeção em tempo real da homogeneidade da massa sem abrir e parar o motor.",
    placement: "right",
    product: "hs22",
  },
  {
    id: "hs22-pedal",
    x: "22%",
    y: "82%",
    title: "Pedal Hands-Free",
    description: "Acionamento seguro pelos pés, liberando ambas as mãos para o manuseio.",
    placement: "right",
    product: "hs22",
  },
  {
    id: "hs22-power",
    x: "32%",
    y: "62%",
    title: "Motor 2 CV · Boca 22",
    description: "Força industrial e alta produtividade de 600 kg/h no menor espaço físico.",
    placement: "right",
    product: "hs22",
  },
];

export function TechHero() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* ===== BACKGROUND ATMOSPHERE (z-0) ===== */}
      <div aria-hidden className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_60%)]" />
        <div className="absolute right-[-10%] top-[5%] h-[820px] w-[820px] rounded-full bg-[radial-gradient(closest-side,#f59e0b40,transparent_70%)] blur-3xl" />
        <div className="absolute right-[15%] top-[20%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,#3b82f640,transparent_70%)] blur-3xl" />
        <div
          className="absolute right-[-15%] top-[10%] h-[900px] w-[900px] rounded-full opacity-40 mix-blend-screen"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--accent) 32%, transparent) 70deg, transparent 180deg, color-mix(in oklab, #3b82f6 26%, transparent) 250deg, transparent 360deg)",
            animation: "spin 32s linear infinite",
            filter: "blur(48px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* ===== FULL-BLEED IMAGE STAGE (z-10) ===== */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col xl:block xl:min-h-[780px] 2xl:min-h-[min(92vh,920px)]">
        {/* Image layer */}
        <div className="relative order-2 mx-auto h-[520px] w-full max-w-[820px] sm:h-[600px] md:h-[680px] xl:absolute xl:inset-y-0 xl:right-0 xl:order-none xl:h-full xl:w-[58%] xl:max-w-none 2xl:w-[60%]">
          {/* Wide elliptical brushed-metal stage at the bottom */}
          <div
            aria-hidden
            className="absolute bottom-[6%] left-[4%] right-[4%] h-[120px] overflow-hidden rounded-[50%] border border-white/[0.08] shadow-[0_30px_70px_rgba(0,0,0,0.95)] md:h-[150px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(60,60,60,0.45) 0%, rgba(15,15,15,0.96) 72%, rgba(4,4,4,1) 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.09]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 6px)",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--accent)_35%,transparent),transparent_55%)] opacity-50" />
            <div className="pointer-events-none absolute inset-0 rounded-[50%] border-t border-white/20" />
          </div>

          {/* Ground shadow ellipses */}
          <div
            aria-hidden
            className="absolute bottom-[9%] right-[6%] h-[48px] w-[44%] rounded-[50%] bg-black/70 blur-2xl"
          />
          <div
            aria-hidden
            className="absolute bottom-[10%] left-[6%] h-[40px] w-[36%] rounded-[50%] bg-black/65 blur-2xl"
          />

          {/* Duo container — base-aligned, no overlap */}
          <div className="absolute inset-x-[2%] bottom-[10%] top-[6%] flex items-end justify-center gap-3 sm:gap-6 md:gap-10">
            {/* HS-22 — left, smaller */}
            <motion.img
              initial={{ opacity: 0, x: -30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              src={HS22_IMAGES.hero}
              alt="Skymsen HS-22 — homogeneizador compacto"
              className="relative z-20 h-[70%] w-auto max-w-[44%] object-contain object-bottom"
              style={{
                filter:
                  "drop-shadow(0 32px 40px rgba(0,0,0,0.7)) drop-shadow(0 14px 20px rgba(0,0,0,0.5)) drop-shadow(0 5px 8px rgba(0,0,0,0.4))",
              }}
              loading="eager"
              fetchPriority="high"
            />

            {/* HS-98 — right, dominant */}
            <motion.img
              initial={{ opacity: 0, x: 30, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              src={HS98_IMAGES.main}
              alt="Skymsen HS-98 — homogeneizador industrial 900 kg/h"
              className="relative z-10 h-[100%] w-auto max-w-[54%] object-contain object-bottom"
              style={{
                filter:
                  "drop-shadow(0 40px 50px rgba(0,0,0,0.75)) drop-shadow(0 18px 24px rgba(0,0,0,0.55)) drop-shadow(0 6px 10px rgba(0,0,0,0.4))",
              }}
              loading="eager"
              fetchPriority="high"
            />
          </div>

          {/* Model tags */}
          <div className="absolute bottom-[2%] left-[14%] z-30 rounded-full border border-white/15 bg-background/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-foreground backdrop-blur-xl">
            HS-22
          </div>
          <div className="absolute bottom-[2%] right-[14%] z-30 rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-accent backdrop-blur-xl">
            HS-98
          </div>


          {/* Hotspots */}
          {HOTSPOTS.map((spot) => {
            const isActive = activeHotspot === spot.id;
            return (
              <div
                key={spot.id}
                className="group/hotspot absolute z-40 hidden md:block"
                style={{ left: spot.x, top: spot.y }}
              >
                <button
                  onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                  className="relative flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300 focus:outline-none"
                  aria-label={`Detalhe técnico: ${spot.title}`}
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent/30 opacity-75" />
                  <span className="relative flex size-3 items-center justify-center rounded-full border border-white/40 bg-accent shadow-[0_0_12px_var(--accent)] transition-transform duration-300 group-hover/hotspot:scale-125" />
                </button>

                <div
                  className={`pointer-events-none absolute z-50 w-52 rounded-2xl border border-white/10 bg-black/85 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 md:pointer-events-auto
                    ${isActive ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0 group-hover/hotspot:pointer-events-auto group-hover/hotspot:translate-y-0 group-hover/hotspot:scale-100 group-hover/hotspot:opacity-100"}
                    ${spot.placement === "top" ? "bottom-5 left-0 mb-2 -translate-x-1/2" : ""}
                    ${spot.placement === "bottom" ? "left-0 top-5 mt-2 -translate-x-1/2" : ""}
                    ${spot.placement === "left" ? "right-5 top-0 mr-2 -translate-y-1/2" : ""}
                    ${spot.placement === "right" ? "left-5 top-0 ml-2 -translate-y-1/2" : ""}
                  `}
                >
                  <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                    {spot.product === "hs22" ? "Skymsen HS-22" : "Skymsen HS-98"}
                  </div>
                  <h4 className="mt-1 text-xs font-semibold text-white">{spot.title}</h4>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-white/70">
                    {spot.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== READABILITY OVERLAY (desktop only) ===== */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 hidden xl:block"
          style={{
            background:
              "linear-gradient(90deg, var(--background) 0%, color-mix(in oklab, var(--background) 92%, transparent) 45%, color-mix(in oklab, var(--background) 55%, transparent) 60%, transparent 78%)",
          }}
        />
        {/* Cinematic top/bottom vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 hidden xl:block"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--background) 60%, transparent) 0%, transparent 18%, transparent 78%, color-mix(in oklab, var(--background) 70%, transparent) 100%)",
          }}
        />

        {/* ===== TEXT BLOCK (z-30) ===== */}
        <div className="relative z-30 order-1 flex w-full items-center px-6 pb-10 pt-24 xl:absolute xl:inset-y-0 xl:left-0 xl:order-none xl:max-w-[680px] xl:px-14 xl:py-20 2xl:max-w-[760px] 2xl:px-20">
          <div>
            <Badge variant="outline" className="mb-6 border-accent/40 bg-accent/10 text-accent">
              Tecnologia de Homogeneização Skymsen · Patente Brasileira
            </Badge>
            <h1
              className="text-balance font-semibold tracking-tight"
              style={{ fontSize: "clamp(2.25rem, 4.2vw + 0.5rem, 4.5rem)", lineHeight: 1.04 }}
            >
              Carne pálida não vende.{" "}
              <span className="text-accent">Funcionário preso no moedor não dá lucro.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              A homogeneização Skymsen microdistribui a gordura na própria massa, devolve o vermelho
              de vitrine e libera o açougueiro do botão. Você para de jogar fora 6% do lote toda
              semana — e para de pagar gente só pra empurrar carne.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full px-7 py-6 text-base font-semibold shadow-lg shadow-accent/20"
              >
                <a href="#bifurcacao">
                  Escolher minha máquina
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
                  href="https://wa.me/558232232497?text=Olá! Quero conversar sobre os homogeneizadores Skymsen HS-22 e HS-98."
                  target="_blank"
                  rel="noreferrer"
                >
                  Demonstração no meu PDV
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-accent" /> NR-12 · INMETRO
              </span>
              <span>·</span>
              <span>Pedal hands-free</span>
              <span>·</span>
              <span>12 meses garantia em campo</span>
              <span>·</span>
              <span>Atendimento técnico, não comercial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
