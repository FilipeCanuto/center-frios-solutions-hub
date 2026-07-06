import { Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pa7SuccessInline() {
  return (
    <section
      id="checkout-pa7"
      className="relative overflow-hidden border-t border-white/5 py-24 md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(245,158,11,0.18) 0%, rgba(10,10,10,0) 60%), radial-gradient(40% 40% at 80% 100%, rgba(37,99,235,0.10) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-amber-400/30 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-[0_0_60px_rgba(245,158,11,0.35)]">
          <CheckCircle2 className="h-14 w-14 text-amber-400" strokeWidth={1.75} />
        </div>

        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.35em] text-amber-400/90">
          Pedido confirmado
        </p>

        <h2 className="max-w-2xl text-balance text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Obrigado! Seu pedido foi confirmado.
        </h2>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Nossa equipe CENTERFRIOS já iniciou o processamento do seu Processador
          PA7 Pro Skymsen. Em instantes você receberá a confirmação por e-mail e
          nosso time entrará em contato para alinhar a entrega.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild variant="conversion" size="lg" className="rounded-full">
            <a
              href="https://wa.me/558232232497"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Falar pelo WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/produtos">
              Ver mais produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <p className="mt-16 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          CENTERFRIOS · Equipamentos de alta performance
        </p>
      </div>
    </section>
  );
}
