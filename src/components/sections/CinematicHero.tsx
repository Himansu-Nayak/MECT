"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ORG } from "@content/org";
import {
  CountUpStat,
  MOTION_EASING,
  MOTION_DURATION,
} from "@/components/ui/MotionPrimitives";
import {
  ShieldCheck,
  Heart,
  ArrowRight,
  ChevronDown,
  MapPin,
  Sparkles,
  ArrowUpRight,
  ChevronLeft,
  Pause,
  Play,
} from "lucide-react";

interface HeroGallerySlide {
  src: string;
  alt: string;
  caption: string;
  location: string;
  catalogCode: string;
}

const HERO_GALLERY_SLIDES: HeroGallerySlide[] = [
  {
    src: "/images/hero/mect-classroom-study-circle.webp",
    alt: "Rural secondary students participating in remedial education study circle",
    caption: "Remedial Education Study Circle",
    location: "Puīntalā, Odisha",
    catalogCode: "EDU-2024-SC",
  },
  {
    src: "/images/hero/mect-civic-pledge-classroom.webp",
    alt: "Students taking civic pledge during rural education session",
    caption: "Rural Student Leadership & Civic Pledge",
    location: "Western Odisha",
    catalogCode: "STU-2024-CP",
  },
  {
    src: "/images/hero/mect-women-empowerment-seminar.webp",
    alt: "Rural women participating in vocational tailoring and self-reliance seminar",
    caption: "Women's Vocational Tailoring Cohort",
    location: "Swavalamban Centre, Odisha",
    catalogCode: "WMN-2024-TC",
  },
  {
    src: "/images/hero/mect-clean-water-hygiene-demo.webp",
    alt: "Jal Seva safe drinking water and hygiene demonstration",
    caption: "Jal Seva Safe Drinking Water Outreach",
    location: "Transit Shelters, Odisha",
    catalogCode: "WTR-2024-JS",
  },
  {
    src: "/images/hero/mect-community-field-outreach.webp",
    alt: "Community elders and volunteers conducting village outreach and relief assessment",
    caption: "Community Relief & Village Outreach",
    location: "Rural Clusters, Odisha",
    catalogCode: "COM-2024-FO",
  },
  {
    src: "/images/hero/mect-public-health-awareness.webp",
    alt: "Public health awareness and community wellness initiative",
    caption: "Public Health Awareness & Relief",
    location: "Community Centres, Odisha",
    catalogCode: "HLT-2024-PH",
  },
];

/**
 * MECT Phase 27 & 18 — Immersive Documentary Editorial Split Hero
 *
 * Upgraded with:
 * - Multi-photograph authentic MECT field documentary gallery with smooth crossfade
 * - Accessible next/previous and dot navigation controls
 * - Breathing ambient radial lighting with subtle drift
 * - Dynamic telemetry count-up counters with tabular lining figures
 * - Strict prefers-reduced-motion compatibility
 */
export function CinematicHero() {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_GALLERY_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_GALLERY_SLIDES.length) % HERO_GALLERY_SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isPlaying || shouldReduceMotion) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, shouldReduceMotion, nextSlide]);

  const activeSlide = HERO_GALLERY_SLIDES[currentIndex];

  return (
    <section
      id="hero"
      aria-label="Institutional Introduction"
      className="relative overflow-hidden bg-[#0D1512] text-white pt-8 pb-14 sm:pt-12 sm:pb-18 md:pt-16 md:pb-24 border-b border-border-dark"
    >
      {/* Dynamic Archival Ambient Atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -top-40 -left-40 w-[680px] h-[680px] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(184, 93, 59, 0.28) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/4 -right-20 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
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
              LEFT COLUMN: EDITORIAL TYPOGRAPHY & SEQUENTIAL INTENT (Col 1-7)
              ========================================================================= */}
          <div className="order-1 lg:col-span-7 flex flex-col items-start text-left min-w-0">
            <div className="w-full space-y-5 sm:space-y-6 md:space-y-7">
              {/* Archival Classification Tag with Pulse Indicator */}
              <div
                className="inline-flex items-center gap-2 rounded-xs border border-[#C4924A]/40 bg-[#16221D]/90 backdrop-blur-md px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.08em] sm:tracking-[0.14em] text-[#E5C499] shadow-xs max-w-full"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0 animate-pulse" aria-hidden="true" />
                <span className="truncate">
                  {ORG.shortName} ARCHIVAL REGISTER • ESTD. {ORG.foundedYear} • {ORG.addresses.registered.city.toUpperCase()}
                </span>
              </div>

              {/* Commanding Editorial Headline with Masked Entrance */}
              <div className="overflow-hidden">
                <h1 className="font-serif text-[clamp(1.9rem,5vw,4.1rem)] font-bold text-white tracking-tight leading-[1.12] sm:leading-[1.08]">
                  Dignity Through Education.{" "}
                  <span className="italic font-normal text-[#E5C499] block sm:inline font-serif">
                    Resilience Through Community.
                  </span>
                </h1>
              </div>

              {/* Deeply Grounded Contextual Deck */}
              <p className="text-[15px] sm:text-base md:text-lg text-cream/90 font-sans leading-relaxed max-w-2xl font-normal">
                In Western Odisha, where agrarian distress and seasonal hardship test rural families, Mahaveer Educational &amp; Charitable Trust (MECT) builds an interconnected safety net — uniting rural education, women&apos;s vocational self-reliance, safe drinking water, and hospital relief.
              </p>

              {/* Primary Dual Actions with Tactile Micro-Interactions */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3.5 w-full sm:w-auto">
                <Link href="/donate" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto group font-bold px-7 h-12 text-sm shadow-md bg-terracotta hover:bg-terracotta-dark text-white border-0 transition-transform active:scale-[0.98]"
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
                    className="w-full sm:w-auto group font-semibold px-6 h-12 text-sm !border-white/35 !text-cream hover:!border-[#C4924A] hover:!bg-[#16221D]/80 transition-transform active:scale-[0.98]"
                  >
                    <span>Explore Interconnected Model</span>
                    <ArrowUpRight
                      className="w-4 h-4 ml-1.5 text-[#C4924A] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>
              </div>

              {/* Dynamic Audited Telemetry Bar (Counting Up on View) */}
              <div className="pt-5 border-t border-white/15 w-full grid grid-cols-3 gap-3 sm:gap-6">
                <div className="space-y-0.5">
                  <div className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight flex items-baseline">
                    <CountUpStat value="350+" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-cream/70 font-sans leading-snug">
                    Student Entries <span className="hidden sm:inline font-mono text-[10px] text-[#C4924A]/80">(FY 23–24)</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight flex items-baseline">
                    <CountUpStat value="120+" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-cream/70 font-sans leading-snug">
                    Women Enrolled <span className="hidden sm:inline font-mono text-[10px] text-[#C4924A]/80">(21–23 Cohorts)</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight flex items-baseline">
                    <CountUpStat value="10,000+" />
                  </div>
                  <div className="text-[11px] sm:text-xs text-cream/70 font-sans leading-snug">
                    Relief Servings <span className="hidden sm:inline font-mono text-[10px] text-[#C4924A]/80">(Summer Kiosks)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: DOCUMENTARY FIELD PHOTOGRAPHY GALLERY (Col 8-12)
              ========================================================================= */}
          <div className="order-2 lg:col-span-5 relative w-full">
            <div
              className="relative group"
              onMouseEnter={() => setIsPlaying(false)}
              onMouseLeave={() => setIsPlaying(true)}
              role="region"
              aria-roledescription="carousel"
              aria-label="MECT Field Activity Documentary Gallery"
            >
              {/* Primary Documentary Frame with Crossfade Transition */}
              <div
                className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-[2px] overflow-hidden border border-white/20 shadow-2xl bg-[#16221D]"
              >
                <AnimatePresence mode="wait">
                  <m.div
                    key={activeSlide.src}
                    initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.45,
                      ease: MOTION_EASING.institutional,
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeSlide.src}
                      alt={activeSlide.alt}
                      fill
                      priority={currentIndex === 0}
                      sizes="(max-width: 640px) 360px, (max-width: 1024px) 500px, 600px"
                      className="object-cover object-center"
                    />
                  </m.div>
                </AnimatePresence>

                {/* Subtle vignette gradient */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-32 pointer-events-none bg-gradient-to-t from-[#0D1512]/95 via-[#0D1512]/50 to-transparent"
                />

                {/* Archival Catalog Metadata Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-[2px] bg-[#0D1512]/92 border border-white/15 px-2.5 py-1 text-[11px] text-cream font-sans backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#C4924A] shrink-0" aria-hidden="true" />
                    <span>{activeSlide.caption} • {activeSlide.location}</span>
                  </div>
                  <span className="text-[10px] text-[#C4924A] uppercase tracking-wider font-mono bg-[#0D1512]/90 px-1.5 py-0.5 rounded-2xs border border-white/10">
                    {activeSlide.catalogCode}
                  </span>
                </div>

                {/* Manual Navigation Controls (Left/Right Chevrons & Play/Pause) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                    className="min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] p-2 rounded-xs bg-[#0D1512]/80 hover:bg-[#0D1512] text-cream/80 hover:text-white border border-white/15 backdrop-blur-sm transition-colors text-xs flex items-center justify-center"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous photograph"
                    className="min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] p-2 rounded-xs bg-[#0D1512]/80 hover:bg-[#0D1512] text-cream/80 hover:text-white border border-white/15 backdrop-blur-sm transition-colors text-xs flex items-center justify-center"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next photograph"
                    className="min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px] p-2 rounded-xs bg-[#0D1512]/80 hover:bg-[#0D1512] text-cream/80 hover:text-white border border-white/15 backdrop-blur-sm transition-colors text-xs flex items-center justify-center"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dot Pagination Bar */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                  {HERO_GALLERY_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.catalogCode}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}: ${slide.caption}`}
                      aria-current={currentIndex === idx ? "true" : undefined}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentIndex === idx
                          ? "w-6 bg-[#C4924A]"
                          : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Trust Guarantee Plaque with Delayed Stagger */}
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
            aria-label="Section 02 • Institutional Heritage — Scroll to Section 02"
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
