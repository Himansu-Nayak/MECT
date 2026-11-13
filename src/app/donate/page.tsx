import React, { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { UnifiedDonationExperience } from "@/components/sections/UnifiedDonationExperience";
import { PortalAuthProvider } from "@/context/PortalAuthContext";

export default function DonatePage() {
  return (
    <div className="bg-cream min-h-screen">
      <PageHero
        title="Contribute to Mahaveer Educational & Charitable Trust"
        description="One unified, transparent donation experience with Cashfree online checkout and verified State Bank of India direct transfer."
        breadcrumbs={[{ label: "Donate" }]}
      />

      <section className="py-10 sm:py-14">
        <Container size="default" className="max-w-5xl">
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
        </Container>
      </section>
    </div>
  );
}
