/**
 * MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)
 * Master Institutional Configuration & Documentary Truth Registry
 * 
 * Legally verified from Registered Trust Deed (30-07-2013, Balangir),
 * Income Tax Form 10AC (12A & 80G), and MCA CSR-1 (CSR00081063).
 */

import { ORG } from "@content/org";
import { MECT_ORG } from "@/config/org";

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
    section80GValidity: ORG.ids.taxOrderValidityPeriod,
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

  // Official Domestic Bank Account & UPI QR (single-sourced from src/config/org.ts)
  bank: {
    bankName: MECT_ORG.bank.bankName,
    branch: MECT_ORG.bank.branch,
    accountName: MECT_ORG.bank.accountHolder,
    accountNumber: MECT_ORG.bank.accountNumber,
    ifsc: MECT_ORG.bank.ifsc,
    accountType: MECT_ORG.bank.accountType,
    upiId: MECT_ORG.bank.upiId,
    upiBeneficiaryDisplay: MECT_ORG.bank.upiBeneficiaryName,
    verifiedQrSrc: "/images/donate/mect-sbi-qr.png",
    taxBenefit:
      "Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility.",
  },

  // Legal & Compliance Transparency Statement
  legal: {
    trustStatus: "Registered Irrevocable Public Charitable Trust",
    registrationNotice: `${ORG.trustDeed.summaryLine} (${ORG.trustDeed.bookVolume}). Historical 12A URN: ${ORG.ids.urn12A}, Historical 80G URN: ${ORG.ids.urn80G}. NITI Aayog Darpan: ${ORG.ids.darpan}.`,
    disbursalPolicy:
      "All educational grants are remitted directly to accredited institutions under verifiable banking channels.",
  },

  // Master Institutional Navigation (Streamlined Information Architecture)
  navigation: [
    {
      label: "Home",
      href: "/",
      description: "Institutional introduction, core mission, and community overview.",
    },
    {
      label: "About",
      href: "/about",
      description: "13+ years of civic service, founding philosophy, and trusteeship heritage in Odisha.",
      children: [
        {
          label: "About the Trust",
          href: "/about",
          description: "Our 13+ year history, multi-sector mission, and operational footprint in Odisha.",
        },
        {
          label: "Leadership & Founder",
          href: "/about#leadership",
          description: "Settler Founder & Managing Trustee Er. Japabandhu Kampa profile.",
        },
        {
          label: "Memories & Gallery",
          href: "/memories-gallery",
          description: "Verified documentary photography and archival field records across Western Odisha.",
          badge: "Archival",
        },
      ],
    },
    {
      label: "Programmes",
      href: "/programmes",
      description: "Grassroots development across education, women's livelihoods, clean water, and nutrition.",
      children: [
        {
          label: "Civic Programmes",
          href: "/programmes",
          description: "Education tutoring, women's tailoring, Jal Seva water kiosks, and Jan Ahar relief.",
        },
        {
          label: "Higher Education Scholarships",
          href: "/scholarships",
          description: "Merit-cum-means financial aid and direct institution grants for underprivileged youth.",
        },
        {
          label: "Apply for Scholarship",
          href: "/scholarships/apply",
          description: "100% free online application for higher education tuition assistance.",
        },
      ],
    },
    {
      label: "Impact",
      href: "/impact",
      description: "Audited civic metrics, beneficiary reach, and verified grassroots outcomes.",
      children: [
        {
          label: "Our Impact",
          href: "/impact",
          description: "Verified beneficiary metrics, school reach, and grassroots outcomes across Odisha.",
        },
        {
          label: "Field Dispatches & Stories",
          href: "/stories",
          description: "Authentic community narratives and verified field documentation.",
        },
      ],
    },
    {
      label: "Campaigns",
      href: "/campaigns",
      description: "Charitable campaigns and cultural heritage initiatives.",
      children: [
        {
          label: "All Initiatives",
          href: "/campaigns",
          description: "Overview of active, proposed, and cultural heritage campaigns.",
        },
        {
          label: "The Grand Hanuman Murti Project",
          href: "/campaigns/hanuman-murti",
          description: "Proposed 80–100 ft cultural landmark in Puintala, Balangir (Architectural 3D Model).",
          badge: "Cultural",
        },
        {
          label: "Free Higher Education Grants",
          href: "/programmes#free-education-200",
          description: "Proposed scholarship target for up to 200 deserving rural students.",
        },
      ],
    },
    {
      label: "Governance",
      href: "/governance",
      description: "Registered Trust Deed, honorary managing trustee, and fiduciary governance code.",
      children: [
        {
          label: "Board of Trustees",
          href: "/governance",
          description: "Board composition, Er. Japabandhu Kampa leadership, and honorary status.",
        },
        {
          label: "Fiduciary Charter (Clause XVI)",
          href: "/governance#charter",
          description: "100% honorary service code — zero trustee remuneration or personal fees.",
        },
      ],
    },
    {
      label: "CSR Partnerships",
      href: "/csr-partnerships",
      description: "Schedule VII corporate collaborations under MCA CSR-1 Registration No. CSR00081063.",
    },
    {
      label: "Reports & Disclosures",
      href: "/reports",
      description: "Audited financial statements, activity summaries, and statutory filings.",
      children: [
        {
          label: "Annual Reports & Audits",
          href: "/reports",
          description: "Multi-year audited summaries and trustee activity statements.",
        },
        {
          label: "Statutory Disclosures",
          href: "/statutory-disclosures",
          description: "12A, 80G, CSR-1, NGO Darpan, and MoSJE verified credentials.",
          badge: "Verified",
        },
        {
          label: "Public Documents Library",
          href: "/reports#library",
          description: "Downloadable institutional documents and disclosures archive.",
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
    { figure: "350+", label: "Student Participation Entries", subtext: "Recorded participation entries (FY 2023–24), not necessarily unique students" },
    { figure: "120+", label: "Vocational Course Enrolments", subtext: "Cumulative enrolments (FY 2021–23), not necessarily uniquely certified women" },
    { figure: "10,000+", label: "Water & Relief Service Instances", subtext: "Recorded service instances, not necessarily unique citizens" },
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
