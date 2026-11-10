import fs from "fs";
import path from "path";

console.log("=== RUNNING PHASE P2 INFORMATION ARCHITECTURE & NAVIGATION AUDIT ===");

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

// 1. Verify TRUST_CONFIG in src/lib/config.ts
const configContent = fs.readFileSync("src/lib/config.ts", "utf8");

assert(configContent.includes('label: "About"'), "Config navigation includes 'About'");
assert(configContent.includes('label: "Our Work"'), "Config navigation includes 'Our Work'");
assert(configContent.includes('label: "Impact & Accountability"'), "Config navigation includes 'Impact & Accountability'");
assert(configContent.includes('label: "Get Involved"'), "Config navigation includes 'Get Involved'");
assert(configContent.includes('label: "Resources & Help"'), "Config navigation includes 'Resources & Help'");

// Verify Five Core Mission Pillars
assert(configContent.includes("Education & Learning"), "Config pillars include Education & Learning");
assert(configContent.includes("Women Empowerment & Livelihoods"), "Config pillars include Women Empowerment & Livelihoods");
assert(configContent.includes("Safe Water & Sanitation"), "Config pillars include Safe Water & Sanitation");
assert(configContent.includes("Food Security & Nutrition"), "Config pillars include Food Security & Nutrition");
assert(configContent.includes("Community Welfare"), "Config pillars include Community Welfare");

// 2. Verify all target routes physically exist in src/app
const routes = [
  "src/app/about/page.tsx",
  "src/app/governance/page.tsx",
  "src/app/statutory-disclosures/page.tsx",
  "src/app/programmes/page.tsx",
  "src/app/scholarships/page.tsx",
  "src/app/impact/page.tsx",
  "src/app/reports/page.tsx",
  "src/app/donate/page.tsx",
  "src/app/volunteer/page.tsx",
  "src/app/csr-partnerships/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/faq/page.tsx",
  "src/app/accessibility/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
];

for (const r of routes) {
  assert(fs.existsSync(r), `Route physical file exists: ${r}`);
}

// 3. Verify Header.tsx
const headerContent = fs.readFileSync("src/components/Header.tsx", "utf8");
assert(headerContent.includes("Mahaveer Educational &amp; Charitable Trust") || headerContent.includes("Mahaveer Educational & Charitable Trust"), "Header includes registered trust name");
assert(!headerContent.includes("Est. 2013"), "Header does not include duplicated Est. 2013 badge");
assert(headerContent.includes("/donate"), "Header includes direct Donate action");
assert(headerContent.includes("aria-expanded"), "Header controls include aria-expanded");
assert(headerContent.includes("aria-controls"), "Header disclosure controls include aria-controls");
assert(headerContent.includes("focus-visible:outline-terracotta"), "Header includes Terracotta focus indicator");
assert(headerContent.includes("mobileMenuOpen"), "Header includes mobile drawer state");
assert(headerContent.includes("min-h-[44px]"), "Header mobile touch targets meet 44px min-height");
assert(!headerContent.includes("#0A192F"), "Header does not contain prohibited navy #0A192F");
assert(!headerContent.includes("#D97706"), "Header does not contain non-brand orange/amber #D97706");

// 4. Verify Footer.tsx
const footerContent = fs.readFileSync("src/components/Footer.tsx", "utf8");
assert(footerContent.includes("Mahaveer Educational") && !footerContent.includes("MAHAVIR TRUST"), "Footer uses official Mahaveer Educational & Charitable Trust brand name");
assert(!footerContent.includes("Est. 2013"), "Footer does not include Est. 2013 pill/subtitle");
assert(footerContent.includes("40311302194"), "Footer lists registered Trust Deed number");
assert(footerContent.includes("Section 80G"), "Footer highlights Section 80G tax benefit");
assert(footerContent.includes("TRUST_CONFIG.bank.ifsc"), "Footer references bank IFSC code");
assert(footerContent.includes("registeredOffice"), "Footer references registered office");
assert(footerContent.includes("corporateOffice"), "Footer references corporate liaison office");
assert(footerContent.includes("Education") && footerContent.includes("Remedial Coaching"), "Footer lists Sector 1: Education");
assert(footerContent.includes("Women Empowerment") && footerContent.includes("Tailoring"), "Footer lists Sector 2: Women Empowerment");
assert(footerContent.includes("Safe Water") && footerContent.includes("Jal Seva"), "Footer lists Sector 3: Safe Water");
assert(footerContent.includes("Food Security") && footerContent.includes("Jan Ahar"), "Footer lists Sector 4: Food Security");
assert(footerContent.includes("Community Welfare"), "Footer lists Sector 5: Community Welfare");
assert(footerContent.includes("Himansu Nayak (HN)"), "Footer includes developer credit to /about#developer-credit");
assert(footerContent.includes("/privacy"), "Footer links to /privacy");
assert(footerContent.includes("/terms"), "Footer links to /terms");
assert(footerContent.includes("/accessibility"), "Footer links to /accessibility");
assert(footerContent.includes("min-h-[44px]"), "Footer primary actions meet 44px touch target requirement");
assert(!footerContent.includes("#0A192F"), "Footer does not contain prohibited navy #0A192F");
assert(!footerContent.includes("#D97706"), "Footer does not contain non-brand orange/amber #D97706");

// 5. Verify Programme & Developer Credit Anchors
const devCreditContent = fs.readFileSync("src/components/DeveloperCreditCard.tsx", "utf8");
assert(devCreditContent.includes('id="developer-credit"'), "DeveloperCreditCard has id='developer-credit' for anchor resolution");

const progContent = fs.readFileSync("src/app/programmes/page.tsx", "utf8");
assert(progContent.includes('id={pillar.id}'), "Programmes page assigns id to pillar cards for anchor navigation");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
