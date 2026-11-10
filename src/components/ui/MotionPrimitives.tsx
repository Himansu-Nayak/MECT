"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE_INSTITUTIONAL: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
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
  className = "",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.44, delay, ease: EASE_INSTITUTIONAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Immediate controlled entrance for above-the-fold hero elements.
 */
export function HeroEntrance({
  children,
  delay = 0,
  distance = 12,
  className = "",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.46, delay, ease: EASE_INSTITUTIONAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * Coordinates staggered entrance across grids and programme columns.
 */
export function StaggerGroup({
  children,
  className = "",
  staggerDelay = 0.06,
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
  className?: string;
}

/**
 * Child item inside StaggerGroup.
 */
export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: EASE_INSTITUTIONAL },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
