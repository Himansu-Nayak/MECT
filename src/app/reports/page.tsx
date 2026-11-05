import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TRUST_CONFIG } from "@/lib/config";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Download,
  Calendar,
  FileCheck,
  Scale,
  ArrowRight,
  ExternalLink,
  Receipt,
  Heart,
  Landmark,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Annual Reports & Audited Financial Statements — MECT Odisha",
  description:
    "Public archive of annual activity reports, audited balance sheets, expenditure ratios, and statutory Form 10B filings for Mahaveer Educational & Charitable Trust (MECT).",
};

export default function ReportsPage() {
  const annualReports = [
    {
      year: "FY 2023–24",
      title: "Annual Activity & Statutory Progress Report (FY 2023-24)",
      referenceCode: "AR-2023-24-MECT",
      status: "Audited & Certified",
      summary:
        "Marks the milestone issuance of CBDT Form 10AC Section 12A & 80G approval orders by the Director of Income Tax (CPC). Full operationalization of the Balangir Community Learning Centre, free coaching for 350+ tribal students, and deployment of summer Jal Seva water stations.",
      highlights: [
        "Income Tax Form 10AC 12A (URN: AADTM5474FE20231) and 80G (URN: AADTM5474FF20241) certified",
        "Balangir Community Learning Lab with computer stations and library opened (Feb 2023)",
        "350+ rural students coached across Balangir and Puintala remedial centres",
        "10,000+ citizens served with cold drinking water during peak Western Odisha heatwaves",
      ],
      auditStatus: "Certified by Independent Chartered Accountants • Form 10B Filed",
    },
    {
      year: "FY 2022–23",
      title: "Annual Activity & Vocational Livelihood Report (FY 2022-23)",
      referenceCode: "AR-2022-23-MECT",
      status: "Audited & Certified",
      summary:
        "Major expansion of the Women's Vocational Tailoring & Livelihood Training Centre in Balangir. Over 120 rural women and SHG members completed 6-month intensive stitching courses. Ongoing Jan Ahar hospital food relief at Balangir District Headquarters Hospital.",
      highlights: [
        "120+ rural women graduated in certified apparel tailoring and pattern cutting",
        "Sewing machine toolkits distributed to facilitate home-based micro-enterprises",
        "Daily cooked Jan Ahar meal distribution for attendants at Balangir District Hospital",
        "Sanitation awareness and free oral rehydration salts (ORS) distributed during summer relief",
      ],
      auditStatus: "Certified by Independent Chartered Accountants • Income Tax Return Filed",
    },
    {
      year: "FY 2021–22",
      title: "Annual Activity & Educational Recovery Report (FY 2021-22)",
      referenceCode: "AR-2021-22-MECT",
      status: "Audited & Certified",
      summary:
        "Focused on post-pandemic scholastic recovery for underprivileged tribal youth in rural Balangir. Reopened remedial coaching centers to bridge learning loss, distributed free textbook sets, and provided dry ration relief kits to destitute daily-wage households.",
      highlights: [
        "Remedial coaching centres re-established in Puintala and Balangir blocks",
        "Free textbook, notebook, and stationery kits distributed to 280+ secondary school students",
        "Emergency food and hygiene assistance provided to elderly and destitute rural families",
        "Strict compliance with zero trustee remuneration and 100% charitable expenditure",
      ],
      auditStatus: "Certified by Independent Chartered Accountants • Full Accounts Reconciled",
    },
  ];

  const financialStandards = [
    {
      title: "100% Programme Expense Policy",
      description:
        "All donations and grants are allocated directly toward verified educational fees, vocational sewing machinery, water filtration equipment, and nutritional food supplies.",
      icon: Receipt,
    },
    {
      title: "Zero Trustee Remuneration",
      description:
        "In strict adherence to Trust Deed Clause XVI, all trustees serve purely in an honorary capacity with zero salary, sitting fees, or personal commissions.",
      icon: Scale,
    },
    {
      title: "Independent CA Audits",
      description:
        "All ledgers, bank transactions, and balance sheets undergo annual audit by independent Chartered Accountants with mandatory Form 10B filings under the Income Tax Act.",
      icon: ShieldCheck,
    },
    {
      title: "Public Inspection Rights",
      description:
        "Certified copies of annual balance sheets and expenditure ledgers are open for public examination at our Balangir Registered Office and Bhubaneswar Secretariat.",
      icon: Landmark,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Public Accountability Archive • Audited Statements"
        title="Annual Activity Reports, Audited Balance Sheets & Financial Disclosures"
        description="Transparent stewardship is non-negotiable. Mahaveer Educational & Charitable Trust (MECT) publishes certified annual reports, financial audits, and project outcomes for open public inspection."
        breadcrumbs={[{ label: "Impact", href: "/impact" }, { label: "Annual Reports" }]}
        actions={
          <>
            <Link href="#archive">
              <Button variant="gold" size="sm">
                <span>View Reports Archive</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/statutory-disclosures">
              <Button variant="dark-outline" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#E4C88A]" />
                <span>Statutory Compliance Vault</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Fiduciary Standards Strip */}
      <section className="py-20 bg-[#FDFBF7] border-b border-[#0A192F]/10">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Fiduciary Safeguards"
            title="Accounting Standards & Fiscal Integrity"
            subtitle="Every rupee entrusted to MECT is managed under multi-tier auditing and transparent statutory governance."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialStandards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={idx}
                  variant="elevated"
                  className="p-6 bg-white border-[#0A192F]/12 shadow-xs space-y-3 font-sans"
                >
                  <div className="w-10 h-10 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center border border-[#C5A059]/40">
                    <Icon className="w-5 h-5 text-[#E4C88A]" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#0A192F]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Filterable Fiscal Year Reports Archive */}
      <section id="archive" className="py-20 md:py-28 bg-[#F4EFE6]" aria-label="Annual Reports Archive">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Verified Records Archive"
            title="Annual Reports & Activity Summaries (FY 2021–2024)"
            subtitle="Explore certified annual progress logs documenting ground operations in Balangir and Western Odisha."
            align="center"
          />

          <div className="space-y-8">
            {annualReports.map((report) => (
              <Card
                key={report.referenceCode}
                variant="elevated"
                className="p-8 sm:p-10 bg-white border-[#0A192F]/15 shadow-sm hover:border-[#C5A059] transition-all space-y-6"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#0A192F]/10 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-2xl font-bold text-[#0A192F]">
                      {report.year}
                    </span>
                    <Badge variant="contrast-gold">
                      {report.referenceCode}
                    </Badge>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#15803D] font-bold font-sans">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{report.status}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0A192F]">
                    {report.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A5568] mt-2 leading-relaxed font-sans">
                    {report.summary}
                  </p>
                </div>

                {/* Highlights Grid */}
                <div className="p-5 bg-[#FDFBF7] rounded-xs border border-[#0A192F]/10 space-y-2.5 font-sans">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A192F] block">
                    Key Audited Milestones &amp; Operations
                  </span>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#4A5568]">
                    {report.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Strip */}
                <div className="pt-3 border-t border-[#0A192F]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans">
                  <span className="text-[#4A5568] font-medium">
                    Audit Status: <strong className="text-[#0A192F]">{report.auditStatus}</strong>
                  </span>
                  <Link href="/contact?subject=Annual%20Report%20Inspection%20Request">
                    <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                      <Download className="w-3.5 h-3.5 text-[#0A192F]" />
                      <span>Request Official Audit Copy</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Inspection Rights & Fiduciary Reassurance */}
      <section className="py-20 bg-[#0A192F] text-[#EDE6D8]">
        <Container size="default">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="gold-dark">
              Statutory Transparency Guarantee
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Right to Inspect Certified Trust Financials
            </h2>
            <p className="text-sm text-white/80 leading-relaxed font-sans max-w-2xl mx-auto">
              In accordance with Indian non-profit standards and public trust governance, any citizen, donor, or CSR partner is entitled to inspect physical audited ledgers at our Balangir Registered Office and Bhubaneswar Corporate Secretariat.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link href="/statutory-disclosures">
                <Button variant="gold" size="lg" className="shadow-lg font-bold">
                  <FileCheck className="w-4 h-4 mr-2" />
                  <span>View 12A, 80G &amp; CSR-1 Credentials</span>
                </Button>
              </Link>
              <Link href="/donate">
                <Button variant="dark-outline" size="lg" className="font-semibold">
                  <Heart className="w-4 h-4 mr-1.5 text-[#E4C88A]" />
                  <span>Donate with 80G Tax Exemption</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
