import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutDialog } from "./CheckoutDialog";

interface CheckoutSectionProps {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    installments: number;
    pixDiscount: number;
    subtitle?: string;
    pixPrice?: number;
    installmentValue?: number;
    savings?: number;
  };
}

const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function CheckoutSection({ product }: CheckoutSectionProps) {
  const [open, setOpen] = useState(false);

  const totalBRL = fmtBRL(product.price);
  const pixPrice = fmtBRL(
    product.pixPrice ?? product.price * (1 - product.pixDiscount / 100),
  );
  const installmentValue = fmtBRL(
    product.installmentValue ?? product.price / product.installments,
  );
  const savings = product.savings ?? Math.round(product.price * (product.pixDiscount / 100));

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Lado Esquerdo: Produto e Confiança */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl text-pretty">
                Adquira o seu <span className="text-accent">{product.name}</span> agora
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                O equipamento que vai transformar a produtividade da sua cozinha. Pronta entrega com
                garantia total Center Frios.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Truck, title: "Entrega Rápida", desc: "Logística especializada em todo Brasil" },
                { icon: ShieldCheck, title: "Compra Segura", desc: "Ambiente criptografado e NF-e" },
                { icon: CreditCard, title: "Até 12x Sem Juros", desc: "Parcelamento facilitado no cartão" },
                { icon: Check, title: "Garantia 12 Meses", desc: "Suporte técnico próprio em campo" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="metal-hover flex gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                >
                  <item.icon className="size-5 shrink-0 text-accent" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 grayscale opacity-50">
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-6 w-auto" />
              <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-6 w-auto" />
              <img src="https://img.icons8.com/color/48/000000/pix.png" alt="PIX" className="h-6 w-auto" />
              <img src="https://img.icons8.com/color/48/000000/barcode.png" alt="Boleto" className="h-6 w-auto" />
            </div>
          </motion.div>

          {/* Lado Direito: Card de Preço */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-accent/20 to-transparent blur-2xl" />

            <div className="metal-surface metal-hover relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-16 shrink-0 rounded-xl border border-white/10 bg-white/5 p-2">
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground leading-tight truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.subtitle || "Linha Profissional Center Frios"}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* PIX — destaque máximo */}
                <div className="pb-6 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                      PREÇO À VISTA NO PIX
                    </p>
                  </div>
                  <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                    <span className="text-5xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
                      {pixPrice}
                    </span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5">
                    <Sparkles className="size-3.5 text-accent" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                      Economia imediata de {fmtBRL(savings)} no PIX
                    </span>
                  </div>
                </div>

                {/* Cartão — visual mais discreto */}
                <div className="opacity-90">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    OU PARCELADO NO CARTÃO
                  </p>
                  <div className="mt-1.5 text-lg font-medium text-muted-foreground">
                    {totalBRL}
                  </div>
                  <p className="mt-0.5 text-sm text-foreground/80">
                    Ou em até {product.installments}x de {installmentValue} sem juros no cartão
                  </p>
                </div>

                <Button
                  size="lg"
                  variant="conversion"
                  className="w-full rounded-full h-14 text-base shadow-lg"
                  onClick={() => setOpen(true)}
                >
                  Finalizar Compra
                </Button>

                <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                  🔒 PAGAMENTO 100% SEGURO • NOTA FISCAL INCLUSA
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CheckoutDialog
        open={open}
        onOpenChange={setOpen}
        product={{
          slug: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
        }}
      />
    </section>
  );
}
