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
} from "lucide-react";
import { submitInquiry, submitVolunteerRegistration } from "@/lib/api";

const ODISHA_DISTRICTS_LIST = [
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
  "Bolangir",
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
    district: "Khordha (Bhubaneswar)",
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
    district: "Khordha (Bhubaneswar)",
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
        consentVersion: "v2.3",
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
      {/* 1. HERO SECTION: Institutional Prestige & Factual Mission */}
      <section className="relative overflow-hidden bg-[#072617] text-[#EDE6D8] pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#C5A059]/30">
        {/* Subtle geometric lighting */}
        <div
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#165B38]/30 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <Container size="default">
          <div className="max-w-4xl mx-auto text-center space-y-7">
            {/* Mission Badge */}
            <div className="flex justify-center">
              <Badge
                variant="gold-dark"
                size="md"
                icon={<Sparkles className="w-3.5 h-3.5 text-[#C5A059]" aria-hidden="true" />}
              >
                {HOMEPAGE_CONTENT.hero.badge}
              </Badge>
            </div>

            {/* Grand Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
              {HOMEPAGE_CONTENT.hero.headline}
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-white/85 leading-relaxed font-sans max-w-3xl mx-auto">
              {HOMEPAGE_CONTENT.hero.subtext}
            </p>

            {/* Structured Dual CTAs (One Primary + One Secondary) */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href={HOMEPAGE_CONTENT.hero.ctas.primary.href}>
                <Button variant="gold" size="lg" className="shadow-md">
                  <span>{HOMEPAGE_CONTENT.hero.ctas.primary.text}</span>
                  <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
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
                Operating under transparent public trust deed standards. Review our{" "}
                <Link
                  href={HOMEPAGE_CONTENT.hero.ctas.governance.href}
                  className="text-[#E4C88A] underline hover:text-white transition-colors font-medium"
                >
                  Fiduciary Charter &amp; Governance Code
                </Link>
                .
              </p>
              <p className="text-[11px] text-white/55 italic">
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
                <p className="text-xs uppercase font-bold tracking-wider text-white/90">
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

      {/* 2. INSTITUTIONAL STANDARDS MARQUEE */}
      <InstitutionalMarquee />

      {/* 3. ABOUT STEWARDSHIP & THREE CORE PILLARS */}
      <section id="about" className="py-20 md:py-28 bg-[#FDFBF7]">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <Badge variant="forest">Stewardship &amp; Purpose</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B24] tracking-tight leading-snug">
                Founded on the Conviction that Higher Education is a Universal Human Right.
              </h2>
              <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
                MAHAVIR TRUST was conceived to empower aspirational youth from economically disadvantaged families across Odisha. We believe that true institutional philanthropy is measured by scholars enabled to complete their degrees with dignity and financial security.
              </p>
              <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
                Our model combines direct college tuition grants with persistent 1-to-1 faculty mentorship, creating verified pathways into engineering, pure sciences, commerce, and public administrative services.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link href="/about">
                  <Button variant="secondary" size="md">
                    <span>Read Our Heritage</span>
                    <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/governance">
                  <Button variant="outline" size="md">
                    <span>Fiduciary Charter</span>
                    <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Pillars Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {HOMEPAGE_CONTENT.pillars.map((pillar) => (
                <Card
                  key={pillar.number}
                  variant="elevated"
                  className="space-y-3 p-6 border-[#0B3B24]/12 hover:border-[#C5A059] transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-2xl text-[#C5A059]">
                      {pillar.number}
                    </span>
                    <Badge variant="contrast-gold" size="sm">
                      {pillar.tag}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0B3B24]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 4. PROPOSED INITIATIVES & SCHEMES EXPLORER */}
      <SchemeExplorer />

      {/* 5. INTERACTIVE SCHOLAR SCHEME MATCHING CALCULATOR */}
      <EligibilityCalculator />

      {/* 6. TRANSPARENCY: DIRECT-TO-COLLEGE DISBURSAL STANDARD */}
      <DirectDisbursalFlowchart />

      {/* 7. FROM THE SECRETARIAT DESK: Institutional Vision & Fiduciary Safeguards */}
      <section className="py-20 bg-[#F4EFE6] border-b border-[#0B3B24]/10">
        <Container size="default">
          <div className="bg-[#0B3B24] text-white rounded-xs p-8 sm:p-12 relative overflow-hidden border border-[#C5A059]/40 shadow-xl">
            {/* Ambient gold glow */}
            <div
              className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[#072617] border border-[#C5A059]/30 text-[10px] uppercase font-bold tracking-widest text-[#E4C88A]">
                  <Landmark className="w-3.5 h-3.5 text-[#C5A059]" aria-hidden="true" />
                  <span>{HOMEPAGE_CONTENT.secretariat.badge}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {HOMEPAGE_CONTENT.secretariat.quote}
                </h3>

                <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-sans">
                  {HOMEPAGE_CONTENT.secretariat.paragraph}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#E4C88A]">
                  <span className="flex items-center gap-1.5 font-serif font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                    Fiduciary Board of Trustees
                  </span>
                  <span className="text-white/40" aria-hidden="true">•</span>
                  <span>Bhubaneswar Administrative Office</span>
                  <span className="text-white/40" aria-hidden="true">•</span>
                  <span>Indian Trusts Act Framework</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#072617] rounded-xs border border-[#C5A059]/40 text-center space-y-3.5 shadow-md">
                <div className="w-14 h-14 rounded-xs bg-[#0B3B24] border-2 border-[#C5A059] flex items-center justify-center text-[#E4C88A] shadow-inner">
                  <GraduationCap className="w-7 h-7" aria-hidden="true" />
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
                <Link href="#contact-desk" className="w-full pt-1">
                  <Button variant="gold" size="sm" className="w-full justify-center text-xs">
                    Connect with Secretariat Desk
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. STUDENT SUPPORT & ENABLEMENT BEYOND FINANCIAL GRANTS */}
      <section id="support" className="py-20 md:py-28 bg-[#FDFBF7] border-b border-[#0B3B24]/10">
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
                  className="p-6 space-y-3 bg-white border-[#0B3B24]/12"
                >
                  <IconComp className="w-6 h-6 text-[#0B3B24]" aria-hidden="true" />
                  <h3 className="font-serif text-base font-bold text-[#0B3B24]">
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

      {/* 9. COMMUNITY IMPACT & ODISHA STATE OUTREACH */}
      <section id="impact" className="py-20 bg-[#F4EFE6] border-b border-[#0B3B24]/10">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Geographic Scope"
            title="Odisha State Outreach Vision"
            subtitle="Targeting scholars from rural and semi-urban educational institutions across all 30 districts of Odisha."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TRUST_CONFIG.perspectives.map((item, idx) => (
              <Card
                key={idx}
                variant="accent"
                className="p-8 space-y-4 bg-white flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <Badge variant="contrast-gold" size="sm">
                    {item.focus}
                  </Badge>
                  <p className="font-serif text-base sm:text-lg italic text-[#1C2421] leading-relaxed">
                    “{item.statement}”
                  </p>
                </div>
                <div className="pt-4 border-t border-[#0B3B24]/10">
                  <p className="text-xs font-bold text-[#0B3B24]">
                    {item.authorNote}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 10. PARTICIPATION & VOLUNTEER REGISTRATION DESK */}
      <section id="participate" className="py-20 md:py-28 bg-[#FDFBF7] border-b border-[#0B3B24]/10 scroll-mt-16">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="forest">Community Participation</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B24]">
                Join the Cause as a Mentor, Volunteer, or Institutional Partner.
              </h2>
              <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
                MAHAVIR TRUST welcomes academicians, working professionals, alumni, and college faculties who share our dedication to educational access in Odisha.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 text-[#0B3B24] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B3B24]">
                      Academic &amp; Professional Mentors
                    </h3>
                    <p className="text-xs text-[#4A5568] mt-0.5 leading-relaxed font-sans">
                      Dedicate 2 hours monthly to guide an undergraduate scholar in your discipline with entrance exams or career paths.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 text-[#0B3B24] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B3B24]">
                      College &amp; University Affiliations
                    </h3>
                    <p className="text-xs text-[#4A5568] mt-0.5 leading-relaxed font-sans">
                      Degree colleges in Odisha can coordinate with our desk for student grant endorsements and fee verification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 text-[#0B3B24] flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B3B24]">
                      Project Samarth Study Hub Stewards
                    </h3>
                    <p className="text-xs text-[#4A5568] mt-0.5 leading-relaxed font-sans">
                      Assist in managing community reference book collections and study rooms in cluster districts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Volunteer Form */}
            <div className="lg:col-span-6 bg-[#F4EFE6] p-8 sm:p-10 rounded-xs border border-[#0B3B24]/15 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-[#0B3B24] mb-1">
                Volunteer &amp; Mentor Registry [Proposed Initiative]
              </h3>
              <p className="text-xs text-[#4A5568] mb-6 font-sans">
                Submit your academic or professional background to connect with our Secretariat Coordinator.
              </p>

              {volSubmitted ? (
                <div className="p-6 bg-[#0B3B24] text-white rounded-xs space-y-3 text-center animate-in fade-in">
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
                        district: "Khordha (Bhubaneswar)",
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
                      className="mt-0.5 h-4 w-4 rounded-xs border-[#0B3B24]/30 text-[#072617] focus:ring-[#C5A059]"
                    />
                    <label
                      htmlFor="vol-consent-homepage"
                      className="text-[11px] text-[#4A5568] leading-tight select-none font-sans"
                    >
                      I voluntarily declare my intent to participate in academic mentorship or community volunteering in accordance with draft safeguarding and ethical conduct guidelines. For comprehensive tracks, review our{" "}
                      <Link
                        href="/volunteer"
                        className="text-[#072617] font-semibold underline hover:text-[#C5A059]"
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

      {/* 11. PUBLIC SECRETARIAT INQUIRY DESK */}
      <section id="contact-desk" className="py-20 md:py-28 bg-[#F4EFE6] border-b border-[#0B3B24]/10 scroll-mt-16">
        <Container size="default">
          <SectionHeader
            badge="Direct Public Access"
            title="Secretariat Inquiry &amp; Scholar Guidance Desk"
            subtitle="Connect directly with our administration regarding proposed scholarship schemes, eligibility documentation, or institutional affiliations."
            align="center"
            className="mb-12"
          />

          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xs border-2 border-[#C5A059]/40 shadow-lg">
            {inquirySubmitted ? (
              <div className="p-8 bg-[#0B3B24] text-white rounded-xs space-y-4 text-center animate-in fade-in">
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
                      district: "Khordha (Bhubaneswar)",
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

      {/* 12. PHILANTHROPIC COMMITMENT & DONOR CALL TO ACTION */}
      <section id="donate" className="py-20 bg-[#072617] text-[#EDE6D8] border-t border-[#C5A059]/20 scroll-mt-16">
        <Container size="default">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="gold-dark">Philanthropic Commitment</Badge>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Invest in a Scholar’s Future. Transform an Entire Family.
            </h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-sans">
              Every future grant supported by MAHAVIR TRUST is dedicated strictly toward accredited higher education tuition fees and scholar enablement under our direct-to-college disbursement policy.
            </p>

            <div className="p-5 rounded-xs bg-[#0B3B24]/80 border border-[#C5A059]/30 text-left max-w-xl mx-auto space-y-2">
              <div className="flex items-center gap-2 text-[#E4C88A] text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                <span>{HOMEPAGE_CONTENT.donorNotice.title}</span>
              </div>
              <p className="text-xs text-white/75 leading-relaxed font-sans">
                {HOMEPAGE_CONTENT.donorNotice.description}
              </p>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${TRUST_CONFIG.contact.generalEmail}?subject=Donor%20Pledge%20Inquiry%20-%20Mahavir%20Trust`}
              >
                <Button variant="gold" size="lg">
                  <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>Connect with Donor Secretariat</span>
                </Button>
              </a>
              <Link href="/governance">
                <Button variant="dark-outline" size="lg">
                  Our Fiduciary Governance
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
