// motion: owner = Motion
"use client";

import React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export type SaveStatusState = "idle" | "saving" | "saved" | "error";

export interface SaveStatusProps {
  status: SaveStatusState;
  idleLabel?: string;
  savingLabel?: string;
  savedLabel?: string;
  errorLabel?: string;
}

export function SaveStatus({
  status,
  idleLabel = "Ready to submit",
  savingLabel = "Submitting claim...",
  savedLabel = "Claim logged",
  errorLabel = "Check highlighted fields",
}: SaveStatusProps) {
  const shouldReduceMotion = useReducedMotion();

  const label =
    status === "saving"
      ? savingLabel
      : status === "saved"
      ? savedLabel
      : status === "error"
      ? errorLabel
      : idleLabel;

  const toneClass =
    status === "saving"
      ? "bg-cream border-sand text-forest"
      : status === "saved"
      ? "bg-forest/10 border-forest/30 text-forest"
      : status === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-cream/60 border-border-warm text-ink-sand";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 rounded-xs border px-2.5 py-1 text-[11px] font-semibold font-sans ${toneClass}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={status}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
          className="inline-flex items-center gap-1.5"
        >
          {status === "saving" && (
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
          )}
          {status === "saved" && (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          )}
          {status === "error" && (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          )}
          <span>{label}</span>
        </m.span>
      </AnimatePresence>
    </div>
  );
}

