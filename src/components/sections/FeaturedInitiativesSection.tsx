"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import { HanumanMurtiVisual } from "@/components/campaigns/HanumanMurtiVisual";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Layers,
  Heart,
  Landmark,
} from "lucide-react";

export function FeaturedInitiativesSection() {
  return (
    <section
      id="featured-initiatives"
      aria-labelledby="featured-initiatives-heading"
      className="py-16 sm:py-20 md:py-24 bg-cream border-b border-border-warm scroll-mt-16"
    >
      <Container size="default" className="space-y-12">
        {/* Section Heading */}
        <Reveal direction="up" className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-terracotta/10 text-terracotta-dark text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Priority Focus</span>
          </div>
          <h2
            id="featured-initiatives-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight"
          >
            Featured Initiatives
          </h2>
          <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
            Strategic initiatives undergoing phased development, distinctly classified by governance and funding status.
          </p>
        </Reveal>

        {/* 2 Featured Initiatives Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Initiative 1: Education Target */}
          <Reveal direction="up" delay={0.06} className="h-full">
            <div className="p-7 sm:p-8 bg-white rounded-xs border-2 border-border-warm hover:border-sand transition-all shadow-sm flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-border-warm">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[11px] font-bold uppercase tracking-wider bg-gold/20 text-forest font-mono">
                    Proposed Education Target
                  </span>
                  <span className="text-[11px] font-medium text-ink-sand">
                    Subject to Board Sanction
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-sand" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                      Higher Education Support: Up to 200 Students
                    </h3>
                    <p className="text-xs text-terracotta-dark font-semibold mt-0.5 font-sans">
                      Proposed Target — Confirmed funded places currently stand at zero
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
                  Proposed target — up to 200 students, subject to formal board sanction and confirmed funding. Confirmed funded places currently stand at zero, based on the existing programme record. Sponsoring accredited higher education tuition via direct electronic institution transfers with zero intermediary deductions.
                </p>

                <div className="p-3.5 bg-sand-light/70 rounded-xs border border-border-warm text-xs text-ink space-y-1.5 font-sans">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-terracotta shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[11.5px] text-ink-sand leading-snug">
                      <strong>Fiduciary Integrity:</strong> Grants will disburse directly to verified college bursar accounts upon completed statutory intake. No cash distributions.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/scholarships">
                  <Button variant="primary" size="sm" className="font-bold">
                    <span>View Scholarship Criteria</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/programmes#education">
                  <Button variant="outline" size="sm" className="text-xs">
                    <span>Remedial Centres Record</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Initiative 2: Hanuman Murti Initiative */}
          <Reveal direction="up" delay={0.12} className="h-full">
            <div className="p-7 sm:p-8 bg-forest-deep text-white rounded-xs border-2 border-sand/35 shadow-sm flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-sand/20">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xs text-[11px] font-bold uppercase tracking-wider bg-sand text-forest-deep font-mono">
                    Proposed Initiative
                  </span>
                  <span className="text-[11px] font-medium text-cream/70 font-mono">
                    Dedicated Segregated Ledger
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xs bg-sand text-forest-deep flex items-center justify-center shrink-0">
                    <Landmark className="w-6 h-6 text-forest-deep" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      The Proposed Grand Hanuman Murti Project
                    </h3>
                    <p className="text-xs text-sand font-serif italic mt-0.5">
                      Proposed 80–100-Foot Elevation • Cultural &amp; Civic Devotion
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-cream/85 leading-relaxed font-sans">
                  A monumental community initiative celebrating Lord Hanuman as the universal embodiment of selfless service (<em>Seva</em>), physical resilience, and moral strength. Feasibility appraisal in progress; all contributions are restricted to a segregated project account.
                </p>

                <div className="p-3.5 bg-forest/80 rounded-xs border border-sand/30 text-xs text-cream/90 space-y-1.5 font-sans">
                  <div className="flex items-start gap-2">
                    <Layers className="w-4 h-4 text-sand shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[11.5px] leading-snug">
                      <strong>Fund Segregation Guarantee:</strong> Monies raised for the Hanuman Murti project cannot be commingled with general welfare or educational programmes.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/campaigns/hanuman-murti">
                  <Button variant="gold" size="sm" className="font-bold">
                    <span>Explore Campaign Vision</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/donate?programme=HANUMAN_MURTI">
                  <Button variant="dark-outline" size="sm" className="text-xs !border-sand/40 hover:!bg-white/10">
                    <Heart className="w-3.5 h-3.5 mr-1.5 text-sand" aria-hidden="true" />
                    <span>Contribute Online</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
