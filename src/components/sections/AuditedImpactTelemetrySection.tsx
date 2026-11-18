"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, CountUpStat, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import {
  GraduationCap,
  Scissors,
  Droplets,
  Landmark,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Calendar,
  Info,
  Scale,
} from "lucide-react";

/**
 * MECT Phase 26 — Section 05: Archival Telemetry Ledger
 *
 * Renders large editorial serif numerals with strict source qualifications,
 * physical register aesthetics, and zero misleading generalizations.
 */
export function AuditedImpactTelemetrySection() {
  const verifiedMetrics = [
    {
      value: "350+",
      label: "Student Participation Entries",
      metricType: "Activity Register Entries",
      definition:
        "Documented attendance entries across village remedial coaching hubs in Balangir. Represents recurring student study-session entries, not 350 unique students.",
      reportingPeriod: "FY 2023–24 Activity Register",
      scalePercentage: 78,
      icon: GraduationCap,
    },
    {
      value: "120+",
      label: "Vocational Course Enrolments",
      metricType: "Course Cohort Registrations",
      definition:
        "Cumulative course registrations across certified tailoring, pattern-making, and machine operation cohorts for rural women in Western Odisha.",
      reportingPeriod: "FY 2021–23 Multi-Cohort Cycles",
      scalePercentage: 65,
      icon: Scissors,
    },
    {
      value: "10,000+",
      label: "Water & Relief Service Instances",
      metricType: "Service Relief Instances",
      definition:
        "Documented cups of purified drinking water and hospital corridor hot meals served during peak summer heatwaves (45°C+). Represents servings delivered, not unique citizens.",
      reportingPeriod: "Multi-Year Field Service Log",
      scalePercentage: 92,
      icon: Droplets,
    },
    {
      value: "13+",
      suffix: "Years",
      label: "Continuous Statutory Tenure",
      metricType: "Unbroken Public Trust Record",
      definition:
        "Continuous registered public charitable trust operations since execution of public Trust Deed on 27 July 2013 (Registered Doc No. 40311302194 at Balangir).",
      reportingPeriod: "2013 – Present Continuous Record",
      scalePercentage: 100,
      icon: Landmark,
    },
  ];

  return (
    <section
      id="evidence-of-impact"
      aria-labelledby="impact-evidence-heading"
      className="py-16 sm:py-20 md:py-24 bg-[#FAF7F2] border-b border-[#E7E0D5] scroll-mt-16 relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-16 max-w-[1520px]">
        {/* Editorial Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-forest/30 bg-[#16221D]/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-ink shadow-xs">
              <FileCheck2 className="w-3.5 h-3.5 text-terracotta shrink-0" aria-hidden="true" />
              <span>Section 05 • Audited Telemetry &amp; Field Registers</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="impact-evidence-heading"
              className="font-serif text-[clamp(1.9rem,3.2vw,3rem)] font-bold text-ink tracking-tight leading-[1.14] [text-wrap:balance]"
            >
              Evidence of Impact: Factual Field Records with Rigorous Qualifications
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
              At MECT, institutional trust is built upon verifiable data. We deliberately qualify every metric — distinguishing cumulative service instances from unique individuals, and historical activity registers from future intake targets.
            </p>
          </Reveal>
        </div>

        {/* 4 Archival Telemetry Ledger Columns */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.07}>
          {verifiedMetrics.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={idx}>
                <div className="p-6 sm:p-7 bg-white rounded-[2px] border border-[#E7E0D5] hover:border-terracotta/50 transition-all flex flex-col justify-between space-y-6 h-full shadow-xs group">
                  <div className="space-y-4">
                    {/* Header Row: Icon + Reporting Period */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E7E0D5]/70">
                      <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E7E0D5] flex items-center justify-center text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                        {stat.metricType}
                      </span>
                    </div>

                    {/* Massive Editorial Serif Numeral */}
                    <div className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-ink tracking-tight leading-none">
                      <CountUpStat value={stat.value} />
                      {stat.suffix && (
                        <span className="text-xl sm:text-2xl font-serif text-terracotta ml-1.5 font-normal">
                          {stat.suffix}
                        </span>
                      )}
                    </div>

                    {/* Metric Label */}
                    <h3 className="font-serif text-base sm:text-lg font-bold text-ink leading-snug">
                      {stat.label}
                    </h3>

                    {/* Subtle Relative Activity Scale Bar */}
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E7E0D5]/50">
                        <div
                          className="h-full bg-terracotta transition-all duration-1000"
                          style={{ width: `${stat.scalePercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Factual Source Qualification */}
                    <p className="text-xs text-ink-secondary leading-relaxed font-sans pt-1">
                      {stat.definition}
                    </p>
                  </div>

                  {/* Ledger Footer Tag */}
                  <div className="pt-3 border-t border-[#E7E0D5]/70 flex items-center gap-1.5 text-[11px] font-mono text-terracotta font-semibold">
                    <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{stat.reportingPeriod}</span>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* Audit & Legal Disclosure Ribbon */}
        <Reveal direction="up" delay={0.15}>
          <div className="p-6 rounded-[2px] bg-white border border-[#E7E0D5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-sand/30 flex items-center justify-center shrink-0 text-ink mt-0.5">
                <Scale className="w-4 h-4 text-terracotta" aria-hidden="true" />
              </div>
              <div className="space-y-1 text-xs text-ink-secondary font-sans leading-relaxed">
                <span className="font-bold text-ink uppercase tracking-wider text-[11px] font-mono block">
                  Reporting Protocol &amp; Physical Verification
                </span>
                <p>
                  All activity logs and beneficiary rolls are verified under the supervision of the Board of Trustees in accordance with Trust Deed Clause XVI. Physical ledgers are open for inspection by statutory authorities and verified donors at our registered office in Balangir.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/impact">
                <Button variant="primary" size="sm" className="font-bold bg-terracotta hover:bg-terracotta-dark text-white">
                  <span>View Full Impact Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" size="sm" className="border-[#E7E0D5] text-ink hover:bg-[#FAF7F2]">
                  <span>Annual Reports &amp; Audits</span>
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
