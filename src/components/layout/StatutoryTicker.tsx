// motion: owner = Motion
"use client";

import React, { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Sparkles, Heart, Pause, Play, ArrowRight, Bell } from "lucide-react";

const emptySubscribe = () => () => {};

export interface TickerAnnouncement {
  id: string;
  text: string;
  href: string;
  isHighlight?: boolean;
}

export const APPROVED_ANNOUNCEMENTS: TickerAnnouncement[] = [
  {
    id: "ann-edu",
    text: "Education & Learning — Remedial tuition hubs and study materials for rural Balangir students.",
    href: "/programmes#education",
  },
  {
    id: "ann-water-food",
    text: "Jal Seva & Jan Ahar — Safe summer drinking water and hospital food relief in Odisha.",
    href: "/programmes#water",
  },
  {
    id: "ann-women",
    text: "Swavalamban — Certified vocational tailoring and self-reliance skills for rural women.",
    href: "/programmes#women-empowerment",
  },
  {
    id: "ann-murti",
    text: "Shri Hanuman Murti — Proposed 80–100-foot cultural landmark (feasibility stage).",
    href: "/campaigns/hanuman-murti",
    isHighlight: true,
  },
];

export function StatutoryTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const shouldReduceMotion = useReducedMotion();

  const effectiveReduceMotion = mounted && Boolean(shouldReduceMotion);
  const isStatic = effectiveReduceMotion || isPaused;

  return (
    <div
      id="statutory-ticker"
      className="bg-[#0D1612] bg-forest-deep text-cream border-b border-sand/25 text-xs h-[36px] min-h-[36px] max-h-[36px] flex items-center transition-colors print:hidden overflow-hidden w-full max-w-full relative"
      role="region"
      aria-label="Institutional Announcements and Campaign Desk"
    >
      <Container size="wide" className="max-w-[1600px] overflow-hidden relative">
        <div className="flex items-center justify-between gap-3 sm:gap-4 min-w-0 w-full overflow-hidden">
          {/* Left: Ticker Badge, Pause Toggle & Continuous Announcement Ticker */}
          <div className="group flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0 flex-1 relative bg-[#0D1612]">
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-sand text-forest-deep text-[10px] font-bold uppercase tracking-wider shadow-xs">
              <Bell className="w-3 h-3 text-forest-deep" aria-hidden="true" />
              <span>Announcements</span>
            </span>

            {!effectiveReduceMotion && (
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-pressed={isPaused}
                aria-label={
                  isPaused
                    ? "Resume announcement ticker"
                    : "Pause announcement ticker"
                }
                title={isPaused ? "Resume ticker" : "Pause ticker"}
                className="shrink-0 inline-flex items-center justify-center min-w-[28px] min-h-[28px] px-1.5 rounded-xs border border-sand/35 text-sand hover:bg-forest transition-colors focus-visible:outline-2 focus-visible:outline-sand"
              >
                {isPaused ? (
                  <Play className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <Pause className="w-3 h-3" aria-hidden="true" />
                )}
              </button>
            )}

            {isStatic ? (
              <div className="text-[11px] sm:text-xs text-white/95 min-w-0 flex-1 overflow-hidden">
                <div className="flex items-center gap-x-3 whitespace-nowrap overflow-hidden font-medium">
                  {APPROVED_ANNOUNCEMENTS.map((item, idx) => (
                    <span key={item.id} className="inline-flex items-center shrink-0">
                      {idx > 0 && (
                        <span className="mr-3 text-sand/85" aria-hidden="true">
                          •
                        </span>
                      )}
                      <Link
                        href={item.href}
                        className={`hover:text-sand transition-colors ${
                          item.isHighlight ? "font-semibold text-sand-light" : "text-white/95"
                        }`}
                      >
                        {item.text}
                      </Link>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden whitespace-nowrap text-[11px] sm:text-xs text-white/95 min-w-0 flex-1">
                <div
                  className="inline-flex items-center gap-6 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] font-medium"
                  style={{ animationPlayState: isPaused ? "paused" : undefined }}
                >
                  {APPROVED_ANNOUNCEMENTS.map((item, idx) => (
                    <span key={item.id} className="inline-flex items-center shrink-0">
                      {idx > 0 && (
                        <span className="mx-3 text-sand/85" aria-hidden="true">
                          •
                        </span>
                      )}
                      <Link
                        href={item.href}
                        className={`hover:text-sand transition-colors ${
                          item.isHighlight ? "font-semibold text-sand-light" : "text-white/95"
                        }`}
                      >
                        {item.text}
                      </Link>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/campaigns/hanuman-murti"
              aria-label="Murti Project: View Campaign"
              className="lg:hidden shrink-0 inline-flex items-center gap-1 px-2 py-1 min-h-[28px] rounded-xs border border-sand/40 text-[10px] font-semibold text-sand hover:bg-forest transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              <span>Murti Project</span>
            </Link>
          </div>

          {/* Right: Direct Campaign & Donation Shortcuts */}
          <div className="hidden lg:flex items-center space-x-3.5 shrink-0 text-[11px] font-sans">
            <Link
              href="/campaigns/hanuman-murti"
              className="text-sand font-bold hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-sand"
            >
              <Sparkles className="w-3 h-3 text-sand" aria-hidden="true" />
              <span>Hanuman Murti (80–100 Ft)</span>
            </Link>
            <span className="text-white/30" aria-hidden="true">|</span>
            <Link
              href="/donate"
              className="text-white font-semibold hover:text-sand transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-sand"
            >
              <Heart className="w-3 h-3 text-sand fill-current" aria-hidden="true" />
              <span>Donate Now</span>
            </Link>
            <span className="text-white/30" aria-hidden="true">|</span>
            <Link
              href="/statutory-disclosures"
              className="text-cream/85 hover:text-sand transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-sand"
            >
              <span>Disclosures</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
