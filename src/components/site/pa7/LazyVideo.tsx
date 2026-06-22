import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  src: string;
  poster?: string;
  aspect?: string;
  className?: string;
  showMuteToggle?: boolean;
  rounded?: boolean;
  variant?: "default" | "phone";
};

export function LazyVideo({
  src,
  poster,
  aspect = "aspect-video",
  className = "",
  showMuteToggle = false,
  rounded = true,
  variant = "default",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !inView) return;
    try {
      v.load();
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } catch {
      /* noop */
    }
  }, [inView]);

  const toggleMute = () => {
    const v = videoRef.current;
    const next = !muted;
    setMuted(next);
    if (v) v.muted = next;
  };

  if (variant === "phone") {
    // Luxurious smartphone mockup — premium device frame for vertical (9:16) media.
    return (
      <div className={`relative mx-auto ${className}`} ref={containerRef}>
        {/* Radial ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_center,rgba(10,81,168,0.18)_0%,transparent_70%)] blur-2xl"
        />
        {/* Device outer bezel */}
        <div className="relative mx-auto w-full max-w-[320px] rounded-[2.4rem] border border-white/15 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-black/40 p-[6px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7),_inset_0_1px_0_rgba(255,255,255,0.08)]">
          {/* Inner bezel */}
          <div className="relative overflow-hidden rounded-[2.05rem] border border-white/10 bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),inset_0_8px_24px_rgba(0,0,0,0.6)]">
            {/* Notch */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black/95 ring-1 ring-white/10"
            />
            <div className={`relative ${aspect} w-full bg-black`}>
              <video
                ref={videoRef}
                src={inView ? src : undefined}
                poster={poster}
                autoPlay
                muted={muted}
                loop
                playsInline
                preload="none"
                disableRemotePlayback
                className="absolute inset-0 h-full w-full object-cover"
              />
              {showMuteToggle && inView && (
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Ativar som" : "Silenciar"}
                  className="absolute right-3 bottom-3 z-30 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/90 backdrop-blur-md transition-colors hover:bg-black/70"
                >
                  {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>
              )}
            </div>
          </div>
          {/* Side power button accent */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-3px] top-24 h-14 w-[3px] rounded-l-sm bg-white/15"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[-3px] top-20 h-8 w-[3px] rounded-r-sm bg-white/15"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[-3px] top-32 h-14 w-[3px] rounded-r-sm bg-white/15"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-black/20 backdrop-blur-sm ${aspect} ${rounded ? "rounded-3xl" : ""} ${className}`}
    >
      <video
        ref={videoRef}
        src={inView ? src : undefined}
        poster={poster}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="none"
        disableRemotePlayback
        className="h-full w-full object-contain"
      />
      {showMuteToggle && inView && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Ativar som" : "Silenciar"}
          className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/90 backdrop-blur-md transition-colors hover:bg-black/60"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      )}
    </div>
  );
}
