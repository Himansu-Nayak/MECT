"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
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
  ChevronRight,
  Compass,
  Award,
  Globe2,
  MapPin,
  HeartHandshake,
  FileCheck2,
  HelpCircle,
  Mail,
  ArrowRight,
} from "lucide-react";
import { TRUST_CONFIG } from "@/lib/config";
import { submitVolunteerRegistration } from "@/lib/api";

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

const VOLUNTEER_ROLES = [
  "Balangir Remedial Education Tutor (Class 6-10)",
  "Women Vocational & Tailoring Mentor",
  "Academic & Entrance Exam Mentor (Higher Ed)",
  "Career & Industry Guide (Mock Interviews)",
  "Project Samarth Community Hub Steward",
  "College & Faculty Institutional Liaison",
  "Jal Seva & Community Relief Volunteer",
];

const QUALIFICATIONS = [
  "Doctorate / Ph.D.",
  "Post-Graduate (M.Tech, M.Sc, M.Com, M.A, MCA, MBA)",
  "Graduate (B.Tech, B.Sc, B.Com, B.A, MBBS)",
  "Professional (CA, CS, Law, Civil Services)",
  "Other Relevant Academic / Industry Credential",
];

const AVAILABILITY_OPTIONS = [
  "1 to 2 hours / month (Standard Virtual Track)",
  "2 to 4 hours / month (Intensive Mentorship)",
  "4 to 8 hours / week (Community Study Hub Steward)",
  "1 to 2 hours / semester (Institutional College Liaison)",
];

const ENGAGEMENT_MODES = [
  "Virtual / Remote (Video, Phone & Email)",
  "In-Person at District Study Hub",
  "Hybrid (Virtual + Periodic Hub Visits)",
];

const FAQ_ITEMS = [
  {
    question: "Can I mentor students if I live outside Odisha or abroad?",
    answer:
      "Yes, absolutely. The Academic Mentor and Career Guide tracks operate remotely via structured video calls, phone check-ins, and digital review. We welcome educators, corporate professionals, and the global Odia diaspora who wish to guide promising undergraduate scholars in Odisha.",
  },
  {
    question: "What is the expected monthly time commitment?",
    answer:
      "Academic and Career Mentors commit just 2 to 4 hours monthly (typically two 1-hour sessions per month). College Faculty Liaisons coordinate periodically per semester, while Project Samarth Study Hub Stewards volunteer 4 to 8 hours weekly at local physical centers.",
  },
  {
    question: "Do volunteers receive an honorarium or certificate of service?",
    answer:
      "All volunteer and mentor positions at MAHAVIR TRUST are strictly honorary and uncompensated. Subject to formal trustee ratification of volunteer guidelines, long-term mentors who complete an academic cohort may be eligible for an institutional letter of service appreciation.",
  },
  {
    question: "How are scholars selected and paired with mentors?",
    answer:
      "Under proposed operating guidelines, scholars will be evaluated based on verified financial vulnerability and academic merit. Once admitted, scholars will be matched with volunteer mentors in relevant disciplines (e.g. engineering, nursing, commerce, sciences) based on subject alignment and career goals.",
  },
  {
    question: "What safeguarding rules apply to mentor-scholar interactions?",
    answer:
      "MAHAVIR TRUST operates under draft Student Welfare & Safeguarding Guidelines. Mentors may never solicit financial transactions, charge private tuition fees, or communicate outside registered platforms. Any student requiring financial assistance is directed exclusively to the Trust's direct college fee grant scheme.",
  },
  {
    question: "Can current college students apply to become mentors?",
    answer:
      "Final-year post-graduate students and doctoral scholars may apply as Academic Mentors for undergraduate juniors. Undergraduate students are encouraged to participate as Student Hub Volunteers at our proposed Project Samarth reading centers.",
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
    district: "Khordha (Bhubaneswar)",
    roleInterest: "Academic & Entrance Exam Mentor",
    qualification: "Post-Graduate (M.Tech, M.Sc, M.Com, M.A, MCA, MBA)",
    availability: "1 to 2 hours / month (Standard Virtual Track)",
    engagementMode: "Virtual / Remote (Video, Phone & Email)",
    backgroundNotes: "",
    consentDeclared: false,
  });

  const handleSelectRole = (role: string) => {
    setFormData((prev) => ({ ...prev, roleInterest: role }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!formData.consentDeclared) {
      setErrorMessage("You must accept the student safeguarding and ethical mentorship declaration to proceed.");
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
        consentVersion: "v1.0-2026",
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
    <div className="flex flex-col w-full bg-[#FDFBF7] text-[#1C2421]">
      {/* 1. HERO SECTION: Institutional Prestige & Grand Narrative */}
      <section className="relative overflow-hidden bg-[#0A192F] text-[#EDE6D8] pt-14 pb-20 md:pt-20 md:pb-24 border-b border-[#1E3A8A]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1E3A8A]/30 rounded-full blur-3xl pointer-events-none" />

        <Container size="default" className="relative">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-xs text-[#E4C88A]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-white/80">Get Involved</li>
              <li className="text-white/40">/</li>
              <li className="text-white font-semibold" aria-current="page">
                Volunteer & Civic Service Portal
              </li>
            </ol>
          </nav>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E4C88A] text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Est. 2013 • Civic Engagement & Academic Mentorship</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Lend Your Knowledge, Technical Skills & Heart to Empower Odisha’s Youth.
            </h1>

            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-3xl">
              From free remedial education in Balangir rural schools to vocational skill training for women and statewide higher education mentorship, MAHAVIR TRUST connects passionate educators, professionals, and citizens directly with grassroots community needs.
            </p>

            {/* Trust Metrics Pill Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#E4C88A] font-medium">
              <div className="flex items-center gap-1.5 bg-[#1E3A8A]/50 px-3 py-1.5 rounded-xs border border-[#C5A059]/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>100% Non-Commercial</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1E3A8A]/50 px-3 py-1.5 rounded-xs border border-[#C5A059]/30">
                <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Grassroots & Virtual Tracks</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1E3A8A]/50 px-3 py-1.5 rounded-xs border border-[#C5A059]/30">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Flexible 2–4 hrs / month</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1E3A8A]/50 px-3 py-1.5 rounded-xs border border-[#C5A059]/30">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Fiduciary Safeguarding Standards</span>
              </div>
            </div>

            {/* Quick Action Navigation CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#tracks"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xs bg-[#C5A059] text-[#0A192F] text-xs font-bold uppercase tracking-wider hover:bg-[#E4C88A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 focus:ring-offset-[#0A192F]"
              >
                <span>Explore Volunteer Tracks</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="#apply"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xs bg-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 border border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0A192F]"
              >
                <span>Register as a Volunteer</span>
                <Send className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 2. PHILOSOPHY SECTION: The Guidance Deficit */}
      <section className="py-16 md:py-24 bg-[#FDFBF7] border-b border-[#0A192F]/10">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeader
                badge="The Mentorship Philosophy"
                badgeVariant="forest"
                title="Bridging the “Guidance Deficit” for First-Generation College Learners."
                subtitle="In Odisha’s rural and tribal heartlands, hundreds of meritorious students enter undergraduate and professional programs with extraordinary grit, but without family members who have navigated higher education or formal corporate job markets."
              />
              <p className="text-sm text-[#4A5568] leading-relaxed">
                They often lack guidance on entrance tests, resume structuring, workplace culture, or academic persistence. By pairing scholars with empathetic professors, engineers, doctors, and civil servants, MAHAVIR TRUST builds a durable bridge between rural talent and professional achievement.
              </p>

              <div className="p-4 bg-[#F4EFE6] border-l-4 border-[#C5A059] rounded-r-xs">
                <p className="text-xs text-[#0A192F] italic leading-relaxed">
                  “Tuition grants ensure a student enrolls in college; mentorship ensures they graduate with competence, dignity, and career clarity.”
                </p>
                <p className="text-[11px] font-semibold text-[#7A5E24] mt-1">
                  — MAHAVIR TRUST Academic Advisory Charter (Draft)
                </p>
              </div>
            </div>

            {/* Comparison Cards: Trust Support vs Volunteer Role */}
            <div className="lg:col-span-6 space-y-4">
              <Card variant="dark" padding="md" className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#E4C88A]">
                  <Building2 className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-serif text-lg font-bold">What MAHAVIR TRUST Provides</h3>
                </div>
                <ul className="text-xs text-white/80 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Direct non-cash tuition fee settlements with accredited colleges.</li>
                  <li>Curated reference textbook libraries through Project Samarth Study Hubs.</li>
                  <li>Pre-screening and academic verification through our Scrutiny Committee.</li>
                  <li>Institutional liaison to protect scholars from financial dropouts.</li>
                </ul>
              </Card>

              <Card variant="elevated" padding="md" className="space-y-3">
                <div className="flex items-center gap-2.5 text-[#0A192F]">
                  <HeartHandshake className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-serif text-lg font-bold">What Volunteer Mentors Bring</h3>
                </div>
                <ul className="text-xs text-[#4A5568] space-y-2 list-disc list-inside leading-relaxed">
                  <li>One-on-one coursework clarification and entrance exam strategies.</li>
                  <li>Honest workplace orientation and mock interview preparation.</li>
                  <li>Emotional resilience and pastoral encouragement during critical semester exams.</li>
                  <li>Long-term professional networks that rural students rarely possess.</li>
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. FOUR PILLARS: Why Guide Scholars with MAHAVIR TRUST */}
      <section className="py-16 md:py-24 bg-[#F4EFE6] border-b border-[#0A192F]/10">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Institutional Principles"
            badgeVariant="gold"
            title="Four Pillars of Our Mentorship Network."
            subtitle="We operate our volunteering framework with the same fiduciary rigor, privacy protections, and transparency that govern our financial scholarship disbursements."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" padding="md" className="space-y-3 bg-[#FDFBF7] border-t-4 border-t-[#0A192F]">
              <div className="w-10 h-10 rounded-xs bg-[#0A192F]/10 text-[#0A192F] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0A192F]">
                Strictly Non-Commercial
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Purely charitable. Zero fees collected from scholars; zero fees paid to mentors. No commercial coaching solicitation is permitted.
              </p>
            </Card>

            <Card variant="default" padding="md" className="space-y-3 bg-[#FDFBF7] border-t-4 border-t-[#0A192F]">
              <div className="w-10 h-10 rounded-xs bg-[#0A192F]/10 text-[#0A192F] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0A192F]">
                Respect for Your Time
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Structured 2-hour monthly sessions. The secretariat handles scheduling and pre-session topic agendas so your time is utilized with maximum impact.
              </p>
            </Card>

            <Card variant="default" padding="md" className="space-y-3 bg-[#FDFBF7] border-t-4 border-t-[#0A192F]">
              <div className="w-10 h-10 rounded-xs bg-[#0A192F]/10 text-[#0A192F] flex items-center justify-center">
                <FileCheck2 className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0A192F]">
                Pre-Vetted Scholars
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Every mentee has been verified for genuine socio-economic need, bona fide college enrollment, and serious academic commitment.
              </p>
            </Card>

            <Card variant="default" padding="md" className="space-y-3 bg-[#FDFBF7] border-t-4 border-t-[#0A192F]">
              <div className="w-10 h-10 rounded-xs bg-[#0A192F]/10 text-[#0A192F] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#0A192F]">
                Auditable Impact
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Track graduation persistence and career placements. Mentors completing one academic cycle receive institutional recognition.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* 4. ROLE CATALOGUE: Volunteer Service Tracks */}
      <section id="tracks" className="py-16 md:py-24 bg-[#FDFBF7] border-b border-[#0A192F]/10">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Service Tracks"
            badgeVariant="forest"
            title="Six Distinct Volunteer Engagement Tracks."
            subtitle="Whether on the ground in Balangir and rural clusters or connecting remotely via video and telephone, choose the pathway that aligns with your expertise."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Track 1 */}
            <Card variant="elevated" padding="lg" className="flex flex-col justify-between space-y-6 hover:border-[#C5A059] transition-colors border-t-4 border-t-[#0A192F]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A192F] text-[#E4C88A] px-2.5 py-1 rounded-xs">
                    Track 1 • Ground
                  </span>
                  <span className="text-xs font-semibold text-[#7A5E24] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 3–5 hrs / week
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                  Balangir Remedial Education Tutor
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Support Class 6–10 students in Balangir rural schools with evening remedial tutorials in Mathematics, Science, and English to prevent secondary school dropouts.
                </p>

                <div className="pt-2 border-t border-[#0A192F]/10 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Prerequisites:</span>
                    <span className="font-semibold text-[#0A192F]">Graduate / B.Ed / College Student</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Location:</span>
                    <span className="font-semibold text-[#0A192F]">Balangir District (On-Ground)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4A5568]">Target Group:</span>
                    <span className="font-semibold text-[#0A192F]">350+ Rural School Learners</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0A192F]/10">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full text-xs uppercase tracking-wider font-bold !bg-[#0A192F] hover:!bg-[#1E3A8A]"
                  onClick={() => handleSelectRole("Balangir Remedial Education Tutor (Class 6-10)")}
                >
                  <span>Apply as Remedial Tutor</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] ml-1" />
                </Button>
              </div>
            </Card>

            {/* Track 2 */}
            <Card variant="elevated" padding="lg" className="flex flex-col justify-between space-y-6 hover:border-[#C5A059] transition-colors border-t-4 border-t-[#C5A059]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#C5A059] text-[#0A192F] px-2.5 py-1 rounded-xs">
                    Track 2 • Ground
                  </span>
                  <span className="text-xs font-semibold text-[#7A5E24] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 2–4 hrs / week
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                  Women Vocational & Tailoring Mentor
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Provide sewing, pattern-making, garment design, quality inspection, and basic micro-business financial coaching for rural women trainees.
                </p>

                <div className="pt-2 border-t border-[#0A192F]/10 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Prerequisites:</span>
                    <span className="font-semibold text-[#0A192F]">Tailoring / Fashion / Craft Skills</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Location:</span>
                    <span className="font-semibold text-[#0A192F]">Balangir Training Centre</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4A5568]">Target Group:</span>
                    <span className="font-semibold text-[#0A192F]">Rural Women Trainees</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0A192F]/10">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full text-xs uppercase tracking-wider font-bold !bg-[#0A192F] hover:!bg-[#1E3A8A]"
                  onClick={() => handleSelectRole("Women Vocational & Tailoring Mentor")}
                >
                  <span>Apply as Vocational Mentor</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] ml-1" />
                </Button>
              </div>
            </Card>

            {/* Track 3 */}
            <Card variant="elevated" padding="lg" className="flex flex-col justify-between space-y-6 hover:border-[#C5A059] transition-colors border-t-4 border-t-[#0A192F]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A192F] text-[#E4C88A] px-2.5 py-1 rounded-xs">
                    Track 3 • Virtual
                  </span>
                  <span className="text-xs font-semibold text-[#7A5E24] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 2–4 hrs / month
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                  Academic & Entrance Exam Mentor
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Guide undergraduate students in core subject dilemmas, review challenging coursework concepts, and advise on national/state entrance examinations (GATE, OPSC, IIT-JAM, NET).
                </p>

                <div className="pt-2 border-t border-[#0A192F]/10 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Prerequisites:</span>
                    <span className="font-semibold text-[#0A192F]">Post-Graduate / Ph.D. / Faculty</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Engagement:</span>
                    <span className="font-semibold text-[#0A192F]">Virtual (Video / Phone)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4A5568]">Target Group:</span>
                    <span className="font-semibold text-[#0A192F]">B.Tech, B.Sc, B.Com Scholars</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0A192F]/10">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full text-xs uppercase tracking-wider font-bold !bg-[#0A192F] hover:!bg-[#1E3A8A]"
                  onClick={() => handleSelectRole("Academic & Entrance Exam Mentor (Higher Ed)")}
                >
                  <span>Apply for Academic Mentorship</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] ml-1" />
                </Button>
              </div>
            </Card>

            {/* Track 4 */}
            <Card variant="elevated" padding="lg" className="flex flex-col justify-between space-y-6 hover:border-[#C5A059] transition-colors border-t-4 border-t-[#0A192F]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A192F] text-[#E4C88A] px-2.5 py-1 rounded-xs">
                    Track 4 • Virtual
                  </span>
                  <span className="text-xs font-semibold text-[#7A5E24] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 2 hrs / month
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                  Career & Industry Guide
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Support final-year scholars with resume structuring, technical/HR mock interviews, workplace etiquette, and navigating entry-level corporate or civil service recruitment.
                </p>

                <div className="pt-2 border-t border-[#0A192F]/10 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Prerequisites:</span>
                    <span className="font-semibold text-[#0A192F]">3+ Years Professional Exp</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Engagement:</span>
                    <span className="font-semibold text-[#0A192F]">Virtual (Video / Phone)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4A5568]">Target Group:</span>
                    <span className="font-semibold text-[#0A192F]">Final-Year Degree Scholars</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0A192F]/10">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full text-xs uppercase tracking-wider font-bold !bg-[#0A192F] hover:!bg-[#1E3A8A]"
                  onClick={() => handleSelectRole("Career & Industry Guide (Mock Interviews)")}
                >
                  <span>Apply for Career Mentorship</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] ml-1" />
                </Button>
              </div>
            </Card>

            {/* Track 5 */}
            <Card variant="elevated" padding="lg" className="flex flex-col justify-between space-y-6 hover:border-[#C5A059] transition-colors border-t-4 border-t-[#0A192F]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A192F] text-[#E4C88A] px-2.5 py-1 rounded-xs">
                    Track 5 • Hybrid
                  </span>
                  <span className="text-xs font-semibold text-[#7A5E24] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 4–8 hrs / week
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                  Project Samarth Hub Steward
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Provide physical stewardship at rural and semi-urban learning hubs. Manage book loan records, ensure digital terminal operation, and maintain quiet study hours.
                </p>

                <div className="pt-2 border-t border-[#0A192F]/10 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Prerequisites:</span>
                    <span className="font-semibold text-[#0A192F]">Local Resident / Graduate</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Engagement:</span>
                    <span className="font-semibold text-[#0A192F]">In-Person at District Learning Hub</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4A5568]">Priority Districts:</span>
                    <span className="font-semibold text-[#0A192F]">Balangir, Koraput, Sundargarh</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0A192F]/10">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full text-xs uppercase tracking-wider font-bold !bg-[#0A192F] hover:!bg-[#1E3A8A]"
                  onClick={() => handleSelectRole("Project Samarth Community Hub Steward")}
                >
                  <span>Apply as Hub Steward</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] ml-1" />
                </Button>
              </div>
            </Card>

            {/* Track 6 */}
            <Card variant="elevated" padding="lg" className="flex flex-col justify-between space-y-6 hover:border-[#C5A059] transition-colors border-t-4 border-t-[#0A192F]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A192F] text-[#E4C88A] px-2.5 py-1 rounded-xs">
                    Track 6 • Institutional
                  </span>
                  <span className="text-xs font-semibold text-[#7A5E24] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 1–2 hrs / semester
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                  College & Faculty Liaison
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Serve as our trusted institutional contact in degree and polytechnic colleges across Odisha to verify student bona fide enrollments, validate fee structures, and flag drop-out risks.
                </p>

                <div className="pt-2 border-t border-[#0A192F]/10 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Prerequisites:</span>
                    <span className="font-semibold text-[#0A192F]">College Faculty / Admin Staff</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#0A192F]/5">
                    <span className="text-[#4A5568]">Engagement:</span>
                    <span className="font-semibold text-[#0A192F]">Institutional / On-Campus</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#4A5568]">Scope:</span>
                    <span className="font-semibold text-[#0A192F]">Statewide Degree Colleges</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0A192F]/10">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full text-xs uppercase tracking-wider font-bold !bg-[#0A192F] hover:!bg-[#1E3A8A]"
                  onClick={() => handleSelectRole("College & Faculty Institutional Liaison")}
                >
                  <span>Apply as Faculty Liaison</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] ml-1" />
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* 5. INDUCTION PATHWAY: 4-Stage Onboarding Process */}
      <section className="py-16 md:py-24 bg-[#F4EFE6] border-b border-[#0A192F]/10">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Proposed Onboarding"
            badgeVariant="gold"
            title="The Proposed Four-Stage Volunteer Induction Pathway."
            subtitle="To safeguard both scholars and volunteers, every applicant will complete a structured screening and induction process before mentoring begins."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" padding="md" className="space-y-3 bg-[#FDFBF7]">
              <span className="font-serif text-3xl font-bold text-[#C5A059]">01</span>
              <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                Expression of Interest
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Submit your profile, academic credentials, district location, and preferred role through the registration portal below.
              </p>
            </Card>

            <Card variant="default" padding="md" className="space-y-3 bg-[#FDFBF7]">
              <span className="font-serif text-3xl font-bold text-[#C5A059]">02</span>
              <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                Secretariat Review [Proposed]
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Secretariat coordinator conducts preliminary review of submitted academic credentials and proposed track alignment.
              </p>
            </Card>

            <Card variant="default" padding="md" className="space-y-3 bg-[#FDFBF7]">
              <span className="font-serif text-3xl font-bold text-[#C5A059]">03</span>
              <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                Safeguarding Orientation [Proposed]
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Prospective volunteers review draft student welfare guidelines, ethical boundaries, and non-commercial service principles.
              </p>
            </Card>

            <Card variant="default" padding="md" className="space-y-3 bg-[#FDFBF7]">
              <span className="font-serif text-3xl font-bold text-[#C5A059]">04</span>
              <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                Scholar Matching [Proposed]
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Subject to admitted scholar cohorts, matched profiles are assigned with periodic administrative progress check-ins.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* 6. SAFEGUARDING & CODE OF CONDUCT CALLOUT */}
      <section className="py-12 md:py-16 bg-[#FDFBF7] border-b border-[#0A192F]/10">
        <Container size="default">
          <Card variant="dark" padding="lg" className="space-y-6 border border-[#C5A059]/40">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-[#C5A059] shrink-0" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Draft Student Welfare & Safeguarding Guidelines (Subject to Trustee Formalisation)
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              MAHAVIR TRUST maintains a zero-tolerance policy against any form of exploitation, commercial solicitation, or unauthorized financial transactions involving students.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
              <div className="space-y-1.5 p-4 bg-white/5 rounded-xs border border-white/10">
                <span className="font-bold text-[#E4C88A]">Zero Commercial Solicitation</span>
                <p className="text-white/75 leading-relaxed">
                  Volunteers may never offer paid coaching, commercial tutoring, or solicit donations directly from assigned scholars.
                </p>
              </div>

              <div className="space-y-1.5 p-4 bg-white/5 rounded-xs border border-white/10">
                <span className="font-bold text-[#E4C88A]">Official Communication Channels</span>
                <p className="text-white/75 leading-relaxed">
                  All mentoring interactions must be conducted via scheduled video links or registered institutional emails with pastoral oversight.
                </p>
              </div>

              <div className="space-y-1.5 p-4 bg-white/5 rounded-xs border border-white/10">
                <span className="font-bold text-[#E4C88A]">Confidential Student Records</span>
                <p className="text-white/75 leading-relaxed">
                  Student family backgrounds and financial vulnerability data are strictly confidential and protected under DPDPA standards.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[#E4C88A] pt-2">
              Questions or ethics disclosures may be communicated to the Secretariat Desk:{" "}
              <a href={`mailto:${TRUST_CONFIG.contact.generalEmail}?subject=Safeguarding%20Inquiry`} className="underline hover:text-white">
                {TRUST_CONFIG.contact.generalEmail}
              </a>
            </p>
          </Card>
        </Container>
      </section>

      {/* 7. GEOGRAPHIC SCOPE: Odisha District Focus */}
      <section className="py-16 md:py-20 bg-[#FDFBF7] border-b border-[#0A192F]/10">
        <Container size="default" className="space-y-8">
          <SectionHeader
            badge="Proposed Regional Reach"
            badgeVariant="forest"
            title="Proposed Geographic Reach Across All 30 Districts of Odisha."
            subtitle="While physical study hub facilities remain proposed initiatives subject to formal site selection and local trustee approval, the proposed virtual mentorship network aims to connect students across all 30 districts of Odisha with remote mentors."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" padding="md" className="bg-[#F4EFE6] border-[#0A192F]/15 space-y-2">
              <div className="flex items-center gap-2 text-[#0A192F] font-bold text-sm">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>Proposed Rural & Tribal Pilot Zones</span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Mayurbhanj, Koraput, Rayagada, Malkangiri, Nabarangpur, Kalahandi. Target pilot zones for prospective hub stewards and college liaisons.
              </p>
            </Card>

            <Card variant="default" padding="md" className="bg-[#F4EFE6] border-[#0A192F]/15 space-y-2">
              <div className="flex items-center gap-2 text-[#0A192F] font-bold text-sm">
                <Building2 className="w-4 h-4 text-[#C5A059]" />
                <span>Proposed Higher Education Corridors</span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Khordha (Bhubaneswar), Cuttack, Sundargarh (Rourkela), Sambalpur, Balasore, Ganjam. Target zones for degree and polytechnic college liaisons.
              </p>
            </Card>

            <Card variant="default" padding="md" className="bg-[#F4EFE6] border-[#0A192F]/15 space-y-2">
              <div className="flex items-center gap-2 text-[#0A192F] font-bold text-sm">
                <Globe2 className="w-4 h-4 text-[#C5A059]" />
                <span>Proposed Remote & Diaspora Network</span>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Mentors outside Odisha and global NRIs. Digital sessions bridge geographic distance to offer academic and industry perspectives.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* 8. APPLICATION DESK: Complete Responsive Form */}
      <section id="apply" ref={formRef} className="py-16 md:py-24 bg-[#F4EFE6]">
        <Container size="narrow">
          <Card variant="elevated" padding="lg" className="space-y-8 bg-white">
            <div className="border-b border-[#0A192F]/10 pb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[#0A192F]/10 text-[#0A192F] text-[11px] font-bold uppercase tracking-wider">
                <FileCheck2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Official Volunteer Intake</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
                Register as an Academic Mentor or Community Volunteer
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5568]">
                Please complete all fields below. Our Volunteer Coordinator will review your submission and contact you for orientation within 5 business days.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 bg-[#0A192F] text-white rounded-xs space-y-4 text-center animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-[#C5A059] mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-white">
                  Volunteer Application Successfully Recorded
                </h3>
                {referenceId && (
                  <p className="text-xs font-mono text-[#E4C88A] bg-black/30 py-1.5 px-4 rounded-xs inline-block border border-[#C5A059]/40">
                    Application Reference ID: #{referenceId}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-lg mx-auto">
                  Thank you for dedicating your time and knowledge to Odisha’s scholars. The Secretariat Desk will review your qualifications and reach out via email with orientation dates and safeguarding guidelines.
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    className="text-xs !border-[#C5A059] !text-[#E4C88A] hover:!bg-[#C5A059]/20"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        district: "Khordha (Bhubaneswar)",
                        roleInterest: "Academic & Entrance Exam Mentor",
                        qualification: "Post-Graduate (M.Tech, M.Sc, M.Com, M.A, MCA, MBA)",
                        availability: "1 to 2 hours / month (Standard Virtual Track)",
                        engagementMode: "Virtual / Remote (Video, Phone & Email)",
                        backgroundNotes: "",
                        consentDeclared: false,
                      });
                    }}
                  >
                    Register Another Volunteer
                  </Button>
                  <Link href="/programmes">
                    <Button variant="gold" size="sm">
                      <span>Explore Programmes</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xs text-xs flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    id="vol-fullname"
                    name="fullName"
                    type="text"
                    required
                    maxLength={150}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Prof. Sandeep Mohanty"
                  />

                  <Input
                    label="Email Address"
                    id="vol-email"
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sandeep.m@example.org"
                  />
                </div>

                {/* Row 2: Phone & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Phone / Mobile Number"
                    id="vol-phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={30}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />

                  <Select
                    label="Location / District in Odisha"
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
                    label="Preferred Volunteer Track"
                    id="vol-role"
                    name="roleInterest"
                    required
                    value={formData.roleInterest}
                    onChange={(e) => setFormData({ ...formData, roleInterest: e.target.value })}
                    options={VOLUNTEER_ROLES.map((r) => ({ value: r, label: r }))}
                  />

                  <Select
                    label="Highest Qualification"
                    id="vol-qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    options={QUALIFICATIONS.map((q) => ({ value: q, label: q }))}
                  />
                </div>

                {/* Row 4: Availability & Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    label="Time Availability"
                    id="vol-availability"
                    name="availability"
                    required
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    options={AVAILABILITY_OPTIONS.map((a) => ({ value: a, label: a }))}
                  />

                  <Select
                    label="Preferred Engagement Mode"
                    id="vol-mode"
                    name="engagementMode"
                    value={formData.engagementMode}
                    onChange={(e) => setFormData({ ...formData, engagementMode: e.target.value })}
                    options={ENGAGEMENT_MODES.map((m) => ({ value: m, label: m }))}
                  />
                </div>

                {/* Background Notes */}
                <Textarea
                  label="Academic / Professional Background & Subject Areas"
                  id="vol-notes"
                  name="backgroundNotes"
                  rows={4}
                  maxLength={2000}
                  showCount
                  value={formData.backgroundNotes}
                  onChange={(e) => setFormData({ ...formData, backgroundNotes: e.target.value })}
                  placeholder="Briefly describe your discipline (e.g. Physics, Mechanical Engg, Nursing, Banking), your institution/employer, and how you would like to guide scholars..."
                />

                {/* Mandatory Consent Checkbox */}
                <div className="p-4 bg-[#F4EFE6] rounded-xs border border-[#0A192F]/10 space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      id="vol-consent"
                      type="checkbox"
                      checked={formData.consentDeclared}
                      onChange={(e) => setFormData({ ...formData, consentDeclared: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-[#0A192F] border-[#0A192F]/30 rounded-xs focus:ring-[#C5A059]"
                    />
                    <span className="text-xs text-[#0A192F] leading-relaxed select-none">
                      <strong>Institutional Declaration & Safeguarding Consent:</strong> I declare that all information provided is authentic. I agree to uphold MAHAVIR TRUST draft voluntary service principles and student safeguarding guidelines.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full justify-center !py-3.5 text-xs uppercase tracking-wider font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Logging Volunteer Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      <span>Submit Volunteer Registration</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </Card>
        </Container>
      </section>

      {/* 9. FAQ & SECRETARIAT DESK */}
      <section className="py-16 md:py-24 bg-[#FDFBF7] border-b border-[#0A192F]/10">
        <Container size="narrow" className="space-y-12">
          <SectionHeader
            badge="Clarifications"
            badgeVariant="forest"
            title="Frequently Asked Questions on Mentorship."
            subtitle="Find answers to common questions about time commitments, volunteer recognition, scholar matching, and remote participation."
            align="center"
          />

          <Accordion items={FAQ_ITEMS} />

          {/* Secretariat Support Desk Card */}
          <Card variant="dark" padding="lg" className="flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C5A059]/30">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                <HelpCircle className="w-5 h-5 text-[#C5A059]" />
                Institutional & College Collaboration Desk
              </h3>
              <p className="text-xs text-white/80 max-w-lg">
                Are you a college principal, faculty dean, or corporate CSR representative interested in group volunteer cohorts?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={`mailto:${TRUST_CONFIG.contact.generalEmail}?subject=Institutional%20Volunteer%20Collaboration`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xs bg-[#C5A059] text-[#0A192F] text-xs font-bold uppercase tracking-wider hover:bg-[#E4C88A] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{TRUST_CONFIG.contact.generalEmail}</span>
              </a>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}
