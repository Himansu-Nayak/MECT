// motion: owner = Motion
"use client";

import React from "react";
import { m, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Decorative 3px reading progress bar for long-form institutional pages
 * (Statutory Disclosures, FAQ, Governance). Animates `scaleX` only.
 */
export function ReadingProgress() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none print:hidden"
    >
      <m.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-terracotta"
      />
    </div>
  );
}

