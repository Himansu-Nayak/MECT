/**
 * MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)
 * Master Institutional Configuration & Documentary Truth Registry
 * 
 * Legally verified from Registered Trust Deed (30-07-2013, Balangir),
 * Income Tax Form 10AC (12A & 80G), and MCA CSR-1 (CSR00081063).
 */

export interface NavChildItem {
  label: string;
  href: string;
  description: string;
  badge?: string;
  isPlanned?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavChildItem[];
}

export const TRUST_CONFIG = {
  // Official Institutional Identity
  name: "MAHAVIR TRUST",
  legalName: "Mahaveer Educational & Charitable Trust",
  acronym: "MECT",
  motto: "Knowledge, Compassion & Self-Reliance Across Odisha",
  tagline: "Empowering Futures Through Education, Rural Skilling & Fiduciary Philanthropy",
  subtext:
    "An irrevocable registered public charitable trust established in 2013, dedicated to educational advancement, rural livelihood empowerment, clean water relief, and community welfare across Odisha.",
  foundedYear: "2013",
  establishedDate: "27th July 2013",
  registrationDate: "30th July 2013",
  headquarters: "Balangir & Bhubaneswar, Odisha, India",
  region: "Balangir & Bhubaneswar, Odisha, India",

  // Statutory Registrations & Legal Verification Credentials
  statutory: {
    trustDeedNumber: "Book No. 4, Volume No. 45, Document No. 40311302194",
    registrationAuthority: "District Sub-Registrar, Balangir, Government of Odisha",
    pan: "AADTM5474F",
    panIssueDate: "27/07/2013",
    mcaCsrNumber: "CSR00081063",
    mcaCsrApprovalDate: "09-11-2024 (ROC-DELHI, SRN-N14617237)",
    section12AUrn: "AADTM5474FE20231",
    section12ADin: "AADTM5474FE2023101",
    section12AOrderDate: "29-01-2024",
    section12AValidity: "AY 2024-25 to AY 2026-27",
    section80GUrn: "AADTM5474FF20241",
    section80GDin: "AADTM5474FF2024101",
    section80GOrderDate: "29-01-2024",
    section80GValidity: "AY 2024-25 to AY 2026-27 (50% Income Tax Exemption for Donors)",
    ngoDarpanId: "OR/2024/0466491",
    mosjeAnudaanId: "OR/00040466",
  },

  // Governance & Leadership
  governance: {
    managingTrustee: "Er. Japabandhu Kampa",
    managingTrusteeTitle: "Settler Founder & Permanent Managing Trustee",
    foundingTrustees: [
      { name: "Er. Japabandhu Kampa", role: "Chairman cum Managing Trustee" },
      { name: "Yudhisthir Rana", role: "Life Trustee" },
      { name: "Ramachandra Biswal", role: "Life Trustee" },
      { name: "Sambit Kumar Dang", role: "Life Trustee" },
    ],
    honoraryClause:
      "All trustees serve in an honorary capacity without salary, fee, or personal remuneration under registered Trust Deed Clause XVI.",
  },

  // Official Institutional Offices & Contact Details
  contact: {
    // Top-level aliases for backwards compatibility with legacy views
    addressLine1: "Near Sai Mandir, Rugudipara",
    city: "Balangir",
    state: "Odisha",
    pin: "767001",
    country: "India",
    generalEmail: "contact@mect.org.in",
    scholarshipEmail: "mect27072013@gmail.com",
    verificationStatus:
      "Registered Public Charitable Trust (Balangir Sub-Registrar 2013, Doc No. 40311302194) • 12A/80G & MCA CSR-1 Certified.",

    // Structured Office Details
    registeredOffice: {
      title: "Registered Trust Office",
      addressLine1: "Near Sai Mandir, Rugudipara",
      city: "Balangir",
      district: "Balangir",
      state: "Odisha",
      pin: "767001",
      country: "India",
      phone: "+91 94371 23616",
    },
    corporateOffice: {
      title: "Corporate & Liaison Secretariat",
      addressLine1: "A1, 3rd Floor, Lewis Plaza, BJB Nagar",
      city: "Bhubaneswar",
      district: "Khordha",
      state: "Odisha",
      pin: "751014",
      country: "India",
      phone: "+91 94371 23616 / +91 94373 53616",
    },
    projectOffice: {
      title: "Regional Project Office",
      addressLine1: "Chandrasekhar Nagar, Near RTO Office",
      city: "Balangir",
      district: "Balangir",
      state: "Odisha",
      pin: "767002",
      country: "India",
      phone: "+91 94371 23616",
    },
    officialEmails: {
      general: "contact@mect.org.in",
      alternate: "mect27072013@gmail.com",
      scholarships: "scholarships@mect.org.in",
      grievance: "contact@mect.org.in",
    },
    emails: {
      primary: "contact@mect.org.in",
      official: "mect27072013@gmail.com",
      secondary: "mectpuintala@gmail.com",
      secretariat: "Kampabbsr@gmail.com",
    },
    phones: {
      helpline: "+91 94371 23616",
      liaison: "+91 70081 23456",
    },
    hours: "Monday – Saturday: 10:00 AM – 5:30 PM IST",
  },

  // Official Domestic Bank Account for 80G Donations
  bank: {
    bankName: "Union Bank of India",
    branch: "Balangir Branch, Odisha",
    accountName: "Mahaveer Educational & Charitable Trust",
    accountNumber: "381002010014021",
    ifsc: "UBIN0538108",
    micr: "767026002",
    taxBenefit: "Donations are eligible for 50% deduction under Section 80G of the Income Tax Act, 1961 (URN: AADTM5474FF20241).",
  },

  // Legal & Compliance Transparency Statement
  legal: {
    trustStatus: "Registered Irrevocable Public Charitable Trust (Est. 2013)",
    registrationNotice:
      "Registered under Indian Trusts Act (Reg No. 40311302194, Balangir). 12A/80G certified (URN 12A: AADTM5474FE20231, URN 80G: AADTM5474FF20241). MCA CSR-1 Reg: CSR00081063. NITI Aayog Darpan: OR/2024/0466491.",
    disbursalPolicy:
      "All educational grants are remitted directly to accredited institutions. Direct donor receipts issued with Section 80G tax certificates.",
  },

  // Master Institutional Navigation
  navigation: [
    {
      label: "About Us",
      href: "/about",
      description: "Our 12-year heritage, mission, and leadership.",
      children: [
        {
          label: "Heritage & Mission",
          href: "/about",
          description: "12+ years of civic service, foundational philosophy, and milestones.",
        },
        {
          label: "Board of Trustees",
          href: "/governance",
          description: "Permanent Managing Trustee, Life Trustees, and Fiduciary Code.",
        },
        {
          label: "Statutory Disclosures",
          href: "/statutory-disclosures",
          description: "12A, 80G, CSR-1, NGO Darpan & Trust Deed certifications.",
          badge: "Verified",
        },
      ],
    },
    {
      label: "Governance",
      href: "/governance",
      description: "Trust deed, honorary board charter, and fiduciary oversight.",
    },
    {
      label: "Programmes",
      href: "/programmes",
      description: "Our core initiatives across Odisha.",
      children: [
        {
          label: "Remedial Rural Education",
          href: "/programmes#education",
          description: "Free tuition and coaching for tribal and underprivileged students in Balangir.",
        },
        {
          label: "Women Vocational Tailoring",
          href: "/programmes#women-empowerment",
          description: "Livelihood skills and self-help sewing workshops for rural women.",
        },
        {
          label: "Safe Drinking Water (Jal Seva)",
          href: "/programmes#water",
          description: "Community drinking water points and summer hydration camps.",
        },
        {
          label: "Jan Ahar Hunger Relief",
          href: "/programmes#hunger-relief",
          description: "Food relief for destitute patients and attendants at Balangir Hospital.",
        },
      ],
    },
    {
      label: "CSR Partnerships",
      href: "/csr-partnerships",
      description: "Corporate Social Responsibility collaborations under Schedule VII (MCA CSR-1: CSR00081063).",
    },
    {
      label: "Impact & Reports",
      href: "/impact",
      description: "Audited civic metrics, annual reports, and beneficiary milestones.",
      children: [
        {
          label: "Civic Impact Overview",
          href: "/impact",
          description: "Verified beneficiary metrics, school reach, and community outcomes.",
        },
        {
          label: "Annual Reports & Audits",
          href: "/reports",
          description: "Download verified annual activity summaries and balance sheets.",
        },
      ],
    },
    {
      label: "Get Involved",
      href: "/volunteer",
      description: "Join as a volunteer mentor, educator, or civic supporter.",
    },
    {
      label: "Contact",
      href: "/contact",
      description: "Balangir Registered Office and Bhubaneswar Liaison Secretariat.",
    },
  ] as NavItem[],

  // Core Mission Pillars (Verified from 2021-2024 Audit Records)
  pillars: [
    {
      title: "Remedial Rural Education",
      description: "Free scholastic tuition, entrance guidance, and study materials for 350+ underserved rural and tribal students in Balangir.",
      tag: "Shiksha Setu",
    },
    {
      title: "Women's Vocational Livelihood",
      description: "Professional tailoring, embroidery, and handicraft training empowering 120+ rural women toward financial self-reliance.",
      tag: "Swavalamban",
    },
    {
      title: "Safe Drinking Water & Health",
      description: "Clean water purification kiosks, summer Jal Seva stations, and community sanitation camps serving 10,000+ citizens.",
      tag: "Jal & Arogya",
    },
    {
      title: "Jan Ahar Destitute Nutrition",
      description: "Nutritious cooked meals and food relief for hospital attendants, destitute families, and daily wage earners.",
      tag: "Annadaan",
    },
  ],

  // Quantified Verified Impact Highlights
  impactHighlights: [
    { figure: "12+", label: "Years of Civic Service", subtext: "Established by registered Trust Deed in 2013" },
    { figure: "350+", label: "Rural Students Supported", subtext: "Free remedial coaching & scholastic books" },
    { figure: "120+", label: "Women Skilled in Tailoring", subtext: "Vocational certificates & livelihood tooling" },
    { figure: "10,000+", label: "Citizens Reached", subtext: "Jal Seva drinking water & emergency relief" },
  ],

  // Guiding Institutional Perspectives
  perspectives: [
    {
      statement:
        "Access to quality higher education and dignified livelihoods must not be confined by household economic distress. MECT ensures that deserving students and rural youth in Odisha achieve their full potential.",
      focus: "Educational Equity Mission",
      authorNote: "Er. Japabandhu Kampa, Settler Founder & Managing Trustee",
    },
    {
      statement:
        "Effective philanthropy pairs monetary assistance with sustained mentorship and community welfare. Building character, vocational independence, and self-reliance is central to the MECT philosophy.",
      focus: "Mentorship & Civic Dignity",
      authorNote: "MECT Board of Trustees",
    },
  ],
};
