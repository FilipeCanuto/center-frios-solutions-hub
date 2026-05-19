import { motion } from "framer-motion";
import { Play, ShieldCheck, Flame, Cpu, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Hs98TabuleiroSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  // YouTube Shorts embed URL
  const videoId = "aM7KOywnBBU";
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0`;

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-card/10 to-background py-24 md:py-32">
      {/* Background decorations */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand-blue)_20%,transparent),transparent_70%)] blur-3xl" />
        <div className="absolute left-[-10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_12%,transparent),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Left Column - Conversion Copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
                <Flame className="size-3.5 fill-current" />
                Demonstração de Impacto · Ao Vivo
              </span>

              <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                Provado na prática. <br />
                <span className="text-accent">Veja a homogeneização em segundos.</span>
              </h2>

              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
                Assista à demonstração real gravada durante o prestigiado **Evento Tabuleiro**. No
                vídeo ao lado, o modelo **HS-22** (irmão compacto da nossa linha de
                homogeneizadores) opera sob os olhos de dezenas de profissionais do setor.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-accent shadow-md">
                    <Cpu className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      A mesma engenharia no HS-22 e no HS-98
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Embora o vídeo mostre o modelo compacto **HS-22** moendo e misturando com
                      perfeição, o **HS-98** utiliza exatamente a mesma tecnologia proprietária
                      Skymsen, porém escalada para a ultraprodutividade de até **900 kg/h**.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-accent shadow-md">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Cor impecável e mistura uniforme
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Repare como a gordura e os tecidos musculares da carne são integrados de forma
                      homogênea. A carne sai com aspecto vermelho vibrante de vitrine ("maquiagem
                      natural"), pronta para embandejamento direto e venda imediata.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-6 py-6 text-base font-semibold shadow-lg shadow-accent/20"
                >
                  <a href="#checkout">
                    Garanta o seu homogeneizador
                    <ArrowRight className="ml-2 size-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full px-6 py-6 text-base font-semibold"
                >
                  <a
                    href="https://wa.me/558232232497?text=Olá! Gostaria de tirar dúvidas técnicas sobre os Homogeneizadores Skymsen."
                    target="_blank"
                    rel="noreferrer"
                  >
                    Falar com engenheiro técnico
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Premium Vertical Video Player (YouTube Shorts Format) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[32px] border border-white/10 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-black/60 transition-transform duration-500 hover:scale-[1.02]"
            >
              {/* Premium Phone-like Frame Notch */}
              <div className="absolute inset-x-0 top-0 z-20 flex justify-center py-3">
                <div className="h-4 w-28 rounded-full bg-black/90 border border-white/5" />
              </div>

              {/* Dynamic Video Embed or Poster */}
              {!isPlaying ? (
                <div
                  className="group absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center p-6 text-center"
                  onClick={() => setIsPlaying(true)}
                >
                  {/* Background overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Play Button Pulsing Glow */}
                  <div className="relative z-10 flex size-20 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/90">
                    <div className="absolute -inset-2 animate-pulse rounded-full bg-accent/20" />
                    <Play className="ml-1 size-8 fill-current" />
                  </div>

                  <span className="relative z-10 mt-6 text-xs font-bold uppercase tracking-[0.2em] text-white">
                    Ver demonstração real
                  </span>
                  <span className="relative z-10 mt-2 text-sm font-semibold text-white/70">
                    Clique para iniciar o player do evento
                  </span>

                  {/* Visual indication of Short */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                    Skymsen HS-22 ao vivo
                  </div>
                </div>
              ) : (
                <iframe
                  src={embedUrl}
                  title="Demonstração Homogeneizador Skymsen"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full object-cover"
                />
              )}

              {/* Decorative edge highlights */}
              <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/5" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
