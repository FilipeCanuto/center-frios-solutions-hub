import { useEffect, useRef, useState } from "react";

type OptimizedVideoBgProps = {
  src: string;
  posterSrc?: string;
  /** Tailwind classes for the readability mask overlay. */
  darknessClass?: string;
  /** IntersectionObserver rootMargin — when the section enters this margin, we mount the video. */
  rootMargin?: string;
};

/**
 * Performance-first background video.
 * - IntersectionObserver gate: the <video> tag is NOT rendered until the
 *   section is within `rootMargin` of the viewport (default 300px).
 * - While off-screen, only a lightweight poster + dark mask paint, so hidden
 *   sections cost zero bytes and zero decode time on initial load.
 * - `preload="none"` keeps the main thread free on first paint.
 * Drop in as the first child of a `relative overflow-hidden` section and
 * wrap foreground content in `relative z-20`.
 */
export function OptimizedVideoBg({
  src,
  posterSrc,
  darknessClass = "bg-neutral-950/80 backdrop-blur-[2px]",
  rootMargin = "300px",
}: OptimizedVideoBgProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (shouldMount) return;
    const node = wrapperRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldMount(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldMount(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldMount]);

  return (
    <div ref={wrapperRef} aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {/* Zero-cost skeleton while we wait for the section to come into view */}
      <div
        className="absolute inset-0 bg-neutral-950"
        style={
          posterSrc
            ? {
                backgroundImage: `url(${posterSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      />
      {shouldMount && (
        <video
          src={src}
          poster={posterSrc}
          muted
          autoPlay
          loop
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover [transform:translateZ(0)] will-change-transform"
        />
      )}
      <div className={`absolute inset-0 z-10 ${darknessClass}`} />
    </div>
  );
}
