import fs from "fs";

console.log("=== RUNNING PHASE 3 FIDUCIARY GOVERNANCE & BOARD AUDIT ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

const govContent = fs.readFileSync("src/app/governance/page.tsx", "utf8");

assert(govContent.includes("40311302194"), "Governance page features registered Trust Deed No. 40311302194");
assert(govContent.includes("Er. Japabandhu Kampa"), "Governance features Managing Trustee Er. Japabandhu Kampa");
assert(govContent.includes("Yudhisthir Rana"), "Governance features Life Trustee Yudhisthir Rana");
assert(govContent.includes("Ramachandra Biswal"), "Governance features Life Trustee Ramachandra Biswal");
assert(govContent.includes("Sambit Kumar Dang"), "Governance features Life Trustee Sambit Kumar Dang");
assert(govContent.includes("Clause XVI"), "Governance highlights Trust Deed Clause XVI on Honorary Service");
assert(govContent.includes("Clause VIII & IX"), "Governance highlights Clauses VIII & IX on Quorum and Tenure");
assert(govContent.includes("Clause XVII"), "Governance highlights Clause XVII on Section 11(5) Investments");
assert(govContent.includes("Clause XVIII"), "Governance highlights Clause XVIII on Irrevocable Character");
assert(govContent.includes("AADTM5474FE20231") || govContent.includes("section12AUrn"), "Governance references Section 12A URN");
assert(govContent.includes("AADTM5474FF20241") || govContent.includes("section80GUrn"), "Governance references Section 80G URN");
assert(govContent.includes("CSR00081063") || govContent.includes("mcaCsrNumber"), "Governance references MCA CSR-1 Registration");
assert(govContent.includes("/statutory-disclosures"), "Governance links to /statutory-disclosures");
assert(govContent.includes("100% Direct Bank Remittance"), "Governance highlights Direct Bank Remittance standard");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
