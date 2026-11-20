/**
 * MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)
 * Single Source of Truth Configuration (`src/config/org.ts`)
 *
 * Strict Compliance:
 * - Brand Name: Mahaveer Educational & Charitable Trust (MECT)
 * - Bank / Donations: SBI bank transfer / UPI only (No online payment gateway)
 * - Tax Wording: Neutral statutory wording only
 * - Data Reconciliation: Majority values from verified pages; conflicts logged in OWNER_DECISIONS.md
 */

export interface PostalAddressConfig {
  title: string;
  street: string;
  line1: string;
  city: string;
  district: string;
  state: string;
  pin: string;
  country: string;
  full: string;
  googleMapsUrl: string;
}

export interface StatutoryRegistrationConfig {
  trustDeedNumber: string;
  trustDeedBookVolume: string;
  subRegistrar: string;
  registrationAuthority: string;
  executedDate: string;
  executedDateDisplay: string;
  registeredDate: string;
  registeredDateDisplay: string;
  pan: string;
  mcaCsrNumber: string;
  mcaCsrApprovalDate: string;
  mcaCsrSrn: string;
  ngoDarpanId: string; // OR/2024/0466491 (conflict with legacy OD/2021/0285141 logged in OWNER_DECISIONS.md)
  mosjeAnudaanId: string;
  historical12A: {
    urn: string;
    din: string;
    orderDate: string;
    validity: string;
  };
  historical80G: {
    urn: string;
    din: string;
    orderDate: string;
    validity: string;
  };
}

export interface BankConfig {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  accountType: string;
  upiId: string;
  upiBeneficiaryName: string;
  donationPolicyNotice: string;
}

export interface ContactConfig {
  primaryPhone: string;
  displayPhone: string;
  e164Phone: string;
  phoneHref: string;
  whatsappNumber: string;
  whatsappHref: string;
  generalEmail: string;
  officialEmail: string;
  officeHours: string;
  workingDays: string;
}

export interface MECTOrgConfig {
  name: string;
  legalName: string;
  shortName: string;
  brandTitle: string;
  motto: string;
  tagline: string;
  missionStatement: string;
  foundedYear: string;
  statutory: StatutoryRegistrationConfig;
  bank: BankConfig;
  contact: ContactConfig;
  addresses: {
    registered: PostalAddressConfig;
    administrative: PostalAddressConfig;
  };
  governance: {
    managingTrustee: {
      name: string;
      title: string;
      role: string;
    };
    honoraryClause: string;
  };
  taxNotice: string;
  programmes: Array<{
    id: string;
    anchorId: string;
    name: string;
    tagline: string;
  }>;
}

export const MECT_ORG: MECTOrgConfig = {
  name: "Mahaveer Educational & Charitable Trust",
  legalName: "Mahaveer Educational & Charitable Trust (MECT)",
  shortName: "MECT",
  brandTitle: "Mahaveer Educational & Charitable Trust (MECT)",
  motto: "Knowledge, Compassion & Self-Reliance Across Odisha",
  tagline: "Strengthening Communities Through Education, Livelihoods & Essential Support",
  missionStatement:
    "A registered public charitable trust established in 2013, working across education, women's livelihoods, safe drinking water, food security, and rural community welfare in Odisha.",
  foundedYear: "2013",

  statutory: {
    trustDeedNumber: "40311302194",
    trustDeedBookVolume: "Book 4, Vol 45, Doc No. 40311302194",
    subRegistrar: "Balangir Sub-Registrar",
    registrationAuthority: "District Sub-Registrar, Balangir, Government of Odisha",
    executedDate: "27-07-2013",
    executedDateDisplay: "27 July 2013",
    registeredDate: "30-07-2013",
    registeredDateDisplay: "30 July 2013",
    pan: "AADTM5474F",
    mcaCsrNumber: "CSR00081063",
    mcaCsrApprovalDate: "09-11-2024",
    mcaCsrSrn: "N14617237",
    ngoDarpanId: "OR/2024/0466491", // Primary majority ID; see OWNER_DECISIONS.md
    mosjeAnudaanId: "OR/00040466",
    historical12A: {
      urn: "AADTM5474FE20231",
      din: "AADTM5474FE2023101",
      orderDate: "29-01-2024",
      validity: "AY 2024-25 to AY 2026-27",
    },
    historical80G: {
      urn: "AADTM5474FF20241",
      din: "AADTM5474FF2024101",
      orderDate: "29-01-2024",
      validity: "AY 2024-25 to AY 2026-27",
    },
  },

  bank: {
    bankName: "State Bank of India",
    accountHolder: "MAHAVEER EDUCATIONAL & CHARITABLE TRUST",
    accountNumber: "33341302498",
    ifsc: "SBIN0001701",
    branch: "Rajendra College Square, Bolangir",
    accountType: "Current Account",
    upiId: "86971610172@sbi",
    upiBeneficiaryName: "MAHAVEER EDUCATIONAL & CHARITABLE TRUST",
    donationPolicyNotice:
      "Donations are accepted by bank transfer / UPI. A receipt is issued after the Trust verifies the transfer.",
  },

  contact: {
    primaryPhone: "+91 98536 08113",
    displayPhone: "9853608113",
    e164Phone: "+919853608113",
    phoneHref: "tel:+919853608113",
    whatsappNumber: "+919853608113",
    whatsappHref: "https://wa.me/919853608113",
    generalEmail: "mect220@gmail.com",
    officialEmail: "trust@mect.org.in",
    officeHours: "10:00 – 17:30 IST",
    workingDays: "Monday – Saturday",
  },

  addresses: {
    registered: {
      title: "Registered Office",
      street: "Near Sai Mandir, Rugudipara",
      line1: "Near Sai Mandir, Rugudipara",
      city: "Balangir",
      district: "Balangir",
      state: "Odisha",
      pin: "767001",
      country: "India",
      full: "Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rugudipara,+Balangir,+Odisha+767001",
    },
    administrative: {
      title: "Administrative Office",
      street: "A1, 3rd Floor, Lewis Plaza, BJB Nagar",
      line1: "A1, 3rd Floor, Lewis Plaza, BJB Nagar",
      city: "Bhubaneswar",
      district: "Khordha",
      state: "Odisha",
      pin: "751014",
      country: "India",
      full: "A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar, Odisha - 751014",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Lewis+Plaza,+BJB+Nagar,+Bhubaneswar,+Odisha+751014",
    },
  },

  governance: {
    managingTrustee: {
      name: "Er. Japabandhu Kampa",
      title: "Founder & Managing Trustee",
      role: "Managing Trustee",
    },
    honoraryClause:
      "All trustees serve in an honorary capacity without salary, fee, or personal remuneration under registered Trust Deed Clause XVI.",
  },

  taxNotice:
    "Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility.",

  programmes: [
    {
      id: "education",
      anchorId: "education",
      name: "Education & Learning",
      tagline: "Remedial education, learning materials, and mentorship for rural students in Balangir.",
    },
    {
      id: "women-empowerment",
      anchorId: "women-empowerment",
      name: "Women Empowerment & Livelihoods",
      tagline: "Vocational skills, tailoring centres, and self-reliance training for rural women.",
    },
    {
      id: "sports-extracurricular",
      anchorId: "sports-extracurricular",
      name: "Sports & Extracurricular Development",
      tagline: "Athletic development, youth physical fitness, and civic teamwork.",
    },
    {
      id: "water",
      anchorId: "water",
      name: "Safe Water & Sanitation",
      tagline: "Jal Seva drinking water points, summer relief kiosks, and community hygiene.",
    },
    {
      id: "food-relief",
      anchorId: "food-relief",
      name: "Food Relief & Nutrition",
      tagline: "Jan Ahar community meal drives for vulnerable groups and hospital attendants.",
    },
    {
      id: "community-welfare",
      anchorId: "community-welfare",
      name: "Community Welfare & Rural Assistance",
      tagline: "Seasonal essentials, emergency relief, and civic assistance across Odisha.",
    },
    {
      id: "higher-education",
      anchorId: "higher-education",
      name: "Higher Education & Scholarships",
      tagline: "Merit-cum-need financial scholarship framework for higher professional education.",
    },
  ],
};

// Default export and named exports for flexible consumption across all components
export default MECT_ORG;
