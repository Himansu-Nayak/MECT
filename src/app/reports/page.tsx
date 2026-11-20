import React from "react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { ScrollIndex } from "@/components/motion/ScrollIndex";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReportsLibrarySection } from "@/components/sections/ReportsLibrarySection";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileCheck,
  Scale,
  ArrowRight,
  Receipt,
  Heart,
  Landmark,
  Building2,
  BookOpen,
} from "lucide-react";

export const metadata = createPageMetadata({
  title: "Annual Reports & Records",
  description:
    "Access verified annual activity reports, financial disclosures, and governance documentation for Mahaveer Educational & Charitable Trust (MECT).",
  path: "/reports",
  ogImage: "/images/og-disclosures.png",
});

export default function ReportsPage() {
  const fiduciarySafeguards = [
    {
      title: "Direct Programme Allocation Focus",
      description:
        "Contributions and grants are directed toward educational fees, vocational sewing equipment, water filtration, and nutritional food relief, subject to essential trust administration.",
      icon: Receipt,
    },
    {
      title: "Zero Trustee Remuneration",
      description:
        "In strict adherence to registered Trust Deed Clause XVI, all trustees serve purely in an honorary capacity with zero salary, sitting fees, or personal commissions.",
      icon: Scale,
    },
    {
      title: "Statutory Audit Process",
      description:
        "Trust accounts are prepared annually under Deed Clause XVI; certified audit statements are finalized with our Chartered Accountant for statutory compliance under the Indian Trusts Act, 1882.",
      icon: ShieldCheck,
    },
    {
      title: "Public Inspection Rights",
      description:
        "Certified copies of annual balance sheets and expenditure ledgers are open for physical examination at our Balangir Registered Office and Bhubaneswar Corporate Secretariat.",
      icon: Landmark,
    },
  ];

  const reportingOverviewStats = [
    { label: "Published Institutional Records", value: "10", detail: "On official record" },
    { label: "Reporting Periods Covered", value: "2013–2024", detail: "Founding to FY 2023–24" },
    { label: "Physical Archive Locations", value: "2 Desks", detail: "Balangir HQ & Bhubaneswar" },
    { label: "Remuneration Drawn by Trustees", value: "₹0", detail: "Clause XVI Non-remunerative" },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Institutional Transparency • Public Records Archive"
        title="An Account of Our Work. A Record of Our Responsibility."
        description="Public philanthropy requires complete documentary accountability. Mahaveer Educational & Charitable Trust (MECT) publishes authentic annual activity summaries, government registration credentials, and governance policies on official record."
        breadcrumbs={[{ label: "Governance", href: "/governance" }, { label: "Public Records Library" }]}
        actions={
          <>
            <Link href="#library">
              <Button variant="gold" size="sm">
                <span>Explore Records Library</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/statutory-disclosures">
              <Button variant="dark-outline" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-cream" />
                <span>Statutory Registrations Vault</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Scroll Index Navigation */}
      <ScrollIndex
        items={[
          { id: "overview", label: "Reporting Overview" },
          { id: "safeguards", label: "Fiduciary Safeguards" },
          { id: "library", label: "Records Library" },
          { id: "inspection", label: "Inspection Rights" },
        ]}
      />

      {/* 3. Factual Reporting Overview Bar */}
      <section id="overview" className="py-12 bg-cream border-b border-border-warm scroll-mt-24">
        <Container size="default">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {reportingOverviewStats.map((stat, idx) => (
              <div
                key={idx}
                className="p-5 bg-white border border-border-warm rounded-xs shadow-xs space-y-1 text-center font-sans"
              >
                <span className="text-2xl sm:text-3xl font-serif font-bold text-forest block">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-terracotta-dark block">
                  {stat.label}
                </span>
                <span className="text-[11px] text-ink-sand block">
                  {stat.detail}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Fiduciary Safeguards Section */}
      <section id="safeguards" className="py-20 bg-white border-b border-border-warm scroll-mt-24">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Fiduciary Safeguards"
            title="Accounting Standards &amp; Fiscal Integrity"
            subtitle="Every contribution entrusted to MECT is governed by registered Trust Deed guidelines and multi-tier institutional accountability."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fiduciarySafeguards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={idx}
                  variant="elevated"
                  className="p-6 bg-cream border-border-warm shadow-xs space-y-3 font-sans"
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

      {/* 5. Filterable Public Records & Transparency Library */}
      <ReportsLibrarySection />

      {/* 6. Inspection Rights & Public Secretariat Access */}
      <section id="inspection" className="py-20 bg-sand-light text-ink border-t border-border-warm scroll-mt-24">
        <Container size="default">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-white border border-border-warm rounded-xs p-8 sm:p-10 shadow-xs">
            <Badge variant="forest">
              Statutory Transparency Right
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              Right to Inspect Certified Trust Financials
            </h2>
            <p className="text-sm text-ink leading-relaxed font-sans max-w-2xl mx-auto">
              In accordance with Indian non-profit standards and public trust governance under the Indian Trusts Act, 1882, any citizen, donor, or CSR partner is entitled to inspect physical audited ledgers at our Balangir Registered Office and Bhubaneswar Corporate Secretariat.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link href="/statutory-disclosures">
                <Button variant="gold" size="lg" className="shadow-sm font-bold">
                  <FileCheck className="w-4 h-4 mr-2" />
                  <span>View Statutory Disclosures Vault</span>
                </Button>
              </Link>
              <Link href="/contact?subject=Document%20Inspection%20Appointment">
                <Button variant="outline" size="lg" className="font-semibold">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>Schedule Physical Inspection</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
