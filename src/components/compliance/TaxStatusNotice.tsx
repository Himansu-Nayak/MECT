import React from "react";
import Link from "next/link";
import { Info, ArrowRight } from "lucide-react";
import { COMPLIANCE } from "@content/compliance";

interface TaxStatusNoticeProps {
  variant?: "light" | "dark";
  className?: string;
}

export function TaxStatusNotice({
  variant = "light",
  className = "",
}: TaxStatusNoticeProps) {
  if (COMPLIANCE.isTaxEligibilityConfirmed) {
    return null;
  }

  const isDark = variant === "dark";

  return (
    <div
      role="note"
      aria-label={COMPLIANCE.taxStatusNotice.heading}
      className={[
        "rounded-xs p-4 sm:p-5 text-xs font-sans flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
        isDark
          ? "bg-forest-deep border border-sand/35 text-cream shadow-xl"
          : "bg-sand-light/70 border border-terracotta/30 border-l-4 border-l-terracotta text-ink shadow-xs",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "w-8 h-8 rounded-xs flex items-center justify-center shrink-0 mt-0.5",
            isDark
              ? "bg-forest border border-sand/45 text-sand"
              : "bg-terracotta/15 text-terracotta-dark",
          ].join(" ")}
        >
          <Info className="w-4 h-4" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <p
            className={[
              "font-bold uppercase tracking-wider text-[11px]",
              isDark ? "text-sand" : "text-forest",
            ].join(" ")}
          >
            {COMPLIANCE.taxStatusNotice.heading}
          </p>
          <p
            className={[
              "leading-relaxed max-w-4xl",
              isDark ? "text-cream/95" : "text-ink-sand",
            ].join(" ")}
          >
            {COMPLIANCE.taxStatusNotice.summary}{" "}
            <span className="font-mono text-[11px] opacity-85">
              {COMPLIANCE.taxStatusNotice.caConfirmMarker}
            </span>
          </p>
        </div>
      </div>

      <Link
        href={COMPLIANCE.taxStatusNotice.disclosuresHref}
        className={[
          "inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xs transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-sand",
          isDark
            ? "text-white bg-terracotta hover:bg-terracotta-dark border border-terracotta-dark"
            : "text-white bg-forest hover:bg-forest-deep",
        ].join(" ")}
      >
        <span>{COMPLIANCE.taxStatusNotice.disclosuresLabel}</span>
        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
