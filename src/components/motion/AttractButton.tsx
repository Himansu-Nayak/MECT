// motion: owner = Motion
"use client";

import React, { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export interface AttractButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Single hero CTA pointer-attract wrapper.
 * Automatically disabled on touch/coarse-pointer devices and reduced-motion.
 */
export function AttractButton({
  children,
  className = "",
  strength = 6,
}: AttractButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isTouchOrCoarse, setIsTouchOrCoarse] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 20, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 260, damping: 20, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouchOrCoarse(coarseQuery.matches);
    update();
    coarseQuery.addEventListener("change", update);
    return () => coarseQuery.removeEventListener("change", update);
  }, []);

  if (shouldReduceMotion || isTouchOrCoarse) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      ref={ref}
      style={{ x, y }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        rawX.set(Math.max(-1, Math.min(1, relX)) * strength);
        rawY.set(Math.max(-1, Math.min(1, relY)) * strength);
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

