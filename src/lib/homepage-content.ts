/**
 * MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)
 * Master Homepage Content Configuration
 * 
 * Verified against 2013 Registered Trust Deed (Doc No. 40311302194),
 * Income Tax Section 12A/80G Form 10AC, and CSR Registration (CSR00081063).
 */

export interface MetricCard {
  value: string;
  label: string;
  subtext: string;
}

export interface PillarCard {
  number: string;
  title: string;
  description: string;
  tag: string;
  image?: string;
  href?: string;
  stat?: string;
}

export const HOMEPAGE_CONTENT = {
  // Hero section messaging
  hero: {
    badge: "Public Charitable Trust • Odisha",
    headline: "Stronger communities begin with opportunity, dignity and care.",
    subtext:
      "Mahaveer Educational & Charitable Trust (MECT) is a registered charitable trust rooted in Odisha. Our work connects education, women's vocational livelihoods, safe-water access, nutrition and community welfare through practical, community-based initiatives.",
    notice:
      "Registered public charitable trust in Odisha (Trust Deed No. 40311302194). Explore our programmes, governance and statutory disclosures.",
    metrics: [
      {
        value: "13+ Years",
        label: "Civic Service",
        subtext: "Registered Trust Deed (2013, Balangir)",
      },
      {
        value: "350+",
        label: "Students Supported",
        subtext: "Free remedial coaching & study support",
      },
      {
        value: "120+",
        label: "Women Skilled",
        subtext: "Certified tailoring & livelihood tooling",
      },
      {
        value: "10,000+",
        label: "Citizens Reached",
        subtext: "Jal Seva drinking water & emergency relief",
      },
    ] as MetricCard[],
    ctas: {
      primary: {
        text: "Support Our Work",
        href: "/donate",
      },
      secondary: {
        text: "Explore Our Work",
        href: "/programmes",
      },
      governance: {
        text: "Fiduciary Charter & Board",
        href: "/governance",
      },
      csr: {
        text: "Partner With Us",
        href: "/csr-partnerships",
      },
    },
  },

  // Marquee endorsements & standards
  standards: [
    {
      title: "13+ Years of Service",
      subtitle: "Registered Trust Deed (2013, Balangir)",
      iconName: "Landmark",
    },
    {
      title: "Income-tax 12A & 80G Orders",
      subtitle: "Order dated 29-01-2024, valid AY 2024-25 to AY 2026-27",
      iconName: "ShieldCheck",
    },
    {
      title: "MoSJE e-Anudaan Enrolled",
      subtitle: "Verified NGO ID: OR/00040466",
      iconName: "Building2",
    },
    {
      title: "NITI Aayog Darpan",
      subtitle: "Unique ID: OR/2024/0466491",
      iconName: "Award",
    },
    {
      title: "Direct College Disbursal",
      subtitle: "100% Zero Cash Intermediary Policy",
      iconName: "School",
    },
    {
      title: "Honorary Fiduciary Board",
      subtitle: "Non-Remunerative Governance (Clause XVI)",
      iconName: "CheckCircle2",
    },
  ],

  // Core Pillars of Transformation (Documented Across 5 Development Sectors)
  pillars: [
    {
      number: "01",
      title: "Education & Learning",
      tag: "Shiksha Setu",
      description:
        "Remedial tuition, exam coaching and scholastic materials for underserved rural and tribal students in Balangir and Puintala.",
      href: "/programmes#education",
      stat: "350+ Coached",
    },
    {
      number: "02",
      title: "Women Empowerment & Livelihoods",
      tag: "Swavalamban",
      description:
        "Tailoring, embroidery and handicraft training designed to strengthen women's skills, confidence and livelihood options.",
      href: "/programmes#women-empowerment",
      stat: "120+ Artisans",
    },
    {
      number: "03",
      title: "Safe Water & Sanitation",
      tag: "Jal & Arogya",
      description:
        "Jal Seva drinking-water points, summer hydration kiosks and community sanitation activities that support everyday wellbeing.",
      href: "/programmes#water",
      stat: "10,000+ Served",
    },
    {
      number: "04",
      title: "Food Security & Nutrition",
      tag: "Annadaan",
      description:
        "Jan Ahar food relief and nutritious meals for documented beneficiary groups, including hospital attendants and vulnerable community members.",
      href: "/programmes#hunger-relief",
      stat: "Daily Relief",
    },
    {
      number: "05",
      title: "Community Welfare & Relief",
      tag: "Samaj Kalyan",
      description:
        "Seasonal essentials, emergency community assistance, and disaster resilience for vulnerable families in rural Western Odisha.",
      href: "/programmes#pillars",
      stat: "Direct Action",
    },
  ] as PillarCard[],

  // From the Managing Trustee's Desk
  secretariat: {
    badge: "From The Managing Trustee's Desk",
    quote: "“A 13+ Year Commitment to Opportunity, Livelihood and Community Wellbeing Across Odisha.”",
    paragraph:
      "Mahaveer Educational & Charitable Trust was founded in 2013 with a belief that lasting progress is built by strengthening people and communities. Our work brings together learning support, women's vocational skills, safe-water access and food relief, guided by responsible stewardship, dignity and accountability.",
    officeTitle: "Er. Japabandhu Kampa",
    officeSubtitle: "Settler Founder & Chairman cum Managing Trustee",
    statutoryNote:
      "Registered under Indian Trusts Act (Deed No. 40311302194, Balangir). 12A URN: AADTM5474FE20231 • 80G URN: AADTM5474FF20241.",
  },

  // Beyond financial grants enablement
  enablement: [
    {
      title: "1-on-1 Academic Mentorship",
      description:
        "Scholars are paired with experienced faculty mentors for structured academic review throughout their undergraduate journey.",
      iconName: "Users",
    },
    {
      title: "Textbook & Reference Library Sets",
      description:
        "Access to standard degree textbooks, technical journals, and reference materials for engineering, pure science, and humanities.",
      iconName: "BookOpen",
    },
    {
      title: "Career & Placement Orientation",
      description:
        "Interactive workshops on communication, resume preparation, and corporate or civil services examination strategies.",
      iconName: "Compass",
    },
    {
      title: "Community Reciprocity Ethos",
      description:
        "Scholars are encouraged to dedicate 2 hours weekly to peer-tutoring younger students in their home villages.",
      iconName: "HeartHandshake",
    },
  ],

  // Donor notice
  donorNotice: {
    title: "Section 80G Tax Exemption Notice & Statutory Disclosures",
    description:
      "Mahaveer Educational & Charitable Trust holds documented historical approval under legacy Section 80G(5)(vi) of the Income-tax Act, 1961 (Order URN: AADTM5474FF20241, DIN: AADTM5474FF2024101, dated 29-01-2024) covering donations made in Financial Years 2023-24 through 2025-26 (Assessment Years 2024-25 through 2026-27). Donors filing under the Old Tax Regime were eligible for a 50% deduction of qualifying donations from taxable income (subject to the 10% Adjusted Gross Total Income ceiling under Section 80G(4)). For the current Tax Year 2026-27 (commenced 1 April 2026 / AY 2027-28), statutory approval under the Income-tax Act, 2025 is governed by Section 354 (application via Form 105 and formal examination order via Form 107) read with Section 536 repeal, savings and transition provisions. Current approval for Tax Year 2026-27 has not yet been established from the documentary records reviewed. Under Section 202 (simplified tax regime), Section 133 charitable deductions are not available. Annual donation reporting is conducted via Form 113 to generate official Form 114 certificates. Donations must be made through digital/banking channels (cash > ₹2,000 is disqualified under Section 133 / legacy Section 80G(5D)).",
  },

  // Organisational Introduction & Vision/Mission (Homepage Section 2)
  aboutIntro: {
    eyebrow: "Institutional Overview",
    heading: "Public Charitable Stewardship Rooted in Odisha Since 2013",
    summary:
      "Established under the Indian Trusts Act, 1882 (Regd. Deed No. 40311302194, Balangir), Mahaveer Educational & Charitable Trust (MECT) connects community-based learning support, women's vocational tailoring, seasonal drinking-water relief, and hospital meal outreach across Odisha.",
    vision:
      "Odisha communities where household financial hardship does not cut short foundational schooling, vocational self-reliance, or access to basic wellbeing.",
    mission:
      "Deliver direct, non-intermediary support across remedial education, women's livelihood skills, safe water, and nutrition relief backed by auditable trust governance.",
    principles: [
      "Direct-to-institution bank remittance with zero cash scholarships",
      "Honorary Board of Trustees serving without remuneration (Deed Clause XVI)",
      "Transparent distinction between active Balangir centres and planned expansion",
    ],
  },

  // PHASE 3: Flagship Initiative — Free Education for 200 Students
  freeEducation200: {
    badge: "Flagship Priority Initiative",
    heading: "FREE EDUCATION FOR 200 STUDENTS",
    supportingHeadline: "EDUCATION TODAY. A BETTER TOMORROW.",
    supportingStatement:
      "Expanding access to educational support for children from underserved communities.",
    targetCount: "200",
    programmeStatus: "Approved Priority Initiative • Target Cohort: 200 Students (Enrolment Open by Phased Intake)",
    objective:
      "Prevent economic dropouts and expand structured academic access for up to 200 underserved students across Odisha by removing tuition, study-material, and remedial coaching barriers.",
    supportPillars: [
      {
        title: "Fee-Free Remedial Coaching",
        detail:
          "Structured academic instruction in foundational subjects, exam readiness, and classroom reinforcement without tuition charges.",
      },
      {
        title: "Learning Materials & Book Kits",
        detail:
          "Direct provision of essential notebooks, textbooks, and study stationery for enrolled beneficiaries from low-income households.",
      },
      {
        title: "Academic Guidance & Continuity",
        detail:
          "Regular attendance tracking, academic mentoring, and guidance across school and higher-secondary transitions.",
      },
    ],
    specifications: [
      {
        label: "Eligibility Criteria",
        value: "Odisha students from economically weaker, agrarian, daily-wage, or rural households unable to meet tuition and textbook expenses.",
      },
      {
        label: "Selection Process",
        value: "Community screening and Secretariat document review of household need, school enrolment, and attendance.",
      },
      {
        label: "Programme Duration",
        value: "Academic-year cycle aligned to school and higher-secondary terms with termly progression checks.",
      },
      {
        label: "Funding Scope",
        value: "Public and CSR contributions fund faculty honorariums, textbooks, stationery kits, and direct institutional fees.",
      },
      {
        label: "Monitoring & Accountability",
        value: "Attendance logs, study-kit distribution registers, and bank remittance records maintained at the Balangir Secretariat.",
      },
      {
        label: "Current Cohort Note",
        value: "200 students is the sanctioned target cohort capacity for phased delivery; the trust does not claim 200 students are already enrolled.",
      },
    ],
    beneficiaryScope:
      "Targeted toward verified students from economically disadvantaged, rural, agrarian, and daily-wage households in Balangir and underserved clusters of Odisha (beneficiary registers maintained directly at the Balangir Trust Office).",
    fundraisingPurpose:
      "Public and institutional contributions toward this initiative directly fund faculty instruction, textbooks, stationery kits, and accredited school/college fees through verifiable State Bank of India transfers.",
  },

  // PHASE 4: Educational Resource Mobilisation Appeal
  smileFundraising: {
    badge: "Educational Resource Mobilisation",
    heading: "SUPPORT EDUCATION. TRANSFORM LIVES.",
    contextNote:
      "Informed by MECT's remedial instruction model referenced alongside Smile Foundation competency work in trust documentation, this public appeal raises direct funds for primary and secondary learning materials.",
    purpose:
      "Meet essential study-kit, remedial instruction, and mentoring expenses for out-of-school and first-generation learners from daily-wage households.",
    utilizationPoints: [
      {
        title: "Direct Student Resource Kits",
        detail: "Notebooks, stationery, textbooks, and classroom learning aids distributed without cost to students.",
      },
      {
        title: "Remedial Learning Support",
        detail: "Sustaining safe, well-lit study centres and honorary academic mentor sessions.",
      },
      {
        title: "Transparent Direct Banking",
        detail: "100% of contributions are received directly in MECT's State Bank of India trust account with verifiable bank references.",
      },
    ],
    beneficiaries:
      "Out-of-school children, first-generation learners, and students from daily-wage and migrant families across Balangir and Odisha.",
    authorisationDisclaimer:
      "Notice of Organisational Independence: This fundraising appeal is conducted solely by Mahaveer Educational & Charitable Trust (MECT) for its educational programmes. It does not claim or imply an active corporate sponsorship, official funding grant, or trademark affiliation with Smile Foundation without separate written bilateral authorisation.",
  },

  // How MECT Works — Operational Delivery Framework
  howWeWork: [
    {
      step: "01",
      title: "Grassroots Need Appraisal",
      description:
        "Direct block-level surveys in Balangir and rural clusters to identify critical vulnerabilities in student retention, women's livelihoods, and seasonal heatwave risks.",
      iconName: "Search",
    },
    {
      step: "02",
      title: "Non-Intermediary Programme Design",
      description:
        "Developing structured, community-led interventions (Shiksha Setu, Swavalamban, Jal Seva, Jan Ahar) engineered to deliver aid directly without middle-agents.",
      iconName: "Layers",
    },
    {
      step: "03",
      title: "Hands-On Field Implementation",
      description:
        "Field execution led by civic volunteers and certified trainers with transparent on-site beneficiary registers.",
      iconName: "Users",
    },
    {
      step: "04",
      title: "Fiduciary Oversight & Audit",
      description:
        "Direct institutional bank disbursal, annual independent chartered accountant auditing, and statutory compliance.",
      iconName: "ShieldCheck",
    },
  ],
};
