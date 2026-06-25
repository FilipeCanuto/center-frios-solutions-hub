import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PA7_OPTIONAL_DISCS,
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
  const toggle = (code: string) => {
    onChange(
      selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code],
    );
  };

  const addCode = (code: string) => {
    if (!selected.includes(code)) onChange([...selected, code]);
  };

  const { total, unpairedCubes, suggestedSlicers } = useMemo(() => {
    const items = selected.map(findDisc).filter(Boolean) as OptionalDisc[];
    const total = items.reduce((acc, d) => acc + d.price, 0);
    const unpairedCubes = items.filter(
      (d) =>
        d.requiresSlicer &&
        !(d.pairOptions ?? []).some((p) => selected.includes(p)),
    );
    const suggestedSlicers = Array.from(
      new Set(unpairedCubes.flatMap((d) => d.pairOptions ?? [])),
    );
    return { total, unpairedCubes, suggestedSlicers };
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
            Monte sua combinação de discos e grades — o total é recalculado em tempo real
            e o sistema garante a pareação correta entre grades de cubo e fatiadores.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* DISC GRID */}
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PA7_OPTIONAL_DISCS.map((d) => {
                const checked = selected.includes(d.code);
                const isCube = d.requiresSlicer === true;
                const hasPair =
                  !isCube ||
                  (d.pairOptions ?? []).some((p) => selected.includes(p));
                const needsPair = checked && isCube && !hasPair;
                const suggestedHighlight =
                  !checked && suggestedSlicers.includes(d.code);

                return (
                  <motion.div
                    key={d.code}
                    whileHover={{ y: -2 }}
                    className={`group relative overflow-hidden rounded-2xl border transition-all ${
                      checked
                        ? needsPair
                          ? "border-amber-400/60 bg-amber-500/[0.06] shadow-[0_10px_30px_-10px_rgba(245,158,11,0.4)]"
                          : "border-accent/50 bg-accent/10 shadow-[0_10px_30px_-10px_rgba(10,81,168,0.5)]"
                        : suggestedHighlight
                          ? "border-amber-400/50 bg-amber-500/[0.04] shadow-[0_0_0_1px_rgba(245,158,11,0.25)_inset]"
                          : "border-white/10 bg-neutral-950/40 hover:border-white/20 hover:bg-neutral-900/50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(d.code)}
                      className="flex w-full items-start gap-4 p-4 text-left"
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
                          {suggestedHighlight && (
                            <span className="rounded-md border border-amber-400/40 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-200">
                              Sugerido
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                          {d.desc}
                        </p>
                        <p className="mt-1.5 text-sm font-semibold text-foreground">
                          + {fmtBRL(d.price)}
                        </p>
                        <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground/90">
                          {d.utility}
                        </p>
                      </div>
                      <div
                        className={`mt-1 grid size-6 shrink-0 place-items-center rounded-md border transition ${
                          checked
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-white/15 bg-white/[0.04]"
                        }`}
                        aria-hidden
                      >
                        {checked && <Check className="size-4" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {needsPair && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-amber-400/30 bg-amber-500/[0.08] px-4 py-3"
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                                Nota Técnica de Fábrica
                              </p>
                              <p className="mt-0.5 text-[11px] leading-snug text-amber-100/90">
                                Esta grade exige um Disco Fatiador combinado para
                                realizar os cortes.
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {(d.pairOptions ?? []).map((code) => (
                                  <button
                                    key={code}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addCode(code);
                                    }}
                                    className="inline-flex items-center gap-1 rounded-full border border-amber-300/50 bg-amber-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-100 transition hover:bg-amber-400/25"
                                  >
                                    <ArrowRight className="size-3" />
                                    Adicionar Fatiador {code}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
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

              <AnimatePresence>
                {unpairedCubes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2.5 text-[11px] text-amber-100"
                  >
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" />
                    <div>
                      <p className="font-bold uppercase tracking-wider text-amber-200">
                        Pareação obrigatória
                      </p>
                      <p className="mt-0.5 leading-snug">
                        {unpairedCubes.map((c) => c.code).join(", ")} precisa(m) de
                        um fatiador compatível para cortar em cubo.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
