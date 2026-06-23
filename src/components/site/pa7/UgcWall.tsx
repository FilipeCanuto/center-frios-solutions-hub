import { motion } from "framer-motion";
import { LazyVideo } from "./LazyVideo";
import thomasVideo from "@/assets/pa7/videos/thomas-burguer.mp4.asset.json";
import batataVideo from "@/assets/pa7/videos/batata-fatiada.mp4.asset.json";
import calabresaVideo from "@/assets/pa7/videos/calabresa.mp4.asset.json";

const FLANK = [
  {
    src: batataVideo.url,
    title: "Batata fatiada",
    role: "Disco E3 · 3 mm",
  },
  {
    src: calabresaVideo.url,
    title: "Calabresa em fatias",
    role: "Pizzaria · alta produção",
  },
];

export function UgcWall() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand-blue)_10%,transparent),transparent_75%)] opacity-60"
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            Provado e Aprovado
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Cozinhas reais de clientes Center Frios
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Hamburguerias, pizzarias e buffets operando o PA7 Pro no ritmo da produção real.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_1.4fr_1fr] lg:gap-6">
          {/* LEFT FLANK */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="mx-auto w-full max-w-[260px] scale-90 opacity-80 transition-all duration-500 hover:scale-100 hover:opacity-100">
              <LazyVideo
                src={FLANK[0].src}
                aspect="aspect-[9/16]"
                variant="phone"
                showMuteToggle
              />
              <p className="mt-3 text-center text-sm font-semibold text-foreground">
                {FLANK[0].title}
              </p>
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                {FLANK[0].role}
              </p>
            </div>
          </motion.div>

          {/* CENTER — Thomas Burguer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[420px]"
          >
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-accent/25 via-transparent to-transparent blur-3xl" />
            <div className="absolute -left-3 -top-3 z-30 inline-flex items-center gap-1.5 rounded-full border border-red-400/40 bg-red-500/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-red-200 backdrop-blur-md shadow-lg">
              🔥 Cliente Real Center Frios
            </div>
            <div className="relative">
              <LazyVideo
                src={thomasVideo.url}
                aspect="aspect-[9/16]"
                variant="phone"
                showMuteToggle
              />
            </div>
            <div className="mt-5 text-center">
              <p className="text-base font-semibold text-foreground">Thomas Burguer</p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Hamburgueria · Operação real
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                PA7 Pro no preparo diário da casa — ritmo de cozinha profissional,
                padronização absoluta.
              </p>
            </div>
          </motion.div>

          {/* RIGHT FLANK */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="mx-auto w-full max-w-[260px] scale-90 opacity-80 transition-all duration-500 hover:scale-100 hover:opacity-100">
              <LazyVideo
                src={FLANK[1].src}
                aspect="aspect-[9/16]"
                variant="phone"
                showMuteToggle
              />
              <p className="mt-3 text-center text-sm font-semibold text-foreground">
                {FLANK[1].title}
              </p>
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                {FLANK[1].role}
              </p>
            </div>
          </motion.div>

          {/* MOBILE flank stack */}
          <div className="grid gap-6 sm:grid-cols-2 lg:hidden">
            {FLANK.map((f) => (
              <div key={f.title} className="mx-auto w-full max-w-[260px]">
                <LazyVideo
                  src={f.src}
                  aspect="aspect-[9/16]"
                  variant="phone"
                  showMuteToggle
                />
                <p className="mt-3 text-center text-sm font-semibold text-foreground">
                  {f.title}
                </p>
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                  {f.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
