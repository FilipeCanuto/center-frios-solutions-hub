import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Shield, Box, CircleDot, Maximize2, Zap } from "lucide-react";
import item03 from "@/assets/pa7/hardware/item03.png.asset.json";
import item04 from "@/assets/pa7/hardware/item04.png.asset.json";
import item05 from "@/assets/pa7/hardware/item05.png.asset.json";
import item06 from "@/assets/pa7/hardware/item06.png.asset.json";
import item07 from "@/assets/pa7/hardware/item07.png.asset.json";
import item09 from "@/assets/pa7/hardware/item09.png.asset.json";

type Spec = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  tab: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  highlight: string;
};

const SPECS: Spec[] = [
  {
    id: "inox",
    icon: Shield,
    tab: "Aço Inox",
    title: "Construção blindada em aço inox",
    subtitle: "Estrutura externa anti-corrosão",
    body: "Carcaça e base externa em aço inox de uso alimentar — resistente a higienização pesada, produtos químicos e ambientes úmidos das cozinhas profissionais.",
    image: item03.url,
    highlight: "Conforme RDC 216",
  },
  {
    id: "bivolt",
    icon: Zap,
    tab: "Bivolt",
    title: "Bivolt 127 / 220 V com chave seletora",
    subtitle: "Instala em qualquer unidade da rede",
    body: "Chave seletora integrada permite alternar entre 127 V e 220 V sem transformador externo — pronto para qualquer cozinha do Brasil.",
    image: item04.url,
    highlight: "Plug-and-play",
  },
  {
    id: "camara",
    icon: Box,
    tab: "Câmara Injetada",
    title: "Câmara de processamento injetada",
    subtitle: "Geometria otimizada para fluxo contínuo",
    body: "Câmara injetada em peça única, sem soldas que acumulam resíduos. Direciona o produto para a saída sem reprocessamento — produção constante e limpa.",
    image: item05.url,
    highlight: "Sem soldas internas",
  },
  {
    id: "tampa",
    icon: CircleDot,
    tab: "Tampa Removível",
    title: "Tampa removível com sensor de segurança",
    subtitle: "Limpeza completa em segundos",
    body: "Tampa de acesso rápido com sensor magnético: ao remover, o motor interrompe automaticamente. Higienização profunda sem ferramentas.",
    image: item06.url,
    highlight: "NR-12",
  },
  {
    id: "bocal",
    icon: Maximize2,
    tab: "Bocal Extralargo",
    title: "Bocal extralargo 188 × 174 mm",
    subtitle: "Alimentação em movimento único",
    body: "O maior bocal da categoria aceita batatas, abobrinhas e calabresas inteiras. Empurrador cilíndrico mantém o operador longe da lâmina e acelera o ciclo.",
    image: item07.url,
    highlight: "188 × 174 mm",
  },
  {
    id: "motor",
    icon: Cpu,
    tab: "Motor 0,5 CV",
    title: "Motor WEG 0,5 CV · 600 W",
    subtitle: "Pronto para turnos contínuos",
    body: "Motor WEG de alto rendimento calibrado para 440 rpm sob carga constante. Torque estável sem superaquecimento — sustenta o pico de produção da cozinha.",
    image: item09.url,
    highlight: "440 rpm sob carga",
  },
];

export function HardwareGrid() {
  const [active, setActive] = useState(SPECS[0].id);
  const current = SPECS.find((s) => s.id === active) ?? SPECS[0];

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand-blue)_10%,transparent),transparent_75%)] opacity-50"
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            Engenharia em detalhe
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Hardware profissional, peça por peça
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Selecione um componente para inspecionar a engenharia que sustenta 250 kg/h de produção.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* TAB LIST */}
          <div
            role="tablist"
            aria-orientation="vertical"
            className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {SPECS.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onMouseEnter={() => setActive(s.id)}
                  onFocus={() => setActive(s.id)}
                  onClick={() => setActive(s.id)}
                  className={`group flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 lg:w-full ${
                    isActive
                      ? "border-accent/40 bg-accent/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "border-white/5 bg-neutral-950/40 hover:border-white/15 hover:bg-neutral-900/50"
                  }`}
                >
                  <div
                    className={`grid size-9 shrink-0 place-items-center rounded-xl border transition-colors duration-300 ${
                      isActive
                        ? "border-accent/40 bg-accent text-accent-foreground"
                        : "border-white/10 bg-white/[0.04] text-accent"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span
                    className={`text-sm font-semibold tracking-tight transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {s.tab}
                  </span>
                </button>
              );
            })}
          </div>

          {/* PANEL */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-black/40 p-6 md:p-10 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid items-center gap-8 md:grid-cols-2"
              >
                <div className="relative order-2 md:order-1 flex flex-col">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                    {current.highlight}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {current.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {current.subtitle}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {current.body}
                  </p>
                </div>

                <div className="relative order-1 md:order-2 flex items-center justify-center">
                  <div className="relative w-full max-w-[480px] rounded-2xl border border-white/10 bg-neutral-900/60 p-6 shadow-2xl backdrop-blur-md">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(10,81,168,0.22),transparent_70%)]"
                    />
                    <img
                      src={current.image}
                      alt={current.title}
                      loading="lazy"
                      decoding="async"
                      className="relative mx-auto h-auto w-full object-contain mix-blend-luminosity drop-shadow-[0_22px_45px_rgba(0,0,0,0.55)]"
                      style={{
                        maskImage:
                          "radial-gradient(circle at center, #000 65%, transparent 100%)",
                        WebkitMaskImage:
                          "radial-gradient(circle at center, #000 65%, transparent 100%)",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
