import { useEffect, useState } from "react";
import { BUSINESS_HOURS_LABEL, isSpecialistOnline } from "@/lib/business-hours";

/** Status discreto de atendimento. Renderiza só após hidratação (depende do relógio). */
export function useSpecialistOnline() {
  const [online, setOnline] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setOnline(isSpecialistOnline());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return online;
}

export function SpecialistStatus() {
  const online = useSpecialistOnline();
  return (
    <div className="min-h-[2.5rem] text-center text-xs text-muted-foreground" aria-live="polite">
      {online !== null && (
        <>
          <p className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
            <span className="relative flex size-2">
              {online && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
              )}
              <span
                className={`relative inline-flex size-2 rounded-full ${online ? "bg-emerald-500" : "bg-amber-500"}`}
              />
            </span>
            {online ? "Maria online agora" : "Deixe sua mensagem · Maria responde a partir das 8h"}
          </p>
          <p className="mt-0.5">
            {online
              ? `Atendimento: ${BUSINESS_HOURS_LABEL}`
              : "Prefere garantir agora? A compra pelo site funciona 24h."}
          </p>
        </>
      )}
    </div>
  );
}
