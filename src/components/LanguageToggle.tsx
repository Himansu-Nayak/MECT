"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

interface LanguageToggleProps {
  className?: string;
  variant?: "header" | "overlay";
}

export function LanguageToggle({ className = "", variant = "header" }: LanguageToggleProps) {
  const { locale, toggleLocale } = useLanguage();

  if (variant === "overlay") {
    return (
      <button
        type="button"
        onClick={toggleLocale}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xs text-xs font-semibold font-sans transition-all border ${
          locale === "or"
            ? "bg-sand text-forest border-sand"
            : "bg-forest-deep text-cream border-sand/40 hover:bg-forest"
        } ${className}`}
        aria-label={locale === "en" ? "ଭାଷା ବଦଳାନ୍ତୁ (ଓଡ଼ିଆ)" : "Switch language to English"}
      >
        <Languages className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
        <span>{locale === "en" ? "ଓଡ଼ିଆ (Odia)" : "English"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={`inline-flex items-center gap-1.5 px-2 2xl:px-2.5 py-1.5 text-xs font-semibold rounded-xs border transition-colors font-sans focus-visible:outline-2 focus-visible:outline-terracotta ${
        locale === "or"
          ? "bg-sand text-forest border-sand font-bold"
          : "bg-cream text-forest border-forest/30 hover:bg-sage/40"
      } ${className}`}
      aria-label={locale === "en" ? "ଭାଷା ବଦଳାନ୍ତୁ: ଓଡ଼ିଆ" : "Switch language to English"}
      title={locale === "en" ? "ଭାଷା ବଦଳାନ୍ତୁ: ଓଡ଼ିଆ" : "Switch language to English"}
    >
      <Languages className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
      <span className="font-sans">{locale === "en" ? "ଓଡ଼ିଆ" : "EN"}</span>
    </button>
  );
}
