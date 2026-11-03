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
  Scale,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Engagement — MAHAVIR TRUST",
  description:
    "Institutional terms of engagement, website use guidelines, and scholarship application understandings for MAHAVIR TRUST in Odisha, India.",
};

const CLAUSES = [
  {
    number: "01",
    title: "Statutory Preamble & Public Charitable Purpose",
    summary:
      "MAHAVIR TRUST operates strictly as an irrevocable public charitable educational trust under the Indian Trusts Act, 1882. All web pages, policy descriptions, and scholarship guidelines are published for public welfare, community empowerment, and transparent educational administration across Odisha.",
  },
  {
    number: "02",
    title: "Authenticity of Submissions & Zero-Tolerance for Fraud",
    summary:
      "Applicants, mentors, and institutions warrant that all details submitted through registration forms—including income certificates issued by competent revenue authorities, academic marksheets, and identification credentials—are genuine, accurate, and verifiable. The submission of forged or misrepresented documents will cause immediate disqualification, blacklisting from future schemes, and formal reporting to educational regulatory authorities.",
  },
  {
    number: "03",
    title: "Scholarship Appraisal & Merit-cum-Means Selection Discretion",
    summary:
      "Submission of a scholarship application does not confer an automatic legal entitlement or enforceable contractual right to financial disbursement. Grant allocations are contingent upon annual budgetary appropriations, certified district quotas, and rigorous appraisal by an independent Academic Advisory Committee. Decisions rendered by the appraisal committee in accordance with trust guidelines are final and conclusive.",
  },
  {
    number: "04",
    title: "Inviolable Direct Institutional Disbursal Condition",
    summary:
      "All scholarship recipients, guardians, and institutional partners expressly acknowledge that approved subsidies are disbursed 100% via direct electronic bank transfer (NEFT/RTGS) directly to the verified bank account of the student's accredited college or university. Under no circumstances will funds be transferred in cash or to personal bank accounts.",
  },
  {
    number: "05",
    title: "Project Samarth Community Study Hub Regulations",
    summary:
      "Access to Project Samarth study facilities is provided free of cost to bona fide students. Users must observe quiet study discipline, respect physical library books and digital terminal equipment, and adhere to community stewardship norms. The Trust reserves the right to suspend facility access for individuals engaging in disruptive or unauthorized conduct.",
  },
  {
    number: "06",
    title: "Intellectual Property & Educational Fair Use",
    summary:
      "All educational curricula, career guidance materials, and institutional reports published on this portal are protected by copyright. Content may be downloaded or printed solely for personal, non-commercial academic use, provided that MAHAVIR TRUST is prominently acknowledged as the source.",
  },
  {
    number: "07",
    title: "Limitation of Fiduciary Liability & Dispute Jurisdiction",
    summary:
      "To the maximum extent permitted by applicable Indian law, MAHAVIR TRUST, its Board of Trustees, and executive officers shall not be held liable for indirect or consequential damages arising from website technical interruptions, third-party internet disruptions, or delays in institutional verification. All disputes arising from trust operations shall fall within the exclusive jurisdiction of the competent courts in Bhubaneswar or Cuttack, Odisha.",
  },
  {
    number: "08",
    title: "Anti-Bribery, Anti-Tout & Zero-Intermediary Undertaking",
    summary:
      "MAHAVIR TRUST charges zero fees for applications, examinations, fellowship inductions, or grievance resolutions. The Trust does not authorize or recognize any commercial touts, commission brokers, or expedited admission agents. Any solicitation of fees by individuals claiming to represent the Trust should be reported immediately to the Secretariat.",
  },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Legal & Institutional Charter"
        title="Terms of Engagement & Website Use"
        description="Statutory guidelines governing participation in MAHAVIR TRUST educational schemes, digital portal access, and direct institutional grant allocations."
        breadcrumbs={[{ label: "Terms of Engagement" }]}
      />

      {/* 2. Cross-Navigation Policy Tabs */}
      <section className="bg-[#F7F4EE] border-b border-[#0B3B24]/10 py-4">
        <Container size="narrow">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium">
            <span className="py-2 px-4 rounded-xs bg-[#0B3B24] text-white font-semibold">
              Terms of Engagement
            </span>
            <Link
              href="/privacy"
              className="py-2 px-4 rounded-xs bg-[#FDFBF7] text-[#0B3B24] border border-[#0B3B24]/15 hover:bg-[#0B3B24]/5 transition-colors"
            >
              Privacy & Confidentiality
            </Link>
            <Link
              href="/accessibility"
              className="py-2 px-4 rounded-xs bg-[#FDFBF7] text-[#0B3B24] border border-[#0B3B24]/15 hover:bg-[#0B3B24]/5 transition-colors"
            >
              Accessibility Statement
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. Main Clauses Section */}
      <section className="py-16 md:py-24 bg-[#FDFBF7]">
        <Container size="narrow">
          <SectionHeader
            badge="Fiduciary Governance"
            title="Institutional Clauses of Engagement"
            subtitle="Please review these foundational understandings prior to applying for scholarships or utilizing Trust services."
          />

          <div className="space-y-6 mt-10">
            {CLAUSES.map((clause) => (
              <Card key={clause.number} variant="elevated" className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="gold">Clause {clause.number}</Badge>
                  <span className="text-[11px] font-mono text-[#9E7D3B] uppercase tracking-wider">
                    Binding Charter
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B3B24]">
                  {clause.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed">
                  {clause.summary}
                </p>
              </Card>
            ))}
          </div>

          {/* Anti-Fraud Statutory Warning Box */}
          <div className="mt-12">
            <Card variant="dark" className="p-8 space-y-4 border border-[#C5A059]/40">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-[#C5A059]/20 flex items-center justify-center text-[#E4C88A] shrink-0 mt-1">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-serif text-lg font-bold text-[#E4C88A]">
                    Statutory Notice: Absolute Prohibition of Application Fees
                  </h4>
                  <p className="text-xs text-white/85 leading-relaxed">
                    Under Section 12AB transparency norms, MAHAVIR TRUST never solicits cash deposits, processing fees, or intermediary commissions. If any individual promises expedited selection or claims official affiliation in exchange for compensation, please dispatch evidence immediately to <code className="text-[#E4C88A] font-mono">grievance@mahavirtrust.org</code>.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[11px] text-white/60">
                  Last Updated: Academic Year 2026–27 | Legal Jurisdiction: Bhubaneswar, Odisha
                </span>
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="!border-[#E4C88A] !text-[#E4C88A] hover:!bg-[#E4C88A]/10 text-xs">
                    <Mail className="w-3.5 h-3.5 mr-1.5" />
                    Contact Secretariat Desk
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
