// motion: owner = Motion
"use client";

import React from "react";
import { m, useReducedMotion } from "motion/react";
import { MOTION_TRANSITIONS } from "@/lib/motion";

export interface SmoothTabItem {
  id: string;
  label: string;
  href?: string;
  count?: number;
}

export interface SmoothTabProps {
  items: readonly SmoothTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
  layoutIdGroup?: string;
}

export function SmoothTab({
  items,
  activeId,
  onChange,
  ariaLabel = "Category filter tabs",
  layoutIdGroup = "smooth-tab-pill",
}: SmoothTabProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center gap-1.5 rounded-xs border border-border-warm bg-white p-1.5 shadow-xs"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`relative rounded-xs px-3 py-1.5 text-xs font-semibold font-sans transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta ${
              isActive ? "text-cream" : "text-forest hover:text-terracotta-dark"
            }`}
          >
            {isActive && (
              <m.span
                layoutId={shouldReduceMotion ? undefined : layoutIdGroup}
                aria-hidden="true"
                className="absolute inset-0 rounded-xs bg-forest"
                transition={MOTION_TRANSITIONS.fast}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <span>{item.label}</span>
              {typeof item.count === "number" && (
                <span
                  className={`text-[10px] font-mono ${
                    isActive ? "text-sand" : "text-ink-sand"
                  }`}
                >
                  ({item.count})
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

