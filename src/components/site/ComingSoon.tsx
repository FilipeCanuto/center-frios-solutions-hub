import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";

/**
 * Tela exibida para visitantes externos enquanto o site segue em construção.
 * Apenas as páginas liberadas na allowlist (PA7 Pro e HS-98) ficam acessíveis;
 * tudo o mais cai aqui — inclusive a Home, ao clicar na logo.
 */
export function ComingSoon() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center">
        <Logo size="xl" />

        <span className="mt-10 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
          Em construção
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Estamos preparando algo novo
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
          O novo site da Center Frios está sendo finalizado. Por enquanto, você pode conferir os
          equipamentos em destaque ou falar direto com a gente.
        </p>

        <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/produtos/$slug" params={{ slug: "processador-pa7-pro-skymsen" }}>
              Processador PA7 Pro <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/produtos/$slug" params={{ slug: "moedor-homogeneizador-hs-98" }}>
              Moedor HS-98 <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>

        <a
          href="https://wa.me/558232232497"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <MessageCircle className="size-4" />
          Falar com um especialista no WhatsApp
        </a>
      </div>
    </div>
  );
}
