import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function MouseSpotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        left: smoothX,
        top: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="pointer-events-none fixed z-[9999] h-[400px] w-[600px] opacity-40 mix-blend-soft-light transition-opacity duration-500"
    >
      <div 
        className="h-full w-full"
        style={{
          background: "radial-gradient(ellipse at center, rgba(200, 220, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 25%, transparent 70%)",
          filter: "blur(40px)",
          transform: "rotate(-15deg) scaleX(1.5)",
        }}
      />
    </motion.div>
  );
}
