"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import {
  Layers,
  Compass,
  FileCheck2,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Users,
  Droplets,
  Heart,
  Sparkles,
  Scale,
  Building2,
  Calendar,
  HelpCircle,
  ExternalLink,
  MapPin,
  Clock,
  Briefcase,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";

export type ProcessClassification =
  | "DOCUMENTED_PRACTICE"
  | "GOVERNANCE_REQUIREMENT"
  | "ACTIVE_PROGRAMME"
  | "PLANNED_PROCESS";

export interface OperatingStage {
  step: string;
  question: string;
  title: string;
  classification: ProcessClassification;
  classificationLabel: string;
  description: string;
  operationalScope: string;
  primarySource: string;
  sourceLink: string;
  icon: React.ElementType;
}

export interface AudiencePathway {
  id: string;
  audience: string;
  summary: string;
  actions: Array<{
    label: string;
    href: string;
    variant: "primary" | "secondary" | "outline";
  }>;
  icon: React.ElementType;
}

export const OPERATING_STAGES: OperatingStage[] = [
  {
    step: "01",
    question: "How does MECT identify and understand community needs?",
    title: "Community-Informed Programme Planning",
    classification: "ACTIVE_PROGRAMME",
    classificationLabel: "Field Consultation Practice",
    description:
      "Programme planning is informed by MECT's charitable objectives and available community-level information from Balangir district. Trust coordinators and local volunteers observe scholastic retention, seasonal drinking-water distress, and household livelihood needs to guide grassroots initiatives.",
    operationalScope:
      "Informal local community consultations in Balangir district; not a standardized survey or statistical assessment system.",
    primarySource: "Trust Objectives & Local Field Logs • Balangir District",
    sourceLink: "/about",
    icon: Compass,
  },
  {
    step: "02",
    question: "How are educational and community programmes planned?",
    title: "Charitable Charter Alignment",
    classification: "GOVERNANCE_REQUIREMENT",
    classificationLabel: "Statutory Trust Rule",
    description:
      "All Trust initiatives are legally governed by the founding charitable objectives defined in Trust Deed Section 4 (educational advancement, relief of poverty, medical relief). Under Clause XVI, all trustees serve in an honorary capacity without salary or fees. Proposed initiatives (such as the target of up to 200 scholarship students) remain subject to formal trustee sanction and confirmed funding.",
    operationalScope:
      "Governed by statutory charitable objects in Trust Deed Section 4 and honorary trustee service under Clause XVI.",
    primarySource: "Trust Deed No. 40311302194 Section 4 & Clause XVI",
    sourceLink: "/governance",
    icon: Scale,
  },
  {
    step: "03",
    question: "How are resources and institutional support organized?",
    title: "Institutional Banking & General Fund Administration",
    classification: "DOCUMENTED_PRACTICE",
    classificationLabel: "Documented Banking Channel",
    description:
      "Charitable support is received through institutional banking channels (State Bank of India electronic transfer and verified UPI) and voluntary public contributions. Under MECT's internal accounting practice, unrestricted donations are administered under its General Fund classification to support trustee-approved charitable activities, while designated gifts support donor-selected programmes. MECT holds CSR-1 registration number CSR00081063; any CSR project engagement remains subject to applicable eligibility requirements, contributing company assessment and approval, and relevant project documentation.",
    operationalScope:
      "Direct institutional banking via State Bank of India; unrestricted donations administered under MECT's internal General Fund classification. Standard bank/gateway processing fees may apply.",
    primarySource: "State Bank of India Trust Account • Historical 12A/80G Orders & CSR-1 Registration",
    sourceLink: "/donate",
    icon: Landmark,
  },
  {
    step: "04",
    question: "How are programmes and activities delivered?",
    title: "Direct Grassroots Delivery",
    classification: "ACTIVE_PROGRAMME",
    classificationLabel: "Active Field Operations",
    description:
      "Hands-on execution via established learning centres, volunteer educators, and field relief points. Core operational activities include secondary remedial coaching in Balangir and Puintala, women's vocational tailoring instruction, and seasonal Jal Seva drinking-water and ORS kiosks during severe summer heatwaves in Western Odisha.",
    operationalScope:
      "Remedial coaching centres, tailoring cohorts, and seasonal kiosks operating directly without middle-agents.",
    primarySource: "Active Field Centres & Kiosks • Balangir District",
    sourceLink: "/programmes",
    icon: Users,
  },
  {
    step: "05",
    question: "How are records, outcomes and institutional responsibilities communicated?",
    title: "Transparent Reporting & Public Accountability",
    classification: "DOCUMENTED_PRACTICE",
    classificationLabel: "Audited Public Compliance",
    description:
      "Internal operational records (attendance rosters, toolkit issue logs, seasonal kiosk summaries) are maintained at field centres for administrative management. Statutory compliance filings—including historical income-tax audit reports (Form 10B for relevant assessment periods), annual tax returns, and Form 10AC registration orders—are referenced in our online statutory disclosures vault. Audited annual financial statements and ledgers are preserved at the registered office for formal institutional review.",
    operationalScope:
      "Online statutory disclosures vault for regulatory filings; audited accounts and administrative registers retained at the registered office.",
    primarySource: "Statutory Disclosures Vault • Historical Form 10B Audit Records",
    sourceLink: "/statutory-disclosures",
    icon: ShieldCheck,
  },
];

export const AUDIENCE_PATHWAYS: AudiencePathway[] = [
  {
    id: "students-families",
    audience: "Students & Families",
    summary:
      "Explore free remedial coaching programmes, textbook assistance, and verified scholarship guidance.",
    actions: [
      {
        label: "Explore Programmes",
        href: "/programmes",
        variant: "primary",
      },
      {
        label: "Scholarship Guidance",
        href: "/scholarships",
        variant: "outline",
      },
    ],
    icon: GraduationCap,
  },
  {
    id: "donors-supporters",
    audience: "Donors & Supporters",
    summary:
      "Review authorized online checkout channels, statutory disclosures archive, and audited fiduciary stewardship.",
    actions: [
      {
        label: "Make a Donation",
        href: "/donate",
        variant: "primary",
      },
      {
        label: "Statutory Vault",
        href: "/statutory-disclosures",
        variant: "outline",
      },
    ],
    icon: Heart,
  },
  {
    id: "volunteers-mentors",
    audience: "Volunteers & Mentors",
    summary:
      "Contribute time and expertise in secondary subject tutoring, vocational training, or seasonal community drives.",
    actions: [
      {
        label: "Register as Volunteer",
        href: "/volunteer",
        variant: "primary",
      },
    ],
    icon: Users,
  },
  {
    id: "csr-partners",
    audience: "CSR & Institutional Partners",
    summary:
      "MECT holds CSR-1 registration number CSR00081063. Any CSR project engagement remains subject to applicable eligibility requirements, contributing company assessment and approval, and relevant project documentation.",
    actions: [
      {
        label: "CSR Partnerships",
        href: "/csr-partnerships",
        variant: "primary",
      },
      {
        label: "Contact Secretariat",
        href: "/contact",
        variant: "outline",
      },
    ],
    icon: Building2,
  },
];

export function HowMectWorksSection() {
  return (
    <section
      id="how-mect-works"
      aria-labelledby="how-it-works-heading"
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-cream border-b border-border-warm scroll-mt-24 relative overflow-hidden"
    >
      {/* Ambient background architectural tint */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -top-40 left-1/3 w-[550px] h-[550px] rounded-full opacity-10 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(184, 80, 50, 0.35) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(46, 68, 50, 0.35) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container size="default" className="relative z-10 space-y-16 sm:space-y-20">
        {/* =========================================================================
            1. SECTION HEADER: Editorial Direction & Grounded Purpose
            ========================================================================= */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-white/90 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-terracotta-dark font-sans shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>Our Approach</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="how-it-works-heading"
              className="font-serif text-[clamp(1.85rem,4.4vw,2.75rem)] font-bold text-forest tracking-tight leading-[1.18] [text-wrap:balance]"
            >
              From community needs to meaningful action.
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-[15px] sm:text-base md:text-lg text-ink leading-relaxed font-sans">
              Understand how MECT connects its charitable objectives with educational initiatives,
              community programmes, institutional support and responsible public reporting.
            </p>
          </Reveal>
        </div>

        {/* =========================================================================
            2. ASYMMETRIC EDITORIAL OVERVIEW & FIVE-STAGE TIMELINE
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (4 cols): Institutional Principles & Context Imagery */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <Reveal direction="up" delay={0.15}>
              <div className="rounded-sm bg-white border border-border-warm p-6 shadow-xs space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-dark font-sans">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Operating Principles</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest leading-snug">
                    Transparent, Direct &amp; Fiduciary Stewardship
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-sand font-sans leading-relaxed">
                    MECT operates without commercial brokers or speculative programmes. Activities
                    are funded through direct institutional banking channels, supported by dedicated
                    volunteer educators, and delivered through community-rooted field centres.
                  </p>
                </div>

                <div className="pt-2 border-t border-border-warm space-y-2.5 text-xs font-sans text-ink">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Honorary, non-remunerative Board of Trustees (Deed Clause XVI)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Direct-to-institution bank disbursements with zero cash scholarships</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Explicit distinction between active centres and planned expansions</span>
                  </div>
                </div>

                {/* Illustrative Context Image */}
                <div className="pt-2">
                  <div className="relative w-full aspect-[16/10] rounded-xs overflow-hidden border border-border-warm bg-forest-deep shadow-xs">
                    <Image
                      src="/images/hero/illustrative-community-library-reading.webp"
                      alt="Community learning environment and remedial study session in rural Odisha"
                      fill
                      loading="lazy"
                      sizes="(max-width: 1023px) 90vw, 30vw"
                      className="object-cover object-center"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-forest-deep/90 to-transparent pointer-events-none"
                    />
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-sand pointer-events-none">
                      <span className="font-medium truncate">Balangir Field Centre</span>
                      <span className="font-mono uppercase tracking-wider bg-forest-deep/80 px-1.5 py-0.5 rounded-2xs border border-sand/30">
                        Illustrative Context
                      </span>
                    </div>
                  </div>
                  <p className="text-[10.5px] text-text-muted font-sans leading-relaxed mt-2 px-0.5">
                    Illustrative representation of community-based remedial education sessions organized in Western Odisha.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column (8 cols): Five Sequential Process Stages */}
          <div className="lg:col-span-8 space-y-6">
            {OPERATING_STAGES.map((stage, idx) => {
              const IconComp = stage.icon;
              const isGovernance = stage.classification === "GOVERNANCE_REQUIREMENT";
              const isActive = stage.classification === "ACTIVE_PROGRAMME";

              const badgeStyles = isGovernance
                ? "bg-forest/10 text-forest border-forest/30"
                : isActive
                ? "bg-terracotta/10 text-terracotta-dark border-terracotta/30"
                : "bg-sand-light text-ink-sand border-sand";

              return (
                <Reveal key={stage.step} direction="up" delay={0.08 * (idx + 1)}>
                  <div className="relative rounded-sm bg-white border border-border-warm p-6 sm:p-7 shadow-xs hover:border-terracotta/40 hover:shadow-sm transition-all duration-300 space-y-4 group">
                    {/* Top Row: Step Number, Question Badge & Classification Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-warm/70 pb-3.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xl sm:text-2xl font-bold text-terracotta-dark bg-sand-light border border-sand px-2.5 py-0.5 rounded-2xs">
                          {stage.step}
                        </span>
                        <span className="text-xs sm:text-[13px] font-semibold text-ink font-sans italic">
                          {stage.question}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-2xs border ${badgeStyles} font-mono`}
                      >
                        {stage.classificationLabel}
                      </span>
                    </div>

                    {/* Middle Row: Title & Narrative */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-2xs bg-sand-light border border-sand text-terracotta-dark flex items-center justify-center shrink-0">
                          <IconComp className="w-3.5 h-3.5 text-terracotta-dark" aria-hidden="true" />
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-forest leading-snug">
                          {stage.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-ink font-sans leading-relaxed pt-1">
                        {stage.description}
                      </p>
                    </div>

                    {/* Operational Scope & Evidence Verification Link */}
                    <div className="pt-3 border-t border-border-warm/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-sans">
                      <div className="text-[11.5px] text-ink-sand leading-relaxed">
                        <strong className="text-forest">Operational Scope:</strong> {stage.operationalScope}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0">
                        <span className="text-[10.5px] font-mono text-text-muted truncate max-w-[200px]">
                          {stage.primarySource}
                        </span>
                        <Link
                          href={stage.sourceLink}
                          className="text-terracotta-dark hover:text-forest font-bold inline-flex items-center gap-1 text-[11px] shrink-0 transition-colors"
                        >
                          <span>Verify</span>
                          <ArrowRight className="w-3 h-3" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            3. SUPPORTING FIDUCIARY GOVERNANCE & STATUTORY ASSURANCE PANEL
            ========================================================================= */}
        <Reveal direction="up" delay={0.25}>
          <div className="rounded-sm bg-sand-light/60 border border-border-warm p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-forest">
                  <ShieldCheck className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider font-sans">
                    Fiduciary Transparency Standard
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-forest">
                  Honorary Governance &amp; Institutional Accountability
                </h3>
                <p className="text-xs sm:text-sm text-ink-sand font-sans leading-relaxed">
                  In strict accordance with Trust Deed Clause XVI, all trustees serve in an honorary
                  capacity without salary, sitting fees, or personal remuneration from trust funds.
                  Statutory filings, audited financial statements, and regulatory compliance records
                  are maintained at the Balangir registered office and made available for institutional
                  review in accordance with public trust standards.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link href="/statutory-disclosures">
                  <Button variant="secondary" size="md" className="font-semibold shadow-xs">
                    <span>Inspect Statutory Disclosures</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* =========================================================================
            4. AUDIENCE PATHWAYS: Clear, Meaningful Next Practical Steps
            ========================================================================= */}
        <div className="space-y-6">
          <Reveal direction="up" delay={0.3}>
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-terracotta-dark font-sans">
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Audience Pathways</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-snug">
                How you can engage with MECT
              </h3>
              <p className="text-xs sm:text-sm text-ink font-sans leading-relaxed">
                Whether you are a student seeking academic support, a citizen wishing to volunteer, or
                an institutional partner reviewing governance records, choose your dedicated route below.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {AUDIENCE_PATHWAYS.map((pathway, idx) => {
              const IconComp = pathway.icon;
              return (
                <Reveal key={pathway.id} direction="up" delay={0.07 * (idx + 1)}>
                  <div className="h-full rounded-sm bg-white border border-border-warm p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-terracotta/40 transition-colors">
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-2xs bg-sand-light border border-sand text-terracotta-dark flex items-center justify-center shrink-0">
                        <IconComp className="w-4.5 h-4.5 text-terracotta-dark" aria-hidden="true" />
                      </div>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-forest leading-snug">
                        {pathway.audience}
                      </h4>
                      <p className="text-xs text-ink-sand font-sans leading-relaxed">
                        {pathway.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border-warm space-y-2">
                      {pathway.actions.map((action, aIdx) => (
                        <Link key={aIdx} href={action.href} className="block w-full">
                          <Button
                            variant={action.variant}
                            size="sm"
                            className={`w-full font-semibold justify-between ${
                              action.variant === "outline" ? "bg-white" : ""
                            }`}
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
