import fs from "fs";
import path from "path";

console.log("=== RUNNING PHASE 1 INSTITUTIONAL LAYOUT & DESIGN SYSTEM AUDIT ===");

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

// 1. Audit TRUST_CONFIG in src/lib/config.ts
const configContent = fs.readFileSync("src/lib/config.ts", "utf8");
assert(configContent.includes("40311302194"), "Config contains registered Trust Deed No. 40311302194");
assert(configContent.includes("AADTM5474F"), "Config contains PAN AADTM5474F");
assert(configContent.includes("CSR00081063"), "Config contains MCA CSR-1 Reg CSR00081063");
assert(configContent.includes("AADTM5474FE20231"), "Config contains Section 12A URN AADTM5474FE20231");
assert(configContent.includes("AADTM5474FF20241"), "Config contains Section 80G URN AADTM5474FF20241");
assert(configContent.includes("OR/2024/0466491"), "Config contains NITI Aayog NGO Darpan ID OR/2024/0466491");
assert(configContent.includes("Er. Japabandhu Kampa"), "Config contains Settler Founder Er. Japabandhu Kampa");
assert(configContent.includes("State Bank of India") && configContent.includes("33341302498") && configContent.includes("SBIN0001701"), "Config contains supplied State Bank of India donation account details");
assert(!configContent.includes("Yudhisthir Rana") && !configContent.includes("Ramachandra Biswal") && !configContent.includes("Sambit Kumar Dang"), "Config removes other life trustees as instructed");
assert(configContent.includes("Balangir"), "Config contains Balangir registered office");
assert(configContent.includes("Bhubaneswar"), "Config contains Bhubaneswar corporate liaison office");

// 2. Audit StatutoryTicker.tsx
const tickerContent = fs.readFileSync("src/components/layout/StatutoryTicker.tsx", "utf8");
assert(tickerContent.includes("animate-marquee"), "StatutoryTicker includes smooth marquee ticker");
assert(tickerContent.includes("section80GUrn"), "StatutoryTicker references Section 80G URN");
assert(tickerContent.includes("ngoDarpanId"), "StatutoryTicker references NGO Darpan ID");
assert(!tickerContent.includes("MCA CSR-1"), "StatutoryTicker removes MCA mentions from public bar");

// 3. Audit Header.tsx
const headerContent = fs.readFileSync("src/components/Header.tsx", "utf8");
assert(headerContent.includes("StatutoryTicker"), "Header includes StatutoryTicker component");
assert(headerContent.includes("mect-official-emblem.png"), "Header renders official MECT emblem image");
assert(headerContent.includes("Mahaveer Educational &amp; Charitable Trust") || headerContent.includes("Mahaveer Educational & Charitable Trust"), "Header includes registered trust name");
assert(!headerContent.includes("Est. 2013"), "Header does not include Est. 2013 text");
assert(headerContent.includes("/donate"), "Header includes direct Donate action");
assert(headerContent.includes("mobileMenuOpen"), "Header includes responsive mobile drawer");

// 4. Audit Footer.tsx
const footerContent = fs.readFileSync("src/components/Footer.tsx", "utf8");
assert(footerContent.includes("mect-official-emblem.png"), "Footer renders consistent official MECT emblem image");
assert(footerContent.includes("TRUST_CONFIG.statutory") || footerContent.includes("40311302194"), "Footer lists registered Trust Deed number");
assert(footerContent.includes("Section 80G"), "Footer highlights historical Section 80G status");
assert(footerContent.includes("TRUST_CONFIG.bank.ifsc"), "Footer references SBI IFSC code from TRUST_CONFIG");
assert(!footerContent.includes("MCA CSR-1"), "Footer removes MCA CSR-1 mentions");
assert(footerContent.includes("Himansu Nayak (HN)"), "Footer includes Developer credit link to /about#developer-credit");
assert(footerContent.includes("registeredOffice"), "Footer references Balangir registered office from TRUST_CONFIG");

// 5. Audit QuickActionDock.tsx
const dockContent = fs.readFileSync("src/components/QuickActionDock.tsx", "utf8");
assert(dockContent.includes("/donate"), "QuickActionDock links to /donate");
assert(dockContent.includes("/csr-partnerships"), "QuickActionDock links to /csr-partnerships");
assert(dockContent.includes("/statutory-disclosures"), "QuickActionDock links to /statutory-disclosures");
assert(dockContent.includes("/volunteer"), "QuickActionDock links to /volunteer");

// 6. Audit layout.tsx
const layoutContent = fs.readFileSync("src/app/layout.tsx", "utf8");
assert(layoutContent.includes("CSR00081063"), "RootLayout JSON-LD includes MCA CSR-1 registration");
assert(layoutContent.includes("AADTM5474FF20241"), "RootLayout JSON-LD includes Section 80G URN");
assert(layoutContent.includes("Er. Japabandhu Kampa"), "RootLayout JSON-LD identifies Managing Trustee");

// 7. Audit globals.css
const cssContent = fs.readFileSync("src/app/globals.css", "utf8");
assert(cssContent.includes("--color-primary: #A45E44") && cssContent.includes("--color-forest: #283730"), "globals.css contains Primary Terracotta (#A45E44) and Forest Charcoal (#283730) tokens");
assert(cssContent.includes("--color-sand: #E5C499") && cssContent.includes("--color-cream: #F3E4D2"), "globals.css contains Warm Sand (#E5C499) and Warm Cream (#F3E4D2) tokens");
assert(cssContent.includes("skip-to-content"), "globals.css contains WCAG 2.2 AA skip link styling");

console.log(`\nTEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) {
  process.exit(1);
}
