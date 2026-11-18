"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Accordion } from "@/components/Accordion";
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Clock,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Send,
  Loader2,
  AlertCircle,
  MapPin,
  HeartHandshake,
  FileCheck2,
  HelpCircle,
  Mail,
  ArrowRight,
  Droplets,
  ScrollText,
  UserCheck,
  Phone,
  Sparkles,
} from "lucide-react";
import { ORG } from "@content/org";
import { submitVolunteerRegistration } from "@/lib/api";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";

const ODISHA_DISTRICTS = [
  "Balangir",
  "Khordha (Bhubaneswar)",
  "Cuttack",
  "Angul",
  "Balasore (Baleswar)",
  "Bargarh",
  "Bhadrak",
  "Boudh",
  "Deogarh",
  "Dhenkanal",
  "Gajapati",
  "Ganjam",
  "Jagatsinghpur",
  "Jajpur",
  "Jharsuguda",
  "Kalahandi",
  "Kandhamal",
  "Kendrapara",
  "Kendujhar (Keonjhar)",
  "Koraput",
  "Malkangiri",
  "Mayurbhanj",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Puri",
  "Rayagada",
  "Sambalpur",
  "Subarnapur (Sonepur)",
  "Sundargarh (Rourkela)",
  "Outside Odisha / NRI",
];

export interface ParticipationOpportunity {
  id: string;
  title: string;
  programme: string;
  location: string;
  status: "OPEN" | "INTEREST REGISTRATION" | "PLANNED" | "CLOSED";
  statusVariant: "forest" | "gold" | "neutral" | "danger";
  timeCommitment: string;
  participationMode: "On-Ground" | "Virtual / Remote" | "Hybrid / On-Campus";
  prerequisites: string;
  description: string;
  statusNote?: string;
}

const PARTICIPATION_OPPORTUNITIES: ParticipationOpportunity[] = [
  {
    id: "remedial-tutor",
    title: "Remedial Education Mentor",
    programme: "Free Remedial Education & Academic Support",
    location: "Balangir & Puintala Blocks (Western Odisha)",
    status: "INTEREST REGISTRATION",
    statusVariant: "gold",
    timeCommitment: "2 to 4 hours / week",
    participationMode: "On-Ground",
    prerequisites: "Graduates, B.Ed candidates, or senior college students in sciences/languages",
    description:
      "Support Class 6–10 students in rural Balangir with evening remedial tutorials in foundational Mathematics, Science, and English to strengthen literacy and prevent secondary school dropouts.",
    statusNote: "Open for Expressions of Interest for upcoming academic term batches.",
  },
  {
    id: "digital-skills",
    title: "Digital Skills Guide",
    programme: "Community Digital Literacy & Youth Vocational Skills",
    location: "Titilagarh & Balangir Youth Centers",
    status: "INTEREST REGISTRATION",
    statusVariant: "gold",
    timeCommitment: "2 to 4 hours / week",
    participationMode: "On-Ground",
    prerequisites: "Working knowledge of basic computing, internet safety, and vocational software",
    description:
      "Guide rural youth through foundational digital literacy modules, practical typing, online scholarship application portals, and safe internet usage at community computer kiosks.",
    statusNote: "Open for Expressions of Interest as new community digital batches are organized.",
  },
  {
    id: "women-shg-mentor",
    title: "Women's SHG Mentor",
    programme: "Livelihood & Women's Enterprise Guidance",
    location: "Kalahandi & Subarnapur Field Clusters",
    status: "INTEREST REGISTRATION",
    statusVariant: "gold",
    timeCommitment: "2 to 4 hours / month",
    participationMode: "Hybrid / On-Campus",
    prerequisites: "Experience in small enterprise management, basic accounting, or SHG coordination",
    description:
      "Assist women-led self-help groups with basic bookkeeping principles, raw material inventory tracking, and exhibition marketing for rural handicraft and food-processing micro-enterprises.",
    statusNote: "Open for Expressions of Interest; mentoring pairs confirmed upon cohort formation.",
  },
  {
    id: "field-doc-fellow",
    title: "Field Documentation Fellow",
    programme: "Institutional Reporting & Community Dispatches",
    location: "Western Odisha Field Districts / Remote",
    status: "INTEREST REGISTRATION",
    statusVariant: "gold",
    timeCommitment: "2 to 4 hours / week",
    participationMode: "Virtual / Remote",
    prerequisites: "Strong writing, photography, or ethnographic interviewing skills in Odia/English",
    description:
      "Compile consent-verified community field notes, photograph educational study center milestones, and assist the Secretariat in preparing transparent beneficiary case studies.",
    statusNote: "Open for Expressions of Interest for rolling editorial support cycles.",
  },
  {
    id: "jal-seva-volunteer",
    title: "Seasonal Jal Seva Kiosk Volunteer",
    programme: "Safe Drinking Water & Heatwave Relief",
    location: "Balangir District (On-Ground)",
    status: "PLANNED",
    statusVariant: "neutral",
    timeCommitment: "Seasonal (Peak Summer Months)",
    participationMode: "On-Ground",
    prerequisites: "Local community residents dedicated to civic welfare",
    description:
      "Assist with daily water kiosk monitoring, hygienic refilling logistics, and drinking water point maintenance during Western Odisha's peak heatwave months (April to June).",
    statusNote: "Not currently deploying; roster opens annually in March ahead of summer heatwave season.",
  },
  {
    id: "hub-steward",
    title: "District Community Reading Hub Steward",
    programme: "Rural Educational Access & Reference Libraries",
    location: "Balangir, Koraput & Kalahandi Clusters",
    status: "PLANNED",
    statusVariant: "neutral",
    timeCommitment: "Subject to facility commissioning",
    participationMode: "On-Ground",
    prerequisites: "Local residents with library or community management interest",
    description:
      "Physical study hub and reading room facilities remain proposed initiatives subject to formal site selection, lease execution, and Board ratification. On-ground deployment is not currently active.",
    statusNote: "Not currently deploying; facility commissioning pending; advance expressions of interest recorded.",
  },
];

const VOLUNTEER_ROLES = [
  "Remedial Education Mentor",
  "Digital Skills Guide",
  "Women's SHG Mentor",
  "Field Documentation Fellow",
  "Seasonal Jal Seva Kiosk Volunteer",
  "District Community Reading Hub Steward",
  "General Community Expression of Interest",
];

const QUALIFICATIONS = [
  "Doctorate / Ph.D.",
  "Post-Graduate (M.Tech, M.Sc, M.Com, M.A, MCA, MBA)",
  "Graduate (B.Tech, B.Sc, B.Com, B.A, MBBS)",
  "Professional (CA, CS, Law, Civil Services)",
  "College Student (Undergraduate / Post-Graduate)",
  "Other Vocational / Technical Credential",
];

const AVAILABILITY_OPTIONS = [
  "1 to 2 hours / month (Virtual)",
  "2 to 4 hours / month (Flexible)",
  "2 to 4 hours / week (Field Cohort)",
  "Seasonal / Project-Based (Summer)",
  "Weekend Study Centers",
];

const ENGAGEMENT_MODES = [
  "In-Person / On-Ground",
  "Virtual / Remote",
  "Hybrid (Virtual + On-Site)",
];

const FAQ_ITEMS = [
  {
    question: "What is an Expression of Interest versus a confirmed placement?",
    answer:
      "MECT does not publish fictional vacancies or guaranteed jobs. Submitting an expression of interest registers your skills, location, and availability in our confidential participant registry. When an active community cohort, learning circle, or student mentorship pair requires your specific skills, the Secretariat contacts you for orientation.",
  },
  {
    question: "Do volunteers receive salary, sitting fees, or honorariums?",
    answer:
      "Under Section 9 Clause XVI of our registered Trust Deed (Doc No. 40311302194), all service is strictly honorary and uncompensated. Trustees and volunteers serve without salary or financial commission. Only actual, documented, and vouched out-of-pocket expenses properly incurred in executing approved Trust activities may be reimbursed under ledger controls.",
  },
  {
    question: "Can I participate remotely from outside Odisha or from abroad?",
    answer:
      "Yes. The Academic & Career Mentor track operates entirely through remote communication (video calls, phone check-ins, and email review). We warmly welcome educators, industry professionals, and members of the global Odia diaspora who wish to mentor promising undergraduate scholars studying in colleges across Odisha.",
  },
  {
    question: "What student welfare and safeguarding rules govern volunteer interactions?",
    answer:
      "MECT enforces a strict child and student welfare code: volunteers are never permitted unsupervised private access to minors. Mentors may never solicit financial transactions, charge private coaching fees, or communicate outside registered platforms. Any student requiring financial help is directed exclusively to the Trust's direct college fee grant scheme.",
  },
  {
    question: "How is my personal data handled after registration?",
    answer:
      "Your registration data is collected strictly for volunteer cohort coordination and is protected in accordance with the Digital Personal Data Protection Act (DPDPA). We never request Aadhaar numbers, PAN cards, bank credentials, or medical documents for volunteer registration. Personal details are never shared with commercial entities.",
  },
  {
    question: "What happens if my availability changes after I register?",
    answer:
      "Participation is entirely voluntary. If your availability, location, or professional commitments change, simply notify the Secretariat at mect220@gmail.com to pause, update, or withdraw your registry entry at any time.",
  },
];

export default function VolunteerPage() {
  const shouldReduceMotion = useReducedMotion();
  const formRef = useRef<HTMLDivElement>(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    district: "Balangir",
    roleInterest: "Remedial Education Mentor",
    qualification: "Graduate (B.Tech, B.Sc, B.Com, B.A, MBBS)",
    availability: "2 to 4 hours / week (Field Cohort)",
    engagementMode: "In-Person / On-Ground",
    backgroundNotes: "",
    consentDeclared: false,
  });

  const handleSelectOpportunity = (opportunityTitle: string) => {
    setFormData((prev) => ({ ...prev, roleInterest: opportunityTitle }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!formData.consentDeclared) {
      setErrorMessage("Affirmative consent to the voluntary service declaration and safeguarding guidelines is mandatory.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await submitVolunteerRegistration({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        district: formData.district,
        roleInterest: formData.roleInterest,
        qualification: formData.qualification,
        availability: formData.availability,
        engagementMode: formData.engagementMode,
        backgroundNotes: formData.backgroundNotes.trim(),
        consentDeclared: true,
        consentVersion: "v1.0-draft-2026",
      });

      setReferenceId(response.referenceId || null);
      setFormSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected network error occurred while connecting to the secretariat.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-cream text-ink pb-floating-clearance">
      {/* 1. Page Hero Banner */}
      <PageHero
        badge="Community Participation Registry"
        badgeVariant="forest-dark"
        title="Bring Your Time. Share Your Skills. Strengthen a Community."
        description="Participation takes many forms. Whether through teaching, community support, professional knowledge or practical assistance, your interest can help MECT understand how people would like to contribute to its charitable programmes."
        breadcrumbs={[{ label: "Get Involved", href: "/#development-pillars" }, { label: "Volunteer Registry" }]}
        actions={
          <>
            <a href="#opportunities">
              <Button variant="gold" size="sm">
                <span>Explore Opportunities</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </a>
            <a href="#register">
              <Button variant="dark-outline" size="sm">
                <Send className="w-3.5 h-3.5 mr-1 text-cream" aria-hidden="true" />
                <span>Register Interest</span>
              </Button>
            </a>
            <a href="#safeguarding">
              <Button variant="dark-outline" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cream" aria-hidden="true" />
                <span>Safeguarding Standards</span>
              </Button>
            </a>
          </>
        }
      />

      {/* 2. Institutional Overview Strip */}
      <section id="overview" className="py-8 bg-sand-light/60 border-b border-border-warm" aria-label="Volunteer Code Overview">
        <Container size="default">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xs border border-border-warm shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                <ScrollText className="w-5 h-5 text-sand" aria-hidden="true" />
              </div>
              <div>
                <p className="font-serif font-bold text-xs text-forest">Honorary Service</p>
                <p className="text-[11px] text-ink-sand leading-snug">
                  Strictly non-remunerated per Deed Clause 9(XVI).
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xs border border-border-warm shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-sand" aria-hidden="true" />
              </div>
              <div>
                <p className="font-serif font-bold text-xs text-forest">Verified Cohorts</p>
                <p className="text-[11px] text-ink-sand leading-snug">
                  Connected with real community and academic needs.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xs border border-border-warm shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-sand" aria-hidden="true" />
              </div>
              <div>
                <p className="font-serif font-bold text-xs text-forest">Child Safeguarding</p>
                <p className="text-[11px] text-ink-sand leading-snug">
                  Supervised environments; zero unmonitored access.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xs border border-border-warm shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-sand" aria-hidden="true" />
              </div>
              <div>
                <p className="font-serif font-bold text-xs text-forest">Data Protection</p>
                <p className="text-[11px] text-ink-sand leading-snug">
                  Minimum data collected; zero Aadhaar or bank info.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Section 01: Verified Participation Opportunities Grid */}
      <section id="opportunities" className="py-20 md:py-28 bg-cream border-b border-border-warm scroll-mt-20" aria-label="Participation Opportunities">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Participation Tracks"
            title="Verified Community Participation Opportunities"
            subtitle="Explore active and planned volunteering pathways. Every role corresponds to genuine operational activities or documented institutional needs across Western Odisha."
            align="center"
          />

          {/* Status Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 p-3 bg-white rounded-xs border border-border-warm max-w-2xl mx-auto text-xs font-sans">
            <span className="font-semibold text-ink-secondary mr-1">Status Legend:</span>
            <span className="inline-flex items-center gap-1.5">
              <Badge variant="forest" size="sm">OPEN</Badge>
              <span className="text-ink-sand text-[11px]">Active Intake</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Badge variant="gold" size="sm">INTEREST REGISTRATION</Badge>
              <span className="text-ink-sand text-[11px]">Upcoming Cohorts</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Badge variant="neutral" size="sm">PLANNED</Badge>
              <span className="text-ink-sand text-[11px]">Seasonal / Proposed</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Badge variant="danger" size="sm">CLOSED</Badge>
              <span className="text-ink-sand text-[11px]">Not Accepting</span>
            </span>
          </div>

          {/* Opportunities Cards Grid */}
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.06}>
            {PARTICIPATION_OPPORTUNITIES.map((opp) => (
              <StaggerItem key={opp.id}>
                <Card
                  variant="elevated"
                  className="p-6 sm:p-7 bg-white border-border-warm shadow-xs hover:border-terracotta/40 transition-all flex flex-col justify-between space-y-5 h-full"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <Badge variant={opp.statusVariant} size="sm">
                        {opp.status}
                      </Badge>
                      <span className="text-[11px] font-mono text-ink-secondary flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                        {opp.timeCommitment}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-forest">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-terracotta-dark font-medium font-sans">
                        {opp.programme}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
                      {opp.description}
                    </p>

                    <div className="pt-2 border-t border-border-warm space-y-1.5 text-xs font-sans">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-ink-secondary font-medium shrink-0">Mode &amp; Location:</span>
                        <span className="text-ink text-right font-medium">{opp.participationMode} • {opp.location}</span>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-ink-secondary font-medium shrink-0">Prerequisites:</span>
                        <span className="text-ink-sand text-right">{opp.prerequisites}</span>
                      </div>
                      {opp.statusNote && (
                        <p className="text-[11px] text-terracotta-dark italic pt-1">
                          Note: {opp.statusNote}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-warm">
                    {opp.status === "PLANNED" ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full justify-center text-xs"
                        onClick={() => handleSelectOpportunity(opp.title)}
                      >
                        <span>Express Advance Interest</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        className="w-full justify-center text-xs font-bold"
                        onClick={() => handleSelectOpportunity(opp.title)}
                      >
                        <span>Register Interest in Track</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      {/* 4. Section 02: Application Lifecycle & What to Expect */}
      <section id="lifecycle" className="py-20 bg-white border-b border-border-warm" aria-label="Volunteer Application Lifecycle">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Process Transparency"
            title="How the Participation Process is Expected to Work"
            subtitle="The stages below outline the institutional process from your expression of interest to potential community engagement. These explanatory steps describe operational expectations; formal status transitions are recorded administratively in our registry under Trustee oversight."
            align="center"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="elevated" className="p-6 bg-sand-light/50 border-border-warm shadow-xs space-y-3">
              <span className="font-serif text-3xl font-bold text-terracotta-dark">01</span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-forest">
                Expression of Interest
              </h3>
              <p className="text-xs text-ink-sand leading-relaxed">
                Submit your credentials, district, and preferred track. A unique reference ID is logged directly in our database under initial status <code className="text-forest font-mono text-[11px]">AWAITING_ORIENTATION</code>.
              </p>
            </Card>

            <Card variant="elevated" className="p-6 bg-sand-light/50 border-border-warm shadow-xs space-y-3">
              <span className="font-serif text-3xl font-bold text-terracotta-dark">02</span>
              <h3 className="font-serif text-lg font-bold text-forest">
                Secretariat Scrutiny
              </h3>
              <p className="text-xs text-ink-sand leading-relaxed">
                The Secretariat reviews your profile for subject alignment and operational needs as active cohorts are formed, recording review status administratively.
              </p>
            </Card>

            <Card variant="elevated" className="p-6 bg-sand-light/50 border-border-warm shadow-xs space-y-3">
              <span className="font-serif text-3xl font-bold text-terracotta-dark">03</span>
              <h3 className="font-serif text-lg font-bold text-forest">
                Safeguarding Orientation
              </h3>
              <p className="text-xs text-ink-sand leading-relaxed">
                Applicants undergo orientation covering child protection, non-commercial ethics, and confidential student privacy rules prior to field deployment.
              </p>
            </Card>

            <Card variant="elevated" className="p-6 bg-sand-light/50 border-border-warm shadow-xs space-y-3">
              <span className="font-serif text-3xl font-bold text-terracotta-dark">04</span>
              <h3 className="font-serif text-lg font-bold text-forest">
                Supervised Cohort Matching
              </h3>
              <p className="text-xs text-ink-sand leading-relaxed">
                Volunteers are paired with verified learning circles or undergraduate scholars under designated local supervisors in public settings.
              </p>
            </Card>
          </div>

          <div className="p-5 bg-sand-light rounded-xs border border-border-warm text-xs text-ink-sand leading-relaxed text-center max-w-3xl mx-auto font-sans space-y-1">
            <p><strong className="text-terracotta-dark">Operational Note:</strong> The four stages above describe how the participation process is expected to work. Submitting an application represents an honorary expression of interest and does not create an employment contract, automatic approval timeline, or self-service status-tracking portal.</p>
            <p className="text-[11px] text-ink-muted">Official status transitions (<span className="font-mono">AWAITING_ORIENTATION</span> &rarr; <span className="font-mono">UNDER_REVIEW</span> &rarr; <span className="font-mono">ORIENTATION_COMPLETED</span> &rarr; <span className="font-mono">ACTIVE_MENTOR</span> / <span className="font-mono">REJECTED</span>) are controlled exclusively by authorized administrators via secure RBAC controls.</p>
          </div>
        </Container>
      </section>

      {/* 5. Section 03: Safeguarding Standards & Non-Commercial Code */}
      <section id="safeguarding" className="py-20 md:py-24 bg-cream border-b border-border-warm scroll-mt-20" aria-label="Student Safeguarding & Ethics Code">
        <Container size="default">
          <Card variant="elevated" className="p-8 sm:p-12 bg-forest text-cream border-sand/40 space-y-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-sand/30">
              <div className="space-y-1.5">
                <Badge variant="gold" size="sm">
                  Safeguarding &amp; Governance
                </Badge>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream tracking-tight">
                  Child Welfare, Student Safeguarding &amp; Code of Conduct
                </h2>
                <p className="text-xs sm:text-sm text-sand font-mono">
                  Institutional standards and conduct rules governing all community participants, mentors, and staff.
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-sand text-forest flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-forest-deep" aria-hidden="true" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
              <div className="p-5 rounded-xs bg-forest-deep/60 border border-sand/20 space-y-2">
                <h4 className="font-serif text-sm font-bold text-sand">Strictly Non-Commercial</h4>
                <p className="text-cream/90 leading-relaxed">
                  Volunteers may never offer paid coaching, commercial tutoring, or solicit donations directly from assigned scholars or community families. Zero commercial transactions are permitted.
                </p>
              </div>

              <div className="p-5 rounded-xs bg-forest-deep/60 border border-sand/20 space-y-2">
                <h4 className="font-serif text-sm font-bold text-sand">Supervised Environments Only</h4>
                <p className="text-cream/90 leading-relaxed">
                  Volunteers are never permitted unsupervised, private access to minors. All on-ground remedial tutorials and workshops are conducted in public, community-supervised centers.
                </p>
              </div>

              <div className="p-5 rounded-xs bg-forest-deep/60 border border-sand/20 space-y-2">
                <h4 className="font-serif text-sm font-bold text-sand">Beneficiary Record Privacy</h4>
                <p className="text-cream/90 leading-relaxed">
                  Student family backgrounds, income certificates, caste records, and banking data are strictly confidential and protected in compliance with the Digital Personal Data Protection Act (DPDPA).
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-sand/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-sand">
              <p>
                Ethics disclosures or safeguarding queries: <a href="mailto:mect220@gmail.com" className="underline text-cream hover:text-sand">mect220@gmail.com</a>
              </p>
              <Link href="/statutory-disclosures">
                <Button variant="gold" size="sm">
                  <span>View Statutory Governance</span>
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </section>

      {/* 6. Section 04: Volunteer Registration Intake Desk */}
      <section id="register" ref={formRef} className="py-20 md:py-28 bg-sand-light/50 border-b border-border-warm scroll-mt-20" aria-label="Volunteer Registration Form">
        <Container size="narrow">
          <Card variant="elevated" className="p-8 sm:p-12 bg-white border-border-warm shadow-xs space-y-8">
            <div className="border-b border-border-warm pb-6 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="forest" size="sm">
                  Confidential Intake
                </Badge>
                <span className="text-xs font-mono text-terracotta-dark font-semibold">
                  Data Minimization Protocol
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                Volunteer &amp; Community Participation Registration
              </h2>
              <p className="text-xs sm:text-sm text-ink-sand font-sans leading-relaxed">
                Please complete the expression of interest form below. We collect only the minimum necessary information required to evaluate subject alignment and location suitability.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 sm:p-10 bg-forest text-cream rounded-xs space-y-5 text-center" role="status" aria-live="polite">
                <CheckCircle2 className="w-14 h-14 text-sand mx-auto" aria-hidden="true" />
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream">
                    Expression of Interest Recorded
                  </h3>
                  {referenceId && (
                    <div className="inline-block py-1.5 px-4 rounded-xs bg-forest-deep border border-sand/40 text-sand font-mono text-xs font-bold">
                      Registration Reference ID: #{referenceId}
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-cream/90 leading-relaxed max-w-lg mx-auto font-sans">
                  Thank you for offering your skills and time. Your application has been logged for orientation review. As matching cohorts are scheduled, our Secretariat Desk will reach out via your registered contact details.
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="!border-sand !text-cream hover:!bg-sand/20"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        district: "Balangir",
                        roleInterest: "Remedial Education Mentor",
                        qualification: "Graduate (B.Tech, B.Sc, B.Com, B.A, MBBS)",
                        availability: "2 to 4 hours / week (Field Cohort)",
                        engagementMode: "In-Person / On-Ground",
                        backgroundNotes: "",
                        consentDeclared: false,
                      });
                    }}
                  >
                    Submit Another Interest Entry
                  </Button>
                  <Link href="/programmes">
                    <Button variant="gold" size="sm">
                      <span>Explore Programmes</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xs text-xs flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="font-sans leading-relaxed">{errorMessage}</span>
                  </div>
                )}

                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Full Name *"
                    id="vol-fullname"
                    name="fullName"
                    type="text"
                    required
                    maxLength={150}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />

                  <Input
                    label="Email Address *"
                    id="vol-email"
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                  />
                </div>

                {/* Row 2: Phone & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Phone / Mobile Number *"
                    id="vol-phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={30}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98XXXXXXXX"
                  />

                  <Select
                    label="Location / District in Odisha *"
                    id="vol-district"
                    name="district"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    options={ODISHA_DISTRICTS.map((d) => ({ value: d, label: d }))}
                  />
                </div>

                {/* Row 3: Role & Qualification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="Preferred Participation Track *"
                    id="vol-role"
                    name="roleInterest"
                    required
                    value={formData.roleInterest}
                    onChange={(e) => setFormData({ ...formData, roleInterest: e.target.value })}
                    options={VOLUNTEER_ROLES.map((r) => ({ value: r, label: r }))}
                  />

                  <Select
                    label="Highest Qualification *"
                    id="vol-qualification"
                    name="qualification"
                    required
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    options={QUALIFICATIONS.map((q) => ({ value: q, label: q }))}
                  />
                </div>

                {/* Row 4: Availability & Engagement Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="Time Availability *"
                    id="vol-availability"
                    name="availability"
                    required
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    options={AVAILABILITY_OPTIONS.map((a) => ({ value: a, label: a }))}
                  />

                  <Select
                    label="Preferred Engagement Mode *"
                    id="vol-mode"
                    name="engagementMode"
                    required
                    value={formData.engagementMode}
                    onChange={(e) => setFormData({ ...formData, engagementMode: e.target.value })}
                    options={ENGAGEMENT_MODES.map((m) => ({ value: m, label: m }))}
                  />
                </div>

                {/* Background Notes */}
                <Textarea
                  label="Subject Areas, Relevant Skills & Background Notes (Optional)"
                  id="vol-notes"
                  name="backgroundNotes"
                  rows={4}
                  maxLength={2000}
                  showCount
                  value={formData.backgroundNotes}
                  onChange={(e) => setFormData({ ...formData, backgroundNotes: e.target.value })}
                  placeholder="Describe your subject discipline (e.g. Mathematics, Sewing, Nursing, Commerce), current institution or employer, and how you would like to contribute..."
                />

                {/* Affirmative Consent Checkbox */}
                <div className="p-4 bg-sand-light rounded-xs border border-border-warm space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      id="vol-consent"
                      name="consentDeclared"
                      type="checkbox"
                      checked={formData.consentDeclared}
                      onChange={(e) => setFormData({ ...formData, consentDeclared: e.target.checked })}
                      className="mt-1 w-4 h-4 text-forest border-border-warm rounded-2xs focus:ring-forest shrink-0"
                    />
                    <span className="text-xs text-ink leading-relaxed select-none font-sans">
                      <strong className="text-forest">Ethical Declaration &amp; Safeguarding Consent:</strong> I declare that all information provided is authentic. I agree to uphold MECT honorary voluntary service principles, non-commercial conduct, and student welfare safeguarding guidelines.
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full justify-center !py-3.5 text-xs uppercase tracking-wider font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      <span>Logging Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                      <span>Submit Expression of Interest</span>
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-ink-sand text-center font-mono">
                  Personal data collected strictly for volunteer coordination under DPDPA standards. No commercial sharing.
                </p>
              </form>
            )}
          </Card>
        </Container>
      </section>

      {/* 7. Section 05: Frequently Asked Questions */}
      <section id="faq" className="py-20 bg-cream border-b border-border-warm" aria-label="Volunteer FAQs">
        <Container size="narrow" className="space-y-12">
          <SectionHeader
            badge="Clarifications"
            title="Frequently Asked Questions on Participation"
            subtitle="Clear answers regarding time commitments, remote mentoring, student welfare, and registration protocols."
            align="center"
          />

          <Accordion items={FAQ_ITEMS} />
        </Container>
      </section>

      {/* 8. Section 06: Institutional Contact Desk */}
      <section id="contact" className="py-16 bg-white" aria-label="Secretariat Support Desk">
        <Container size="default">
          <Card variant="elevated" className="p-8 sm:p-10 bg-forest text-cream border-border-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sand" aria-hidden="true" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream">
                  College, University &amp; CSR Group Collaborations
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-cream/90 font-sans leading-relaxed">
                Are you a college principal, academic dean, or corporate CSR representative seeking structured community service cohorts or college liaison partnerships?
              </p>
              <p className="text-xs font-mono text-sand">
                Secretariat Office: {ORG.addresses.registered.full} • Helpline: {ORG.helpline.display}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a href={`mailto:${ORG.emails.general}?subject=Institutional%20Volunteer%20Collaboration`}>
                <Button variant="gold" size="sm" className="font-bold">
                  <Mail className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  <span>{ORG.emails.general}</span>
                </Button>
              </a>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="!border-sand !text-cream hover:!bg-sand/20">
                  <span>Secretariat Directory</span>
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}
