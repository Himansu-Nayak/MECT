import { ORG } from "./org";

export type EligibilityStatus = "unconfirmed" | "confirmed";

/**
 * Single source of truth for FY 2026-27 (AY 2027-28) 12A/80G tax eligibility status.
 * Default remains "unconfirmed" until the Chartered Accountant confirms current-year status.
 */
export const ELIGIBILITY_FY2026_27: EligibilityStatus =
  "unconfirmed" as EligibilityStatus;

export const COMPLIANCE = {
  eligibilityFY2026_27: ELIGIBILITY_FY2026_27,
  isTaxEligibilityConfirmed: ELIGIBILITY_FY2026_27 === "confirmed",
  showTaxEstimator: ELIGIBILITY_FY2026_27 === "confirmed",

  trustDeedWording:
    "Trust Deed executed 27 July 2013; registered 30 July 2013, Balangir Sub-Registrar",
  panAllotmentConfirmation: "Allotment Date: 09-08-2023",

  historicalOrderSummary: `Order dated ${ORG.ids.taxOrderDate}, covering ${ORG.ids.taxOrderValidityPeriod}`,
  historical12ASummary: `Historical Form 10AC Section 12A Order (URN: ${ORG.ids.urn12A}, dated ${ORG.ids.taxOrderDate}, covering ${ORG.ids.taxOrderValidityPeriod})`,
  historical80GSummary: `Historical Form 10AC Section 80G Order (URN: ${ORG.ids.urn80G}, dated ${ORG.ids.taxOrderDate}, covering ${ORG.ids.taxOrderValidityPeriod})`,

  taxStatusNotice: {
    heading: "Tax & Registration Status Notice (FY 2026-27)",
    summary:
      "Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility. No current-year deduction is represented on this page.",
    disclosuresLabel: "View Statutory Disclosures",
    disclosuresHref: "/statutory-disclosures",
  },

  certificateTerm: "donation certificate",
} as const;
