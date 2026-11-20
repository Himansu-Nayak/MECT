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
  beneficiaryPrivacyNote?: string;
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
    id: "arogya-health-camp-rayagada",
    slug: "arogya-health-camp-rayagada",
    editorialLabel: "COMMUNITY DISPATCH",
    title: "Arogya Health Camp & Diagnostic Outreach",
    subtitle:
      "Preventive rural diagnostic clinics and maternal wellness screenings in Rayagada district.",
    programme: "Healthcare & Community Wellbeing",
    programmeTag: "Healthcare",
    location: "Rayagada District, Southern Odisha",
    period: "March 2024 (FY 2023–24)",
    datePublished: "2024-03-15",
    evidenceClassification: "DOCUMENTED PROGRAMME DISPATCH",
    sourceReference: "MECT Rayagada Health Outreach Register (March 2024 Docket)",
    summary:
      "Volunteer healthcare facilitators and visiting medical coordinators conducted rural diagnostic camps providing blood pressure evaluation, anemia checks, and preventive hygiene counseling for tribal hamlets in Rayagada.",
    fullNarrative: [
      "In the hilly terrain of southern Odisha's Rayagada district, access to frontline diagnostic screening requires rural households to undertake long travel to sub-divisional hospital centers. To bridge immediate primary screening gaps, MECT mobilized an Arogya community health camp in March 2024.",
      "The camp was conducted in coordination with local village sarpanches and certified community health workers. Diagnostic screenings focused on vital signs monitoring, random blood sugar evaluation, pediatric nutritional assessments, and maternal wellness counseling.",
      "Over the course of the camp, verified diagnostic records and personalized guidance cards were issued to participating families. Essential non-prescription health supplements, iron-folic acid formulations, and oral rehydration packets were provided at zero cost to attendees.",
      "In adherence to medical ethics and child safeguarding policies, individual patient names and diagnostic records remain strictly confidential under Secretariat oversight. All consultations were provided without commercial fees or third-party sponsorship obligations.",
    ],
    highlights: [
      "Comprehensive diagnostic screening for remote tribal households in Rayagada.",
      "Vital signs check, nutritional advice, and distribution of ORS and mineral supplements.",
      "Organized in active coordination with regional community health volunteers.",
      "100% free community consultation under honorary medical supervision.",
    ],
    beneficiaryPrivacyNote:
      "All patient identities and diagnostic charts are protected under healthcare confidentiality protocols. Individual beneficiary names withheld for privacy [Name withheld for privacy].",
    image: {
      src: "/images/hero/mect-public-health-awareness.webp",
      alt: "Community health and preventive nutrition counseling session in rural Odisha",
      caption: "Public health, seasonal hydration, and nutrition guidance outreach in Rayagada.",
      credit: "MECT Healthcare Outreach Docket (Rayagada)",
    },
    gallery: [
      {
        src: "/images/hero/mect-public-health-awareness.webp",
        alt: "Community health worker explaining nutritional wellness",
        caption: "Community health worker explaining dietary basics to village mothers.",
        credit: "MECT Healthcare Outreach Docket",
      },
      {
        src: "/images/hero/mect-clean-water-hygiene-demo.webp",
        alt: "Clean water purification demonstration during village camp",
        caption: "Water sanitation and personal hygiene demonstration during the outreach session.",
        credit: "MECT Healthcare Outreach Docket",
      },
    ],
    destinationUrl: "/stories/arogya-health-camp-rayagada",
    publicationStatus: "PUBLISHED",
    verificationNotes:
      "Compiled from Rayagada field activity logs (March 2024). All diagnostic numbers verified against camp attendance dockets. Zero manufactured patient testimonials or commercial claims.",
  },
  {
    id: "scholarship-distribution-fy2024",
    slug: "scholarship-distribution-fy2024",
    editorialLabel: "PROGRAMME RECORD",
    title: "Annual Higher Education Scholarship Distribution",
    subtitle:
      "Direct-to-college tuition fee assistance for meritorious rural students across Western Odisha.",
    programme: "Educational Continuity & Pratibha Fellowship",
    programmeTag: "Education",
    location: "Balangir District, Western Odisha",
    period: "Academic Session FY 2024–25 (August 2024)",
    datePublished: "2024-08-20",
    evidenceClassification: "DOCUMENTED PROGRAMME DISPATCH",
    sourceReference: "MECT Higher Education Scholarship Committee Ledger (August 2024)",
    summary:
      "The Trust's academic review panel completed appraisal of rural student applications for FY 2024–25, approving direct-to-college RTGS fee disbursals for eligible undergraduate and technical degree candidates.",
    fullNarrative: [
      "Secondary school completion rates across Western Odisha have steadily improved, but rural matriculates face severe economic barriers when attempting entry into higher technical, medical, and polytechnic diploma streams. Many students from landless farmer and daily-wage families are forced to forfeit their admissions due to non-refundable upfront tuition fees.",
      "During the FY 2024–25 academic cycle, the MECT Educational Scholarship Committee completed an objective merit-and-means scrutiny of applicants from Balangir, Puintala, and surrounding rural blocks. Verification required certified 10th and +2 marksheets, authentic college enrollment notices, and verified tehsildar income certificates.",
      "Under MECT's strict direct-disbursal policy, zero cash funds are handed to applicants or intermediaries. All sanctioned tuition fee portions are remitted directly via bank RTGS to verified institutional bank accounts of degree-granting colleges, with formal fee-clearance receipts issued by college bursars for annual statutory audit.",
      "To safeguard young scholars and avoid any social stigma, student names and exact household financial details are kept strictly anonymized in public records under Clause XVI governance protocols.",
    ],
    highlights: [
      "Rigorous merit-and-means scrutiny of rural applicant academic dossiers.",
      "100% direct-to-college bank RTGS transfers; zero cash payments.",
      "Official college bursar receipts reconciled for annual CA audit.",
      "Focus on professional degrees, ITI diplomas, and university higher education.",
    ],
    beneficiaryPrivacyNote:
      "Student names and personal family economic disclosures are anonymized under institutional child safeguarding policies [Name withheld for privacy].",
    image: {
      src: "/images/hero/mect-civic-pledge-classroom.webp",
      alt: "Students reviewing study materials in Balangir learning circle",
      caption: "Rural scholars and academic mentors reviewing course schedules in Balangir.",
      credit: "MECT Scholarship Committee Records (Balangir)",
    },
    gallery: [
      {
        src: "/images/hero/mect-civic-pledge-classroom.webp",
        alt: "Academic mentoring session with rural degree candidates",
        caption: "Remedial study circle and academic mentoring in Balangir.",
        credit: "MECT Scholarship Archive",
      },
      {
        src: "/images/hero/mect-faculty-puintala-campus.webp",
        alt: "Trustees and academic coordinators reviewing scholarship dossiers",
        caption: "Trustees and committee coordinators reviewing institutional fee structures at Puintala campus.",
        credit: "MECT Scholarship Archive",
      },
    ],
    destinationUrl: "/stories/scholarship-distribution-fy2024",
    publicationStatus: "PUBLISHED",
    verificationNotes:
      "Sourced from August 2024 Scholarship Committee Sanction Records. Disbursals auditable via bank statements and college fee receipts.",
  },
  {
    id: "emergency-relief-2024",
    slug: "emergency-relief-2024",
    editorialLabel: "FIELD NOTE",
    title: "Emergency Summer Heatwave Relief & Jal Seva Kiosks",
    subtitle:
      "Frontline hydration kiosks and oral rehydration centers deployed during extreme 44°C+ heatwaves.",
    programme: "Safe Drinking Water & Climate Relief (Jal Seva)",
    programmeTag: "Relief",
    location: "Balangir District & Transit Corridors, Western Odisha",
    period: "Summer Heatwave Cycle (April–June 2024)",
    datePublished: "2024-05-10",
    evidenceClassification: "DOCUMENTED PROGRAMME DISPATCH",
    sourceReference: "MECT Summer Disaster Relief Taskforce Logs (FY 2024–25)",
    summary:
      "MECT volunteers operated clean drinking water points and oral rehydration kiosks across busy district transit nodes and outside the District Hospital during severe summer heatwave distress.",
    fullNarrative: [
      "Summer across the Western Odisha plateau brings severe environmental distress, with daytime temperatures regularly surging past 44°C between April and June. Commuters, manual rickshaw pullers, construction laborers, and destitute attendants at the District Headquarters Hospital face acute vulnerability to heatstroke and severe dehydration.",
      "In response, MECT established emergency Jal Seva kiosks across high-density transit corridors. Each station utilizes traditional earthen matkas to naturally cool purified drinking water, eliminating single-use plastic waste while ensuring hygienic water storage.",
      "Kiosks were stocked daily with WHO-standard oral rehydration salts (ORS) and glucose sachets. Volunteer teams maintained continuous replenishment schedules and monitored water cleanliness throughout peak sunlight hours (10:00 AM to 4:30 PM).",
      "Over 10,000 documented hydration and relief instances were recorded across the 2024 heatwave cycle. Because this represents frontline emergency public assistance, services were rendered immediately to all arriving citizens without collecting identity documents.",
    ],
    highlights: [
      "Earthen-pot and filtered hydration kiosks deployed across Balangir transit hubs.",
      "Daily distribution of clean drinking water and oral rehydration salts (ORS).",
      "Targeted relief for daily-wage workers, commuters, and hospital attendants.",
      "Over 10,000 documented service instances across the April–June 2024 period.",
    ],
    beneficiaryPrivacyNote:
      "Frontline emergency relief delivered at transit nodes without collecting identity records; reported as verified service instances [Name withheld for privacy].",
    image: {
      src: "/images/hero/mect-clean-water-hygiene-demo.webp",
      alt: "Volunteers preparing clean drinking-water points and oral rehydration kiosks in Balangir",
      caption: "Seasonal drinking-water station and oral rehydration kiosk operation in Balangir.",
      credit: "MECT Emergency Relief Documentation (Balangir)",
    },
    gallery: [
      {
        src: "/images/hero/mect-clean-water-hygiene-demo.webp",
        alt: "Clean water station setup during summer relief drive",
        caption: "Clean water purification and distribution kiosk in Balangir.",
        credit: "MECT Emergency Relief Archive",
      },
      {
        src: "/images/hero/mect-legal-literacy-session.webp",
        alt: "Community members at civic relief orientation",
        caption: "Civic volunteers coordinating summer hydration logistical routes.",
        credit: "MECT Emergency Relief Archive",
      },
    ],
    destinationUrl: "/stories/emergency-relief-2024",
    publicationStatus: "PUBLISHED",
    verificationNotes:
      "Documented from Summer Relief Taskforce logs (April–June 2024). Reported as service instances rather than a unique-person census.",
  },
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
    datePublished: "2023-11-15",
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
    beneficiaryPrivacyNote:
      "All student participant names withheld under institutional child safeguarding guidelines [Name withheld for privacy].",
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
        alt: "Classroom mentoring session",
        caption: "Classroom remedial mentoring session in Balangir.",
        credit: "MECT Programme Documentation Archive",
      },
    ],
    destinationUrl: "/stories/classroom",
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
    programmeTag: "Livelihoods",
    location: "Balangir Training Centre, Odisha",
    period: "FY 2022–24 Modular Cohorts",
    datePublished: "2023-08-10",
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
    beneficiaryPrivacyNote:
      "Individual trainee names and enterprise details withheld under privacy protection protocols [Name withheld for privacy].",
    image: {
      src: "/images/hero/mect-women-empowerment-seminar.webp",
      alt: "Rural women participating in practical garment-cutting and tailoring skills training at the Balangir centre",
      caption:
        "Community vocational training seminar and practical tailoring instruction at the Balangir centre.",
      credit: "MECT Field Documentation Archive (Balangir)",
    },
    gallery: [
      {
        src: "/images/hero/mect-women-empowerment-seminar.webp",
        alt: "Vocational tailoring instruction in Balangir",
        caption: "Practical tailoring instruction at the Balangir centre.",
        credit: "MECT Field Documentation Archive",
      },
    ],
    destinationUrl: "/stories/workshop",
    publicationStatus: "PUBLISHED",
    verificationNotes:
      "Group seminar and workshop documentation. Supported by FY 2022–23 and FY 2023–24 Activity Reports. Individual commercial success claims or unverified business founding withheld.",
  },
] as const;
