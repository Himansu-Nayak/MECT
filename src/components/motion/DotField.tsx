// motion: owner = Motion
"use client";

import React from "react";
import { m, useReducedMotion } from "motion/react";

export interface DotFieldProps {
  className?: string;
}

/**
 * Subtle decorative dot-field background for CSR partnerships.
 * Static under prefers-reduced-motion; GPU-only opacity pulse otherwise.
 */
export function DotField({ className = "" }: DotFieldProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <m.div
        className="w-full h-full opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(#B56547 1.25px, transparent 1.25px)",
          backgroundSize: "24px 24px",
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: [0.11, 0.17, 0.11] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </div>
  );
}

