"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import {
  Compass,
  FileCheck2,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function CompactHowMectWorks() {
  const steps = [
    {
      number: "01",
      title: "Understand Community Needs",
      description:
        "Field observations and direct community dialogue across Balangir identify scholastic retention gaps, women's livelihood barriers, and seasonal drinking water distress.",
      icon: Compass,
    },
    {
      number: "02",
      title: "Plan Accountable Initiatives",
      description:
        "Initiatives are formulated strictly under Trust Deed charitable objects. The honorary Board of Trustees enforces segregated ledgers and zero intermediary commissions.",
      icon: FileCheck2,
    },
    {
      number: "03",
      title: "Deliver Through Direct Operations",
      description:
        "Programmes are conducted on-ground with trusted local facilitators and direct electronic disbursals to verified institutional vendors and college bursars.",
      icon: Users,
    },
    {
      number: "04",
      title: "Monitor & Document Outcomes",
      description:
        "Daily physical attendance registers, photographic field archives, and annual statutory audit reports (Form 10B) are maintained and published openly.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="how-mect-works"
      aria-labelledby="how-works-heading"
      className="py-16 sm:py-20 md:py-24 bg-sand-light/50 border-b border-border-warm scroll-mt-16"
    >
      <Container size="default" className="space-y-12">
        {/* Section Header */}
        <Reveal direction="up" className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-forest/10 text-forest text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Operational Architecture</span>
          </div>
          <h2
            id="how-works-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight"
          >
            How MECT Works
          </h2>
          <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
            A disciplined four-step operating approach connecting grassroots community needs with responsible trustee governance and transparent field execution.
          </p>
        </Reveal>

        {/* 4 Steps Sequence Grid */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.06}>
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={idx}>
                <div className="p-6 bg-white border border-border-warm rounded-xs shadow-xs space-y-3.5 flex flex-col justify-between h-full relative">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-terracotta-dark bg-sand-light px-2.5 py-1 rounded-2xs border border-border-warm">
                        Step {item.number}
                      </span>
                      <Icon className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-forest">
                      {item.title}
                    </h3>

                    <p className="text-xs text-ink-sand leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* Supporting Link */}
        <div className="text-center pt-2">
          <Link
            href="/governance"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-dark hover:text-forest transition-colors font-sans"
          >
            <ShieldCheck className="w-4 h-4 text-terracotta" aria-hidden="true" />
            <span>Read our complete Governance Charter &amp; Trust Code</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
