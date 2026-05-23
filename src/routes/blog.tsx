import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/site/CtaBanner";
import { SectionHeading } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Center Frios | Em breve" },
      {
        name: "description",
        content:
          "Em breve: conteúdo técnico sobre equipamentos, refrigeração comercial e gastronomia profissional.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <>
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-2xl px-6">
          <SectionHeading
            align="center"
            eyebrow="Em breve"
            title="Blog Center Frios"
            description="Estamos preparando conteúdo técnico sobre equipamentos, eficiência energética, normas sanitárias e tendências do setor alimentício. Volte em breve."
          />
        </div>
      </section>
      <CtaBanner source="blog" />
    </>
  );
}
