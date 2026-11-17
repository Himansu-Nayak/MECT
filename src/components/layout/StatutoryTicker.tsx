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
    id: "ann-01",
    text: "A Divine Vision in Progress — Proposed 80–100-Foot Hanuman Murti Project.",
    href: "/campaigns/hanuman-murti",
    isHighlight: true,
  },
  {
    id: "ann-02",
    text: "Join Mahaveer Educational & Charitable Trust in Supporting the Proposed Grand Hanuman Murti Initiative.",
    href: "/campaigns/hanuman-murti",
    isHighlight: true,
  },
  {
    id: "ann-03",
    text: "Be Part of Our Collective Vision — Support the Hanuman Murti Fundraising Campaign.",
    href: "/donate?programme=HANUMAN_MURTI",
  },
  {
    id: "ann-04",
    text: "Every Contribution Matters — Support This Proposed Monumental Initiative.",
    href: "/donate?programme=HANUMAN_MURTI",
  },
  {
    id: "ann-05",
    text: "Faith, Devotion and Community Participation — Join the Journey of the Proposed Hanuman Murti Project.",
    href: "/campaigns/hanuman-murti",
    isHighlight: true,
  },
  {
    id: "ann-06",
    text: "Explore Our Educational, Sports and Community Welfare Initiatives.",
    href: "/programmes",
  },
  {
    id: "ann-07",
    text: "Proposed Target — Up to 200 Students, Subject to Formal Board Sanction and Confirmed Funding.",
    href: "/programmes#education",
  },
  {
    id: "ann-08",
    text: "Discover MECT's Education, Sports and Extracurricular Activities.",
    href: "/programmes#sports-extracurricular",
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
      className="bg-forest-deep text-cream border-b border-sand/25 text-xs py-1.5 transition-colors print:hidden overflow-clip w-full max-w-full relative [contain:paint_layout]"
      role="region"
      aria-label="Institutional Announcements and Campaign Desk"
    >
      <Container size="wide" className="max-w-[1600px] overflow-clip relative [contain:paint_layout]">
        <div className="flex items-center justify-between gap-3 sm:gap-4 min-w-0 w-full overflow-clip">
          {/* Left: Ticker Badge, Pause Toggle & Continuous Announcement Ticker */}
          <div className="group flex items-center gap-2 sm:gap-3 overflow-clip min-w-0 flex-1 relative [contain:paint_layout]">
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
              <div className="text-[11px] sm:text-xs text-white/95 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-medium">
                  {APPROVED_ANNOUNCEMENTS.map((item, idx) => (
                    <span key={item.id} className="inline-flex items-center">
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
              <div className="relative overflow-clip whitespace-nowrap text-[11px] sm:text-xs text-white/95 min-w-0 flex-1 [contain:paint_layout] [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
                <div
                  className="inline-flex items-center animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] font-medium [contain:layout]"
                  style={{ animationPlayState: isPaused ? "paused" : undefined }}
                >
                  {[0, 1].map((dup) => (
                    <span
                      key={dup}
                      aria-hidden={dup === 1}
                      inert={dup === 1 ? true : undefined}
                      className="inline-flex items-center shrink-0 pr-6"
                    >
                      {APPROVED_ANNOUNCEMENTS.map((item) => (
                        <span key={`${dup}-${item.id}`} className="inline-flex items-center">
                          <span className="mx-3 text-sand/85" aria-hidden="true">
                            •
                          </span>
                          <Link
                            href={item.href}
                            tabIndex={dup === 1 ? -1 : 0}
                            className={`hover:text-sand transition-colors ${
                              item.isHighlight ? "font-semibold text-sand-light" : "text-white/95"
                            }`}
                          >
                            {item.text}
                          </Link>
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href="/campaigns/hanuman-murti"
              aria-label="View Hanuman Murti Campaign"
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
