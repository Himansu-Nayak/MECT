import React from "react";
import { CheckCircle2, AlertCircle, Inbox, Loader2 } from "lucide-react";

export interface StateFeedbackProps {
  state: "loading" | "error" | "empty" | "success";
  title: string;
  description?: React.ReactNode;
  referenceId?: string | number;
  action?: React.ReactNode;
  className?: string;
}

export function StateFeedback({
  state,
  title,
  description,
  referenceId,
  action,
  className = "",
}: StateFeedbackProps) {
  const configs = {
    loading: {
      icon: <Loader2 className="w-10 h-10 text-terracotta animate-spin" />,
      containerStyles: "bg-white border border-border-warm text-ink",
      titleStyles: "text-forest",
      descStyles: "text-ink-secondary",
    },
    error: {
      icon: <AlertCircle className="w-10 h-10 text-red-600" />,
      containerStyles: "bg-red-50/80 border border-red-200 text-red-950",
      titleStyles: "text-red-900",
      descStyles: "text-red-800/90",
    },
    empty: {
      icon: <Inbox className="w-10 h-10 text-terracotta" />,
      containerStyles: "bg-cream border border-dashed border-terracotta/35 text-ink",
      titleStyles: "text-forest",
      descStyles: "text-ink-sand",
    },
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-sand" />,
      containerStyles: "bg-forest border border-sand/40 text-cream shadow-lg",
      titleStyles: "text-white",
      descStyles: "text-cream/90",
    },
  };

  const current = configs[state];

  return (
    <div
      role={state === "error" ? "alert" : "status"}
      className={`p-8 sm:p-10 rounded-xs text-center flex flex-col items-center justify-center space-y-4 ${current.containerStyles} ${className}`}
    >
      <div className="shrink-0">{current.icon}</div>

      <div className="space-y-2 max-w-md">
        <h3 className={`font-serif text-xl sm:text-2xl font-bold tracking-tight ${current.titleStyles}`}>
          {title}
        </h3>

        {referenceId && (
          <p className="text-xs font-mono text-cream bg-forest-deep/60 py-1 px-3 rounded-xs inline-block">
            Registry Ref: #{referenceId}
          </p>
        )}

        {description && (
          <div className={`text-xs sm:text-sm leading-relaxed ${current.descStyles}`}>
            {description}
          </div>
        )}
      </div>

      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
