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

const HOTSPOTS: Hotspot[] = [
  // HS-22 hotspots (front-left machine)
  {
    id: "hs22-lid",
    x: "24%",
    y: "40%",
    title: "Tampa Translúcida",
    description: "Inspeção em tempo real da homogeneidade da massa sem abrir e parar o motor.",
    placement: "top",
    product: "hs22",
  },
  {
    id: "hs22-pedal",
    x: "22%",
    y: "88%",
    title: "Pedal Hands-Free",
    description: "Acionamento seguro pelos pés, liberando ambas as mãos para o manuseio.",
    placement: "left",
    product: "hs22",
  },
  {
    id: "hs22-power",
    x: "15%",
    y: "65%",
    title: "Motor 2 CV · Boca 22",
    description: "Força industrial e alta produtividade de 600 kg/h no menor espaço físico.",
    placement: "left",
    product: "hs22",
  },

  // HS-98 hotspots (back-right machine)
  {
    id: "hs98-body",
    x: "72%",
    y: "28%",
    title: "Aço Inox AISI 304",
    description: "Construção ultra robusta com cavalete integrado para operação intensa 24/7.",
    placement: "top",
    product: "hs98",
  },
  {
    id: "hs98-safety",
    x: "64%",
    y: "48%",
    title: "Segurança NR-12",
    description: "Chave geral selada IP54 e sensores redundantes de interrupção instantânea.",
    placement: "right",
    product: "hs98",
  },
  {
    id: "hs98-capacity",
    x: "54%",
    y: "62%",
    title: "Caçamba de 41 L",
    description: "Homogeneização de 31 kg de carne por ciclo. Acaba com a quebra de cor.",
    placement: "left",
    product: "hs98",
  },
];

export function TechHero() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_60%)]" />
        <div className="absolute bottom-[-30%] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#f59e0b40,transparent_70%)] blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,#3b82f640,transparent_70%)] blur-3xl" />
        <div
          className="absolute right-[-15%] top-[15%] h-[700px] w-[700px] rounded-full opacity-30 mix-blend-screen"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--accent) 30%, transparent) 60deg, transparent 180deg, color-mix(in oklab, #3b82f6 25%, transparent) 240deg, transparent 360deg)",
            animation: "spin 28s linear infinite",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-28 md:pb-28 md:pt-36 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Badge variant="outline" className="mb-6 border-accent/40 bg-accent/10 text-accent">
            Tecnologia de Homogeneização Skymsen · Patente Brasileira
          </Badge>
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
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

        {/* Duo visual */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-square w-full max-w-[620px]">
            {/* halos */}
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
            <div
              aria-hidden
              className="absolute inset-0 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 28%, transparent), transparent 70%)",
              }}
            />

            {/* Dark Brushed Metal Stage (Pedestal Reflexivo Aço Escovado Escuro) */}
            <div
              aria-hidden
              className="absolute bottom-[4%] left-[4%] right-[4%] h-[120px] rounded-full overflow-hidden border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(50, 50, 50, 0.4) 0%, rgba(15, 15, 15, 0.95) 75%, rgba(5, 5, 5, 1) 100%)",
              }}
            >
              {/* Brushed lines pattern */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 6px)",
                }}
              />
              {/* Soft reflection of the accent glow */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_50%)]" />
              {/* Metallic border highlights */}
              <div className="absolute inset-0 rounded-full border-t border-white/20 pointer-events-none" />
            </div>

            {/* HS-98 (larger, back-right) */}
            <motion.img
              initial={{ opacity: 0, x: 40, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              src={HS98_IMAGES.main}
              alt="Skymsen HS-98 — homogeneizador industrial 900 kg/h"
              className="absolute right-[-2%] top-0 z-10 h-full w-[62%] object-contain"
              style={{
                filter:
                  "drop-shadow(0 24px 28px rgba(0,0,0,0.55)) drop-shadow(0 8px 12px rgba(0,0,0,0.4))",
              }}
              loading="eager"
              fetchPriority="high"
            />

            {/* HS-22 (smaller, front-left) */}
            <motion.img
              initial={{ opacity: 0, x: -40, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              src={HS22_IMAGES.hero}
              alt="Skymsen HS-22 — homogeneizador compacto com tampa em policarbonato"
              className="absolute bottom-[6%] left-[2%] z-20 w-[52%] object-contain"
              style={{
                filter:
                  "drop-shadow(0 20px 28px rgba(0,0,0,0.6)) drop-shadow(0 8px 12px rgba(0,0,0,0.4))",
              }}
              loading="eager"
              fetchPriority="high"
            />

            {/* model tags */}
            <div className="absolute -bottom-2 left-[12%] z-30 rounded-full border border-white/15 bg-background/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-foreground backdrop-blur-xl">
              HS-22
            </div>
            <div className="absolute -bottom-2 right-[8%] z-30 rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-accent backdrop-blur-xl">
              HS-98
            </div>

            {/* Interactive Hotspots */}
            {HOTSPOTS.map((spot) => {
              const isActive = activeHotspot === spot.id;
              return (
                <div
                  key={spot.id}
                  className="absolute z-40 group/hotspot"
                  style={{ left: spot.x, top: spot.y }}
                >
                  {/* Glowing Pulse Ring */}
                  <button
                    onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                    className="relative flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300 focus:outline-none"
                    aria-label={`Detalhe técnico: ${spot.title}`}
                  >
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent/30 opacity-75" />
                    <span className="relative flex size-3 items-center justify-center rounded-full bg-accent shadow-[0_0_12px_var(--accent)] border border-white/40 group-hover/hotspot:scale-125 transition-transform duration-300" />
                  </button>

                  {/* Glassmorphic micro-card */}
                  <div
                    className={`absolute z-50 w-52 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl shadow-2xl transition-all duration-300 pointer-events-none md:pointer-events-auto
                      ${isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none group-hover/hotspot:opacity-100 group-hover/hotspot:scale-100 group-hover/hotspot:translate-y-0 group-hover/hotspot:pointer-events-auto"}
                      ${spot.placement === "top" ? "bottom-5 -translate-x-1/2 left-0 mb-2" : ""}
                      ${spot.placement === "bottom" ? "top-5 -translate-x-1/2 left-0 mt-2" : ""}
                      ${spot.placement === "left" ? "right-5 -translate-y-1/2 top-0 mr-2" : ""}
                      ${spot.placement === "right" ? "left-5 -translate-y-1/2 top-0 ml-2" : ""}
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
        </div>
      </div>
    </section>
  );
}
