import fs from "fs";

console.log("=== RUNNING PHASE 5 PROGRAMMATIC PILLARS AUDIT ===");

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

const progContent = fs.readFileSync("src/app/programmes/page.tsx", "utf8");

assert(progContent.includes("Education & Learning Support") && (progContent.includes("Remedial") || progContent.includes("remedial")), "Programmes includes Education & Learning Support (Remedial Coaching)");
assert(progContent.includes("Shiksha Setu"), "Education includes tag Shiksha Setu");
assert(progContent.includes("350+"), "Education highlights 350+ coached students metric");
assert(progContent.includes("Women's Vocational Skills & Livelihood Training") && (progContent.includes("Tailoring") || progContent.includes("tailoring")), "Programmes includes Women's Vocational Skills & Livelihood Training (Swavalamban)");
assert(progContent.includes("Swavalamban"), "Women empowerment includes tag Swavalamban");
assert(progContent.includes("120+"), "Women empowerment highlights 120+ graduated artisans metric");
assert(progContent.includes("Jal Seva"), "Programmes includes Jal Seva Clean Drinking Water");
assert(progContent.includes("10,000+"), "Water relief highlights 10,000+ citizens served");
assert(progContent.includes("Jan Ahar"), "Programmes includes Jan Ahar Hospital Food Relief");
assert(progContent.includes("Annadaan"), "Food relief includes tag Annadaan");
assert(progContent.includes("Statewide Higher Education Tuition Grants"), "Features statewide tuition grant expansion");
assert(progContent.includes("Project Samarth Community Learning Hubs"), "Features Project Samarth study hubs");
assert(progContent.includes("/donate"), "Programmes links to /donate online gateway");
assert(progContent.includes("/csr-partnerships"), "Programmes links to /csr-partnerships portal");
assert(!progContent.includes("#0A192F"), "Programmes does not use prohibited Presidential Navy token #0A192F");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
