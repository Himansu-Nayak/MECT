"use client";

import React, { useState } from "react";
import Link from "next/link";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal, MOTION_EASING, MOTION_DURATION } from "@/components/ui/MotionPrimitives";
import {
  Droplets,
  Utensils,
  Scissors,
  GraduationCap,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Link2,
  ArrowDownRight,
  Network,
  Activity,
} from "lucide-react";

interface Pillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ElementType;
  primaryAction: string;
  problem: string;
  intervention: string;
  systemicImpact: string;
  evidence: string;
  upstreamReinforcement: string;
  downstreamMultiplier: string;
  linkHref: string;
}

/**
 * MECT Phase 27 — Section 03 & 04: Living Spatial Interconnected Safety Net Navigator
 *
 * Upgraded with:
 * - Shared layout indicator (`layoutId`) across active pillar tabs
 * - Smooth content cross-fade transitions on active pillar change
 * - Animated SVG causal flow vectors illustrating ecosystem reinforcement
 * - Full touch-slider and keyboard navigation (`ArrowLeft` / `ArrowRight`)
 */
export function InterconnectedSafetyNetSection() {
  const shouldReduceMotion = useReducedMotion();

  const pillars: Pillar[] = [
    {
      id: "water",
      number: "01",
      title: "Clean Drinking Water",
      subtitle: "Jal Seva Public Hydration Kiosks",
      category: "Vitality Foundation",
      icon: Droplets,
      primaryAction: "Jal Seva Purified Water Kiosks",
      problem:
        "Summer temperatures in Balangir regularly cross 45°C. Severe water scarcity and contaminated ground sources trigger acute dehydration and diarrheal illnesses, forcing families into medical debt and pulling older children out of school to haul water.",
      intervention:
        "Deployment of continuous Jal Seva purified drinking water kiosks and mobile hydration points at high-density public transit junctions, community health centres, and village clusters.",
      systemicImpact:
        "Dramatically curtails heatstroke mortality and waterborne infections, preserving household health and preventing emergency medical expenditures.",
      evidence: "10,000+ documented service instances logged across summer relief cycles.",
      upstreamReinforcement: "Community water security protects children's daily classroom attendance.",
      downstreamMultiplier: "Prevents acute gastrointestinal illness, saving families from predatory emergency debt.",
      linkHref: "/programmes#water",
    },
    {
      id: "nutrition",
      number: "02",
      title: "Food Security & Hospital Relief",
      subtitle: "Jan Ahar Subsidized Nutrition",
      category: "Nutritional Shield",
      icon: Utensils,
      primaryAction: "Jan Ahar Subsidized Nutrition",
      problem:
        "Impoverished families accompanying critical patients at Balangir District Hospital frequently skip meals for consecutive days to save scarce rupees for essential prescription medications.",
      intervention:
        "Jan Ahar hot cooked meal distribution providing hygienic, nutritious, dignified meals to hospital attendants, destitute elders, and stranded rural migrants.",
      systemicImpact:
        "Ensures patient caregivers retain physical stamina to support patient recovery without exhausting agricultural seeds or livestock capital.",
      evidence: "Documented seasonal relief drives and hospital corridor feeding records.",
      upstreamReinforcement: "Clean water kiosks supply hygienic water required for hot meal preparation.",
      downstreamMultiplier: "Protects family nutrition during acute crises, preventing distress asset liquidation.",
      linkHref: "/programmes#food-relief",
    },
    {
      id: "livelihoods",
      number: "03",
      title: "Women's Vocational Livelihoods",
      subtitle: "Certified Tailoring & Craft Cohorts",
      category: "Economic Resilience",
      icon: Scissors,
      primaryAction: "Certified Tailoring & Craft Cohorts",
      problem:
        "Agrarian distress in Western Odisha leaves rural women with minimal independent earning opportunities, making households completely vulnerable to single-earner agricultural crop failures.",
      intervention:
        "Multi-month professional tailoring, pattern making, and sewing machine operation cohorts. Trainees receive formal certification and tooling pathways for home-based micro-enterprises.",
      systemicImpact:
        "When rural mothers earn independent income, over 90% is directly reinvested in household nutrition, healthcare, and daughters' education, stopping early school dropouts.",
      evidence: "120+ cumulative course enrolments across multi-cohort training cycles.",
      upstreamReinforcement: "Healthy mothers, protected by food and water security, can complete rigorous training.",
      downstreamMultiplier: "Mother's independent income directly finances secondary school books and college application fees.",
      linkHref: "/programmes#women-empowerment",
    },
    {
      id: "education",
      number: "04",
      title: "Remedial & Higher Education",
      subtitle: "Study Hubs & College Tuition Grants",
      category: "Generational Mobility",
      icon: GraduationCap,
      primaryAction: "Study Hubs & College Fee Grants",
      problem:
        "First-generation rural students face high dropout rates before Class 10 and 12 Board exams due to lack of after-school academic support and inability to pay college admission fees.",
      intervention:
        "Village-level after-school remedial coaching hubs, individual doubt-clearing, and direct institution-remitted higher education tuition grants.",
      systemicImpact:
        "Converts first-generation rural learners into certified degree holders and career professionals, permanently breaking the cycle of hereditary daily-wage labor.",
      evidence: "350+ recorded student participation entries; up to 200 college scholarship target.",
      upstreamReinforcement: "Vocational earnings and household stability enable families to keep children in school.",
      downstreamMultiplier: "Educated youth secure formal jobs, lifting the entire extended family out of generational poverty.",
      linkHref: "/programmes#education",
    },
    {
      id: "welfare",
      number: "05",
      title: "Community Welfare & Social Upliftment",
      subtitle: "Emergency Aid & Legal Literacy",
      category: "Sovereign Shield",
      icon: HeartHandshake,
      primaryAction: "Legal Literacy & Distress Relief",
      problem:
        "Marginalized rural communities frequently lack awareness of statutory rights, government social protection schemes, or direct emergency assistance during unseasonal calamities.",
      intervention:
        "Community legal literacy camps, statutory welfare facilitation, winter blanket distribution, and rapid distress assistance during natural emergencies.",
      systemicImpact:
        "Bridges the institutional gap between remote villagers and their lawful entitlements, creating a durable civic floor beneath the entire community.",
      evidence: "Continuous community awareness drives and emergency relief logs across Balangir blocks.",
      upstreamReinforcement: "Educated youth act as community para-volunteers facilitating government applications.",
      downstreamMultiplier: "Strengthens entire village resilience against external shocks and distress migration.",
      linkHref: "/programmes#community-welfare",
    },
  ];

  const [activeId, setActiveId] = useState<string>("water");
  const activePillar = pillars.find((p) => p.id === activeId) || pillars[0];
  const ActiveIcon = activePillar.icon;

  return (
    <section
      id="work-areas"
      aria-labelledby="safety-net-heading"
      className="py-16 sm:py-20 md:py-24 bg-white border-b border-[#E7E0D5] relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-16 max-w-[1520px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-[#C4924A]/40 bg-[#C4924A]/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-ink shadow-xs">
              <Network className="w-3.5 h-3.5 text-terracotta shrink-0" aria-hidden="true" />
              <span>Section 03 &amp; 04 • The Interconnected Safety Net Model</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="safety-net-heading"
              className="font-serif text-[clamp(1.9rem,3.2vw,3rem)] font-bold text-ink tracking-tight leading-[1.14] [text-wrap:balance]"
            >
              Why Single-Issue Charity Fails: The Interconnected Architecture
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
              In rural Western Odisha, clean water, maternal livelihoods, food security, and education cannot be treated in silos. When heatstroke or hunger strikes, education immediately stops. Explore how MECT&apos;s five programmes reinforce each other to build an unbreakable safety net.
            </p>
          </Reveal>
        </div>

        {/* Spatial Interactive Node Ribbon (Touch & Keyboard Accessible with Layout Animation) */}
        <div className="border border-[#E7E0D5] rounded-[2px] bg-[#FAF7F2] p-2 sm:p-3 shadow-xs">
          <div
            role="tablist"
            aria-label="Interconnected Intervention Areas"
            className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
          >
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const isActive = pillar.id === activeId;
              return (
                <button
                  key={pillar.id}
                  role="tab"
                  id={`tab-${pillar.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${pillar.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(pillar.id)}
                  onKeyDown={(e) => {
                    const currentIndex = pillars.findIndex((p) => p.id === activeId);
                    if (e.key === "ArrowRight") {
                      const next = pillars[(currentIndex + 1) % pillars.length];
                      setActiveId(next.id);
                      document.getElementById(`tab-${next.id}`)?.focus();
                    } else if (e.key === "ArrowLeft") {
                      const prev = pillars[(currentIndex - 1 + pillars.length) % pillars.length];
                      setActiveId(prev.id);
                      document.getElementById(`tab-${prev.id}`)?.focus();
                    }
                  }}
                  className={`relative flex-1 min-w-[200px] sm:min-w-0 p-3 sm:p-4 rounded-[2px] border text-left transition-all duration-200 flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-terracotta ${
                    isActive
                      ? "bg-white border-terracotta text-ink shadow-sm"
                      : "bg-transparent border-transparent hover:bg-white/60 text-ink-secondary"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-terracotta text-white"
                        : "bg-white border border-[#E7E0D5] text-ink-secondary"
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-terracotta font-semibold">
                        Pillar {pillar.number}
                      </span>
                    </div>
                    <div className="font-serif text-xs sm:text-sm font-bold text-ink truncate">
                      {pillar.title}
                    </div>
                  </div>

                  {isActive && !shouldReduceMotion && (
                    <m.span
                      layoutId="active-pillar-border"
                      className="absolute inset-0 rounded-[2px] border-2 border-terracotta pointer-events-none"
                      transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASING.institutional }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spatial Detailed Dossier Panel with Cross-Fade Transitions */}
        <AnimatePresence mode="wait">
          <m.div
            key={activePillar.id}
            id={`panel-${activePillar.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${activePillar.id}`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: MOTION_DURATION.fast, ease: MOTION_EASING.institutional }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
          >
            {/* Left Column: Problem, Intervention & Evidence (Col 1-7) */}
            <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 rounded-[2px] bg-[#FAF7F2] border border-[#E7E0D5] space-y-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-6">
                {/* Header Title with Active Icon */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-terracotta text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ActiveIcon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs uppercase tracking-wider text-terracotta font-bold">
                        Pillar {activePillar.number} • {activePillar.category}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-white border border-[#E7E0D5] text-ink-muted">
                        {activePillar.primaryAction}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                      {activePillar.title}
                    </h3>
                  </div>
                </div>

                {/* The Systemic Problem */}
                <div className="space-y-2 pt-2 border-t border-[#E7E0D5]">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-bold">
                    The Grassroots Fracture in Western Odisha:
                  </h4>
                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                    {activePillar.problem}
                  </p>
                </div>

                {/* MECT's Direct Action */}
                <div className="space-y-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-terracotta font-bold">
                    MECT Direct Intervention:
                  </h4>
                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                    {activePillar.intervention}
                  </p>
                </div>

                {/* Documented Telemetry Evidence */}
                <div className="p-4 rounded-[2px] bg-white border border-[#E7E0D5] text-xs text-ink space-y-1 font-sans">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-terracotta font-bold">
                    <CheckCircle2 className="w-4 h-4 text-terracotta" aria-hidden="true" />
                    <span>Documented Field Evidence:</span>
                  </div>
                  <p className="text-ink-secondary pl-6 text-xs sm:text-sm">
                    {activePillar.evidence}
                  </p>
                </div>
              </div>

              {/* Direct Action Link */}
              <div className="pt-4 border-t border-[#E7E0D5]">
                <Link href={activePillar.linkHref}>
                  <Button variant="primary" size="md" className="font-bold group bg-terracotta hover:bg-terracotta-dark text-white">
                    <span>Explore {activePillar.title} Details</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Causal Loop & Compounded Multiplier (Col 8-12) */}
            <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 rounded-[2px] bg-[#0F1714] text-white space-y-6 flex flex-col justify-between shadow-md">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-xs border border-[#C4924A]/40 bg-[#16221D] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-[#E5C499]">
                  <Link2 className="w-3.5 h-3.5 text-[#C4924A]" aria-hidden="true" />
                  <span>Causal Multiplier Architecture</span>
                </div>

                <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  How Pillar {activePillar.number} Protects the Entire Ecosystem
                </h4>

                <div className="space-y-4 pt-2">
                  {/* Upstream Reinforcement */}
                  <div className="p-4 rounded-[2px] bg-[#16221D] border border-white/10 space-y-2">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-[#C4924A] font-semibold flex items-center gap-1.5">
                      <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Upstream Reinforcement</span>
                    </div>
                    <p className="text-xs text-cream/90 font-sans leading-relaxed">
                      {activePillar.upstreamReinforcement}
                    </p>
                  </div>

                  {/* Downstream Multiplier with Living Pulse Indicator */}
                  <div className="p-4 rounded-[2px] bg-[#16221D] border border-white/10 space-y-2">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-terracotta font-semibold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 animate-pulse text-terracotta" aria-hidden="true" />
                      <span>Downstream Generational Dividend</span>
                    </div>
                    <p className="text-xs text-cream/90 font-sans leading-relaxed">
                      {activePillar.downstreamMultiplier}
                    </p>
                  </div>
                </div>

                {/* Fiduciary Guarantee */}
                <div className="pt-2 text-xs text-cream/70 font-sans leading-relaxed">
                  <span className="text-[#E5C499] font-mono font-bold uppercase text-[10px] block">
                    Accounting Assurance:
                  </span>
                  Funds designated for this intervention are credited exclusively to verified programme expense registers under audited scrutiny.
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs font-mono text-[#E5C499]">
                <span>MECT Interconnected Framework</span>
                <span>Balangir Deed 40311302194</span>
              </div>
            </div>
          </m.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
