import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type ObrigadoSearch = { product?: string; value?: string };

export const Route = createFileRoute("/obrigado")({
  validateSearch: (search: Record<string, unknown>): ObrigadoSearch => ({
    product: typeof search.product === "string" ? search.product : undefined,
    value: typeof search.value === "string" ? search.value : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Obrigado pela compra — CENTERFRIOS" },
      {
        name: "description",
        content:
          "Pedido confirmado com sucesso na CENTERFRIOS. Nossa equipe entrará em contato em instantes.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Obrigado pela compra — CENTERFRIOS" },
      {
        property: "og:description",
        content: "Pedido confirmado com sucesso na CENTERFRIOS.",
      },
    ],
  }),
  component: ObrigadoPage,
});

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function ObrigadoPage() {
  const { product, value } = Route.useSearch();

  const parsedValue = value ? parseFloat(value.replace(",", ".")) || 0 : 0;
  const productLabel = product?.trim() || "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id:
          "CF_" +
          new Date().getTime() +
          "_" +
          Math.floor(Math.random() * 1000),
        affiliation: "CENTERFRIOS Hub",
        value: parsedValue,
        item_name: productLabel || "Generic Product",
        currency: "BRL",
      },
    });
  }, [parsedValue, productLabel]);

  const headline = productLabel
    ? `Obrigado! Seu ${productLabel} já está garantido!`
    : "Obrigado! Seu pedido está garantido.";

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Ambient gradient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(245,158,11,0.15) 0%, rgba(10,10,10,0) 60%), radial-gradient(40% 40% at 80% 100%, rgba(37,99,235,0.12) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-amber-400/30 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-[0_0_60px_rgba(245,158,11,0.35)]">
          <CheckCircle2 className="h-14 w-14 text-amber-400" strokeWidth={1.75} />
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-amber-400/90">
          Pedido confirmado
        </p>

        <h1 className="max-w-2xl text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {headline}
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
          Nossa equipe CENTERFRIOS já iniciou o processamento e você receberá em
          instantes um e-mail com todos os detalhes da sua compra. Em breve
          entraremos em contato para alinhar a entrega.
        </p>

        {(productLabel || parsedValue > 0) && (
          <div className="mt-10 grid w-full max-w-lg gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur sm:grid-cols-2">
            {productLabel && (
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-4 text-left">
                <Package className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-neutral-400">
                    Produto
                  </p>
                  <p className="text-sm font-semibold text-white">{productLabel}</p>
                </div>
              </div>
            )}
            {parsedValue > 0 && (
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-4 text-left">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-xs font-black text-amber-400">
                  R$
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-neutral-400">
                    Valor
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {parsedValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild variant="conversion" size="lg">
            <Link to="/produtos">
              Ver mais produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Link
            to="/"
            className="text-sm font-medium text-neutral-400 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Voltar ao início
          </Link>
        </div>

        <p className="mt-16 text-xs uppercase tracking-[0.3em] text-neutral-500">
          CENTERFRIOS · Equipamentos de alta performance
        </p>
      </section>
    </main>
  );
}
