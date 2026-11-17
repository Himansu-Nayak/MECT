import React from "react";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { CompactTrustStrip } from "@/components/sections/CompactTrustStrip";
import { CompactAboutSection } from "@/components/sections/CompactAboutSection";
import { CompactWorkAreasSection } from "@/components/sections/CompactWorkAreasSection";
import { FeaturedInitiativesSection } from "@/components/sections/FeaturedInitiativesSection";
import { CompactImpactSection } from "@/components/sections/CompactImpactSection";
import { CompactHowMectWorks } from "@/components/sections/CompactHowMectWorks";
import { CompactGetInvolvedSection } from "@/components/sections/CompactGetInvolvedSection";
import { CompactFinalCtaSection } from "@/components/sections/CompactFinalCtaSection";

/**
 * Mahaveer Educational & Charitable Trust (MECT) — Institutional Homepage
 *
 * Consolidated 9-Section Architecture (Strictly Aligned with Institutional Directive):
 * 1. SECTION 01 — Premium Institutional Hero (Identity, vision & primary intent)
 * 2. SECTION 02 — Compact Institutional Trust Strip (Verified statutory credentials & archive link)
 * 3. SECTION 03 — Short About MECT (Concise 70–90 word institutional introduction)
 * 4. SECTION 04 — Our Areas of Work (5 core documented development sectors)
 * 5. SECTION 05 — Featured Initiatives (Proposed 200-student target & Hanuman Murti project)
 * 6. SECTION 06 — Impact at a Glance (350+ entries, 120+ enrolments, 10,000+ relief instances, 13+ yrs tenure)
 * 7. SECTION 07 — How MECT Works (Compact 4-step operating sequence)
 * 8. SECTION 08 — Get Involved (Donate, Volunteer, CSR Partnership options)
 * 9. SECTION 09 — Final Institutional CTA (Closing fiduciary invitation)
 *
 * Detailed operational tools, application forms, scheme discovery, and statutory archives
 * are housed on their dedicated canonical pages.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-cream">
      {/* SECTION 01: Premium Institutional Hero */}
      <CinematicHero />

      {/* SECTION 02: Compact Institutional Trust Strip */}
      <CompactTrustStrip />

      {/* SECTION 03: Short About MECT */}
      <CompactAboutSection />

      {/* SECTION 04: Our Areas of Work */}
      <CompactWorkAreasSection />

      {/* SECTION 05: Featured Initiatives */}
      <FeaturedInitiativesSection />

      {/* SECTION 06: Impact at a Glance */}
      <CompactImpactSection />

      {/* SECTION 07: How MECT Works */}
      <CompactHowMectWorks />

      {/* SECTION 08: Get Involved */}
      <CompactGetInvolvedSection />

      {/* SECTION 09: Final Institutional CTA */}
      <CompactFinalCtaSection />
    </div>
  );
}
