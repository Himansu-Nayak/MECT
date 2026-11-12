"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import {
  HeroEntrance,
  Reveal,
  StaggerGroup,
  StaggerItem,
  CountUpStat,
  MOTION_STAGGER,
} from "@/components/ui/MotionPrimitives";
import { InstitutionalMarquee } from "@/components/InstitutionalMarquee";
import { FreeEducationSection } from "@/components/sections/FreeEducationSection";
import { SbiDonationSection } from "@/components/sections/SbiDonationSection";
import { CsrRegistrationSection } from "@/components/sections/CsrRegistrationSection";
import { SchemeExplorer } from "@/components/SchemeExplorer";
import { EligibilityCalculator } from "@/components/EligibilityCalculator";
import { DirectDisbursalFlowchart } from "@/components/DirectDisbursalFlowchart";
import { HeroBackgroundMarquee } from "@/components/sections/HeroBackgroundMarquee";
import { HOMEPAGE_CONTENT } from "@/lib/homepage-content";
import { TRUST_CONFIG } from "@/lib/config";
import { COMPLIANCE } from "@content/compliance";
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Compass,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  School,
  Building2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Send,
  Landmark,
  Shield,
  FileCheck,
  Heart,
  Briefcase,
  Scissors,
  Droplets,
  Utensils,
  Search,
  Layers,
  Calculator,
  Receipt,
} from "lucide-react";
import { submitInquiry, submitVolunteerRegistration } from "@/lib/api";

const ODISHA_DISTRICTS_LIST = [
  "Balangir",
  "Khordha (Bhubaneswar)",
  "Cuttack",
  "Ganjam (Berhampur)",
  "Sambalpur",
  "Balasore",
  "Puri",
  "Mayurbhanj (Baripada)",
  "Sundargarh (Rourkela)",
  "Bhadrak",
  "Jajpur",
  "Kalahandi",
  "Koraput",
  "Dhenkanal",
  "Angul",
  "Other Odisha District",
];

const ENABLEMENT_ICON_MAP: Record<string, React.ElementType> = {
  Users,
  BookOpen,
  Compass,
  HeartHandshake,
};

const HOW_WE_WORK_ICON_MAP: Record<string, React.ElementType> = {
  Search,
  Layers,
  Users,
  ShieldCheck,
};

const PILLAR_ICON_MAP: Record<string, React.ElementType> = {
  "01": GraduationCap,
  "02": Scissors,
  "03": Droplets,
  "04": Utensils,
  "05": HeartHandshake,
};

export default function HomePage() {
  // Public Secretariat Inquiry State
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryReferenceId, setInquiryReferenceId] = useState<number | null>(null);
  const [inquiryIsSubmitting, setInquiryIsSubmitting] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "Balangir",
    category: "Scholarship Guidance",
    message: "",
  });

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryIsSubmitting(true);
    setInquiryError(null);

    try {
      const response = await submitInquiry({
        fullName: inquiryData.name.trim(),
        email: inquiryData.email.trim(),
        phone: inquiryData.phone.trim(),
        category: inquiryData.category,
        message: inquiryData.message.trim()
          ? `[District: ${inquiryData.district}]\n\n${inquiryData.message.trim()}`
          : `General inquiry submitted from ${inquiryData.district} regarding ${inquiryData.category}.`,
      });
      setInquiryReferenceId(response.referenceId || null);
      setInquirySubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setInquiryError(err.message);
      } else {
        setInquiryError(
          "Unable to connect to the secretariat desk. Please check your network or try again."
        );
      }
    } finally {
      setInquiryIsSubmitting(false);
    }
  };

  // Volunteer / Mentorship State
  const [volSubmitted, setVolSubmitted] = useState(false);
  const [volReferenceId, setVolReferenceId] = useState<number | null>(null);
  const [volIsSubmitting, setVolIsSubmitting] = useState(false);
  const [volError, setVolError] = useState<string | null>(null);
  const [volConsent, setVolConsent] = useState(false);
  const [volData, setVolData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "Balangir",
    qualification: "",
    role: "Academic & Career Mentorship",
    notes: "",
  });

  const handleVolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVolIsSubmitting(true);
    setVolError(null);

    if (!volConsent) {
      setVolError("Mandatory consent declaration is required before submitting registration.");
      setVolIsSubmitting(false);
      return;
    }

    try {
      const response = await submitVolunteerRegistration({
        fullName: volData.name.trim(),
        email: volData.email.trim(),
        phone: volData.phone.trim(),
        district: volData.district,
        qualification: volData.qualification.trim() || "Unspecified",
        roleInterest: volData.role,
        backgroundNotes:
          volData.notes.trim() ||
          `Volunteer registration via Homepage Desk for ${volData.role} in ${volData.district}.`,
        consentDeclared: true,
        consentVersion: "v2.6",
      });
      setVolReferenceId(response.referenceId || null);
      setVolSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setVolError(err.message);
      } else {
        setVolError("Unable to record volunteer registration. Please try again.");
      }
    } finally {
      setVolIsSubmitting(false);
    }
  };

  // Section 11: Interactive 80G Donation Calculator State
  const [donationAmount, setDonationAmount] = useState<number>(5000);
  const [taxRegime, setTaxRegime] = useState<"old" | "new">("old");
  const [taxBracket, setTaxBracket] = useState<number>(0.3); // 30% default

  // Under Old Tax Regime: 50% deduction of qualifying amount
  // Under New Tax Regime (Section 115BAC): Chapter VI-A (80G) deductions are generally not permitted for individuals
  const eligibleDeduction = taxRegime === "old" ? donationAmount * 0.5 : 0;
  const estimatedTaxSaved = taxRegime === "old" ? eligibleDeduction * taxBracket : 0;

  const getImpactDescription = (amount: number) => {
    if (amount < 2500) {
      return "Provides one month of scholastic books and learning materials for a rural student in Balangir.";
    }
    if (amount < 5000) {
      return "Funds after-school remedial coaching and exam guidance for 2 tribal students for a full semester.";
    }
    if (amount < 10000) {
      return "Supplies a complete vocational tailoring toolkit and fabric set for a rural woman artisan trainee.";
    }
    if (amount < 25000) {
      return "Sustains a summer Jal Seva clean drinking water kiosk serving over 1,000 citizens in 45°C heatwaves.";
    }
    return "Sponsors hot, hygienic Jan Ahar daily meals for 250+ impoverished patient attendants at Balangir Hospital.";
  };

  return (
    <div className="flex flex-col w-full pb-floating-clearance bg-cream">
      {/* =========================================================================
          SECTION 1 — CINEMATIC FULL-WIDTH PHOTOGRAPHIC HERO
          ========================================================================= */}
      <section className="relative overflow-hidden bg-forest-deep text-white py-7 sm:py-10 md:pt-14 md:pb-14 lg:pt-16 lg:pb-14 border-b border-forest-deep">
        {/* Hero Background Canvas (All Viewports) & Foreground Typography Area */}
        <div className="static overflow-hidden">
          {/* Layer 0: Full-Bleed Left-to-Right Marquee Behind Hero Copy */}
          <HeroBackgroundMarquee />

          {/* Layer 1: Forest & Subtle Terracotta Cinematic Scrim for Contrast */}
          <div
            aria-hidden="true"
            className="block absolute inset-0 z-10 pointer-events-none"
            style={{
              background: [
                "radial-gradient(ellipse at 16% 34%, rgba(164, 94, 68, 0.16) 0%, transparent 56%)",
                "linear-gradient(180deg, rgba(29, 41, 36, 0.30) 0%, rgba(29, 41, 36, 0.18) 42%, rgba(29, 41, 36, 0.68) 100%)",
                "linear-gradient(90deg, rgba(29, 41, 36, 0.68) 0%, rgba(29, 41, 36, 0.46) 45%, rgba(29, 41, 36, 0.18) 76%, rgba(29, 41, 36, 0.14) 100%)",
              ].join(", "),
            }}
          />

          <Container size="default" className="relative z-20">
            <HeroEntrance className="max-w-3xl lg:max-w-4xl space-y-2.5 sm:space-y-3.5 md:space-y-5 text-left min-w-0">
              {/* Institutional Eyebrow Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xs border border-sand/55 bg-forest-deep/85 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.07em] sm:tracking-[0.11em] text-sand font-sans whitespace-nowrap shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-sand shrink-0" aria-hidden="true" />
                <span>{HOMEPAGE_CONTENT.hero.badge}</span>
              </div>

              {/* Grand Highlighted Editorial Headline */}
              <h1 className="font-serif text-[clamp(1.5rem,6.2vw,2.05rem)] sm:text-4xl md:text-[2.75rem] lg:text-[3.15rem] xl:text-[3.35rem] font-bold text-white tracking-tight leading-[1.15] sm:leading-[1.1] [text-wrap:balance] drop-shadow-[0_2px_16px_rgba(12,18,15,0.88)]">
                Stronger communities begin with{" "}
                <span className="text-sand">opportunity, dignity and care.</span>
              </h1>

              {/* Multi-Sector Narrative Subtext */}
              <p className="text-[13.5px] sm:text-base md:text-lg text-cream leading-[1.6] sm:leading-relaxed font-sans max-w-xl sm:max-w-2xl drop-shadow-[0_2px_10px_rgba(12,18,15,0.88)]">
                {HOMEPAGE_CONTENT.hero.subtext}
              </p>

              {/* Structured Action Buttons — Responsive Grid on Mobile, Inline Row on Tablet/Desktop */}
              <div className="pt-1 grid grid-cols-1 min-[375px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2.5 sm:gap-3">
                <Link href={HOMEPAGE_CONTENT.hero.ctas.secondary.href} className="w-full sm:w-auto">
                  <Button
                    variant="gold"
                    size="md"
                    className="w-full sm:w-auto shadow-lg font-bold px-4 sm:px-5 h-11 text-[13px] sm:text-sm whitespace-nowrap"
                  >
                    <Award className="w-4 h-4 mr-1.5 text-forest-deep shrink-0" aria-hidden="true" />
                    <span>Explore Our Work</span>
                  </Button>
                </Link>
                <Link href={HOMEPAGE_CONTENT.hero.ctas.primary.href} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto shadow-lg font-semibold !border-sand/50 px-4 sm:px-5 h-11 text-[13px] sm:text-sm whitespace-nowrap"
                  >
                    <Heart className="w-4 h-4 mr-1.5 fill-current text-sand shrink-0" aria-hidden="true" />
                    <span>Support Our Mission</span>
                  </Button>
                </Link>
                <Link
                  href={HOMEPAGE_CONTENT.hero.ctas.csr.href}
                  className="w-full sm:w-auto min-[375px]:col-span-2"
                >
                  <Button
                    variant="dark-outline"
                    size="md"
                    className="w-full sm:w-auto font-semibold bg-forest-deep/85 !border-white/60 hover:!bg-forest-deep hover:!border-sand px-4 sm:px-5 h-11 text-[13px] sm:text-sm whitespace-nowrap"
                  >
                    <Briefcase className="w-4 h-4 mr-1.5 text-sand shrink-0" aria-hidden="true" />
                    <span>{HOMEPAGE_CONTENT.hero.ctas.csr.text}</span>
                  </Button>
                </Link>
              </div>

              {/* Quiet Governance Link & Notice */}
              <div className="pt-2.5 sm:pt-3 mt-1 border-t border-white/25 max-w-2xl space-y-1">
                <p className="text-[11.5px] sm:text-[13px] text-white font-sans leading-relaxed drop-shadow-[0_1px_6px_rgba(12,18,15,0.85)]">
                  Operating under registered Trust Deed (2013, Balangir Doc No. 40311302194). Review our{" "}
                  <Link
                    href={HOMEPAGE_CONTENT.hero.ctas.governance.href}
                    className="text-white underline decoration-sand underline-offset-4 hover:text-sand transition-colors font-semibold"
                  >
                    Fiduciary Charter &amp; Governance Code
                  </Link>
                  .
                </p>
                <p className="text-[11px] sm:text-xs text-cream/90 font-sans leading-relaxed drop-shadow-[0_1px_6px_rgba(12,18,15,0.85)]">
                  {HOMEPAGE_CONTENT.hero.notice}
                </p>
              </div>
            </HeroEntrance>
          </Container>
        </div>

        {/* Statutorily Grounded Metric Cards Strip — Flows cleanly below mobile photo zone; integrated on desktop */}
        <div className="relative z-20 bg-forest-deep border-t border-sand/20 md:bg-transparent md:border-t-0">
          <Container size="default">
            <div className="py-3.5 md:py-0 md:mt-10 md:pt-6 md:border-t md:border-white/25 grid grid-cols-1 min-[350px]:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-6 text-center">
              {HOMEPAGE_CONTENT.hero.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="space-y-1 md:border-r md:border-white/25 md:last:border-r-0 md:px-4"
                >
                  <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-sand tabular-nums block drop-shadow-[0_2px_8px_rgba(12,18,15,0.88)]">
                    {metric.value}
                  </span>
                  <p className="text-xs uppercase font-bold tracking-wider text-white font-sans drop-shadow-[0_1px_6px_rgba(12,18,15,0.85)]">
                    {metric.label}
                  </p>
                  <p className="text-[11px] text-cream/90 font-sans leading-snug drop-shadow-[0_1px_6px_rgba(12,18,15,0.85)]">
                    {metric.subtext}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — INSTITUTIONAL CREDIBILITY: Verified Regulatory Vault
          ========================================================================= */}
      <InstitutionalMarquee />

      <section className="py-10 bg-sand-light border-b border-border-warm">
        <Container size="default">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span className="font-semibold text-forest">
                Authoritative Accreditation &amp; Governance Credentials:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-ink">
              <span><strong>Trust Deed:</strong> 40311302194</span>
              <span className="text-forest/40">•</span>
              <span><strong>12A URN:</strong> AADTM5474FE20231</span>
              <span className="text-forest/40">•</span>
              <span><strong>80G URN:</strong> AADTM5474FF20241</span>
              <span className="text-forest/40">•</span>
              <span><strong>PAN:</strong> AADTM5474F</span>
              <span className="text-forest/40">•</span>
              <span><strong>NGO Darpan:</strong> OR/2024/0466491</span>
            </div>
            <Link
              href="/statutory-disclosures"
              className="text-terracotta-dark hover:text-forest font-bold inline-flex items-center gap-1 transition-colors"
            >
              <span>View Statutory Vault</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          INSTITUTIONAL INTRODUCTION + VISION & MISSION EDITORIAL OVERVIEW
          ========================================================================= */}
      <section className="py-16 md:py-24 bg-white border-b border-border-warm" aria-label="Organisational Introduction, Vision and Mission">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Editorial Narrative Column */}
            <Reveal direction="left" className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta-dark font-sans block">
                {HOMEPAGE_CONTENT.aboutIntro.eyebrow}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight leading-[1.15]">
                {HOMEPAGE_CONTENT.aboutIntro.heading}
              </h2>
              <p className="text-sm sm:text-base text-ink leading-relaxed font-sans max-w-2xl">
                {HOMEPAGE_CONTENT.aboutIntro.summary}
              </p>
              <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-ink font-sans">
                {HOMEPAGE_CONTENT.aboutIntro.principles.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold font-sans">
                <Link
                  href="/about"
                  className="text-forest hover:text-terracotta-dark inline-flex items-center gap-1 underline decoration-terracotta underline-offset-4"
                >
                  <span>Read About MECT</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/governance"
                  className="text-forest hover:text-terracotta-dark inline-flex items-center gap-1 underline decoration-terracotta underline-offset-4"
                >
                  <span>Governance &amp; Trust Deed</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            {/* Asymmetric Vision & Mission Editorial Stack */}
            <Reveal direction="right" delay={0.08} className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-xs bg-cream/65 border-l-4 border-terracotta border-y border-r border-border-warm space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-terracotta-dark font-sans block">
                  Institutional Vision
                </span>
                <p className="text-xs sm:text-sm text-ink leading-relaxed font-sans">
                  {HOMEPAGE_CONTENT.aboutIntro.vision}
                </p>
              </div>
              <div className="p-6 rounded-xs bg-sage/55 border-l-4 border-forest border-y border-r border-border-warm space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-forest font-sans block">
                  Operational Mission
                </span>
                <p className="text-xs sm:text-sm text-ink leading-relaxed font-sans">
                  {HOMEPAGE_CONTENT.aboutIntro.mission}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          PHASE 3 — FREE EDUCATION FOR 200 STUDENTS
          ========================================================================= */}
      <FreeEducationSection />

      {/* =========================================================================
          SECTION 3 — OUR FIVE DEVELOPMENT SECTORS: Distinct Visual Identities
          ========================================================================= */}
      <section id="programs" className="py-20 md:py-28 bg-white border-b border-border-warm scroll-mt-32">
        <Container size="default" className="space-y-16">
          <SectionHeader
            badge="Multi-Sector Community Development"
            title="Five Documented Areas of Public Charitable Work"
            subtitle="Responding to connected community needs across Odisha. Each initiative is grounded in authentic field records, volunteer action, and zero-intermediary delivery."
            align="center"
          />

          <StaggerGroup staggerDelay={MOTION_STAGGER.cards} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOMEPAGE_CONTENT.pillars.map((pillar) => {
              const IconComponent = PILLAR_ICON_MAP[pillar.number] || Award;
              return (
                <StaggerItem key={pillar.number}>
                  <Card
                    variant="elevated"
                    className="h-full flex flex-col justify-between p-7 border-border-warm hover:border-terracotta transition-all duration-300 bg-cream/35 shadow-xs group"
                  >
                    <div className="space-y-4">
                      {/* Top Bar with Number, Icon and Tag */}
                      <div className="flex items-center justify-between pb-3 border-b border-border-warm">
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-2xl font-bold text-forest">
                            {pillar.number}
                          </span>
                          <div className="w-9 h-9 rounded-xs bg-terracotta text-white flex items-center justify-center shrink-0 shadow-xs border border-terracotta-dark group-hover:scale-105 transition-transform">
                            <IconComponent className="w-4 h-4 text-white" aria-hidden="true" />
                          </div>
                        </div>
                        <Badge variant="contrast-gold" size="sm">
                          {pillar.tag}
                        </Badge>
                      </div>

                      {/* Title and Description */}
                      <h3 className="font-serif text-xl font-bold text-forest group-hover:text-terracotta-dark transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
                        {pillar.description}
                      </p>
                    </div>

                    {/* Bottom Strip with Stat Badge & Link */}
                    <div className="pt-4 mt-4 border-t border-border-warm flex items-center justify-between">
                      <span className="text-[11px] font-bold text-forest bg-sage/75 px-2 py-0.5 rounded-xs border border-border-warm">
                        {pillar.stat || "Verified Activity"}
                      </span>
                      <Link
                        href={pillar.href || "/programmes"}
                        className="text-xs font-bold text-terracotta-dark hover:text-forest inline-flex items-center gap-1 group/link"
                      >
                        <span>Explore Pillar</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
                      </Link>
                    </div>
                  </Card>
                </StaggerItem>
              );
            })}

            {/* Sixth Complementary Card: Higher Education Disbursals */}
            <StaggerItem>
              <Card
                variant="dark"
                className="h-full flex flex-col justify-between p-7 bg-forest border-sand/35 shadow-md hover:-translate-y-0.5 hover:border-sand transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/15">
                    <span className="font-serif text-2xl font-bold text-sand">
                      +
                    </span>
                    <Badge variant="gold-dark" size="sm">
                      Statewide Grants
                    </Badge>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Higher Education Scholarships &amp; Grants
                  </h3>
                  <p className="text-xs sm:text-sm text-cream/90 leading-relaxed font-sans">
                    Direct RTGS bank disbursals to accredited colleges across Odisha covering verified tuition fees for economically underprivileged merit scholars.
                  </p>
                  <div className="p-3 rounded-xs bg-forest-deep border border-sand/35 text-xs text-white space-y-1">
                    <div className="font-semibold text-sand">Direct Institutional Electronic Remittance</div>
                    <p className="text-[11px] text-cream/95">Educational grant assistance is remitted directly to accredited institutional bank accounts via electronic transfer (NEFT/RTGS).</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
                  <Link
                    href="/scholarships"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold bg-sand text-forest-deep hover:bg-cream rounded-xs transition-colors"
                  >
                    <span>Scholarship Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            </StaggerItem>
          </StaggerGroup>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 5 — IMPACT AT A GLANCE: Statutorily Grounded Metrics
          ========================================================================= */}
      <section className="py-20 bg-forest text-white border-b border-terracotta/40">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Verified Impact Overview"
            title="Thirteen Years of Documented Civic Service"
            subtitle="Every metric is derived from registered trust activity records, annual returns, and on-site distribution registers in Balangir, Odisha."
            align="center"
            theme="dark"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 sm:p-7 bg-forest-deep rounded-xs border border-sand/30 text-center space-y-2.5 min-w-0 shadow-sm">
              <CountUpStat value="13+" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white block" />
              <div className="w-8 h-0.5 bg-sand mx-auto" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-sand">Years of Service</p>
              <p className="text-[11px] text-cream/90 leading-relaxed">Established by Registered Trust Deed in 2013 (Balangir)</p>
            </div>
            <div className="p-5 sm:p-7 bg-forest-deep rounded-xs border border-sand/30 text-center space-y-2.5 min-w-0 shadow-sm">
              <CountUpStat value="350+" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white block" />
              <div className="w-8 h-0.5 bg-sand mx-auto" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-sand">Students Coached</p>
              <p className="text-[11px] text-cream/90 leading-relaxed">Annual free remedial tuition &amp; books in Balangir &amp; Puintala</p>
            </div>
            <div className="p-5 sm:p-7 bg-forest-deep rounded-xs border border-sand/30 text-center space-y-2.5 min-w-0 shadow-sm">
              <CountUpStat value="120+" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white block" />
              <div className="w-8 h-0.5 bg-sand mx-auto" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-sand">Women Skilled</p>
              <p className="text-[11px] text-cream/90 leading-relaxed">Certified vocational tailoring &amp; livelihood machine tooling</p>
            </div>
            <div className="p-5 sm:p-7 bg-forest-deep rounded-xs border border-sand/30 text-center space-y-2.5 min-w-0 shadow-sm">
              <CountUpStat value="10,000+" className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white block" />
              <div className="w-8 h-0.5 bg-sand mx-auto" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-sand">Citizens Served</p>
              <p className="text-[11px] text-cream/90 leading-relaxed">Jal Seva drinking water kiosks during 45°C summer heatwaves</p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-center">
            <Link href="/impact">
              <Button variant="gold" size="md" className="font-bold">
                <span>View Full Impact Ledger &amp; Audits</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="dark-outline" size="md">
                <span>Download Annual Audit Reports</span>
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 6 — HOW MECT WORKS: Four-Step Operational Delivery Model
          ========================================================================= */}
      <section className="py-20 md:py-28 bg-cream border-b border-border-warm">
        <Container size="default" className="space-y-16">
          <SectionHeader
            badge="Operating Philosophy"
            title="How MECT Works: Transparent &amp; Direct Delivery"
            subtitle="Bridging gaps with integrity. Our operational model ensures that community contributions translate into tangible, verifiable grassroots results."
            align="center"
          />

          <StaggerGroup staggerDelay={MOTION_STAGGER.steps} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOMEPAGE_CONTENT.howWeWork?.map((item, idx) => {
              const IconComp = HOW_WE_WORK_ICON_MAP[item.iconName] || Users;
              return (
                <StaggerItem key={idx} direction="left">
                  <div className="h-full p-6 rounded-xs bg-white border border-border-warm space-y-3 flex flex-col justify-between shadow-xs hover:border-terracotta/50 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-2xl font-bold text-forest">
                          {item.step}
                        </span>
                        <div className="w-8 h-8 rounded-xs bg-terracotta text-white flex items-center justify-center">
                          <IconComp className="w-4 h-4 text-white" aria-hidden="true" />
                        </div>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-forest">
                        {item.title}
                      </h3>
                      <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 7 — SCHOLARSHIP SUITE: Scheme Explorer, Calculator & Disbursal
          ========================================================================= */}
      <section className="py-12 bg-sand-light border-b border-border-warm">
        <Container size="default" className="space-y-8">
          <SectionHeader
            badge="Higher Education Empowerment"
            title="Scholarship Discovery &amp; Direct College Disbursal"
            subtitle="Explore accredited scholarship schemes, evaluate indicative eligibility criteria, and inspect our direct institutional bank remittance flowchart."
            align="center"
          />

          <div className="flex justify-center gap-3">
            <Link href="/scholarships/apply">
              <Button variant="primary" size="sm" className="font-bold">
                <span>Apply for Scholarship</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/scholarships/track">
              <Button variant="outline" size="sm" className="bg-white">
                <span>Track Existing Application</span>
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 7A. SCHEME EXPLORER */}
      <SchemeExplorer />

      {/* 7B. INTERACTIVE ELIGIBILITY CALCULATOR */}
      <EligibilityCalculator />

      {/* 7C. TRANSPARENCY: DIRECT DISBURSAL STANDARD */}
      <DirectDisbursalFlowchart />

      {/* =========================================================================
          SECTION 8 (PHASE 6) — CSR REGISTRATION & ORGANISATIONAL DETAILS
          ========================================================================= */}
      <CsrRegistrationSection />

      {/* =========================================================================
          SECTION 9 — MANAGING TRUSTEE MESSAGE & FIDUCIARY CHARTER
          ========================================================================= */}
      <section className="py-20 bg-cream border-b border-border-warm">
        <Container size="default">
          <Reveal direction="fade" tone="slow">
            <div className="bg-terracotta text-white rounded-xs p-8 sm:p-12 relative overflow-hidden border border-terracotta-dark shadow-xl">
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-forest border border-sand/35 text-[10px] uppercase font-bold tracking-widest text-cream">
                  <Landmark className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
                  <span>{HOMEPAGE_CONTENT.secretariat.badge}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {HOMEPAGE_CONTENT.secretariat.quote}
                </h3>

                <p className="text-xs sm:text-sm text-white leading-relaxed font-sans">
                  {HOMEPAGE_CONTENT.secretariat.paragraph}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-white">
                  <span className="flex items-center gap-1.5 font-serif font-bold">
                    <ShieldCheck className="w-4 h-4 text-sand" aria-hidden="true" />
                    Honorary Board of Trustees
                  </span>
                  <span className="text-white/55" aria-hidden="true">•</span>
                  <span>Registered Office: Balangir</span>
                  <span className="text-white/55" aria-hidden="true">•</span>
                  <span>Corporate Secretariat: Bhubaneswar</span>
                  <span className="text-white/55" aria-hidden="true">•</span>
                  <span>Indian Trusts Act, 1882</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-forest rounded-xs border border-sand/40 text-center space-y-3.5 shadow-md">
                <div className="w-14 h-14 rounded-xs bg-terracotta border-2 border-sand flex items-center justify-center text-white shadow-inner font-serif font-bold text-xl">
                  JK
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-white">
                    {HOMEPAGE_CONTENT.secretariat.officeTitle}
                  </h4>
                  <p className="text-[11px] text-sand font-semibold">
                    {HOMEPAGE_CONTENT.secretariat.officeSubtitle}
                  </p>
                </div>
                <p className="text-[10px] text-cream/90 italic leading-snug">
                  {HOMEPAGE_CONTENT.secretariat.statutoryNote}
                </p>
                <div className="w-full pt-1">
                  <Link
                    href="/governance"
                    className="inline-flex items-center justify-center w-full min-h-[36px] px-3.5 py-1.5 text-xs font-semibold tracking-tight rounded-xs bg-sand text-forest-deep hover:bg-cream border border-terracotta/40 hover:border-terracotta shadow-xs hover:shadow-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
                  >
                    View Fiduciary Charter
                  </Link>
                </div>
              </div>
            </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 10 — VOLUNTEER & COMMUNITY PARTICIPATION REGISTRY
          ========================================================================= */}
      <section id="participate" className="py-20 md:py-28 bg-white border-b border-border-warm scroll-mt-32">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="forest">Civic Mentorship &amp; Volunteering</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-[1.15]">
                Join the Cause as a Mentor, Volunteer, or Institutional Partner.
              </h2>
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
                Mahaveer Educational &amp; Charitable Trust (MECT) welcomes academicians, working professionals, alumni, and college faculties who share our dedication to educational access, women&apos;s livelihoods, and community welfare in Odisha.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-cream text-terracotta-dark flex items-center justify-center shrink-0 border border-border-warm">
                    <Users className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-forest">
                      Academic &amp; Professional Mentors
                    </h3>
                    <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed font-sans">
                      Dedicate 2 hours monthly to guide secondary and undergraduate students in your discipline with entrance exams or career paths.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-cream text-terracotta-dark flex items-center justify-center shrink-0 border border-border-warm">
                    <Scissors className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-forest">
                      Vocational &amp; Livelihood Instructors
                    </h3>
                    <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed font-sans">
                      Share technical guidance in garment tailoring, apparel fabrication, and micro-enterprise management for rural women.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-cream text-terracotta-dark flex items-center justify-center shrink-0 border border-border-warm">
                    <Droplets className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-forest">
                      Community Relief &amp; Jal Seva Volunteers
                    </h3>
                    <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed font-sans">
                      Assist on-site during summer drinking water distribution camps, hospital meal drives, and emergency welfare efforts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Volunteer Form */}
            <div className="lg:col-span-6 bg-cream/40 p-8 sm:p-10 rounded-xs border border-border-warm shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-forest mb-1">
                Volunteer &amp; Mentor Registry
              </h3>
              <p className="text-xs text-ink-sand mb-6 font-sans">
                Submit your academic or professional background to connect with our Secretariat Coordinator.
              </p>

              {volSubmitted ? (
                <Reveal direction="fade" tone="fast" className="p-6 bg-forest text-white rounded-xs space-y-3 text-center">
                  <CheckCircle2 className="w-10 h-10 text-sand mx-auto" aria-hidden="true" />
                  <h4 className="font-serif text-xl font-bold">
                    Registration Recorded
                  </h4>
                  {volReferenceId && (
                    <p className="text-xs font-mono text-cream bg-forest-deep py-1 px-3 rounded inline-block">
                      Volunteer Registry Ref: #{volReferenceId}
                    </p>
                  )}
                  <p className="text-xs text-cream leading-relaxed font-sans">
                    Thank you for your willingness to guide and support Odisha’s communities. The Secretariat team will review your profile and reach out via email.
                  </p>
                  <Button
                    variant="dark-outline"
                    className="mt-3 text-xs"
                    onClick={() => {
                      setVolSubmitted(false);
                      setVolConsent(false);
                      setVolData({
                        name: "",
                        email: "",
                        phone: "",
                        district: "Balangir",
                        qualification: "",
                        role: "Academic & Career Mentorship",
                        notes: "",
                      });
                    }}
                  >
                    Register Another Volunteer
                  </Button>
                </Reveal>
              ) : (
                <form onSubmit={handleVolSubmit} className="space-y-4">
                  {volError && (
                    <div
                      className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs text-xs flex items-start gap-2"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{volError}</span>
                    </div>
                  )}

                  <Input
                    id="vol-fullname"
                    label="Full Name *"
                    required
                    value={volData.name}
                    onChange={(e) => setVolData({ ...volData, name: e.target.value })}
                    placeholder="e.g. Prof. Sandeep Jena"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Input
                      id="vol-email"
                      type="email"
                      label="Email Address *"
                      required
                      value={volData.email}
                      onChange={(e) => setVolData({ ...volData, email: e.target.value })}
                      placeholder="sandeep@example.com"
                    />
                    <Input
                      id="vol-phone"
                      type="tel"
                      label="Phone Number *"
                      required
                      value={volData.phone}
                      onChange={(e) => setVolData({ ...volData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Select
                      id="vol-district"
                      label="Home District (Odisha) *"
                      value={volData.district}
                      onChange={(e) => setVolData({ ...volData, district: e.target.value })}
                      options={ODISHA_DISTRICTS_LIST.map((d) => ({ value: d, label: d }))}
                    />
                    <Input
                      id="vol-qualification"
                      label="Highest Qualification"
                      value={volData.qualification}
                      onChange={(e) => setVolData({ ...volData, qualification: e.target.value })}
                      placeholder="e.g. M.Tech, Ph.D, B.Ed"
                    />
                  </div>

                  <Select
                    id="vol-role"
                    label="Area of Participation *"
                    value={volData.role}
                    onChange={(e) => setVolData({ ...volData, role: e.target.value })}
                    options={[
                      {
                        value: "Academic & Career Mentorship",
                        label: "Academic & Career Mentorship",
                      },
                      {
                        value: "Women Livelihood & Vocational Training",
                        label: "Women Livelihood & Tailoring Instruction",
                      },
                      {
                        value: "Jal Seva & Community Relief",
                        label: "Safe Water & Community Relief Volunteering",
                      },
                      {
                        value: "College Institutional Partnership",
                        label: "College / University Institutional Liaison",
                      },
                    ]}
                  />

                  <Textarea
                    id="vol-notes"
                    label="Academic & Professional Background"
                    rows={3}
                    value={volData.notes}
                    onChange={(e) => setVolData({ ...volData, notes: e.target.value })}
                    placeholder="Share your university affiliation, corporate background, or subject expertise..."
                  />

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      id="vol-consent-homepage"
                      type="checkbox"
                      required
                      checked={volConsent}
                      onChange={(e) => setVolConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded-xs border-terracotta/40 text-terracotta focus:ring-terracotta"
                    />
                    <label
                      htmlFor="vol-consent-homepage"
                      className="text-[11px] text-ink-sand leading-tight select-none font-sans"
                    >
                      I voluntarily declare my intent to participate in academic mentorship or community volunteering in accordance with safeguarding and ethical conduct guidelines. For comprehensive tracks, review our{" "}
                      <Link
                        href="/volunteer"
                        className="text-terracotta-dark font-semibold underline hover:text-forest"
                      >
                        Volunteer Portal
                      </Link>.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={volIsSubmitting}
                    className="w-full justify-center shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                    <span>Submit Volunteer Registration</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 11 (PHASE 5) — SBI DONATION SECTION & TAX DEDUCTION ESTIMATOR
          ========================================================================= */}
      <section id="donate" className="py-20 bg-terracotta text-white border-b border-terracotta-dark scroll-mt-32">
        <Container size="default" className="space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge variant="gold-dark">
              Direct Institutional Banking • State Bank of India
            </Badge>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              SUPPORT OUR MISSION — DONATE NOW
            </h2>
            <p className="text-sm sm:text-base text-white leading-relaxed font-sans">
              Your contribution directly sustains Free Education for 200 Students alongside MECT&apos;s documented work in women&apos;s livelihoods, safe drinking water, and community nutrition across Odisha.
            </p>
          </div>

          {/* Official State Bank of India Donation Card & Prepared QR Integration Area */}
          <div className="max-w-5xl mx-auto">
            <SbiDonationSection />
          </div>

          {/* Interactive Section 80G / Section 133 Tax Deduction Estimator (gated behind COMPLIANCE.showTaxEstimator) */}
          <div className="max-w-5xl mx-auto bg-white text-ink p-6 sm:p-10 rounded-xs border-2 border-sand shadow-2xl space-y-6">
            {COMPLIANCE.showTaxEstimator && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-warm gap-2">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-terracotta-dark" aria-hidden="true" />
                <span className="font-serif text-xl font-bold text-forest">
                  Section 133 / Section 80G Tax Deduction Estimator (Illustrative Model)
                </span>
              </div>
              <span className="text-xs text-forest font-semibold font-sans tabular-nums">
                Documented Order: AY 2024-25 to AY 2026-27 • URN: {TRUST_CONFIG.statutory.section80GUrn}
              </span>
            </div>

            {/* Statutory Status Disclosure Banner for Tax Year 2026-27 */}
            <div className="p-4 rounded-xs bg-sand-light border-l-4 border-terracotta text-xs text-ink font-sans space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                <span className="font-bold uppercase tracking-wider text-[11px] text-forest">
                  Statutory Status Disclosure • Tax Year 2026-27 / AY 2027-28
                </span>
              </div>
              <p className="text-[11px] text-ink leading-relaxed">
                MECT holds documented historical approval under legacy Section 80G(5)(vi) of the Income-tax Act, 1961 (Order URN: <strong>{TRUST_CONFIG.statutory.section80GUrn}</strong>, DIN: <strong>{TRUST_CONFIG.statutory.section80GDin}</strong>, Order Date: 29-01-2024) covering donations made in Financial Years 2023-24 through 2025-26 (Assessment Years 2024-25 through 2026-27). The historical approval does not automatically cover donations in the current <strong>Tax Year 2026-27</strong> (commenced 1 April 2026 / AY 2027-28). Under the Income-tax Act, 2025, Section 354 governs applications (Form 105) and formal examination orders (Form 107) for eligible donations, read with Section 536 repeal, savings and transition provisions. <strong>Current approval for Tax Year 2026-27 has not yet been established from the documentary records reviewed.</strong> This tool illustrates statutory deduction mechanics under Section 133 / legacy Section 80G for eligible donors filing under the Old Tax Regime and does not represent a guaranteed current tax benefit for MECT.
              </p>
            </div>

            {/* Tax Regime Selector & Advisory */}
            <div className="p-4 rounded-xs bg-cream/65 border border-border-warm space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-forest uppercase tracking-wider font-sans">
                  Select Your Tax Filing Regime:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTaxRegime("old")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xs border transition-all ${
                      taxRegime === "old"
                        ? "bg-forest text-white border-terracotta"
                        : "bg-white text-ink border-border-warm hover:border-terracotta"
                    }`}
                  >
                    Old Tax Regime (Section 133 / 80G Eligible)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxRegime("new")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xs border transition-all ${
                      taxRegime === "new"
                        ? "bg-forest text-white border-terracotta"
                        : "bg-white text-ink border-border-warm hover:border-terracotta"
                    }`}
                  >
                    Section 202 Simplified Regime (New Regime Default)
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-ink font-sans leading-normal">
                {taxRegime === "old"
                  ? "✓ Donors opting for the Old Tax Regime can claim up to 50% deduction of eligible contributions from gross total income, subject to the 10% Adjusted Gross Total Income (AGTI) cap."
                  : "⚠ Under the default Section 202 Simplified Tax Regime (legacy Section 115BAC), individual taxpayers cannot claim Chapter VI-A / Part D deductions, including Section 133 / Section 80G. Tax offset is ₹0."}
              </p>
            </div>

            {/* Quick Amount Selector */}
            <div>
              <span className="text-xs uppercase font-bold text-forest tracking-wider block mb-2 font-sans">
                Select or Enter Contribution Amount (₹ INR):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[2500, 5000, 10000, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDonationAmount(amt)}
                    className={`py-2.5 px-3 rounded-xs text-xs font-bold border transition-all ${
                      donationAmount === amt
                        ? "bg-forest text-white border-terracotta shadow-xs"
                        : "bg-cream text-forest border-border-warm hover:border-terracotta"
                    }`}
                  >
                    ₹{amt.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input & Tax Bracket */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="home-tax-amount" className="text-xs font-bold text-forest block mb-1 font-sans">
                  Custom Contribution Amount (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-terracotta-dark">
                    ₹
                  </span>
                  <input
                    id="home-tax-amount"
                    type="number"
                    min="500"
                    step="500"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-2 rounded-xs border border-border-warm text-sm font-bold text-forest focus:border-terracotta focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="home-tax-bracket" className="text-xs font-bold text-forest block mb-1 font-sans">
                  Applicable Marginal Tax Bracket ({taxRegime === "old" ? "Old Regime" : "New Regime Disabled"}):
                </label>
                <select
                  id="home-tax-bracket"
                  value={taxBracket}
                  disabled={taxRegime === "new"}
                  onChange={(e) => setTaxBracket(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xs border border-border-warm text-xs font-semibold text-forest focus:border-terracotta focus:outline-none bg-white disabled:bg-sage/40 disabled:text-ink-secondary"
                >
                  <option value={0.3}>30% Slab (Highest Marginal Bracket)</option>
                  <option value={0.2}>20% Slab (Middle Marginal Bracket)</option>
                  <option value={0.1}>10% Slab (Lower Marginal Bracket)</option>
                  <option value={0.05}>5% Slab (Entry Bracket)</option>
                </select>
              </div>
            </div>

            {/* Live Calculation Strip */}
            <div className="p-5 rounded-xs bg-forest text-white border border-sand/40 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-forest-deep rounded-xs border border-white/15 space-y-0.5">
                  <span className="text-[10px] text-cream/90 font-sans block">1. Your Contribution</span>
                  <span className="text-xl font-serif font-bold text-white tabular-nums">
                    ₹{donationAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] text-cream/85 block">Direct bank remittance</span>
                </div>
                <div className="p-3 bg-forest-deep rounded-xs border border-white/15 space-y-0.5">
                  <span className="text-[10px] text-sand font-sans block">
                    {taxRegime === "old" ? "2. Indicative Deduction (50%)" : "Deduction (Section 202)"}
                  </span>
                  <span className="text-xl font-serif font-bold text-cream tabular-nums">
                    {taxRegime === "old" ? `₹${eligibleDeduction.toLocaleString("en-IN")}` : "₹0"}
                  </span>
                  <span className="text-[9px] text-cream/85 block">Reduces taxable income (not cash refund)</span>
                </div>
                <div className="p-3 bg-terracotta rounded-xs border border-sand/50 space-y-0.5">
                  <span className="text-[10px] text-white font-sans block">
                    {taxRegime === "old" ? "3. Potential Tax Offset*" : "Tax Offset (New Regime)"}
                  </span>
                  <span className="text-xl font-serif font-bold text-white tabular-nums">
                    {taxRegime === "old" ? `₹${Math.round(estimatedTaxSaved).toLocaleString("en-IN")}*` : "₹0"}
                  </span>
                  <span className="text-[9px] text-white/95 block">Illustrative; contingent on donee approval</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 flex items-start gap-2.5 text-xs text-cream font-sans">
                <CheckCircle2 className="w-4 h-4 text-sand shrink-0 mt-0.5" />
                <div>
                  <strong>Tangible Ground Impact:</strong> {getImpactDescription(donationAmount)}
                </div>
              </div>

              {/* Statutory Footnote & Disclaimers */}
              <div className="pt-3 border-t border-white/15 text-[11px] text-cream/90 space-y-1 font-sans">
                <p>
                  *<strong>Statutory Notes &amp; Assumptions under Section 133 / Section 80G:</strong>
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-cream/85">
                  <li>
                    <strong>Documentary Approval Status:</strong> MECT holds documented approval under legacy Section 80G(5)(vi) of the Income-tax Act, 1961 (Order URN: {TRUST_CONFIG.statutory.section80GUrn}, DIN: {TRUST_CONFIG.statutory.section80GDin}, Order Date: 29-01-2024) covering donations made in FY 2023-24 through FY 2025-26 (Assessment Years 2024-25 through 2026-27). The historical approval does not automatically cover donations in the current Tax Year 2026-27 (commenced 1 April 2026 / AY 2027-28). Under the Income-tax Act, 2025, applications and approvals for eligible donations are governed by Section 354 (via Form 105 application and Form 107 formal examination order) read with Section 536 repeal, savings and transition provisions. Current approval for Tax Year 2026-27 has not yet been established from the documentary records reviewed.
                  </li>
                  <li>
                    <strong>Deduction vs. Cash Savings:</strong> A tax deduction reduces gross taxable income; it does not return cash or provide a rebate. Actual tax offset equals the deductible amount multiplied by your marginal tax slab (plus applicable 4% Health &amp; Education Cess).
                  </li>
                  <li>
                    <strong>Qualifying Ceiling:</strong> Under Section 133 / Section 80G(4), aggregate deductions for charitable contributions are capped at 10% of the donor&apos;s Adjusted Gross Total Income (AGTI).
                  </li>
                  <li>
                    <strong>Digital Payment Mode Mandate:</strong> Cash contributions exceeding ₹2,000 are disqualified from tax exemption under Section 133 / Section 80G(5D). Contributions must be transferred via digital or banking channels.
                  </li>
                  <li>
                    <strong>Reporting &amp; Certificates:</strong> Official donation certificates and statutory reporting are issued in accordance with applicable tax rules; donors must furnish valid PAN and residential address. Note that under the simplified tax regime, charitable deductions are not available.
                  </li>
                  <li>
                    <strong>Non-Advisory Disclaimer:</strong> This calculator is an illustrative educational model and does not constitute formal legal, accounting or tax advice. Donors should consult a certified Chartered Accountant to determine their personal tax liabilities.
                  </li>
                </ul>
              </div>
            </div>
              </>
            )}

            {/* Section 80G Statutory & Direct Bank Transfer Notice Box */}
            <div className="p-5 rounded-xs bg-cream/65 border border-border-warm text-left space-y-3">
              <div className="flex items-center gap-2 text-forest text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-terracotta-dark" aria-hidden="true" />
                <span>{HOMEPAGE_CONTENT.donorNotice.title}</span>
              </div>
              <p className="text-xs text-ink leading-relaxed font-sans">
                {HOMEPAGE_CONTENT.donorNotice.description}
              </p>

              <div className="pt-2 border-t border-border-warm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans text-ink">
                <div>
                  <span className="text-terracotta-dark block text-[10px] font-semibold">Bank:</span>
                  <span className="font-semibold">{TRUST_CONFIG.bank.bankName}</span>
                </div>
                <div>
                  <span className="text-terracotta-dark block text-[10px] font-semibold">IFSC Code:</span>
                  <span className="font-mono font-bold text-forest">{TRUST_CONFIG.bank.ifsc}</span>
                </div>
                <div>
                  <span className="text-terracotta-dark block text-[10px] font-semibold">Account No:</span>
                  <span className="font-mono font-bold text-forest">{TRUST_CONFIG.bank.accountNumber}</span>
                </div>
                <div>
                  <span className="text-terracotta-dark block text-[10px] font-semibold">Trust PAN:</span>
                  <span className="font-mono font-bold text-forest text-[11px]">{TRUST_CONFIG.statutory.pan}</span>
                </div>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="pt-2 flex flex-wrap justify-center gap-3.5">
              <Link href="/donate">
                <Button variant="primary" size="lg" className="shadow-lg font-bold">
                  <Heart className="w-4 h-4 mr-2 fill-current" aria-hidden="true" />
                  <span>DONATE NOW</span>
                </Button>
              </Link>
              <Link href="/statutory-disclosures">
                <Button variant="outline" size="lg" className="font-semibold bg-white">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-terracotta-dark" aria-hidden="true" />
                  <span>Verify Statutory Vault</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 12 — PUBLIC SECRETARIAT INQUIRY & GUIDANCE DESK
          ========================================================================= */}
      <section id="contact-desk" className="py-20 md:py-28 bg-cream border-b border-border-warm scroll-mt-32">
        <Container size="default">
          <SectionHeader
            badge="Direct Public Access"
            title="Secretariat Inquiry &amp; Scholar Guidance Desk"
            subtitle="Connect directly with our administration regarding scholarship schemes, eligibility documentation, or institutional affiliations."
            align="center"
            className="mb-12"
          />

          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xs border-2 border-border-warm shadow-lg">
            {inquirySubmitted ? (
              <Reveal direction="fade" tone="fast" className="p-8 bg-forest text-white rounded-xs space-y-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-sand mx-auto" aria-hidden="true" />
                <h3 className="font-serif text-2xl font-bold">
                  Inquiry Successfully Registered
                </h3>
                {inquiryReferenceId && (
                  <p className="text-sm font-mono text-cream bg-forest-deep py-1.5 px-4 rounded inline-block">
                    Secretariat Registry Ref: #{inquiryReferenceId}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-cream leading-relaxed max-w-md mx-auto font-sans">
                  Thank you for reaching out to Mahaveer Educational &amp; Charitable Trust (MECT). Our Secretariat Coordinator has logged your query and will review your submission accordingly.
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setInquirySubmitted(false);
                    setInquiryData({
                      name: "",
                      email: "",
                      phone: "",
                      district: "Balangir",
                      category: "Scholarship Guidance",
                      message: "",
                    });
                  }}
                  className="mt-2"
                >
                  Submit Another Inquiry
                </Button>
              </Reveal>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {inquiryError && (
                  <div
                    className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs text-xs flex items-start gap-2"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{inquiryError}</span>
                  </div>
                )}

                <Input
                  id="inquiry-name"
                  label="Candidate / Guardian Full Name *"
                  required
                  value={inquiryData.name}
                  onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                  placeholder="e.g. Subhashree Mohanty"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    id="inquiry-email"
                    type="email"
                    label="Email Address *"
                    required
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                    placeholder="subhashree@example.com"
                  />
                  <Input
                    id="inquiry-phone"
                    type="tel"
                    label="Phone Number *"
                    required
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Select
                    id="inquiry-district"
                    label="Home District (Odisha) *"
                    value={inquiryData.district}
                    onChange={(e) => setInquiryData({ ...inquiryData, district: e.target.value })}
                    options={ODISHA_DISTRICTS_LIST.map((d) => ({ value: d, label: d }))}
                  />
                  <Select
                    id="inquiry-category"
                    label="Inquiry Category *"
                    value={inquiryData.category}
                    onChange={(e) => setInquiryData({ ...inquiryData, category: e.target.value })}
                    options={[
                      {
                        value: "Scholarship Guidance",
                        label: "Scholarship Scheme Guidance",
                      },
                      {
                        value: "Eligibility & Document Appraisal",
                        label: "Eligibility & Document Appraisal",
                      },
                      {
                        value: "College Institutional Partnership",
                        label: "College / University Institutional Partnership",
                      },
                      {
                        value: "Corporate CSR & Philanthropy",
                        label: "Corporate CSR & Philanthropy",
                      },
                    ]}
                  />
                </div>

                <Textarea
                  id="inquiry-message"
                  label="Inquiry Details / Specific Questions"
                  rows={3}
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                  placeholder="Provide details on your current college enrollment, course stream, or specific queries..."
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={inquiryIsSubmitting}
                  className="w-full justify-center shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  <span>Transmit Official Inquiry</span>
                </Button>

                <p className="text-[11px] text-ink-secondary text-center italic font-sans">
                  Zero processing fees. Protected by institutional security standards and rate limiting.
                </p>
              </form>
            )}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          SECTION 13 — FINAL INSTITUTIONAL CALL TO ACTION
          ========================================================================= */}
      <section className="py-20 md:py-28 bg-sand-light text-ink border-t border-border-warm relative overflow-hidden">
        <Container size="default">
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10 bg-white border border-border-warm rounded-xs p-8 sm:p-12 shadow-sm">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-forest tracking-tight leading-tight">
              Participate in Sustainable Community Transformation Across Odisha.
            </h2>

            <p className="text-sm sm:text-base text-ink leading-relaxed font-sans max-w-2xl mx-auto">
              Whether you are an institutional CSR partner, a volunteer educator, or a donor seeking 80G tax deductions, your engagement directly supports rural education, women&apos;s livelihoods, clean water, and community relief.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
              <Link href="/programmes">
                <Button variant="gold" size="lg" className="font-bold shadow-sm">
                  <span>Explore All 5 Sectors</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/donate">
                <Button variant="primary" size="lg" className="font-semibold">
                  <Heart className="w-4 h-4 mr-1.5 fill-current" aria-hidden="true" />
                  <span>DONATE NOW</span>
                </Button>
              </Link>
              <Link href="/volunteer">
                <Button variant="outline" size="lg" className="font-semibold bg-white">
                  <Users className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  <span>Join as Volunteer</span>
                </Button>
              </Link>
              <Link href="/csr-partnerships">
                <Button variant="outline" size="lg" className="font-semibold bg-white">
                  <Briefcase className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  <span>CSR Partnerships</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
