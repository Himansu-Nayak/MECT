"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TRUST_CONFIG } from "@/lib/config";
import { ShieldCheck, PhoneCall, FileText, Heart } from "lucide-react";

export function StatutoryTicker() {
  const credentials = [
    `Regd. Public Charitable Trust (Deed No. ${TRUST_CONFIG.statutory.trustDeedNumber.split(", Document No. ")[1] || "40311302194"}, Est. 2013)`,
    `NITI Aayog Darpan: ${TRUST_CONFIG.statutory.ngoDarpanId}`,
    `MCA CSR-1 Reg: ${TRUST_CONFIG.statutory.mcaCsrNumber}`,
    `IT Act 12A URN: ${TRUST_CONFIG.statutory.section12AUrn}`,
    `IT Act 80G URN: ${TRUST_CONFIG.statutory.section80GUrn} (50% Tax Deduction)`,
    `PAN: ${TRUST_CONFIG.statutory.pan}`,
  ];

  return (
    <div
      className="bg-[#0A192F] text-[#EDE6D8] border-b border-[#C5A059]/30 text-xs py-1.5 transition-colors print:hidden"
      role="region"
      aria-label="Statutory Accreditation and Real-Time Institutional Desk"
    >
      <Container size="default">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Ticker Badge & Scrolling Statutory Credentials */}
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[#C5A059] text-[#0A192F] text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 text-[#0A192F]" aria-hidden="true" />
              <span>Statutory</span>
            </span>

            <div className="overflow-hidden whitespace-nowrap text-xs text-white/90">
              <span className="inline-block animate-marquee font-medium">
                {credentials.map((cred, idx) => (
                  <span key={idx} className="inline-flex items-center">
                    <span className="mx-2 text-[#C5A059]/70">•</span>
                    <span>{cred}</span>
                  </span>
                ))}
                <span className="mx-2 text-[#C5A059]/70">•</span>
                <span className="text-[#E4C88A]">
                  Registered Office: Balangir, Odisha | Corporate Liaison: Bhubaneswar, Odisha
                </span>
              </span>
            </div>
          </div>

          {/* Right: Quick Links for Disclosures, Donate & Helpline */}
          <div className="hidden lg:flex items-center space-x-3.5 shrink-0 text-[11px] font-sans">
            <Link
              href="/statutory-disclosures"
              className="text-white/80 hover:text-[#E4C88A] transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#C5A059]"
            >
              <FileText className="w-3 h-3 text-[#C5A059]" aria-hidden="true" />
              <span>Statutory Disclosures</span>
            </Link>
            <span className="text-white/30" aria-hidden="true">|</span>
            <Link
              href="/donate"
              className="text-[#E4C88A] font-semibold hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#C5A059]"
            >
              <Heart className="w-3 h-3 text-[#D97706]" aria-hidden="true" />
              <span>Donate (80G Tax Benefit)</span>
            </Link>
            <span className="text-white/30" aria-hidden="true">|</span>
            <a
              href={`tel:${TRUST_CONFIG.contact.phones.helpline}`}
              className="text-white/80 hover:text-[#E4C88A] transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#C5A059]"
              title="Official Institutional Helpline"
            >
              <PhoneCall className="w-3 h-3 text-[#C5A059]" aria-hidden="true" />
              <span>{TRUST_CONFIG.contact.phones.helpline}</span>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
