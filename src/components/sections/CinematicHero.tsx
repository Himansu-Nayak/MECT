"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroEntrance } from "@/components/ui/MotionPrimitives";
import {
  ShieldCheck,
  Heart,
  ArrowRight,
  ChevronDown,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

/**
 * MECT Phase 26 — Documentary Editorial Split Hero
 *
 * Replaces generic centered template layout with an asymmetrical,
 * museum-grade documentary composition.
 *
 * Left: Architectural typography, Western Odisha context, high-contrast actions, live telemetry.
 * Right: Authentic field documentary photography with archival metadata stamp and Clause XVI guarantee.
 */
export function CinematicHero() {
  return (
    <section
      id="hero"
      aria-label="Institutional Introduction"
      className="relative overflow-hidden bg-[#0D1512] text-white pt-8 pb-14 sm:pt-12 sm:pb-18 md:pt-16 md:pb-24 border-b border-border-dark"
    >
      {/* Subtle Archival Grain & Vellum Radial Lighting */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -top-40 -left-40 w-[680px] h-[680px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(184, 93, 59, 0.28) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/4 -right-20 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(196, 146, 74, 0.22) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C4924A]/30 to-transparent" />
      </div>

      <Container size="default" className="relative z-10 max-w-[1520px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* =========================================================================
              LEFT COLUMN: EDITORIAL TYPOGRAPHY & INSTITUTIONAL INTENT (Col 1-7)
              ========================================================================= */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-start text-left min-w-0">
            <HeroEntrance className="w-full space-y-5 sm:space-y-6 md:space-y-7">
              {/* Archival Classification Tag */}
              <div className="inline-flex items-center gap-2 rounded-xs border border-[#C4924A]/40 bg-[#16221D]/90 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-[#E5C499] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0 animate-pulse" aria-hidden="true" />
                <span>MECT ARCHIVAL REGISTER • ESTD. 2013 • BALANGIR, ODISHA</span>
              </div>

              {/* Commanding Editorial Headline */}
              <h1 className="font-serif text-[clamp(2.4rem,4.5vw,4.1rem)] font-bold text-white tracking-tight leading-[1.08] [text-wrap:balance]">
                Dignity Through Education.{" "}
                <span className="italic font-normal text-[#E5C499] block sm:inline font-serif">
                  Resilience Through Community.
                </span>
              </h1>

              {/* Deeply Grounded Contextual Deck */}
              <p className="text-[15px] sm:text-base md:text-lg text-cream/90 font-sans leading-relaxed max-w-2xl font-normal">
                In Western Odisha, where agrarian distress and seasonal hardship test rural families, Mahaveer Educational &amp; Charitable Trust (MECT) builds an interconnected safety net — uniting rural education, women&apos;s vocational self-reliance, safe drinking water, and hospital relief.
              </p>

              {/* Primary Dual Actions */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3.5 w-full sm:w-auto">
                <Link href="/donate" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto group font-bold px-7 h-12 text-sm shadow-md bg-terracotta hover:bg-terracotta-dark text-white border-0"
                  >
                    <Heart className="w-4 h-4 mr-2 fill-white/20 transition-transform duration-300 group-hover:scale-110 shrink-0" aria-hidden="true" />
                    <span>Support Rural Education</span>
                    <ArrowRight
                      className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>

                <Link href="#work-areas" className="w-full sm:w-auto">
                  <Button
                    variant="dark-outline"
                    size="md"
                    className="w-full sm:w-auto group font-semibold px-6 h-12 text-sm !border-white/35 !text-cream hover:!border-[#C4924A] hover:!bg-[#16221D]/80"
                  >
                    <span>Explore Interconnected Model</span>
                    <ArrowUpRight
                      className="w-4 h-4 ml-1.5 text-[#C4924A] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>
              </div>

              {/* Live Audited Telemetry Bar (Directly Anchored in Hero) */}
              <div className="pt-5 border-t border-white/15 w-full grid grid-cols-3 gap-3 sm:gap-6">
                <div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                    350<span className="text-[#C4924A]">+</span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-cream/70 font-sans mt-0.5 leading-snug">
                    Student Entries <span className="hidden sm:inline font-mono text-[10px] text-[#C4924A]/80">(FY 23–24)</span>
                  </div>
                </div>

                <div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                    120<span className="text-[#C4924A]">+</span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-cream/70 font-sans mt-0.5 leading-snug">
                    Women Enrolled <span className="hidden sm:inline font-mono text-[10px] text-[#C4924A]/80">(21–23 Cohorts)</span>
                  </div>
                </div>

                <div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                    10,000<span className="text-[#C4924A]">+</span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-cream/70 font-sans mt-0.5 leading-snug">
                    Relief Servings <span className="hidden sm:inline font-mono text-[10px] text-[#C4924A]/80">(Summer Kiosks)</span>
                  </div>
                </div>
              </div>
            </HeroEntrance>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: DOCUMENTARY FIELD PHOTOGRAPHY COMPOSITION (Col 8-12)
              ========================================================================= */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative w-full">
            <div className="relative group">
              {/* Primary Documentary Photo Frame with Museum Hairline */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-[2px] overflow-hidden border border-white/20 shadow-2xl bg-[#16221D]">
                <Image
                  src="/images/hero/mect-trustees-campus-walk.webp"
                  alt="MECT trustees and community elders conducting field review at Puīntalā campus, Balangir"
                  fill
                  priority
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 42vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                {/* Subtle vignette gradient */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-32 pointer-events-none bg-gradient-to-t from-[#0D1512]/95 via-[#0D1512]/50 to-transparent"
                />

                {/* Archival Catalog Metadata Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 rounded-[2px] bg-[#0D1512]/92 border border-white/15 px-2.5 py-1 text-[11px] text-cream font-sans backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#C4924A] shrink-0" aria-hidden="true" />
                    <span>Puīntalā Campus • Balangir, Odisha</span>
                  </div>
                  <span className="text-[10px] text-[#C4924A] uppercase tracking-wider font-mono">
                    DOC-2024-FL
                  </span>
                </div>
              </div>

              {/* Floating Fiduciary Guarantee Plaque */}
              <div
                className="hidden sm:flex absolute -bottom-5 -left-5 xl:-bottom-6 xl:-left-6 max-w-xs p-3.5 rounded-[2px] bg-[#16221D]/96 border border-[#C4924A]/40 shadow-xl backdrop-blur-md z-20 items-start gap-3 pointer-events-none"
              >
                <div className="w-7 h-7 rounded-full bg-terracotta/20 border border-terracotta/50 flex items-center justify-center shrink-0 text-terracotta mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#C4924A]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#E5C499] font-bold">
                    Clause XVI Guarantee
                  </div>
                  <p className="text-[11px] text-cream/90 font-sans leading-snug mt-0.5">
                    100% Honorary Trusteeship. Zero salaries, sitting fees, or administrative commissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restful Editorial Scroll Cue */}
        <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center gap-1 text-center text-cream/60">
          <Link
            href="#why-mect-exists"
            aria-label="Scroll to Section 02: Why MECT Exists"
            className="group inline-flex flex-col items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#C4924A] rounded-xs p-1"
          >
            <span className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-cream/70 group-hover:text-[#E5C499] transition-colors">
              Section 02 • Institutional Heritage
            </span>
            <ChevronDown
              className="w-4 h-4 text-[#C4924A] transition-transform duration-300 group-hover:translate-y-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
