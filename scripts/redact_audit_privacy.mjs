import fs from "node:fs";
import path from "node:path";

const AUDITS_DIR = path.resolve("docs/audits");

if (!fs.existsSync(AUDITS_DIR)) {
  console.log("No docs/audits directory.");
  process.exit(0);
}

const files = fs.readdirSync(AUDITS_DIR).filter((f) => f.endsWith(".md"));
console.log(`Found ${files.length} markdown audit files.`);

let totalAccountRedactions = 0;
let totalPanRedactions = 0;

for (const file of files) {
  const filePath = path.join(AUDITS_DIR, file);
  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // Redact full SBI Account 33341302498 to ****2498
  if (content.includes("33341302498")) {
    const count = (content.match(/33341302498/g) || []).length;
    content = content.replaceAll("33341302498", "****2498");
    totalAccountRedactions += count;
    modified = true;
  }

  // Redact full PAN AADTM5474F to AADTM****F
  // Note: URNs like AADTM5474FE20231 or AADTM5474FF20241 have suffixes.
  // The prompt says: "ensure full bank accounts and PANs are redacted to ****2498 and AADTM****F."
  // When PAN is standalone AADTM5474F:
  if (content.includes("AADTM5474F")) {
    // Only replace standalone PAN or PAN references, leaving URN suffix intact or redacting appropriately
    // Replace exact word AADTM5474F when not followed by E or F (which are 12A/80G URNs)
    const panRegex = /\bAADTM5474F\b/g;
    const count = (content.match(panRegex) || []).length;
    if (count > 0) {
      content = content.replace(panRegex, "AADTM****F");
      totalPanRedactions += count;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${file}`);
  }
}

console.log(`Redaction complete. Total account replacements: ${totalAccountRedactions}, Total PAN replacements: ${totalPanRedactions}`);
