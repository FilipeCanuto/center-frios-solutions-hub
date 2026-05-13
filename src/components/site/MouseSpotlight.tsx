import { useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function MouseSpotlight() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 180, mass: 0.6 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 180, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const onLeave = () => {
      mouseX.set(-1000);
      mouseY.set(-1000);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Wide ambient halo — soft */}
      <motion.div
        aria-hidden
        style={{
          left: smoothX,
          top: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="pointer-events-none fixed z-[9998] h-[720px] w-[720px] mix-blend-screen"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, color-mix(in oklab, var(--accent) 55%, transparent) 0%, color-mix(in oklab, var(--accent) 18%, transparent) 30%, transparent 65%)",
            filter: "blur(30px)",
            opacity: 0.85,
          }}
        />
      </motion.div>

      {/* Tight core — sharper, follows tighter */}
      <motion.div
        aria-hidden
        style={{
          left: mouseX,
          top: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="pointer-events-none fixed z-[9999] h-[260px] w-[260px] mix-blend-screen"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, color-mix(in oklab, var(--accent) 75%, white 10%) 0%, color-mix(in oklab, var(--accent) 30%, transparent) 40%, transparent 70%)",
            filter: "blur(14px)",
          }}
        />
      </motion.div>
    </>
  );
}
