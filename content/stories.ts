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

export type ProgrammeTag = "Healthcare" | "Education" | "Relief" | "Livelihoods";

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
  programmeTag: ProgrammeTag;
  location: string;
  period: string;
  datePublished: string;
  evidenceClassification: EvidenceClassification;
  sourceReference: string;
  summary: string;
  fullNarrative: readonly string[];
  highlights: readonly string[];
  image: FieldDispatchImage;
  gallery: readonly FieldDispatchImage[];
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
    programmeTag: "Education",
    location: "Balangir & Puintala Blocks, Odisha",
    period: "FY 2021–24 Educational Cycles",
    datePublished: "2024-03-31",
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
      "Over 350 student attendance entries recorded in FY 2023–24 registers (entries, not unique people).",
      "All educators serve through honorary or community volunteer frameworks.",
    ],
    image: {
      src: "/images/hero/mect-civic-pledge-classroom.webp",
      alt: "Rural students and volunteer mentor participating in an educational learning session in Balangir district",
      caption:
        "Remedial classroom orientation and foundation learning session conducted by MECT volunteer mentors in Balangir district.",
      credit: "MECT Programme Documentation Archive (Balangir Centre)",
    },
    gallery: [
      {
        src: "/images/hero/mect-civic-pledge-classroom.webp",
        alt: "Mentorship session at community learning circle in Balangir",
        caption: "Evening foundation study circle in session.",
        credit: "MECT Field Archive",
      },
    ],
    destinationUrl: "/stories/classroom",
    publicationStatus: "PUBLISHED",
    verificationNotes:
      "Archival programme dispatch. Verified against Balangir Community Learning Centre attendance logs and FY 2022–24 progress summaries. Participation reported as session attendance entries, not unique persons.",
  },
  {
    id: "the-workshop-vocational-skills",
    slug: "workshop",
    editorialLabel: "FIELD NOTE",
    title: "The Workshop: Technical Garment Fabrication & Livelihoods",
    subtitle:
      "Vocational skills instruction fostering economic independence for women in Balangir.",
    programme: "Vocational Livelihoods & Women's Empowerment",
    programmeTag: "Livelihoods",
    location: "Balangir Vocational Training Centre, Odisha",
    period: "FY 2021–24 Training Cycles",
    datePublished: "2024-03-31",
    evidenceClassification: "DOCUMENTED PROGRAMME DISPATCH",
    sourceReference:
      "Balangir Vocational Training Centre Course Logs & Activity Reports",
    summary:
      "Practical garment cutting, drafting, and sewing machine operation sessions supporting self-reliance and home-based enterprise for women in rural Balangir.",
    fullNarrative: [
      "Economic vulnerability in rural western Odisha disproportionately impacts women with limited access to accredited vocational infrastructure. Operating out of the Balangir Vocational Training Centre, rural women, young widows, and members of neighborhood self-help groups participate in intensive, 6-month modular instruction programs in professional tailoring and garment fabrication.",
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
      src: "/images/programmes/field_photo_8.webp",
      alt: "Rural women participating in practical garment-cutting and tailoring skills training at the Balangir centre",
      caption:
        "Community vocational training seminar and practical tailoring instruction at the Balangir centre.",
      credit: "MECT Field Documentation Archive (Balangir)",
    },
    gallery: [
      {
        src: "/images/programmes/field_photo_8.webp",
        alt: "Tailoring cohort in session at Balangir vocational training centre",
        caption: "Vocational garment instruction at Balangir centre.",
        credit: "MECT Field Archive",
      },
    ],
    destinationUrl: "/stories/workshop",
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
    programmeTag: "Relief",
    location: "Balangir Town & Transit Corridors, Western Odisha",
    period: "Summer Heatwave Cycles (April–June)",
    datePublished: "2024-06-30",
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
      "Over 10,000 documented hydration events logged per summer season (service instances, not unique-person census).",
    ],
    image: {
      src: "/images/hero/mect-clean-water-hygiene-demo.webp",
      alt: "Volunteers preparing clean drinking-water points and oral rehydration kiosks during summer heatwaves in Balangir",
      caption:
        "Seasonal drinking-water station and oral rehydration kiosk operation in Balangir.",
      credit: "MECT Emergency Relief Documentation (Balangir)",
    },
    gallery: [
      {
        src: "/images/hero/mect-clean-water-hygiene-demo.webp",
        alt: "Jal Seva water distribution station during summer heatwave in Balangir",
        caption: "Summer relief station with earthenware pots in Balangir.",
        credit: "MECT Emergency Archive",
      },
    ],
    destinationUrl: "/stories/water-point",
    publicationStatus: "PUBLISHED",
    verificationNotes:
      "Public civic service documentation. Source: Summer emergency relief registers. Hydration events reported as service instances rather than unique-person census.",
  },
] as const;
