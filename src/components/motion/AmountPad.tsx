// motion: owner = Motion
"use client";

import React from "react";
import { m, useReducedMotion } from "motion/react";
import { ORG } from "@content/org";
import { MOTION_TRANSITIONS } from "@/lib/motion";

export interface AmountPadProps {
  value: string;
  onChange: (nextValue: string) => void;
  presets?: readonly number[];
  label?: string;
  inputId?: string;
  error?: string;
}

export function AmountPad({
  value,
  onChange,
  presets = ORG.donationIntentPresets,
  label = "Record your intended donation (₹ INR)",
  inputId = "donor-amount",
  error,
}: AmountPadProps) {
  const shouldReduceMotion = useReducedMotion();
  const numericValue = Number(value) || 0;

  return (
    <div className="space-y-3 rounded-xs border border-border-warm bg-cream/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-forest font-sans">
          {label}
        </span>
        <span className="text-[11px] font-medium text-ink-sand font-sans">
          Pledge / remittance record only
        </span>
      </div>

      <div
        role="group"
        aria-label="Intended donation presets"
        className="grid grid-cols-3 sm:grid-cols-5 gap-2"
      >
        {presets.map((preset) => {
          const isSelected = numericValue === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(String(preset))}
              aria-pressed={isSelected}
              className={`relative rounded-xs border px-2.5 py-2 text-xs font-bold font-mono tabular-nums transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta ${
                isSelected
                  ? "border-forest text-cream"
                  : "border-border-warm bg-white text-forest hover:border-sand"
              }`}
            >
              {isSelected && (
                <m.span
                  layoutId={shouldReduceMotion ? undefined : "amount-pad-active-pill"}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xs bg-forest"
                  transition={MOTION_TRANSITIONS.fast}
                />
              )}
              <span className="relative z-10">₹{preset.toLocaleString("en-IN")}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-forest font-sans"
        >
          Remitted / Intended Amount (₹) *
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-forest"
          >
            ₹
          </span>
          <input
            id={inputId}
            type="number"
            min="1"
            step="1"
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={error ? "true" : undefined}
            placeholder="10000"
            className={`w-full rounded-xs border bg-white pl-7 pr-3 py-2 text-sm font-mono font-bold text-forest focus:outline-none focus:ring-2 focus:ring-terracotta/25 ${
              error ? "border-red-500" : "border-border-warm focus:border-terracotta"
            }`}
          />
        </div>
        {error && (
          <p className="text-xs font-medium text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

