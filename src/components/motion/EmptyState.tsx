// motion: owner = Motion
"use client";

import React from "react";
import { m, useReducedMotion } from "motion/react";
import { FileText } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35 }}
      className="rounded-xs border border-dashed border-sand/60 bg-cream/60 p-8 text-center space-y-3"
    >
      <div className="w-11 h-11 rounded-xs bg-white border border-border-warm text-terracotta-dark flex items-center justify-center mx-auto">
        <FileText className="w-5 h-5" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-lg font-bold text-forest">{title}</h3>
      <p className="text-xs sm:text-sm text-ink-sand font-sans max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {action && <div className="pt-1">{action}</div>}
    </m.div>
  );
}

