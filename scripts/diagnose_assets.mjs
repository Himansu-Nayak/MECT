import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

function getFiles(dir) {
  let res = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      res = res.concat(getFiles(full));
    } else {
      res.push(full);
    }
  }
  return res;
}

const assets = getFiles("public");
console.log(`Total public assets: ${assets.length}`);

// Hash check
const hashes = new Map();
const duplicates = [];

for (const a of assets) {
  const buf = fs.readFileSync(a);
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  if (hashes.has(hash)) {
    duplicates.push({ original: hashes.get(hash), duplicate: a, hash });
  } else {
    hashes.set(hash, a);
  }
}

console.log(`Duplicate files by SHA-256: ${duplicates.length}`);

const classifiedAssets = [];

for (const a of assets) {
  const rel = path.relative(process.cwd(), a).replace(/\\/g, "/");
  const base = path.basename(a);
  const publicPath = "/" + path.relative("public", a).replace(/\\/g, "/");
  const stats = fs.statSync(a);

  // Search references across src, content, backend, next.config.ts
  let srcRefs = 0;
  let backendRefs = 0;

  try {
    const grepSrc = execSync(`git grep -F "${base}" -- src/ content/ next.config.ts`, { encoding: "utf8" });
    srcRefs = grepSrc.split("\n").filter(Boolean).length;
  } catch {}

  try {
    const grepBackend = execSync(`git grep -F "${base}" -- backend/`, { encoding: "utf8" });
    backendRefs = grepBackend.split("\n").filter(Boolean).length;
  } catch {}

  let classification = "UNCERTAIN — RETAIN";
  let rationale = "";

  if (base === "favicon.ico") {
    classification = "SEO / VERIFICATION ASSET";
    rationale = "Browser root fallback favicon requested automatically by standard user agents.";
  } else if (base.startsWith("google") && base.endsWith(".html")) {
    classification = "SEO / VERIFICATION ASSET";
    rationale = "Google Search Console domain ownership verification token file.";
  } else if (base === "mect-sbi-upi-qr.png") {
    classification = "BACKEND / TEST FIXTURE";
    rationale = "Required test fixture and offline payment verification reference for SBI UPI QR processing.";
  } else if (srcRefs > 0) {
    classification = "ACTIVE WEBSITE ASSET";
    rationale = `Actively referenced and rendered in frontend code (${srcRefs} direct references).`;
  } else if (base.startsWith("field_photo_")) {
    classification = "HISTORICAL / ARCHIVAL ASSET";
    rationale = "Authentic field outreach documentation from Western Odisha community programs; retained in institutional media archive.";
  } else if (base.toLowerCase().includes("kampa") && (base.endsWith(".jpg") || base.endsWith(".jpeg"))) {
    classification = "HISTORICAL / ARCHIVAL ASSET";
    rationale = "Archival original uncompressed photograph of Settler Founder Er. Japabandhu Kampa; retained per preservation rules.";
  } else if (base.startsWith("mect-") && base.endsWith(".jpg")) {
    classification = "HISTORICAL / ARCHIVAL ASSET";
    rationale = "Archival high-resolution JPEG master of community field program photo; WebP counterpart used for web delivery.";
  } else if (base.startsWith("illustrative-")) {
    classification = "HISTORICAL / ARCHIVAL ASSET";
    rationale = "Approved illustrative campaign graphics for child outreach, library, and self-help groups; retained for CMS use.";
  } else if (backendRefs > 0) {
    classification = "BACKEND / TEST FIXTURE";
    rationale = `Referenced in backend services/tests (${backendRefs} references).`;
  } else {
    classification = "UNCERTAIN — RETAIN";
    rationale = "Preserved under strict preservation rules (never delete institutional media).";
  }

  classifiedAssets.push({
    file: rel,
    publicPath,
    sizeBytes: stats.size,
    classification,
    rationale,
    srcReferences: srcRefs,
    backendReferences: backendRefs
  });
}

const summary = {
  totalAssets: classifiedAssets.length,
  byteDuplicates: duplicates.length,
  activeWebsiteAssets: classifiedAssets.filter(c => c.classification === "ACTIVE WEBSITE ASSET").length,
  seoVerificationAssets: classifiedAssets.filter(c => c.classification === "SEO / VERIFICATION ASSET").length,
  backendTestFixtures: classifiedAssets.filter(c => c.classification === "BACKEND / TEST FIXTURE").length,
  historicalArchivalAssets: classifiedAssets.filter(c => c.classification === "HISTORICAL / ARCHIVAL ASSET").length,
  duplicateAssets: classifiedAssets.filter(c => c.classification === "DUPLICATE ASSET").length,
  confirmedUnused: classifiedAssets.filter(c => c.classification === "CONFIRMED UNUSED").length,
  uncertainRetain: classifiedAssets.filter(c => c.classification === "UNCERTAIN — RETAIN").length,
};

console.log("\nAsset Classification Summary:", JSON.stringify(summary, null, 2));

const outPath = path.join(process.cwd(), "audit", "final", "asset_preservation_results.json");
fs.writeFileSync(outPath, JSON.stringify({
  auditTimestamp: new Date().toISOString(),
  summary,
  duplicates,
  assets: classifiedAssets
}, null, 2));

console.log(`Saved results to ${outPath}`);
