import fs from "fs";

console.log("=== RUNNING PHASE 7 VERIFIED IMPACT & BENEFICIARY METRICS AUDIT ===");

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

const impactContent = fs.readFileSync("src/app/impact/page.tsx", "utf8");

assert(impactContent.includes("350+ Students"), "Impact page highlights 350+ remedial students");
assert(impactContent.includes("120+ Women Skilled"), "Impact page highlights 120+ skilled rural women");
assert(impactContent.includes("10,000+ Citizens Served"), "Impact page highlights 10,000+ water beneficiaries");
assert(impactContent.includes("Daily Meal Distribution"), "Impact page highlights Jan Ahar hospital nutrition");
assert(impactContent.includes("Puintala Block, Balangir District"), "Features authentic Puintala case study");
assert(impactContent.includes("Rugudipara Training Centre, Balangir"), "Features authentic Rugudipara tailoring case study");
assert(impactContent.includes("Balangir Bus Terminus & District Hospital"), "Features authentic Jal Seva hospital case study");
assert(impactContent.includes("Western Operational Hub"), "Features Western Operational Hub with Balangir HQ");
assert(impactContent.includes("Central & Capital Liaison Corridor"), "Features Central & Capital Corridor with Bhubaneswar Secretariat");
assert(impactContent.includes("/reports"), "Impact page links to /reports archive");
assert(impactContent.includes("/statutory-disclosures"), "Impact page links to /statutory-disclosures");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
