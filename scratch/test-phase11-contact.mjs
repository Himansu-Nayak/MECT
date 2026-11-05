import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const contactPagePath = path.join(rootDir, "src", "app", "contact", "page.tsx");

console.log("--- PHASE 11: INSTITUTIONAL CONTACT & REGIONAL HUBS TEST SUITE ---");

// Test 1: Verify file existence
assert.ok(fs.existsSync(contactPagePath), "src/app/contact/page.tsx must exist");
console.log("✓ Test 1: Contact page exists");

const content = fs.readFileSync(contactPagePath, "utf8");

// Test 2: Dual Office Architecture (Balangir & Bhubaneswar)
assert.ok(content.includes("Balangir Trust Office") || content.includes("registeredOffice"), "Must include Balangir registered office");
assert.ok(content.includes("Bhubaneswar Secretariat") || content.includes("corporateOffice"), "Must include Bhubaneswar secretariat");
assert.ok(content.includes("40311302194"), "Must reference registered Deed No. 40311302194");
console.log("✓ Test 2: Verified dual-office physical locations and deed jurisdiction");

// Test 3: Verified Phones & Official Emails
assert.ok(content.includes("officialEmails.general"), "Must reference general official email");
assert.ok(content.includes("officialEmails.grievance"), "Must reference grievance official email");
assert.ok(!content.includes("+91 671 234 5678"), "Must not contain placeholder Cuttack phone");
assert.ok(!content.includes("grievance@mahavirtrust.org"), "Must not contain fictitious domain email");
console.log("✓ Test 3: Verified authentic contact numbers and official email channels");

// Test 4: Form Submission & API Integration
assert.ok(content.includes("submitInquiry"), "Must integrate submitInquiry API");
assert.ok(content.includes("referenceId"), "Must present referenceId upon transmission");
console.log("✓ Test 4: Verified inquiry form logging and reference tracking");

// Test 5: Three-Tier Grievance Redressal Architecture
assert.ok(content.includes("Tier 1: Secretariat"), "Must include Tier 1 Secretariat SLA");
assert.ok(content.includes("Tier 2: Ombudsman"), "Must include Tier 2 Ombudsman SLA");
assert.ok(content.includes("Tier 3: Board"), "Must include Tier 3 Board Review");
console.log("✓ Test 5: Verified three-tier grievance redressal framework");

// Test 6: Anti-Fraud Notice & Institutional Styling
assert.ok(content.includes("Zero-Tolerance Policy for Intermediaries & Fees"), "Must include anti-fraud declaration");
assert.ok(content.includes("#0A192F"), "Must use Presidential Navy #0A192F");
assert.ok(!content.includes("#0B3B24"), "Must not use legacy green #0B3B24");
console.log("✓ Test 6: Verified anti-fraud notice and institutional color palette");

console.log("--- ALL PHASE 11 CONTACT TESTS PASSED (6/6) ---");
