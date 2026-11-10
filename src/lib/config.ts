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
  name: "Mahaveer Educational & Charitable Trust",
  legalName: "Mahaveer Educational & Charitable Trust",
  acronym: "MECT",
  motto: "Knowledge, Compassion & Self-Reliance Across Odisha",
  tagline: "Strengthening Communities Through Education, Livelihoods & Essential Support",
  subtext:
    "A registered public charitable trust established in 2013, working across education, women's livelihoods, safe-water access, food and nutrition relief, and community welfare in Odisha.",
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
    managingTrusteeTitle: "Settler Founder & Chairman cum Managing Trustee",
    foundingTrustees: [
      { name: "Er. Japabandhu Kampa", role: "Chairman cum Managing Trustee" },
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
      "Registered Public Charitable Trust (Balangir Sub-Registrar 2013, Doc No. 40311302194) • 12A/80G Certified.",

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

  // Official Domestic Bank Account — Source: Supplied Cancelled Cheque
  bank: {
    bankName: "State Bank of India",
    branch: "Rajendra College Square, Bolangir, Odisha",
    accountName: "MAHAVEER EDUCATIONAL & CHARITABLE TRUST",
    accountNumber: "33341302498",
    ifsc: "SBIN0001701",
    accountType: "SB Account",
    taxBenefit:
      "Historical approval under legacy Section 80G(5)(vi) covered FY 2023-24 to FY 2025-26 (URN: AADTM5474FF20241). Current approval for Tax Year 2026-27 has not yet been established from the documentary records reviewed.",
  },

  // Legal & Compliance Transparency Statement
  legal: {
    trustStatus: "Registered Irrevocable Public Charitable Trust",
    registrationNotice:
      "Registered under Indian Trusts Act (Reg No. 40311302194, Balangir). 12A/80G historical records (URN 12A: AADTM5474FE20231, URN 80G: AADTM5474FF20241). NITI Aayog Darpan: OR/2024/0466491.",
    disbursalPolicy:
      "All educational grants are remitted directly to accredited institutions under verifiable banking channels.",
  },

  // Master Institutional Navigation (Taxonomy Restructured for Multi-Sector Development NGO)
  navigation: [
    {
      label: "About",
      href: "/about",
      description: "Institutional background, registered charter, leadership, and statutory credentials.",
      children: [
        {
          label: "About the Trust",
          href: "/about",
          description: "Our 13+ year history, multi-sector mission, leadership, and operational footprint in Odisha.",
        },
        {
          label: "Governance & Board",
          href: "/governance",
          description: "Registered Trust Deed, managing trustee, and honorary fiduciary code.",
        },
        {
          label: "Statutory Disclosures",
          href: "/statutory-disclosures",
          description: "12A, 80G, NGO Darpan & MoSJE certificates and official filings.",
          badge: "Verified",
        },
      ],
    },
    {
      label: "Our Work",
      href: "/programmes",
      description: "Grassroots development across education, women's livelihoods, clean water, and nutrition.",
      children: [
        {
          label: "Civic Programmes",
          href: "/programmes",
          description: "Education for 200 students, women's vocational training, Jal Seva water kiosks, and Jan Ahar relief.",
        },
        {
          label: "Higher Education Scholarships",
          href: "/scholarships",
          description: "Merit-cum-means financial aid and direct institution grants for underprivileged youth.",
        },
      ],
    },
    {
      label: "Impact & Accountability",
      href: "/impact",
      description: "Audited civic metrics, beneficiary reach, and annual progress reports.",
      children: [
        {
          label: "Our Impact",
          href: "/impact",
          description: "Verified beneficiary metrics, school reach, and grassroots outcomes across Odisha.",
        },
        {
          label: "Annual Reports & Audits",
          href: "/reports",
          description: "Audited financial statements, activity summaries, and downloadable annual reports.",
        },
      ],
    },
    {
      label: "Get Involved",
      href: "/volunteer",
      description: "Support our charitable mission, volunteer professional skills, or establish a CSR partnership.",
      children: [
        {
          label: "Donate Now",
          href: "/donate",
          description: "Direct bank transfers to State Bank of India and donation receipt verification.",
          badge: "SBI Verified",
        },
        {
          label: "Volunteer & Mentor",
          href: "/volunteer",
          description: "Contribute teaching, mentoring, vocational training, or field support.",
        },
        {
          label: "CSR Partnerships",
          href: "/csr-partnerships",
          description: "Schedule VII corporate collaborations and CSR registration credentials (CSR00081063).",
        },
      ],
    },
    {
      label: "Resources & Help",
      href: "/contact",
      description: "Contact our offices, review frequently asked questions, or access accessibility options.",
      children: [
        {
          label: "Contact & Offices",
          href: "/contact",
          description: "Balangir registered office, regional project office, and Bhubaneswar liaison desk.",
        },
        {
          label: "Frequently Asked Questions",
          href: "/faq",
          description: "Common questions on 80G tax exemptions, scholarship applications, and donations.",
        },
        {
          label: "Accessibility Statement",
          href: "/accessibility",
          description: "WCAG 2.2 accessibility commitment, assistive features, and keyboard navigation.",
        },
      ],
    },
  ] as NavItem[],

  // Core Mission Pillars (Verified from 2021-2024 Audit Records)
  pillars: [
    {
      title: "Education & Learning",
      description: "Remedial tuition, exam guidance and study materials for underserved rural and tribal students in Balangir.",
      tag: "Shiksha Setu",
    },
    {
      title: "Women Empowerment & Livelihoods",
      description: "Tailoring, embroidery and vocational training designed to strengthen women's skills and livelihood opportunities.",
      tag: "Swavalamban",
    },
    {
      title: "Safe Water & Sanitation",
      description: "Jal Seva drinking-water points, summer hydration support and community sanitation activities.",
      tag: "Jal & Arogya",
    },
    {
      title: "Food Security & Nutrition",
      description: "Jan Ahar food relief and nutritious meals for documented vulnerable groups and hospital attendants.",
      tag: "Annadaan",
    },
    {
      title: "Community Welfare & Rural Relief",
      description: "Direct community assistance, seasonal essentials, and emergency civic relief across rural Odisha.",
      tag: "Samaj Kalyan",
    },
  ],

  // Quantified Verified Impact Highlights
  impactHighlights: [
    { figure: "13+", label: "Years of Civic Service", subtext: "Established by registered Trust Deed in 2013" },
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
