/**
 * Consented Beneficiary & Field Stories (`content/stories.ts`)
 *
 * MECT Editorial Standard:
 * Strictly zero invented testimonials, fabricated quotations, or exaggerated outcomes.
 * Individual stories require signed consent on file; where individual records
 * are withheld for privacy, activities are published as verified programme dispatches.
 */

export interface ConsentedStory {
  id: string;
  title: string;
  district: string;
  programme: string;
  quote: string;
  attribution: string;
  year: string;
}

export type EditorialLabel =
  | "FIELD NOTE"
  | "COMMUNITY DISPATCH"
  | "PROGRAMME RECORD"
  | "ARCHIVAL ACCOUNT";

export type EvidenceClassification =
  | "VERIFIED INDIVIDUAL STORY"
  | "DOCUMENTED PROGRAMME DISPATCH"
  | "HISTORICAL DOCUMENTARY RECORD"
  | "ILLUSTRATIVE MATERIAL"
  | "UNVERIFIED";

export interface FieldDispatchImage {
  src: string;
  alt: string;
  caption: string;
  credit: string;
}

export interface FieldDispatch {
  id: string;
  slug: string;
  editorialLabel: EditorialLabel;
  title: string;
  subtitle: string;
  programme: string;
  location: string;
  period: string;
  evidenceClassification: EvidenceClassification;
  sourceReference: string;
  summary: string;
  fullNarrative: readonly string[];
  highlights: readonly string[];
  image: FieldDispatchImage;
  destinationUrl: string;
  publicationStatus: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  verificationNotes: string;
}

/**
 * Individual beneficiary stories with signed written consent on file.
 * Kept empty until individual written consent forms are countersigned by Secretariat.
 */
export const CONSENTED_STORIES: readonly ConsentedStory[] = [];

/**
 * Verified Documentary Field Dispatches — People, Places & Purpose
 * Sourced directly from MECT Balangir Community Learning Centre logbooks,
 * Vocational Training Centre attendance registers, and FY 2021–24 Annual Reports.
 */
export const FIELD_DISPATCHES: readonly FieldDispatch[] = [
  {
    id: "the-classroom-remedial-support",
    slug: "classroom",
    editorialLabel: "FIELD NOTE",
    title: "The Classroom: Foundation Learning & Rural Mentorship",
    subtitle:
      "Community learning circles addressing post-primary academic continuity in Balangir and Puintala.",
    programme: "Remedial Education & Scholastic Continuity",
    location: "Balangir & Puintala Blocks, Odisha",
    period: "FY 2021–24 Educational Cycles",
    evidenceClassification: "DOCUMENTED PROGRAMME DISPATCH",
    sourceReference:
      "Balangir Community Learning Centre Registers & Annual Progress Reports (FY 2021–24)",
    summary:
      "Volunteer educators conduct after-school learning circles focusing on basic numeracy, Odia literacy, and foundational science for students from rural government schools across Balangir and Puintala.",
    fullNarrative: [
      "In the rural outskirts of Balangir and Puintala blocks, transition rates between primary schooling and upper-primary classes face persistent pressures from regional socioeconomic displacement and uneven classroom staffing. To support student retention without replacing formal state institutions, MECT established community-based remedial learning circles, operating out of rural civic spaces and the Balangir Community Learning Centre (founded February 2023).",
      "The learning circles operate on an evening after-school schedule. Local volunteer educators and visiting facilitators guide learners through foundational mathematics, regional language comprehension, and basic civic awareness. Regular attendance registers document continuous cohort engagement, with over 350 student participation entries recorded across the 2023–24 academic period.",
      "Rather than focusing on competitive testing metrics, these sessions prioritize daily homework guidance, textbook retention, and conceptual confidence. By maintaining structured registers and direct contact with parent guardians, the programme monitors retention patterns and ensures educational continuity across multi-village catchment clusters.",
    ],
    highlights: [
      "Structured after-school learning circles in Balangir and Puintala blocks.",
      "Focus on foundational numeracy, Odia literacy, and homework guidance.",
      "Over 350 student attendance entries recorded in FY 2023–24 registers.",
      "All educators serve through honorary or community volunteer frameworks.",
    ],
    image: {
      src: "/images/hero/mect-civic-pledge-classroom.jpg",
      alt: "Rural students and volunteer mentor participating in an educational learning session in Balangir district",
      caption:
        "Remedial classroom orientation and foundation learning session conducted by MECT volunteer mentors in Balangir district.",
      credit: "MECT Programme Documentation Archive (Balangir Centre)",
    },
    destinationUrl: "/stories#classroom",
    publicationStatus: "PUBLISHED",
    verificationNotes:
      "Classroom group photograph. Narrative compiled strictly from Balangir Community Learning Centre logbooks and FY 2021–24 Annual Reports. Zero invented beneficiary names or individual test scores.",
  },
  {
    id: "the-workshop-vocational-tailoring",
    slug: "workshop",
    editorialLabel: "PROGRAMME RECORD",
    title: "The Workshop: Practical Tailoring & Garment Fabrication",
    subtitle:
      "Modular skills instruction equipping rural women with certified textile cutting and machine maintenance proficiencies.",
    programme: "Women's Vocational Training & Swavalamban",
    location: "Balangir Training Centre, Odisha",
    period: "FY 2022–24 Modular Cohorts",
    evidenceClassification: "DOCUMENTED PROGRAMME DISPATCH",
    sourceReference:
      "MECT Vocational Centre Attendance Logs & FY 2022–23 / FY 2023–24 Activity Reports",
    summary:
      "Structured 6-month modular training batches provide practical instruction in garment drafting, pattern cutting, machine operation, and stitching techniques at the Balangir centre.",
    fullNarrative: [
      "Economic independence in western Odisha often hinges on localized, home-accessible craftsmanship. At MECT's Balangir Vocational Training Centre, rural women, young widows, and members of neighborhood self-help groups participate in intensive, 6-month modular instruction programs in professional tailoring and garment fabrication.",
      "The syllabus balances theoretical drafting with rigorous machine practice. Trainees learn body measurement transcription, geometric fabric cutting, seam reinforcement, machine assembly, and daily mechanical maintenance. Over 120 cumulative vocational course enrolments (FY 2021–23) have been recorded across documented operating cycles.",
      "Training cohorts operate collaboratively, allowing senior participants to assist newer trainees through complex stitching techniques such as collar alignment and industrial buttonholing. The workshop emphasizes precision, waste reduction, and practical garments suitable for regional school uniforms and domestic markets.",
    ],
    highlights: [
      "6-month structured curriculum covering pattern drafting and garment cutting.",
      "120+ cumulative vocational course enrolments (FY 2021–23), not necessarily 120 uniquely certified women.",
      "Hands-on instruction on mechanical sewing machine operation and upkeep.",
      "Focus on regional school uniforms and self-directed domestic tailoring.",
    ],
    image: {
      src: "/images/hero/mect-women-empowerment-seminar.webp",
      alt: "Rural women participating in practical garment-cutting and tailoring skills training at the Balangir centre",
      caption:
        "Community vocational training seminar and practical tailoring instruction at the Balangir centre.",
      credit: "MECT Field Documentation Archive (Balangir)",
    },
    destinationUrl: "/stories#workshop",
    publicationStatus: "PUBLISHED",
    verificationNotes:
      "Group seminar and workshop documentation. Supported by FY 2022–23 and FY 2023–24 Activity Reports. Individual commercial success claims or unverified business founding withheld.",
  },
  {
    id: "the-water-point-seasonal-jal-seva",
    slug: "water-point",
    editorialLabel: "COMMUNITY DISPATCH",
    title: "The Water Point: Summer Hydration & Public Relief",
    subtitle:
      "Emergency seasonal water stations and oral rehydration kiosks serving commuters and hospital attendees during peak Western Odisha heatwaves.",
    programme: "Safe Drinking Water & Climate Relief (Jal Seva)",
    location: "Balangir Town & Transit Corridors, Western Odisha",
    period: "Summer Heatwave Cycles (April–June)",
    evidenceClassification: "DOCUMENTED PROGRAMME DISPATCH",
    sourceReference:
      "MECT Summer Relief Taskforce Records & FY 2022–24 Activity Logs",
    summary:
      "During extreme summer months where temperatures frequently exceed 42°C, MECT coordinates volunteer-managed drinking-water points and oral rehydration kiosks across busy district corridors.",
    fullNarrative: [
      "Summer temperatures across the Western Odisha plateau routinely climb above 42°C during April, May, and June. In urban Balangir and along peri-urban transit corridors, daily-wage laborers, long-distance bus commuters, and rural families attending the District Headquarters Hospital face acute risks of heat exhaustion and dehydration.",
      "To address immediate public health needs, MECT initiates seasonal Jal Seva kiosks at critical transit hubs. These stations feature traditional earthenware matkas for natural evaporative cooling alongside clean, filtered water containers, single-use sanitary paper cups, and WHO-standard oral rehydration salts (ORS) sachets.",
      "Volunteer teams oversee replenishment twice daily, ensuring water sources remain shaded, hygienic, and accessible to all citizens regardless of community background. Over 10,000 documented hydration and relief instances are logged each season, representing a frontline civic buffer during the most punishing climatic periods.",
    ],
    highlights: [
      "Earthen-pot and filtered hydration kiosks deployed across Balangir transit nodes.",
      "Provision of clean drinking water and oral rehydration salts (ORS).",
      "Active during critical April–June heatwave conditions (42°C+ ambient temperatures).",
      "Over 10,000 documented hydration events logged per summer season.",
    ],
    image: {
      src: "/images/hero/mect-clean-water-hygiene-demo.webp",
      alt: "Volunteers preparing clean drinking-water points and oral rehydration kiosks during summer heatwaves in Balangir",
      caption:
        "Seasonal drinking-water station and oral rehydration kiosk operation in Balangir.",
      credit: "MECT Emergency Relief Documentation (Balangir)",
    },
    destinationUrl: "/stories#water-point",
    publicationStatus: "PUBLISHED",
    verificationNotes:
      "Public civic service documentation. Source: Summer emergency relief registers. Hydration events reported as service instances rather than unique-person census.",
  },
] as const;
