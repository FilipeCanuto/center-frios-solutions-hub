import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SegmentCard } from "@/components/site/SegmentCard";
import { CtaBanner } from "@/components/site/CtaBanner";
import { SEGMENTS } from "@/data/site";

export const Route = createFileRoute("/segmentos/")({
  component: SegmentosPage,
});

function SegmentosPage() {
  return (
    <>
      <section className="border-b border-border py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Segmentos atendidos"
            title="Equipamentos para cada operação"
            description="Selecionamos a linha certa para o ritmo, escala e exigências do seu setor."
          />
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SEGMENTS.map((s) => (
              <div key={s.slug} className="aspect-[4/5] sm:aspect-square">
                <SegmentCard segment={s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner source="segmentos" />
    </>
  );
}
