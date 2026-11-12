// motion: owner = Anime.js
"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { canAnimate, withScope } from "@/lib/anime";

export interface AnimeCountUpProps {
  value: string;
  className?: string;
}

/**
 * Anime.js v4 1.2s count-up from server-rendered HTML value.
 * Always renders the exact verified value in SSR/no-JS and under
 * `prefers-reduced-motion: reduce`.
 */
export function AnimeCountUp({ value, className = "" }: AnimeCountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate() || hasAnimated.current) return;

    const match = value.match(/^([^0-9]*)([0-9][0-9,]*)([^0-9]*)$/);
    if (!match) return;

    const [, prefix, numRaw, suffix] = match;
    const target = Number(numRaw.replace(/,/g, ""));
    if (!Number.isFinite(target) || target <= 0) return;

    const hasGrouping = numRaw.includes(",");
    let cleanupScope: (() => void) | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || hasAnimated.current) {
          return;
        }
        hasAnimated.current = true;
        observer.disconnect();

        const counter = { current: 1 };
        cleanupScope = withScope(ref, () => {
          animate(counter, {
            current: target,
            duration: 1200,
            ease: "outCubic",
            onUpdate: () => {
              const rounded = Math.max(1, Math.round(counter.current));
              const formatted = hasGrouping
                ? rounded.toLocaleString("en-IN")
                : String(rounded);
              setDisplayValue(`${prefix}${formatted}${suffix}`);
            },
            onComplete: () => {
              setDisplayValue(value);
            },
          });
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cleanupScope?.();
    };
  }, [value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
}

