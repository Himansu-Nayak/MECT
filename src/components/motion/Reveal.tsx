// motion: owner = Motion
"use client";

import React, { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import {
  MOTION_DURATIONS,
  MOTION_EASINGS,
  MOTION_VIEWPORT,
} from "@/lib/motion";

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  direction?: "up" | "left" | "right" | "fade";
  tone?: "fast" | "base" | "slow";
  className?: string;
}

/**
 * Server-first scroll reveal: renders visible HTML (`opacity: 1`) on the server
 * and with JavaScript disabled, then animates below-the-fold entrances
 * post-hydration using transform + opacity only.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 14,
  direction = "up",
  tone = "base",
  className = "",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Only hide & reveal elements that start below the initial viewport
    if (rect.top >= window.innerHeight * 0.95) {
      setShouldAnimate(true);
    }
  }, [shouldReduceMotion]);

  if (shouldReduceMotion || !shouldAnimate) {
    return (
      <div ref={ref} className={className}>
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
      ? MOTION_DURATIONS.fast
      : tone === "slow"
      ? MOTION_DURATIONS.slow
      : MOTION_DURATIONS.base;

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={MOTION_VIEWPORT}
      transition={{ duration, delay, ease: MOTION_EASINGS.easeOut }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export interface RevealListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * Staggered list/grid container that renders visible server HTML first
 * and animates below-the-fold children post-hydration.
 */
export function RevealList({
  children,
  className = "",
  staggerDelay = 0.06,
}: RevealListProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top >= window.innerHeight * 0.95) {
      setShouldAnimate(true);
    }
  }, [shouldReduceMotion]);

  if (shouldReduceMotion || !shouldAnimate) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={MOTION_VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export interface RevealListItemProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Child item inside `<RevealList>`.
 */
export function RevealListItem({
  children,
  className = "",
}: RevealListItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: MOTION_DURATIONS.base,
            ease: MOTION_EASINGS.easeOut,
          },
        },
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  tone?: "fast" | "base" | "slow";
  className?: string;
}

/**
 * Opacity-only entrance wrapper that renders visible server HTML first.
 */
export function FadeIn({
  children,
  delay = 0,
  tone = "fast",
  className = "",
}: FadeInProps) {
  return (
    <Reveal
      direction="fade"
      distance={0}
      delay={delay}
      tone={tone}
      className={className}
    >
      {children}
    </Reveal>
  );
}

