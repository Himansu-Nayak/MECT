// motion: owner = Anime.js
"use client";

import React, { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { canAnimate, withScope } from "@/lib/anime";
import { FREE_EDUCATION_200 } from "@content/funding";

const TOTAL_SEATS = FREE_EDUCATION_200.targetCount;
const FUNDED_SEATS = FREE_EDUCATION_200.confirmedFundedPlaces;

/**
 * M4.6 — 20x10 dot grid representing the 200-student Free Education cohort.
 * Uses Anime.js v4 `stagger` across the 20x10 matrix inside `withScope`.
 * Confirmed funded places come strictly from `content/funding.ts` (0 => outlined target seats).
 */
export function FreeEducationDotGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el || !canAnimate()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        withScope(gridRef, () => {
          animate(".edu-dot", {
            scale: [0.6, 1],
            opacity: [0.35, 1],
            duration: 380,
            delay: stagger(14, { grid: [20, 10], from: "first" }),
            ease: "outCubic",
          });
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={gridRef}
      className="rounded-xs border border-border-warm bg-white p-4 sm:p-5 space-y-3 shadow-xs"
      aria-label={`Free Education cohort grid: ${TOTAL_SEATS} target seats, ${FUNDED_SEATS} confirmed funded places`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <span className="font-bold uppercase tracking-wider text-forest">
          200-Student Cohort Grid (20 × 10)
        </span>
        <span className="font-mono text-[11px] text-terracotta-dark font-semibold">
          {FUNDED_SEATS} / {TOTAL_SEATS} confirmed funded
        </span>
      </div>

      <div
        className="grid gap-1 sm:gap-1.5"
        style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}
        aria-hidden="true"
      >
        {Array.from({ length: TOTAL_SEATS }, (_, idx) => {
          const isFunded = idx < FUNDED_SEATS;
          return (
            <span
              key={idx}
              className={`edu-dot aspect-square rounded-full border ${
                isFunded
                  ? "bg-terracotta border-terracotta-dark"
                  : "bg-cream border-terracotta/50"
              }`}
            />
          );
        })}
      </div>

      <p className="text-[11px] text-ink-secondary font-sans leading-snug">
        {FREE_EDUCATION_200.sourceNote}
      </p>
    </div>
  );
}

