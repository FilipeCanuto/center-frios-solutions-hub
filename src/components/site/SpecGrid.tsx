import type { Spec } from "@/data/site";

export function SpecGrid({ specs, columns = 2 }: { specs: Spec[]; columns?: 2 | 3 }) {
  return (
    <div
      className={`grid gap-2 overflow-hidden rounded-xl ${
        columns === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"
      }`}
    >
      {specs.map((s) => (
        <div key={s.label} className="metal-surface rounded-xl border border-white/10 p-4">
          <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            {s.label}
          </span>
          <span className="mt-1 block text-sm font-medium text-foreground">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
