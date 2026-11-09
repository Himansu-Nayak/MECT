/**
 * MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)
 * Master Homepage Content Configuration
 * 
 * Verified against 2013 Registered Trust Deed (Doc No. 40311302194),
 * Income Tax Section 12A/80G Form 10AC, and MCA CSR-1 (CSR00081063).
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
    badge: "13+ Years of Community Service • Est. 2013, Odisha",
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
      title: "Section 80G Certified",
      subtitle: "50% Income Tax Exemption for Donors",
      iconName: "ShieldCheck",
    },
    {
      title: "MCA CSR-1 Approved",
      subtitle: "Schedule VII Eligible (CSR00081063)",
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

  // Core Pillars of Transformation
  pillars: [
    {
      number: "01",
      title: "Education & Learning",
      tag: "Shiksha Setu",
      description:
        "Remedial tuition, exam coaching and scholastic materials for underserved rural and tribal students in Balangir and Puintala.",
    },
    {
      number: "02",
      title: "Women Empowerment & Livelihoods",
      tag: "Swavalamban",
      description:
        "Tailoring, embroidery and handicraft training designed to strengthen women's skills, confidence and livelihood options.",
    },
    {
      number: "03",
      title: "Safe Water & Sanitation",
      tag: "Jal & Arogya",
      description:
        "Jal Seva drinking-water points, summer hydration kiosks and community sanitation activities that support everyday wellbeing.",
    },
    {
      number: "04",
      title: "Food Security & Nutrition",
      tag: "Annadaan",
      description:
        "Jan Ahar food relief and nutritious meals for documented beneficiary groups, including hospital attendants and vulnerable community members.",
    },
  ] as PillarCard[],

  // From the Managing Trustee's Desk
  secretariat: {
    badge: "From The Managing Trustee's Desk",
    quote: "“A 13+ Year Commitment to Opportunity, Livelihood and Community Wellbeing Across Odisha.”",
    paragraph:
      "Mahaveer Educational & Charitable Trust was founded in 2013 with a belief that lasting progress is built by strengthening people and communities. Our work brings together learning support, women's vocational skills, safe-water access and food relief, guided by responsible stewardship, dignity and accountability.",
    officeTitle: "Er. Japabandhu Kampa",
    officeSubtitle: "Settler Founder & Permanent Managing Trustee",
    statutoryNote:
      "Registered under Indian Trusts Act (Deed No. 40311302194, Balangir). 12A URN: AADTM5474FE20231 • 80G URN: AADTM5474FF20241 • MCA CSR-1: CSR00081063.",
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
    title: "Section 80G Tax Exemption Notice",
    description:
      "All monetary contributions to Mahaveer Educational & Charitable Trust are eligible for a 50% deduction on taxable income under Section 80G of the Income Tax Act, 1961 (Order URN: AADTM5474FF20241, issued by IT Dept CPC). Direct bank RTGS/NEFT transfers are acknowledged with stamped official tax certificates.",
  },
};
