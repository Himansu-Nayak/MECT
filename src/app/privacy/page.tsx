import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Lock,
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  Mail,
  UserCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — MAHAVIR TRUST",
  description:
    "Data privacy and student confidentiality commitments of MAHAVIR TRUST in Odisha, India, aligned with the Digital Personal Data Protection Act, 2023.",
};

const PRIVACY_SECTIONS = [
  {
    number: "01",
    title: "Commitment to Student & Applicant Dignity",
    content:
      "MAHAVIR TRUST recognizes that applying for need-based higher education aid requires the disclosure of sensitive family financial records. We hold that preserving applicant dignity is an inviolable ethical duty. All submitted income certificates, residential affidavits, and personal statements are treated with the highest degree of confidentiality and are never shared publicly.",
  },
  {
    number: "02",
    title: "Categories of Information Collected",
    content:
      "Data collection through this portal is restricted to information voluntarily furnished by applicants, guardians, volunteer mentors, and institutional correspondents:",
    bullets: [
      "Contact Information: Full legal name, permanent address, verified email, and mobile telephone numbers.",
      "Academic Records: Enrollment registration numbers, course stream, university affiliation, and certified marksheets.",
      "Economic Verifications: Household income certificates issued by competent revenue authorities (Tahasildar) and ration/BPL documentation solely for means verification.",
      "Volunteer Details: Educational credentials, professional affiliations, and safeguarding declarations for prospective mentors.",
    ],
  },
  {
    number: "03",
    title: "Lawful & Charitable Purpose of Processing",
    content:
      "Personal information is processed strictly by authorized secretariat coordinators and the Academic Advisory Committee for designated charitable purposes:",
    bullets: [
      "Appraising means-cum-merit eligibility for scholarship grant allocations.",
      "Direct verification with accredited educational institutions for tuition remittances.",
      "Pairing scholars with professional mentors under the Pratibha Fellowship Charter.",
      "Fulfilling statutory audit and reporting compliance mandated under the Indian Trusts Act and Income-tax Act (Form 10B).",
    ],
  },
  {
    number: "04",
    title: "Inviolable Non-Commercialization Pledge",
    content:
      "MAHAVIR TRUST operates under a strict, absolute prohibition against data commercialization. We do not sell, rent, monetize, or trade applicant information with third-party advertisers, commercial education portals, or loan intermediaries. We do not deploy third-party behavioral advertising trackers on this portal.",
  },
  {
    number: "05",
    title: "Data Security Standards & Retention Protocols",
    content:
      "All electronic application data and contact submissions are protected through industry-standard encryption, strict role-based access controls, and periodic security reviews. Records are retained strictly for the duration necessary to satisfy educational grant administration and statutory non-profit audit obligations. Applicants hold the right to request verification, correction, or rectification of their records.",
  },
  {
    number: "06",
    title: "Grievance Redressal & Data Protection Officer",
    content:
      "In compliance with Indian data protection norms, MAHAVIR TRUST has designated a Grievance Redressal Officer to handle data inquiries, correction requests, and privacy concerns. Formal communications can be addressed to the Secretariat with the subject tag [DATA_PRIVACY_QUERY].",
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Data Protection & Ethics"
        title="Privacy & Student Confidentiality Policy"
        description="Our fiduciary commitment to safeguarding student data, applicant economic records, and communication integrity in accordance with the Digital Personal Data Protection Act, 2023."
        breadcrumbs={[{ label: "Privacy Policy" }]}
      />

      {/* 2. Cross-Navigation Policy Tabs */}
      <section className="bg-[#F7F4EE] border-b border-[#0B3B24]/10 py-4">
        <Container size="narrow">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium">
            <Link
              href="/terms"
              className="py-2 px-4 rounded-xs bg-[#FDFBF7] text-[#0B3B24] border border-[#0B3B24]/15 hover:bg-[#0B3B24]/5 transition-colors"
            >
              Terms of Engagement
            </Link>
            <span className="py-2 px-4 rounded-xs bg-[#0B3B24] text-white font-semibold">
              Privacy & Confidentiality
            </span>
            <Link
              href="/accessibility"
              className="py-2 px-4 rounded-xs bg-[#FDFBF7] text-[#0B3B24] border border-[#0B3B24]/15 hover:bg-[#0B3B24]/5 transition-colors"
            >
              Accessibility Statement
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. Main Privacy Sections */}
      <section className="py-16 md:py-24 bg-[#FDFBF7]">
        <Container size="narrow">
          <SectionHeader
            badge="Fiduciary Safeguards"
            title="Data Governance & Confidentiality Framework"
            subtitle="Transparent guidelines governing how applicant data is collected, processed, and safeguarded across all Trust operations."
          />

          <div className="space-y-6 mt-10">
            {PRIVACY_SECTIONS.map((section) => (
              <Card key={section.number} variant="elevated" className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="forest">Section {section.number}</Badge>
                  <span className="text-[11px] font-mono text-[#9E7D3B] uppercase tracking-wider">
                    Statutory Policy
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B3B24]">
                  {section.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  {section.content}
                </p>
                {section.bullets && (
                  <ul className="space-y-2 pt-2 border-t border-[#0B3B24]/10">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ))}
          </div>

          {/* Data Protection Officer Contact Box */}
          <div className="mt-12">
            <Card variant="dark" className="p-8 space-y-4 border border-[#C5A059]/40">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-[#C5A059]/20 flex items-center justify-center text-[#E4C88A] shrink-0 mt-1">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-serif text-lg font-bold text-[#E4C88A]">
                    Statutory Data Inquiries & Right to Rectification
                  </h4>
                  <p className="text-xs text-white/85 leading-relaxed">
                    Scholars, guardians, and volunteers may request verification, correction, or deletion of their submitted personal records by writing to our designated Grievance Redressal Officer at <code className="text-[#E4C88A] font-mono">grievance@mahavirtrust.org</code>. Requests are acknowledged within 48 hours and resolved in accordance with statutory guidelines.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[11px] text-white/60">
                  Compliance Reference: DPDP Act, 2023 | Income-tax Act, 1961 (Sec 12AB)
                </span>
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="!border-[#E4C88A] !text-[#E4C88A] hover:!bg-[#E4C88A]/10 text-xs">
                    <Mail className="w-3.5 h-3.5 mr-1.5" />
                    Submit Privacy Inquiry
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
