"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { HOMEPAGE_CONTENT } from "@/lib/homepage-content";
import {
  ShieldCheck,
  Landmark,
  ArrowRight,
  MapPin,
  CheckCircle2,
  FileText,
  Compass,
} from "lucide-react";

export function InstitutionalIntroSection() {
  return (
    <section
      id="institutional-intro"
      aria-labelledby="institutional-intro-title"
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-cream/45 border-b border-border-warm relative overflow-hidden"
    >
      <span id="about-mect" className="sr-only" />
      {/* Subtle institutional parchment watermark in background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(229, 196, 153, 0.3) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 -left-32 w-[450px] h-[450px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(164, 94, 68, 0.2) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container size="default" className="relative z-10">
        {/* Top Editorial Eyebrow & Landmark Heading */}
        <div className="max-w-3xl space-y-3.5 sm:space-y-4 mb-10 sm:mb-14 lg:mb-16">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-sand-light/80 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-terracotta-dark font-sans shadow-2xs">
              <Landmark className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>{HOMEPAGE_CONTENT.aboutIntro.eyebrow}</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="institutional-intro-title"
              className="font-serif text-[clamp(1.85rem,4.4vw,2.75rem)] font-bold text-forest tracking-tight leading-[1.18] [text-wrap:balance]"
            >
              {HOMEPAGE_CONTENT.aboutIntro.heading}
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-[15px] sm:text-base md:text-lg text-ink leading-relaxed font-sans">
              {HOMEPAGE_CONTENT.aboutIntro.summary}
            </p>
          </Reveal>
        </div>

        {/* 2-Column Editorial Grid: Left Storytelling & Governance; Right Photographic Documentary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* =========================================================================
              LEFT COLUMN (Col 1-7): Principles, Vision/Mission & CTAs
              ========================================================================= */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10">
            {/* Core Fiduciary Principles (Numbered Editorial Items) */}
            <Reveal direction="up" delay={0.16} className="space-y-3.5">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-forest font-sans">
                Foundational Operating Principles
              </h3>
              <div className="space-y-3">
                {HOMEPAGE_CONTENT.aboutIntro.principles.map((principle, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xs bg-white/85 border border-border-warm shadow-2xs transition-colors hover:border-terracotta/40"
                  >
                    <span className="font-mono text-xs font-bold text-terracotta-dark bg-sand-light/60 border border-sand px-2 py-0.5 rounded-2xs shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-ink font-sans leading-relaxed">
                      {principle}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Vision & Operational Mission Editorial Cards */}
            <Reveal direction="up" delay={0.2} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Vision Card */}
              <div className="p-5 sm:p-6 rounded-xs bg-white border border-border-warm border-l-4 border-l-terracotta space-y-2 shadow-2xs">
                <div className="flex items-center gap-1.5 text-terracotta-dark">
                  <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-wider font-sans">
                    Institutional Vision
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-ink font-sans leading-relaxed">
                  {HOMEPAGE_CONTENT.aboutIntro.vision}
                </p>
              </div>

              {/* Mission Card */}
              <div className="p-5 sm:p-6 rounded-xs bg-white border border-border-warm border-l-4 border-l-forest space-y-2 shadow-2xs">
                <div className="flex items-center gap-1.5 text-forest">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-wider font-sans">
                    Operational Mission
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-ink font-sans leading-relaxed">
                  {HOMEPAGE_CONTENT.aboutIntro.mission}
                </p>
              </div>
            </Reveal>

            {/* Structured CTAs: Read Full Charter & Review Governance */}
            <Reveal direction="up" delay={0.24}>
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Link href="/about" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto group font-semibold shadow-xs"
                  >
                    <span>Read Full Institutional Charter</span>
                    <ArrowRight
                      className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>

                <Link href="/governance" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full sm:w-auto group font-semibold"
                  >
                    <FileText className="w-4 h-4 mr-2 text-forest shrink-0" aria-hidden="true" />
                    <span>Trust Deed &amp; Governance</span>
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* =========================================================================
              RIGHT COLUMN (Col 8-12): Authentic Photographic Evidence & Trust Seal
              ========================================================================= */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            {/* Primary Documentary Photograph: Trustees & Community Walk */}
            <Reveal direction="up" delay={0.18}>
              <div className="relative group">
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] rounded-sm overflow-hidden border border-border-warm shadow-xl bg-forest-deep">
                  <Image
                    src="/images/hero/mect-trustees-campus-walk.webp"
                    alt="Mahaveer Educational & Charitable Trust trustees and community participants walking together in Balangir"
                    fill
                    loading="lazy"
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 40vw"
                    className="object-cover object-[50%_18%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  {/* Subtle lower gradient for caption readability */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest-deep/95 via-forest-deep/50 to-transparent pointer-events-none"
                  />
                  {/* Documentary Archival Pill Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 rounded-xs bg-forest-deep/90 border border-sand/35 px-2.5 py-1 text-[11px] text-cream font-sans backdrop-blur-xs">
                      <MapPin className="w-3 h-3 text-sand shrink-0" aria-hidden="true" />
                      <span className="font-medium">Founding Trustees &amp; Community Walk • Balangir</span>
                    </div>
                    <span className="hidden sm:inline-block text-[10px] text-cream/70 uppercase tracking-widest font-mono">
                      Trust Deed 2013
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Statutory Regulatory Accreditation Box */}
            <Reveal direction="up" delay={0.22}>
              <div className="p-5 sm:p-6 rounded-xs bg-white border border-border-warm space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-2 pb-2.5 border-b border-border-warm">
                  <ShieldCheck className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                  <span className="font-sans font-bold text-xs uppercase tracking-wider text-forest">
                    Authoritative Statutory Registration
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                  <div className="space-y-0.5">
                    <span className="text-[10.5px] uppercase tracking-wider text-text-muted block">
                      Trust Deed (2013)
                    </span>
                    <span className="font-semibold text-forest">Doc No. 40311302194</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10.5px] uppercase tracking-wider text-text-muted block">
                      Income Tax 12A URN
                    </span>
                    <span className="font-semibold text-forest">AADTM5474FE20231</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10.5px] uppercase tracking-wider text-text-muted block">
                      Income Tax 80G URN
                    </span>
                    <span className="font-semibold text-forest">AADTM5474FF20241</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10.5px] uppercase tracking-wider text-text-muted block">
                      CSR Registration
                    </span>
                    <span className="font-semibold text-forest">CSR00081063</span>
                  </div>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed font-sans border-t border-border-warm/70 pt-2">
                  Eligible donations may qualify for deductions under Section 80G, subject to applicable statutory conditions and donor eligibility.
                </p>
                <div className="pt-2 border-t border-border-warm flex items-center justify-between text-xs">
                  <span className="text-text-muted font-sans text-[11px]">
                    Non-Remunerative Board (Clause XVI)
                  </span>
                  <Link
                    href="/statutory-disclosures"
                    className="text-terracotta-dark hover:text-forest font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View All Disclosures</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
