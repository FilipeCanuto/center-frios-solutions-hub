import { motion } from "framer-motion";
import { ProductChoiceCard } from "./ProductChoiceCard";
import {
  HS22_IMAGES,
  HS22_PRICE,
  HS22_AUDIENCE,
  HS22_DIFF,
  HS22_QUICK_SPECS,
  HS22_NICKNAME,
} from "@/data/hs22";
import {
  HS98_IMAGES,
  HS98_PRICE,
  HS98_AUDIENCE,
  HS98_DIFF,
  HS98_QUICK_SPECS,
  HS98_NICKNAME,
} from "@/data/hs98";

export function ModelBifurcation() {
  return (
    <section
      id="bifurcacao"
      className="relative overflow-hidden border-b border-border bg-card/30 py-28 md:py-32"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_70%)]"
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
            Hora de decidir
          </div>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Duas máquinas. Uma decisão.{" "}
            <span className="text-accent">Quanto a sua operação processa?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Mesma tecnologia patenteada Skymsen. Muda só o porte. Escolha pela sua demanda real —
            não pelo que o vendedor quer empurrar.
          </p>
        </div>

        {/* Capacity ruler */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-14 max-w-3xl"
        >
          <div className="flex items-baseline justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            <span>0 kg/h</span>
            <span>Capacidade contínua</span>
            <span>1.000 kg/h</span>
          </div>
          <div className="relative mt-3 h-3 overflow-hidden rounded-full border border-border bg-background">
            {/* HS-22 fill (0 → 60%) */}
            <div className="absolute inset-y-0 left-0 bg-accent/40" style={{ width: "60%" }} />
            {/* HS-98 fill (60% → 90%) */}
            <div className="absolute inset-y-0 bg-accent" style={{ left: "60%", width: "30%" }} />
          </div>
          <div className="mt-3 flex justify-between text-xs">
            <div>
              <span className="font-semibold text-foreground">HS-22</span>{" "}
              <span className="text-muted-foreground">até 600 kg/h</span>
            </div>
            <div>
              <span className="font-semibold text-accent">HS-98</span>{" "}
              <span className="text-muted-foreground">até 900 kg/h</span>
            </div>
          </div>
        </motion.div>

        {/* Two cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <ProductChoiceCard
            side="left"
            modelTag="HS-22"
            nickname={HS22_NICKNAME}
            audience={HS22_AUDIENCE}
            image={HS22_IMAGES.hero}
            imageAlt="Skymsen HS-22 com tampa de policarbonato transparente sobre bancada de açougue gourmet"
            quickSpecs={HS22_QUICK_SPECS}
            diff={HS22_DIFF}
            price={HS22_PRICE}
            productName="Homogeneizador Skymsen HS-22"
            productSlug="hs-22"
          />
          <ProductChoiceCard
            side="right"
            modelTag="HS-98"
            nickname={HS98_NICKNAME}
            audience={HS98_AUDIENCE}
            image={HS98_IMAGES.main}
            imageAlt="Skymsen HS-98 — homogeneizador industrial 900 kg/h em estrutura de piso com cavalete"
            quickSpecs={HS98_QUICK_SPECS}
            diff={HS98_DIFF}
            price={{
              amount: HS98_PRICE.amount,
              installments: HS98_PRICE.installments,
              pixDiscountPct: HS98_PRICE.pixDiscountPct,
            }}
            productName="Moedor Homogeneizador Skymsen HS-98"
            productSlug="moedor-homogeneizador-hs-98"
          />
        </div>

        {/* Decision microcopy */}
        <p className="mx-auto mt-12 max-w-2xl text-balance text-center text-base font-medium text-muted-foreground md:text-lg">
          Processa até 600 kg/h?{" "}
          <span className="font-semibold text-foreground">Escolha o HS-22.</span> Precisa de força
          bruta para quase 1 tonelada/h?{" "}
          <span className="font-semibold text-accent">Vá de HS-98.</span>
        </p>
      </div>
    </section>
  );
}
