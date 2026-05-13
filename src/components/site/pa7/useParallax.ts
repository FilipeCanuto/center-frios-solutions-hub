import { useEffect, useRef, useState } from "react";

/** Returns a translateY offset (px) based on the element's position in the viewport. */
export function useParallax<T extends HTMLElement = HTMLDivElement>(intensity = 0.15) {
  const ref = useRef<T | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (above) ... 0 (center) ... +1 (below)
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      setOffset(progress * 60 * intensity * 8);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [intensity]);

  return { ref, offset };
}
