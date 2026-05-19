import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, ClipboardList, HeadphonesIcon, Truck, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/solucoes")({
  head: () => ({
    meta: [
      { title: "Soluções — Center Frios" },
      {
        name: "description",
        content:
          "Consultoria, projeto, fornecimento e assistência técnica em equipamentos de refrigeração e gastronomia profissional.",
      },
      { property: "og:title", content: "Soluções Center Frios" },
      {
        property: "og:description",
        content: "Do projeto à manutenção: ciclo completo para o seu negócio.",
      },
    ],
  }),
  component: SolucoesPage,
});

const SOLUCOES = [
  {
    icon: ClipboardList,
    title: "Consultoria técnica",
    desc: "Mapeamos sua operação e dimensionamos os equipamentos certos para o seu volume e layout.",
  },
  {
    icon: Boxes,
    title: "Fornecimento completo",
    desc: "Catálogo amplo com as principais marcas, integrando refrigeração, processamento e cocção.",
  },
  {
    icon: Truck,
    title: "Logística e instalação",
    desc: "Entrega coordenada e equipe própria para montagem nos prazos críticos da sua obra.",
  },
  {
    icon: Wrench,
    title: "Assistência técnica",
    desc: "Manutenção preventiva e corretiva com técnicos certificados e estoque de peças críticas.",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte pós-venda",
    desc: "Atendimento dedicado para garantir continuidade operacional ao longo de todo o ciclo do equipamento.",
  },
] as const;

function SolucoesPage() {
  return (
    <>
      <section className="border-b border-border py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Soluções"
            title="Do projeto técnico à assistência em campo"
            description="Mais que um fornecedor: somos o parceiro técnico que mantém sua operação rodando."
          />
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUCOES.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
                <s.icon className="size-7 text-accent" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-12">
            <h3 className="text-2xl font-semibold text-foreground">Por que a Center Frios?</h3>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              O cliente CENTERFRIOS não pode parar — qualquer falha em equipamento representa
              prejuízo direto. Por isso construímos uma estrutura completa: técnicos próprios, peças
              em estoque e atendimento ágil. Confie em quem entende do seu setor.
            </p>
            <Button asChild size="lg" className="mt-6 rounded-full">
              <Link to="/contato">Fale com nosso time</Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaBanner source="solucoes" />
    </>
  );
}
