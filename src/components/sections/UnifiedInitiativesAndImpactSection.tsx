"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal, CountUpStat, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import { HanumanMurti3DExperience } from "@/components/campaigns/HanumanMurti3DExperience";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Scissors,
  Droplets,
  Landmark,
  Heart,
  FileCheck2,
} from "lucide-react";

/**
 * Section 04 — Priority Initiatives & Documented Impact (Phase 23 Master Architecture)
 *
 * Consolidates prospective institutional targets (Proposed 200-Student Target & Proposed
 * 80–100 ft Hanuman Murti with Interactive 3D Perspective) with demonstrated operational
 * telemetry (350+ student entries, 120+ course enrolments, 10,000+ relief instances).
 */
export function UnifiedInitiativesAndImpactSection() {
  const verifiedMetrics = [
    {
      value: "350+",
      label: "Student Participation Entries",
      subtext:
        "350+ recorded student participation entries (FY 2023–24), not necessarily 350 unique students supported. Documented across rural Balangir remedial coaching centres.",
      period: "FY 2023–24 Activity Record",
      icon: GraduationCap,
    },
    {
      value: "120+",
      label: "Vocational Course Enrolments",
      subtext:
        "120+ cumulative vocational course enrolments (FY 2021–23), not necessarily 120 uniquely certified women. Multi-cohort cycles in tailoring and craft fabrication.",
      period: "FY 2021–23 Multi-Cohort Cycles",
      icon: Scissors,
    },
    {
      value: "10,000+",
      label: "Water & Relief Service Instances",
      subtext:
        "10,000+ recorded water and relief service instances, not 10,000 unique citizens. Summer heatwave hydration kiosks and emergency relief instances.",
      period: "Multi-Year Field Service Log",
      icon: Droplets,
    },
    {
      value: "13+",
      suffix: "Years",
      label: "Statutory Trust Tenure",
      subtext:
        "Continuous registered charitable trust operations since execution of public Trust Deed on 27 July 2013 (Balangir Document No. 40311302194).",
      period: "2013 – Present Continuous Record",
      icon: Landmark,
    },
  ];

  return (
    <section
      id="initiatives-and-impact"
      aria-labelledby="initiatives-impact-heading"
      className="py-16 sm:py-20 md:py-24 bg-cream border-b border-border-warm scroll-mt-16"
    >
      <Container size="default" className="space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-terracotta/10 text-terracotta-dark text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Institutional Initiatives &amp; Evidence</span>
          </div>
          <h2
            id="initiatives-impact-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight"
          >
            Strategic Initiatives &amp; Documented Impact
          </h2>
          <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans max-w-2xl mx-auto">
            Strategic initiatives undergoing phased development, distinctly classified by governance and funding status, backed by audited attendance registers and statutory filings.
          </p>
        </div>

        {/* 1. Priority Initiatives Grid (2 Columns: Higher Education Target & Hanuman Murti 3D) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Initiative A: Higher Education Target */}
          <Reveal direction="up" delay={0.05} className="h-full">
            <div className="p-7 sm:p-9 bg-white rounded-xs border-2 border-border-warm hover:border-sand transition-all shadow-sm flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3.5 border-b border-border-warm">
                  <Badge variant="forest">Proposed Education Target</Badge>
                  <span className="text-[11px] font-medium text-ink-sand font-mono">
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

                <div className="p-4 bg-sand-light/60 rounded-xs border border-border-warm text-xs text-ink space-y-2 font-sans">
                  <div className="flex items-start gap-2.5">
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

          {/* Initiative B: The Grand Hanuman Murti Project with 3D Experience */}
          <Reveal direction="up" delay={0.1} className="h-full">
            <div className="p-7 sm:p-9 bg-white rounded-xs border-2 border-border-warm hover:border-sand transition-all shadow-sm flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3.5 border-b border-border-warm">
                  <Badge variant="gold">Proposed Monument • 80–100 Ft</Badge>
                  <span className="text-[11px] font-mono text-ink-sand">
                    Segregated Ledger: HANUMAN_MURTI
                  </span>
                </div>

                {/* Interactive 3D Canvas Perspective */}
                <div className="w-full">
                  <HanumanMurti3DExperience
                    variant="card"
                    className="max-h-[340px]"
                    showControls={true}
                  />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                    The Grand Hanuman Murti Project
                  </h3>
                  <p className="text-xs text-terracotta-dark font-semibold font-sans">
                    A Monumental Vision of Faith, Devotion and Community Participation
                  </p>
                  <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans pt-1">
                    A proposed 80 to 100-foot landmark celebrating Lord Hanuman as the supreme emblem of selfless service (Seva) and courage. Contributions are held in a strictly segregated project ledger with zero educational or general fund commingling.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border-warm/60 pt-4">
                <Link href="/campaigns/hanuman-murti">
                  <Button variant="outline" size="sm" className="group">
                    <span>Explore Project Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/donate?programme=HANUMAN_MURTI">
                  <Button variant="primary" size="sm" className="font-bold group">
                    <Heart className="w-3.5 h-3.5 mr-1 fill-current transition-transform group-hover:scale-110" />
                    <span>Support Project</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 2. Audited Impact Telemetry Bar (High-Contrast Institutional Dark Card) */}
        <div className="rounded-xs bg-forest-deep text-white border border-sand/25 p-8 sm:p-10 lg:p-12 space-y-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-sand/20 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-forest border border-sand/30 text-sand text-[10px] font-bold uppercase tracking-wider font-mono">
                <ShieldCheck className="w-3 h-3 text-sand" aria-hidden="true" />
                <span>Audited Institutional Footprint</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Documented Grassroots Evidence
              </h3>
              <p className="text-xs sm:text-sm text-cream/80 font-sans leading-relaxed">
                Operational figures are defined by formal accounting and attendance logs. MECT strictly reports recorded service entries and enrolments rather than exaggerated unique counts.
              </p>
            </div>

            <div className="shrink-0">
              <Link href="/impact">
                <Button
                  variant="dark-outline"
                  size="sm"
                  className="!border-sand/40 !text-sand hover:!bg-forest/60 text-xs font-semibold"
                >
                  <FileCheck2 className="w-3.5 h-3.5 mr-1.5 text-sand" aria-hidden="true" />
                  <span>Full Methodology &amp; Audit Logs</span>
                </Button>
              </Link>
            </div>
          </div>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.06}>
            {verifiedMetrics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={idx}>
                  <div className="p-5 bg-forest/60 border border-sand/20 rounded-xs space-y-3 flex flex-col justify-between h-full">
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-xs bg-forest-deep text-sand flex items-center justify-center border border-sand/20">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        <CountUpStat value={item.value} />
                        {item.suffix && <span className="text-base text-sand ml-1">{item.suffix}</span>}
                      </div>
                      <div className="text-xs font-semibold text-sand-light font-sans">
                        {item.label}
                      </div>
                    </div>
                    <div className="border-t border-sand/15 pt-2 text-[10.5px] text-cream/70 font-sans leading-tight">
                      {item.subtext}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </Container>
    </section>
  );
}
