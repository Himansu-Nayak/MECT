"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { HanumanMurti3DExperience } from "@/components/campaigns/HanumanMurti3DExperience";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Landmark,
  Heart,
  FileCheck2,
} from "lucide-react";

export function DifferentiatedCampaignsSection() {
  return (
    <section
      id="campaigns-and-initiatives"
      aria-labelledby="campaigns-heading"
      className="py-16 sm:py-20 md:py-24 bg-cream border-b border-border-warm scroll-mt-16 relative overflow-hidden"
    >
      <Container size="default" className="space-y-14 sm:space-y-16">
        {/* Editorial Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-terracotta-dark font-sans shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>Section 07 • Campaigns &amp; Initiatives</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="campaigns-heading"
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight [text-wrap:balance]"
            >
              Differentiated Initiatives: Educational &amp; Cultural Heritage
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-sm sm:text-base text-ink leading-relaxed font-sans">
              MECT maintains strict governance segregation between grassroots educational fee sponsorships and long-term cultural initiatives. Each campaign operates under distinct project charters, defined timelines, and ring-fenced financial sub-ledgers.
            </p>
          </Reveal>
        </div>

        {/* 2 Major Differentiated Initiatives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Initiative 1: Higher Education Support Target (Up to 200 Students) */}
          <Reveal direction="up" delay={0.05} className="h-full">
            <div className="p-7 sm:p-9 bg-white rounded-xs border-2 border-border-warm hover:border-sand transition-all shadow-sm flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3.5 border-b border-border-warm">
                  <Badge variant="forest">Educational Sponsorship</Badge>
                  <span className="text-[11px] font-medium text-ink-sand font-mono">
                    Proposed Intake Target
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-sand" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                      Higher Education Target: Up to 200 Students
                    </h3>
                    <p className="text-xs text-terracotta-dark font-semibold mt-0.5 font-sans">
                      Proposed Target — Subject to Board Sanction and Confirmed Funding
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
                  Targeting need-cum-merit college fee sponsorships for eligible 10th and 12th pass students across Western Odisha. Confirmed funded places currently stand at zero based on active registers, awaiting the next formal Trust intake window.
                </p>

                <div className="p-4 bg-sand-light/60 rounded-xs border border-border-warm text-xs text-ink space-y-2 font-sans">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-terracotta shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[11.5px] text-ink-sand leading-snug">
                      <strong>Direct Disbursal Guarantee:</strong> Grants remit directly to accredited universities, degree colleges, and vocational polytechnics via verified banking channels. Zero cash hand-outs.
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
                    <span>Remedial Hub Network</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Initiative 2: Proposed 80–100 ft Grand Hanuman Murti Project with 3D WebGL */}
          <Reveal direction="up" delay={0.1} className="h-full">
            <div className="p-7 sm:p-9 bg-white rounded-xs border-2 border-border-warm hover:border-sand transition-all shadow-sm flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3.5 border-b border-border-warm">
                  <Badge variant="gold">Proposed Cultural Initiative</Badge>
                  <span className="text-[11px] font-semibold text-terracotta-dark font-mono">
                    Sub-Ledger: HANUMAN_MURTI
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xs bg-terracotta text-cream flex items-center justify-center shrink-0">
                    <Landmark className="w-6 h-6 text-sand" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                      The Grand Hanuman Murti Cultural Project
                    </h3>
                    <p className="text-xs text-ink-sand font-mono mt-0.5">
                      Proposed Dimension: 80–100 Feet • Cultural &amp; Community Hub
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
                  A multi-year conceptual cultural initiative honoring Odisha&apos;s civilizational identity and creating an enduring community focal point in Balangir for cultural gatherings, youth mentoring, and civic service.
                </p>

                {/* Interactive 3D WebGL Orbital Canvas */}
                <div className="relative rounded-xs border border-border-warm bg-sand-light/40 overflow-hidden">
                  <HanumanMurti3DExperience className="h-[210px] w-full" variant="card" />
                </div>

                <div className="p-3.5 bg-forest-deep text-cream rounded-xs border border-sand/30 text-[11.5px] font-sans flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-sand shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="leading-snug text-cream/90">
                    <strong>Dual-Fund Segregation:</strong> All cultural contributions are accounted strictly under Sub-Ledger <code className="text-sand font-mono">HANUMAN_MURTI</code> in dedicated banking channels. Zero commingling with educational or healthcare donations.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/campaigns/hanuman-murti">
                  <Button variant="primary" size="sm" className="font-bold">
                    <span>Explore Full 3D Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/donate">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Heart className="w-3.5 h-3.5 mr-1.5 text-terracotta" aria-hidden="true" />
                    <span>Contribute to Cultural Project</span>
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
