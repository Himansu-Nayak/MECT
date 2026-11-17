// motion: owner = Motion
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { FIELD_DISPATCHES, type FieldDispatch } from "@content/stories";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { MOTION_TRANSITIONS } from "@/lib/motion";

export interface StoriesRailSectionProps {
  id?: string;
  className?: string;
}

/**
 * Stories Rail Section (`Phase 21.5.6`):
 * FIELD DISPATCHES — PEOPLE, PLACES & PURPOSE
 *
 * Communicates MECT's real educational, vocational, and emergency relief work
 * through documented community experiences, genuine locations, and factual evidence.
 * Strictly adheres to institutional dignity and zero fabricated testimonials.
 */
export function StoriesRailSection({
  id = "stories",
  className = "",
}: StoriesRailSectionProps) {
  const [activeId, setActiveId] = useState<string>(FIELD_DISPATCHES[0]?.id ?? "");

  const activeDispatch: FieldDispatch =
    FIELD_DISPATCHES.find((d) => d.id === activeId) ?? FIELD_DISPATCHES[0];

  return (
    <section
      id={id}
      aria-labelledby="field-dispatches-heading"
      className={`py-20 md:py-28 bg-sand-light/60 border-b border-border-warm scroll-mt-20 relative overflow-hidden ${className}`}
    >
      {/* Decorative institutional watermark */}
      <div
        className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-sand/30 pointer-events-none blur-3xl"
        aria-hidden="true"
      />

      <Container size="default" className="space-y-12 relative z-10">
        {/* Editorial Section Header */}
        <Reveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-border-warm/80 pb-8">
            <div className="space-y-3 max-w-2xl">
              <Badge variant="forest" size="md" icon={<Sparkles className="w-3 h-3 text-forest" />}>
                Field Dispatches &amp; Community Voices
              </Badge>
              <h2
                id="field-dispatches-heading"
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight leading-tight"
              >
                Field Dispatches — People, Places &amp; Purpose
              </h2>
              <p className="text-sm sm:text-base text-ink-sand leading-relaxed font-sans">
                Documented community experiences, learning environments, and humanitarian relief
                initiatives across Western Odisha, presented through verified institutional records.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/stories">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  <span>View All Dispatches Archive</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Dispatch Selector Navigation Tabs */}
        <Reveal direction="up" delay={0.08}>
          <div
            role="tablist"
            aria-label="Field Dispatches"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
          {FIELD_DISPATCHES.map((dispatch, idx) => {
            const isSelected = dispatch.id === activeDispatch.id;
            return (
              <button
                key={dispatch.id}
                role="tab"
                id={`tab-${dispatch.slug}`}
                aria-selected={isSelected}
                aria-controls={`panel-${dispatch.slug}`}
                onClick={() => setActiveId(dispatch.id)}
                className={`p-4 sm:p-5 rounded-xs border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-white border-terracotta shadow-xs ring-1 ring-terracotta/30"
                    : "bg-cream/70 border-border-warm hover:bg-white hover:border-terracotta/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <span
                    className={`text-[10px] uppercase tracking-widest font-mono font-bold px-2 py-0.5 rounded-2xs ${
                      isSelected
                        ? "bg-forest text-cream"
                        : "bg-sand text-forest"
                    }`}
                  >
                    {dispatch.editorialLabel}
                  </span>
                  <span className="text-[11px] font-mono text-ink-secondary">
                    0{idx + 1}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3
                    className={`font-serif text-base sm:text-lg font-bold leading-snug line-clamp-1 ${
                      isSelected ? "text-forest" : "text-ink"
                    }`}
                  >
                    {dispatch.title.split(":")[0]}
                  </h3>
                  <p className="text-xs text-ink-secondary line-clamp-1 font-sans">
                    {dispatch.location.split(",")[0]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Reveal>

        {/* Active Featured Dispatch Display */}
        <AnimatePresence mode="wait">
          <m.div
            key={activeDispatch.id}
            id={`panel-${activeDispatch.slug}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeDispatch.slug}`}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={MOTION_TRANSITIONS.fast}
            className="rounded-xs border border-border-warm bg-white shadow-xs overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Documentary Photography Column (7 cols on desktop) */}
              <div className="lg:col-span-7 relative bg-forest-deep flex flex-col justify-between p-4 sm:p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border-warm">
                <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden rounded-2xs border border-sand/20 shadow-xs">
                  <Image
                    src={activeDispatch.image.src}
                    alt={activeDispatch.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-cream/90 font-mono">
                    <span className="truncate pr-2">{activeDispatch.image.credit}</span>
                    <span className="shrink-0 bg-forest/80 px-2 py-0.5 rounded-2xs border border-white/20">
                      Archival Record
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cream/15 text-xs text-cream/85 font-sans leading-relaxed">
                  <span className="font-semibold text-sand-light uppercase tracking-wider text-[10px] block mb-1">
                    Documentary Record Caption:
                  </span>
                  {activeDispatch.image.caption}
                </div>
              </div>

              {/* Editorial Narrative & Metadata Column (5 cols on desktop) */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-cream/30">
                <div className="space-y-4">
                  {/* Category & Status Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="forest" size="sm">
                      {activeDispatch.editorialLabel}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {activeDispatch.programme}
                    </Badge>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-tight">
                      {activeDispatch.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-secondary italic font-serif">
                      {activeDispatch.subtitle}
                    </p>
                  </div>

                  {/* Location & Period Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 pb-1 text-xs text-ink-sand font-mono border-y border-border-warm">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0" aria-hidden="true" />
                      <span className="truncate">{activeDispatch.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-forest shrink-0" aria-hidden="true" />
                      <span className="truncate">{activeDispatch.period}</span>
                    </div>
                  </div>

                  {/* Core Narrative Body */}
                  <p className="text-xs sm:text-sm text-ink leading-relaxed font-sans">
                    {activeDispatch.summary}
                  </p>

                  {/* Documented Observations */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[11px] uppercase tracking-wider font-mono font-bold text-forest">
                      Key Documented Observations
                    </h4>
                    <ul className="space-y-1.5 text-xs text-ink-sand font-sans">
                      {activeDispatch.highlights.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2
                            className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Provenance & Action Link Footer */}
                <div className="pt-4 border-t border-border-warm space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-ink-secondary font-mono">
                    <FileCheck2 className="w-3.5 h-3.5 text-forest shrink-0" aria-hidden="true" />
                    <span className="truncate">Source: {activeDispatch.sourceReference}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Link href={activeDispatch.destinationUrl}>
                      <Button variant="primary" size="sm" className="w-full sm:w-auto">
                        <span>Read Full Field Dispatch</span>
                        <ArrowUpRight className="w-4 h-4 ml-1" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link href="/reports">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <BookOpen className="w-3.5 h-3.5 mr-1 text-ink-secondary" aria-hidden="true" />
                        <span>Annual Reports Archive</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </AnimatePresence>

        {/* Global Bottom Invitation & Fiduciary Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xs bg-white border border-border-warm text-xs text-ink-secondary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-forest" aria-hidden="true" />
            <span>
              <strong>Dignity &amp; Evidence Policy:</strong> MECT publishes verified programme records. No invented quotes or fabricated beneficiary identities are published.
            </span>
          </div>
          <Link href="/stories" className="shrink-0 font-semibold text-terracotta hover:underline inline-flex items-center gap-1">
            <span>Explore Complete Field Dispatches Archive</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
