"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * Institutional Motion Design Tokens — MECT
 * Purposeful, calm choreography across sections without repetitive identical animations.
 */
export const MOTION_EASING = {
  institutional: [0.22, 1, 0.36, 1] as [number, number, number, number],
  gentle: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

export const MOTION_DURATION = {
  fast: 0.18,
  standard: 0.44,
  slow: 0.64,
  countUp: 900,
} as const;

export const MOTION_STAGGER = {
  nav: 0.03,
  cards: 0.065,
  steps: 0.085,
} as const;

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  direction?: "up" | "left" | "right" | "fade";
  tone?: "fast" | "standard" | "slow";
  className?: string;
}

/**
 * Editorial scroll-triggered reveal built on motion/react.
 * Uses transform + opacity only and honors prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 14,
  direction = "up",
  tone = "standard",
  className = "",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={{ opacity: 1, transform: "none" }}>
        {children}
      </div>
    );
  }

  const initialOffset =
    direction === "left"
      ? { x: -distance, y: 0 }
      : direction === "right"
      ? { x: distance, y: 0 }
      : direction === "fade"
      ? { x: 0, y: 0 }
      : { x: 0, y: distance };

  const duration =
    tone === "fast"
      ? MOTION_DURATION.fast
      : tone === "slow"
      ? MOTION_DURATION.slow
      : MOTION_DURATION.standard;

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.04 }}
      transition={{ duration, delay, ease: MOTION_EASING.institutional }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Above-the-fold hero container: renders immediately visible at opacity: 1
 * for 0ms LCP and reliable rendering under prefers-reduced-motion.
 */
export function HeroEntrance({
  children,
  className = "",
}: Pick<RevealProps, "children" | "className">) {
  return (
    <div className={className} style={{ opacity: 1, transform: "none" }}>
      {children}
    </div>
  );
}

export interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * Coordinates staggered entrance across grids, workflow steps, and nav lists.
 */
export function StaggerGroup({
  children,
  className = "",
  staggerDelay = MOTION_STAGGER.cards,
}: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  direction?: "up" | "left" | "fade";
  className?: string;
}

/**
 * Child item inside StaggerGroup with directional variant control.
 */
export function StaggerItem({
  children,
  direction = "up",
  className = "",
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const hiddenState =
    direction === "left"
      ? { opacity: 0, x: -14, y: 0 }
      : direction === "fade"
      ? { opacity: 0, x: 0, y: 0 }
      : { opacity: 0, x: 0, y: 14 };

  return (
    <motion.div
      variants={{
        hidden: hiddenState,
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: MOTION_DURATION.standard,
            ease: MOTION_EASING.institutional,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface GalleryRevealProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Image-specific gentle clip & opacity reveal once on entry (never continuous zoom).
 */
export function GalleryReveal({ children, className = "" }: GalleryRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: MOTION_DURATION.slow, ease: MOTION_EASING.gentle }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface CountUpStatProps {
  value: string;
  className?: string;
}

/**
 * Short one-time numeric count-up for existing verified impact metrics (e.g. "13+", "10,000+").
 * Preserves SSR exact value for SEO/CLS=0 and disables counting under prefers-reduced-motion.
 */
export function CountUpStat({ value, className = "" }: CountUpStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion || !isInView || hasAnimated.current) return;

    const match = value.match(/^([^0-9]*)([0-9][0-9,]*)([^0-9]*)$/);
    if (!match) return;

    const [, prefix, numRaw, suffix] = match;
    const target = Number(numRaw.replace(/,/g, ""));
    if (!Number.isFinite(target) || target <= 0) return;

    hasAnimated.current = true;
    const hasGrouping = numRaw.includes(",");
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / MOTION_DURATION.countUp, 1);
      // Cubic ease-out for calm institutional deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.max(1, Math.round(target * eased));
      const formatted = hasGrouping ? current.toLocaleString("en-IN") : String(current);
      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, shouldReduceMotion, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
}
