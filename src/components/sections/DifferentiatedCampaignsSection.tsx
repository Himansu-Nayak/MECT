"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/MotionPrimitives";

const HanumanMurti3DExperience = dynamic(
  () =>
    import("@/components/campaigns/HanumanMurti3DExperience").then(
      (mod) => mod.HanumanMurti3DExperience
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[210px] w-full bg-[#16221D] rounded-xs border border-sand/20 flex items-center justify-center text-xs text-sand/70 font-mono">
        Loading 3D Landmark Viewport...
      </div>
    ),
  }
);
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Landmark,
  Heart,
  FileCheck2,
  Lock,
  RotateCw,
} from "lucide-react";

/**
 * MECT Phase 27 — Section 07: Differentiated Campaigns & Cultural Heritage
 *
 * Upgraded with:
 * - Animated educational target telemetry meter
 * - Enhanced interactive Hanuman Murti 3D WebGL orbital viewport
 * - Strict ring-fenced sub-ledger accounting disclosure (HANUMAN_MURTI)
 */
export function DifferentiatedCampaignsSection() {
  return (
    <section
      id="campaigns-and-initiatives"
      aria-labelledby="campaigns-heading"
      className="py-16 sm:py-20 md:py-24 bg-[#FAF7F2] border-b border-[#E7E0D5] scroll-mt-16 relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-16 max-w-[1520px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-terracotta-dark shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>Section 07 • Differentiated Campaigns &amp; Initiatives</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="campaigns-heading"
              className="font-serif text-[clamp(1.9rem,3.2vw,3rem)] font-bold text-ink tracking-tight leading-[1.14] [text-wrap:balance]"
            >
              Differentiated Priorities: Educational Opportunity vs. Cultural Landmark
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
              MECT enforces strict statutory and accounting segregation between grassroots youth tuition sponsorships and cultural initiatives. Each campaign operates under separate project dockets, distinct bank sub-ledgers, and dedicated utilization records.
            </p>
          </Reveal>
        </div>

        {/* Dual Architectural Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* =========================================================================
              CAMPAIGN 01: HIGHER EDUCATION SPONSORSHIP (Humanitarian Ivory Ledger)
              ========================================================================= */}
          <Reveal direction="up" delay={0.05} className="h-full">
            <div className="p-7 sm:p-9 bg-white rounded-[2px] border border-[#E7E0D5] hover:border-terracotta/40 transition-all shadow-xs flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-5">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3.5 border-b border-[#E7E0D5]">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-mono uppercase tracking-wider bg-terracotta/10 text-terracotta-dark font-bold">
                    Educational Sponsorship
                  </span>
                  <span className="text-[11px] font-mono text-terracotta font-semibold">
                    Target Awaiting Sponsorship
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-terracotta" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                      Higher Education Target: Up to 200 Students
                    </h3>
                    <p className="text-xs text-terracotta-dark font-mono font-semibold mt-0.5">
                      Status: Proposed Target (Confirmed Funded: 0 / 200)
                    </p>
                  </div>
                </div>

                {/* Authentic Educational Cohort Visual */}
                <div className="relative h-[210px] w-full rounded-[2px] overflow-hidden border border-[#E7E0D5] bg-[#16221D] shadow-xs">
                  <Image
                    src="/images/hero/mect-civic-pledge-classroom.webp"
                    alt="MECT secondary and higher secondary scholarship candidates in Balangir"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/90">
                    <span className="bg-black/60 px-2 py-0.5 rounded-[2px] backdrop-blur-xs">Balangir Field Centre</span>
                    <span className="bg-black/60 px-2 py-0.5 rounded-[2px] backdrop-blur-xs">Target Intake Window</span>
                  </div>
                </div>

                {/* Target Intake Progress Bar */}
                <div className="p-3.5 bg-[#FAF7F2] rounded-[2px] border border-[#E7E0D5] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-ink font-bold">Sponsorship Window Telemetry:</span>
                    <span className="text-terracotta font-semibold">0 / 200 Funded</span>
                  </div>
                  <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-[#E7E0D5]">
                    <div className="h-full bg-terracotta/30 w-[2%]" />
                  </div>
                  <div className="text-[10.5px] text-ink-muted font-sans leading-snug">
                    Awaiting formal Board intake window and dedicated corporate/individual sponsorship pledges.
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                  Targeting need-cum-merit college fee sponsorships for eligible 10th and 12th pass students across Western Odisha. Confirmed funded places currently stand at zero based on active registers, awaiting formal Trust intake sanction.
                </p>

                {/* Direct Disbursal Guarantee Box */}
                <div className="p-4 bg-[#FAF7F2] rounded-[2px] border border-[#E7E0D5] text-xs text-ink space-y-2 font-sans">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-terracotta shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[11.5px] text-ink-secondary leading-snug">
                      <strong className="text-ink font-semibold">Direct Disbursal Guarantee:</strong> Grants remit directly from the Trust account to accredited universities, colleges, and polytechnics via RTGS/NEFT against official fee vouchers. Zero intermediary cash disbursements.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/scholarships">
                  <Button variant="primary" size="sm" className="font-bold bg-terracotta hover:bg-terracotta-dark text-white">
                    <span>View Scholarship Criteria</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/donate?programme=HIGHER_EDUCATION">
                  <Button variant="outline" size="sm" className="border-[#E7E0D5] text-ink hover:bg-[#FAF7F2]">
                    <Heart className="w-3.5 h-3.5 mr-1.5 text-terracotta" />
                    <span>Sponsor a Student Grant</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* =========================================================================
              CAMPAIGN 02: 80-100 FT HANUMAN MURTI 3D PROJECT (Dark Slate Monument)
              ========================================================================= */}
          <Reveal direction="up" delay={0.1} className="h-full">
            <div className="p-7 sm:p-9 bg-[#0F1714] text-white rounded-[2px] border border-white/20 hover:border-[#C4924A]/60 transition-all shadow-md flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-5">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3.5 border-b border-white/15">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-mono uppercase tracking-wider bg-[#C4924A]/20 text-[#E5C499] border border-[#C4924A]/40 font-bold">
                    Proposed Cultural Landmark
                  </span>
                  <span className="text-[11px] font-mono text-[#E5C499]">
                    Conceptual Architectural Initiative
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#16221D] border border-[#C4924A]/50 text-[#C4924A] flex items-center justify-center shrink-0 shadow-xs">
                    <Landmark className="w-6 h-6 text-[#C4924A]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      Proposed 80–100-Foot Hanuman Murti
                    </h3>
                    <p className="text-xs text-[#E5C499] font-mono mt-0.5">
                      Sub-Ledger: HANUMAN_MURTI • Separate Dedicated Bank Account
                    </p>
                  </div>
                </div>

                {/* Interactive 3D WebGL Orbital Canvas with Rotation Hint */}
                <div className="relative rounded-[2px] overflow-hidden border border-white/15 bg-black/50 shadow-inner group/canvas">
                  <HanumanMurti3DExperience className="h-[210px] w-full" variant="card" />
                  <div className="absolute top-2 right-2 bg-black/75 px-2 py-0.5 rounded-[2px] text-[10px] font-mono text-[#E5C499] flex items-center gap-1">
                    <RotateCw className="w-3 h-3 text-[#C4924A]" />
                    <span>Interactive 3D Viewport</span>
                  </div>
                </div>

                {/* Sub-Ledger Segregation Disclosure */}
                <div className="p-3.5 bg-[#16221D] rounded-[2px] border border-white/10 text-xs text-cream/90 space-y-1.5 font-sans">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#C4924A] font-semibold">
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Ring-Fenced Sub-Ledger Accounting:</span>
                  </div>
                  <p className="text-cream/80 text-[11.5px] leading-snug">
                    All contributions designated for the monument are isolated under Sub-Ledger <code className="text-[#E5C499] font-mono">HANUMAN_MURTI</code> and cannot cross-mingle with secular educational funds.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/campaigns/hanuman-murti">
                  <Button variant="primary" size="sm" className="font-bold bg-[#C4924A] hover:bg-[#A87B39] text-[#0D1512] border-0">
                    <span>Explore 3D Monument Vision</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/donate?programme=HANUMAN_MURTI">
                  <Button variant="dark-outline" size="sm" className="border-white/30 text-white hover:border-[#C4924A]">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#C4924A]" />
                    <span>Support Murti Project</span>
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
