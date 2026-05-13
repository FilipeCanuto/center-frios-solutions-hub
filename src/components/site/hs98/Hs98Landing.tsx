import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  ShieldCheck, 
  Settings, 
  Zap, 
  ArrowRight, 
  Truck, 
  Wrench,
  ChevronRight,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HS98_IMAGES, HS98_GALLERY, HS98_HIGHLIGHTS, HS98_FEATURES, HS98_SPECS, HS98_PRICE } from "@/data/hs98";
import { getProduct } from "@/data/site";
import { CheckoutSection } from "@/components/site/pa7/CheckoutSection";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } as any }
};

export function Hs98Landing() {
  const [activeImage, setActiveImage] = useState(0);
  const product = getProduct("moeder-homogeneizador-hs-98")!;

  return (
    <div className="bg-background text-foreground">
      {/* HERO SECTION - DJI STYLE */}
      <section className="relative min-h-[90vh] overflow-hidden border-b border-border bg-card/20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          {/* Subtle animated background element */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -right-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-accent/5 blur-[120px]" 
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 md:pt-32">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-12 lg:grid-cols-2 lg:items-center"
          >
            <div className="max-w-2xl">
              <motion.div variants={item}>
                <Badge variant="outline" className="mb-6 border-accent/30 bg-accent/5 text-accent">
                  Tecnologia Skymsen Profissional
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={item}
                className="text-5xl font-bold tracking-tight text-foreground md:text-7xl"
              >
                Mais que um moedor. <br />
                <span className="text-accent">Homogeneização</span> de Elite.
              </motion.h1>
              
              <motion.p 
                variants={item}
                className="mt-8 text-xl leading-relaxed text-muted-foreground"
              >
                O HS-98 m\u00F3i e mistura simultaneamente grandes quantidades de carne, reduzindo a gordura aparente e entregando uma textura homog\u00EAnea inigual\u00E1vel para o auto servi\u00E7o.
              </motion.p>

              <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full px-8 py-7 text-lg font-semibold shadow-lg shadow-primary/20">
                  Solicitar Proposta <ArrowRight className="ml-2 size-5" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 py-7 text-lg font-semibold">
                  <Play className="mr-2 size-5 fill-current" /> Ver em Opera\u00E7\u00E3o
                </Button>
              </motion.div>

              <motion.div variants={item} className="mt-12 flex items-center gap-8 border-t border-border pt-8">
                <div>
                  <div className="text-2xl font-bold text-foreground">900 kg/h</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Produtividade</div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-2xl font-bold text-foreground">3 CV</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Pot\u00EAncia Bruta</div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-2xl font-bold text-foreground">30 kg</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Capacidade Ca\u00E7amba</div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 } as any}
              className="relative aspect-square"
            >
              <div className="absolute inset-0 rounded-full bg-accent/5 blur-[100px]" />
              <img 
                src={HS98_IMAGES.main} 
                alt="Moedor HS-98 Premium" 
                className="relative z-10 h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HIGHLIGHTS GRID */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {HS98_HIGHLIGHTS.map((h, idx) => (
              <motion.div 
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-2xl border border-border bg-card/50 p-8 transition-all hover:border-accent/30 hover:bg-accent/5"
              >
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  {idx === 0 && <Zap className="size-6" />}
                  {idx === 1 && <ShieldCheck className="size-6" />}
                  {idx === 2 && <Settings className="size-6" />}
                  {idx === 3 && <Zap className="size-6" />}
                </div>
                <h3 className="text-xl font-bold text-foreground">{h.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE - ALTERNATING */}
      <section className="bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-bold md:text-5xl">Engenharia em cada detalhe</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Projetado para resistir ao regime de trabalho cont\u00EDnuo das maiores ind\u00FAstrias e supermercados.
            </p>
          </div>

          <div className="space-y-32">
            {/* FEATURE 1 */}
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
              >
                <img src={HS98_IMAGES.internal} alt="Interior da ca\u00E7amba inox" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <div className="text-lg font-bold text-white">Ca\u00E7amba de 41 Litros</div>
                  <div className="text-sm text-gray-300 text-pretty max-w-xs">Capacidade para at\u00E9 31kg de carne por ciclo de processamento.</div>
                </div>
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold md:text-4xl">Homogeneiza\u00E7\u00E3o que valoriza o produto</h3>
                <p className="mt-6 text-lg text-muted-foreground">
                  Diferente dos moedores comuns, o sistema HS mistura a carne enquanto m\u00F3i. Isso garante que a gordura seja distribu\u00EDda uniformemente, evitando aquele aspecto de "carne branca" e entregando um vermelho vibrante que atrai o cliente no PDV.
                </p>
                <ul className="mt-8 space-y-4">
                  {HS98_FEATURES.productivity.map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <div className="size-5 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                        <Check className="size-3" />
                      </div>
                      <span className="text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FEATURE 2 */}
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-bold md:text-4xl">Seguran\u00E7a Total (Patenteada)</h3>
                <p className="mt-6 text-lg text-muted-foreground">
                  Equipado com o Conjunto \u00DAnico de Seguran\u00E7a Skymsen. Sensores e travas de seguran\u00E7a na tampa interrompem o motor instantaneamente ao ser aberta, garantindo conformidade total com a NR-12.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border p-4 bg-background">
                    <div className="font-bold">Sensor Magn\u00E9tico</div>
                    <div className="text-xs text-muted-foreground mt-1">Interrup\u00E7\u00E3o imediata do ciclo.</div>
                  </div>
                  <div className="rounded-xl border border-border p-4 bg-background">
                    <div className="font-bold">Trava Mec\u00E2nica</div>
                    <div className="text-xs text-muted-foreground mt-1">Impossibilita acesso \u00E0s partes móveis.</div>
                  </div>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2 relative aspect-video overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
              >
                <img src={HS98_IMAGES.img7} alt="Sistema de seguran\u00E7a" className="h-full w-full object-cover" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section className="py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl font-bold">Galeria HS-98</h2>
            <div className="mt-2 h-1 w-20 bg-accent rounded-full" />
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
                <img 
                  src={HS98_GALLERY[activeImage].src} 
                  alt={HS98_GALLERY[activeImage].alt}
                  className="h-full w-full object-contain p-12 transition-all duration-500"
                />
                <div className="absolute bottom-6 left-6 right-6 flex justify-center">
                  <div className="rounded-full bg-black/50 px-4 py-2 text-xs text-white backdrop-blur-md">
                    {HS98_GALLERY[activeImage].alt}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-4 lg:grid-cols-1">
              {HS98_GALLERY.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${activeImage === idx ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img.src} alt="" className="h-full w-full object-contain p-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECH SPECS GRID */}
      <section className="py-24 bg-card/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-16 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-bold">Especifica\u00E7\u00F5es <br /> T\u00E9cnicas</h2>
              <p className="mt-6 text-muted-foreground">
                Dados oficiais para planejamento de infraestrutura e engenharia de alimentos.
              </p>
              <div className="mt-10 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <ShieldCheck className="size-5 text-accent" /> Certifica\u00E7\u00E3o INMETRO / UL
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <Wrench className="size-5 text-accent" /> Assist\u00EAncia em todo o Brasil
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <Truck className="size-5 text-accent" /> Log\u00EDstica Especializada
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
                {HS98_SPECS.map(s => (
                  <div key={s.label} className="bg-background p-6">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</div>
                    <div className="mt-2 text-lg font-medium text-foreground">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHECKOUT SECTION */}
      <div id="checkout">
        <CheckoutSection 
          product={{
            id: product.slug,
            name: product.name,
            image: HS98_IMAGES.main,
            price: HS98_PRICE.amount,
            installments: HS98_PRICE.installments,
            pixDiscount: HS98_PRICE.pixDiscountPct
          }}
        />
      </div>

      {/* CTA BOTTOM */}
      <section className="py-24 border-t border-border">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">Impulsione seu PDV agora</h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            N\u00E3o perca margem com quebra de carne ou apresenta\u00E7\u00E3o ruim. O HS-98 \u00E9 o investimento que se paga na primeira temporada de alta.
          </p>
          <div className="mt-12 flex justify-center gap-4">
            <Button size="lg" className="rounded-full px-12 py-8 text-xl font-bold">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
