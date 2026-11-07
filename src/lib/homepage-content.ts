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

export interface FocusAreaItem {
  id: string;
  number: string;
  title: string;
  status: string;
  statusVariant: "forest" | "gold" | "neutral";
  description: string;
  image?: string;
  imageAlt?: string;
  iconName?: "Droplets" | "Utensils";
  ctaText: string;
  ctaHref: string;
  isFlagship?: boolean;
  isArchive?: boolean;
}

export const HOMEPAGE_CONTENT = {
  // Hero section messaging
  hero: {
    badge: "Registered Public Charitable Trust • Est. 2013, Odisha",
    headline: "Building Opportunities. Empowering Communities. Creating Lasting Change.",
    subtext:
      "Mahaveer Educational & Charitable Trust (MECT) is an irrevocable public charitable trust advancing grassroots remedial education, rural women's vocational tailoring, and potable drinking water relief across Western Odisha since 2013.",
    notice:
      "Registered under Indian Trusts Act, 1882 (Reg No. 40311302194, Balangir). 12A & 80G registered (Provisional Form 10AC orders: AY 2024–25 to AY 2026–27). MCA CSR-1 Reg: CSR00081063.",
    metrics: [
      {
        value: "350+",
        label: "Students Tutored",
        subtext: "Proposal-reported remedial center enrollment",
      },
      {
        value: "120+",
        label: "Women Trained",
        subtext: "Proposal-reported vocational tailoring batches",
      },
      {
        value: "50,000+ L",
        label: "Drinking Water Relief",
        subtext: "Estimated potable water served across summer kiosks",
      },
      {
        value: "100%",
        label: "Direct Disbursal Mandate",
        subtext: "Policy: Direct-to-college transfers • Zero cash",
      },
    ] as MetricCard[],
    ctas: {
      primary: {
        text: "Explore Our Programmes",
        href: "/programmes",
      },
      secondary: {
        text: "Support Our Mission",
        href: "/donate",
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

  // Institutional Focus Areas Section (Section 3)
  focusSection: {
    eyebrow: "INSTITUTIONAL FOCUS AREAS",
    mainHeading: "Education as Our Foundational Mission.",
    supportingHeading: "Dedicated Welfare for Communities Across Odisha.",
    introCopy:
      "Mahaveer Educational & Charitable Trust (MECT) prioritizes educational access as a foundation for individual opportunity and community progress. Alongside its educational focus, the Trust's documented charitable initiatives address women's vocational development, seasonal drinking water relief, hospital patient food support and humanitarian assistance.",
  },

  focusAreas: [
    {
      id: "education",
      number: "01",
      title: "Grassroots Remedial Education & Scholastic Guidance",
      status: "Documented Educational Initiative",
      statusVariant: "forest",
      description:
        "Documented educational initiatives include evening remedial learning support for students in Classes 6–10 across Balangir and Puintala, with academic guidance in Mathematics, Science and English, alongside study materials.",
      image: "/images/programmes/field_photo_5.jpg",
      imageAlt: "Secondary school students supported with scholastic materials in Odisha",
      ctaText: "Explore Educational Initiatives",
      ctaHref: "/programmes",
      isFlagship: true,
    },
    {
      id: "child-welfare",
      number: "02",
      title: "Child Scholastic Enablement & Learning Support",
      status: "Integrated Educational Activity",
      statusVariant: "forest",
      description:
        "Documented scholastic support activities include the distribution of textbooks, slate boards and learning materials for children attending community remedial education initiatives.",
      image: "/images/programmes/field_photo_8.jpg",
      imageAlt: "Rural children attending community learning and scholastic support sessions in Odisha",
      ctaText: "Learn More",
      ctaHref: "/programmes",
    },
    {
      id: "women-empowerment",
      number: "03",
      title: "Women's Vocational Tailoring & Stitching School",
      status: "Documented Vocational Initiative",
      statusVariant: "forest",
      description:
        "The institutional proposal documents vocational tailoring courses in Balangir, covering sewing machine operation, garment cutting and pattern-making through six-month practical training programmes.",
      image: "/images/programmes/field_photo_3.jpg",
      imageAlt: "Women participating in vocational tailoring training in Balangir",
      ctaText: "View Training Details",
      ctaHref: "/programmes",
    },
    {
      id: "jal-seva",
      number: "04",
      title: "Jal Seva: Seasonal Drinking Water Relief",
      status: "Seasonal Initiative",
      statusVariant: "gold",
      description:
        "The Trust's documented Jal Seva initiative provided free drinking water through earthen-pot kiosks at public transit locations and other community areas in Balangir during summer months.",
      iconName: "Droplets",
      ctaText: "Civic Relief Overview",
      ctaHref: "/programmes",
    },
    {
      id: "jan-ahar",
      number: "05",
      title: "Jan Ahar: Hospital Patient Attendant Food Support",
      status: "Documented Community Nutrition Initiative",
      statusVariant: "forest",
      description:
        "The institutional proposal documents cooked meal support outside District Headquarters Hospital, Balangir, for underprivileged families accompanying hospitalized relatives. The documented arrangements included subsidized and free meal support.",
      iconName: "Utensils",
      ctaText: "Healthcare Support Details",
      ctaHref: "/programmes",
    },
    {
      id: "historical-relief",
      number: "06",
      title: "Emergency Calamity Relief & Community Support",
      status: "Historical Relief Archive",
      statusVariant: "neutral",
      description:
        "Historical relief records document emergency dry ration and sanitization distributions during the COVID-19 lockdown period of 2020–2021, along with humanitarian relief activities associated with Cyclone Fani (2019) and Cyclone Yaas (2021).",
      image: "/images/programmes/field_photo_9.jpg",
      imageAlt: "Community members gathered during emergency relief coordination in Odisha",
      ctaText: "View Relief Records",
      ctaHref: "/reports",
      isArchive: true,
    },
  ] as FocusAreaItem[],

  // Core Pillars of Transformation (Retained for backward compatibility)
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
