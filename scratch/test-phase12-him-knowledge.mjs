import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const rootDir = process.cwd();
const chunksPath = path.join(rootDir, "mect-ai-engine", "mect_knowledge_chunks.json");

console.log("--- PHASE 12: HIM AI KNOWLEDGE INGESTION TEST SUITE ---");

// Test 1: File existence and JSON parse
assert.ok(fs.existsSync(chunksPath), "mect_knowledge_chunks.json must exist");
const raw = fs.readFileSync(chunksPath, "utf8");
const chunks = JSON.parse(raw);
assert.ok(Array.isArray(chunks) && chunks.length >= 20, "Must contain at least 20 chunks");
console.log(`✓ Test 1: Ingestion output exists with ${chunks.length} chunks`);

// Test 2: Multilingual coverage
const languages = new Set(chunks.map((c) => c.language));
assert.ok(languages.has("en"), "Must contain English chunks");
assert.ok(languages.has("or"), "Must contain Odia chunks");
assert.ok(languages.has("hi"), "Must contain Hindi chunks");
console.log("✓ Test 2: Verified English, Odia, and Hindi coverage");

// Test 3: Ground Truth Verification in English Chunks
const allContent = chunks.map((c) => c.content).join("\n");
assert.ok(allContent.includes("40311302194"), "Must contain Deed No. 40311302194");
assert.ok(allContent.includes("Japabandhu Kampa"), "Must contain Managing Trustee Er. Japabandhu Kampa");
assert.ok(allContent.includes("AADTM5474FF20241"), "Must contain 80G URN AADTM5474FF20241");
assert.ok(allContent.includes("AADTM5474FE20231"), "Must contain 12A URN AADTM5474FE20231");
assert.ok(allContent.includes("CSR00081063"), "Must contain MCA CSR-1 CSR00081063");
assert.ok(allContent.includes("381002010014021"), "Must contain Union Bank Account Number 381002010014021");
assert.ok(allContent.includes("UBIN0538108"), "Must contain IFSC UBIN0538108");
console.log("✓ Test 3: Verified 2013 registered deed, trustees, 80G, CSR-1, and bank credentials in knowledge base");

// Test 4: Cryptographic SHA-256 Provenance Hashes
for (const chunk of chunks) {
  const calculatedHash = crypto.createHash("sha256").update(chunk.content).digest("hex");
  assert.strictEqual(chunk.sha256, calculatedHash, `Chunk ${chunk.id} SHA-256 hash mismatch`);
  assert.strictEqual(chunk.verification_status, "APPROVED_BY_SECRETARIAT", `Chunk ${chunk.id} must be APPROVED`);
}
console.log("✓ Test 4: Verified 100% cryptographic SHA-256 provenance integrity across all chunks");

console.log("--- ALL PHASE 12 HIM KNOWLEDGE TESTS PASSED (4/4) ---");
