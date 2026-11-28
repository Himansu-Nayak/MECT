"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { FreeEducationDotGrid } from "@/components/motion/FreeEducationDotGrid";
import { HOMEPAGE_CONTENT } from "@/lib/homepage-content";
import {
  GraduationCap,
  BookOpen,
  Compass,
  Users,
  Heart,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Award,
  Sparkles,
  FileCheck,
  Scale,
  Landmark,
  Receipt,
  Search,
  Info,
  MapPin,
  Building2,
} from "lucide-react";

export interface ScholarshipSchemeItem {
  id: string;
  name: string;
  tagline: string;
  statusTag: string;
  statusVariant: "proposed" | "pilot" | "active";
  target: string;
  criteria: string;
  benefit: string;
  href: string;
  actionText: string;
  icon: React.ElementType;
}

export const SCHOLARSHIP_SCHEMES: ScholarshipSchemeItem[] = [
  {
    id: "shiksha-protsahan",
    name: "Mahaveer Shiksha Protsahan Yojana",
    tagline: "Proposed Need-cum-Merit Undergraduate Tuition Fee Grants",
    statusTag: "Proposed — Awaiting Formal Sanction",
    statusVariant: "proposed",
    target: "Underprivileged undergraduate scholars across Odisha (B.Sc, B.Com, B.A, Diploma)",
    criteria: "Indicative criteria: Minimum 60% aggregate in Class 10 and +2 Higher Secondary; verified family income < ₹2.5 Lakh/year.",
    benefit: "Proposed assistance: Direct-to-college tuition fee grant via RTGS + annual textbook grant.",
    href: "/scholarships",
    actionText: "Review Scheme Proposal",
    icon: GraduationCap,
  },
  {
    id: "pratibha-fellowship",
    name: "Pratibha Excellence Fellowship",
    tagline: "Proposed Entrance Test & Professional Certification Stipend",
    statusTag: "Proposed — Draft Scheme",
    statusVariant: "proposed",
    target: "Merit-ranked candidates preparing for national professional and graduate admissions",
    criteria: "Indicative criteria: Top quartile percentile in entrance tests or 75%+ in STEM; verified family income < ₹3.5 Lakh/year.",
    benefit: "Proposed subsidy: Entrance exam registration fee support + technical literature grant.",
    href: "/scholarships",
    actionText: "Review Fellowship Draft",
    icon: Award,
  },
  {
    id: "samarth-learning",
    name: "Project Samarth Community Study Hubs",
    tagline: "Proposed Reference Study Points & High-Speed Learning Desks",
    statusTag: "Pilot — Planning Phase",
    statusVariant: "pilot",
    target: "Rural and semi-urban scholars lacking quiet study spaces and exam texts",
    criteria: "Proposed criteria: Enrolled degree/diploma college scholars in pilot cluster districts (Khordha & Balangir).",
    benefit: "Supervised study desks, high-speed Wi-Fi, solar power, and curated reference text archives.",
    href: "/programmes",
    actionText: "Explore Hub Objectives",
    icon: BookOpen,
  },
  {
    id: "mentorship-circle",
    name: "Academic & Career Mentorship Circle",
    tagline: "1-to-1 Guidance from University Faculty & Industry Leaders",
    statusTag: "Active — Volunteer Mentorship",
    statusVariant: "active",
    target: "First-generation degree college students across Odisha",
    criteria: "Active participation: Open to enrolled grant recipients and university partner referrals.",
    benefit: "Structured monthly advisory sessions, academic roadmap guidance, and mock interviews.",
    href: "/volunteer",
    actionText: "Join Mentorship Circle",
    icon: Users,
  },
];

export const BACKEND_APPLICATION_STAGES = [
  {
    stageNumber: "01",
    statusKey: "SUBMITTED",
    title: "Application Intake",
    description:
      "Applicant dossier is logged in the system with qualifying marksheets, Tahsildar income certificate, and institutional admission details.",
    actionNote: "Dossier Logged",
    icon: FileCheck,
  },
  {
    stageNumber: "02",
    statusKey: "UNDER_SCRUTINY",
    title: "Document Scrutiny",
    description:
      "Administrative review of submitted academic records and income certificate against verification requirements.",
    actionNote: "Document Review",
    icon: Scale,
  },
  {
    stageNumber: "03",
    statusKey: "INSTITUTION_VERIFIED",
    title: "Institutional Verification",
    description:
      "Direct confirmation of student's active enrollment status and official institutional bank details with the college or school.",
    actionNote: "Institution Confirmed",
    icon: Building2,
  },
  {
    stageNumber: "04",
    statusKey: "COMMITTEE_APPROVED",
    title: "Committee Approval",
    description:
      "Evaluation and formal grant sanction approval by the authorized body in accordance with Trust Deed objectives.",
    actionNote: "Sanction Approved",
    icon: CheckCircle2,
  },
  {
    stageNumber: "05",
    statusKey: "DISBURSED",
    title: "Institutional Disbursal",
    description:
      "Electronic transfer of sanctioned tuition assistance directly to the verified institution's official bank account via RTGS/NEFT.",
    actionNote: "Electronic Transfer",
    icon: Receipt,
  },
];

export const APPLICATION_JOURNEY_STAGES = BACKEND_APPLICATION_STAGES;

export function FreeEducationSection() {
  const data = HOMEPAGE_CONTENT.freeEducation200;

  return (
    <section
      id="free-education-200"
      aria-labelledby="free-education-heading"
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-cream/50 border-b border-border-warm scroll-mt-24 relative overflow-hidden"
    >
      {/* Subtle institutional ambient backlight rings */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -top-40 right-10 w-[550px] h-[550px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(229, 196, 153, 0.35) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-20 -left-20 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(164, 94, 68, 0.22) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container size="default" className="relative z-10 space-y-14 sm:space-y-16">
        {/* =========================================================================
            1. SECTION HEADER (Editorial Eyebrow, Lora H2, Opportunity Statement)
            ========================================================================= */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-white/80 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-terracotta-dark font-sans shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>Institutional Education Commitment</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="free-education-heading"
              className="font-serif text-[clamp(1.85rem,4.4vw,2.75rem)] font-bold text-forest tracking-tight leading-[1.18] [text-wrap:balance]"
            >
              Free Education &amp; Higher Learning Scholarship Showcase
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-[15px] sm:text-base md:text-lg text-ink leading-relaxed font-sans">
              Removing financial barriers across the educational continuum—from after-school
              remedial instruction and syllabus textbook distribution in Balangir to direct-to-college
              higher education tuition fee grants across Odisha.
            </p>
          </Reveal>
        </div>

        {/* =========================================================================
            2. FLAGSHIP FREE EDUCATION FEATURE (2-Column Editorial Split)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column (7 cols): Narrative & 3 Support Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal direction="up" delay={0.16} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-2xs bg-sand-light/90 border border-sand text-xs font-bold text-forest uppercase tracking-wider font-sans">
                <span>{data.badge}</span>
                <span className="text-terracotta-dark">•</span>
                <span className="text-terracotta-dark font-mono">Proposed Target: Up to 200 Students</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-snug">
                Phased Free Education Delivery for Underserved Scholars
              </h3>

              <p className="text-sm sm:text-base text-ink leading-relaxed font-sans">
                {data.objective}
              </p>

              {/* Target & Operational Scope Clarification */}
              <div className="p-3.5 rounded-xs bg-sand-light/60 border border-sand text-xs font-sans text-forest space-y-1">
                <span className="font-bold text-terracotta-dark block uppercase tracking-wide text-[10.5px]">
                  Target &amp; Operational Scope Clarification
                </span>
                <p className="text-[11.5px] text-ink leading-relaxed">
                  Proposed target — up to 200 students, subject to formal board sanction and confirmed funding. Confirmed funded places currently stand at zero, based on the existing programme record. Separately, 350+ recorded student participation entries (FY 2023–24), not necessarily 350 unique students supported.
                </p>
              </div>
            </Reveal>

            {/* 3 Pillars of Educational Support */}
            <Reveal direction="up" delay={0.2} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {data.supportPillars.map((pillar, idx) => {
                const icons = [BookOpen, Award, Compass];
                const IconComponent = icons[idx] || BookOpen;
                return (
                  <div
                    key={pillar.title}
                    className="p-4 sm:p-5 rounded-xs bg-white border border-border-warm border-t-2 border-t-terracotta shadow-2xs space-y-2 hover:border-terracotta transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="w-8 h-8 rounded-2xs bg-sand-light/80 border border-sand text-terracotta-dark flex items-center justify-center shrink-0">
                        <IconComponent className="w-4 h-4 text-terracotta-dark" aria-hidden="true" />
                      </div>
                      <h4 className="font-serif text-sm font-bold text-forest leading-snug">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-ink-sand leading-relaxed font-sans">
                        {pillar.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </Reveal>

            {/* Verified Beneficiary Scope & Accountability Context */}
            <Reveal direction="up" delay={0.24}>
              <div className="p-4 sm:p-5 rounded-xs bg-white border border-border-warm border-l-4 border-l-forest shadow-2xs space-y-2 text-xs font-sans">
                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-ink leading-relaxed">
                    <strong className="text-forest">Target Beneficiary Scope:</strong>{" "}
                    {data.beneficiaryScope}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-ink leading-relaxed">
                    <strong className="text-forest">Zero-Fee Policy:</strong> All educational support,
                    remedial coaching, and scholastic kits are provided free of charge (₹0). Operational records
                    are maintained under registered Trust Deed No. 40311302194.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Action Buttons */}
            <Reveal direction="up" delay={0.28}>
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Link href="/programmes#free-education-200" className="w-full sm:w-auto">
                  <Button variant="primary" size="md" className="w-full sm:w-auto font-semibold group shadow-xs">
                    <span>Explore Educational Scope</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </Link>

                <Link href="/donate?programme=EDUCATION_LEARNING" className="w-full sm:w-auto">
                  <Button variant="secondary" size="md" className="w-full sm:w-auto font-semibold">
                    <Heart className="w-4 h-4 mr-2 text-terracotta-dark" aria-hidden="true" />
                    <span>Support a Student</span>
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column (5 cols): Academic Photograph & Cohort Capacity Card */}
          <div className="lg:col-span-5 space-y-5">
            {/* Academic Photographic Panel */}
            <Reveal direction="up" delay={0.18}>
              <div className="relative group">
                <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden border border-border-warm shadow-xl bg-forest-deep">
                  <Image
                    src="/images/hero/illustrative-community-library-reading.webp"
                    alt="MECT community library reading room and peer-learning study circle in Balangir"
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover object-[50%_45%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest-deep/95 via-forest-deep/50 to-transparent pointer-events-none"
                  />
                  {/* Caption & Location Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 rounded-xs bg-forest-deep/90 border border-sand/35 px-2.5 py-1 text-[11px] text-cream font-sans backdrop-blur-xs">
                      <MapPin className="w-3 h-3 text-sand shrink-0" aria-hidden="true" />
                      <span className="font-medium">Project Samarth Learning Hub • Balangir Centre</span>
                    </div>
                    <span className="hidden sm:inline-block text-[10px] text-sand uppercase tracking-wider font-mono bg-forest-deep/80 px-2 py-0.5 rounded-2xs border border-sand/25">
                      Field Documentary
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Target Cohort Capacity Card */}
            <Reveal direction="up" delay={0.22}>
              <div className="bg-forest text-cream rounded-sm border-2 border-sand/40 shadow-xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sand font-sans">
                    Flagship Education Focus
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-terracotta text-white rounded-2xs">
                    Proposed Target
                  </span>
                </div>

                <div className="text-center py-3 bg-forest-deep rounded-xs border border-sand/30 p-4 space-y-1">
                  <span className="block font-serif text-5xl sm:text-6xl font-bold text-white tracking-tight leading-none tabular-nums">
                    200
                  </span>
                  <span className="block text-xs font-bold uppercase tracking-widest text-sand pt-1 font-sans">
                    Proposed Student Target
                  </span>
                  <p className="text-[11px] text-cream/90 max-w-xs mx-auto font-sans leading-relaxed pt-0.5">
                    Proposed target — up to 200 students, subject to formal board sanction and confirmed funding. Confirmed funded places currently stand at zero, based on the existing programme record.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  <div className="p-2.5 rounded-xs bg-forest-deep border border-white/10 space-y-0.5">
                    <span className="text-[10.5px] uppercase tracking-wider text-sand block">Application Fee</span>
                    <span className="font-bold text-white">₹0 (Zero Fees)</span>
                  </div>
                  <div className="p-2.5 rounded-xs bg-forest-deep border border-white/10 space-y-0.5">
                    <span className="text-[10.5px] uppercase tracking-wider text-sand block">Disbursal Mode</span>
                    <span className="font-bold text-white">Direct Institutional RTGS/NEFT</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* =========================================================================
            3. COHORT DOT GRID (Anime.js Matrix)
            ========================================================================= */}
        <Reveal direction="up" delay={0.24}>
          <div className="space-y-2">
            <FreeEducationDotGrid />
            <p className="text-[11px] text-text-muted font-sans text-center">
              Visual matrix representing the proposed 200-seat phased target. Funded places are opened progressively based on verified contributions and formal sanction.
            </p>
          </div>
        </Reveal>

        {/* =========================================================================
            4. SCHOLARSHIP OPPORTUNITIES PRESENTATION (4 Schemes - Strict Status Classification)
            ========================================================================= */}
        <div className="space-y-6 pt-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-dark font-sans">
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Institutional Scheme Framework</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Higher Education Scholarships &amp; Grants Portfolio
            </h3>
            <p className="text-xs sm:text-sm text-ink-sand font-sans leading-relaxed">
              Explore proposed and active student assistance initiatives. Approved tuition grants are remitted electronically to recognized college bank accounts via institutional transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SCHOLARSHIP_SCHEMES.map((scheme) => {
              const IconComp = scheme.icon;
              return (
                <div
                  key={scheme.id}
                  className="rounded-sm bg-white border border-border-warm p-5 sm:p-6 shadow-xs hover:border-terracotta/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-8 h-8 rounded-2xs bg-sand-light border border-sand text-terracotta-dark flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4 text-terracotta-dark" aria-hidden="true" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-dark bg-sand-light/60 border border-sand px-2 py-0.5 rounded-2xs text-right">
                        {scheme.statusTag}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-forest group-hover:text-terracotta-dark transition-colors leading-snug">
                      {scheme.name}
                    </h4>

                    <p className="text-xs text-ink-sand font-sans leading-relaxed">
                      {scheme.tagline}
                    </p>

                    <div className="pt-2 border-t border-border-warm/70 space-y-2 text-xs font-sans">
                      <div>
                        <span className="text-[10.5px] uppercase tracking-wider text-text-muted block font-semibold">
                          Criteria (Indicative)
                        </span>
                        <p className="text-[11.5px] text-ink leading-relaxed">
                          {scheme.criteria}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10.5px] uppercase tracking-wider text-text-muted block font-semibold">
                          Assistance Coverage
                        </span>
                        <p className="text-[11.5px] text-forest font-medium leading-relaxed">
                          {scheme.benefit}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border-warm flex items-center justify-between">
                    <span className="text-[11px] text-text-muted font-sans">
                      {scheme.target.split(" ")[0]} ...
                    </span>
                    <Link
                      href={scheme.href}
                      className="text-xs font-bold text-terracotta-dark hover:text-forest inline-flex items-center gap-1 group/link"
                    >
                      <span>{scheme.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            5. STUDENT APPLICATION JOURNEY (5-Stage Visualisation - Backend Enums)
            ========================================================================= */}
        <Reveal direction="up" delay={0.28}>
          <div className="rounded-sm bg-white border border-border-warm p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-dark font-sans">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Transparent Application Protocol</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                Five-Stage Student Application &amp; Disbursal Lifecycle
              </h3>
              <p className="text-xs sm:text-sm text-ink-sand font-sans leading-relaxed">
                Structured in accordance with MECT&apos;s auditable backend status lifecycle. Every application undergoes administrative review, institutional verification, committee evaluation, and direct electronic transfer to the verified institution&apos;s official bank account.
              </p>
            </div>

            {/* Informational Pre-Application Step (Distinct from Backend Statuses) */}
            <div className="p-4 sm:p-5 rounded-xs bg-sand-light/50 border border-sand flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-2xs bg-sand border border-sand-dark text-terracotta-dark flex items-center justify-center shrink-0 mt-0.5">
                  <Search className="w-4 h-4 text-terracotta-dark" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-terracotta-dark uppercase tracking-wider bg-sand/80 px-2 py-0.5 rounded-2xs">
                      Preliminary Informational Step
                    </span>
                    <span className="text-xs font-bold text-forest font-sans">
                      Pre-Application Self-Assessment &amp; Guidelines Review
                    </span>
                  </div>
                  <p className="text-xs text-ink-sand font-sans leading-relaxed">
                    Prior to formal application submission, students explore scheme details and evaluate self-reported indicators using the exploratory self-assessment tool. Pre-application is an informational guidance step and is not a registered backend application status.
                  </p>
                </div>
              </div>
              <Link href="/scholarships#eligibility-calculator" className="shrink-0">
                <Button variant="outline" size="sm" className="w-full sm:w-auto font-semibold bg-white text-xs">
                  <span>Explore Self-Assessment</span>
                </Button>
              </Link>
            </div>

            {/* 5-Stage Progressive Process Cards (Direct Backend Status Mapping) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {BACKEND_APPLICATION_STAGES.map((stage) => {
                const IconComp = stage.icon;
                return (
                  <div
                    key={stage.stageNumber}
                    className="p-4 sm:p-5 rounded-xs bg-cream/35 border border-border-warm space-y-3 flex flex-col justify-between shadow-2xs hover:border-terracotta/50 transition-colors"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-terracotta-dark bg-sand-light border border-sand px-2 py-0.5 rounded-2xs">
                          Stage {stage.stageNumber}
                        </span>
                        <div className="w-7 h-7 rounded-2xs bg-forest text-white flex items-center justify-center">
                          <IconComp className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
                        </div>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block font-mono">
                        {stage.statusKey}
                      </span>

                      <h4 className="font-serif text-base font-bold text-forest leading-snug">
                        {stage.title}
                      </h4>

                      <p className="text-xs text-ink-sand font-sans leading-relaxed">
                        {stage.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border-warm/60">
                      <span className="text-[10.5px] font-semibold text-forest flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-terracotta-dark shrink-0" aria-hidden="true" />
                        <span>{stage.actionNote}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Disbursal Standard Callout */}
            <div className="p-4 rounded-xs bg-sand-light/60 border border-sand text-xs font-sans text-forest flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Landmark className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
                <p className="leading-relaxed">
                  <strong>Strict Zero-Cash Standard:</strong> No scholarship disbursements are made in cash or handed to students or intermediaries. Approved tuition fee assistance is remitted directly to the verified official bank account of the educational institution.
                </p>
              </div>
              <Link href="/scholarships" className="shrink-0 text-terracotta-dark hover:text-forest font-bold inline-flex items-center gap-1 transition-colors">
                <span>View Disbursal Policy</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* =========================================================================
            6. SCHOLARSHIP DISCOVERY & ADVISORY ACTION BAR (Section 8 & 11)
            ========================================================================= */}
        <Reveal direction="up" delay={0.32}>
          <div className="rounded-sm bg-white border border-border-warm p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border-warm">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-forest">
                  <Compass className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider font-sans">
                    Student Discovery &amp; Application Action
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                  Begin Your Academic Support Application
                </h3>
                <p className="text-xs sm:text-sm text-ink-sand font-sans leading-relaxed">
                  Evaluate indicative eligibility across all 30 districts of Odisha, submit your academic marksheet and admission dossier, or track the progress of an existing application.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link href="/scholarships/apply" className="w-full sm:w-auto">
                  <Button variant="primary" size="md" className="w-full sm:w-auto font-semibold group shadow-xs">
                    <span>Submit Financial Aid Dossier</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </Link>

                <Link href="/scholarships/track" className="w-full sm:w-auto">
                  <Button variant="secondary" size="md" className="w-full sm:w-auto font-semibold">
                    <span>Track Application Status</span>
                  </Button>
                </Link>

                <Link href="/scholarships#eligibility-calculator" className="w-full sm:w-auto">
                  <Button variant="outline" size="md" className="w-full sm:w-auto font-semibold bg-white">
                    <span>Check Indicative Criteria</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mandatory Advisory Callout Notice */}
            <div className="flex items-start gap-3 text-xs font-sans text-text-muted">
              <Info className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                <strong className="text-forest">Preliminary Discovery Notice:</strong> Indicative scheme matching on this website is an exploratory self-assessment tool and does not constitute a formal grant sanction, selection guarantee, or binding financial commitment. Formal awards are strictly contingent upon verified documentation, verified educational institution enrollment, and approval by the authorized body under the Trust Deed.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
