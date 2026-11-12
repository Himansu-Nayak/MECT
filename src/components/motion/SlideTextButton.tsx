// motion: owner = Motion
"use client";

import React from "react";
import { m, useReducedMotion } from "motion/react";

export interface SlideTextButtonProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Subtle vertical text-slide micro-interaction for secondary links/buttons.
 * Uses GPU-only transform + opacity and disables under reduced motion.
 */
export function SlideTextButton({ children, className = "" }: SlideTextButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span className={`inline-flex items-center gap-1.5 ${className}`}>{children}</span>;
  }

  return (
    <m.span
      className={`inline-flex items-center gap-1.5 ${className}`}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.span>
  );
}

