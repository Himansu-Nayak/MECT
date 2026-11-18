"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
} from "lucide-react";

export function AuditedImpactTelemetrySection() {
  const verifiedMetrics = [
    {
      value: "350+",
      label: "Student Participation Entries",
      metricType: "Activity Entries (FY 2023–24)",
      definition:
        "Documented student attendance records across village-level remedial study hubs in rural Balangir. Reflects recurring academic coaching sessions, not 350 unique students.",
      reportingPeriod: "FY 2023–24 Annual Register",
      icon: GraduationCap,
    },
    {
      value: "120+",
      label: "Vocational Course Enrolments",
      metricType: "Course Enrolments (FY 2021–23)",
      definition:
        "Cumulative enrolments across multi-month certified tailoring, pattern-making, and sewing machine operation cohorts for rural women.",
      reportingPeriod: "FY 2021–23 Multi-Cohort Cycles",
      icon: Scissors,
    },
    {
      value: "10,000+",
      label: "Water & Relief Service Instances",
      metricType: "Service Instances (Cumulative)",
      definition:
        "Documented service instances delivered via seasonal Jal Seva purified drinking water kiosks and hospital corridor nutrition drives. Represents cups/servings delivered, not unique citizens.",
      reportingPeriod: "Multi-Year Field Service Log",
      icon: Droplets,
    },
    {
      value: "13+",
      suffix: "Years",
      label: "Statutory Trust Tenure",
      metricType: "Continuous Legal Tenure",
      definition:
        "Continuous registered charitable trust operations since execution of public Trust Deed on 27 July 2013 (Balangir Document No. 40311302194).",
      reportingPeriod: "2013 – Present Continuous Record",
      icon: Landmark,
    },
  ];

  return (
    <section
      id="evidence-of-impact"
      aria-labelledby="impact-evidence-heading"
      className="py-16 sm:py-20 md:py-24 bg-cream border-b border-border-warm scroll-mt-16 relative overflow-hidden"
    >
      <Container size="default" className="space-y-14 sm:space-y-16">
        {/* Editorial Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-forest/30 bg-forest/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest font-sans shadow-2xs">
              <FileCheck2 className="w-3.5 h-3.5 text-forest shrink-0" aria-hidden="true" />
              <span>Section 05 • Audited Telemetry</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="impact-evidence-heading"
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight [text-wrap:balance]"
            >
              Evidence of Impact: Verifiable Field Records
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-sm sm:text-base text-ink leading-relaxed font-sans">
              At MECT, institutional credibility is built on transparent accounting and documented operational activity. We deliberately distinguish cumulative service instances from unique beneficiaries, and historical activity registers from prospective targets.
            </p>
          </Reveal>
        </div>

        {/* 4 Audited Metrics Grid */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.07}>
          {verifiedMetrics.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={idx}>
                <div className="p-6 sm:p-7 bg-white rounded-xs border border-border-warm shadow-xs hover:border-sand transition-all flex flex-col justify-between space-y-5 h-full group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xs bg-forest text-sand flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
                        {stat.metricType}
                      </Badge>
                    </div>

                    <div>
                      <div className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
                        <CountUpStat value={stat.value} />
                        {stat.suffix ? ` ${stat.suffix}` : ""}
                      </div>
                      <h3 className="font-serif font-bold text-sm text-forest mt-1">
                        {stat.label}
                      </h3>
                    </div>

                    <p className="text-xs text-ink-sand leading-relaxed font-sans">
                      {stat.definition}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border-warm flex items-center gap-1.5 text-[11px] font-mono text-forest">
                    <Calendar className="w-3.5 h-3.5 text-terracotta shrink-0" aria-hidden="true" />
                    <span>{stat.reportingPeriod}</span>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* Telemetry Integrity Guidance Box */}
        <Reveal direction="up" delay={0.15}>
          <div className="p-5 sm:p-6 rounded-xs bg-sand-light/50 border border-border-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-xs font-sans">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xs bg-forest text-sand flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-forest uppercase tracking-wider text-[11px] font-mono">
                  Methodology &amp; Truth-in-Reporting Standard
                </p>
                <p className="text-ink-sand leading-relaxed max-w-3xl">
                  Activity figures above are compiled from daily study hub registers, vocational batch attendance rolls, and seasonal Jal Seva distribution logs. Prospective initiatives (such as the proposed 200-student higher education target) are strictly categorized as planned targets and distinguished from confirmed historical disbursals.
                </p>
              </div>
            </div>

            <Link href="/impact" className="shrink-0">
              <Button variant="primary" size="sm" className="font-bold group">
                <span>View Full Impact Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
