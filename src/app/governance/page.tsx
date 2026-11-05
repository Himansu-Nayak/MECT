import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TRUST_CONFIG } from "@/lib/config";
import {
  ShieldCheck,
  FileText,
  AlertCircle,
  Scale,
  Lock,
  Landmark,
  Building2,
  FileDown,
  ArrowRight,
  Receipt,
  Mail,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Fiduciary Governance, Board of Trustees & Statutory Charter — MECT",
  description:
    "Official governance framework, registered Trust Deed No. 40311302194 (Balangir), Board of Trustees, honorary non-remuneration code, and statutory compliance for Mahaveer Educational & Charitable Trust (MECT).",
};

export default function GovernancePage() {
  const boardOfTrustees = [
    {
      name: "Er. Japabandhu Kampa",
      role: "Settler Founder & Permanent Managing Trustee",
      deedClause: "Clause VIII & IX (Permanent Trustee)",
      details:
        "Settler founder of Mahaveer Educational & Charitable Trust. Authorized custodian of trust records, bank operations, and statutory compliance under the registered Trust Deed (2013, Balangir).",
      status: "Permanent Managing Trustee",
      icon: UserCheck,
    },
    {
      name: "Yudhisthir Rana",
      role: "Life Trustee",
      deedClause: "Clause X (Founding Life Trustee)",
      details:
        "Resident of Puintala, Balangir. Fiduciary custodian overseeing community welfare, rural remedial education, and grassroots beneficiary verification across Western Odisha.",
      status: "Life Trustee",
      icon: UserCheck,
    },
    {
      name: "Ramachandra Biswal",
      role: "Life Trustee",
      deedClause: "Clause X (Founding Life Trustee)",
      details:
        "Resident of Mahimunda, Balangir. Oversees civic outreach, seasonal Jal Seva clean drinking water relief, and public health camp logistics.",
      status: "Life Trustee",
      icon: UserCheck,
    },
    {
      name: "Sambit Kumar Dang",
      role: "Life Trustee",
      deedClause: "Clause X (Founding Life Trustee)",
      details:
        "Resident of Rugudipara, Balangir. Coordinates vocational livelihood training, tailoring workshop administration, and student educational materials.",
      status: "Life Trustee",
      icon: UserCheck,
    },
  ];

  const keyDeedClauses = [
    {
      clause: "Clause XVI",
      title: "Strict Honorary & Non-Remunerative Governance",
      description:
        "Trustees serve purely in an honorary capacity and are legally prohibited from receiving salary, commission, sitting fees, or personal remuneration from trust funds.",
    },
    {
      clause: "Clause VIII & IX",
      title: "Permanent Tenure & Board Quorum",
      description:
        "The board maintains a minimum of 3 and maximum of 11 trustees. A quorum of 3 is required for all binding resolutions and biennial general audits.",
    },
    {
      clause: "Clause XVII",
      title: "Statutory Investment under Section 11(5)",
      description:
        "All surplus funds, endowments, and liquid reserves must be invested strictly in scheduled commercial banks or instruments recognized under Section 11(5) of the Income Tax Act.",
    },
    {
      clause: "Clause XVIII",
      title: "Irrevocable Character & Amalgamation Safeguard",
      description:
        "The Trust is irrevocable. In the event of dissolution, assets cannot revert to trustees and must be transferred to a charitable trust with identical educational objectives.",
    },
  ];

  const governanceCommittees = [
    {
      title: "Board of Trustees",
      scope: "Fiduciary Stewardship & Charter Custodians",
      mandate:
        "Preserving endowment integrity, ensuring adherence to the 2013 registered Trust Deed, and authorizing statutory annual filings under the Indian Trusts Act.",
      status: "Regd. Deed No. 40311302194 (Balangir Sub-Registrar)",
      composition: "Permanent Managing Trustee & Life Trustees",
      icon: Landmark,
    },
    {
      title: "Audit & Financial Scrutiny Panel",
      scope: "Independent Statutory Oversight",
      mandate:
        "Quarterly reconciliation of direct institutional disbursements, expenditure ledgers, and certified annual audits by independent Chartered Accountants (Form 10B).",
      status: "Annual Audit Protocol Active",
      composition: "Independent Chartered Accountants & Statutory Auditors",
      icon: Scale,
    },
    {
      title: "Educational Appraisal Council",
      scope: "Merit-cum-Means Selection Authority",
      mandate:
        "Autonomous evaluation of student applications against standardized scoring rubrics. Zero discretionary grant allocation permitted by individual trustees.",
      status: "Objective Blind-Scoring Model",
      composition: "Educators, College Principals & Subject Specialists",
      icon: ShieldCheck,
    },
    {
      title: "Secretariat & Ethics Office",
      scope: "Daily Administration & Grievance Redressal",
      mandate:
        "Managing candidate record verification, university liaison, whistleblower grievance intake, and public disclosure updates across Balangir and Bhubaneswar offices.",
      status: "Balangir & Bhubaneswar Offices Operational",
      composition: "Administrative Officers & Compliance Coordinators",
      icon: Building2,
    },
  ];

  const institutionalDocuments = [
    {
      title: "Registered Trust Deed (2013)",
      code: "DEED-40311302194",
      type: "Registered Public Deed",
      description:
        "Original registered trust deed executed before District Sub-Registrar, Balangir (Book 4, Vol 45, Doc No. 40311302194) establishing MECT's irrevocable public charitable status.",
      version: "Legally Ratified (30-07-2013)",
    },
    {
      title: "CBDT Form 10AC Section 12A Order",
      code: "URN-AADTM5474FE20231",
      type: "Income Tax Order",
      description:
        "Provisional registration under Section 12A(1)(ac)(vi) of the Income Tax Act, 1961, exempting charitable trust surplus from income tax (AY 2024-25 to AY 2026-27).",
      version: "Order Dated 29-01-2024",
    },
    {
      title: "CBDT Form 10AC Section 80G Order",
      code: "URN-AADTM5474FF20241",
      type: "Income Tax Order",
      description:
        "Provisional approval under Section 80G(5)(iv) of the Income Tax Act, 1961, granting 50% tax deduction on donations made by Indian taxpayers.",
      version: "Order Dated 29-01-2024",
    },
    {
      title: "MCA CSR-1 Registration Certificate",
      code: "CSR-CSR00081063",
      type: "Ministry of Corporate Affairs",
      description:
        "Official CSR registration approved by the Ministry of Corporate Affairs (ROC-Delhi, SRN-N14617237) authorizing corporate CSR allocations under Section 135.",
      version: "Approved 09-11-2024",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Irrevocable Public Charitable Trust • Est. 2013"
        title="Institutional Governance, Board of Trustees & Fiduciary Code"
        description="Public confidence is the foundation of enduring philanthropy. Mahaveer Educational & Charitable Trust (MECT) operates under registered deed governance, non-remunerative trustee stewardship, and complete statutory transparency."
        breadcrumbs={[{ label: "About Us", href: "/about" }, { label: "Governance" }]}
        actions={
          <>
            <Link href="#board">
              <Button variant="gold" size="sm">
                <span>Board of Trustees</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/statutory-disclosures">
              <Button variant="dark-outline" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#E4C88A]" aria-hidden="true" />
                <span>Statutory Disclosures</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Statutory Credentials Quick Verification Banner */}
      <section className="py-8 bg-[#F4EFE6] border-b border-[#0A192F]/10" aria-label="Statutory Accreditation Strip">
        <Container size="default">
          <div className="p-6 bg-white rounded-xs border-2 border-[#C5A059]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="forest" size="sm">
                    Verified Public Record
                  </Badge>
                  <span className="text-xs text-[#0A192F] font-bold font-mono">
                    Deed No. 40311302194 (Balangir Sub-Registrar)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#1C2421] font-semibold mt-1 font-serif">
                  Governed under Indian Trusts Act, 1882 • Section 12A/80G &amp; MCA CSR-1 Certified
                </p>
                <p className="text-xs text-[#4A5568] mt-1 leading-relaxed font-sans">
                  Permanent Account Number: <strong className="text-[#0A192F]">{TRUST_CONFIG.statutory.pan}</strong> • Section 12A URN: <strong className="text-[#0A192F]">{TRUST_CONFIG.statutory.section12AUrn}</strong> • Section 80G URN: <strong className="text-[#0A192F]">{TRUST_CONFIG.statutory.section80GUrn}</strong> (50% Tax Deduction) • MCA CSR-1: <strong className="text-[#0A192F]">{TRUST_CONFIG.statutory.mcaCsrNumber}</strong>.
                </p>
              </div>
            </div>
            <Link href="/statutory-disclosures" className="shrink-0">
              <Button variant="secondary" size="sm">
                <span>View Certificates</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. Board of Trustees Section */}
      <section id="board" className="py-20 md:py-28 bg-[#FDFBF7]" aria-label="Board of Trustees">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Institutional Leadership"
            title="Board of Trustees & Fiduciary Custodians"
            subtitle="As defined under the registered Trust Deed of 2013, MECT is governed by permanent and life trustees serving in an honorary capacity."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {boardOfTrustees.map((trustee) => {
              const Icon = trustee.icon;
              return (
                <Card
                  key={trustee.name}
                  variant="elevated"
                  className="p-7 sm:p-8 bg-white border-[#0A192F]/12 shadow-xs hover:border-[#C5A059] transition-all space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#0A192F]/10">
                    <Badge variant="contrast-gold" size="sm">
                      {trustee.status}
                    </Badge>
                    <span className="text-[10px] font-semibold text-[#0A192F] bg-[#0A192F]/5 px-2.5 py-0.5 rounded-xs font-mono">
                      {trustee.deedClause}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center shrink-0 font-serif font-bold text-lg border border-[#C5A059]">
                      {trustee.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                        {trustee.name}
                      </h3>
                      <p className="text-xs text-[#7A5E24] font-semibold font-sans mt-0.5">
                        {trustee.role}
                      </p>
                      <p className="text-xs text-[#4A5568] mt-2 leading-relaxed font-sans">
                        {trustee.details}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Honorary Governance Alert */}
          <div className="p-6 rounded-xs bg-[#0A192F] text-white border border-[#C5A059]/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-[#E4C88A] shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-serif text-base font-bold text-white">
                  Trust Deed Clause XVI: Prohibition of Trustee Remuneration
                </h4>
                <p className="text-xs text-white/80 font-sans mt-0.5">
                  {TRUST_CONFIG.governance.honoraryClause}
                </p>
              </div>
            </div>
            <Link href="/statutory-disclosures" className="shrink-0">
              <Button variant="gold" size="sm" className="font-bold">
                Inspect Trust Deed Summary
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. Key Trust Deed Clauses & Fiduciary Safeguards */}
      <section className="py-20 bg-[#F4EFE6] border-y border-[#0A192F]/10" aria-label="Key Trust Deed Clauses">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Deed Mandates"
            title="Fundamental Clauses of the Registered Trust Deed"
            subtitle="The registered charter executed in Balangir binds all operations to strict public benefit, asset protection, and anti-profiteering covenants."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyDeedClauses.map((item, idx) => (
              <Card
                key={idx}
                variant="elevated"
                className="p-6 sm:p-7 bg-white border-[#0A192F]/12 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#7A5E24] bg-[#7A5E24]/10 px-2 py-0.5 rounded-xs">
                    {item.clause}
                  </span>
                  <Badge variant="forest" size="sm">
                    Irrevocable Covenant
                  </Badge>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Multi-Tier Committee Architecture */}
      <section className="py-20 md:py-28 bg-[#FDFBF7]" aria-label="Governance Committee Architecture">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Committee Separation"
            title="Governance Committees & Operational Architecture"
            subtitle="Authority is deliberately divided across independent panels to ensure that no single trustee possesses discretionary grant-making authority."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {governanceCommittees.map((committee) => {
              const Icon = committee.icon;
              return (
                <Card
                  key={committee.title}
                  variant="elevated"
                  className="p-7 sm:p-8 bg-white border-[#0A192F]/12 shadow-xs hover:border-[#C5A059] transition-all space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#0A192F]/10">
                    <Badge variant="contrast-gold" size="sm">
                      {committee.scope}
                    </Badge>
                    <span className="text-[10px] font-semibold text-[#0A192F] bg-[#0A192F]/8 px-2.5 py-0.5 rounded-xs font-sans">
                      Active Committee
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#C5A059]" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                        {committee.title}
                      </h3>
                      <p className="text-xs text-[#4A5568] mt-1.5 leading-relaxed font-sans">
                        {committee.mandate}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#0A192F]/10 space-y-1.5 text-[11px] font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-[#4A5568] font-medium">Composition:</span>
                      <span className="text-[#0A192F] font-semibold">{committee.composition}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#4A5568] font-medium">Statutory Status:</span>
                      <span className="text-[#7A5E24] font-semibold">{committee.status}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. Financial Oversight & 100% Direct Disbursal Standard */}
      <section className="py-20 bg-[#0A192F] text-[#EDE6D8] border-y border-[#C5A059]/25 relative overflow-hidden" aria-label="Financial Oversight">
        <Container size="default" className="relative space-y-14">
          <SectionHeader
            badge="Fiduciary Safeguards"
            title="Financial Oversight & Direct Disbursal Standard"
            subtitle="Every financial transaction follows a dual-authorization verification protocol to eliminate leakage, fraud, or intermediary commissions."
            align="center"
            theme="dark"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-xs bg-white/5 border border-white/10 space-y-4">
              <Receipt className="w-8 h-8 text-[#E4C88A]" aria-hidden="true" />
              <h3 className="font-serif text-xl font-bold text-white">
                100% Direct Bank Remittance
              </h3>
              <p className="text-xs text-white/75 leading-relaxed font-sans">
                Approved scholarship subsidies are remitted exclusively via bank RTGS/NEFT straight to accredited college bursar accounts. Zero cash handling.
              </p>
            </div>

            <div className="p-7 rounded-xs bg-white/5 border border-white/10 space-y-4">
              <Scale className="w-8 h-8 text-[#E4C88A]" aria-hidden="true" />
              <h3 className="font-serif text-xl font-bold text-white">
                Dual-Authorization Controls
              </h3>
              <p className="text-xs text-white/75 leading-relaxed font-sans">
                Batch payment lists require joint authorization from the Managing Trustee and the Finance Committee following independent scrutiny approval.
              </p>
            </div>

            <div className="p-7 rounded-xs bg-white/5 border border-white/10 space-y-4">
              <FileText className="w-8 h-8 text-[#E4C88A]" aria-hidden="true" />
              <h3 className="font-serif text-xl font-bold text-white">
                Chartered Accountant Audits
              </h3>
              <p className="text-xs text-white/75 leading-relaxed font-sans">
                Annual balance sheets and expenditure ledgers undergo certified auditing by independent Chartered Accountants with Form 10B compliance.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Institutional Documents & Compliance Registry */}
      <section id="documents" className="py-20 bg-[#F4EFE6] border-b border-[#0A192F]/10" aria-label="Institutional Documents">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Transparency Registry"
            title="Official Charters, Orders & Statutory Documents"
            subtitle="Legally verified certifications and Government approval orders governing Mahaveer Educational & Charitable Trust."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {institutionalDocuments.map((doc) => (
              <Card
                key={doc.code}
                variant="elevated"
                className="p-6 bg-white border-[#0A192F]/15 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-bold tracking-wider">
                    <span className="text-[#7A5E24] uppercase font-mono">{doc.code}</span>
                    <Badge variant="forest" size="sm">
                      {doc.type}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0A192F]/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#4A5568] font-semibold font-sans">{doc.version}</span>
                  <Link href="/statutory-disclosures">
                    <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                      <FileCheck className="w-3.5 h-3.5 text-[#0A192F]" aria-hidden="true" />
                      <span>Inspect Details</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
