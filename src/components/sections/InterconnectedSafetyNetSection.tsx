"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import {
  Droplets,
  Utensils,
  Scissors,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  Link2,
} from "lucide-react";

interface Pillar {
  id: string;
  number: string;
  title: string;
  category: string;
  icon: React.ElementType;
  primaryAction: string;
  problem: string;
  intervention: string;
  systemicImpact: string;
  evidence: string;
  linkHref: string;
}

export function InterconnectedSafetyNetSection() {
  const pillars: Pillar[] = [
    {
      id: "water",
      number: "01",
      title: "Safe Drinking Water",
      category: "Health & Vitality Foundation",
      icon: Droplets,
      primaryAction: "Jal Seva Purified Water Kiosks",
      problem:
        "Peak summer temperatures in Balangir frequently exceed 45°C. Water scarcity and contamination cause acute gastrointestinal disease, forcing parents into medical debt and pulling older children out of school to manage water haulage.",
      intervention:
        "Deployment of continuous Jal Seva purified drinking water kiosks and mobile hydration points at high-density public transit junctions, community health centers, and village clusters.",
      systemicImpact:
        "Dramatically curbs waterborne morbidity during heatwaves, prevents dehydration hospitalizations, and protects basic family daily attendance.",
      evidence: "10,000+ documented service instances logged across summer relief cycles.",
      linkHref: "/programmes#water",
    },
    {
      id: "nutrition",
      number: "02",
      title: "Food Security & Relief",
      category: "Nutritional Shield",
      icon: Utensils,
      primaryAction: "Jan Ahar Subsidized Nutrition",
      problem:
        "Impoverished families accompanying critical patients at Balangir District Hospital frequently skip meals for days to save scarce cash for pharmacy purchases.",
      intervention:
        "Jan Ahar hot cooked meal distribution providing dignified, hygienic, nutritious food to attendants, destitute elders, and stranded migrant workers.",
      systemicImpact:
        "Ensures patient caretakers retain strength to assist recovery and prevents emergency food expenditures from depleting agricultural savings.",
      evidence: "Documented seasonal relief drives and hospital corridor feeding records.",
      linkHref: "/programmes#hunger-relief",
    },
    {
      id: "livelihoods",
      number: "03",
      title: "Women's Vocational Livelihoods",
      category: "Household Economic Anchor",
      icon: Scissors,
      primaryAction: "Certified Tailoring & Craft Cohorts",
      problem:
        "Agrarian distress in Western Odisha leaves rural women with minimal independent earning avenues, making families entirely vulnerable to single-earner agricultural crop failures.",
      intervention:
        "Multi-month professional tailoring, pattern making, and machine maintenance cohorts. Trainees receive formal certification and tooling pathways for home-based micro-enterprises.",
      systemicImpact:
        "When rural mothers earn independent income, over 90% is directly reinvested in household nutrition and daughters' schooling, preventing child marriages.",
      evidence: "120+ cumulative course enrolments across multi-cohort training cycles.",
      linkHref: "/programmes#women-empowerment",
    },
    {
      id: "education",
      number: "04",
      title: "Remedial & Higher Education",
      category: "Generational Mobility",
      icon: GraduationCap,
      primaryAction: "Study Hubs & College Fee Grants",
      problem:
        "First-generation rural students face high failure rates in Class 10 and 12 Board exams due to lack of after-school academic support and inability to pay college admission fees.",
      intervention:
        "Village-level after-school remedial coaching hubs, individual academic doubt-clearing, and direct institution-remitted higher education tuition grants.",
      systemicImpact:
        "Converts first-generation learners into certified degree holders and career professionals, permanently breaking generational cycles of rural poverty.",
      evidence: "350+ recorded student participation entries; up to 200 college scholarship target.",
      linkHref: "/programmes#education",
    },
    {
      id: "welfare",
      number: "05",
      title: "Community Welfare & Rights",
      category: "Emergency & Civic Protection",
      icon: HeartHandshake,
      primaryAction: "Civic Relief & Legal Literacy",
      problem:
        "Severe winter cold waves, flash flooding, and lack of awareness regarding statutory government entitlements force families into predatory loans from unregulated moneylenders.",
      intervention:
        "Distribution of thermal blankets, emergency disaster supplies, and grassroots legal literacy camps educating villagers on fundamental rights and welfare schemes.",
      systemicImpact:
        "Provides immediate crisis cushioning so families do not forfeit land, cattle, or agricultural tools during unexpected seasonal shocks.",
      evidence: "Regular outreach sessions documented with local administration and legal aid forums.",
      linkHref: "/programmes#community-welfare",
    },
  ];

  const [activeTab, setActiveTab] = useState<string>("education");
  const currentPillar = pillars.find((p) => p.id === activeTab) || pillars[3];

  return (
    <section
      id="work-areas"
      aria-labelledby="safety-net-heading"
      className="py-16 sm:py-20 md:py-24 bg-sand-light/35 border-b border-border-warm scroll-mt-16 relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-14">
        {/* Editorial Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-terracotta-dark font-sans shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>Socio-Economic Architecture</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="safety-net-heading"
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight [text-wrap:balance]"
            >
              The Interconnected Safety Net
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-sm sm:text-base text-ink leading-relaxed font-sans">
              In rural Western Odisha, poverty is rarely an isolated problem. Water contamination leads to sickness; sickness drains household wages; income instability pulls daughters from school; and a single seasonal emergency forces predatory borrowing. MECT operates five mutually reinforcing programmes to break this cycle at every vulnerable point.
            </p>
          </Reveal>
        </div>

        {/* Visual Architecture: Interactive Systemic Navigator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Architectural Flow Index (Col 1-5) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-mono font-bold text-ink-sand px-1 flex items-center justify-between">
              <span>Programmatic Pillars</span>
              <span>Click to inspect logic</span>
            </div>

            <div className="space-y-2">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                const isActive = pillar.id === activeTab;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActiveTab(pillar.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xs border transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-white border-terracotta shadow-sm -translate-y-0.5"
                        : "bg-white/60 border-border-warm hover:bg-white hover:border-sand"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xs flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-forest text-sand"
                            : "bg-sand-light text-forest"
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-terracotta">
                            {pillar.number}
                          </span>
                          <span
                            className={`font-serif text-sm sm:text-base font-bold truncate ${
                              isActive ? "text-forest" : "text-ink"
                            }`}
                          >
                            {pillar.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-sand truncate font-sans">
                          {pillar.category}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`inline-block w-2 h-2 rounded-full transition-transform ${
                          isActive ? "bg-terracotta scale-125" : "bg-border-warm"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interlocking Principle Card */}
            <div className="p-4 rounded-xs bg-forest text-cream border border-sand/30 space-y-2 mt-4 text-xs font-sans">
              <div className="flex items-center gap-2 text-sand font-bold text-[11px] uppercase tracking-wider">
                <Link2 className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
                <span>The Multiplier Principle</span>
              </div>
              <p className="text-cream/90 text-[11.5px] leading-relaxed">
                No single intervention is sufficient on its own. By ensuring clean water and emergency food, we keep children healthy. By training mothers in tailoring, we stabilize household cash flow so daughters stay in school through graduation.
              </p>
            </div>
          </div>

          {/* Right Column: Deep Architectural Inspection Panel (Col 6-12) */}
          <div className="lg:col-span-7 bg-white rounded-xs border border-border-warm p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header of Active Pillar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border-warm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xs bg-forest text-sand flex items-center justify-center shrink-0">
                  <currentPillar.icon className="w-5 h-5 text-sand" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-terracotta">
                      PILLAR {currentPillar.number}
                    </span>
                    <Badge variant="gold" size="sm">
                      {currentPillar.category}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mt-0.5">
                    {currentPillar.title}
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono tracking-wider text-ink-sand block">
                  Core Initiative
                </span>
                <span className="text-xs font-bold text-terracotta-dark font-sans">
                  {currentPillar.primaryAction}
                </span>
              </div>
            </div>

            {/* 3-Part Systemic Breakdown Grid */}
            <div className="space-y-4 text-xs sm:text-sm font-sans">
              {/* Part 1: The Grassroots Vulnerability */}
              <div className="p-4 rounded-xs bg-sand-light/50 border-l-3 border-l-terracotta space-y-1">
                <h4 className="font-bold text-terracotta-dark uppercase tracking-wider text-[11px] font-mono">
                  The Root Problem in Western Odisha:
                </h4>
                <p className="text-ink leading-relaxed">
                  {currentPillar.problem}
                </p>
              </div>

              {/* Part 2: MECT's Direct Grassroots Intervention */}
              <div className="p-4 rounded-xs bg-cream border-l-3 border-l-forest space-y-1">
                <h4 className="font-bold text-forest uppercase tracking-wider text-[11px] font-mono">
                  MECT Execution &amp; Approach:
                </h4>
                <p className="text-ink leading-relaxed">
                  {currentPillar.intervention}
                </p>
              </div>

              {/* Part 3: Systemic Impact Across the Safety Net */}
              <div className="p-4 rounded-xs bg-sand-light/30 border-l-3 border-l-gold-dark space-y-1">
                <h4 className="font-bold text-forest-deep uppercase tracking-wider text-[11px] font-mono">
                  Multi-Dimensional Impact:
                </h4>
                <p className="text-ink-sand leading-relaxed">
                  {currentPillar.systemicImpact}
                </p>
              </div>
            </div>

            {/* Verifiable Evidence & Action Bar */}
            <div className="pt-4 border-t border-border-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-forest">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
                <span className="font-semibold">{currentPillar.evidence}</span>
              </div>

              <Link href={currentPillar.linkHref}>
                <Button variant="primary" size="sm" className="font-bold group">
                  <span>View Full Programme Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Programme Navigation Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-ink-sand border-t border-border-warm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
            <span>All 5 programmes operate in compliance with registered Trust Deed objectives.</span>
          </div>
          <Link
            href="/programmes"
            className="text-terracotta-dark font-semibold hover:text-forest underline inline-flex items-center gap-1"
          >
            <span>Explore Comprehensive Programmes Register</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
