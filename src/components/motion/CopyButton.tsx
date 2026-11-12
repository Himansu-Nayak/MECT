// motion: owner = Motion
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Check, Copy } from "lucide-react";

export interface CopyButtonProps {
  value: string;
  label: string;
  className?: string;
  showText?: boolean;
  onCopied?: () => void;
}

export function CopyButton({
  value,
  label,
  className = "",
  showText = false,
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      }
      setCopied(true);
      onCopied?.();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write unavailable or denied; stay silent without crashing.
    }
  }, [onCopied, value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      title={`Copy ${label}`}
      className={`min-h-[36px] min-w-[36px] inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-xs bg-white border border-border-warm text-terracotta-dark hover:bg-terracotta hover:text-white transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <m.span
            key="copied"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1"
          >
            <Check className="w-4 h-4 text-current" aria-hidden="true" />
            {showText && <span className="text-xs font-semibold">Copied</span>}
          </m.span>
        ) : (
          <m.span
            key="copy"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1"
          >
            <Copy className="w-4 h-4 text-current" aria-hidden="true" />
            {showText && <span className="text-xs font-semibold">Copy</span>}
          </m.span>
        )}
      </AnimatePresence>

      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}

