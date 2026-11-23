import fs from "fs";

console.log("=== RUNNING PHASE 4 STATUTORY COMPLIANCE & VAULT AUDIT ===");

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

const statContent = fs.readFileSync("src/app/statutory-disclosures/page.tsx", "utf8");

assert(statContent.includes("40311302194"), "Vault includes registered Trust Deed No. 40311302194");
assert(statContent.includes("AADTM5474F") || statContent.includes("TRUST_CONFIG.statutory.pan"), "Vault includes PAN AADTM5474F");
assert(statContent.includes("AADTM5474FE20231") || statContent.includes("section12AUrn"), "Vault includes Section 12A URN AADTM5474FE20231");
assert(statContent.includes("AADTM5474FF20241") || statContent.includes("section80GUrn"), "Vault includes Section 80G URN AADTM5474FF20241");
assert(statContent.includes("CSR00081063") || statContent.includes("mcaCsrNumber"), "Vault includes MCA CSR-1 Reg CSR00081063");
assert(statContent.includes("OR/2024/0466491") || statContent.includes("ngoDarpanId"), "Vault includes NITI Aayog NGO Darpan ID OR/2024/0466491");
assert(statContent.includes("OR/00040466") || statContent.includes("mosjeAnudaanId"), "Vault includes MoSJE e-Anudaan ID OR/00040466");
assert(statContent.includes("50% Tax Deduction"), "Vault explains 50% tax deduction under Section 80G");
assert(statContent.includes("Form 10BE"), "Vault documents Form 10BD/10BE donation certificate protocol");
assert(statContent.includes("Schedule VII"), "Vault aligns CSR with Companies Act Schedule VII");
assert(statContent.includes("TRUST_CONFIG.bank.accountNumber"), "Vault displays official domestic bank account number");
assert(statContent.includes("TRUST_CONFIG.bank.ifsc"), "Vault displays official domestic bank IFSC code");
assert(statContent.includes("/donate"), "Vault links to /donate online gateway");
assert(statContent.includes("/csr-partnerships"), "Vault links to /csr-partnerships portal");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
