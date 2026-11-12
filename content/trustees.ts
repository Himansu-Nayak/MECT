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
      "Settler founder of Mahaveer Educational & Charitable Trust (MECT) and custodian of trust records under the registered Trust Deed (Trust Deed executed 27 July 2013; registered 30 July 2013, Balangir Sub-Registrar). Serves in a strictly honorary, non-remunerative capacity.",
    status: "Chairman & Managing Trustee",
    isConfirmed: true,
  },
  {
    id: "other-trustees",
    name: "Additional Trustees ({{CONFIRM: trustee list}})",
    initials: "BT",
    role: "Honorary Board of Trustees (3–9 Members per Deed)",
    deedClause: "Clause 8(1) & Section 9 Clause XVI",
    details:
      "Under Clause 8 of the registered Trust Deed, the Board comprises 3 to 9 honorary trustees serving without salary or remuneration. Full names, designations, and consented biographies of additional trustees will be published here upon confirmation ({{CONFIRM: trustee list}}).",
    status: "Awaiting Trustee Confirmation",
    isConfirmed: false,
  },
];

