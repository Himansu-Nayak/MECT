import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Building2,
  FileCheck2,
  ArrowRight,
  Landmark,
  CheckCircle2,
  Lock,
  Receipt,
  Scale,
} from "lucide-react";

export function DirectDisbursalFlowchart() {
  const steps = [
    {
      stepNumber: "01",
      title: "Merit & Means Scrutiny",
      description:
        "Objective verification of 10th/+2 marksheets, valid college enrollment letters, and certified household income proofs.",
      icon: FileCheck2,
      badge: "Stage 1: Verification",
    },
    {
      stepNumber: "02",
      title: "Committee Sanction",
      description:
        "Independent academic committee reviews anonymized dossiers under a blind-appraisal rubric. Zero discretionary quotas.",
      icon: Scale,
      badge: "Stage 2: Governance",
    },
    {
      stepNumber: "03",
      title: "Direct College RTGS Disbursal",
      description:
        "100% of approved tuition assistance is wired directly to the verified official bank account of the degree-granting college.",
      icon: Landmark,
      badge: "Stage 3: 100% Non-Cash",
      highlight: true,
    },
    {
      stepNumber: "04",
      title: "Official Receipt & Reconciliation",
      description:
        "College bursar issues official fee clearance receipt. Audited annually by independent Chartered Accountants.",
      icon: Receipt,
      badge: "Stage 4: Public Audit",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#072617] text-[#EDE6D8] border-b border-[#C5A059]/25 relative overflow-hidden">
      {/* Subtle background decorative pattern & glow */}
      <div
        className="absolute inset-0 opacity-5 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-0 w-96 h-96 bg-[#165B38]/20 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container size="default" className="relative space-y-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge
            variant="gold-dark"
            icon={<Lock className="w-3.5 h-3.5 text-[#C5A059]" aria-hidden="true" />}
          >
            Zero-Cash Policy • Fiduciary Integrity
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Direct-to-College Disbursal Standard
          </h2>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
            MAHAVIR TRUST strictly eliminates cash intermediaries. Under our proposed governance standard, approved tuition fee grants will be disbursed directly to accredited educational institutions on behalf of verified scholars.
          </p>
        </div>

        {/* 4-Step Interactive Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.stepNumber}
                className={`relative p-6 sm:p-7 rounded-xs border transition-all duration-300 flex flex-col justify-between ${
                  item.highlight
                    ? "bg-[#0B3B24] border-[#C5A059] shadow-xl"
                    : "bg-white/5 border-white/10 hover:border-[#C5A059]/40"
                }`}
              >
                {/* Step Counter Top Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="font-serif text-2xl font-bold text-[#E4C88A]">
                    {item.stepNumber}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#E4C88A] bg-black/25 px-2 py-0.5 rounded-xs">
                    {item.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="py-5 space-y-3">
                  <div className="w-12 h-12 rounded-xs bg-[#072617] border border-[#C5A059]/40 flex items-center justify-center text-[#E4C88A]">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Verification Check */}
                <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-[#E4C88A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" aria-hidden="true" />
                  <span>Auditable Protocol</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout Strip: Statutory Safeguards */}
        <div className="bg-[#0B3B24]/80 border border-[#C5A059]/30 rounded-xs p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-[#E4C88A] block">
              Fiduciary Commitment
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
              No Intermediary Agents. Zero Processing Commissions.
            </h4>
            <p className="text-xs text-white/75 max-w-2xl leading-relaxed font-sans">
              MAHAVIR TRUST does not authorize commercial consultants, brokers, or cash collection agents. All scholarship inquiries and applications are managed exclusively via our official Secretariat Desk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/governance">
              <Button variant="gold" size="md">
                <span>View Fiduciary Charter</span>
                <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
