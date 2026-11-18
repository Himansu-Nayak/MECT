import React from "react";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { InstitutionalIdentityTrustSection } from "@/components/sections/InstitutionalIdentityTrustSection";
import { CompactWorkAreasSection } from "@/components/sections/CompactWorkAreasSection";
import { UnifiedInitiativesAndImpactSection } from "@/components/sections/UnifiedInitiativesAndImpactSection";
import { CompactMemoriesSection } from "@/components/sections/CompactMemoriesSection";
import { CompactGetInvolvedSection } from "@/components/sections/CompactGetInvolvedSection";
import { CompactFinalCtaSection } from "@/components/sections/CompactFinalCtaSection";

/**
 * Mahaveer Educational & Charitable Trust (MECT) — Institutional Master Homepage
 *
 * Streamlined 7-Section Architecture (Phase 23 Premium Digital Transformation):
 * 1. SECTION 01 — Cinematic Institutional Hero (Identity, vision, primary intent, and zero-CLS entrance)
 * 2. SECTION 02 — Institutional Identity & Trust (13+ yr tenure, verified Deed of Trust 2013, 4 statutory credentials, trustees walk photo)
 * 3. SECTION 03 — Core Development Pillars (5 verified development focus areas with distinct iconography and micro-interactions)
 * 4. SECTION 04 — Priority Initiatives & Documented Impact (Consolidated higher education target + Hanuman Murti 3D + audited telemetry)
 * 5. SECTION 05 — Archival Memories & Documentary Exhibition (Curated field photographs preview with lightbox modal and safeguarding badge)
 * 6. SECTION 06 — Pathways to Participate (Direct donation, donor portal, volunteer mentorship, CSR partnerships)
 * 7. SECTION 07 — Final Fiduciary Invitation (Closing institutional pledge, registered office, direct secretariat helpline)
 *
 * Operational tools, scheme discovery, application forms, and statutory archives
 * are housed on their dedicated canonical pages.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-cream">
      {/* SECTION 01: Cinematic Institutional Hero */}
      <CinematicHero />

      {/* SECTION 02: Institutional Identity & Trust */}
      <InstitutionalIdentityTrustSection />

      {/* SECTION 03: Core Development Pillars */}
      <CompactWorkAreasSection />

      {/* SECTION 04: Priority Initiatives & Documented Impact (Consolidated) */}
      <UnifiedInitiativesAndImpactSection />

      {/* SECTION 05: Archival Memories & Documentary Exhibition */}
      <CompactMemoriesSection />

      {/* SECTION 06: Pathways to Participate */}
      <CompactGetInvolvedSection />

      {/* SECTION 07: Final Fiduciary Invitation */}
      <CompactFinalCtaSection />
    </div>
  );
}
