import React from "react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import { ORG } from "@content/org";
import {
  ShieldCheck,
  Scale,
  Landmark,
  ArrowRight,
  Receipt,
  ExternalLink,
  FileCheck,
  Building,
  UserCheck,
  ScrollText,
} from "lucide-react";

export const metadata = createPageMetadata({
  title: "Governance Charter & Board",
  description:
    "Governance framework, registered Trust Deed No. 40311302194, Clause XVI honorary code, and statutory compliance for MECT in Odisha.",
  path: "/governance",
  ogImage: "/images/og-disclosures.png",
});

export default function GovernancePage() {
  const fiduciaryPrinciples = [
    {
      title: "Charitable Purpose Exclusivity",
      clause: "Deed Clauses 23, 24 & 25",
      description:
        "All institutional assets, contributions, and accrued yields are irrevocably dedicated to advancing education, women's vocational livelihoods, and humanitarian relief in Western Odisha. Commercial profiteering or deviation from documented objects is prohibited.",
      icon: Landmark,
    },
    {
      title: "Honorary Trustee Non-Remuneration",
      clause: "Clause 9(XVI)",
      description:
        "Trustees serve purely in an honorary capacity with zero salary, sitting fees, or personal commissions from Trust funds. Only actual, documented, and vouched expenses incurred exclusively for Trust business may be reimbursed.",
      icon: Scale,
    },
    {
      title: "Direct Bank-Channel Disbursements",
      clause: "Deed Clause 16 & Operating Code",
      description:
        "Programme funds and educational fee grants are planned for disbursement through direct bank transfers (RTGS/NEFT) to accredited educational institutions and verified vendors, eliminating cash intermediaries.",
      icon: Receipt,
    },
    {
      title: "Statutory CA Audit & Records Custody",
      clause: "Clause 9(VII) & Clause 16",
      description:
        "Annual balance sheets and expenditure ledgers are audited by a certified Chartered Accountant in compliance with the Indian Trusts Act and Income Tax Act norms, and are retained at the Balangir Secretariat for institutional review.",
      icon: FileCheck,
    },
  ];

  const statutoryCredentials = [
    {
      label: "Registered Trust Deed",
      value: "No. 40311302194 (Balangir)",
      subtext: "Executed 27 July 2013; Registered 30 July 2013 (District Sub-Registrar)",
    },
    {
      label: "Section 12A Registration",
      value: "URN: AADTM5474FE20231",
      subtext: "CBDT Order Dated 29-01-2024 (AY 2024-25 to 2026-27)",
    },
    {
      label: "Section 80G Approval",
      value: "URN: AADTM5474FF20241",
      subtext: "CBDT Form 10AC Order Dated 29-01-2024 (Historical AY 2024-25 to 2026-27)",
    },
    {
      label: "MCA CSR-1 Registration",
      value: "CSR00081063",
      subtext: "Ministry of Corporate Affairs Approval (09-11-2024, SRN: N14617237)",
    },
    {
      label: "NITI Aayog NGO Darpan",
      value: "ID: OR/2024/0466491",
      subtext: "National Voluntary Sector Registry Entry",
    },
    {
      label: "Permanent Account Number (PAN)",
      value: ORG.ids.pan,
      subtext: "Income Tax Department, Government of India",
    },
  ];

  const keyDeedClauses = [
    {
      clause: "Clause 8(1)",
      title: "Board Size (3–9 Trustees)",
      description:
        "Per Trust Deed Clause 8(1), the Board comprises not less than three and not more than nine Trustees at any point of time, exercising collective governance authority over Trust property and charitable administration.",
    },
    {
      clause: "Clause 8(2) & 10",
      title: "Managing Trustee Powers & Custodianship",
      description:
        "Clause 8(2) names Sri Japabandhu Kampa as life founder Chairman cum Managing Trustee. Clause 10 vests executive administration, custody of trust properties, and books of accounts in the Chairman cum Managing Trustee.",
    },
    {
      clause: "Clause 12",
      title: "Meeting Quorum Requirements",
      description:
        "Under Clause 12, 'A minimum numbers of 2 or of one third of the total Trustees in the Board which ever is more shall constitute quorum for a valid meeting of the Board.'",
    },
    {
      clause: "Clause 9(XVI)",
      title: "Strict Honorary Non-Remuneration",
      description:
        "Per Clause 9(XVI), 'The Trustee shall not be entitled to any remuneration and shall work in an honorary capacity. However Trustee may reimburse himself... all expenses properly incurred in or about the execution of the Trust.' Note: This non-remuneration standard applies strictly to Trustees and does not imply zero operational, banking, or vendor procurement expenses.",
    },
    {
      clause: "Clause 9(VII) & Clause 16",
      title: "Lawful Investments & Annual CA Audit",
      description:
        "Clause 9(VII) directs investment of trust funds in accordance with mandatory provisions of law. Clause 16 mandates that regular books of accounts be maintained, and annual income & expenditure accounts and balance sheets be drawn and audited by a Chartered Accountant, Cost Accountant, or public auditor.",
    },
    {
      clause: "Clause 23",
      title: "Preservation of Charitable Intent",
      description:
        "Per Clause 23, neither the Settler Founder nor the Board of Trustees has power to alter aims or amend clauses in any manner repugnant to Sections 2(15), 11 to 13, and 80G of the Income Tax Act, 1961. Any amendments require unanimous agreement in a general meeting.",
    },
    {
      clause: "Clause 24",
      title: "Territorial Application & Tax Exemption",
      description:
        "Per Clause 24, all income and corpus must be applied solely to public educational and charitable purposes within India to secure tax exemption under Indian law.",
    },
    {
      clause: "Clause 25",
      title: "Perpetual Irrevocability & Extinguishment",
      description:
        "Per Clause 25, the Trust and Trust fund are irrevocable for all times. Upon extinguishment, entire trust funds and properties must be handed over to other trusts or institutions having similar objects.",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-cream">
      {/* 1. Page Hero Banner */}
      <PageHero
        badge="Institutional Governance & Trustee Charter"
        badgeVariant="forest-dark"
        title="Leadership, Stewardship & Board Governance"
        description="Public confidence is the cornerstone of enduring philanthropy. Mahaveer Educational & Charitable Trust (MECT) operates under registered deed governance, non-remunerative trustee stewardship, and complete statutory transparency."
        breadcrumbs={[{ label: "About Us", href: "/about" }, { label: "Governance" }]}
        actions={
          <>
            <Link href="#leadership">
              <Button variant="gold" size="sm">
                <span>Institutional Leadership</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="#stewardship-statement">
              <Button variant="dark-outline" size="sm">
                <ScrollText className="w-3.5 h-3.5 mr-1 text-cream" aria-hidden="true" />
                <span>Stewardship Statement</span>
              </Button>
            </Link>
            <Link href="/statutory-disclosures">
              <Button variant="dark-outline" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cream" aria-hidden="true" />
                <span>Statutory Credentials</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Statutory Registrations & Institutional Identifiers Strip */}
      <section
        id="statutory-strip"
        className="py-8 bg-sand-light/60 border-b border-border-warm"
        aria-label="Statutory Registrations & Institutional Identifiers"
      >
        <Container size="default">
          <div className="p-6 bg-white rounded-xs border border-border-warm shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0 border border-sand/40">
                <ShieldCheck className="w-6 h-6 text-sand" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="forest" size="sm">
                    Statutory Registrations
                  </Badge>
                  <span className="text-xs text-terracotta-dark font-bold font-mono">
                    Deed No. 40311302194 (Balangir Sub-Registrar)
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm text-ink font-semibold font-serif">
                  Governed under Indian Trusts Act, 1882 • Section 12A/80G &amp; MCA CSR-1 Registered
                </h2>
                <p className="text-xs text-ink-sand leading-relaxed font-sans">
                  Registered Office: Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001 • Trust PAN: <strong className="text-terracotta-dark">{ORG.ids.pan}</strong> • Section 12A URN: <strong className="text-terracotta-dark">{ORG.ids.urn12A}</strong> (Order dated 29-01-2024) • Documents on file.
                </p>
              </div>
            </div>
            <Link href="/statutory-disclosures" className="shrink-0">
              <Button variant="secondary" size="sm">
                <span>View Full Statutory Orders</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. Section 01: Institutional Leadership & Board of Trustees */}
      <section id="leadership" className="py-20 md:py-28 bg-cream border-b border-border-warm scroll-mt-20" aria-label="Institutional Leadership">
        <Container size="default" className="space-y-14">
          <Reveal direction="up">
            <SectionHeader
              badge="Institutional Leadership"
              title="Board of Trustees &amp; Custodians of the Charter"
              subtitle="As established under the registered Trust Deed of 2013, MECT is governed by permanent and life trustees serving in an honorary capacity without personal remuneration."
              align="center"
            />
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Managing Trustee Card */}
            <StaggerItem>
              <Card
                variant="elevated"
                className="h-full p-7 sm:p-9 bg-white border-border-warm shadow-xs hover:border-terracotta/40 hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border-warm">
                    <Badge variant="forest" size="sm">
                      Settler Founder (Deed 2013)
                    </Badge>
                    <span className="text-[11px] font-mono text-terracotta-dark bg-terracotta/8 px-2.5 py-0.5 rounded-2xs font-semibold">
                      Deed Clause 8(2) &amp; 10
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0 font-serif font-bold text-xl border border-sand shadow-xs">
                      JK
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                        {ORG.chairman.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-terracotta-dark font-semibold font-sans">
                        {ORG.chairman.role}
                      </p>
                      <p className="text-[11px] font-mono text-ink-secondary">
                        Settler Founder • Balangir, Odisha
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans pt-1">
                    Named as Settler Founder in the registered Trust Deed (executed 27 July 2013; registered 30 July 2013, Office of the District Sub-Registrar Balangir, Book 4, Vol 45, Doc No. 40311302194) and designated life founder Chairman cum Managing Trustee under founding deed Clauses 8(2) and 10. Custodianship of Trust properties and statutory filings is derived from founding deed provisions; formal re-confirmation of the active board roster and present resolutions is tracked under secretariat records.
                  </p>
                </div>

                <div className="pt-4 border-t border-border-warm flex items-center justify-between text-xs text-ink-secondary font-mono">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                    <span>Founder Custodian</span>
                  </span>
                  <span className="text-forest font-semibold">Honorary Service</span>
                </div>
              </Card>
            </StaggerItem>

            {/* Board Composition & Additional Trustees Card */}
            <StaggerItem>
              <Card
                variant="elevated"
                className="h-full p-7 sm:p-9 bg-white border-border-warm shadow-xs hover:border-terracotta/40 hover:shadow-md transition-all duration-300 space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border-warm">
                    <Badge variant="neutral" size="sm">
                      Board Composition
                    </Badge>
                    <span className="text-[11px] font-mono text-ink-secondary bg-sand/40 px-2.5 py-0.5 rounded-2xs font-semibold">
                      Deed Clause 8(1)
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xs bg-sand text-forest flex items-center justify-center shrink-0 font-serif font-bold text-xl border border-border-warm">
                      BT
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                        Board of Trustees
                      </h3>
                      <p className="text-xs sm:text-sm text-terracotta-dark font-semibold font-sans">
                        3 to 9 Honorary Trustees per Deed
                      </p>
                      <p className="text-[11px] font-mono text-ink-secondary">
                        Collective Board Authority
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans pt-1">
                    Under Clause 8(1) of the registered Trust Deed, the Board comprises not less than 3 and not more than 9 honorary trustees at any point of time. Trustees exercise collective oversight over charitable budgets, audit approvals, and statutory compliance. Formal updated biographical records and consented profiles for the full current roster are tracked under secretariat confirmation.
                  </p>
                </div>

                <div className="pt-4 border-t border-border-warm flex items-center justify-between text-xs text-ink-secondary font-mono">
                  <span className="flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                    <span>Quorum: ≥ 2 or 1/3 of Board (Cl. 12)</span>
                  </span>
                  <span className="text-terracotta-dark font-semibold">Non-Remunerated</span>
                </div>
              </Card>
            </StaggerItem>
          </StaggerGroup>
        </Container>
      </section>

      {/* 4. Section 02: Institutional Stewardship Statement */}
      <section
        id="stewardship-statement"
        className="py-20 md:py-28 bg-white border-b border-border-warm scroll-mt-20"
        aria-label="Institutional Stewardship Statement"
      >
        <Container size="default">
          <div className="max-w-4xl mx-auto rounded-xs border border-border-warm bg-sand-light/40 p-8 sm:p-12 lg:p-14 space-y-8 shadow-xs">
            {/* Header / Crest */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border-warm">
              <div className="space-y-1.5">
                <Badge variant="forest" size="md">
                  Governance Statement
                </Badge>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest tracking-tight">
                  Institutional Stewardship Statement
                </h2>
                <p className="text-xs sm:text-sm text-ink-secondary font-mono">
                  Formal declaration of operating ethics, governance discipline, and community commitments adopted by Mahaveer Educational &amp; Charitable Trust.
                </p>
              </div>
              <div className="shrink-0 w-12 h-12 rounded-full bg-forest text-cream flex items-center justify-center border border-sand">
                <ScrollText className="w-6 h-6 text-sand" aria-hidden="true" />
              </div>
            </div>

            {/* Statement Narrative Body */}
            <div className="space-y-5 text-sm sm:text-base text-ink leading-relaxed font-sans">
              <p className="font-serif font-medium text-base sm:text-lg text-forest leading-relaxed">
                Mahaveer Educational &amp; Charitable Trust (MECT) operates under an institutional principle of stewardship: charitable contributions and endowments represent a solemn public trust, requiring transparent administration, verifiable outcomes, and strict adherence to registered objects.
              </p>

              <p>
                When MECT was formally executed on 27 July 2013 in Balangir, its founding purpose was established in law: to provide an enduring, lawful, and accountable civic foundation addressing educational disparities, promoting women&apos;s vocational skills, and offering essential humanitarian relief across Western Odisha.
              </p>

              <p>
                Philanthropy in rural Odisha operates where community needs are pressing and resources must be managed with absolute diligence. Under Clause 9(XVI) of our registered Trust Deed, every trustee serves without salary, sitting fees, or financial remuneration. Contributions entrusted to the Trust are treated as a sacred stewardship, directed through documented bank remittances straight to educational fees, practical training materials, and verified community assistance.
              </p>

              <p>
                We believe that institutional integrity requires rigorous honesty. We distinguish documented operational achievements—such as our after-school learning circles in Balangir and Puintala, women&apos;s modular tailoring cohorts, and seasonal Jal Seva drinking-water points—from aspirational programs that remain under development. We invite community members, regulatory authorities, and institutional partners to review our audited records and join us in building an accountable, dignified future.
              </p>
            </div>

            {/* Attribution Footer */}
            <div className="pt-6 border-t border-border-warm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-ink-secondary">
              <div className="space-y-1">
                <p className="font-serif font-bold text-sm text-forest">
                  Mahaveer Educational &amp; Charitable Trust (MECT)
                </p>
                <p>Regd. Deed No. 40311302194 • Balangir, Odisha</p>
                <p className="text-[11px] text-ink-sand">Registered Office: Near Sai Mandir, Rugudipara, Balangir - 767001</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="neutral" size="sm">
                  Institutional Policy
                </Badge>
                <Badge variant="forest" size="sm">
                  Deed-Bound Covenant
                </Badge>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Section 03: The Governance Charter & Fundamental Principles */}
      <section
        id="fiduciary-charter"
        className="py-20 md:py-28 bg-cream border-b border-border-warm scroll-mt-20"
        aria-label="Governance Charter"
      >
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Governance Charter"
            title="Core Principles of Charitable Stewardship"
            subtitle="The registered Trust Deed establishes four non-negotiable operational and financial standards that govern every decision of the Board."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fiduciaryPrinciples.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card
                  key={index}
                  variant="elevated"
                  className="p-7 sm:p-8 bg-white border-border-warm shadow-xs hover:border-sand transition-all space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border-warm">
                    <Badge variant="forest" size="sm">
                      Charter Principle 0{index + 1}
                    </Badge>
                    <span className="text-[11px] font-mono text-terracotta-dark font-semibold">
                      {item.clause}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xs bg-sand text-forest flex items-center justify-center shrink-0 border border-border-warm">
                      <Icon className="w-5 h-5 text-forest" aria-hidden="true" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-xl font-bold text-forest">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Honorary Governance Scope Alert Banner */}
          <div className="p-6 sm:p-8 rounded-xs bg-terracotta text-white border border-sand/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Scale className="w-8 h-8 text-cream shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-white">
                  Trust Deed Clause 9(XVI): Explicit Non-Remuneration Scope
                </h4>
                <p className="text-xs sm:text-sm text-white/90 font-sans leading-relaxed">
                  Trustees serve strictly in an honorary capacity without salary or fees. This non-remuneration standard applies strictly to Trustees and does not imply zero operational, banking, or vendor procurement expenses; legitimate third-party operational costs (e.g. bank transfer charges, certified Chartered Accountant audit fees, college fee remittances, and workshop supplies) are incurred and accounted for under strict ledger controls.
                </p>
              </div>
            </div>
            <Link href="/statutory-disclosures" className="shrink-0">
              <Button variant="gold" size="sm" className="font-bold">
                Inspect Statutory Vault
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 6. Section 04: Clause-by-Clause Registered Trust Deed Mandates */}
      <section className="py-20 bg-white border-b border-border-warm" aria-label="Key Trust Deed Clauses">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Deed Mandates"
            title="Clause-by-Clause Governance Matrix (Trust Deed No. 40311302194)"
            subtitle="Executed on 27 July 2013 and registered with the District Sub-Registrar in Balangir, the Deed defines the perpetual constitutional boundaries of our institution."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyDeedClauses.map((item, idx) => (
              <Card
                key={idx}
                variant="elevated"
                className="p-6 sm:p-8 bg-white border-border-warm shadow-xs space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-2xs">
                      {item.clause}
                    </span>
                    <Badge variant="forest" size="sm">
                      Deed Covenant
                    </Badge>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-terracotta-dark">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border-warm text-[11px] font-mono text-ink-secondary flex items-center justify-between">
                  <span>Document No. 40311302194</span>
                  <span>Balangir Sub-Registrar</span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. Section 05: Statutory Registry & Public Document Inspection */}
      <section id="statutory-registry" className="py-20 md:py-28 bg-sand-light/50" aria-label="Statutory Credentials Registry">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Public Inspection Registry"
            title="Statutory Registrations & Document Inspection Procedures"
            subtitle="Verified statutory orders, Government registrations, and secretarial inspection procedures governing Mahaveer Educational & Charitable Trust."
            align="center"
          />

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {statutoryCredentials.map((cred, idx) => (
              <Card
                key={idx}
                variant="elevated"
                className="p-5 sm:p-6 bg-white border-border-warm shadow-xs space-y-2"
              >
                <p className="text-[11px] font-mono uppercase tracking-wider text-ink-secondary font-bold">
                  {cred.label}
                </p>
                <p className="font-serif text-lg font-bold text-forest">
                  {cred.value}
                </p>
                <p className="text-xs text-ink-sand font-sans">
                  {cred.subtext}
                </p>
              </Card>
            ))}
          </div>

          {/* Document Access & Secretarial Protocol Notice */}
          <div className="rounded-xs border border-border-warm bg-white p-7 sm:p-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                <Building className="w-5 h-5 text-sand" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                  Secretariat Document Inspection Procedure
                </h3>
                <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
                  In accordance with the Indian Trusts Act, certified copies of the registered Trust Deed, official CBDT exemption orders, and annual certified Balance Sheet summaries are maintained at the registered office and are available for institutional review upon prior written appointment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-warm text-xs font-sans">
              <div className="space-y-2">
                <h4 className="font-mono font-bold text-forest uppercase tracking-wider text-[11px]">
                  Registered Inspection Venue:
                </h4>
                <p className="text-ink leading-relaxed">
                  Mahaveer Educational &amp; Charitable Trust (MECT)<br />
                  Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001<br />
                  Physical inspection available by prior written appointment via mect220@gmail.com.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-mono font-bold text-forest uppercase tracking-wider text-[11px]">
                  Confidentiality &amp; Record Safeguards:
                </h4>
                <p className="text-ink-sand leading-relaxed">
                  Public inspection applies strictly to statutory registrations and audited annual financial summaries. Individual student scholarship applications, personal identifying documents, and donor transaction records are protected under institutional privacy standards and applicable data protection legislation.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href="/statutory-disclosures">
                <Button variant="primary" size="sm">
                  <span>View Full Statutory Orders</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" size="sm">
                  <span>Annual Reports &amp; CA Audits</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" size="sm">
                  <span>Contact Secretariat</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Statutory Disclosures & Transparency Strip */}
      
    </div>
  );
}
