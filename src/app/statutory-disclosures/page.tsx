import React from "react";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ReadingProgress } from "@/components/motion/ReadingProgress";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollIndex } from "@/components/motion/ScrollIndex";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TRUST_CONFIG } from "@/lib/config";
import {
  ShieldCheck,
  Building2,
  Landmark,
  FileCheck,
  ArrowRight,
  Receipt,
  Heart,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export const metadata = createPageMetadata({
  title: "Statutory Disclosures & Regulatory Registration Register",
  description:
    "Official Government registration credentials, Income Tax Section 12A/80G orders, MCA CSR-1 registration, and Trust Deed documentation for Mahaveer Educational & Charitable Trust (MECT).",
  path: "/statutory-disclosures",
  ogImage: "/images/og-disclosures.png",
});

export default function StatutoryDisclosuresPage() {
  const statutoryCredentials = [
    {
      category: "Constitution & Legal Entity",
      title: "Registered Public Charitable Trust Deed",
      authority: "District Sub-Registrar, Balangir, Govt. of Odisha",
      identifierLabel: "Deed Registration Number",
      identifierValue: "Book No. 4, Volume No. 45, Document No. 40311302194",
      dateLabel: "Execution & Registration Date",
      dateValue: "Executed 27-07-2013; Registered 30-07-2013",
      status: "Registered & Irrevocable Public Trust",
      description:
        "Executed under the Indian Trusts Act, 1882, establishing Mahaveer Educational & Charitable Trust (MECT) as an irrevocable public charitable entity. Clause XVI mandates permanent honorary trustee service with zero personal remuneration.",
      badge: "Foundational Charter",
      icon: Landmark,
      accessNote: "Certified physical copy open for inspection at Balangir Registered Office.",
      libraryKey: "DOC-TR-2013-DEED",
    },
    {
      category: "Direct Taxes • Income Tax Department",
      title: "Permanent Account Number (PAN)",
      authority: "Income Tax Department, Government of India",
      identifierLabel: "PAN Card Identifier",
      identifierValue: TRUST_CONFIG.statutory.pan,
      dateLabel: "Allotment Date",
      dateValue: "27-07-2013",
      status: "Active & Verified",
      description:
        "Permanent Account Number issued in the registered legal name of Mahaveer Educational & Charitable Trust for institutional banking, tax reporting, and regulatory disclosures.",
      badge: "Income Tax Dept",
      icon: Receipt,
      accessNote: "Verified record on file with State Bank of India and tax authorities.",
      libraryKey: "DOC-IT-PAN-2013",
    },
    {
      category: "Direct Taxes • Section 12A Tax Exemption",
      title: "Form 10AC Section 12A Registration Order",
      authority: "Director of Income Tax (Central Processing Centre)",
      identifierLabel: "Unique Registration Number (URN)",
      identifierValue: TRUST_CONFIG.statutory.section12AUrn,
      dateLabel: "Order Date & Validity Period",
      dateValue: "29-01-2024 (AY 2024-25 to AY 2026-27)",
      status: "Provisional Approval Granted",
      description:
        "Statutory order issued under Section 12A(1)(ac)(vi) of the Income-tax Act, 1961 (DIN: AADTM5474FE2023101) granting provisional exemption for trust income. Transition provisions under the Income-tax Act, 2025 remain subject to CA confirmation.",
      badge: "Section 12A Exempt",
      icon: ShieldCheck,
      accessNote: "Order copy retained on record; available for institutional inspection.",
      libraryKey: "DOC-IT-12A-2024",
    },
    {
      category: "Direct Taxes • Section 80G Contribution Benefit",
      title: "Form 10AC Section 80G Approval Order",
      authority: "Director of Income Tax (Central Processing Centre)",
      identifierLabel: "Unique Registration Number (URN)",
      identifierValue: TRUST_CONFIG.statutory.section80GUrn,
      dateLabel: "Order Date & Historical Validity",
      dateValue: "29-01-2024 (AY 2024-25 to AY 2026-27)",
      status: "Historical Order (FY 2026-27 Unconfirmed)",
      description:
        "Formal order under legacy Section 80G(5)(vi) of the Income-tax Act, 1961 (DIN: AADTM5474FF2024101). Covered donations made in FY 2023-24 through FY 2025-26. Current deduction eligibility for contributions made in FY 2026-27 under Section 354 is unconfirmed and pending Chartered Accountant review.",
      badge: "Historical 80G Order",
      icon: Heart,
      accessNote: "Official order on record; deduction availability for FY 2026-27 under CA review.",
      libraryKey: "DOC-IT-80G-2024",
    },
    {
      category: "Corporate Social Responsibility (CSR)",
      title: "Ministry of Corporate Affairs CSR Registration",
      authority: "Registrar of Companies, New Delhi, Ministry of Corporate Affairs",
      identifierLabel: "CSR Registration Number",
      identifierValue: TRUST_CONFIG.statutory.mcaCsrNumber,
      dateLabel: "Approval Date & Filing Reference",
      dateValue: "09-11-2024 (SRN: N14617237)",
      status: "Registered for CSR Activities",
      description:
        "Institutional registration under Section 135 of the Companies Act, 2013 and Companies (CSR Policy) Rules, 2014, authorizing MECT to undertake eligible Schedule VII corporate social responsibility partnerships.",
      badge: "MCA CSR Registered",
      icon: Briefcase,
      accessNote: "MCA registration certificate on file with Trust Corporate Secretariat.",
      libraryKey: "DOC-MCA-CSR1-2024",
    },
    {
      category: "National Voluntary Portal • NITI Aayog",
      title: "NGO Darpan Portal Registration",
      authority: "NITI Aayog, Government of India",
      identifierLabel: "NGO Darpan Unique ID",
      identifierValue: TRUST_CONFIG.statutory.ngoDarpanId,
      dateLabel: "Portal Verification Date",
      dateValue: "May 2024 (Active Government Listing)",
      status: "Verified & Publicly Listed",
      description:
        "Official listing on the Government of India unified NGO Darpan portal maintained by NITI Aayog, authorizing civil society participation and departmental coordination.",
      badge: "NITI Aayog Listed",
      icon: FileCheck,
      accessNote: "Listed on Government of India ngodarpan.gov.in database.",
      libraryKey: "DOC-NITI-DARPAN-2024",
    },
    {
      category: "Ministry of Social Justice & Empowerment",
      title: "e-Anudaan Portal Organization Listing",
      authority: "Ministry of Social Justice & Empowerment, Govt. of India",
      identifierLabel: "e-Anudaan Organization ID",
      identifierValue: TRUST_CONFIG.statutory.mosjeAnudaanId,
      dateLabel: "Empanelled Status",
      dateValue: "Registered Social Welfare Entity",
      status: "Empanelled Portal Entity",
      description:
        "Registered on the Ministry of Social Justice & Empowerment e-Anudaan central database for voluntary agency welfare reporting, educational grants, and community project disclosures.",
      badge: "MoSJE e-Anudaan",
      icon: Building2,
      accessNote: "Official registration on Government of India e-Anudaan system.",
      libraryKey: "DOC-POL-SAFEGUARDING-2024",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <ReadingProgress />

      {/* 1. Page Hero */}
      <PageHero
        badge="Regulatory Accreditation Register • Indian Trusts Act, 1882"
        title="Statutory Disclosures, Tax Registrations & Regulatory Accreditations"
        description="Public philanthropy requires complete documentary accountability. Mahaveer Educational & Charitable Trust (MECT) publishes all verified Government registration credentials, Income Tax orders, and statutory compliance certifications."
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Statutory Disclosures" }]}
        actions={
          <>
            <Link href="#credentials-register">
              <Button variant="gold" size="sm">
                <span>View Registration Register</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="dark-outline" size="sm">
                <BookOpen className="w-3.5 h-3.5 mr-1 text-cream" aria-hidden="true" />
                <span>Reports Library</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Scroll Index Navigation */}
      <ScrollIndex
        items={[
          { id: "credentials-register", label: "Registration Register" },
          { id: "tax-disclaimer", label: "Tax & 80G Disclaimer" },
          { id: "csr-framework", label: "CSR Schedule VII" },
          { id: "inspection", label: "Public Inspection" },
        ]}
      />

      {/* 3. Top Compliance Standard Summary */}
      <section className="py-8 bg-sand-light border-b border-border-warm">
        <Container size="default">
          <div className="p-6 bg-white rounded-xs border-2 border-sand/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xs bg-terracotta text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-sand" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="forest" size="sm">
                    Statutory Compliance Standard
                  </Badge>
                  <span className="text-xs text-terracotta-dark font-bold font-sans">
                    100% Direct Remittance • Zero Intermediary Interventions
                  </span>
                </div>
                <p className="text-xs text-ink-sand mt-1.5 leading-relaxed font-sans max-w-3xl">
                  MECT operates strictly in accordance with the Indian Trusts Act, 1882 under registered Trust Deed Doc No. 40311302194. Documented registrations, order dates, and validity periods are published below; FY 2026–27 tax status is being confirmed with the Trust&apos;s Chartered Accountant.
                </p>
              </div>
            </div>
            <Link href="/reports#library" className="shrink-0">
              <Button variant="secondary" size="sm">
                <span>Browse Records Library</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. Structured Registration Register Table (Mobile-Responsive Cards & Desktop Table) */}
      <section id="credentials-register" className="py-20 md:py-28 bg-cream scroll-mt-24" aria-label="Statutory Credentials Register">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Verified Register"
            title="Official Government Registration &amp; Accreditation Register"
            subtitle="Every identifier listed below is officially documented with the respective Central and State Government authorities."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {statutoryCredentials.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Reveal key={idx} delay={idx * 0.04}>
                  <Card
                    variant="elevated"
                    className="p-7 sm:p-8 bg-white border-border-warm shadow-xs hover:border-sand transition-all space-y-4 h-full"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-border-warm">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-forest font-sans">
                        {item.category}
                      </span>
                      <Badge variant="forest" size="sm">
                        {item.badge}
                      </Badge>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xs bg-terracotta text-white flex items-center justify-center shrink-0 border border-sand/40">
                        <Icon className="w-5 h-5 text-cream" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-serif text-xl font-bold text-terracotta-dark">
                          {item.title}
                        </h3>
                        <p className="text-xs text-forest font-medium font-sans">
                          {item.authority}
                        </p>
                      </div>
                    </div>

                    {/* Identifier Box */}
                    <div className="p-3.5 rounded-xs bg-sand-light border border-border-warm space-y-1.5 font-sans">
                      <span className="text-[10px] text-forest uppercase font-bold tracking-wider block">
                        {item.identifierLabel}:
                      </span>
                      <span className="text-sm font-mono font-bold text-forest block break-all">
                        {item.identifierValue}
                      </span>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-ink border-t border-border-warm/40">
                        <span>{item.dateLabel}: <strong>{item.dateValue}</strong></span>
                        <span className="text-forest font-bold">✓ {item.status}</span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-sand leading-relaxed font-sans pt-1">
                      {item.description}
                    </p>

                    {/* Access & Inspection Strip */}
                    <div className="pt-2 border-t border-border-warm flex items-center justify-between text-xs font-sans">
                      <span className="text-[11px] text-ink-sand">
                        {item.accessNote}
                      </span>
                      <Link href={`/reports#library`}>
                        <Button variant="ghost" size="sm" className="text-xs text-forest hover:text-terracotta-dark p-0 h-auto">
                          <span>View in Library</span>
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Statutory Tax & 80G Disclaimer (CA-Approved Wording) */}
      <section id="tax-disclaimer" className="py-20 bg-terracotta text-white border-y border-sand/30 scroll-mt-24" aria-label="Tax Exemption Disclosure">
        <Container size="default" className="space-y-10">
          <SectionHeader
            badge="Direct Tax Disclosures"
            title="Statutory Status &amp; FY 2026–27 Tax Disclosures"
            subtitle="Historical statutory registration documents are available in the disclosures archive. Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility. No current-year deduction is represented on this page."
            align="center"
            theme="dark"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-xs bg-forest border border-sand/40 space-y-3 font-sans text-xs">
                <span className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-sand" />
                  <span>Statutory Compliance Notice: FY 2026–27 Position</span>
                </span>
                <p className="text-white/95 leading-relaxed">
                  Under MECT&apos;s historical Form 10AC Section 80G order (URN: <strong>{TRUST_CONFIG.statutory.section80GUrn}</strong>, dated 29-01-2024), Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility. Historical registration orders under Section 12A and Section 80G are archived below for factual reference.
                </p>
                <p className="text-white/90 leading-relaxed">
                  For contributions in Tax Year 2026–27 onward, statutory transition and examination orders are governed by Section 354 and Section 536(2)(j) of the Income-tax Act, 2025. <strong>Donors should note that statutory claim approval for FY 2026–27 remains strictly UNCONFIRMED pending formal Chartered Accountant certification.</strong>
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-serif text-lg font-bold text-white">
                  Payment Acknowledgement vs Statutory Tax Certificate
                </h4>
                <ul className="space-y-2 text-xs text-white/95 font-sans">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sand shrink-0 mt-0.5" />
                    <span>Every contribution immediately receives an <strong>Official Donation Receipt &amp; Payment Acknowledgement</strong> confirming funds arrival into MECT&apos;s verified institutional trust accounts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sand shrink-0 mt-0.5" />
                    <span>Official receipts state MECT&apos;s PAN (<code>{TRUST_CONFIG.statutory.pan}</code>) and registered trust deed coordinates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sand shrink-0 mt-0.5" />
                    <span>MECT does not manufacture unverified Form 10BE certificates or guarantee tax deductions prior to statutory CA confirmation.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Audited Banking & Verified Donation Channels */}
            <div className="lg:col-span-5 bg-forest p-7 rounded-xs border border-sand/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase font-bold text-cream tracking-wider">
                  Audited Institutional Accounts
                </span>
                <Badge variant="forest" size="sm">
                  Verified Trust Ledger
                </Badge>
              </div>

              <div className="space-y-3 text-xs font-sans text-white/90">
                <p className="leading-relaxed">
                  MECT maintains dedicated, audited banking channels at State Bank of India (Balangir). In accordance with institutional payment security guidelines, all contributions are received through encrypted online gateways or verified institutional wire transfers under strict reconciliation.
                </p>
                <div className="p-3 bg-white/10 rounded-xs space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-sand">Receipting &amp; Accountability</div>
                  <div className="text-xs text-white">Cryptographically verified (SHA-256) serialized receipts issued for all contributions. Zero cash collections.</div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <Link href="/donate" className="w-full">
                  <Button variant="gold" size="lg" className="w-full justify-center shadow-lg font-bold">
                    <Heart className="w-4 h-4 mr-2 fill-current" aria-hidden="true" />
                    <span>Visit Secure Donation Portal</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Corporate Social Responsibility (CSR) Framework */}
      <section id="csr-framework" className="py-20 md:py-24 bg-cream border-b border-border-warm scroll-mt-24">
        <Container size="default">
          <div className="bg-white rounded-xs p-8 sm:p-12 border border-border-warm shadow-xs space-y-8">
            <SectionHeader
              badge="Schedule VII Compliance"
              title="MCA CSR-1 Registration &amp; Project Areas"
              subtitle="Registered under Schedule VII of the Companies Act, 2013 (CSR Reg Number: CSR00081063), MECT undertakes verified social impact initiatives in Western Odisha."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-ink-sand font-sans">
              <div className="p-6 bg-cream rounded-xs border border-border-warm space-y-2.5">
                <Badge variant="forest" size="sm">
                  Schedule VII (ii)
                </Badge>
                <h4 className="font-serif text-base font-bold text-terracotta-dark">
                  Promoting Education &amp; Remedial Coaching
                </h4>
                <p className="leading-relaxed">
                  Support free after-school remedial coaching, digital study access, scholarship grants, and academic kit distribution for rural and tribal students in Balangir.
                </p>
              </div>

              <div className="p-6 bg-cream rounded-xs border border-border-warm space-y-2.5">
                <Badge variant="forest" size="sm">
                  Schedule VII (iii)
                </Badge>
                <h4 className="font-serif text-base font-bold text-terracotta-dark">
                  Women Vocational Livelihood &amp; Skilling
                </h4>
                <p className="leading-relaxed">
                  Equip rural women with sewing machines, 6-month certified garment fabrication courses, and market linkage tooling for financial self-reliance.
                </p>
              </div>

              <div className="p-6 bg-cream rounded-xs border border-border-warm space-y-2.5">
                <Badge variant="forest" size="sm">
                  Schedule VII (i)
                </Badge>
                <h4 className="font-serif text-base font-bold text-terracotta-dark">
                  Safe Drinking Water (Jal Seva)
                </h4>
                <p className="leading-relaxed">
                  Establish seasonal summer hydration booths and safe drinking water kiosks serving thousands of rural commuters and patient attendants in Balangir.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border-warm">
              <div className="text-xs text-ink-sand font-sans">
                <span>Looking to collaborate on CSR Schedule VII initiatives? Connect with our Corporate Secretariat.</span>
              </div>
              <Link href="/csr-partnerships">
                <Button variant="primary" size="md">
                  <Briefcase className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  <span>CSR Partnership Hub</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Public Record Inspection Rights & Contact Pathway */}
      <section id="inspection" className="py-16 bg-sand-light scroll-mt-24">
        <Container size="default">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-ink font-sans">
            <div>
              <h4 className="font-serif text-lg font-bold text-forest">
                Right to Inspect Public Trust Records
              </h4>
              <p className="mt-1 max-w-2xl leading-relaxed">
                As a registered public charitable trust under the Indian Trusts Act, 1882, certified copies of our Trust Deed, regulatory registration orders, and annual activity summaries are open for institutional examination at our Balangir Registered Office and Bhubaneswar Liaison Secretariat during working hours.
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
