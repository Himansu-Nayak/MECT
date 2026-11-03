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
      icon: <Loader2 className="w-10 h-10 text-[#C5A059] animate-spin" />,
      containerStyles: "bg-[#FDFBF7] border border-[#0B3B24]/12 text-[#1C2421]",
      titleStyles: "text-[#072617]",
      descStyles: "text-[#4A5568]",
    },
    error: {
      icon: <AlertCircle className="w-10 h-10 text-red-600" />,
      containerStyles: "bg-red-50/70 border border-red-200 text-red-950",
      titleStyles: "text-red-900",
      descStyles: "text-red-800/90",
    },
    empty: {
      icon: <Inbox className="w-10 h-10 text-[#C5A059]" />,
      containerStyles: "bg-[#FDFBF7] border border-dashed border-[#0B3B24]/20 text-[#1C2421]",
      titleStyles: "text-[#072617]",
      descStyles: "text-[#4A5568]",
    },
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-[#E4C88A]" />,
      containerStyles: "bg-[#072617] border border-[#C5A059]/40 text-[#EDE6D8] shadow-lg",
      titleStyles: "text-white",
      descStyles: "text-white/85",
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
          <p className="text-xs font-mono text-[#E4C88A] bg-black/30 py-1 px-3 rounded-xs inline-block">
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
