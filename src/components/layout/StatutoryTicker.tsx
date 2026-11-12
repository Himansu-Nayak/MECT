"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ORG } from "@content/org";
import { ShieldCheck, PhoneCall, FileText, Heart } from "lucide-react";

export function StatutoryTicker() {
  const credentials = [
    `Regd. Public Charitable Trust (Deed No. ${ORG.trustDeed.deedNumber})`,
    `NITI Aayog Darpan: ${ORG.ids.darpan}`,
    `MoSJE e-Anudaan: ${ORG.ids.eAnudaan}`,
    `IT Act 12A URN: ${ORG.ids.urn12A}`,
    `IT Act 80G URN: ${ORG.ids.urn80G}`,
    `PAN: ${ORG.ids.pan}`,
  ];

  return (
    <div
      className="bg-forest-deep text-cream border-b border-sand/25 text-xs py-1.5 transition-colors print:hidden overflow-x-hidden"
      role="region"
      aria-label="Statutory Accreditation and Real-Time Institutional Desk"
    >
      <Container size="default">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Ticker Badge & Scrolling Statutory Credentials */}
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0 flex-1">
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-sand text-forest-deep text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 text-forest-deep" aria-hidden="true" />
              <span>Statutory</span>
            </span>

            <div className="overflow-hidden whitespace-nowrap text-[11px] sm:text-xs text-white/95 min-w-0 flex-1 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
              <div className="inline-flex items-center animate-marquee font-medium">
                {[0, 1].map((dup) => (
                  <span
                    key={dup}
                    aria-hidden={dup === 1}
                    className="inline-flex items-center shrink-0 pr-6"
                  >
                    {credentials.map((cred, idx) => (
                      <span key={`${dup}-${idx}`} className="inline-flex items-center">
                        <span className="mx-2 text-sand/85">•</span>
                        <span>{cred}</span>
                      </span>
                    ))}
                    <span className="mx-2 text-sand/85">•</span>
                    <span className="text-cream">
                      Registered Office: Balangir, Odisha | Corporate Liaison: Bhubaneswar, Odisha
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/statutory-disclosures"
              aria-label="Read full statutory disclosures and registration details"
              className="lg:hidden shrink-0 inline-flex items-center gap-1 px-2 py-1 min-h-[28px] rounded-xs border border-sand/40 text-[10px] font-semibold text-sand hover:bg-forest transition-colors whitespace-nowrap"
            >
              <FileText className="w-3 h-3" aria-hidden="true" />
              <span>View</span>
            </Link>
          </div>

          {/* Right: Quick Links for Disclosures, Donate & Helpline */}
          <div className="hidden lg:flex items-center space-x-3.5 shrink-0 text-[11px] font-sans">
            <Link
              href="/statutory-disclosures"
              className="text-cream/85 hover:text-sand transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-sand"
            >
              <FileText className="w-3 h-3 text-sand" aria-hidden="true" />
              <span>Statutory Disclosures</span>
            </Link>
            <span className="text-white/30" aria-hidden="true">|</span>
            <Link
              href="/donate"
              className="text-white font-semibold hover:text-sand transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-sand"
            >
              <Heart className="w-3 h-3 text-sand fill-current" aria-hidden="true" />
              <span>Donate Now (SBI)</span>
            </Link>
            <span className="text-white/30" aria-hidden="true">|</span>
            <a
              href={ORG.helpline.href}
              className="text-cream/85 hover:text-sand transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-sand"
              title="Official Institutional Helpline"
            >
              <PhoneCall className="w-3 h-3 text-sand" aria-hidden="true" />
              <span>{ORG.helpline.display}</span>
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
