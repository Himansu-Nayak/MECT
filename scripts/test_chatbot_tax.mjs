import fs from "fs";
import path from "path";

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

const QUESTIONS = [
  "Is my donation 80G eligible?",
  "Will I get a tax receipt?",
  "How much tax will I save?",
  "Is the trust registered?",
  "Can I pay by card?",
];

async function testChatbot() {
  console.log("=== 1. CHATBOT STATUTORY & NEUTRALITY AUDIT ===");
  const results = [];

  for (const q of QUESTIONS) {
    console.log(`\nQuestion: "${q}"`);
    const res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message: q,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Chat API error for question "${q}": HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply = data.reply || "";
    console.log(`Reply: "${reply}"`);

    // Verify neutral wording and NO gateway/card promotion
    const lower = reply.toLowerCase();
    const mentionsGateway = lower.includes("cashfree") || lower.includes("pay via credit") || lower.includes("pay via debit") || lower.includes("secure online checkout");
    const mentionsCardAccepted = lower.includes("accept credit card") || lower.includes("accept debit card");
    
    if (mentionsGateway || mentionsCardAccepted) {
      throw new Error(`Chatbot reply improperly mentioned online payment gateway or card acceptance!`);
    }

    results.push({
      question: q,
      reply: reply.trim(),
    });
  }

  return results;
}

async function scanRenderedTaxWording() {
  console.log("\n=== 2. TAX WORDING CLASSIFICATION SCAN ===");
  // Scan source files for rendered pages & components
  const searchDirs = ["src/app", "src/components", "src/lib"];
  const targetRegex = /\b(80G|80-G|tax exemption|tax benefit|tax deduct|deduction|exempt)\b/i;
  
  const hits = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && (ent.name.endsWith(".tsx") || ent.name.endsWith(".ts"))) {
        const content = fs.readFileSync(full, "utf8");
        const lines = content.split("\n");
        lines.forEach((line, idx) => {
          if (targetRegex.test(line)) {
            const rel = path.relative(process.cwd(), full).replace(/\\/g, "/");
            const trimmed = line.trim();
            // Filter comments or type definitions that are non-rendered
            if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;

            // Classify:
            // (a) factual historical order on statutory/about/reports pages
            // (b) promotional or forward-looking claim
            let classification = "(a) Factual historical order / statutory disclosure";
            let reason = "Historical reference or neutral statutory note";

            const lower = trimmed.toLowerCase();
            if (
              lower.includes("50% tax deduction") ||
              lower.includes("100% tax exemption") ||
              lower.includes("instant 80g tax receipt") ||
              lower.includes("tax benefit") ||
              lower.includes("80g eligible")
            ) {
              classification = "(b) Promotional / forward-looking (FLAGGED)";
              reason = "Promotional claim requires neutral replacement";
            }

            hits.push({
              file: rel,
              line: idx + 1,
              text: trimmed.slice(0, 100),
              classification,
              reason,
            });
          }
        });
      }
    }
  }

  for (const d of searchDirs) {
    if (fs.existsSync(d)) walk(d);
  }

  console.log(`Scanned source tree: Found ${hits.length} tax wording occurrences.`);
  const promoHits = hits.filter((h) => h.classification.startsWith("(b)"));
  console.log(`Active promotional (b) hits remaining: ${promoHits.length}`);

  return { hits, promoHits };
}

async function main() {
  const chatResults = await testChatbot();
  const scanResults = await scanRenderedTaxWording();

  console.log("\n=======================================================");
  console.log("CHATBOT AUDIT EVIDENCE SUMMARY:");
  console.log("=======================================================");
  for (const item of chatResults) {
    console.log(`Q: ${item.question}`);
    console.log(`A: ${item.reply}\n`);
  }

  console.log("\n=======================================================");
  console.log(`TAX WORDING SCAN: ${scanResults.promoHits.length} promotional (b) hits remain.`);
  console.log("=======================================================");
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});
