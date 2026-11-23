// motion: owner = Motion
"use client";

import React from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * Global Motion provider wrapping the application root.
 * Loads the lightweight `domAnimation` feature set lazily and enforces
 * `reducedMotion="user"` across all descendant Motion components.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

