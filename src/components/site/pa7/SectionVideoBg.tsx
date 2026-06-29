import { useEffect, useRef, useState } from "react";

type SectionVideoBgProps = {
  src: string;
  poster?: string;
  /** Optional override for the darkening mask classes. */
  maskClassName?: string;
  /** IntersectionObserver rootMargin — when the section enters this margin, we mount the video. */
  rootMargin?: string;
};

/**
 * Hardware-accelerated, muted, looping HTML5 background video that defers
 * its DOM injection until the section enters the viewport (default 300px
 * threshold). While off-screen, a solid neutral skeleton paints instantly
 * with the optional poster overlaid — zero network cost, zero decode.
 * Drop in as the first child of a section that is `relative overflow-hidden`.
 * Wrap the section's content in `relative z-20`.
 */
export function SectionVideoBg({
  src,
  poster,
  maskClassName,
  rootMargin = "300px",
}: SectionVideoBgProps) {
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
      <div
        className="absolute inset-0 bg-neutral-950"
        style={
          poster
            ? {
                backgroundImage: `url(${poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      />
      {shouldMount && (
        <video
          className="absolute inset-0 h-full w-full object-cover transform-gpu will-change-transform motion-reduce:hidden"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />
      )}
      <div
        className={
          maskClassName ??
          "absolute inset-0 z-10 bg-neutral-950/85 mix-blend-multiply"
        }
      />
    </div>
  );
}
