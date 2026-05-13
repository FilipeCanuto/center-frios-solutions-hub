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
      <div className="mx-auto max-w-5xl rounded-3xl bg-primary p-10 text-center md:p-14">
        <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">{description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <QuoteDialog
            source={source}
            defaultProduct={defaultProduct}
            defaultSegment={defaultSegment}
            trigger={
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full bg-background text-foreground hover:bg-background/90"
              >
                Solicitar Orçamento
              </Button>
            }
          />
          <a
            href={CONTACT.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
