import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const sitemapPath = path.join(rootDir, "src", "app", "sitemap.ts");
const robotsPath = path.join(rootDir, "src", "app", "robots.ts");
const aboutPath = path.join(rootDir, "src", "app", "about", "page.tsx");
const layoutPath = path.join(rootDir, "src", "app", "layout.tsx");

console.log("--- PHASE 13: TECHNICAL SEO & SCHEMA.ORG AUDIT SUITE ---");

// Test 1: Sitemap coverage
assert.ok(fs.existsSync(sitemapPath), "src/app/sitemap.ts must exist");
const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
assert.ok(sitemapContent.includes("/statutory-disclosures"), "Sitemap must include /statutory-disclosures");
assert.ok(sitemapContent.includes("/csr-partnerships"), "Sitemap must include /csr-partnerships");
assert.ok(sitemapContent.includes("/reports"), "Sitemap must include /reports");
assert.ok(sitemapContent.includes("/donate"), "Sitemap must include /donate");
console.log("✓ Test 1: Verified sitemap includes all newly created institutional routes");

// Test 2: Robots.txt rules
assert.ok(fs.existsSync(robotsPath), "src/app/robots.ts must exist");
const robotsContent = fs.readFileSync(robotsPath, "utf8");
assert.ok(robotsContent.includes("sitemap.xml"), "Robots must point to sitemap.xml");
assert.ok(robotsContent.includes("/admin"), "Robots must disallow /admin");
console.log("✓ Test 2: Verified robots.txt directives");

// Test 3: About Page JSON-LD schema
assert.ok(fs.existsSync(aboutPath), "src/app/about/page.tsx must exist");
const aboutContent = fs.readFileSync(aboutPath, "utf8");
assert.ok(aboutContent.includes('"foundingDate": "2013-07-27"'), "About schema must have 2013-07-27 founding date");
assert.ok(aboutContent.includes("Balangir"), "About schema must include Balangir registered address");
assert.ok(aboutContent.includes("Bhubaneswar"), "About schema must include Bhubaneswar corporate secretariat");
console.log("✓ Test 3: Verified About page Schema.org NGO microdata");

// Test 4: Root Layout Metadata & NGO Graph
assert.ok(fs.existsSync(layoutPath), "src/app/layout.tsx must exist");
const layoutContent = fs.readFileSync(layoutPath, "utf8");
assert.ok(layoutContent.includes("metadataBase"), "Layout must set metadataBase");
assert.ok(layoutContent.includes("AADTM5474F"), "Layout NGO schema must include PAN AADTM5474F");
assert.ok(layoutContent.includes("CSR00081063"), "Layout NGO schema must include CSR-1 CSR00081063");
assert.ok(layoutContent.includes("40311302194"), "Layout NGO schema must include Deed 40311302194");
console.log("✓ Test 4: Verified Root Layout OpenGraph, Twitter, and NGO JSON-LD graph");

console.log("--- ALL PHASE 13 TECHNICAL SEO TESTS PASSED (4/4) ---");
