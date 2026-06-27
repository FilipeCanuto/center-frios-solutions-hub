type SectionVideoBgProps = {
  src: string;
  poster?: string;
  /** Optional override for the darkening mask classes. */
  maskClassName?: string;
};

/**
 * Hardware-accelerated, muted, looping HTML5 background video with a rigid
 * multi-layer readability mask. Drop in as the first child of a section that
 * is `relative overflow-hidden`. Wrap the section's content in `relative z-20`.
 */
export function SectionVideoBg({ src, poster, maskClassName }: SectionVideoBgProps) {
  return (
    <>
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover [transform:translateZ(0)] will-change-transform"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div
        aria-hidden
        className={
          maskClassName ??
          "pointer-events-none absolute inset-0 z-10 bg-neutral-950/80 backdrop-blur-[1px] mix-blend-multiply"
        }
      />
    </>
  );
}
