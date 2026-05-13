import type { Spec } from "@/data/site";

export function SpecGrid({ specs, columns = 2 }: { specs: Spec[]; columns?: 2 | 3 }) {
  return (
    <div
      className={`grid gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border ${
        columns === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"
      }`}
    >
      {specs.map((s) => (
        <div key={s.label} className="bg-background p-4">
          <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            {s.label}
          </span>
          <span className="mt-1 block text-sm font-medium text-foreground">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
