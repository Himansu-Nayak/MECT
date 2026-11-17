import React, { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { UnifiedDonationExperience } from "@/components/sections/UnifiedDonationExperience";
import { PortalAuthProvider } from "@/context/PortalAuthContext";

export default function DonatePage() {
  return (
    <div className="bg-cream min-h-screen">
      <PageHero
        title="Give With Purpose. Support Work That Matters."
        description="Your contribution supports MECT's documented charitable activities and programme objectives. Choose how you would like to participate and review the applicable donation terms before proceeding."
        breadcrumbs={[{ label: "Donate" }]}
      />

      <section className="py-10 sm:py-14">
        <Container size="default" className="max-w-5xl space-y-10">
          <Suspense
            fallback={
              <div className="bg-white border border-border-soft rounded-xs p-10 text-center text-sm text-ink-muted">
                Loading unified donation portal...
              </div>
            }
          >
            <PortalAuthProvider>
              <UnifiedDonationExperience />
            </PortalAuthProvider>
          </Suspense>

          {/* Institutional Transparency & Statutory Receipting Information */}
          <div className="border-t border-border-soft pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-ink-muted">
            <div className="bg-white border border-border-soft rounded-xs p-5 space-y-2">
              <h3 className="font-serif font-bold text-forest text-sm">Receipt &amp; Acknowledgment</h3>
              <p className="leading-relaxed">
                Every verified contribution generates an auditable, serialized <strong>Official Donation Receipt &amp; Payment Acknowledgement (PDF)</strong> with a cryptographic SHA-256 hash. Receipts are queued to our transactional outbox for email delivery and permanently accessible in your authenticated Donor Portal.
              </p>
            </div>

            <div className="bg-white border border-border-soft rounded-xs p-5 space-y-2">
              <h3 className="font-serif font-bold text-forest text-sm">Statutory Tax Reporting Policy</h3>
              <p className="leading-relaxed">
                MECT holds historical registration orders under Section 12A (URN: AADTM5474FE20231) and Section 80G (URN: AADTM5474FF20241). Under the Income-tax Act, 2025 (Section 354, Rule 190), statutory certificates (Form 114) are generated following electronic filing of the donation statement (Form 113). Current tax year 80G claims remain subject to Chartered Accountant verification.
              </p>
            </div>

            <div className="bg-white border border-border-soft rounded-xs p-5 space-y-2">
              <h3 className="font-serif font-bold text-forest text-sm">Fund Administration &amp; Processing</h3>
              <p className="leading-relaxed">
                Donations are administered in accordance with MECT&apos;s charitable objectives and applicable donation terms. Applicable bank or payment processing charges may apply. If you encounter any payment error, double-debit, or UTR reconciliation inquiry, contact MECT Accounts directly at{" "}
                <a href="mailto:donations@mect.org.in" className="text-terracotta-dark font-semibold underline hover:text-forest">
                  donations@mect.org.in
                </a>{" "}
                or call{" "}
                <a href="tel:+919437123616" className="text-terracotta-dark font-semibold underline hover:text-forest">
                  +91 94371 23616
                </a>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
