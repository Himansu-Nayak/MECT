// motion: owner = Motion
"use client";

import React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { AlertCircle } from "lucide-react";

export interface InlineAlertProps {
  message: string | null;
  fieldErrors?: Record<string, string>;
}

export function InlineAlert({ message, fieldErrors }: InlineAlertProps) {
  const shouldReduceMotion = useReducedMotion();
  const errorEntries = fieldErrors
    ? Object.entries(fieldErrors).filter(([, msg]) => Boolean(msg))
    : [];

  return (
    <AnimatePresence initial={false}>
      {message && (
        <m.div
          role="alert"
          aria-live="assertive"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xs text-xs space-y-1.5"
        >
          <div className="flex items-start gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{message}</span>
          </div>
          {errorEntries.length > 0 && (
            <ul className="list-disc pl-6 space-y-0.5 text-[11px] text-red-700">
              {errorEntries.map(([field, msg]) => (
                <li key={field}>{msg}</li>
              ))}
            </ul>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}

