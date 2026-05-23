import { QuoteDialog } from "./QuoteDialog";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/data/site";

type Props = {
  title?: string;
  description?: string;
  source?: string;
  defaultProduct?: string;
  defaultSegment?: string;
};

export function CtaBanner({
  title = "Pronto para elevar seu padrão operacional?",
  description = "Consulte nossos especialistas e receba um projeto técnico personalizado para o seu negócio.",
  source = "cta-banner",
  defaultProduct,
  defaultSegment,
}: Props) {
  return (
    <section className="px-6 py-20">
      <div className="metal-surface metal-hover relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[color:var(--steel)] bg-brushed-metal p-10 text-center shadow-[var(--shadow-4)] md:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "var(--gradient-blue-glow)" }}
        />
        <div className="relative z-10">
          <h2 className="text-h1 md:text-display-2 text-foreground">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-subtitle text-muted-foreground">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <QuoteDialog
              source={source}
              defaultProduct={defaultProduct}
              defaultSegment={defaultSegment}
              trigger={
                <Button size="lg" className="rounded-full">
                  Solicitar Orçamento
                </Button>
              }
            />
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--steel)] bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-[color:var(--electric)] hover:shadow-[var(--shadow-glow-blue)]"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>

  );
}
