"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import {
  ShieldCheck,
  FileText,
  Scale,
  Users,
  GraduationCap,
  Scissors,
  Droplets,
  Heart,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Landmark,
} from "lucide-react";

export type EvidenceClassification =
  | "DOCUMENTED"
  | "ADMINISTRATIVE_ESTIMATE"
  | "PROPOSED_TARGET";

export interface EvidenceMetricItem {
  id: string;
  metric: string;
  label: string;
  classification: EvidenceClassification;
  classificationLabel: string;
  title: string;
  description: string;
  period: string;
  countingMethod: string;
  primarySource: string;
  sourceLink?: string;
  icon: React.ElementType;
}

export const EVIDENCE_METRICS: EvidenceMetricItem[] = [
  {
    id: "civic-service",
    metric: "13+ Years",
    label: "Since Trust Deed Execution",
    classification: "DOCUMENTED",
    classificationLabel: "Documented Statutory Record",
    title: "Registered Trust Tenure",
    description:
      "Registered charitable trust deed executed on 27 July 2013 and registered under the Indian Trusts Act, 1882 in Balangir. Holds statutory registrations under Sections 12A and 80G of the Income-tax Act.",
    period: "27 July 2013 – Present",
    countingMethod: "Statutory registration tenure from Deed execution (27-07-2013)",
    primarySource: "Trust Deed No. 40311302194 • 12A URN: AADTM5474FE20231",
    sourceLink: "/statutory-disclosures",
    icon: Landmark,
  },
  {
    id: "students-coached",
    metric: "350+",
    label: "Recorded Student Participation Entries",
    classification: "ADMINISTRATIVE_ESTIMATE",
    classificationLabel: "Administrative Estimate",
    title: "Secondary Remedial Instruction",
    description:
      "350+ recorded student participation entries (FY 2023–24), not necessarily 350 unique students supported. Remedial instruction across rural centres in Balangir and Puintala blocks.",
    period: "FY 2023–24 Activity Record",
    countingMethod:
      "350+ recorded student participation entries (FY 2023–24), not necessarily 350 unique students supported.",
    primarySource: "Centre Attendance Registers • Balangir Secretariat Logbooks",
    sourceLink: "/impact",
    icon: GraduationCap,
  },
  {
    id: "women-skilled",
    metric: "120+",
    label: "Cumulative Course Enrolments",
    classification: "ADMINISTRATIVE_ESTIMATE",
    classificationLabel: "Administrative Estimate",
    title: "Women's Vocational Tailoring & Livelihoods",
    description:
      "120+ cumulative vocational course enrolments (FY 2021–23), not necessarily 120 uniquely certified women. Cumulative programme enrolments across vocational training cohorts.",
    period: "FY 2021–23 Multi-Cohort Cycles",
    countingMethod:
      "120+ cumulative vocational course enrolments (FY 2021–23), not necessarily 120 uniquely certified women.",
    primarySource: "Vocational Centre Enrolment Rolls • Sewing Toolkit Distribution Logs",
    sourceLink: "/programmes",
    icon: Scissors,
  },
  {
    id: "citizens-served",
    metric: "10,000+",
    label: "Recorded Service Instances",
    classification: "ADMINISTRATIVE_ESTIMATE",
    classificationLabel: "Administrative Estimate",
    title: "Jal Seva Clean Water & Summer Relief",
    description:
      "10,000+ recorded water and relief service instances, not 10,000 unique citizens. Drinking water and summer relief services provided across Western Odisha.",
    period: "Summer Seasons 2023 & 2024 (April–June)",
    countingMethod: "10,000+ recorded water and relief service instances, not 10,000 unique citizens.",
    primarySource: "Seasonal Kiosk Logbooks • Field Volunteer Reports",
    sourceLink: "/impact",
    icon: Droplets,
  },
  {
    id: "free-education-target",
    metric: "Up to 200",
    label: "Proposed Target — Up to 200 Students",
    classification: "PROPOSED_TARGET",
    classificationLabel: "Proposed Target — Subject to Sanction",
    title: "Flagship Free Education Initiative",
    description:
      "Proposed target — up to 200 students, subject to formal board sanction and confirmed funding. Confirmed funded places currently stand at zero, based on the existing programme record.",
    period: "Planned Phased Rollout (Subject to Sanction & Funding)",
    countingMethod:
      "Proposed target — up to 200 students, subject to formal board sanction and confirmed funding. Confirmed funded places: 0.",
    primarySource: "Trust Minutes & Programme Proposal Records",
    sourceLink: "/programmes#education",
    icon: Users,
  },
  {
    id: "honorary-governance",
    metric: "Clause XVI",
    label: "Honorary Fiduciary Governance",
    classification: "DOCUMENTED",
    classificationLabel: "Documented Trust Deed Rule",
    title: "Honorary Trustee Non-Remuneration",
    description:
      "Trust Deed Clause XVI establishes that all trustees serve in an honorary capacity without salary, fee, or personal remuneration from trust funds.",
    period: "27 July 2013 – Present",
    countingMethod: "Statutory governance rule under registered trust deed",
    primarySource: "Trust Deed No. 40311302194 Clause XVI",
    sourceLink: "/governance",
    icon: Scale,
  },
];

export const REPORTING_PILLARS = [
  {
    number: "01",
    title: "Primary Records Verified",
    description:
      "Statutory registrations (12A, 80G, PAN, NGO Darpan), Trust Deed provisions, and verified electronic banking channels are grounded in official public records.",
  },
  {
    number: "02",
    title: "Administrative Estimates Disclosed",
    description:
      "Grassroots operational outputs from field centres are transparently classified as internal estimates with explicit counting methods, acknowledging where formal trustee audits remain in progress.",
  },
  {
    number: "03",
    title: "Zero Speculative Impact",
    description:
      "Proposed targets and future commitments are strictly segregated from achieved results. We never portray planned capacity as currently enrolled beneficiaries or completed outcomes.",
  },
];

export function InstitutionalImpactSection() {
  return (
    <section
      id="institutional-impact"
      aria-labelledby="impact-heading"
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-sand-light/40 border-b border-border-warm scroll-mt-24 relative overflow-hidden"
    >
      <span id="impact" className="sr-only" />
      {/* Subtle ambient architectural glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(229, 196, 153, 0.4) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-32 left-1/4 w-[450px] h-[450px] rounded-full opacity-10 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(46, 68, 50, 0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container size="default" className="relative z-10 space-y-14 sm:space-y-16">
        {/* =========================================================================
            1. SECTION HEADER: Editorial Direction & Opportunity Statement
            ========================================================================= */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-white/90 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-terracotta-dark font-sans shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>Our Work, Accountably Presented</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="impact-heading"
              className="font-serif text-[clamp(1.85rem,4.4vw,2.75rem)] font-bold text-forest tracking-tight leading-[1.18] [text-wrap:balance]"
            >
              Meaningful work. Evidence that matters.
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-[15px] sm:text-base md:text-lg text-ink leading-relaxed font-sans">
              MECT&apos;s work spans education, livelihoods, health, water access and community
              welfare across Odisha. We believe that public institutional reporting must distinguish
              between verified statutory records, reported operational estimates, and future programme
              commitments.
            </p>
          </Reveal>
        </div>

        {/* =========================================================================
            2. EVIDENCE-CLASSIFIED METRIC GRID (Asymmetric Cards)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {EVIDENCE_METRICS.map((item, idx) => {
            const IconComp = item.icon;
            const isDocumented = item.classification === "DOCUMENTED";
            const isProposed = item.classification === "PROPOSED_TARGET";

            const badgeStyles = isDocumented
              ? "bg-forest/10 text-forest border-forest/30"
              : isProposed
              ? "bg-terracotta/10 text-terracotta-dark border-terracotta/30"
              : "bg-sand-light text-ink-sand border-sand";

            return (
              <Reveal key={item.id} direction="up" delay={0.06 * (idx + 1)}>
                <div
                  className={`h-full rounded-sm bg-white border border-border-warm p-5 sm:p-6 shadow-xs hover:border-terracotta/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group ${
                    isDocumented ? "border-t-3 border-t-forest" : ""
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Header: Icon & Classification Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-8 h-8 rounded-2xs bg-sand-light border border-sand text-terracotta-dark flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4 text-terracotta-dark" aria-hidden="true" />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-2xs border ${badgeStyles} font-mono`}
                      >
                        {item.classificationLabel}
                      </span>
                    </div>

                    {/* Numerical Metric Display */}
                    <div>
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight block tabular-nums">
                        {item.metric}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-terracotta-dark block pt-0.5 font-sans">
                        {item.label}
                      </span>
                    </div>

                    {/* Title & Narrative Description */}
                    <div className="space-y-1.5 pt-1">
                      <h3 className="font-serif text-base font-bold text-forest leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-ink-sand font-sans leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Evidence Scope Details */}
                    <div className="pt-2 border-t border-border-warm/70 space-y-1.5 text-xs font-sans">
                      <div className="flex items-start gap-1.5 text-[11px] text-ink-sand">
                        <Clock className="w-3.5 h-3.5 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
                        <span><strong>Reporting Period:</strong> {item.period}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-[11px] text-ink-sand">
                        <Scale className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                        <span><strong>Counting Scope:</strong> {item.countingMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer: Source Record & Anchor */}
                  <div className="pt-3 border-t border-border-warm flex items-center justify-between gap-2 text-[10.5px] font-sans">
                    <span className="text-text-muted truncate font-mono">
                      {item.primarySource}
                    </span>
                    {item.sourceLink && (
                      <Link
                        href={item.sourceLink}
                        className="text-terracotta-dark hover:text-forest font-bold inline-flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <span>Verify</span>
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* =========================================================================
            3. DOCUMENTARY PHOTOGRAPHY & "HOW WE REPORT" FRAMEWORK (2-Column Split)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2">
          {/* Left Column (5 cols): Illustrative Documentary Photo */}
          <div className="lg:col-span-5 space-y-3">
            <Reveal direction="up" delay={0.2}>
              <div className="relative group">
                <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden border border-border-warm shadow-xl bg-forest-deep">
                  <Image
                    src="/images/hero/mect-clean-water-hygiene-demo.webp"
                    alt="Community water sanitation and hygiene awareness outreach in rural Odisha. Illustrative representation of MECT's seasonal clean-water initiatives."
                    fill
                    loading="lazy"
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 40vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest-deep/95 via-forest-deep/50 to-transparent pointer-events-none"
                  />
                  {/* Context Pill & Location */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 rounded-xs bg-forest-deep/90 border border-sand/35 px-2.5 py-1 text-[11px] text-cream font-sans backdrop-blur-xs">
                      <MapPin className="w-3 h-3 text-sand shrink-0" aria-hidden="true" />
                      <span className="font-medium">Western Odisha • Community Water Sanitation</span>
                    </div>
                    <span className="text-[10px] text-sand uppercase tracking-wider font-mono bg-forest-deep/80 px-2 py-0.5 rounded-2xs border border-sand/25">
                      Illustrative Context
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
            <p className="text-[11px] text-text-muted font-sans leading-relaxed px-1">
              Community water sanitation and hygiene awareness outreach in rural Odisha. Illustrative representation of MECT&apos;s seasonal clean-water initiatives.
            </p>
          </div>

          {/* Right Column (7 cols): Editorial "How We Report" Framework */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal direction="up" delay={0.24} className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-dark font-sans">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Our Reporting Commitments</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-snug">
                Transparent Reporting &amp; Fiduciary Integrity
              </h3>
              <p className="text-sm sm:text-base text-ink leading-relaxed font-sans">
                Public confidence requires rigorous separation of verified statutory facts from
                grassroots operational estimates. We adhere to three core reporting standards across
                all published materials:
              </p>
            </Reveal>

            {/* 3 Reporting Principles */}
            <Reveal direction="up" delay={0.28} className="space-y-3">
              {REPORTING_PILLARS.map((pillar) => (
                <div
                  key={pillar.number}
                  className="p-4 sm:p-5 rounded-xs bg-white border border-border-warm shadow-2xs flex items-start gap-4 hover:border-terracotta/40 transition-colors"
                >
                  <span className="font-mono text-sm font-bold text-terracotta-dark bg-sand-light border border-sand px-2 py-1 rounded-2xs shrink-0">
                    {pillar.number}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-serif text-sm sm:text-base font-bold text-forest">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-ink-sand leading-relaxed font-sans">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        {/* =========================================================================
            4. FIDUCIARY GOVERNANCE CALLOUT & INTERACTIVE AUDIT ACTIONS
            ========================================================================= */}
        <Reveal direction="up" delay={0.32}>
          <div className="rounded-sm bg-white border border-border-warm p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border-warm">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-forest">
                  <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider font-sans">
                    Fiduciary Accountability
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                  Open Institutional Inspection &amp; Statutory Audits
                </h3>
                <p className="text-xs sm:text-sm text-ink-sand font-sans leading-relaxed">
                  In strict accordance with Trust Deed Clause XVI, all trustees serve in an
                  honorary, non-remunerative capacity without salary, sitting fees, or personal
                  remuneration from trust funds. Statutory filings, audited financial statements,
                  and regulatory compliance records are maintained at the Balangir registered office
                  and made available for institutional review in accordance with public trust standards.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link href="/impact" className="w-full sm:w-auto">
                  <Button variant="primary" size="md" className="w-full sm:w-auto font-semibold group shadow-xs">
                    <span>Inspect Full Impact Ledger</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </Link>

                <Link href="/statutory-disclosures" className="w-full sm:w-auto">
                  <Button variant="secondary" size="md" className="w-full sm:w-auto font-semibold">
                    <span>View Statutory Vault</span>
                  </Button>
                </Link>

                <Link href="/reports" className="w-full sm:w-auto">
                  <Button variant="outline" size="md" className="w-full sm:w-auto font-semibold bg-white">
                    <span>Review Annual Reports</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Evidence Note */}
            <div className="flex items-start gap-3 text-xs font-sans text-text-muted">
              <FileText className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                <strong className="text-forest">Public Evidence Standard:</strong> Figures displayed above represent the most recent operational summaries compiled from centre logs and trust filings. Beneficiary registers and audited financial statements are preserved at the registered office (Deed No. 40311302194, Balangir, Odisha).
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
