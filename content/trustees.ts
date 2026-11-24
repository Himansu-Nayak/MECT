import { ORG } from "./org";

export interface TrusteeProfile {
  id: string;
  name: string;
  initials: string;
  role: string;
  deedClause: string;
  details: string;
  status: string;
  isConfirmed: boolean;
}

export const TRUSTEES: TrusteeProfile[] = [
  {
    id: "chairman",
    name: ORG.chairman.name,
    initials: "JK",
    role: ORG.chairman.role,
    deedClause: "Clause 8(2) & Clause 10",
    details:
      `Settler founder of ${ORG.legalName} and custodian of trust records under the registered Trust Deed (Trust Deed executed ${ORG.trustDeed.executedDateDisplay}; registered ${ORG.trustDeed.registeredDateDisplay}, ${ORG.trustDeed.subRegistrar}). Serves in a strictly honorary, non-remunerative capacity.`,
    status: "Chairman & Managing Trustee",
    isConfirmed: true,
  },
  {
    id: "other-trustees",
    name: "Additional Trustees (Under Trustee Confirmation)",
    initials: "BT",
    role: "Honorary Board of Trustees (3–9 Members per Deed)",
    deedClause: "Clause 8(1) & Section 9 Clause XVI",
    details:
      "Under Clause 8 of the registered Trust Deed, the Board comprises 3 to 9 honorary trustees serving without salary or remuneration. Full names, designations, and consented biographies of additional trustees will be published here upon secretarial confirmation.",
    status: "Awaiting Trustee Confirmation",
    isConfirmed: false,
  },
];

