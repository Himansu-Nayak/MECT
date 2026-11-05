import fs from "fs";

console.log("=== RUNNING PHASE 8 ANNUAL REPORTS & FINANCIAL ARCHIVE AUDIT ===");

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

const repContent = fs.readFileSync("src/app/reports/page.tsx", "utf8");

assert(repContent.includes("FY 2023–24"), "Reports includes FY 2023-24 Annual Report");
assert(repContent.includes("AR-2023-24-MECT"), "Reports includes reference code AR-2023-24-MECT");
assert(repContent.includes("AADTM5474FE20231") || repContent.includes("AADTM5474FF20241"), "FY 2023-24 highlights 12A & 80G Form 10AC issuance");
assert(repContent.includes("FY 2022–23"), "Reports includes FY 2022-23 Annual Report");
assert(repContent.includes("120+ rural women graduated"), "FY 2022-23 highlights 120+ women tailoring graduates");
assert(repContent.includes("FY 2021–22"), "Reports includes FY 2021-22 Annual Report");
assert(repContent.includes("100% Programme Expense Policy"), "Reports highlights 100% Programme Expense Policy");
assert(repContent.includes("Zero Trustee Remuneration"), "Reports highlights Zero Trustee Remuneration");
assert(repContent.includes("Clause XVI"), "Reports references Trust Deed Clause XVI");
assert(repContent.includes("Independent CA Audits"), "Reports features Independent CA Audits");
assert(repContent.includes("/statutory-disclosures"), "Reports links to /statutory-disclosures");
assert(repContent.includes("/donate"), "Reports links to /donate online gateway");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
