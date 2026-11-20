"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "motion/react";
import {
  ShieldCheck,
  Award,
  Building,
  Building2,
  Landmark,
  School,
  CheckCircle2,
  Pause,
  Play,
} from "lucide-react";
import { HOMEPAGE_CONTENT } from "@/lib/homepage-content";

const ICON_MAP = {
  Landmark,
  Building,
  Building2,
  ShieldCheck,
  Award,
  School,
  CheckCircle2,
};

export function InstitutionalMarquee() {
  const endorsements = HOMEPAGE_CONTENT.standards;
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="bg-sage border-y border-border-warm py-5 overflow-hidden transition-colors"
      aria-label="Institutional Standards and Public Accreditations"
    >
      <Container size="default" className="mb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-forest">
              Statutory Accreditations &amp; Public Standards
            </span>
            {!shouldReduceMotion && (
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-pressed={isPaused}
                aria-label={isPaused ? "Resume credentials ticker" : "Pause credentials ticker"}
                className="inline-flex items-center justify-center min-w-[24px] min-h-[24px] p-1 rounded-xs border border-forest/30 text-forest hover:bg-forest/10 transition-colors focus-visible:outline-2 focus-visible:outline-forest"
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              </button>
            )}
          </div>
          <span className="text-[11px] text-ink hidden sm:inline font-sans">
            Registered Public Charitable Trust (Balangir 2013) • 12A/80G &amp; NITI Aayog Darpan Recorded
          </span>
        </div>
      </Container>

      <div className="relative w-full overflow-hidden flex items-center">
        {/* Continuous Marquee Ribbon */}
        <div
          className={`flex shrink-0 items-center gap-5 ${
            shouldReduceMotion ? "flex-wrap justify-center overflow-x-auto" : "animate-marquee"
          } py-1.5 whitespace-nowrap`}
          style={
            !shouldReduceMotion && isPaused
              ? { animationPlayState: "paused" }
              : undefined
          }
        >
          {/* Main Track */}
          {endorsements.map((item, idx) => {
            const IconComponent =
              ICON_MAP[item.iconName as keyof typeof ICON_MAP] || ShieldCheck;
            return (
              <div
                key={`main-${idx}`}
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xs bg-white border border-border-warm hover:border-terracotta transition-colors shadow-xs"
              >
                <div className="w-8 h-8 rounded-full bg-cream border border-terracotta/30 flex items-center justify-center text-terracotta-dark shrink-0">
                  <IconComponent className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-forest block font-serif">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-ink-secondary block font-sans">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Accessible Duplicate Track for Infinite Loop: hidden from screen readers */}
          {!shouldReduceMotion &&
            endorsements.map((item, idx) => {
              const IconComponent =
                ICON_MAP[item.iconName as keyof typeof ICON_MAP] || ShieldCheck;
              return (
                <div
                  key={`clone-${idx}`}
                  aria-hidden="true"
                  className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xs bg-white border border-border-warm hover:border-terracotta transition-colors shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-cream border border-terracotta/30 flex items-center justify-center text-terracotta-dark shrink-0">
                    <IconComponent className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-forest block font-serif">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-ink-secondary block font-sans">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
