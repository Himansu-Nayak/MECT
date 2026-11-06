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
  Building2,
  Landmark,
  FileCheck,
  ArrowRight,
  ExternalLink,
  Download,
  AlertCircle,
  Scale,
  Receipt,
  Heart,
  Briefcase,
  CheckCircle2,
  Calendar,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Statutory Disclosures, 12A/80G & MCA CSR-1 Vault — MECT",
  description:
    "Official Government registrations, Section 12A & 80G Income Tax exemption orders, MCA CSR-1 registration, NITI Aayog Darpan ID, and 2013 registered Trust Deed for Mahaveer Educational & Charitable Trust.",
};

export default function StatutoryDisclosuresPage() {
  const statutoryCredentials = [
    {
      category: "Constitution & Legal Entity",
      title: "Registered Public Trust Deed",
      authority: "District Sub-Registrar, Balangir, Govt. of Odisha",
      identifierLabel: "Deed Registration Number",
      identifierValue: "Book No. 4, Volume No. 45, Document No. 40311302194",
      dateLabel: "Registration Date",
      dateValue: "30th July 2013 (Deed executed 27-07-2013)",
      status: "Legally Ratified & Permanent",
      description:
        "Executed under the Indian Trusts Act, 1882, establishing Mahaveer Educational & Charitable Trust (MECT) as an irrevocable public charitable entity with Settler Founder Er. Japabandhu Kampa and permanent honorary trustees.",
      badge: "Foundational Deed",
      icon: Landmark,
    },
    {
      category: "Direct Taxes • Central Board of Direct Taxes (CBDT)",
      title: "Permanent Account Number (PAN)",
      authority: "Income Tax Department, Government of India",
      identifierLabel: "PAN",
      identifierValue: TRUST_CONFIG.statutory.pan,
      dateLabel: "Allotment Date",
      dateValue: "27th July 2013",
      status: "Active & Verified",
      description:
        "Official Income Tax Department PAN card issued in the registered legal name of Mahaveer Educational & Charitable Trust for all statutory banking, tax filing, and financial accounting operations.",
      badge: "Income Tax Dept",
      icon: Receipt,
    },
    {
      category: "Direct Taxes • Section 12A Exemption",
      title: "Form 10AC Section 12A Approval Order",
      authority: "Director of Income Tax (Central Processing Centre)",
      identifierLabel: "Unique Registration Number (URN)",
      identifierValue: TRUST_CONFIG.statutory.section12AUrn,
      dateLabel: "Order Date & Validity",
      dateValue: "29-01-2024 (AY 2024-25 to AY 2026-27)",
      status: "Provisional Approval Granted",
      description:
        "Formal order issued under Section 12A(1)(ac)(vi) of the Income Tax Act, 1961 (DIN: AADTM5474FE2023101). Exempts trust surplus, donations, and educational endowment returns from Indian Income Tax.",
      badge: "12A Exempt",
      icon: ShieldCheck,
    },
    {
      category: "Direct Taxes • Section 80G Donor Tax Benefit",
      title: "Form 10AC Section 80G Approval Order",
      authority: "Director of Income Tax (Central Processing Centre)",
      identifierLabel: "Unique Registration Number (URN)",
      identifierValue: TRUST_CONFIG.statutory.section80GUrn,
      dateLabel: "Order Date & Validity",
      dateValue: "29-01-2024 (AY 2024-25 to AY 2026-27)",
      status: "50% Tax Deduction Eligible",
      description:
        "Formal order issued under Section 80G(5)(iv) of the Income Tax Act, 1961 (DIN: AADTM5474FF2024101). Entitles Indian individual and corporate donors to claim a 50% deduction on taxable income for contributions.",
      badge: "80G Tax Deductible",
      icon: Heart,
    },
    {
      category: "Corporate Social Responsibility (CSR)",
      title: "MCA Form CSR-1 Registration",
      authority: "Ministry of Corporate Affairs, Government of India",
      identifierLabel: "CSR Registration Number",
      identifierValue: TRUST_CONFIG.statutory.mcaCsrNumber,
      dateLabel: "Approval Date & Filing Reference",
      dateValue: "09-11-2024 (ROC-DELHI, SRN-N14617237)",
      status: "Approved for CSR Allocations",
      description:
        "Registered under Section 135 of the Companies Act, 2013 and Companies (CSR Policy) Rules. Formally certifies MECT to execute corporate CSR projects and receive corporate CSR grants.",
      badge: "MCA CSR-1 Certified",
      icon: Briefcase,
    },
    {
      category: "National Voluntary Portal • NITI Aayog",
      title: "NGO Darpan Portal Registration",
      authority: "NITI Aayog, Government of India",
      identifierLabel: "Unique NGO Darpan ID",
      identifierValue: TRUST_CONFIG.statutory.ngoDarpanId,
      dateLabel: "Portal Verification",
      dateValue: "Active Government Listing",
      status: "Verified & Publicly Listed",
      description:
        "Listed on the Government of India's unified NGO Darpan portal maintained by NITI Aayog. Authorizes participation in Central and State Government voluntary agency partnerships.",
      badge: "NITI Aayog Listed",
      icon: FileCheck,
    },
    {
      category: "Ministry of Social Justice & Empowerment",
      title: "e-Anudaan Portal Listing",
      authority: "Ministry of Social Justice & Empowerment, Govt. of India",
      identifierLabel: "Organization ID",
      identifierValue: TRUST_CONFIG.statutory.mosjeAnudaanId,
      dateLabel: "Portal Verification",
      dateValue: "Registered Social Welfare Entity",
      status: "Empanelled Portal Entity",
      description:
        "Registered on the Ministry of Social Justice & Empowerment e-Anudaan central database for educational, vocational, and disabled welfare reporting and project disclosures.",
      badge: "MoSJE e-Anudaan",
      icon: Building2,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Government-Certified Transparency Vault"
        title="Statutory Disclosures, Tax Exemptions & Legal Accreditations"
        description="Public philanthropy requires complete documentary accountability. Mahaveer Educational & Charitable Trust (MECT) publishes all authentic Government registration credentials, Income Tax exemption orders, and statutory compliance certifications."
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Statutory Disclosures" }]}
        actions={
          <>
            <Link href="#credentials">
              <Button variant="gold" size="sm">
                <span>Registration Vault</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="#tax-benefit">
              <Button variant="dark-outline" size="sm">
                <Heart className="w-3.5 h-3.5 mr-1 text-[#E4C88A]" aria-hidden="true" />
                <span>80G Tax Guide</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Top Fiduciary Summary Banner */}
      <section className="py-8 bg-[#F4EFE6] border-b border-[#0A192F]/10">
        <Container size="default">
          <div className="p-6 bg-white rounded-xs border-2 border-[#C5A059]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="forest" size="sm">
                    Statutory Compliance Standard
                  </Badge>
                  <span className="text-xs text-[#0A192F] font-bold">
                    100% Direct Remittance • Zero Intermediary Interventions
                  </span>
                </div>
                <p className="text-xs text-[#4A5568] mt-1.5 leading-relaxed font-sans max-w-3xl">
                  MECT operates in strict accordance with the Indian Trusts Act, 1882 and Central Board of Direct Taxes (CBDT) regulations. All statutory registrations are active and subject to annual certified audits by independent Chartered Accountants.
                </p>
              </div>
            </div>
            <Link href="/governance" className="shrink-0">
              <Button variant="secondary" size="sm">
                <span>Fiduciary Charter</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. Statutory Credentials Directory (7 Cards) */}
      <section id="credentials" className="py-20 md:py-28 bg-[#FDFBF7]" aria-label="Statutory Credentials">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Verified Records"
            title="Official Government Registration & Accreditation Directory"
            subtitle="Every identifier listed below is officially documented with the respective Central and State Government departments."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {statutoryCredentials.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={idx}
                  variant="elevated"
                  className="p-7 sm:p-8 bg-white border-[#0A192F]/12 shadow-xs hover:border-[#C5A059] transition-all space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#0A192F]/10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5E24] font-sans">
                      {item.category}
                    </span>
                    <Badge variant="forest" size="sm">
                      {item.badge}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center shrink-0 border border-[#C5A059]/40">
                      <Icon className="w-5 h-5 text-[#E4C88A]" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#7A5E24] font-medium font-sans">
                        {item.authority}
                      </p>
                    </div>
                  </div>

                  {/* Identifier Box */}
                  <div className="p-3.5 rounded-xs bg-[#F4EFE6] border border-[#0A192F]/10 space-y-1 font-sans">
                    <span className="text-[10px] text-[#4A5568] uppercase font-bold tracking-wider block">
                      {item.identifierLabel}:
                    </span>
                    <span className="text-sm font-mono font-bold text-[#0A192F] block break-all">
                      {item.identifierValue}
                    </span>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#4A5568]">
                      <span>{item.dateLabel}: <strong>{item.dateValue}</strong></span>
                      <span className="text-[#15803D] font-bold">✓ {item.status}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#4A5568] leading-relaxed font-sans pt-1">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Section 80G Tax Exemption Guide for Donors */}
      <section id="tax-benefit" className="py-20 bg-[#0A192F] text-[#EDE6D8] border-y border-[#C5A059]/30" aria-label="80G Tax Deduction Guide">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Tax Exemption Reassurance"
            title="Understanding Section 80G Tax Benefits for Donors"
            subtitle="Under Section 80G of the Income Tax Act, 1961, 50% of your donation is deductible from your taxable income."
            align="center"
            theme="dark"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: How 80G Works */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <h3 className="font-serif text-2xl font-bold text-white">
                  How Does Your 50% Tax Deduction Work?
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                  When you contribute to Mahaveer Educational &amp; Charitable Trust (MECT), our Section 80G registration (Order URN: <strong>{TRUST_CONFIG.statutory.section80GUrn}</strong>) enables you to deduct 50% of the donated amount from your Gross Total Income before calculating your final income tax liability.
                </p>
              </div>

              {/* Numerical Calculation Example Box */}
              <div className="p-5 rounded-xs bg-white/5 border border-white/10 space-y-3 font-sans text-xs">
                <span className="text-xs font-bold text-[#E4C88A] uppercase tracking-wider block">
                  Illustrative Tax Benefit Calculation:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-black/20 rounded-xs border border-white/5">
                    <span className="text-white/50 block text-[10px]">Your Contribution:</span>
                    <span className="text-base font-bold text-white font-mono">₹10,000</span>
                  </div>
                  <div className="p-3 bg-black/20 rounded-xs border border-white/5">
                    <span className="text-white/50 block text-[10px]">80G Eligible Deduction (50%):</span>
                    <span className="text-base font-bold text-[#E4C88A] font-mono">₹5,000</span>
                  </div>
                  <div className="p-3 bg-black/20 rounded-xs border border-white/5">
                    <span className="text-white/50 block text-[10px]">Estimated Tax Saved (30% Slab):</span>
                    <span className="text-base font-bold text-[#86EFAC] font-mono">₹1,560*</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/50 italic">
                  * Plus applicable education and health cess. Effective tax savings depend on your applicable income tax bracket (Old vs New Tax Regime rules apply).
                </p>
              </div>

              {/* Three-step receipt protocol */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white font-serif">
                  Mandatory Receipt &amp; Tax Certificate Protocol:
                </h4>
                <ul className="space-y-1.5 text-xs text-white/80 font-sans">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                    <span>Every donor receives a stamped, numbered receipt containing MECT&apos;s PAN and 80G URN.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                    <span>Donor PAN and address are recorded for annual Form 10BD statement of donations filed with the Income Tax Department.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                    <span>Donors receive Form 10BE Certificate of Donation enabling pre-filled ITR filing.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Direct Bank Account Coordinates */}
            <div className="lg:col-span-5 bg-[#0F172A] p-7 rounded-xs border border-[#C5A059]/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase font-bold text-[#E4C88A] tracking-wider">
                  Direct Bank Remittance (NEFT/RTGS)
                </span>
                <Badge variant="forest" size="sm">
                  Official Account
                </Badge>
              </div>

              <div className="space-y-2.5 text-xs font-sans">
                <div>
                  <span className="text-white/50 block text-[11px]">Beneficiary Name:</span>
                  <span className="text-white font-semibold text-sm">{TRUST_CONFIG.bank.accountName}</span>
                </div>
                <div>
                  <span className="text-white/50 block text-[11px]">Bank Name &amp; Branch:</span>
                  <span className="text-white font-medium">{TRUST_CONFIG.bank.bankName}, {TRUST_CONFIG.bank.branch}</span>
                </div>
                <div>
                  <span className="text-white/50 block text-[11px]">Account Number:</span>
                  <span className="text-[#E4C88A] font-mono font-bold text-base tracking-wider">{TRUST_CONFIG.bank.accountNumber}</span>
                </div>
                <div>
                  <span className="text-white/50 block text-[11px]">IFSC Code:</span>
                  <span className="text-white font-mono font-bold text-sm">{TRUST_CONFIG.bank.ifsc}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <Link href="/donate" className="w-full">
                  <Button variant="gold" size="lg" className="w-full justify-center shadow-lg font-bold">
                    <Heart className="w-4 h-4 mr-2 fill-current" aria-hidden="true" />
                    <span>Online 80G Donation Gateway</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Corporate Social Responsibility (CSR) Framework */}
      <section className="py-20 md:py-24 bg-[#FDFBF7] border-b border-[#0A192F]/10">
        <Container size="default">
          <div className="bg-[#F4EFE6] rounded-xs p-8 sm:p-12 border border-[#0A192F]/15 space-y-8">
            <SectionHeader
              badge="Corporate Social Responsibility"
              title="Schedule VII Alignment for Corporate CSR Partners"
              subtitle="Registered under Ministry of Corporate Affairs (Reg: CSR00081063), MECT executes turnkey community projects compliant with Section 135."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#4A5568] font-sans">
              <div className="p-6 bg-white rounded-xs border border-[#0A192F]/10 space-y-2.5">
                <Badge variant="forest" size="sm">
                  Schedule VII (ii)
                </Badge>
                <h4 className="font-serif text-base font-bold text-[#0A192F]">
                  Promoting Education &amp; Remedial Coaching
                </h4>
                <p className="leading-relaxed">
                  Support free after-school remedial coaching, digital literacy labs, competitive entrance books, and degree college tuition grants for tribal and rural youth.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xs border border-[#0A192F]/10 space-y-2.5">
                <Badge variant="forest" size="sm">
                  Schedule VII (iii)
                </Badge>
                <h4 className="font-serif text-base font-bold text-[#0A192F]">
                  Women Vocational Livelihood &amp; Skilling
                </h4>
                <p className="leading-relaxed">
                  Equip rural women with professional tailoring machines, 6-month certified garment fabrication courses, and market linkage tooling for financial self-reliance.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xs border border-[#0A192F]/10 space-y-2.5">
                <Badge variant="forest" size="sm">
                  Schedule VII (i)
                </Badge>
                <h4 className="font-serif text-base font-bold text-[#0A192F]">
                  Safe Drinking Water &amp; Sanitation (Jal Seva)
                </h4>
                <p className="leading-relaxed">
                  Establish permanent community water purification kiosks and seasonal summer hydration booths serving thousands of rural commuters and hospital attendants.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#0A192F]/10">
              <div className="text-xs text-[#4A5568] font-sans">
                <span>Looking to allocate CSR funds before fiscal year-end? Connect with our CSR Project Desk.</span>
              </div>
              <Link href="/csr-partnerships">
                <Button variant="primary" size="md">
                  <Briefcase className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  <span>CSR Partnership Hub &amp; Proposals</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Document Inspection & Grievance Contact */}
      <section className="py-16 bg-[#EDE6D8]/50">
        <Container size="default">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#4A5568] font-sans">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#0A192F]">
                Right to Inspect Public Trust Records
              </h4>
              <p className="mt-1 max-w-2xl leading-relaxed">
                As a registered public charitable trust, certified copies of our Trust Deed, audited annual financial statements (Form 10B), and regulatory returns are open for public inspection at our Balangir Registered Office and Bhubaneswar Liaison Secretariat during working hours.
              </p>
            </div>
            <Link href="/contact" className="shrink-0">
              <Button variant="outline" size="sm">
                <span>Schedule Document Inspection</span>
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}

