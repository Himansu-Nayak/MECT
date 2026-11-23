// motion: owner = Motion
"use client";

import React, { useEffect } from "react";
import { m, useReducedMotion } from "motion/react";
import { MOTION_TRANSITIONS } from "@/lib/motion";

let hasHydratedOnce = false;

/**
 * Enter-only route opacity fade (`fast` token).
 * Renders at full opacity on initial SSR/hydration so LCP and no-JS content
 * are unaffected, then fades gently on subsequent client-side navigations.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const shouldFade = hasHydratedOnce && !shouldReduceMotion;

  useEffect(() => {
    hasHydratedOnce = true;
  }, []);

  if (!shouldFade) {
    return <>{children}</>;
  }

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={MOTION_TRANSITIONS.fast}
    >
      {children}
    </m.div>
  );
}

