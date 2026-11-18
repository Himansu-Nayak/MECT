import React from "react";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { InstitutionalStorySection } from "@/components/sections/InstitutionalStorySection";
import { InterconnectedSafetyNetSection } from "@/components/sections/InterconnectedSafetyNetSection";
import { AuditedImpactTelemetrySection } from "@/components/sections/AuditedImpactTelemetrySection";
import { DocumentaryFieldExhibitionSection } from "@/components/sections/DocumentaryFieldExhibitionSection";
import { DifferentiatedCampaignsSection } from "@/components/sections/DifferentiatedCampaignsSection";
import { StatutoryGovernanceSection } from "@/components/sections/StatutoryGovernanceSection";
import { TailoredParticipationPathwaysSection } from "@/components/sections/TailoredParticipationPathwaysSection";
import { ClosingFiduciaryPledgeSection } from "@/components/sections/ClosingFiduciaryPledgeSection";

/**
 * Mahaveer Educational & Charitable Trust (MECT) — Institutional Master Homepage
 *
 * Evidence-Led Institutional Storytelling Journey (Phase 25 Master Architecture):
 * 1. SECTION 01 — The First Impression: Cinematic Hero with explicit Western Odisha local context
 * 2. SECTION 02 — Why MECT Exists: Grassroots founding 2013, agrarian distress, and 100% honorary trusteeship Clause XVI
 * 3. SECTION 03 & 04 — The MECT Difference & Five Intervention Pillars: Interconnected socio-economic safety net architecture
 * 4. SECTION 05 — Evidence of Impact: Audited telemetry (350+ entries, 120+ course enrolments, 10,000+ relief instances, 13+ yrs)
 * 5. SECTION 06 — Real Stories, Real People: Archival documentary field exhibition with child safeguarding charter
 * 6. SECTION 07 — Differentiated Campaigns & Cultural Heritage: Proposed Higher Education Target & Proposed 80–100 ft Hanuman Murti 3D
 * 7. SECTION 08 — Transparency & Governance: Statutory disclosures register (Deed, PAN, 12A/80G, CSR-1, NGO Darpan, physical inspection)
 * 8. SECTION 09 — Participate in the Mission: Six tailored pathways (Donors, Volunteers, CSR, Educational Partners, Community, Collaborators)
 * 9. SECTION 10 — The Closing Message: Earned fiduciary pledge, registered office in Balangir, canonical phone 9853608113 & email mect220@gmail.com
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-cream">
      {/* SECTION 01: The First Impression (Cinematic Hero) */}
      <CinematicHero />

      {/* SECTION 02: Why MECT Exists (Institutional Heritage & Honorary Trusteeship) */}
      <InstitutionalStorySection />

      {/* SECTION 03 & 04: The MECT Difference & Five Intervention Pillars (The Interconnected Model) */}
      <InterconnectedSafetyNetSection />

      {/* SECTION 05: Evidence of Impact (Audited Telemetry & Strict Definitions) */}
      <AuditedImpactTelemetrySection />

      {/* SECTION 06: Real Stories, Real People (Documentary Field Records & Safeguarding) */}
      <DocumentaryFieldExhibitionSection />

      {/* SECTION 07: Campaigns & Cultural Heritage (Educational Grants vs. Hanuman Murti 3D) */}
      <DifferentiatedCampaignsSection />

      {/* SECTION 08: Transparency, Governance & Statutory Accountability */}
      <StatutoryGovernanceSection />

      {/* SECTION 09: Participate in the Mission (Six Tailored Participation Pathways) */}
      <TailoredParticipationPathwaysSection />

      {/* SECTION 10: The Closing Message (Earned Institutional Statement & Canonical Contact) */}
      <ClosingFiduciaryPledgeSection />
    </div>
  );
}
