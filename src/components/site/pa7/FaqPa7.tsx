import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PA7_FAQ } from "@/data/pa7";

export function FaqPa7() {
  return (
    <section className="border-t border-white/5 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
          Perguntas frequentes
        </span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Tudo que você precisa saber antes de comprar
        </h2>
        <Accordion type="single" collapsible className="mt-8">
          {PA7_FAQ.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="metal-hover rounded-xl border-white/10 px-4"
            >
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
