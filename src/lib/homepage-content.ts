/**
 * MAHAVIR TRUST - Homepage Specific Content Configuration
 * 
 * Factual Accuracy & Institutional Credibility Guidelines:
 * - Differentiates proposed initiatives from ratified operations.
 * - Accurately states regulatory status under the Indian Trusts Act framework.
 * - Does not claim gazetted Section 12A/80G exemptions prior to statutory issuance.
 * - Replaces ambiguous coverage figures with transparent geographic mandates.
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
}

export const HOMEPAGE_CONTENT = {
  // Hero section messaging
  hero: {
    badge: "Public Charitable Educational Initiative • Odisha, India",
    headline: "Empowering Odisha’s Deserving Scholars Through Fiduciary Educational Grants.",
    subtext:
      "Mahaveer Educational & Charitable Trust (MECT) is established to advance higher education access across Odisha through a strict direct-to-college tuition grant model, academic mentorship, and community study facilities.",
    notice:
      "Public charitable trust initiative under Indian Trusts Act framework. Direct-to-college institutional remissions with zero cash intermediaries.",
    metrics: [
      {
        value: "30 Districts",
        label: "Statewide Mandate",
        subtext: "Phased cluster outreach across Odisha",
      },
      {
        value: "100% Direct",
        label: "College Disbursal",
        subtext: "Remitted directly to institution bursars",
      },
      {
        value: "0 Cash",
        label: "Intermediaries",
        subtext: "Zero cash handling & no commercial agents",
      },
      {
        value: "Annual Audit",
        label: "Fiduciary Standard",
        subtext: "Independent Chartered Accountant scrutiny",
      },
    ] as MetricCard[],
    ctas: {
      primary: {
        text: "Explore Proposed Schemes",
        href: "#programs",
      },
      secondary: {
        text: "Check Matching Criteria",
        href: "#eligibility-calculator",
      },
      governance: {
        text: "Fiduciary Charter",
        href: "/governance",
      },
    },
  },

  // Marquee endorsements & standards
  standards: [
    {
      title: "Statewide Scope",
      subtitle: "Phased Outreach Across Odisha",
      iconName: "Landmark",
    },
    {
      title: "Direct Disbursement",
      subtitle: "Accredited College Accounts",
      iconName: "Building",
    },
    {
      title: "Fiduciary Stewardship",
      subtitle: "Indian Trusts Act Framework",
      iconName: "ShieldCheck",
    },
    {
      title: "Need-Cum-Merit",
      subtitle: "Auditable Blind-Appraisal Criteria",
      iconName: "Award",
    },
    {
      title: "Institutional Liaison",
      subtitle: "Government & Aided Degree Colleges",
      iconName: "School",
    },
    {
      title: "Zero Intermediaries",
      subtitle: "Strict Anti-Commission Policy",
      iconName: "CheckCircle2",
    },
  ],

  // Core Pillars of Transformation
  pillars: [
    {
      number: "01",
      title: "Higher Education Tuition Grants",
      tag: "Flagship Support",
      description:
        "Tackling post-secondary dropouts by covering certified tuition fees directly through RTGS/NEFT to accredited degree colleges in Odisha on behalf of verified scholars.",
    },
    {
      number: "02",
      title: "Academic & Career Mentorship",
      tag: "Sustained Guidance",
      description:
        "Pairing enrolled scholars with university educators and experienced professionals for structured monthly career planning and competitive examination guidance.",
    },
    {
      number: "03",
      title: "Project Samarth Community Study Hubs",
      tag: "Learning Spaces",
      description:
        "Establishing quiet, solar-backed community study points in cluster districts equipped with high-yield competitive entrance reference texts.",
    },
  ] as PillarCard[],

  // From the Secretariat Desk
  secretariat: {
    badge: "From The Secretariat Desk",
    quote: "“A Commitment That Merit and Aspiration Shall Never Be Barred by Economic Hardship.”",
    paragraph:
      "MAHAVIR TRUST was conceived on the principle that educational opportunity must be universally accessible to every deserving student in Odisha. By formalising objective blind appraisal, direct college bursar disbursements, and transparent audit trails, our framework is designed to provide enduring, auditable stewardship.",
    officeTitle: "Secretariat Administration",
    officeSubtitle: "Public Coordination & Grant Scrutiny Desk",
    statutoryNote:
      "Formulated under public charitable trust deed principles. Statutory exemption credentials (Sec. 12A/80G) will be gazetted upon regulatory formalisation.",
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
    title: "Pre-Launch Statutory Notice",
    description:
      "Online monetary payment gateways and Section 80G tax deduction receipts will be activated strictly following formal statutory gazette notification. At present, institutional inquiries and voluntary pledge declarations may be communicated to our Secretariat.",
  },
};

