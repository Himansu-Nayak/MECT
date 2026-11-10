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
assert(!govContent.includes("Yudhisthir Rana") && !govContent.includes("Ramachandra Biswal") && !govContent.includes("Sambit Kumar Dang"), "Governance excludes removed Life Trustees as instructed");
assert(govContent.includes("Clause XVI"), "Governance highlights Trust Deed Clause XVI on Honorary Service");
assert(govContent.includes("Clause 8, 12 & 13") && govContent.includes("3 and not more than 9"), "Governance accurately cites Trust Deed Clauses 8, 12 & 13 (3-9 trustees & quorum)");
assert(govContent.includes("Section 9(VII) & Clause 16"), "Governance accurately cites Section 9(VII) & Clause 16 on lawful investments & audited accounts");
assert(govContent.includes("Clauses 23, 24 & 25"), "Governance accurately cites Clauses 23, 24 & 25 on Irrevocable Character & extinguishment");
assert(govContent.includes("AADTM5474FE20231") || govContent.includes("section12AUrn"), "Governance references Section 12A URN");
assert(govContent.includes("AADTM5474FF20241") || govContent.includes("section80GUrn"), "Governance references Section 80G URN");
assert(!govContent.includes("MCA CSR-1"), "Governance removes MCA CSR-1 wording");
assert(govContent.includes("OR/2024/0466491") || govContent.includes("ngoDarpanId"), "Governance references NITI Aayog NGO Darpan enrollment");
assert(govContent.includes("/statutory-disclosures"), "Governance links to /statutory-disclosures");
assert(govContent.includes("100% Direct Bank Remittance"), "Governance highlights Direct Bank Remittance standard");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
