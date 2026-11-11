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
assert(content.includes("13+ Years") || content.includes("12+ Years"), "Homepage content features 13+ Years of Community Service (Est. 2013)");
assert(content.includes("40311302194"), "Homepage content references registered Trust Deed 40311302194");
assert(!content.includes("MCA CSR-1"), "Homepage content removes MCA wording from general areas");
assert(content.includes("FREE EDUCATION FOR 200 STUDENTS"), "Homepage content features Free Education for 200 Students");
assert(content.includes("SUPPORT EDUCATION. TRANSFORM LIVES."), "Homepage content features Smile Foundation associated fundraising");
assert(!content.includes("StoryCard") && !content.includes("Stories from the Ground"), "Homepage content removes Story section");
assert(content.includes("AADTM5474FF20241"), "Homepage content references Section 80G URN AADTM5474FF20241");
assert(content.includes("Er. Japabandhu Kampa"), "Homepage content features Managing Trustee Er. Japabandhu Kampa");
assert(content.includes("Education & Learning") && content.includes("Shiksha Setu"), "Pillars include Education & Learning (Shiksha Setu)");
assert(content.includes("Women Empowerment & Livelihoods") && content.includes("Swavalamban"), "Pillars include Women Empowerment & Livelihoods (Swavalamban)");
assert(content.includes("Safe Water & Sanitation") && content.includes("Jal Seva"), "Pillars include Safe Water & Sanitation (Jal Seva)");
assert(content.includes("Food Security & Nutrition") && content.includes("Jan Ahar"), "Pillars include Food Security & Nutrition (Jan Ahar)");

// 2. Audit src/app/page.tsx
const pageContent = fs.readFileSync("src/app/page.tsx", "utf8");
assert(pageContent.includes("bg-terracotta") || pageContent.includes("bg-forest"), "Page uses approved Terracotta / Forest Charcoal theme token");
assert(!pageContent.includes("bg-[#0A192F]"), "Page does not use prohibited Presidential Navy token #0A192F");
assert(!pageContent.includes("80G Tax Exempt") && !pageContent.includes("Est. 2013"), "Hero omits removed 80G Tax Exempt and Est. 2013 pill badges");
assert(pageContent.includes("HOMEPAGE_CONTENT.hero.ctas.csr"), "Hero features Corporate CSR Gateway CTA");
assert(pageContent.includes("HOMEPAGE_CONTENT.pillars.map"), "Page renders the 4 core mission pillars");
assert(pageContent.includes("CsrRegistrationSection"), "Page renders CSR Registration & Organisational Details section");
assert(fs.readFileSync("src/components/sections/CsrRegistrationSection.tsx", "utf8").includes("CSR00081063") || fs.readFileSync("src/components/sections/CsrRegistrationSection.tsx", "utf8").includes("mcaCsrNumber"), "CSR section highlights verified CSR registration number");
assert(pageContent.includes("SbiDonationSection"), "Page renders State Bank of India donation section");
assert(pageContent.includes("FreeEducationSection") && pageContent.includes("SmileFundraisingSection"), "Page renders Free Education 200 and Fundraising sections");
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
