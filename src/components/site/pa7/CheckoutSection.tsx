import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PA7_PRICE, PA7_IMAGES } from "@/data/pa7";
import { CheckoutDialog } from "./CheckoutDialog";

export function CheckoutSection() {
  const [open, setOpen] = useState(false);
  
  const totalBRL = PA7_PRICE.amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  
  const pixPrice = (PA7_PRICE.amount * (1 - PA7_PRICE.pixDiscountPct / 100)).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  
  const installmentValue = (PA7_PRICE.amount / PA7_PRICE.installments).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-background py-20 md:py-28">
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
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Adquira o seu <span className="text-accent">PA7 Pro</span> agora
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                O equipamento que vai transformar a produtividade da sua cozinha. 
                Pronta entrega com garantia total Center Frios.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Truck, title: "Entrega Rápida", desc: "Logística especializada em todo Brasil" },
                { icon: ShieldCheck, title: "Compra Segura", desc: "Ambiente criptografado e NF-e" },
                { icon: CreditCard, title: "Até 12x Sem Juros", desc: "Parcelamento facilitado no cartão" },
                { icon: Check, title: "Garantia 12 Meses", desc: "Suporte técnico próprio em campo" },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
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
            
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl md:p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-16 rounded-xl border border-white/10 bg-white/5 p-2">
                  <img src={PA7_IMAGES.main} alt="PA7 Pro" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Processador PA7 Pro Skymsen</h3>
                  <p className="text-xs text-muted-foreground">Linha Industrial · Bivolt</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="pb-6 border-b border-white/5">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Preço à vista no PIX</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground md:text-5xl">{pixPrice}</span>
                    <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">-{PA7_PRICE.pixDiscountPct}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Ou parcelado no cartão</p>
                  <div className="mt-2 text-2xl font-semibold text-foreground">
                    {totalBRL}
                  </div>
                  <p className="mt-1 text-sm text-accent font-medium">
                    em {PA7_PRICE.installments}x de {installmentValue} sem juros
                  </p>
                </div>

                <Button 
                  size="lg" 
                  className="w-full rounded-full py-7 text-lg font-bold shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all duration-300"
                  onClick={() => setOpen(true)}
                >
                  Finalizar Compra
                </Button>
                
                <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                  🔒 Pagamento 100% seguro · Nota Fiscal Inclusa
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
          name: "Processador de Alimentos PA7 Pro Skymsen",
          image: PA7_IMAGES.main,
          price: PA7_PRICE.amount,
        }}
      />
    </section>
  );
}
