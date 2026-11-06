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
import { InstitutionalMarquee } from "@/components/InstitutionalMarquee";
import { SchemeExplorer } from "@/components/SchemeExplorer";
import { EligibilityCalculator } from "@/components/EligibilityCalculator";
import { DirectDisbursalFlowchart } from "@/components/DirectDisbursalFlowchart";
import { HOMEPAGE_CONTENT } from "@/lib/homepage-content";
import { TRUST_CONFIG } from "@/lib/config";
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

const ENABLEMENT_ICON_MAP = {
  Users,
  BookOpen,
  Compass,
  HeartHandshake,
};

const PILLAR_ICON_MAP: Record<string, React.ElementType> = {
  "01": GraduationCap,
  "02": Scissors,
  "03": Droplets,
  "04": Utensils,
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

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION: Institutional Prestige & Factual 12-Year Mission */}
      <section className="relative overflow-hidden bg-[#0A192F] text-[#EDE6D8] pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#C5A059]/30 transition-colors">
        {/* Subtle geometric grid background */}
        <div
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1E3A8A]/30 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <Container size="default">
          <div className="max-w-4xl mx-auto text-center space-y-7">
            {/* Mission & Verification Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant="gold-dark"
                size="md"
                icon={<Sparkles className="w-3.5 h-3.5 text-[#C5A059]" aria-hidden="true" />}
              >
                {HOMEPAGE_CONTENT.hero.badge}
              </Badge>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-[#15803D]/20 text-[#86EFAC] text-xs font-semibold border border-[#15803D]/40">
                <ShieldCheck className="w-3.5 h-3.5 text-[#86EFAC]" aria-hidden="true" />
                <span>80G Tax Exempt (50% Deduction)</span>
              </span>
            </div>

            {/* Grand Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
              {HOMEPAGE_CONTENT.hero.headline}
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-white/85 leading-relaxed font-sans max-w-3xl mx-auto">
              {HOMEPAGE_CONTENT.hero.subtext}
            </p>

            {/* Structured Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
              <Link href={HOMEPAGE_CONTENT.hero.ctas.primary.href}>
                <Button variant="gold" size="lg" className="shadow-lg font-bold">
                  <Heart className="w-4 h-4 mr-1.5 fill-current" aria-hidden="true" />
                  <span>{HOMEPAGE_CONTENT.hero.ctas.primary.text}</span>
                </Button>
              </Link>
              <Link href={HOMEPAGE_CONTENT.hero.ctas.csr.href}>
                <Button variant="dark-outline" size="lg" className="font-semibold !border-[#C5A059]/60 !text-[#E4C88A] hover:!bg-[#C5A059]/10">
                  <Briefcase className="w-4 h-4 mr-1.5 text-[#E4C88A]" aria-hidden="true" />
                  <span>{HOMEPAGE_CONTENT.hero.ctas.csr.text}</span>
                </Button>
              </Link>
              <Link href={HOMEPAGE_CONTENT.hero.ctas.secondary.href}>
                <Button variant="dark-outline" size="lg" className="font-semibold">
                  <Award className="w-4 h-4 mr-1.5 text-[#E4C88A]" aria-hidden="true" />
                  <span>{HOMEPAGE_CONTENT.hero.ctas.secondary.text}</span>
                </Button>
              </Link>
            </div>

            {/* Quiet Governance Link & Notice */}
            <div className="pt-2 space-y-1">
              <p className="text-xs text-white/75 font-sans">
                Operating under registered Trust Deed (2013, Balangir Doc No. 40311302194). Review our{" "}
                <Link
                  href={HOMEPAGE_CONTENT.hero.ctas.governance.href}
                  className="text-[#E4C88A] underline hover:text-white transition-colors font-medium"
                >
                  Fiduciary Charter &amp; Governance Code
                </Link>
                .
              </p>
              <p className="text-[11px] text-white/55">
                {HOMEPAGE_CONTENT.hero.notice}
              </p>
            </div>
          </div>

          {/* Statutorily Grounded Metric Cards */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {HOMEPAGE_CONTENT.hero.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="space-y-1 border-r border-white/10 last:border-r-0 pr-4 last:pr-0"
              >
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#E4C88A]">
                  {metric.value}
                </span>
                <p className="text-xs uppercase font-bold tracking-wider text-white/90 font-sans">
                  {metric.label}
                </p>
                <p className="text-[11px] text-white/60 font-sans">
                  {metric.subtext}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. INSTITUTIONAL ACCREDITATION MARQUEE */}
      <InstitutionalMarquee />

      {/* 3. FOUR CORE MISSION PILLARS */}
      <section id="programs" className="py-20 md:py-28 bg-[#FDFBF7]">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <Badge variant="forest">Grassroots Impact &amp; Purpose</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight leading-snug">
                12 Years of Ground-Level Transformation Across Odisha.
              </h2>
              <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
                Mahaveer Educational &amp; Charitable Trust was conceived in 2013 to advance educational access and community self-reliance. Over the past decade, our operations have bridged higher secondary dropout gaps for rural youth, equipped women with tailoring machines and trade certificates, and provided emergency water and food relief.
              </p>
              <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
                Every programme operates under a transparent, auditable zero-cash policy with 100% direct disbursals and honorary non-remunerative trustee stewardship.
              </p>

              <div className="pt-2 flex flex-wrap gap-3.5">
                <Link href="/about">
                  <Button variant="secondary" size="md">
                    <span>12-Year Heritage</span>
                    <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/statutory-disclosures">
                  <Button variant="outline" size="md">
                    <ShieldCheck className="w-4 h-4 mr-1 text-[#C5A059]" aria-hidden="true" />
                    <span>Statutory Vault</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Pillars Grid (4 Core Pillars) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {HOMEPAGE_CONTENT.pillars.map((pillar) => {
                const IconComponent = PILLAR_ICON_MAP[pillar.number] || Award;
                return (
                  <Card
                    key={pillar.number}
                    variant="elevated"
                    className="space-y-3 p-6 border-[#0A192F]/12 hover:border-[#C5A059] transition-all duration-300 bg-white shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xs bg-[#0A192F]/5 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                        <IconComponent className="w-5 h-5 text-[#C5A059]" aria-hidden="true" />
                      </div>
                      <Badge variant="contrast-gold" size="sm">
                        {pillar.tag}
                      </Badge>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                      {pillar.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 4. SCHEME EXPLORER */}
      <SchemeExplorer />

      {/* 5. INTERACTIVE ELIGIBILITY CALCULATOR */}
      <EligibilityCalculator />

      {/* 6. TRANSPARENCY: DIRECT DISBURSAL STANDARD */}
      <DirectDisbursalFlowchart />

      {/* 7. FROM THE MANAGING TRUSTEE'S DESK */}
      <section className="py-20 bg-[#F4EFE6] border-b border-[#0A192F]/10">
        <Container size="default">
          <div className="bg-[#0A192F] text-white rounded-xs p-8 sm:p-12 relative overflow-hidden border border-[#C5A059]/40 shadow-xl">
            {/* Ambient gold glow */}
            <div
              className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[#0F172A] border border-[#C5A059]/30 text-[10px] uppercase font-bold tracking-widest text-[#E4C88A]">
                  <Landmark className="w-3.5 h-3.5 text-[#C5A059]" aria-hidden="true" />
                  <span>{HOMEPAGE_CONTENT.secretariat.badge}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {HOMEPAGE_CONTENT.secretariat.quote}
                </h3>

                <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-sans">
                  {HOMEPAGE_CONTENT.secretariat.paragraph}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#E4C88A]">
                  <span className="flex items-center gap-1.5 font-serif font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                    Honorary Board of Trustees
                  </span>
                  <span className="text-white/40" aria-hidden="true">•</span>
                  <span>Registered Office: Balangir</span>
                  <span className="text-white/40" aria-hidden="true">•</span>
                  <span>Corporate Secretariat: Bhubaneswar</span>
                  <span className="text-white/40" aria-hidden="true">•</span>
                  <span>Indian Trusts Act, 1882</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#0F172A] rounded-xs border border-[#C5A059]/40 text-center space-y-3.5 shadow-md">
                <div className="w-14 h-14 rounded-xs bg-[#0A192F] border-2 border-[#C5A059] flex items-center justify-center text-[#E4C88A] shadow-inner font-serif font-bold text-xl">
                  JK
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-white">
                    {HOMEPAGE_CONTENT.secretariat.officeTitle}
                  </h4>
                  <p className="text-[11px] text-[#E4C88A] font-semibold">
                    {HOMEPAGE_CONTENT.secretariat.officeSubtitle}
                  </p>
                </div>
                <p className="text-[10px] text-white/70 italic leading-snug">
                  {HOMEPAGE_CONTENT.secretariat.statutoryNote}
                </p>
                <Link href="/governance" className="w-full pt-1">
                  <Button variant="gold" size="sm" className="w-full justify-center text-xs">
                    View Fiduciary Charter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. CORPORATE CSR PARTNERSHIP HUB (SCHEDULE VII) */}
      <section id="csr" className="py-20 md:py-24 bg-[#FDFBF7] border-b border-[#0A192F]/10">
        <Container size="default">
          <div className="bg-gradient-to-br from-[#0A192F] to-[#1E3A8A] text-white rounded-xs p-8 sm:p-12 relative overflow-hidden border border-[#C5A059]/40 shadow-xl">
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <Badge variant="gold-dark" size="sm">
                  MCA CSR-1 Registration: CSR00081063
                </Badge>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                  Turnkey Corporate Social Responsibility (CSR) Partnerships in Odisha
                </h2>
                <p className="text-sm text-white/85 leading-relaxed font-sans">
                  Mahaveer Educational &amp; Charitable Trust is fully certified under Section 135 of the Companies Act, 2013 and Ministry of Corporate Affairs norms. We partner with public and private sector enterprises to design, implement, and audit impactful CSR initiatives across Schedule VII focus areas:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/90 pt-1 font-sans">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                    <span>Promoting Education &amp; Remedial Coaching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                    <span>Women&apos;s Vocational Livelihood Training</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                    <span>Safe Drinking Water &amp; Sanitation (Jal Seva)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                    <span>Independent Audits &amp; Utilization Certificates</span>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
                <Link href="/csr-partnerships" className="w-full">
                  <Button variant="gold" size="lg" className="w-full justify-center shadow-md font-bold">
                    <Briefcase className="w-4 h-4 mr-2" aria-hidden="true" />
                    <span>CSR Gateway &amp; Proposals</span>
                  </Button>
                </Link>
                <Link href="/statutory-disclosures" className="w-full">
                  <Button variant="dark-outline" size="md" className="w-full justify-center text-xs">
                    <FileCheck className="w-4 h-4 mr-1.5 text-[#E4C88A]" aria-hidden="true" />
                    <span>Download CSR-1 Registration</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. STUDENT SUPPORT BEYOND FINANCIAL GRANTS */}
      <section id="support" className="py-20 md:py-28 bg-[#F4EFE6] border-b border-[#0A192F]/10">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Comprehensive Enablement"
            title="Student Support Beyond Financial Grants"
            subtitle="Nurturing professional competence, critical reasoning, and community stewardship across our scholar fraternity."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOMEPAGE_CONTENT.enablement.map((item, idx) => {
              const IconComp =
                ENABLEMENT_ICON_MAP[item.iconName as keyof typeof ENABLEMENT_ICON_MAP] || Users;
              return (
                <Card
                  key={idx}
                  variant="elevated"
                  className="p-6 space-y-3 bg-white border-[#0A192F]/12 shadow-xs"
                >
                  <IconComp className="w-6 h-6 text-[#0A192F]" aria-hidden="true" />
                  <h3 className="font-serif text-base font-bold text-[#0A192F]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 10. COMMUNITY IMPACT & ODISHA STATE OUTREACH */}
      <section id="impact" className="py-20 bg-[#FDFBF7] border-b border-[#0A192F]/10">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Geographic Scope"
            title="Odisha State Outreach Vision"
            subtitle="Targeting scholars, rural women, and underserved communities from educational institutions across all 30 districts of Odisha."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TRUST_CONFIG.perspectives.map((item, idx) => (
              <Card
                key={idx}
                variant="accent"
                className="p-8 space-y-4 bg-white flex flex-col justify-between shadow-xs border-[#0A192F]/10"
              >
                <div className="space-y-3">
                  <Badge variant="contrast-gold" size="sm">
                    {item.focus}
                  </Badge>
                  <p className="font-serif text-base sm:text-lg italic text-[#1C2421] leading-relaxed">
                    “{item.statement}”
                  </p>
                </div>
                <div className="pt-4 border-t border-[#0A192F]/10">
                  <p className="text-xs font-bold text-[#0A192F] font-sans">
                    {item.authorNote}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 11. PARTICIPATION & VOLUNTEER REGISTRATION DESK */}
      <section id="participate" className="py-20 md:py-28 bg-[#F4EFE6] border-b border-[#0A192F]/10 scroll-mt-16">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="forest">Civic Mentorship &amp; Volunteering</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A192F]">
                Join the Cause as a Mentor, Volunteer, or Institutional Partner.
              </h2>
              <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
                MAHAVIR TRUST welcomes academicians, working professionals, alumni, and college faculties who share our dedication to educational access and rural welfare in Odisha.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-[#0A192F]/10 text-[#0A192F] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A192F]">
                      Academic &amp; Professional Mentors
                    </h3>
                    <p className="text-xs text-[#4A5568] mt-0.5 leading-relaxed font-sans">
                      Dedicate 2 hours monthly to guide an undergraduate scholar in your discipline with entrance exams or career paths.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-[#0A192F]/10 text-[#0A192F] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A192F]">
                      College &amp; University Affiliations
                    </h3>
                    <p className="text-xs text-[#4A5568] mt-0.5 leading-relaxed font-sans">
                      Degree colleges in Odisha can coordinate with our desk for student grant endorsements and fee verification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-[#0A192F]/10 text-[#0A192F] flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A192F]">
                      Community Learning Hub Stewards
                    </h3>
                    <p className="text-xs text-[#4A5568] mt-0.5 leading-relaxed font-sans">
                      Assist in managing community reference book collections and study rooms in cluster districts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Volunteer Form */}
            <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-xs border border-[#0A192F]/15 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-[#0A192F] mb-1">
                Volunteer &amp; Mentor Registry
              </h3>
              <p className="text-xs text-[#4A5568] mb-6 font-sans">
                Submit your academic or professional background to connect with our Secretariat Coordinator.
              </p>

              {volSubmitted ? (
                <div className="p-6 bg-[#0A192F] text-white rounded-xs space-y-3 text-center animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-[#E4C88A] mx-auto" aria-hidden="true" />
                  <h4 className="font-serif text-xl font-bold">
                    Registration Recorded
                  </h4>
                  {volReferenceId && (
                    <p className="text-xs font-mono text-[#E4C88A] bg-black/20 py-1 px-3 rounded inline-block">
                      Volunteer Registry Ref: #{volReferenceId}
                    </p>
                  )}
                  <p className="text-xs text-white/85 leading-relaxed font-sans">
                    Thank you for your willingness to guide Odisha’s students. The Secretariat team will review your profile and reach out via email.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 text-xs !border-[#E4C88A] !text-[#E4C88A] hover:!bg-[#E4C88A]/10"
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
                </div>
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
                        value: "College Institutional Partnership",
                        label: "College / University Institutional Liaison",
                      },
                      {
                        value: "Project Samarth Learning Hub Steward",
                        label: "Project Samarth Study Hub Steward",
                      },
                      {
                        value: "Community Field Volunteering",
                        label: "District Field Volunteering",
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
                      className="mt-0.5 h-4 w-4 rounded-xs border-[#0A192F]/30 text-[#0A192F] focus:ring-[#C5A059]"
                    />
                    <label
                      htmlFor="vol-consent-homepage"
                      className="text-[11px] text-[#4A5568] leading-tight select-none font-sans"
                    >
                      I voluntarily declare my intent to participate in academic mentorship or community volunteering in accordance with safeguarding and ethical conduct guidelines. For comprehensive tracks, review our{" "}
                      <Link
                        href="/volunteer"
                        className="text-[#0A192F] font-semibold underline hover:text-[#C5A059]"
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

      {/* 12. PUBLIC SECRETARIAT INQUIRY DESK */}
      <section id="contact-desk" className="py-20 md:py-28 bg-[#FDFBF7] border-b border-[#0A192F]/10 scroll-mt-16">
        <Container size="default">
          <SectionHeader
            badge="Direct Public Access"
            title="Secretariat Inquiry &amp; Scholar Guidance Desk"
            subtitle="Connect directly with our administration regarding scholarship schemes, eligibility documentation, or institutional affiliations."
            align="center"
            className="mb-12"
          />

          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xs border-2 border-[#C5A059]/40 shadow-lg">
            {inquirySubmitted ? (
              <div className="p-8 bg-[#0A192F] text-white rounded-xs space-y-4 text-center animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-[#E4C88A] mx-auto" aria-hidden="true" />
                <h3 className="font-serif text-2xl font-bold">
                  Inquiry Successfully Registered
                </h3>
                {inquiryReferenceId && (
                  <p className="text-sm font-mono text-[#E4C88A] bg-black/25 py-1.5 px-4 rounded inline-block">
                    Secretariat Registry Ref: #{inquiryReferenceId}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-md mx-auto font-sans">
                  Thank you for reaching out to MAHAVIR TRUST. Our Secretariat Coordinator has logged your query and will review your submission accordingly.
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
              </div>
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

                <p className="text-[11px] text-[#4A5568] text-center italic font-sans">
                  Zero processing fees. Protected by institutional security standards and rate limiting.
                </p>
              </form>
            )}
          </div>
        </Container>
      </section>

      {/* 13. PHILANTHROPIC COMMITMENT & SECTION 80G TAX REASSURANCE */}
      <section id="donate" className="py-20 bg-[#0A192F] text-[#EDE6D8] border-t border-[#C5A059]/30 scroll-mt-16">
        <Container size="default">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="gold-dark">
              50% Tax Deduction • Section 80G Certified
            </Badge>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Invest in a Scholar’s Future. Transform an Entire Family.
            </h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-sans">
              Every rupee donated to Mahaveer Educational &amp; Charitable Trust directly supports accredited higher education tuition grants, rural women&apos;s tailoring workshops, and community clean drinking water stations.
            </p>

            {/* 80G Tax Exemption & Direct Bank Transfer Reassurance Box */}
            <div className="p-6 rounded-xs bg-[#0F172A] border border-[#C5A059]/40 text-left max-w-xl mx-auto space-y-3.5 shadow-xl">
              <div className="flex items-center gap-2 text-[#E4C88A] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                <span>{HOMEPAGE_CONTENT.donorNotice.title}</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                {HOMEPAGE_CONTENT.donorNotice.description}
              </p>

              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-3 text-xs font-sans">
                <div>
                  <span className="text-white/50 block text-[10px]">Bank:</span>
                  <span className="text-white font-medium">{TRUST_CONFIG.bank.bankName}</span>
                </div>
                <div>
                  <span className="text-white/50 block text-[10px]">IFSC Code:</span>
                  <span className="text-[#E4C88A] font-mono font-bold">{TRUST_CONFIG.bank.ifsc}</span>
                </div>
                <div>
                  <span className="text-white/50 block text-[10px]">Account No:</span>
                  <span className="text-[#E4C88A] font-mono font-bold">{TRUST_CONFIG.bank.accountNumber}</span>
                </div>
                <div>
                  <span className="text-white/50 block text-[10px]">80G Order URN:</span>
                  <span className="text-white font-mono">{TRUST_CONFIG.statutory.section80GUrn}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/donate">
                <Button variant="gold" size="lg" className="shadow-lg font-bold">
                  <Heart className="w-4 h-4 mr-2 fill-current" aria-hidden="true" />
                  <span>Donate with 80G Tax Exemption</span>
                </Button>
              </Link>
              <Link href="/statutory-disclosures">
                <Button variant="dark-outline" size="lg" className="font-semibold">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-[#E4C88A]" aria-hidden="true" />
                  <span>Verify Tax Certificates</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
