// motion: owner = Motion
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  m,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * =========================================================================
 * Institutional Motion Design Tokens — MECT
 * Calibrated for dignified editorial poise, calm deceleration, and zero bounce.
 * =========================================================================
 */
export const MOTION_EASING = {
  /** Primary institutional decelerating curve for reveals, cards, and navigation */
  institutional: [0.22, 1, 0.36, 1] as [number, number, number, number],
  /** Gentle symmetrical curve for cross-fades and image presentation */
  gentle: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  /** Restrained editorial ease for text masks and title reveals */
  editorial: [0.16, 1, 0.3, 1] as [number, number, number, number],
  /** Smooth ease-in-out for state transitions */
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
  /** Standard cubic ease-out for numeric counters */
  easeOut: [0.33, 1, 0.68, 1] as [number, number, number, number],
} as const;

export const MOTION_DURATION = {
  micro: 0.15,
  button: 0.18,
  fast: 0.22,
  standard: 0.44,
  editorial: 0.58,
  slow: 0.65,
  countUp: 800,
} as const;

export const MOTION_STAGGER = {
  fast: 0.035,
  nav: 0.04,
  text: 0.05,
  cards: 0.055,
  steps: 0.075,
} as const;

export const MOTION_DISTANCE = {
  micro: 6,
  standard: 12,
  editorial: 18,
  large: 24,
} as const;

export const MOTION_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -40px 0px",
} as const;

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  tone?: "fast" | "standard" | "slow" | "editorial";
  duration?: number;
  className?: string;
  as?: "div" | "section" | "article" | "aside" | "header" | "footer";
}

/**
 * Editorial scroll-triggered reveal built on motion/react.
 * Uses transform + opacity only and completely honors prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  distance = MOTION_DISTANCE.standard,
  direction = "up",
  tone = "standard",
  duration: customDuration,
  className = "",
  as: Component = "div",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, render immediate static element with zero opacity/transform delays
  if (shouldReduceMotion) {
    const StaticComponent = Component;
    return (
      <StaticComponent className={className} style={{ opacity: 1, transform: "none" }}>
        {children}
      </StaticComponent>
    );
  }

  const initialOffset =
    direction === "left"
      ? { x: -distance, y: 0 }
      : direction === "right"
      ? { x: distance, y: 0 }
      : direction === "down"
      ? { x: 0, y: -distance }
      : direction === "fade"
      ? { x: 0, y: 0 }
      : { x: 0, y: distance };

  const duration =
    customDuration ??
    (tone === "fast"
      ? MOTION_DURATION.fast
      : tone === "slow"
      ? MOTION_DURATION.slow
      : tone === "editorial"
      ? MOTION_DURATION.editorial
      : MOTION_DURATION.standard);

  const MotionComponent = (m as Record<string, any>)[Component] || m.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={MOTION_VIEWPORT}
      transition={{ duration, delay, ease: MOTION_EASING.institutional }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * Above-the-fold hero container: renders immediately visible at opacity: 1
 * for 0ms LCP and 100% reliable rendering under prefers-reduced-motion.
 */
export function HeroEntrance({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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
  delayChildren?: number;
}

/**
 * Coordinates staggered entrance across grids, workflow steps, and nav lists.
 */
export function StaggerGroup({
  children,
  className = "",
  staggerDelay = MOTION_STAGGER.cards,
  delayChildren = 0,
}: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={MOTION_VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade";
  distance?: number;
  duration?: number;
  className?: string;
}

/**
 * Child item inside StaggerGroup with directional variant control.
 */
export function StaggerItem({
  children,
  direction = "up",
  distance = MOTION_DISTANCE.standard,
  duration = MOTION_DURATION.standard,
  className = "",
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const hiddenOffset =
    direction === "left"
      ? { opacity: 0, x: -distance, y: 0 }
      : direction === "right"
      ? { opacity: 0, x: distance, y: 0 }
      : direction === "down"
      ? { opacity: 0, x: 0, y: -distance }
      : direction === "fade"
      ? { opacity: 0, x: 0, y: 0 }
      : { opacity: 0, x: 0, y: distance };

  return (
    <m.div
      variants={{
        hidden: hiddenOffset,
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration,
            ease: MOTION_EASING.institutional,
          },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export interface EditorialTextRevealProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: "up" | "down" | "fade";
  className?: string;
}

/**
 * Editorial heading or lead paragraph entrance.
 * Uses an overflow-clipped container to create a clean, crisp vertical rise
 * without splitting text into characters or duplicating content for screen readers.
 */
export function EditorialTextReveal({
  children,
  as: Component = "h2",
  delay = 0,
  duration = MOTION_DURATION.editorial,
  distance = MOTION_DISTANCE.editorial,
  direction = "up",
  className = "",
}: EditorialTextRevealProps) {
  const initialY = direction === "up" ? distance : direction === "down" ? -distance : 0;

  return (
    <Component className={`overflow-hidden ${className}`}>
      <m.span
        className="inline-block w-full"
        initial={{ opacity: 0, y: initialY }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={MOTION_VIEWPORT}
        transition={{
          duration,
          delay,
          ease: MOTION_EASING.editorial,
        }}
      >
        {children}
      </m.span>
    </Component>
  );
}

export interface ImageRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  scaleFrom?: number;
  className?: string;
}

/**
 * Gentle image presentation transition with subtle scale settling and opacity fade.
 * Confined within an overflow-hidden frame to prevent cumulative layout shift (CLS).
 */
export function ImageReveal({
  children,
  delay = 0,
  duration = MOTION_DURATION.slow,
  scaleFrom = 1.03,
  className = "",
}: ImageRevealProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <m.div
        className="relative w-full h-full"
        initial={{ opacity: 0, scale: scaleFrom }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={MOTION_VIEWPORT}
        transition={{ duration, delay, ease: MOTION_EASING.gentle }}
      >
        {children}
      </m.div>
    </div>
  );
}

/**
 * Backward-compatible alias for existing image gallery callers.
 */
export function GalleryReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <ImageReveal className={className}>{children}</ImageReveal>;
}

export interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
  disabledOnMobile?: boolean;
}

/**
 * Controlled, opt-in scroll parallax for featured imagery and photographic accents.
 * Movement is restricted to small bounds (default 20px) and automatically disabled
 * on mobile (<768px) and under prefers-reduced-motion to preserve battery and GPU.
 */
export function Parallax({
  children,
  offset = 20,
  className = "",
  disabledOnMobile = true,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!disabledOnMobile) return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, [disabledOnMobile]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const active = !shouldReduceMotion && !(disabledOnMobile && isMobile);
  const y = useTransform(scrollYProgress, [0, 1], active ? [-offset, offset] : [0, 0]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <m.div style={{ y: active ? y : 0, willChange: active ? "transform" : "auto" }}>
        {children}
      </m.div>
    </div>
  );
}

export interface CountUpStatProps {
  value: string;
  duration?: number;
  className?: string;
}

/**
 * Short one-time numeric count-up for verified impact statistics (e.g. "13+", "10,000+", "₹50,000", "100%").
 * Renders server-rendered final value immediately (CLS = 0, SEO indexing intact)
 * and animates smoothly using rAF upon viewport entrance.
 * Automatically disabled under prefers-reduced-motion.
 */
export function CountUpStat({
  value,
  duration = MOTION_DURATION.countUp,
  className = "",
}: CountUpStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion || !isInView || hasAnimated.current) return;

    // Matches e.g. "13+", "10,000+", "₹50,000", "100%"
    const match = value.match(/^([^0-9]*)([0-9][0-9,.]*)([^0-9]*)$/);
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
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out for calm, institutional deceleration
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
  }, [isInView, shouldReduceMotion, value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {shouldReduceMotion ? value : displayValue}
    </span>
  );
}
