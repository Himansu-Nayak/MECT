"use client";

import type { Transition } from "motion/react";
import { m } from "motion/react";
import { clipRevealTransition } from "./animation";

export type ChartRevealClipMode = "reveal" | "conceal";

export interface ChartRevealClipProps {
  clipPathId: string;
  height: number;
  targetWidth: number;
  enterTransition?: Transition;
  /** Bumps when motion settings change to replay the reveal. */
  revealEpoch: number;
  /** Extra inset around the clip rect so edge glyphs are not cut off. */
  padding?: number;
  /**
   * Vertical inset above and below the clip rect. Defaults to `padding`.
   * The reveal only animates x, so this can be larger than `padding` to let
   * point markers and strokes at the top/bottom of the plot render in full.
   */
  paddingY?: number;
  /** When false, clip stays at full width (no grow animation). */
  animating?: boolean;
  /** Reveal grows 0 → full; conceal shrinks full → 0 (ready → loading). */
  mode?: ChartRevealClipMode;
  /** Called when a conceal animation finishes. */
  onComplete?: () => void;
}

/**
 * Left-to-right clip reveal for cartesian series.
 * Grows clip rect width from 0 → full (true LTR; scaleX is avoided — it reveals from center).
 */
export function ChartRevealClip({
  clipPathId,
  height,
  targetWidth,
  enterTransition,
  revealEpoch,
  padding = 0,
  paddingY = padding,
  animating = true,
  mode = "reveal",
  onComplete,
}: ChartRevealClipProps) {
  const transition = clipRevealTransition(enterTransition);
  const paddedWidth = Math.max(0, targetWidth + padding * 2);
  const paddedHeight = height + paddingY * 2;

  if (!animating) {
    return (
      <clipPath id={clipPathId}>
        <rect
          height={paddedHeight}
          width={paddedWidth}
          x={-padding}
          y={-paddingY}
        />
      </clipPath>
    );
  }

  if (mode === "conceal") {
    // Mirror the LTR reveal: shrink from the right edge using GPU scaleX.
    return (
      <clipPath id={clipPathId}>
        <m.rect
          animate={{ scaleX: 0 }}
          height={paddedHeight}
          initial={{ scaleX: 1 }}
          key={`conceal-${revealEpoch}`}
          onAnimationComplete={() => onComplete?.()}
          style={{ transformOrigin: `${-padding + paddedWidth}px 0px` }}
          transition={transition}
          width={paddedWidth}
          x={-padding}
          y={-paddingY}
        />
      </clipPath>
    );
  }

  return (
    <clipPath id={clipPathId}>
      <m.rect
        animate={{ scaleX: 1 }}
        height={paddedHeight}
        initial={{ scaleX: 0 }}
        key={`reveal-${revealEpoch}`}
        style={{ transformOrigin: `${-padding}px 0px` }}
        transition={transition}
        width={paddedWidth}
        x={-padding}
        y={-paddingY}
      />
    </clipPath>
  );
}
