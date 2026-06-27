type OptimizedVideoBgProps = {
  src: string;
  posterSrc?: string;
  /** Tailwind classes for the readability mask overlay. */
  darknessClass?: string;
};

/**
 * Performance-first background video.
 * - `preload="none"` keeps the main thread free on initial load.
 * - `poster` paints instantly to avoid white flashes / CLS.
 * - `muted` + `autoPlay` + `playsInline` ensure cross-browser autoplay.
 * Drop in as the first child of a `relative overflow-hidden` section and
 * wrap foreground content in `relative z-20`.
 */
export function OptimizedVideoBg({
  src,
  posterSrc,
  darknessClass = "bg-neutral-950/80 backdrop-blur-[2px]",
}: OptimizedVideoBgProps) {
  return (
    <>
      <video
        src={src}
        poster={posterSrc}
        muted
        autoPlay
        loop
        playsInline
        preload="none"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover [transform:translateZ(0)] will-change-transform"
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-10 ${darknessClass}`}
      />
    </>
  );
}
