import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MECT_ORG } from "@/config/org";

export interface StatutoryStripProps {
  className?: string;
}

export function StatutoryStrip({ className = "" }: StatutoryStripProps) {
  return (
    <section className={`py-10 bg-sand/15 border-t border-sand/30 print:hidden ${className}`}>
      <Container size="default">
        <div className="rounded-xl border border-sand/40 bg-cream p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>Institutional Statutory Transparency</span>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              <strong className="text-forest font-semibold">{MECT_ORG.legalName}</strong> is a registered public charitable trust (Deed Doc No. {MECT_ORG.statutory.trustDeedNumber}, Balangir Sub-Registrar | PAN: {MECT_ORG.statutory.pan} | MCA CSR-1: {MECT_ORG.statutory.mcaCsrNumber} | NGO Darpan: {MECT_ORG.statutory.ngoDarpanId}). {MECT_ORG.taxNotice}
            </p>
          </div>
          <Link
            href="/statutory-disclosures"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-forest text-cream text-xs sm:text-sm font-semibold hover:bg-forest-deep transition-colors whitespace-nowrap shadow-xs focus-visible:outline-2 focus-visible:outline-forest"
          >
            <span>Verify Disclosures</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

export default StatutoryStrip;
