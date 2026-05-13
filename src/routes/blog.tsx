import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/site/CtaBanner";

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
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
            Em breve
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Blog Center Frios
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Estamos preparando conteúdo técnico sobre equipamentos, eficiência
            energética, normas sanitárias e tendências do setor alimentício.
            Volte em breve.
          </p>
        </div>
      </section>
      <CtaBanner source="blog" />
    </>
  );
}
