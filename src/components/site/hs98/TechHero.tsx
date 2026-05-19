import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HS22_IMAGES } from "@/data/hs22";
import { HS98_IMAGES } from "@/data/hs98";

export function TechHero() {
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
          <Badge
            variant="outline"
            className="mb-6 border-accent/40 bg-accent/10 text-accent"
          >
            Tecnologia de Homogeneização Skymsen · Patente Brasileira
          </Badge>
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
            Carne pálida não vende.{" "}
            <span className="text-accent">
              Funcionário preso no moedor não dá lucro.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            A homogeneização Skymsen microdistribui a gordura na própria massa,
            devolve o vermelho de vitrine e libera o açougueiro do botão. Você
            para de jogar fora 6% do lote toda semana — e para de pagar gente
            só pra empurrar carne.
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

            {/* model tags */}
            <div className="absolute -bottom-2 left-[12%] z-30 rounded-full border border-white/15 bg-background/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-foreground backdrop-blur-xl">
              HS-22
            </div>
            <div className="absolute -bottom-2 right-[8%] z-30 rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-accent backdrop-blur-xl">
              HS-98
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
