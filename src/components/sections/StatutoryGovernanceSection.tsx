"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import { ORG } from "@content/org";
import {
  ShieldCheck,
  FileText,
  Building2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Lock,
  ArrowRight,
  Landmark,
  Scale,
  Copy,
  Check,
} from "lucide-react";

/**
 * MECT Phase 27 — Section 08: Statutory Governance & Sovereign Docket
 *
 * Upgraded with:
 * - Interactive credential inspection with copyable filing reference
 * - Staggered card entrance with tactile focus states
 * - Physical registry inspection policy and verification pathways
 */
export function StatutoryGovernanceSection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const credentials = [
    {
      title: "Registered Public Trust Deed",
      regNo: "Deed No. 40311302194",
      rawCopy: "Deed No. 40311302194, Balangir Sub-Registrar",
      authority: "Sub-Registrar, Balangir, Govt. of Odisha",
      date: "Executed 27-07-2013 • Registered 30-07-2013",
      icon: Building2,
      badge: "Deed Book 4, Vol 45, Pgs 32–48",
    },
    {
      title: "Permanent Account Number (PAN)",
      regNo: "PAN: AADTM5474F",
      rawCopy: "AADTM5474F",
      authority: "Income Tax Department, Govt. of India",
      date: "Trust Status: Public Charitable Trust",
      icon: FileText,
      badge: "Government of India",
    },
    {
      title: "Historical Section 12A & 80G Orders",
      regNo: "12A: AADTM5474FE20231 | 80G: AADTM5474FF20241",
      rawCopy: "12A: AADTM5474FE20231, 80G: AADTM5474FF20241",
      authority: "Income Tax Department (Form 10AC Orders)",
      date: "Historical Coverage: AY 2024-25 to AY 2026-27",
      icon: CheckCircle2,
      badge: "Historical Statutory Orders",
    },
    {
      title: "MCA CSR-1 Registration",
      regNo: "Reg No: CSR00081063",
      rawCopy: "CSR00081063",
      authority: "Ministry of Corporate Affairs, New Delhi",
      date: "Approved: 09-11-2024 • SRN: N14617237",
      icon: ShieldCheck,
      badge: "Schedule VII Eligible",
    },
    {
      title: "NITI Aayog NGO Darpan",
      regNo: "Darpan ID: OR/2024/0466491",
      rawCopy: "OR/2024/0466491",
      authority: "NITI Aayog, Government of India",
      date: "Enrolled Voluntary Organisation Portal",
      icon: ExternalLink,
      badge: "Central Registry",
    },
    {
      title: "MoSJE e-Anudaan Portal",
      regNo: "Portal ID: OR/00040466",
      rawCopy: "OR/00040466",
      authority: "Ministry of Social Justice & Empowerment",
      date: "Official Social Welfare Organization Index",
      icon: Landmark,
      badge: "Central Ministry",
    },
  ];

  return (
    <section
      id="transparency-and-governance"
      aria-labelledby="statutory-heading"
      className="py-16 sm:py-20 md:py-24 bg-white border-b border-[#E7E0D5] scroll-mt-16 relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-16 max-w-[1520px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-forest/30 bg-[#16221D]/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-ink shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-terracotta shrink-0" aria-hidden="true" />
              <span>Section 08 • Transparency, Governance &amp; Statutory Docket</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="statutory-heading"
              className="font-serif text-[clamp(1.9rem,3.2vw,3rem)] font-bold text-ink tracking-tight leading-[1.14] [text-wrap:balance]"
            >
              Statutory Transparency: Verifiable Sovereign Registrations
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
              MECT operates with total statutory rigor. All sovereign registrations, Ministry certifications, and statutory registration orders are catalogued below with official government reference numbers for independent verification.
            </p>
          </Reveal>
        </div>

        {/* 6 Sovereign Credential Docket Cards with Copy Action */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.06}>
          {credentials.map((cred, idx) => {
            const Icon = cred.icon;
            const isCopied = copiedIndex === idx;
            return (
              <StaggerItem key={idx}>
                <div className="p-6 bg-[#FAF7F2] rounded-[2px] border border-[#E7E0D5] hover:border-terracotta/50 transition-all flex flex-col justify-between space-y-5 h-full shadow-xs group">
                  <div className="space-y-3.5">
                    {/* Badge Row */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E7E0D5]/70">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-white border border-[#E7E0D5] text-ink-muted font-semibold">
                        {cred.badge}
                      </span>
                      <Icon className="w-4 h-4 text-terracotta" aria-hidden="true" />
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-ink group-hover:text-terracotta-dark transition-colors">
                      {cred.title}
                    </h3>

                    {/* Official Registration ID with Copy Button */}
                    <div className="p-2.5 rounded-[2px] bg-white border border-[#E7E0D5] flex items-center justify-between gap-2">
                      <span className="font-mono text-xs sm:text-[12.5px] font-bold text-ink tracking-tight break-all">
                        {cred.regNo}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(cred.rawCopy, idx)}
                        className="p-1 rounded-[2px] text-ink-muted hover:text-terracotta hover:bg-sand/30 transition-colors shrink-0"
                        aria-label={`Copy reference number for ${cred.title}`}
                        title="Copy reference number"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Issuing Authority & Tenure */}
                    <div className="space-y-1 text-xs text-ink-secondary font-sans">
                      <div>
                        <strong className="text-ink font-semibold">Authority:</strong> {cred.authority}
                      </div>
                      <div className="text-[11px] text-ink-muted">
                        {cred.date}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E7E0D5]/70 flex items-center justify-between text-[11px] font-mono text-terracotta font-semibold">
                    <span>{isCopied ? "Reference Copied!" : "Verified Official Record"}</span>
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* Founder Custodianship & Institutional Leadership Plaque */}
        <Reveal direction="up" delay={0.12}>
          <div className="p-7 sm:p-8 rounded-[2px] bg-white border border-[#E7E0D5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-terracotta/40 transition-colors">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-[2px] overflow-hidden border border-[#E7E0D5] bg-forest shrink-0 shadow-xs group">
                <Image
                  src="/images/leadership/er-japabandhu-kampa.webp"
                  alt="Er. Japabandu Kampa, Settler Founder & Chairman cum Managing Trustee of MECT"
                  fill
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 rounded-[2px] border border-forest/20 bg-forest/5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-forest font-semibold">
                  <span>Founder Custodianship • Deed Clauses 8(2) &amp; 10</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                  Er. Japabandu Kampa
                </h3>
                <p className="text-xs sm:text-sm text-terracotta font-semibold font-sans">
                  Settler Founder &amp; Chairman cum Managing Trustee
                </p>
                <p className="text-xs text-ink-secondary leading-relaxed font-sans max-w-2xl pt-1">
                  Designated life founder Chairman cum Managing Trustee under registered Trust Deed No. 40311302194. Executive administration, statutory accounts, and property custody are governed under Clause XVI permanent honorary non-remunerative service.
                </p>
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-center">
              <Link href="/governance#leadership">
                <Button variant="outline" size="sm" className="border-[#E7E0D5] text-ink hover:bg-cream">
                  <span>View Governance Role</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Physical Audit Ledger & Office Inspection Plaque */}
        <Reveal direction="up" delay={0.15}>
          <div className="p-6 sm:p-7 rounded-[2px] bg-[#FAF7F2] border border-[#E7E0D5] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-white border border-[#E7E0D5] flex items-center justify-center shrink-0 text-terracotta mt-0.5">
                <MapPin className="w-4 h-4 text-terracotta" aria-hidden="true" />
              </div>
              <div className="space-y-1 text-xs text-ink-secondary font-sans leading-relaxed">
                <span className="font-bold text-ink font-mono uppercase tracking-wider text-[11px] block">
                  Registered Office Physical Inspection Policy
                </span>
                <p>
                  In accordance with Trust Deed Clause XVI and sovereign public charity laws, certified copies of all trust deeds, annual audit statements, and activity registers are accessible for physical inspection at our registered office:{" "}
                  <strong className="text-ink">{ORG.addresses.registered.full}</strong>.
                  Statutory hours: Monday through Saturday, 10:00 to 17:30 IST.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/statutory-disclosures">
                <Button variant="primary" size="sm" className="font-bold bg-terracotta hover:bg-terracotta-dark text-white">
                  <span>View All Certificates</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/governance">
                <Button variant="outline" size="sm" className="border-[#E7E0D5] text-ink hover:bg-white">
                  <span>Board of Trustees Charter</span>
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
