import fs from "fs";

console.log("=== RUNNING PHASE P3 HOMEPAGE REDESIGN & MULTI-SECTOR NGO AUDIT ===");

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

const pageContent = fs.readFileSync("src/app/page.tsx", "utf8");
const content = fs.readFileSync("src/lib/homepage-content.ts", "utf8");

// SECTION 1 — Premium Editorial Hero
assert(!pageContent.includes("Est. 2013") && !pageContent.includes("13+ Years of Community Service"), "Hero omits removed Est. 2013 service pill");
assert(!pageContent.includes("80G Tax Exempt"), "Hero omits removed 80G Tax Exemption pill");
assert(pageContent.includes("HOMEPAGE_CONTENT.hero.subtext") && content.includes("Mahaveer Educational"), "Hero uses official Mahaveer Educational & Charitable Trust identity");
assert(content.includes("Stronger communities begin with opportunity, dignity and care") && pageContent.includes("HOMEPAGE_CONTENT.hero.headline"), "Hero features grand multi-sector headline");
assert(!pageContent.includes("Documented Programme Pillars") && !pageContent.includes("Sector Vault Card"), "Hero removes old right-side information panel cleanly");
const heroGalleryContent = fs.readFileSync("src/components/sections/HeroPhotoGallery.tsx", "utf8");
assert(pageContent.includes("HeroPhotoGallery") && heroGalleryContent.includes("hero-gallery-track-ltr") && heroGalleryContent.includes("hero-gallery-track-rtl"), "Hero features continuous two-track photographic gallery");
assert(pageContent.includes("HOMEPAGE_CONTENT.hero.ctas.csr"), "Hero features CSR Gateway CTA");
assert(pageContent.includes("HOMEPAGE_CONTENT.hero.metrics.map"), "Hero renders verified metric cards");

// SECTION 2 — Institutional Credibility
assert(pageContent.includes("InstitutionalMarquee"), "Page renders InstitutionalMarquee");
assert(pageContent.includes("40311302194"), "Credibility bar references Trust Deed 40311302194");
assert(pageContent.includes("AADTM5474FE20231"), "Credibility bar references 12A URN AADTM5474FE20231");
assert(pageContent.includes("AADTM5474FF20241"), "Credibility bar references 80G URN AADTM5474FF20241");
assert(pageContent.includes("AADTM5474F"), "Credibility bar references PAN AADTM5474F");
assert(pageContent.includes("OR/2024/0466491"), "Credibility bar references NGO Darpan OR/2024/0466491");
assert(!pageContent.includes("MCA CSR-1"), "Homepage removes MCA CSR-1 phrasing from general areas");

// PHASE 3 & 4 — Free Education 200 Students & Smile Foundation Fundraising
const freeEduContent = fs.readFileSync("src/components/sections/FreeEducationSection.tsx", "utf8");
const fundraisingContent = fs.readFileSync("src/components/sections/SmileFundraisingSection.tsx", "utf8");
const sbiContent = fs.readFileSync("src/components/sections/SbiDonationSection.tsx", "utf8");
const csrSectionContent = fs.readFileSync("src/components/sections/CsrRegistrationSection.tsx", "utf8");

assert(pageContent.includes("FreeEducationSection") && content.includes("FREE EDUCATION FOR 200 STUDENTS") && content.includes("EDUCATION TODAY. A BETTER TOMORROW."), "Page features FREE EDUCATION FOR 200 STUDENTS programme");
assert(pageContent.includes("SmileFundraisingSection") && content.includes("SUPPORT EDUCATION. TRANSFORM LIVES.") && fundraisingContent.includes("authorisationDisclaimer"), "Page features Smile Foundation fundraising section with non-misrepresentation disclaimer");

// SECTION 3 — Our Five Development Sectors
assert(pageContent.includes("HOMEPAGE_CONTENT.pillars.map"), "Page renders 5 development sectors");
assert(content.includes("Education & Learning"), "Sectors include Sector 1: Education");
assert(content.includes("Women Empowerment & Livelihoods"), "Sectors include Sector 2: Women Empowerment");
assert(content.includes("Safe Water & Sanitation"), "Sectors include Sector 3: Safe Water");
assert(content.includes("Food Security & Nutrition"), "Sectors include Sector 4: Food Security");
assert(content.includes("Community Welfare"), "Sectors include Sector 5: Community Welfare");
assert(content.includes("/programmes#education"), "Pillars link to /programmes#education");
assert(content.includes("/programmes#women-empowerment"), "Pillars link to /programmes#women-empowerment");
assert(content.includes("/programmes#water"), "Pillars link to /programmes#water");
assert(content.includes("/programmes#hunger-relief"), "Pillars link to /programmes#hunger-relief");

// PHASE 7.3 — Story Section Removal & Child Safeguarding Verification
assert(!pageContent.includes("HOMEPAGE_CONTENT.stories") && !pageContent.includes("Stories from the Ground"), "Story section completely removed from Homepage");
assert(!content.includes("stories:") && !content.includes("StoryCard"), "Story definitions completely removed from homepage-content.ts");
assert(!content.includes("/images/documentary/") && !pageContent.includes("/images/documentary/"), "Homepage strictly excludes all unconsented documentary images pic-1 through pic-9");
assert(!pageContent.includes("Rural women participating in certified tailoring"), "Hero strictly excludes misattributed pic-2 tailoring caption");

// SECTION 5 — Impact at a Glance
assert(pageContent.includes("Thirteen Years of Documented Civic Service"), "Page features impact section");
assert(pageContent.includes("350+"), "Impact highlights 350+ students coached");
assert(pageContent.includes("120+"), "Impact highlights 120+ women skilled");
assert(pageContent.includes("10,000+"), "Impact highlights 10,000+ citizens served");

// SECTION 6 — How MECT Works
assert(pageContent.includes("HOMEPAGE_CONTENT.howWeWork"), "Page features 4-step How MECT Works framework");

// SECTION 7 — Scholarship Suite
assert(pageContent.includes("SchemeExplorer"), "Page renders SchemeExplorer");
assert(pageContent.includes("EligibilityCalculator"), "Page renders EligibilityCalculator");
assert(pageContent.includes("DirectDisbursalFlowchart"), "Page renders DirectDisbursalFlowchart");

// SECTION 8 (PHASE 6) — CSR Registration & Organisational Details
assert(pageContent.includes("CsrRegistrationSection") && csrSectionContent.includes("CSR REGISTRATION &amp; ORGANISATIONAL DETAILS"), "Page renders CSR REGISTRATION & ORGANISATIONAL DETAILS section");
assert(csrSectionContent.includes("mect-csr1-certificate.png") && csrSectionContent.includes("/csr-partnerships"), "CSR section features certificate preview/download and /csr-partnerships gateway");

// SECTION 9 — Managing Trustee Message
assert(content.includes("Er. Japabandhu Kampa") && pageContent.includes("HOMEPAGE_CONTENT.secretariat.officeTitle"), "Managing Trustee desk features Er. Japabandhu Kampa");
assert(pageContent.includes("Honorary Board of Trustees"), "Trustee section highlights honorary governance");
assert(pageContent.includes("/governance"), "Trustee section links to /governance");

// SECTION 10 — Volunteer Participation
assert(pageContent.includes("submitVolunteerRegistration"), "Volunteer form connects to submitVolunteerRegistration API");
assert(pageContent.includes("volConsent"), "Volunteer form enforces mandatory consent declaration");

// SECTION 11 (PHASE 5) — SBI Donation & 80G Tax Reassurance
assert(pageContent.includes("SUPPORT OUR MISSION — DONATE NOW") && pageContent.includes("SbiDonationSection"), "Donation section displays SUPPORT OUR MISSION — DONATE NOW and SbiDonationSection");
assert(sbiContent.includes("STATE BANK OF INDIA") && sbiContent.includes("Awaiting Official QR Supply"), "SBI donation section displays STATE BANK OF INDIA and unfabricated pending QR area");
assert(pageContent.includes("Section 80G Tax Exemption Notice") || pageContent.includes("HOMEPAGE_CONTENT.donorNotice.title") || pageContent.includes("Section 80G Tax Deduction"), "Donation section highlights Section 80G tax benefit");
assert(pageContent.includes("donationAmount") && pageContent.includes("taxBracket"), "Donation section features interactive 80G tax deduction calculator");
assert(pageContent.includes("TRUST_CONFIG.bank.ifsc"), "Donation section displays domestic bank IFSC");
assert(pageContent.includes("TRUST_CONFIG.bank.accountNumber"), "Donation section displays domestic bank account number");
assert(pageContent.includes("80G(5)(vi)"), "Page accurately cites legacy Section 80G(5)(vi) for historical Commissioner approval");
assert(!pageContent.includes("80G(5)(iv)"), "Page strictly avoids misattributing approval to legacy Section 80G(5)(iv)");
assert(pageContent.includes("Section 133") && pageContent.includes("Section 202") && pageContent.includes("Section 354"), "Page cites modern Income-tax Act, 2025 Sections 133, 202, and 354");
assert(pageContent.includes("Section 536"), "Page cites modern Income-tax Act, 2025 Section 536 repeal, savings and transition provisions");
assert(pageContent.includes("Form 105") && pageContent.includes("Form 107") && pageContent.includes("Form 113") && pageContent.includes("Form 114"), "Page references modern statutory Forms 105, 107, 113, and 114");
assert(pageContent.includes("Current approval for Tax Year 2026-27 has not yet been established from the documentary records reviewed."), "Page states exact audit finding that approval for Tax Year 2026-27 has not yet been established");
assert(!pageContent.includes("awaiting documentary confirmation of a Form 107"), "Page avoids claiming awaiting status without Form 105 filing receipt on record");

// SECTION 12 — Secretariat Inquiry Desk
assert(pageContent.includes("submitInquiry"), "Secretariat desk connects to submitInquiry API");
assert(pageContent.includes("ODISHA_DISTRICTS_LIST"), "Inquiry desk provides Odisha districts selection");

// SECTION 13 — Final Institutional CTA
assert(pageContent.includes("Participate in Sustainable Community Transformation Across Odisha"), "Page features grand final CTA");

// Brand Palette Checks
assert(pageContent.includes("bg-terracotta") || pageContent.includes("bg-forest"), "Page uses approved Terracotta / Forest Charcoal tokens");
assert(!pageContent.includes("#0A192F"), "Page strictly excludes prohibited navy #0A192F");
assert(!pageContent.includes("#D97706"), "Page strictly excludes unapproved amber/orange #D97706");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
