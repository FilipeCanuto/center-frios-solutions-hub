import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckoutDialog } from "@/components/site/pa7/CheckoutDialog";
import { QuoteDialog } from "@/components/site/QuoteDialog";

type Price = {
  amount: number;
  installments: number;
  pixDiscountPct: number;
} | null;

interface Props {
  side: "left" | "right";
  modelTag: string; // "HS-22"
  nickname: string; // "O Monstro Compacto"
  audience: string;
  image: string;
  imageAlt: string;
  quickSpecs: { label: string; value: string }[];
  diff: string;
  price: Price;
  productName: string; // full name passed to checkout / quote
  productSlug: string;
}

function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductChoiceCard({
  side,
  modelTag,
  nickname,
  audience,
  image,
  imageAlt,
  quickSpecs,
  diff,
  price,
  productName,
  productSlug,
}: Props) {
  const [open, setOpen] = useState(false);
  const featured = side === "right";

  const pixPrice = price && price.amount * (1 - price.pixDiscountPct / 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: side === "left" ? 0 : 0.1 }}
      className={`relative flex flex-col overflow-hidden rounded-3xl border bg-card/40 backdrop-blur-xl ${
        featured ? "border-accent/50 shadow-2xl shadow-accent/10" : "border-border"
      }`}
    >
      {featured && (
        <div className="absolute right-5 top-5 z-20">
          <Badge className="rounded-full bg-accent text-accent-foreground">Mais vendido</Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-background">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
            Skymsen
          </div>
          <div className="mt-1 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {modelTag}
          </div>
          <div className="mt-1 text-sm font-medium text-muted-foreground">{nickname}</div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Para:</span> {audience}.
        </p>

        {/* Quick specs */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
          {quickSpecs.map((s) => (
            <div key={s.label} className="bg-background p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-1.5 text-base font-semibold tabular-nums text-foreground">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Diff */}
        <div className="flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/[0.06] p-4">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Diferencial exclusivo
            </div>
            <p className="mt-1 text-sm font-medium leading-snug text-foreground">{diff}</p>
          </div>
        </div>

        {/* Price / CTA */}
        <div className="mt-auto space-y-4 pt-2">
          {price ? (
            <>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  À vista no PIX
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    {pixPrice ? formatBRL(pixPrice) : ""}
                  </span>
                  <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent">
                    -{price.pixDiscountPct}%
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  ou {price.installments}× de{" "}
                  <span className="font-semibold text-foreground">
                    {formatBRL(price.amount / price.installments)}
                  </span>{" "}
                  sem juros · {formatBRL(price.amount)} total
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setOpen(true)}
                className="w-full rounded-full py-6 text-base font-semibold shadow-lg shadow-accent/20"
              >
                Comprar {modelTag}
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <CheckoutDialog
                open={open}
                onOpenChange={setOpen}
                product={{
                  slug: productSlug,
                  name: productName,
                  image,
                  price: price.amount,
                }}
              />
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-dashed border-border bg-background/60 p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Condição comercial
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">
                  Preço sob consulta · NF-e e CNPJ · Parcelamento facilitado
                </p>
              </div>
              <QuoteDialog
                source={`bifurcacao-${productSlug}`}
                defaultProduct={productName}
                trigger={
                  <Button
                    size="lg"
                    className="w-full rounded-full py-6 text-base font-semibold shadow-lg shadow-accent/20"
                  >
                    Quero o {modelTag}
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                }
              />
            </>
          )}

          <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            <Check className="size-3 text-accent" /> NR-12
            <span className="mx-1">·</span>
            <Check className="size-3 text-accent" /> 12 meses
            <span className="mx-1">·</span>
            <Check className="size-3 text-accent" /> NF-e
          </div>
        </div>
      </div>
    </motion.article>
  );
}
