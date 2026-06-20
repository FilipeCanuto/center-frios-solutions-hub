import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type Props = {
  src: string;
  poster?: string;
  aspect?: string;
  className?: string;
  showMuteToggle?: boolean;
  rounded?: boolean;
};

export function LazyVideo({
  src,
  poster,
  aspect = "aspect-video",
  className = "",
  showMuteToggle = false,
  rounded = true,
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
