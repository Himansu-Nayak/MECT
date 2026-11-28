import React, { Suspense } from "react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { DonationJourney } from "@/components/donation/DonationJourney";
import { MECT_ORG } from "@/config/org";
import { ORG } from "@content/org";
import { createPageMetadata } from "@/lib/seo";
import { Building2, ShieldCheck, Loader2 } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Donate & Support Our Mission",
  description: `Support ${ORG.legalName}'s charitable initiatives across education, women's livelihoods, drinking water, and food relief in Odisha via secure online payment or direct bank transfer/UPI.`,
  path: "/donate",
  ogImage: "/images/og-donate.png",
});

export default function DonatePage() {
  return (
    <div className="bg-cream min-h-screen text-ink flex flex-col">
      {/* 1. Page Hero */}
      <PageHero
        title="Support Our Work Across Odisha"
        description={`Every contribution directly supports ${ORG.legalName}'s initiatives in education, women's vocational livelihoods, safe drinking water, food security, and community relief in Western Odisha.`}
        breadcrumbs={[{ label: "Donate" }]}
      />

      <section className="py-10 sm:py-16 flex-1" aria-label="Official Banking Details and Remittance Channels">
        <Container size="default" className="max-w-4xl space-y-10">
          {/* Institutional Contribution Policy Notice */}
          <div className="p-5 sm:p-6 bg-sand/20 rounded-xl border border-sand/40 space-y-2">
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>Institutional Contribution Policy</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-forest leading-relaxed">
              Contributions are accepted online via secure payment gateway (Cards, Net Banking, UPI) or directly via State Bank of India bank transfer (NEFT/RTGS/UPI).
            </p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Every voluntary donation directly finances verified grassroots initiatives in Western Odisha. Official computer-signed 80G tax receipts are issued upon verified settlement.
            </p>
          </div>

          {/* Systematic 7-Step Donation Journey */}
          <Suspense
            fallback={
              <div className="p-8 sm:p-12 text-center text-forest bg-white rounded-xl border border-sand/40 shadow-xs space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-forest mb-2" />
                <p className="text-sm font-semibold text-forest">Preparing Secure Donation Portal...</p>
                <p className="text-xs text-ink-muted">Loading verified charitable programmes and payment channels.</p>
              </div>
            }
          >
            <DonationJourney />
          </Suspense>

          {/* Fallback for environments where JavaScript is disabled */}
          <noscript>
            <div className="p-6 sm:p-8 bg-white rounded-xl border border-sand/40 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-sand/30">
                <div className="w-10 h-10 rounded-lg bg-forest text-cream flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-sand" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-forest tracking-wider block">
                    Official Trust Account
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                    {MECT_ORG.bank.bankName}
                  </h2>
                </div>
              </div>

              <div className="overflow-x-auto -mx-1 sm:mx-0 px-1 sm:px-0">
                <table className="w-full min-w-[260px] text-left text-xs sm:text-sm font-sans">
                  <tbody className="divide-y divide-sand/20">
                    <tr>
                      <th scope="row" className="py-3 pr-4 font-bold text-forest w-1/3">
                        Account Name:
                      </th>
                      <td className="py-3 text-ink font-semibold">{ORG.bank.accountName}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 pr-4 font-bold text-forest">
                        Account Number:
                      </th>
                      <td className="py-3 text-forest font-mono font-bold text-sm sm:text-base tracking-wide">
                        {ORG.bank.accountNumber}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 pr-4 font-bold text-forest">
                        IFSC Code:
                      </th>
                      <td className="py-3 text-forest font-mono font-bold text-sm sm:text-base tracking-wide">
                        {ORG.bank.ifsc}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 pr-4 font-bold text-forest">
                        UPI ID (VPA):
                      </th>
                      <td className="py-3 text-forest font-mono font-bold text-sm sm:text-base">
                        {ORG.bank.upiId}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </noscript>

          {/* Institutional Transparency & Verification Notice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-ink-muted pt-4">
            <div className="bg-white border border-sand/30 rounded-xl p-5 space-y-2">
              <h3 className="font-serif font-bold text-forest text-sm">Receipt Verification Process</h3>
              <p className="leading-relaxed">
                Our accounts team reconciles incoming transfers against our daily State Bank of India ledger. An official receipt is dispatched to your registered email address upon verification.
              </p>
            </div>

            <div className="bg-white border border-sand/30 rounded-xl p-5 space-y-2">
              <h3 className="font-serif font-bold text-forest text-sm">Tax Treatment Notice</h3>
              <p className="leading-relaxed">
                {MECT_ORG.taxNotice} Historical registration orders (12A &amp; 80G, URN: {ORG.ids.urn80G}) are catalogued in the{" "}
                <Link href="/statutory-disclosures" className="text-forest underline font-semibold">
                  statutory disclosures vault
                </Link>{" "}
                for factual review.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
