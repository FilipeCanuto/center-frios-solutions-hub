import { motion } from "framer-motion";
import { LazyVideo } from "./LazyVideo";
import thomasVideo from "@/assets/pa7/videos/thomas-burguer.mp4.asset.json";
import batataVideo from "@/assets/pa7/videos/batata-fatiada.mp4.asset.json";
import calabresaVideo from "@/assets/pa7/videos/calabresa.mp4.asset.json";
import circuitoVideo from "@/assets/pa7/videos/circuito-experience.mp4.asset.json";

type Clip = {
  src: string;
  author: string;
  role: string;
  caption: string;
  badge?: string;
  featured?: boolean;
};

const CLIPS: Clip[] = [
  {
    src: thomasVideo.url,
    author: "Thomas Burguer",
    role: "Hamburgueria · cliente Center Frios",
    caption: "Operação real do PA7 Pro no preparo diário da casa.",
    badge: "🔥 Cliente Real Center Frios",
    featured: true,
  },
  {
    src: batataVideo.url,
    author: "Batata fatiada",
    role: "Disco E3 · 3 mm",
    caption: "Batata uniforme em segundos — pronto para fritura ou gratinado.",
  },
  {
    src: calabresaVideo.url,
    author: "Pizzaria",
    role: "Disco fatiador · alta produção",
    caption: "Calabresa em fatias precisas, padronizando o produto final.",
  },
  {
    src: circuitoVideo.url,
    author: "Circuito Experience 2026",
    role: "Evento Skymsen · ao vivo",
    caption: "PA7 Pro em demonstração contínua diante dos chefs.",
  },
];

export function UgcWall() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand-blue)_8%,transparent),transparent_75%)] opacity-60"
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
            Prova social · Cozinhas reais
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Provado e Aprovado por quem Decide o Menu
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Hamburguerias, pizzarias e buffets que já operam com o PA7 Pro no dia a dia.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[1fr]"
        >
          {CLIPS.map((c) => (
            <motion.article
              key={c.author}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-neutral-950/40 p-6 backdrop-blur-xl transition-all duration-500 hover:border-accent/30 hover:shadow-[0_18px_50px_-15px_rgba(0,0,0,0.7)] ${
                c.featured ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              {c.badge && (
                <div className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-accent backdrop-blur-md">
                  {c.badge}
                </div>
              )}

              <div
                className={`relative mx-auto flex w-full items-center justify-center ${
                  c.featured ? "max-w-[420px]" : "max-w-[300px]"
                }`}
              >
                <LazyVideo
                  src={c.src}
                  aspect="aspect-[9/16]"
                  variant="phone"
                  showMuteToggle
                />
              </div>

              <div className="mt-6 flex flex-col">
                <p className="text-sm font-semibold text-foreground">{c.author}</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                  {c.role}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.caption}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
