// motion: owner = Motion
"use client";

import React, { useEffect, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { MOTION_TRANSITIONS } from "@/lib/motion";

export interface ScrollIndexItem {
  id: string;
  label: string;
}

export interface ScrollIndexProps {
  items: readonly ScrollIndexItem[];
  title?: string;
}

export function ScrollIndex({ items, title = "On this page" }: ScrollIndexProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0.05 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={title}
      className="sticky top-20 z-20 bg-white/95 backdrop-blur-xs border-b border-border-warm py-2.5 px-4"
    >
      <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-sand font-sans mr-1">
          {title}:
        </span>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveId(item.id)}
              className={`relative rounded-xs px-2.5 py-1 text-xs font-semibold font-sans transition-colors focus-visible:outline-2 focus-visible:outline-terracotta ${
                isActive ? "text-cream" : "text-forest hover:text-terracotta-dark"
              }`}
            >
              {isActive && (
                <m.span
                  layoutId={shouldReduceMotion ? undefined : "scroll-index-pill"}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xs bg-forest"
                  transition={MOTION_TRANSITIONS.fast}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

