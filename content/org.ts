/**
 * Single Source of Truth for Mahaveer Educational & Charitable Trust (MECT)
 * identity, statutory identifiers, offices, helpline, banking, and branding.
 *
 * Values match documentary records verbatim per AUDIT SOURCE OF TRUTH.
 */

import { MECT_ORG } from "@/config/org";

export const ORG = {
  legalName: "Mahaveer Educational & Charitable Trust (MECT)",
  name: "Mahaveer Educational & Charitable Trust",
  shortName: "MECT",
  motto: "Knowledge, Compassion & Self-Reliance Across Odisha",
  tagline: "Strengthening Communities Through Education, Livelihoods & Essential Support",
  subtext:
    "A registered public charitable trust established in 2013, working across education, women's livelihoods, safe-water access, food and nutrition relief, and community welfare in Odisha.",
  foundedYear: "2013",
  trustDeed: {
    bookVolume: "Book 4, Vol 45, Doc No. 40311302194",
    deedNumber: "40311302194",
    subRegistrar: "Balangir Sub-Registrar",
    registrationAuthority: "District Sub-Registrar, Balangir, Government of Odisha",
    executedDate: "27-07-2013",
    executedDateDisplay: "27 July 2013",
    registeredDate: "30-07-2013",
    registeredDateDisplay: "30 July 2013",
    summaryLine: "Trust Deed executed 27 July 2013; registered 30 July 2013, Balangir Sub-Registrar",
    shortDeedRef: "Registered Public Charitable Trust (Deed No. 40311302194, Balangir).",
  },
  ids: {
    pan: "AADTM5474F",
    urn12A: "AADTM5474FE20231",
    din12A: "AADTM5474FE2023101",
    urn80G: "AADTM5474FF20241",
    din80G: "AADTM5474FF2024101",
    taxOrderDate: "29-01-2024",
    taxOrderValidityPeriod: "AY 2024-25 to AY 2026-27",
    csr1: "CSR00081063",
    csr1ApprovalDate: "09-11-2024",
    csr1Srn: "N14617237",
    darpan: "OR/2024/0466491",
    eAnudaan: "OR/00040466",
  },
  addresses: {
    registered: {
      title: "Registered Office",
      line1: "Near Sai Mandir, Rugudipara",
      city: "Balangir",
      district: "Balangir",
      state: "Odisha",
      pin: "767001",
      country: "India",
      full: "Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001",
    },
    corporateLiaison: {
      title: "Administrative Office",
      line1: "A1, 3rd Floor, Lewis Plaza, BJB Nagar",
      city: "Bhubaneswar",
      district: "Khordha",
      state: "Odisha",
      pin: "751014",
      country: "India",
      full: "A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar, Odisha - 751014",
    },
  },
  helpline: {
    display: "9853608113",
    e164: "+919853608113",
    href: "tel:+919853608113",
    hours: "Monday-Saturday, 10:00-17:30 IST",
  },
  emails: {
    official: "mect220@gmail.com",
    general: "mect220@gmail.com",
    scholarships: "mect220@gmail.com",
    grievance: "mect220@gmail.com",
    secretariatAlt: "mect220@gmail.com",
    fieldUnit: "mect220@gmail.com",
  },
  bank: {
    bankName: MECT_ORG.bank.bankName,
    accountName: MECT_ORG.bank.accountHolder,
    accountType: MECT_ORG.bank.accountType,
    accountNumber: MECT_ORG.bank.accountNumber,
    ifsc: MECT_ORG.bank.ifsc,
    branch: MECT_ORG.bank.branch,
    upiId: MECT_ORG.bank.upiId,
    upiBeneficiaryDisplay: MECT_ORG.bank.upiBeneficiaryName,
    verifiedQrSrc: "/images/donate/mect-sbi-qr.png",
  },
  chairman: {
    name: "Er. Japabandhu Kampa",
    role: "Chairman and Managing Trustee",
    fullTitle: "Settler Founder & Chairman cum Managing Trustee",
    honoraryClause:
      "All trustees serve in an honorary capacity without salary, fee, or personal remuneration under registered Trust Deed Clause XVI.",
  },
  branding: {
    logoPath: "/images/mect-official-emblem.png",
    logoAlt: "Mahaveer Educational & Charitable Trust (MECT) Official Emblem",
    canonicalOrigin: "https://mect.org.in",
    ogDefaultImagePath: "/images/og-default.png",
  },
  donationIntentPresets: [1000, 2500, 5000, 10000, 25000] as readonly number[],
  scholarshipIntake: {
    intakeOpen: false,
    statusNote:
      "Online document upload is currently paused pending the next Trust intake window announcement. Please direct scholarship queries to mect220@gmail.com.",
  },
} as const;

