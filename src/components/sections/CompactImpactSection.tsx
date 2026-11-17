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
} from "lucide-react";

export function CompactImpactSection() {
  const metrics = [
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
      id="impact-at-a-glance"
      aria-labelledby="impact-heading"
      className="py-16 sm:py-20 md:py-24 bg-forest-deep text-white border-b border-sand/20 relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-sand/20 pb-8">
          <Reveal direction="up" className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-forest border border-sand/30 text-sand text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Evidence-Backed Metrics</span>
            </div>
            <h2
              id="impact-heading"
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight"
            >
              Impact at a Glance
            </h2>
            <p className="text-xs sm:text-sm text-cream/80 leading-relaxed font-sans">
              Operational figures are defined by formal accounting and attendance logs. MECT strictly reports recorded service entries and enrolments rather than exaggerated unique counts.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.1} className="shrink-0">
            <Link href="/impact">
              <Button
                variant="dark-outline"
                size="sm"
                className="!border-sand/40 !text-sand hover:!bg-forest/60"
              >
                <span>Full Methodology &amp; Reports</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
              </Button>
            </Link>
          </Reveal>
        </div>

        {/* 4 Metrics Grid */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.07}>
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={idx}>
                <div className="p-6 bg-forest/70 border border-sand/25 rounded-xs space-y-3.5 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xs bg-sand/15 text-sand flex items-center justify-center">
                        <Icon className="w-4 h-4 text-sand" aria-hidden="true" />
                      </div>
                      <span className="text-[10px] font-mono text-sand/80 uppercase tracking-wider">
                        {item.period}
                      </span>
                    </div>

                    <div>
                      <div className="font-serif text-3xl sm:text-4xl font-bold text-sand tabular-nums">
                        <CountUpStat value={item.value} />
                        {item.suffix && <span className="text-xl ml-1 text-white font-normal">{item.suffix}</span>}
                      </div>
                      <h3 className="font-sans text-xs uppercase font-bold tracking-wider text-white mt-1">
                        {item.label}
                      </h3>
                    </div>

                    <p className="text-xs text-cream/75 leading-relaxed font-sans">
                      {item.subtext}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
