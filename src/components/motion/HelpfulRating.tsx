// motion: owner = Motion
"use client";

import React, { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export interface HelpfulRatingProps {
  itemLabel: string;
}

export function HelpfulRating({ itemLabel }: HelpfulRatingProps) {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mt-3 pt-2.5 border-t border-border-warm/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans text-ink-sand">
      <div className="flex items-center gap-2">
        <span>Was this helpful?</span>
        <button
          type="button"
          onClick={() => setVote("yes")}
          aria-pressed={vote === "yes"}
          aria-label={`Mark "${itemLabel}" as helpful`}
          className={`inline-flex items-center gap-1 rounded-xs border px-2 py-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta ${
            vote === "yes"
              ? "border-forest bg-forest text-cream"
              : "border-border-warm bg-white text-forest hover:border-sand"
          }`}
        >
          <ThumbsUp className="w-3 h-3" aria-hidden="true" />
          <span>Yes</span>
        </button>
        <button
          type="button"
          onClick={() => setVote("no")}
          aria-pressed={vote === "no"}
          aria-label={`Mark "${itemLabel}" as not helpful`}
          className={`inline-flex items-center gap-1 rounded-xs border px-2 py-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta ${
            vote === "no"
              ? "border-terracotta bg-terracotta text-white"
              : "border-border-warm bg-white text-forest hover:border-sand"
          }`}
        >
          <ThumbsDown className="w-3 h-3" aria-hidden="true" />
          <span>No</span>
        </button>
      </div>

      <div aria-live="polite" className="min-h-[16px]">
        <AnimatePresence mode="wait">
          {vote && (
            <m.span
              key={vote}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-forest font-semibold"
            >
              {vote === "yes"
                ? "Thank you for your feedback."
                : "Noted — contact contact@mect.org.in for clarification."}
            </m.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

