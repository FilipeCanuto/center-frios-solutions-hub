import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PA7_OPTIONAL_DISCS,
  PA7_NICHE_PRESETS,
  PA7_PRICE,
  type OptionalDisc,
} from "@/data/pa7";

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const findDisc = (code: string): OptionalDisc | undefined =>
  PA7_OPTIONAL_DISCS.find((d) => d.code === code);

type CrossSellConfiguratorProps = {
  selected: string[];
  onChange: (next: string[]) => void;
};

export function CrossSellConfigurator({ selected, onChange }: CrossSellConfiguratorProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const toggle = (code: string) => {
    setActivePreset(null);
    onChange(
      selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code],
    );
  };

  const applyPreset = (id: string, picks: readonly string[]) => {
    setActivePreset(id);
    onChange([...picks]);
  };

  const addCombo = (cube: string, slicer: string) => {
    setActivePreset(null);
    const next = new Set(selected);
    next.add(cube);
    next.add(slicer);
    onChange(Array.from(next));
  };

  const { total, missingPair } = useMemo(() => {
    const items = selected.map(findDisc).filter(Boolean) as OptionalDisc[];
    const total = items.reduce((acc, d) => acc + d.price, 0);
    const hasCube = items.some((d) => d.requiresSlicer);
    const hasSlicer = items.some((d) => d.group === "Fatiador");
    return { total, missingPair: hasCube && !hasSlicer };
  }, [selected]);

  const grandTotal = PA7_PRICE.amount + total;

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand-blue)_10%,transparent),transparent_75%)] opacity-60"
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            Configure sua operação
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Os cortes certos para cada operação
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Selecione um preset por segmento ou monte sua combinação de discos e grades — o
            total é recalculado em tempo real.
          </p>
        </div>

        {/* PRESET CHIPS */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {PA7_NICHE_PRESETS.map((p) => {
            const active = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id, p.picks)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition-all ${
                  active
                    ? "border-accent bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                    : "border-white/10 bg-white/[0.04] text-foreground hover:border-accent/40 hover:bg-white/[0.08]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelected([]);
                setActivePreset(null);
              }}
              className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* DISC GRID */}
          <div>
            <AnimatePresence>
              {missingPair && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <div>
                    <p className="font-semibold">
                      ⚠️ Combinação de Fábrica Requerida
                    </p>
                    <p className="mt-0.5 text-amber-100/80">
                      Grades de cubo exigem obrigatoriamente um Disco Fatiador combinado
                      para operar.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-3 sm:grid-cols-2">
              {PA7_OPTIONAL_DISCS.map((d) => {
                const checked = selected.includes(d.code);
                return (
                  <motion.button
                    key={d.code}
                    type="button"
                    onClick={() => toggle(d.code)}
                    whileHover={{ y: -2 }}
                    className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                      checked
                        ? "border-accent/50 bg-accent/10 shadow-[0_10px_30px_-10px_rgba(10,81,168,0.5)]"
                        : "border-white/10 bg-neutral-950/40 hover:border-white/20 hover:bg-neutral-900/50"
                    }`}
                  >
                    <div className="relative grid size-16 shrink-0 place-items-center rounded-xl bg-white/[0.04]">
                      <img
                        src={d.image}
                        alt={`Disco ${d.code}`}
                        loading="lazy"
                        decoding="async"
                        className="size-14 object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold tracking-tight text-foreground">
                          {d.code}
                        </span>
                        <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                          {d.group}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{d.desc}</p>
                      <p className="mt-1.5 text-sm font-semibold text-foreground">
                        + {fmtBRL(d.price)}
                      </p>
                      {d.requiresSlicer && d.recommendedWith && !checked && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addCombo(d.code, d.recommendedWith!);
                          }}
                          className="mt-2 inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent transition hover:bg-accent/20"
                        >
                          <Plus className="size-3" /> Combo {d.code} + {d.recommendedWith}{" "}
                          (+{fmtBRL(d.price + (findDisc(d.recommendedWith!)?.price ?? 0))})
                        </button>
                      )}
                    </div>
                    <div
                      className={`grid size-6 shrink-0 place-items-center rounded-md border transition ${
                        checked
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-white/15 bg-white/[0.04]"
                      }`}
                      aria-hidden
                    >
                      {checked && <Check className="size-4" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* SUMMARY */}
          <aside className="lg:sticky lg:top-24">
            <div className="metal-surface relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-6 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.65)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                Configuração atual
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">
                PA7 Pro + acessórios
              </h3>

              <div className="mt-5 space-y-2 border-y border-white/5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Equipamento base</span>
                  <span className="font-medium text-foreground">
                    {fmtBRL(PA7_PRICE.amount)}
                  </span>
                </div>
                {selected.length === 0 && (
                  <p className="text-xs italic text-muted-foreground/70">
                    Nenhum adicional selecionado.
                  </p>
                )}
                {selected.map((code) => {
                  const d = findDisc(code);
                  if (!d) return null;
                  return (
                    <div
                      key={code}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        + {d.code}{" "}
                        <span className="text-xs text-muted-foreground/60">
                          ({d.desc})
                        </span>
                      </span>
                      <span className="font-medium text-foreground">
                        {fmtBRL(d.price)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Total adicionais
                </span>
                <span className="text-sm font-semibold text-foreground">
                  + {fmtBRL(total)}
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Estimado final
                </span>
                <span className="text-2xl font-black tracking-tight text-foreground">
                  {fmtBRL(grandTotal)}
                </span>
              </div>

              <Button
                size="lg"
                variant="conversion"
                className="mt-5 w-full rounded-full"
                onClick={() => {
                  const el = document.getElementById("checkout-pa7");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <Sparkles className="mr-1 size-4" /> Ir para o checkout
              </Button>

              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                Os adicionais selecionados aparecem no orçamento final emitido pelo time
                Center Frios. O checkout abaixo cobra o equipamento base; os acessórios
                entram na nota junto.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
