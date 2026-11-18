import React from "react";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { InstitutionalIdentityTrustSection } from "@/components/sections/InstitutionalIdentityTrustSection";
import { CompactWorkAreasSection } from "@/components/sections/CompactWorkAreasSection";
import { FeaturedInitiativesSection } from "@/components/sections/FeaturedInitiativesSection";
import { CompactImpactSection } from "@/components/sections/CompactImpactSection";
import { CompactHowMectWorks } from "@/components/sections/CompactHowMectWorks";
import { CompactMemoriesSection } from "@/components/sections/CompactMemoriesSection";
import { CompactGetInvolvedSection } from "@/components/sections/CompactGetInvolvedSection";
import { CompactFinalCtaSection } from "@/components/sections/CompactFinalCtaSection";

/**
 * Mahaveer Educational & Charitable Trust (MECT) — Institutional Homepage
 *
 * Consolidated 9-Section Architecture (Phase 22 Institutional Master Specification):
 * 1. SECTION 01 — Cinematic Institutional Hero (Identity, vision & primary intent)
 * 2. SECTION 02 — Institutional Identity & Trust (Consolidated trust strip & 50–80 word intro)
 * 3. SECTION 03 — Our Areas of Work (5 documented development pillars, 20–35 words each)
 * 4. SECTION 04 — Featured Initiatives (Proposed 200-student target & Proposed Hanuman Murti)
 * 5. SECTION 05 — Documented Impact (3 verified metrics + 13+ yr tenure, methodology link)
 * 6. SECTION 06 — How MECT Works (4-step accountable operational sequence)
 * 7. SECTION 07 — Memories & Gallery (Curated editorial preview of authentic field photography)
 * 8. SECTION 08 — Get Involved (Donate, Volunteer, CSR Partnership options)
 * 9. SECTION 09 — Final Institutional CTA (Closing fiduciary invitation)
 *
 * Detailed operational tools, application forms, scheme discovery, and statutory archives
 * are housed on their dedicated canonical pages.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-cream">
      {/* SECTION 01: Cinematic Institutional Hero */}
      <CinematicHero />

      {/* SECTION 02: Institutional Identity & Trust */}
      <InstitutionalIdentityTrustSection />

      {/* SECTION 03: Our Areas of Work */}
      <CompactWorkAreasSection />

      {/* SECTION 04: Featured Initiatives */}
      <FeaturedInitiativesSection />

      {/* SECTION 05: Documented Impact */}
      <CompactImpactSection />

      {/* SECTION 06: How MECT Works */}
      <CompactHowMectWorks />

      {/* SECTION 07: Memories & Gallery Preview */}
      <CompactMemoriesSection />

      {/* SECTION 08: Get Involved */}
      <CompactGetInvolvedSection />

      {/* SECTION 09: Final Institutional CTA */}
      <CompactFinalCtaSection />
    </div>
  );
}
