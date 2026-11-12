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
  panAllotmentConfirmation: "{{CONFIRM: PAN allotment date vs deed date}}",

  historicalOrderSummary: `Order dated ${ORG.ids.taxOrderDate}, covering ${ORG.ids.taxOrderValidityPeriod}`,
  historical12ASummary: `Historical Form 10AC Section 12A Order (URN: ${ORG.ids.urn12A}, dated ${ORG.ids.taxOrderDate}, covering ${ORG.ids.taxOrderValidityPeriod})`,
  historical80GSummary: `Historical Form 10AC Section 80G Order (URN: ${ORG.ids.urn80G}, dated ${ORG.ids.taxOrderDate}, covering ${ORG.ids.taxOrderValidityPeriod})`,

  taxStatusNotice: {
    heading: "Tax & Registration Status Notice (FY 2026-27)",
    summary: `The 80G and 12A orders on file cover ${ORG.ids.taxOrderValidityPeriod} (order dated ${ORG.ids.taxOrderDate}). The position for FY 2026-27 is being confirmed with the Trust's Chartered Accountant.`,
    caConfirmMarker: "{{CONFIRM: 80G notice wording}}",
    disclosuresLabel: "View Statutory Disclosures",
    disclosuresHref: "/statutory-disclosures",
  },

  certificateTerm: "donation certificate",
} as const;
