/**
 * Shared Motion & Animation Design Tokens for MECT (https://mect.org.in)
 *
 * All Motion (`motion/react`) and Anime.js (`animejs`) animations must reference
 * these calibrated, restrained tokens. Never use bouncing/overshooting springs
 * or animate layout-triggering properties (`width`, `height`, `top`, `left`).
 */

export const MOTION_DURATIONS = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
} as const;

export const MOTION_EASINGS = {
  /** Standard smooth deceleration for entrances and reveals */
  easeOut: [0.22, 1, 0.36, 1] as const,
  /** Gentle symmetrical curve for state changes and cross-fades */
  easeInOut: [0.4, 0, 0.2, 1] as const,
} as const;

export const MOTION_SPRING = {
  type: "spring" as const,
  stiffness: 120,
  damping: 22,
} as const;

export const MOTION_VIEWPORT = {
  once: true,
  amount: 0.2,
} as const;

export const MOTION_TRANSITIONS = {
  fast: {
    duration: MOTION_DURATIONS.fast,
    ease: MOTION_EASINGS.easeOut,
  },
  base: {
    duration: MOTION_DURATIONS.base,
    ease: MOTION_EASINGS.easeOut,
  },
  slow: {
    duration: MOTION_DURATIONS.slow,
    ease: MOTION_EASINGS.easeInOut,
  },
  spring: MOTION_SPRING,
} as const;
