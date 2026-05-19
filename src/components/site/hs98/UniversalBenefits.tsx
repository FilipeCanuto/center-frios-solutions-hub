import { Footprints, ShieldCheck, Workflow } from "lucide-react";
import { HS98_HIGHLIGHTS } from "@/data/hs98";

const ICONS = [Footprints, ShieldCheck, Workflow];

export function UniversalBenefits() {
  return (
    <section className="border-b border-border py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 max-w-3xl">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
            Vale para os dois modelos
          </div>
          <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
            Três decisões de engenharia que mudam o sábado de manhã.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            HS-22 ou HS-98, a tecnologia é a mesma. Muda só a escala — e quanto
            de carne sai da sua casa por hora.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
          {HS98_HIGHLIGHTS.map((h, idx) => {
            const Icon = ICONS[idx] ?? ShieldCheck;
            return (
              <div
                key={h.title}
                className="group relative flex flex-col gap-5 bg-background p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon className="size-5" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-bold tabular-nums text-muted-foreground">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                  {h.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {h.desc}
                </p>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
