import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Accordion, type FAQItem } from "@/components/Accordion";
import {
  GraduationCap,
  Users,
  Scale,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Mail,
  FileCheck2,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — MAHAVIR TRUST",
  description:
    "Comprehensive answers concerning scholarship eligibility, direct college disbursal, institutional governance, Project Samarth study hubs, and volunteer induction.",
};

const SCHOLARSHIP_FAQS: FAQItem[] = [
  {
    category: "Scholarships",
    question: "Who is eligible to apply for MAHAVIR TRUST scholarships?",
    answer:
      "Eligible applicants must be permanent residents of Odisha or enrolled in accredited higher education institutions across Odisha. Eligibility requires demonstrated financial need (family income within defined means thresholds) combined with consistent academic merit in Class 10/12 or qualifying undergraduate/diploma examinations.",
  },
  {
    category: "Scholarships",
    question: "How does MAHAVIR TRUST disburse scholarship funds?",
    answer:
      "MAHAVIR TRUST enforces a strict zero-cash intermediary policy. Approved scholarship awards are disbursed 100% via direct electronic bank transfer (NEFT/RTGS) directly to the verified bank account of the recipient's accredited educational institution against an official fee demand invoice.",
  },
  {
    category: "Scholarships",
    question: "Is there any application fee or processing charge?",
    answer:
      "None whatsoever. MAHAVIR TRUST never charges any application, registration, evaluation, or processing fee. All application procedures and desk evaluations are 100% free of cost. Beware of touts or unauthorized agents claiming to expedite applications.",
  },
  {
    category: "Scholarships",
    question: "What documentation is required during the application process?",
    answer:
      "Applicants must furnish a government-issued photo ID (Aadhaar), official domicile/residence certificate of Odisha, recent income certificate issued by a competent revenue authority (Tahasildar), academic marksheets, college admission/bonafide certificate, and verified institutional fee structure.",
  },
  {
    category: "Scholarships",
    question: "Can students with existing government scholarships (e.g. Medhabruti) apply?",
    answer:
      "Yes. The Trust provides supplemental assistance for verified gaps in living expenses, laboratory supplies, examination fees, and hostel accommodation, provided the aggregate financial aid does not exceed total verified institutional education costs.",
  },
];

const MENTORSHIP_FAQS: FAQItem[] = [
  {
    category: "Mentorship",
    question: "Is academic mentorship mandatory for scholarship recipients?",
    answer:
      "Yes. Financial aid is paired with 1-on-1 mentorship through the Pratibha Fellowship. Scholars participate in bi-monthly virtual or in-person sessions covering academic goal-setting, English communication, entrance exam preparation, and career readiness.",
  },
  {
    category: "Mentorship",
    question: "Who are the mentors assigned to students?",
    answer:
      "Mentors include experienced university professors, research scholars, civil servants, software engineers, medical professionals, and corporate leaders who volunteer their time under the MAHAVIR TRUST Fellowship Charter.",
  },
  {
    category: "Mentorship",
    question: "Does the Trust offer competitive examination guidance?",
    answer:
      "Yes. Through our academic networks and study hubs, scholars receive curated study materials, test series access, and guidance for examinations such as GATE, OPSC, UPSC, banking, and postgraduate entrance tests.",
  },
  {
    category: "Mentorship",
    question: "What happens if a scholar cannot attend a scheduled mentorship session?",
    answer:
      "We accommodate genuine academic exam schedules and health emergencies. Scholars notify their designated coordinator at least 24 hours in advance to reschedule within the same calendar month.",
  },
];

const GOVERNANCE_FAQS: FAQItem[] = [
  {
    category: "Governance",
    question: "How does MAHAVIR TRUST ensure impartiality in beneficiary selection?",
    answer:
      "Scholar selection is governed by an independent Academic Advisory Committee operating on standardized, double-blind evaluation rubrics. Individual Trustees possess zero unilateral discretion over scholarship awards or beneficiary allocations.",
  },
  {
    category: "Governance",
    question: "What is the statutory and legal registration status of the Trust?",
    answer:
      "MAHAVIR TRUST is established as an irrevocable public charitable educational trust under the Indian Trusts Act, 1882, governed by a public Fiduciary Deed with registration under Sections 12AB and 80G of the Income-tax Act, 1961.",
  },
  {
    category: "Governance",
    question: "Are the Trust's annual financial statements and audits publicly accessible?",
    answer:
      "Yes. In strict adherence to our Transparency Charter, all statutory audit reports (Form 10B), audited balance sheets, and annual program expenditure statements are published openly on our Governance portal upon completion of statutory filing.",
  },
  {
    category: "Governance",
    question: "What conflict-of-interest policies bind the Board of Trustees?",
    answer:
      "Trustees serve entirely on an honorary basis with zero sitting fees, honoraria, or dividend distributions. No commercial contracts or service retainers may be awarded to any trustee, relative, or associated firm.",
  },
];

const STUDY_HUBS_FAQS: FAQItem[] = [
  {
    category: "Study Hubs",
    question: "What is Project Samarth and what facilities does a Community Study Hub provide?",
    answer:
      "Project Samarth establishes quiet, solar-electrified learning environments in semi-urban and rural district clusters of Odisha. Each hub provides rooftop solar power backup, filtered broadband Wi-Fi, physical textbook libraries, reference reading desks, and volunteer mentoring space.",
  },
  {
    category: "Study Hubs",
    question: "Who is allowed to access Project Samarth Community Study Hubs?",
    answer:
      "Access is completely free for all bona fide students preparing for secondary, higher secondary, college, or competitive entrance examinations, subject to basic digital desk registration and adherence to quiet study norms.",
  },
  {
    category: "Study Hubs",
    question: "In which districts are Study Hubs being established?",
    answer:
      "Implementation follows a phased 30-district rollout starting with high-need pilot clusters across Cuttack, Khordha, Mayurbhanj, Kalahandi, and Balasore, expanding systematically across Western and Southern Odisha.",
  },
  {
    category: "Study Hubs",
    question: "How are study hubs maintained and supervised?",
    answer:
      "Hubs are supervised by local Volunteer Study Center Stewards in coordination with host college libraries and community educational trusts.",
  },
];

const VOLUNTEER_FAQS: FAQItem[] = [
  {
    category: "Volunteering",
    question: "Who can volunteer with MAHAVIR TRUST?",
    answer:
      "We invite educators, working professionals, retired academicians, and senior university scholars who possess a strong ethical commitment to educational equity in Odisha.",
  },
  {
    category: "Volunteering",
    question: "What is the time commitment required for volunteers?",
    answer:
      "Depending on the track, time commitments range from 2 to 4 hours per week for Academic Tutors and Career Mentors to 4 to 6 hours per week for Study Hub Stewards.",
  },
  {
    category: "Volunteering",
    question: "Is background verification mandatory for volunteers?",
    answer:
      "Yes. In compliance with our Child Protection & Safeguarding Policy, all volunteer applicants undergo credential verification, identity verification, and sign an institutional Code of Conduct prior to student engagement.",
  },
  {
    category: "Volunteering",
    question: "Do volunteers receive recognition or certification?",
    answer:
      "Yes. Volunteers who complete at least six months of continuous service receive an official Institutional Fellowship Certificate detailing their mentoring hours and district impact.",
  },
];

const DONATIONS_FAQS: FAQItem[] = [
  {
    category: "Donations",
    question: "Can I make a monetary donation online today?",
    answer:
      "On this pre-launch informational platform, online payment gateways are inactive pending formal regulatory gazetting. Philanthropists and CSR partners may record an intent of endowment directly with the Secretariat.",
  },
  {
    category: "Donations",
    question: "Will donations be eligible for Section 80G tax deductions?",
    answer:
      "Yes. Following completion of statutory certifications, all eligible donations will receive formal Section 80G tax deduction receipts with QR-coded digital audit verification.",
  },
  {
    category: "Donations",
    question: "Does the Trust employ fundraising agencies or pay commissions?",
    answer:
      "Zero. MAHAVIR TRUST strictly prohibits fundraising commissions, third-party telemarketing, and percentage-based donor fees. 100% of public endowments directly fund educational subsidies and community learning infrastructure.",
  },
];

export default function FAQPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Knowledge Base"
        title="Frequently Asked Questions"
        description="Comprehensive answers concerning scholarship appraisal, institutional governance, mentorship requirements, and community study infrastructure."
        breadcrumbs={[{ label: "Frequently Asked Questions" }]}
        actions={
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#categories">
              <Button variant="primary" className="!bg-[#C5A059] !text-[#0B3B24] hover:!bg-[#E4C88A]">
                Browse Categories
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
            <a href="#helpdesk">
              <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                Contact Secretariat
              </Button>
            </a>
          </div>
        }
      />

      {/* 2. Category Jump Directory */}
      <section id="categories" className="py-16 md:py-20 bg-[#FDFBF7] border-b border-[#0B3B24]/10 scroll-mt-20">
        <Container size="default">
          <SectionHeader
            badge="Thematic Directory"
            title="Explore Knowledge Base by Domain"
            subtitle="Quickly navigate to verified institutional policies and operational procedures."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            <a href="#scholarships" className="group">
              <Card variant="elevated" className="p-6 space-y-3 transition-transform duration-200 group-hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 flex items-center justify-center text-[#0B3B24] group-hover:bg-[#0B3B24] group-hover:text-white transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#0B3B24]">Scholarships & Aid</h3>
                  <Badge variant="gold">5 Questions</Badge>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Eligibility criteria, direct-to-college disbursals, zero fee policy, and required documents.
                </p>
              </Card>
            </a>

            <a href="#mentorship" className="group">
              <Card variant="elevated" className="p-6 space-y-3 transition-transform duration-200 group-hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 flex items-center justify-center text-[#0B3B24] group-hover:bg-[#0B3B24] group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#0B3B24]">Mentorship & Fellows</h3>
                  <Badge variant="gold">4 Questions</Badge>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  1-on-1 career mapping, mentor background profiles, exam prep, and attendance guidelines.
                </p>
              </Card>
            </a>

            <a href="#governance" className="group">
              <Card variant="elevated" className="p-6 space-y-3 transition-transform duration-200 group-hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 flex items-center justify-center text-[#0B3B24] group-hover:bg-[#0B3B24] group-hover:text-white transition-colors">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#0B3B24]">Statutory Governance</h3>
                  <Badge variant="gold">4 Questions</Badge>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Trustee non-conflict rules, Section 12AB/80G status, Form 10B audits, and impartiality.
                </p>
              </Card>
            </a>

            <a href="#study-hubs" className="group">
              <Card variant="elevated" className="p-6 space-y-3 transition-transform duration-200 group-hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 flex items-center justify-center text-[#0B3B24] group-hover:bg-[#0B3B24] group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#0B3B24]">Project Samarth</h3>
                  <Badge variant="gold">4 Questions</Badge>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Community study hubs, solar power continuity, free Wi-Fi, and district library networks.
                </p>
              </Card>
            </a>

            <a href="#volunteering" className="group">
              <Card variant="elevated" className="p-6 space-y-3 transition-transform duration-200 group-hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 flex items-center justify-center text-[#0B3B24] group-hover:bg-[#0B3B24] group-hover:text-white transition-colors">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#0B3B24]">Volunteer Induction</h3>
                  <Badge variant="gold">4 Questions</Badge>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Academic qualifications, child safeguarding, hours commitment, and fellowship certificates.
                </p>
              </Card>
            </a>

            <a href="#donations" className="group">
              <Card variant="elevated" className="p-6 space-y-3 transition-transform duration-200 group-hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 flex items-center justify-center text-[#0B3B24] group-hover:bg-[#0B3B24] group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#0B3B24]">Transparency Pledge</h3>
                  <Badge variant="gold">3 Questions</Badge>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Zero commission policy, pre-launch endowments, 80G tax deductions, and CSR collaboration.
                </p>
              </Card>
            </a>
          </div>
        </Container>
      </section>

      {/* 3. Thematic FAQ Accordions */}
      <section className="py-16 md:py-24 bg-[#F7F4EE] space-y-16">
        {/* Category 1 */}
        <div id="scholarships" className="scroll-mt-24">
          <Container size="narrow">
            <SectionHeader
              badge="Scholarships & Financial Aid"
              title="Scholarship Appraisal & Direct Disbursal"
              subtitle="Guidelines covering means-and-merit evaluation, zero intermediary rules, and required documentation."
            />
            <div className="mt-8 bg-[#FDFBF7] p-6 sm:p-8 rounded-xs border border-[#0B3B24]/10 shadow-sm">
              <Accordion items={SCHOLARSHIP_FAQS} />
            </div>
          </Container>
        </div>

        {/* Category 2 */}
        <div id="mentorship" className="scroll-mt-24">
          <Container size="narrow">
            <SectionHeader
              badge="Mentorship & Career Fellowship"
              title="Pratibha Mentorship Program"
              subtitle="Policies regarding 1-on-1 scholar pairing, academic coaching, and attendance expectations."
            />
            <div className="mt-8 bg-[#FDFBF7] p-6 sm:p-8 rounded-xs border border-[#0B3B24]/10 shadow-sm">
              <Accordion items={MENTORSHIP_FAQS} />
            </div>
          </Container>
        </div>

        {/* Category 3 */}
        <div id="governance" className="scroll-mt-24">
          <Container size="narrow">
            <SectionHeader
              badge="Statutory Governance & Audit"
              title="Fiduciary Oversight & Impartiality"
              subtitle="Legal registration, non-conflict charters, Form 10B public audits, and Trustee governance."
            />
            <div className="mt-8 bg-[#FDFBF7] p-6 sm:p-8 rounded-xs border border-[#0B3B24]/10 shadow-sm">
              <Accordion items={GOVERNANCE_FAQS} />
            </div>
          </Container>
        </div>

        {/* Category 4 */}
        <div id="study-hubs" className="scroll-mt-24">
          <Container size="narrow">
            <SectionHeader
              badge="Community Study Hubs"
              title="Project Samarth Infrastructure"
              subtitle="District learning centers, solar power backup, digital reference facilities, and access terms."
            />
            <div className="mt-8 bg-[#FDFBF7] p-6 sm:p-8 rounded-xs border border-[#0B3B24]/10 shadow-sm">
              <Accordion items={STUDY_HUBS_FAQS} />
            </div>
          </Container>
        </div>

        {/* Category 5 */}
        <div id="volunteering" className="scroll-mt-24">
          <Container size="narrow">
            <SectionHeader
              badge="Volunteering & Fellowship"
              title="Volunteer Induction & Code of Conduct"
              subtitle="Eligibility, safeguarding verifications, time commitments, and institutional certification."
            />
            <div className="mt-8 bg-[#FDFBF7] p-6 sm:p-8 rounded-xs border border-[#0B3B24]/10 shadow-sm">
              <Accordion items={VOLUNTEER_FAQS} />
            </div>
          </Container>
        </div>

        {/* Category 6 */}
        <div id="donations" className="scroll-mt-24">
          <Container size="narrow">
            <SectionHeader
              badge="Transparency & Donors"
              title="Endowments & Non-Intermediary Pledge"
              subtitle="Zero commission principles, Section 80G tax deductions, and CSR collaboration protocols."
            />
            <div className="mt-8 bg-[#FDFBF7] p-6 sm:p-8 rounded-xs border border-[#0B3B24]/10 shadow-sm">
              <Accordion items={DONATIONS_FAQS} />
            </div>
          </Container>
        </div>
      </section>

      {/* 4. Secretariat Helpdesk & Query Escalation Desk */}
      <section id="helpdesk" className="py-16 md:py-24 bg-[#0B3B24] text-white scroll-mt-20">
        <Container size="narrow">
          <Card variant="dark" className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-14 h-14 rounded-xs bg-[#C5A059]/20 flex items-center justify-center text-[#E4C88A] mx-auto">
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <Badge variant="gold">Direct Secretariat Support</Badge>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Didn’t Find the Answer to Your Question?
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
                Our administrative secretariat is at your service. Whether you are a student requiring scholarship clarification, an educator proposing a study hub, or a prospective volunteer, we are here to assist.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/contact">
                <Button variant="primary" className="!bg-[#C5A059] !text-[#0B3B24] hover:!bg-[#E4C88A]">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Secretariat Desk
                </Button>
              </Link>
              <Link href="/volunteer">
                <Button variant="outline" className="!border-[#E4C88A] !text-[#E4C88A] hover:!bg-[#E4C88A]/15">
                  <Users className="w-4 h-4 mr-2" />
                  Explore Volunteer Fellowship
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-white/60">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E4C88A] inline mr-1 -mt-0.5" />
              Direct Secretariat Helpline: <strong>+91 671 234 5678</strong> (Mon–Fri, 10:00 AM – 5:00 PM IST)
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}
