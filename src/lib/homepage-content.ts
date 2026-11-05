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
    badge: "12+ Years of Civic Service • Est. 2013, Odisha",
    headline: "Empowering Odisha Through Education, Rural Skilling & Fiduciary Philanthropy.",
    subtext:
      "Mahaveer Educational & Charitable Trust (MECT) is an irrevocable registered public charitable trust dedicated to higher education access, rural women's vocational tailoring, safe drinking water, and community welfare across Odisha.",
    notice:
      "Registered under Indian Trusts Act (Reg No. 40311302194, Balangir). 12A & 80G certified (50% Tax Exemption for Donors). MCA CSR-1 Reg: CSR00081063.",
    metrics: [
      {
        value: "12+ Years",
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
        text: "Donate with 80G Tax Benefit",
        href: "/donate",
      },
      secondary: {
        text: "Explore Civic Programmes",
        href: "/programmes",
      },
      governance: {
        text: "Fiduciary Charter & Board",
        href: "/governance",
      },
      csr: {
        text: "Corporate CSR Gateway",
        href: "/csr-partnerships",
      },
    },
  },

  // Marquee endorsements & standards
  standards: [
    {
      title: "12+ Years Heritage",
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
      title: "Remedial Rural Education",
      tag: "Shiksha Setu",
      description:
        "Free tuition, exam coaching, and scholastic books for 350+ underserved tribal and rural students in Balangir and Puintala blocks to bridge secondary dropout rates.",
    },
    {
      number: "02",
      title: "Women's Vocational Livelihood",
      tag: "Swavalamban",
      description:
        "Comprehensive 6-month tailoring, embroidery, and handicraft training empowering 120+ rural women toward financial self-reliance and self-help group entrepreneurship.",
    },
    {
      number: "03",
      title: "Jal Seva Safe Drinking Water",
      tag: "Jal & Arogya",
      description:
        "Installation of clean drinking water points, summer hydration kiosks, and community sanitation camps serving over 10,000 citizens during peak summer months.",
    },
    {
      number: "04",
      title: "Jan Ahar Destitute Nutrition",
      tag: "Annadaan",
      description:
        "Subsidized and free nutritious meal distribution for impoverished patients and attendants at Balangir District Hospital and destitute daily wage earners.",
    },
  ] as PillarCard[],

  // From the Managing Trustee's Desk
  secretariat: {
    badge: "From The Managing Trustee's Desk",
    quote: "“A 12-Year Commitment That Educational Dignity & Civic Welfare Shall Reach the Grassroots of Odisha.”",
    paragraph:
      "Mahaveer Educational & Charitable Trust was founded in 2013 with a resolute conviction: genuine social transformation requires lasting institutional empowerment, not transient charity. Whether through direct remedial tutoring in rural Balangir, equipping women with sewing machines and tailoring trade certificates, or ensuring clean drinking water, our mission remains grounded in transparency, non-remunerative service, and auditable accountability.",
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
