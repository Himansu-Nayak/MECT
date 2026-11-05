import {
  ShieldCheck,
  HeartHandshake,
  Scale,
  Users,
  Landmark,
  Award,
  Building2,
  LucideIcon,
} from "lucide-react";

export interface ValueItem {
  title: string;
  description: string;
  icon: LucideIcon;
  tag: string;
}

export interface GovernanceTierItem {
  tier: string;
  title: string;
  role: string;
  description: string;
  status: string;
  icon: LucideIcon;
}

export interface RoadmapMilestone {
  year: string;
  badge: string;
  title: string;
  description: string;
}

export const ABOUT_CONTENT = {
  hero: {
    badge: "12+ Years of Civic Service • Est. 2013, Odisha",
    title: "Dedicated to Educational Dignity, Rural Livelihoods & Fiduciary Philanthropy",
    description:
      "MAHAVIR TRUST (Mahaveer Educational & Charitable Trust) was established in 2013 as an irrevocable public charitable trust to empower underprivileged students, train rural women in vocational trades, and provide vital community relief across Odisha.",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "About Us" },
    ],
  },

  narrative: {
    badge: "Foundational Philosophy",
    title: "True Philanthropy Enables Self-Reliance Through Education & Civic Welfare.",
    paragraphs: [
      "Higher education and vocational training represent the single most transformative engine of social and economic mobility in India. Yet, across Western Odisha, thousands of meritorious students and rural women find their potential constrained by poverty, lack of resources, and institutional barriers.",
      "MAHAVIR TRUST was registered in Balangir in 2013 to address these systemic challenges. Over the past 12+ years, we have operated free remedial education centres, equipped over 120 rural women with certified tailoring skills, provided life-saving Jal Seva drinking water to thousands during scorching summers, and ensured hospital food relief through Jan Ahar.",
    ],
    safeguards: [
      {
        title: "100% Direct Disbursals & Fiduciary Integrity",
        description:
          "All educational scholarship subsidies are remitted directly to accredited institutions via verified bank transfers under a strict zero-cash policy.",
      },
      {
        title: "Section 80G Tax Exemption Certified",
        description:
          "Donors receive 50% tax deductions under Indian Income Tax Act Section 80G (URN: AADTM5474FF20241, issued by IT Dept CPC).",
      },
    ],
  },

  visionMission: {
    badge: "Foundational Charter",
    title: "Vision & Operational Mission",
    vision: {
      tag: "Institutional Vision",
      title: "An Empowered, Educated & Self-Reliant Odisha",
      description:
        "An Odisha where every hardworking student and aspiring citizen, irrespective of socioeconomic background or geographic remoteness, has access to accredited higher education, dignified livelihood skills, and clean community resources.",
    },
    mission: {
      tag: "Operational Mission",
      title: "Direct Grants, Livelihood Training & Community Relief",
      description:
        "To deliver transparent college fee grants, operate rural remedial education centres, provide certified women's vocational training, expand summer drinking water stations (Jal Seva), and foster sustainable community welfare across all 30 districts of Odisha.",
    },
  },

  values: [
    {
      title: "Fiduciary Integrity",
      description:
        "100% of approved scholarship subsidies are remitted directly to accredited colleges. Governed by registered deed with mandatory annual audits.",
      icon: ShieldCheck,
      tag: "Governance",
    },
    {
      title: "Objective Blind-Appraisal",
      description:
        "Standardized merit-cum-means evaluation using verified income certificates and academic marksheets without trustee personal discretion.",
      icon: Scale,
      tag: "Fairness",
    },
    {
      title: "Civic Compassion & Dignity",
      description:
        "Empowering beneficiaries not as recipients of charity, but as rightful future leaders, artisans, and professionals who will uplift their communities.",
      icon: HeartHandshake,
      tag: "Ethos",
    },
    {
      title: "Non-Sectarian Universality",
      description:
        "Strictly neutral and non-denominational. Open to all deserving citizens across Odisha regardless of caste, creed, gender, or background.",
      icon: Users,
      tag: "Inclusion",
    },
  ] as ValueItem[],

  governanceTiers: [
    {
      tier: "Tier 1",
      title: "Board of Trustees",
      role: "Fiduciary Stewardship & Charter Custodians",
      description:
        "Led by Settler Founder & Permanent Managing Trustee Er. Japabandhu Kampa alongside life trustees Yudhisthir Rana, Ramachandra Biswal, and Sambit Kumar Dang under registered Trust Deed No. 40311302194.",
      status: "Permanent Honorary Trustees (Deed Clause XVI)",
      icon: Landmark,
    },
    {
      tier: "Tier 2",
      title: "Academic Advisory Council",
      role: "Educational Direction & Scholarship Policy",
      description:
        "Composed of distinguished educators, college principals, and technical practitioners formulating objective curriculum and grant criteria.",
      status: "Advisory Panel Operational",
      icon: Award,
    },
    {
      tier: "Tier 3",
      title: "Appraisal & Scrutiny Committee",
      role: "Impartial Candidate Evaluation",
      description:
        "Independent review body inspecting applicant marksheets, revenue authority income certificates, and college admission fee demands.",
      status: "Standardized Scoring Matrix",
      icon: Scale,
    },
    {
      tier: "Tier 4",
      title: "Administrative Secretariat Desk",
      role: "Operations, College Liaison & Disbursals",
      description:
        "Executive team managing daily college communication, bank RTGS transaction reconciliation, student tracking, and community volunteer coordination.",
      status: "Offices in Balangir & Bhubaneswar",
      icon: Building2,
    },
  ] as GovernanceTierItem[],

  roadmap: {
    badge: "12-Year Evolution",
    title: "Institutional Journey & Milestones",
    subtitle:
      "From our registered inception in 2013 to statewide higher education grants and corporate CSR collaborations.",
    milestones: [
      {
        year: "2013",
        badge: "Inception",
        title: "Registration of Trust Deed in Balangir",
        description:
          "Formal execution of Trust Deed on 27-07-2013 and registration before District Sub-Registrar, Balangir (Doc No. 40311302194). PAN card issued (AADTM5474F).",
      },
      {
        year: "2014–2020",
        badge: "Grassroots",
        title: "Remedial Centres, Jal Seva & Hospital Relief",
        description:
          "Launch of free remedial coaching centres for tribal students in Balangir, annual summer Jal Seva water stations, and Jan Ahar hospital food relief.",
      },
      {
        year: "2021–2023",
        badge: "Vocational",
        title: "Women's Tailoring & Community Learning Lab",
        description:
          "Inauguration of Balangir Community Learning Centre (Feb 2023) and vocational tailoring workshop graduating over 120 certified rural women.",
      },
      {
        year: "2024",
        badge: "Statutory",
        title: "12A, 80G & MCA CSR-1 Government Accreditations",
        description:
          "CBDT Form 10AC orders for 12A (URN: AADTM5474FE20231) and 80G (URN: AADTM5474FF20241). MCA CSR-1 approved (CSR00081063) and NITI Aayog NGO Darpan listing (OR/2024/0466491).",
      },
      {
        year: "2025–2026",
        badge: "Expansion",
        title: "Digital Platform & Statewide Higher Education Grants",
        description:
          "Launch of digital verification portal, full-stack volunteer management system, HIm AI assistant, and direct tuition grant disbursal framework across Odisha.",
      },
    ] as RoadmapMilestone[],
  },

  developerCredit: {
    eyebrow: "Digital Architecture & Engineering",
    name: "Himansu Nayak",
    role: "Website Developer & Platform Architect",
    statement:
      "Designed and developed the digital platform for Mahaveer Educational & Charitable Trust, implementing high-performance Next.js architecture, WCAG 2.2 AA accessibility standards, and security-hardened public desks to support institutional transparency.",
    skills: ["Next.js 16", "TypeScript", "Spring Boot", "PostgreSQL", "Tailwind CSS"],
    profileUrl: "https://www.linkedin.com/in/himansu-nayak-243b0482h7/",
    disclaimer:
      "Independent Technical Development Acknowledgement • Non-Trustee Technical Contributor",
  },

  cta: {
    badge: "Public Participation",
    title: "Join Us in Advancing Educational Dignity & Rural Welfare Across Odisha",
    subtitle:
      "Whether you are a CSR leader, an aspiring volunteer mentor, an educator, or a donor seeking 80G tax exemption, your partnership strengthens our collective mission.",
  },
};
