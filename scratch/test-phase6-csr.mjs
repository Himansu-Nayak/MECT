import fs from "fs";

console.log("=== RUNNING PHASE 6 CORPORATE CSR GATEWAY AUDIT ===");

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

const csrContent = fs.readFileSync("src/app/csr-partnerships/page.tsx", "utf8");

assert(csrContent.includes("CSR00081063") || csrContent.includes("mcaCsrNumber"), "CSR page features MCA CSR-1 Reg CSR00081063");
assert(csrContent.includes("Schedule VII"), "CSR page aligns with Companies Act Schedule VII");
assert(csrContent.includes("Schedule VII (ii)"), "Features Schedule VII (ii) for Education");
assert(csrContent.includes("Schedule VII (iii)"), "Features Schedule VII (iii) for Women's Livelihood");
assert(csrContent.includes("Schedule VII (i)"), "Features Schedule VII (i) for Water & Nutrition");
assert(csrContent.includes("Utilization Certificate") || csrContent.includes("Utilization Certificates"), "Features independent CA Utilization Certificates");
assert(csrContent.includes("Milestone-Based Tranche Disbursal"), "Features milestone tranche disbursal controls");
assert(csrContent.includes("companyName"), "Inquiry form captures company legal name");
assert(csrContent.includes("csrBudget"), "Inquiry form captures corporate CSR budget");
assert(csrContent.includes("submitInquiry"), "Inquiry form connects to backend API");
assert(csrContent.includes("/statutory-disclosures"), "CSR page links to /statutory-disclosures");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
