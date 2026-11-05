/**
 * MAHAVIR TRUST - Authoritative Multilingual Knowledge Ingestion & Chunking Pipeline
 * 
 * Extracts verified institutional charter documents in English, Odia, and Hindi,
 * generates SHA-256 cryptographic provenance hashes, creates structure-aware
 * semantic chunks with language metadata, and formats them for hybrid vector retrieval.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, "knowledge_docs");
const OUTPUT_FILE = path.join(__dirname, "mect_knowledge_chunks.json");

console.log("==================================================================");
console.log("MAHAVIR TRUST (MECT) — Multilingual Knowledge Ingestion Engine");
console.log("==================================================================");

if (!fs.existsSync(DOCS_DIR)) {
  console.error(`Error: Documents directory ${DOCS_DIR} not found.`);
  process.exit(1);
}

const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".txt"));
console.log(`Discovered ${files.length} authoritative document(s):`, files);

const chunks = [];

for (const file of files) {
  const filePath = path.join(DOCS_DIR, file);
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const fileHash = crypto.createHash("sha256").update(rawContent).digest("hex");

  // Language detection from filename convention or metadata
  let lang = "en";
  if (file.includes("_or") || file.endsWith(".or.md")) {
    lang = "or";
  } else if (file.includes("_hi") || file.endsWith(".hi.md")) {
    lang = "hi";
  }

  const statusMatch = rawContent.match(/\*\*Status:\*\*\s*`?([A-Za-z0-9_]+)`?/i) ||
                      rawContent.match(/\*\*ସ୍ଥିତି.*?:\*\*\s*`?([A-Za-z0-9_]+)`?/i) ||
                      rawContent.match(/\*\*स्थिति.*?:\*\*\s*`?([A-Za-z0-9_]+)`?/i);
  const verificationStatus = statusMatch ? statusMatch[1].trim() : (lang === "en" ? "APPROVED_BY_SECRETARIAT" : "DRAFT_TRANSLATION_PENDING_TRUSTEE_REVIEW");

  console.log(`\nProcessing: ${file} [lang: ${lang}, status: ${verificationStatus}]`);
  console.log(`SHA-256 Checksum: ${fileHash}`);

  // Split into sections by Markdown headings
  const sections = rawContent.split(/\n(?=###?\s+SECTION|\n###?\s+)/g);

  let docTitle = "MECT Institutional Charter";
  const titleMatch = rawContent.match(/^#\s+(.*)/m);
  if (titleMatch) {
    docTitle = titleMatch[1].trim();
  }

  let chunkSeq = 1;
  for (const sec of sections) {
    const trimmed = sec.trim();
    if (!trimmed || trimmed.length < 50) continue;

    let sectionTitle = "General Guidelines";
    const headerMatch = trimmed.match(/^###?\s+(.*)/m);
    if (headerMatch) {
      sectionTitle = headerMatch[1].replace(/^[#\s]+/, "").trim();
    }

    const chunkId = `${path.basename(file, path.extname(file))}-chk-${chunkSeq++}`;
    const chunkHash = crypto.createHash("sha256").update(trimmed).digest("hex");

    chunks.push({
      id: chunkId,
      doc_id: file,
      doc_title: docTitle,
      language: lang,
      section: sectionTitle,
      content: trimmed,
      sha256: chunkHash,
      parent_doc_sha256: fileHash,
      verification_status: verificationStatus,
      citation: `[Doc: ${docTitle} — ${sectionTitle}]`,
      char_count: trimmed.length,
      estimated_tokens: Math.ceil(trimmed.length / 4),
      ingested_at: new Date().toISOString()
    });
  }
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(chunks, null, 2), "utf-8");
console.log(`\nSuccessfully created ${chunks.length} multilingual semantic chunks!`);
console.log(`Output: ${OUTPUT_FILE}`);

console.log("\nChunk Inventory:");
chunks.forEach((c, idx) => {
  console.log(` [${idx + 1}] ID: ${c.id} [${c.language}] | Section: ${c.section} | Tokens: ~${c.estimated_tokens}`);
});
console.log("==================================================================");
