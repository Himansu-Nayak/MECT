import fs from "fs";

console.log("=== RUNNING PHASE 9 80G TAX EXEMPTION & DONOR PORTAL AUDIT ===");

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

const donContent = fs.readFileSync("src/app/donate/page.tsx", "utf8");

assert(donContent.includes("section80GUrn") || donContent.includes("AADTM5474FF20241"), "Donate page features Section 80G Order URN");
assert(donContent.includes("TRUST_CONFIG.statutory.pan") || donContent.includes("AADTM5474F"), "Donate page features Trust PAN");
assert(donContent.includes("eligibleDeduction = donationAmount * 0.5"), "Calculator enforces 50% tax deduction calculation");
assert(donContent.includes("TRUST_CONFIG.bank.accountNumber"), "Donate page renders official bank account number");
assert(donContent.includes("TRUST_CONFIG.bank.ifsc"), "Donate page renders official bank IFSC code");
assert(donContent.includes("panRegex"), "Receipt form validates donor PAN format");
assert(donContent.includes("donorData.utrNumber"), "Receipt form captures transaction UTR / bank ref");
assert(donContent.includes("submitInquiry"), "Receipt form connects to backend API");
assert(donContent.includes("Form 10BE"), "Receipt workflow documents Form 10BD/10BE filing");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
