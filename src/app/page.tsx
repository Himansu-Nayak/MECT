import React from "react";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { InstitutionalIdentityTrustSection } from "@/components/sections/InstitutionalIdentityTrustSection";
import { InterconnectedSafetyNetSection } from "@/components/sections/InterconnectedSafetyNetSection";
import { UnifiedInitiativesAndImpactSection } from "@/components/sections/UnifiedInitiativesAndImpactSection";
import { CompactMemoriesSection } from "@/components/sections/CompactMemoriesSection";
import { CompactGetInvolvedSection } from "@/components/sections/CompactGetInvolvedSection";
import { CompactFinalCtaSection } from "@/components/sections/CompactFinalCtaSection";

/**
 * Mahaveer Educational & Charitable Trust (MECT) — Institutional Master Homepage
 *
 * Streamlined 7-Section Architecture (Phase 24 Digital Reinvention):
 * 1. SECTION 01 — Cinematic Institutional Hero (Identity, vision, primary intent, and zero-CLS entrance)
 * 2. SECTION 02 — Institutional Identity & Fiduciary Roots (13+ yr tenure, verified Deed of Trust 2013, 100% honorary trustees Clause XVI, 4 statutory credentials)
 * 3. SECTION 03 — The Interconnected Safety Net (Socio-economic architecture showing how water, nutrition, livelihoods, education, and welfare interlock)
 * 4. SECTION 04 — Priority Initiatives & Documented Telemetry (Consolidated higher education target + Hanuman Murti 3D + audited telemetry)
 * 5. SECTION 05 — Archival Memories & Documentary Exhibition (Curated field photographs preview with lightbox modal and safeguarding badge)
 * 6. SECTION 06 — Pathways to Participate (Direct donation, donor portal, volunteer mentorship, CSR partnerships)
 * 7. SECTION 07 — Final Fiduciary Invitation (Closing institutional pledge, registered office, canonical helpline 9853608113 & email mect220@gmail.com)
 *
 * Operational tools, scheme discovery, application forms, and statutory archives
 * are housed on their dedicated canonical pages.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-cream">
      {/* SECTION 01: Cinematic Institutional Hero */}
      <CinematicHero />

      {/* SECTION 02: Institutional Identity & Fiduciary Roots */}
      <InstitutionalIdentityTrustSection />

      {/* SECTION 03: The Interconnected Safety Net Architecture */}
      <InterconnectedSafetyNetSection />

      {/* SECTION 04: Priority Initiatives & Documented Telemetry (Consolidated) */}
      <UnifiedInitiativesAndImpactSection />

      {/* SECTION 05: Archival Memories & Documentary Exhibition */}
      <CompactMemoriesSection />

      {/* SECTION 06: Pathways to Participate */}
      <CompactGetInvolvedSection />

      {/* SECTION 07: Final Fiduciary Invitation & Canonical Contact */}
      <CompactFinalCtaSection />
    </div>
  );
}
