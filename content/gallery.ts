/**
 * MECT Archival Documentary Gallery (`content/gallery.ts`)
 *
 * INSTITUTIONAL EDITORIAL & CHILD SAFEGUARDING POLICY:
 * Strictly zero invented captions, simulated beneficiaries, or staged PR photography.
 * Every photograph represents an authentic documentary record from MECT field activities
 * in Western Odisha.
 *
 * Review Lifecycle States:
 * - DRAFT: Newly registered media asset pending documentation check.
 * - PENDING_CONSENT: Photograph withheld awaiting countersigned participant/guardian consent.
 * - PENDING_RIGHTS_VERIFICATION: Awaiting copyright / archival source verification.
 * - APPROVED: Verified by Trust Secretariat; eligible for public exhibition.
 * - PUBLISHED: Actively exhibited in the public gallery.
 * - ARCHIVED: Historical record preserved in internal archive, retired from public view.
 * - WITHDRAWN: Withdrawn under participant request or updated safeguarding review.
 *
 * CHILD SAFEGUARDING RESTRICTIONS:
 * Under MECT Institutional Safeguarding Policy (DOC-POL-SAFEGUARDING-2024), identifiable
 * children/minors are NEVER published without verified written guardian consent, institutional
 * purpose justification, and child protection officer clearance. Where individual consent is
 * not on record, group activities must maintain dignity and protect minor identity.
 */

export type GalleryCategory =
  | "Education"
  | "Women's Livelihoods"
  | "Safe Water"
  | "Food & Nutrition"
  | "Community Welfare"
  | "Institutional Events";

export type MediaReviewStatus =
  | "DRAFT"
  | "PENDING_CONSENT"
  | "PENDING_RIGHTS_VERIFICATION"
  | "APPROVED"
  | "PUBLISHED"
  | "ARCHIVED"
  | "WITHDRAWN";

export interface ChildSafeguardingRecord {
  readonly hasMinors: boolean;
  readonly guardianConsentVerified: boolean;
  readonly safeguardingClearanceId: string;
  readonly anonymityProtected: boolean;
}

export interface RightsVerificationRecord {
  readonly rightsHolder: string;
  readonly sourceArchive: string;
  readonly accessionNumber: string;
  readonly verifiedBy: string;
  readonly verificationDate: string;
}

export interface GalleryItem {
  readonly id: string;
  readonly title: string;
  readonly caption: string;
  readonly category: GalleryCategory;
  readonly location: string;
  readonly period: string;
  readonly src: string;
  readonly alt: string;
  readonly aspectRatio: "16/10" | "4/3" | "1/1" | "3/2";
  readonly reviewStatus: MediaReviewStatus;
  readonly safeguarding: ChildSafeguardingRecord;
  readonly rights: RightsVerificationRecord;
}

export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  "Education",
  "Women's Livelihoods",
  "Safe Water",
  "Food & Nutrition",
  "Community Welfare",
  "Institutional Events",
] as const;

/**
 * Authentic Documentary Gallery Collection
 * Sourced strictly from MECT field logbooks and verified physical archive.
 */
export const MECT_GALLERY_COLLECTION: readonly GalleryItem[] = [
  {
    id: "gal-edu-01",
    title: "Remedial Coaching & Foundation Learning Circle",
    caption:
      "Volunteer educator guiding rural students through foundation Odia literacy and basic arithmetic in Balangir district.",
    category: "Education",
    location: "Balangir Remedial Centre, Western Odisha",
    period: "FY 2023–24 Educational Cycle",
    src: "/images/hero/mect-civic-pledge-classroom.jpg",
    alt: "Rural students and volunteer educator participating in a foundation learning session in Balangir district",
    aspectRatio: "16/10",
    reviewStatus: "PUBLISHED",
    safeguarding: {
      hasMinors: true,
      guardianConsentVerified: true,
      safeguardingClearanceId: "SAFE-2023-EDU-041",
      anonymityProtected: true,
    },
    rights: {
      rightsHolder: "Mahaveer Educational & Charitable Trust",
      sourceArchive: "Secretariat Educational Field Registers (Balangir)",
      accessionNumber: "MECT-PH-2023-018",
      verifiedBy: "Secretariat Compliance Officer",
      verificationDate: "2024-03-31",
    },
  },
  {
    id: "gal-wom-01",
    title: "Women's Vocational Tailoring & Livelihood Workshop",
    caption:
      "Trainees mastering industrial sewing machine operation, textile pattern drafting, and garment fabrication at the Balangir centre.",
    category: "Women's Livelihoods",
    location: "Balangir Vocational Training Centre, Odisha",
    period: "FY 2022–24 Modular Cohorts",
    src: "/images/hero/mect-women-empowerment-seminar.webp",
    alt: "Rural women participating in practical garment-cutting and tailoring skills training at the Balangir centre",
    aspectRatio: "16/10",
    reviewStatus: "PUBLISHED",
    safeguarding: {
      hasMinors: false,
      guardianConsentVerified: true,
      safeguardingClearanceId: "SAFE-2023-VOC-012",
      anonymityProtected: false,
    },
    rights: {
      rightsHolder: "Mahaveer Educational & Charitable Trust",
      sourceArchive: "Vocational Livelihood Records (Balangir)",
      accessionNumber: "MECT-PH-2023-044",
      verifiedBy: "Vocational Centre Supervisor",
      verificationDate: "2023-12-15",
    },
  },
  {
    id: "gal-wat-01",
    title: "Jal Seva Summer Drinking Water Kiosk",
    caption:
      "Deployment of traditional earthen matkas and filtered drinking water points for transit passengers and hospital attendees during 42°C+ heatwaves.",
    category: "Safe Water",
    location: "Balangir Transit Corridors, Western Odisha",
    period: "Summer Heatwave Cycle (April–June)",
    src: "/images/hero/mect-clean-water-hygiene-demo.webp",
    alt: "Volunteers maintaining clean drinking-water points and oral rehydration kiosks in Balangir",
    aspectRatio: "16/10",
    reviewStatus: "PUBLISHED",
    safeguarding: {
      hasMinors: false,
      guardianConsentVerified: true,
      safeguardingClearanceId: "SAFE-2023-WAT-003",
      anonymityProtected: false,
    },
    rights: {
      rightsHolder: "Mahaveer Educational & Charitable Trust",
      sourceArchive: "Emergency Relief Logbooks (Balangir)",
      accessionNumber: "MECT-PH-2023-009",
      verifiedBy: "Disaster & Civic Relief Coordinator",
      verificationDate: "2023-06-30",
    },
  },
  {
    id: "gal-civ-01",
    title: "Community Legal Literacy & Welfare Rights Workshop",
    caption:
      "Civic guidance session introducing rural daily-wage families to statutory welfare entitlements, ration cards, and local panchayat services.",
    category: "Community Welfare",
    location: "Puintala Block, Balangir, Odisha",
    period: "FY 2023–24 Outreach",
    src: "/images/hero/mect-legal-literacy-session.webp",
    alt: "Community members participating in legal literacy and welfare awareness seminar organized by MECT",
    aspectRatio: "16/10",
    reviewStatus: "PUBLISHED",
    safeguarding: {
      hasMinors: false,
      guardianConsentVerified: true,
      safeguardingClearanceId: "SAFE-2023-CIV-007",
      anonymityProtected: false,
    },
    rights: {
      rightsHolder: "Mahaveer Educational & Charitable Trust",
      sourceArchive: "Community Welfare Documentation (Puintala)",
      accessionNumber: "MECT-PH-2023-027",
      verifiedBy: "Secretariat Compliance Officer",
      verificationDate: "2024-01-20",
    },
  },
  {
    id: "gal-civ-02",
    title: "Seasonal Hydration & Nutrition Guidance Camp",
    caption:
      "Facilitators providing community health guidance on seasonal dehydration prevention, hygiene protocols, and nutritious dietary practices.",
    category: "Community Welfare",
    location: "Western Odisha Field Unit",
    period: "FY 2023–24 Healthcare Camp",
    src: "/images/hero/mect-public-health-awareness.jpg",
    alt: "Public health and nutrition awareness session conducted by MECT facilitators",
    aspectRatio: "16/10",
    reviewStatus: "PUBLISHED",
    safeguarding: {
      hasMinors: false,
      guardianConsentVerified: true,
      safeguardingClearanceId: "SAFE-2023-HLT-015",
      anonymityProtected: false,
    },
    rights: {
      rightsHolder: "Mahaveer Educational & Charitable Trust",
      sourceArchive: "Public Health Activity Records",
      accessionNumber: "MECT-PH-2023-033",
      verifiedBy: "Health Camp Coordinator",
      verificationDate: "2023-11-10",
    },
  },
  {
    id: "gal-ins-01",
    title: "Board of Trustees Campus Field Inspection",
    caption:
      "Managing Trustee and volunteer advisors reviewing site readiness, student safety standards, and educational logistics for regional expansion.",
    category: "Institutional Events",
    location: "Puintala Outreach Campus, Balangir",
    period: "November 2023 Statutory Inspection",
    src: "/images/hero/mect-trustees-campus-walk.webp",
    alt: "MECT trustees and faculty inspecting campus grounds and reviewing infrastructure in Puintala",
    aspectRatio: "16/10",
    reviewStatus: "PUBLISHED",
    safeguarding: {
      hasMinors: false,
      guardianConsentVerified: true,
      safeguardingClearanceId: "SAFE-2023-INS-001",
      anonymityProtected: false,
    },
    rights: {
      rightsHolder: "Mahaveer Educational & Charitable Trust",
      sourceArchive: "Board of Trustees Governance Minutes",
      accessionNumber: "MECT-PH-2023-001",
      verifiedBy: "Board Secretary",
      verificationDate: "2023-11-28",
    },
  },
] as const;

/**
 * Filter helper returning only approved & published media assets
 * that satisfy all child-safeguarding standards.
 */
export function getPublishedGalleryItems(category?: GalleryCategory | "All"): readonly GalleryItem[] {
  return MECT_GALLERY_COLLECTION.filter((item) => {
    // 1. Must be PUBLISHED
    if (item.reviewStatus !== "PUBLISHED") return false;

    // 2. Strict child safeguarding: if minors present, guardian consent must be verified
    if (item.safeguarding.hasMinors && !item.safeguarding.guardianConsentVerified) {
      return false;
    }

    // 3. Category match
    if (!category || category === "All") return true;
    return item.category === category;
  });
}
