import fs from "fs";

console.log("=== RUNNING PHASE 2 MASTER HOMEPAGE TRANSFORMATION AUDIT ===");

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

// 1. Audit HOMEPAGE_CONTENT in src/lib/homepage-content.ts
const content = fs.readFileSync("src/lib/homepage-content.ts", "utf8");
assert(content.includes("12+ Years"), "Homepage content features 12+ Years heritage");
assert(content.includes("40311302194"), "Homepage content references registered Trust Deed 40311302194");
assert(content.includes("CSR00081063"), "Homepage content references MCA CSR-1 Reg CSR00081063");
assert(content.includes("AADTM5474FF20241"), "Homepage content references Section 80G URN AADTM5474FF20241");
assert(content.includes("Er. Japabandhu Kampa"), "Homepage content features Managing Trustee Er. Japabandhu Kampa");
assert(content.includes("Remedial Rural Education"), "Pillars include Remedial Rural Education");
assert(content.includes("Women's Vocational Livelihood"), "Pillars include Women's Vocational Livelihood");
assert(content.includes("Jal Seva Safe Drinking Water"), "Pillars include Jal Seva Safe Drinking Water");
assert(content.includes("Jan Ahar Destitute Nutrition"), "Pillars include Jan Ahar Destitute Nutrition");

// 2. Audit src/app/page.tsx
const pageContent = fs.readFileSync("src/app/page.tsx", "utf8");
assert(pageContent.includes("bg-[#0A192F]"), "Page uses Presidential Navy theme token");
assert(pageContent.includes("80G Tax Exempt"), "Hero showcases 80G Tax Exemption badge");
assert(pageContent.includes("HOMEPAGE_CONTENT.hero.ctas.csr"), "Hero features Corporate CSR Gateway CTA");
assert(pageContent.includes("HOMEPAGE_CONTENT.pillars.map"), "Page renders the 4 core mission pillars");
assert(pageContent.includes("Turnkey Corporate Social Responsibility (CSR) Partnerships"), "Page features Corporate CSR Hub section");
assert(pageContent.includes("CSR00081063"), "CSR section highlights MCA CSR-1 registration number");
assert(pageContent.includes("Er. Japabandhu Kampa") || pageContent.includes("HOMEPAGE_CONTENT.secretariat.officeTitle"), "Managing Trustee desk is prominently rendered");
assert(pageContent.includes("Section 80G Tax Exemption Notice") || pageContent.includes("HOMEPAGE_CONTENT.donorNotice.title"), "Section 80G tax reassurance is rendered");
assert(pageContent.includes("TRUST_CONFIG.bank.ifsc"), "Domestic bank IFSC code is displayed for direct transfers");
assert(pageContent.includes("TRUST_CONFIG.bank.accountNumber"), "Domestic bank account number is displayed for direct transfers");
assert(pageContent.includes("submitInquiry"), "Secretariat inquiry form connects to backend");
assert(pageContent.includes("submitVolunteerRegistration"), "Volunteer form connects to backend");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
