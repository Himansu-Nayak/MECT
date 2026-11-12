// motion: owner = Anime.js
"use client";

import React, { useEffect, useRef } from "react";
import { animate, createDrawable } from "animejs";
import { canAnimate, withScope } from "@/lib/anime";

export interface MarkerTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Subtle hand-drawn SVG underline emphasis (max once per page).
 * Renders a static full underline under `prefers-reduced-motion: reduce`
 * and with JavaScript disabled.
 */
export function MarkerText({ children, className = "" }: MarkerTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!canAnimate() || !ref.current) return;

    let cleanupScope: (() => void) | null = null;
    const el = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();

        cleanupScope = withScope(ref, () => {
          const pathEl = el.querySelector(".mect-marker-path");
          if (!pathEl) return;
          animate(createDrawable(pathEl), {
            draw: ["0 0", "0 1"],
            duration: 700,
            ease: "outCubic",
          });
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cleanupScope?.();
    };
  }, []);

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 220 12"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 -bottom-1 w-full h-2.5 text-terracotta/80 pointer-events-none"
      >
        <path
          d="M 2 8 Q 110 2 218 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="mect-marker-path"
        />
      </svg>
    </span>
  );
}

