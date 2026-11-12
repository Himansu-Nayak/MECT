import React from "react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
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

export const metadata = createPageMetadata({
  title: "Annual Reports & Financial Disclosures",
  description:
    "Annual activity summaries (FY 2021–2024), expenditure stewardship principles, and Secretariat inspection procedures for Mahaveer Educational & Charitable Trust (MECT).",
  path: "/reports",
  ogImage: "/images/og-disclosures.png",
});

export default function ReportsPage() {
  const annualReports = [
    {
      year: "FY 2023–24",
      title: "Annual Activity & Statutory Progress Report (FY 2023-24)",
      referenceCode: "AR-2023-24-MECT",
      status: "Activity Summary on Record",
      summary:
        "Covers the issuance of CBDT Form 10AC historical Section 12A & 80G orders (AY 2024-25 to AY 2026-27), continuation of the Balangir Community Learning Centre, remedial coaching across Balangir and Puintala blocks, and seasonal Jal Seva water stations.",
      highlights: [
        "Income Tax Form 10AC 12A (URN: AADTM5474FE20231) and 80G (URN: AADTM5474FF20241) recorded (dated 29-01-2024)",
        "Balangir Community Learning Centre learning & resource sessions (established Feb 2023)",
        "350+ rural students coached across Balangir and Puintala remedial centres",
        "10,000+ documented beneficiary hydration events during peak Western Odisha summers",
      ],
      auditStatus: "Signed CA audit statements retained at Secretariat for public inspection",
    },
    {
      year: "FY 2022–23",
      title: "Annual Activity & Vocational Livelihood Report (FY 2022-23)",
      referenceCode: "AR-2022-23-MECT",
      status: "Activity Summary on Record",
      summary:
        "Documents training batches at the Women's Vocational Tailoring & Livelihood Centre in Balangir, graduating over 120 rural women across 6-month stitching courses, alongside Jan Ahar food distribution near Balangir District Headquarters Hospital.",
      highlights: [
        "120+ rural women graduated in vocational tailoring and garment cutting cohorts",
        "Sewing machine toolkits distributed to support home-based stitching livelihoods",
        "Cooked Jan Ahar meal distribution for hospital patient attendants in Balangir",
        "Summer hydration points and ORS distribution during high-temperature periods",
      ],
      auditStatus: "Annual accounts & ITR retained at Balangir Trust Office for inspection",
    },
    {
      year: "FY 2021–22",
      title: "Annual Activity & Educational Recovery Report (FY 2021-22)",
      referenceCode: "AR-2021-22-MECT",
      status: "Activity Summary on Record",
      summary:
        "Focused on post-pandemic scholastic continuity for rural students in Balangir, reopening remedial coaching centres, distributing textbook and stationery kits, and supplying dry-ration relief to daily-wage and destitute households.",
      highlights: [
        "Remedial coaching centres reopened across Puintala and Balangir rural clusters",
        "Textbook, notebook, and stationery kits distributed across school batches (over 280 kits recorded)",
        "Seasonal essential commodity and food relief for destitute rural households",
        "Strict adherence to honorary non-remunerative trustee service under Deed Clause XVI",
      ],
      auditStatus: "Full expenditure registers reconciled and maintained at Balangir Secretariat",
    },
  ];

  const financialStandards = [
    {
      title: "Direct Programme Allocation Focus",
      description:
        "Contributions and grants are directed toward educational fees, vocational sewing equipment, water filtration, and nutritional food relief, subject to essential trust administration.",
      icon: Receipt,
    },
    {
      title: "Zero Trustee Remuneration",
      description:
        "In strict adherence to Trust Deed Clause XVI, all trustees serve purely in an honorary capacity with zero salary, sitting fees, or personal commissions.",
      icon: Scale,
    },
    {
      title: "Statutory Audit Process",
      description:
        "Trust accounts are prepared under Trust Deed Clause 16; certified audit statements are published in the archive below as they are finalized ({{CONFIRM: audited accounts and Form 10B}}).",
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
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cream" />
                <span>Statutory Compliance Vault</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Fiduciary Standards Strip */}
      <section className="py-20 bg-cream border-b border-border-warm">
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
                  className="p-6 bg-white border-border-warm shadow-xs space-y-3 font-sans"
                >
                  <div className="w-10 h-10 rounded-xs bg-terracotta text-white flex items-center justify-center border border-sand/40">
                    <Icon className="w-5 h-5 text-cream" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-terracotta-dark">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-sand leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Filterable Fiscal Year Reports Archive */}
      <section id="archive" className="py-20 md:py-28 bg-white" aria-label="Annual Reports Archive">
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
                className="p-8 sm:p-10 bg-white border-border-warm shadow-sm hover:border-sand transition-all space-y-6"
              >
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-warm gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-2xl font-bold text-terracotta-dark">
                      {report.year}
                    </span>
                    <Badge variant="contrast-gold">
                      {report.referenceCode}
                    </Badge>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs text-forest font-bold font-sans">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{report.status}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-terracotta-dark">
                    {report.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-sand mt-2 leading-relaxed font-sans">
                    {report.summary}
                  </p>
                </div>

                {/* Highlights Grid */}
                <div className="p-5 bg-cream rounded-xs border border-border-warm space-y-2.5 font-sans">
                  <span className="text-xs font-bold uppercase tracking-wider text-terracotta-dark block">
                    Key Audited Milestones &amp; Operations
                  </span>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-ink-sand">
                    {report.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Strip */}
                <div className="pt-3 border-t border-border-warm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans">
                  <span className="text-ink-sand font-medium">
                    Audit Status: <strong className="text-terracotta-dark">{report.auditStatus}</strong>
                  </span>
                  <Link href="/contact?subject=Annual%20Report%20Inspection%20Request">
                    <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                      <Download className="w-3.5 h-3.5 text-terracotta-dark" />
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
      <section className="py-20 bg-sand-light text-ink border-t border-border-warm">
        <Container size="default">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-white border border-border-warm rounded-xs p-8 sm:p-10 shadow-xs">
            <Badge variant="contrast-gold">
              Statutory Transparency Guarantee
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              Right to Inspect Certified Trust Financials
            </h2>
            <p className="text-sm text-ink leading-relaxed font-sans max-w-2xl mx-auto">
              In accordance with Indian non-profit standards and public trust governance, any citizen, donor, or CSR partner is entitled to inspect physical audited ledgers at our Balangir Registered Office and Bhubaneswar Corporate Secretariat.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link href="/statutory-disclosures">
                <Button variant="gold" size="lg" className="shadow-sm font-bold">
                  <FileCheck className="w-4 h-4 mr-2" />
                  <span>View 12A, 80G &amp; CSR-1 Credentials</span>
                </Button>
              </Link>
              <Link href="/donate">
                <Button variant="outline" size="lg" className="font-semibold">
                  <Heart className="w-4 h-4 mr-1.5" />
                  <span>Support Our Mission — Donate</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
