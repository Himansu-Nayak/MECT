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
    badge: "Institutional Heritage • Odisha, India",
    title: "Dedicated to Educational Dignity & Socioeconomic Mobility in Odisha",
    description:
      "MAHAVIR TRUST was conceived as a non-profit philanthropic foundation to ensure that financial hardship never forces a hardworking, meritorious student in Odisha to abandon their academic dreams.",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "About Us" },
    ],
  },

  narrative: {
    badge: "Foundational Philosophy",
    title: "True Philanthropy Enables Self-Reliance Through Quality Higher Education.",
    paragraphs: [
      "Higher education represents the single most transformative engine of social and economic mobility in India. Yet, across Odisha, thousands of meritorious students who complete their Higher Secondary (+2) examinations with distinction find that poverty halts their progress at the college gates.",
      "MAHAVIR TRUST was instituted to resolve this structural crisis. We do not distribute temporary discretionary charity. Instead, we establish enduring institutional mechanisms: 100% direct-to-college tuition fee grants, 1-on-1 faculty mentorship, and community study hubs that enable students to earn recognized degrees and enter professional careers with dignity.",
    ],
    safeguards: [
      {
        title: "100% Direct College Disbursals",
        description:
          "Grant subsidies are wired directly via bank transfer to the verified accounts of degree colleges. Zero cash handling.",
      },
      {
        title: "Mentorship as an Inseparable Anchor",
        description:
          "Scholars receive structured career navigation from university professors, corporate mentors, and civil service professionals.",
      },
    ],
  },

  visionMission: {
    badge: "Foundational Charter",
    title: "Vision & Operational Mission",
    vision: {
      tag: "Institutional Vision",
      title: "An Empowered, Educated Odisha",
      description:
        "An Odisha where every hardworking student, irrespective of economic circumstances or geography, has access to accredited higher education, professional dignity, and upward social mobility.",
    },
    mission: {
      tag: "Operational Mission",
      title: "Direct Grants & Sustained Enablement",
      description:
        "To deliver transparent college fee grants, establish supervised community study hubs (Project Samarth), and foster an enduring culture of academic excellence and giving back across all 30 districts of Odisha.",
    },
  },

  values: [
    {
      title: "Fiduciary Integrity",
      description:
        "100% of approved tuition fee subsidies are remitted directly to accredited colleges. Zero cash handling, zero brokers, and mandatory annual statutory audits.",
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
      title: "Student Dignity First",
      description:
        "Empowering scholars not as recipients of charity, but as rightful future leaders, scientists, and professionals who will uplift their communities.",
      icon: HeartHandshake,
      tag: "Ethos",
    },
    {
      title: "Non-Sectarian Universality",
      description:
        "Strictly neutral and non-denominational. Open to all deserving students across all 30 districts of Odisha regardless of caste, creed, or background.",
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
        "Responsible for statutory compliance, endowment preservation, and legal governance under the Indian Trusts Act framework. Non-remunerative, public-spirited trustees.",
      status: "Trust Deed Under Statutory Formalisation [Names Pending Gazette]",
      icon: Landmark,
    },
    {
      tier: "Tier 2",
      title: "Academic Advisory Council",
      role: "Educational Direction & Policy Guidance",
      description:
        "Composed of distinguished university professors, educational administrators, and technical practitioners formulating objective curriculum and grant criteria.",
      status: "Advisory Panel Under Formation",
      icon: Award,
    },
    {
      tier: "Tier 3",
      title: "Appraisal & Scrutiny Committee",
      role: "Impartial Candidate Evaluation",
      description:
        "Independent review body inspecting applicant marksheets, revenue authority income certificates, and college admission fee demands.",
      status: "Objective Standardized Scoring Model",
      icon: Scale,
    },
    {
      tier: "Tier 4",
      title: "Administrative Secretariat Desk",
      role: "Operations, College Liaison & Disbursals",
      description:
        "Executive team managing daily college communication, bank RTGS transaction reconciliation, student tracking, and community volunteer coordination.",
      status: "Bhubaneswar Secretariat Desk Operational",
      icon: Building2,
    },
  ] as GovernanceTierItem[],

  roadmap: {
    badge: "Phased Evolution",
    title: "Foundational Journey & Roadmap",
    subtitle:
      "From our charter formulation to statewide cluster rollouts, explore the phased roadmap guiding MAHAVIR TRUST.",
    milestones: [
      {
        year: "2025",
        badge: "Inception",
        title: "Genesis & Trust Deed Formulation",
        description:
          "Formalization of the philanthropic vision to eradicate higher education dropouts in Odisha. Drafting the fiduciary charter, zero-cash disbursement guidelines, and statutory filings.",
      },
      {
        year: "Early 2026",
        badge: "Architecture",
        title: "Digital Platform & Security Hardening",
        description:
          "Deployment of the institutional web portal, Spring Boot backend with enterprise authentication, role-based access control (RBAC), and automated inquiry desk.",
      },
      {
        year: "Mid 2026",
        badge: "Partnerships",
        title: "College Liaison Network & Pilot Auditing",
        description:
          "Establishing direct verification protocols with degree colleges across Khordha and Cuttack clusters. Establishing Tahsildar income certificate verification standards.",
      },
      {
        year: "2026–27",
        badge: "Launch",
        title: "Pilot Disbursal Cohort & Project Samarth Hubs",
        description:
          "Inaugural cycle of direct tuition disbursements for undergraduate scholars and launch of the first supervised community reference study hub in Bhubaneswar.",
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
    title: "Join Us in Advancing Higher Education Access Across Odisha",
    subtitle:
      "Whether you are an accredited college administrator, an aspiring volunteer mentor, or a student seeking academic guidance, your engagement strengthens our collective mission.",
  },
};
