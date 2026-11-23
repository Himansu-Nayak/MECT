"use client";

import React from "react";
import { HanumanMurti3DExperience } from "./HanumanMurti3DExperience";

interface HanumanMurtiVisualProps {
  className?: string;
  variant?: "hero" | "card" | "compact";
  showControls?: boolean;
}

/**
 * The Grand Hanuman Murti Project — Conceptual Architectural Visual (Phase 23)
 * Upgraded to the interactive 3D WebGL/Canvas perspective experience with
 * full progressive enhancement and static fallback.
 */
export function HanumanMurtiVisual({
  className = "",
  variant = "hero",
  showControls = true,
}: HanumanMurtiVisualProps) {
  return (
    <HanumanMurti3DExperience
      className={className}
      variant={variant === "compact" ? "card" : variant}
      showControls={showControls && variant !== "compact"}
    />
  );
}
