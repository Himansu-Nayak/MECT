// motion: owner = Anime.js
"use client";

import React, { useEffect, useRef } from "react";
import { animate, createDrawable, onScroll } from "animejs";
import { canAnimate, withScope } from "@/lib/anime";

/**
 * Scroll-synced SVG connector line for the 4-step "How MECT Works" grid.
 * Uses Anime.js `createDrawable` + `onScroll` inside `withScope`.
 */
export function HowMectWorksConnector() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetEl = containerRef.current;
    if (!canAnimate() || !targetEl) return;

    const cleanup = withScope(containerRef, () => {
      const pathEl = targetEl.querySelector(".how-mect-line");
      if (!pathEl) return;

      animate(createDrawable(pathEl), {
        draw: ["0 0", "0 1"],
        ease: "linear",
        autoplay: onScroll({
          target: targetEl,
          enter: "bottom-=80 top",
          leave: "top+=120 bottom",
          sync: 0.6,
        }),
      });
    });

    return cleanup;
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="hidden lg:block w-full max-w-4xl mx-auto -mb-8 pointer-events-none"
    >
      <svg
        viewBox="0 0 900 24"
        fill="none"
        className="w-full h-6 overflow-visible"
      >
        <path
          d="M 45 12 L 855 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 6"
          className="text-border-warm"
        />
        <path
          d="M 45 12 L 855 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="how-mect-line text-terracotta"
        />
        <circle cx="45" cy="12" r="4" className="fill-terracotta" />
        <circle cx="315" cy="12" r="4" className="fill-terracotta" />
        <circle cx="585" cy="12" r="4" className="fill-terracotta" />
        <circle cx="855" cy="12" r="4" className="fill-terracotta" />
      </svg>
    </div>
  );
}
