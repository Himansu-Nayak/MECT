/**
 * MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)
 * Master Institutional Configuration & Documentary Truth Registry
 * 
 * Legally verified from Registered Trust Deed (30-07-2013, Balangir),
 * Income Tax Form 10AC (12A & 80G), and MCA CSR-1 (CSR00081063).
 */

import { ORG } from "@content/org";

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
  // Official Institutional Identity (single-sourced from content/org.ts)
  name: ORG.name,
  legalName: ORG.legalName,
  acronym: ORG.shortName,
  motto: ORG.motto,
  tagline: ORG.tagline,
  subtext: ORG.subtext,
  foundedYear: ORG.foundedYear,
  establishedDate: ORG.trustDeed.executedDateDisplay,
  registrationDate: ORG.trustDeed.registeredDateDisplay,
  headquarters: "Balangir & Bhubaneswar, Odisha, India",
  region: "Balangir & Bhubaneswar, Odisha, India",

  // Statutory Registrations & Legal Verification Credentials
  statutory: {
    trustDeedNumber: ORG.trustDeed.bookVolume,
    registrationAuthority: ORG.trustDeed.registrationAuthority,
    pan: ORG.ids.pan,
    panIssueDate: ORG.trustDeed.executedDate,
    mcaCsrNumber: ORG.ids.csr1,
    mcaCsrApprovalDate: `${ORG.ids.csr1ApprovalDate} (ROC-DELHI, SRN-${ORG.ids.csr1Srn})`,
    section12AUrn: ORG.ids.urn12A,
    section12ADin: ORG.ids.din12A,
    section12AOrderDate: ORG.ids.taxOrderDate,
    section12AValidity: ORG.ids.taxOrderValidityPeriod,
    section80GUrn: ORG.ids.urn80G,
    section80GDin: ORG.ids.din80G,
    section80GOrderDate: ORG.ids.taxOrderDate,
    section80GValidity: `${ORG.ids.taxOrderValidityPeriod} (50% Income Tax Exemption for Donors)`,
    ngoDarpanId: ORG.ids.darpan,
    mosjeAnudaanId: ORG.ids.eAnudaan,
  },

  // Governance & Leadership
  governance: {
    managingTrustee: ORG.chairman.name,
    managingTrusteeTitle: ORG.chairman.fullTitle,
    foundingTrustees: [
      { name: ORG.chairman.name, role: ORG.chairman.role },
    ],
    honoraryClause: ORG.chairman.honoraryClause,
  },

  // Official Institutional Offices & Contact Details
  contact: {
    addressLine1: ORG.addresses.registered.line1,
    city: ORG.addresses.registered.city,
    state: ORG.addresses.registered.state,
    pin: ORG.addresses.registered.pin,
    country: ORG.addresses.registered.country,
    generalEmail: ORG.emails.general,
    scholarshipEmail: ORG.emails.official,
    verificationStatus: `Registered Public Charitable Trust (${ORG.trustDeed.subRegistrar}, Doc No. ${ORG.trustDeed.deedNumber}).`,

    // Structured Office Details
    registeredOffice: {
      title: ORG.addresses.registered.title,
      addressLine1: ORG.addresses.registered.line1,
      city: ORG.addresses.registered.city,
      district: ORG.addresses.registered.district,
      state: ORG.addresses.registered.state,
      pin: ORG.addresses.registered.pin,
      country: ORG.addresses.registered.country,
      phone: ORG.helpline.display,
    },
    corporateOffice: {
      title: ORG.addresses.corporateLiaison.title,
      addressLine1: ORG.addresses.corporateLiaison.line1,
      city: ORG.addresses.corporateLiaison.city,
      district: ORG.addresses.corporateLiaison.district,
      state: ORG.addresses.corporateLiaison.state,
      pin: ORG.addresses.corporateLiaison.pin,
      country: ORG.addresses.corporateLiaison.country,
      phone: ORG.helpline.display,
    },
    officialEmails: {
      general: ORG.emails.general,
      alternate: ORG.emails.official,
      scholarships: ORG.emails.scholarships,
      grievance: ORG.emails.grievance,
    },
    emails: {
      primary: ORG.emails.general,
      official: ORG.emails.official,
      secondary: ORG.emails.fieldUnit,
      secretariat: ORG.emails.secretariatAlt,
    },
    phones: {
      helpline: ORG.helpline.display,
      helplineHref: ORG.helpline.href,
    },
    hours: ORG.helpline.hours,
  },

  // Official Domestic Bank Account & UPI QR (single-sourced from content/org.ts)
  bank: {
    bankName: ORG.bank.bankName,
    branch: ORG.bank.branch,
    accountName: ORG.bank.accountName,
    accountNumber: ORG.bank.accountNumber,
    ifsc: ORG.bank.ifsc,
    accountType: ORG.bank.accountType,
    upiId: ORG.bank.upiId,
    upiBeneficiaryDisplay: ORG.bank.upiBeneficiaryDisplay,
    verifiedQrSrc: ORG.bank.verifiedQrSrc,
    taxBenefit: `Historical approval under legacy Section 80G(5)(vi) covered ${ORG.ids.taxOrderValidityPeriod} (URN: ${ORG.ids.urn80G}, dated ${ORG.ids.taxOrderDate}). Current position for FY 2026-27 is under Chartered Accountant confirmation.`,
  },

  // Legal & Compliance Transparency Statement
  legal: {
    trustStatus: "Registered Irrevocable Public Charitable Trust",
    registrationNotice: `${ORG.trustDeed.summaryLine} (${ORG.trustDeed.bookVolume}). Historical 12A URN: ${ORG.ids.urn12A}, Historical 80G URN: ${ORG.ids.urn80G}. NITI Aayog Darpan: ${ORG.ids.darpan}.`,
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
          label: "Donor & Supporter Portal",
          href: "/portal/login",
          description: "OTP login, donation history, official PDF receipts, and consent preferences.",
          badge: "OTP Portal",
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
