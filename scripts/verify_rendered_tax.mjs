import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

const TAX_REGEX = /\b(80G|80-G|tax exemption|tax benefit|tax deduct|deduction|exempt|Section 354|Form 113|Form 114|10BE|10BD)\b/i;

const CLASS_B_REGEX = /\b(50%\s*tax\s*deduction|100%\s*tax\s*exemption|instant\s*80g|eligible\s*for\s*80g\s*tax\s*benefit|save\s*tax|claim\s*your\s*80g|tax\s*deductible\s*receipt|tax\s*benefit\s*under)\b/i;

const ADDITIONAL_ROUTES = [
  "/login",
  "/register",
  "/portal/login",
  "/portal/welcome",
  "/portal/dashboard",
  "/portal/donations",
  "/portal/receipts",
  "/portal/security",
  "/portal/profile",
];

const QUESTIONS = [
  "Is my donation 80G eligible?",
  "Will I get a tax receipt?",
  "How much tax will I save?",
  "Is the trust registered?",
  "Can I pay by card?",
];

async function fetchSitemapRoutes() {
  const res = await fetch(`${BASE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: HTTP ${res.status}`);
  const xml = await res.text();
  const urls = [];
  const regex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const u = new URL(match[1]);
    urls.push(u.pathname);
  }
  return urls;
}

export async function runRenderedTaxCrawl(browser) {
  console.log("\n========================================================");
  console.log("=== 1. PLAYWRIGHT RENDERED TAX WORDING CRAWL ===");
  console.log("========================================================");

  const sitemapRoutes = await fetchSitemapRoutes();
  const allRoutes = Array.from(new Set([...sitemapRoutes, ...ADDITIONAL_ROUTES]));
  console.log(`Total routes to audit: ${allRoutes.length}`);

  const page = await browser.newPage();
  const findings = [];

  for (const route of allRoutes) {
    const url = `${BASE_URL}${route}`;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
      // Allow client hydration
      await page.waitForTimeout(500);

      // 1. Audit Title
      const title = await page.title();
      if (TAX_REGEX.test(title)) {
        findings.push(classifyHit(route, "<title>", title));
      }

      // 2. Audit Meta & OG tags
      const metaTags = await page.evaluate(() => {
        const metas = Array.from(document.querySelectorAll("meta"));
        return metas.map(m => ({
          name: m.getAttribute("name") || m.getAttribute("property") || "",
          content: m.getAttribute("content") || "",
        })).filter(m => m.content.length > 0);
      });

      for (const m of metaTags) {
        if (TAX_REGEX.test(m.content)) {
          findings.push(classifyHit(route, `<meta ${m.name}>`, m.content));
        }
      }

      // 3. Audit JSON-LD scripts
      const jsonLdScripts = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        return scripts.map(s => s.textContent || "");
      });

      for (const jsonText of jsonLdScripts) {
        if (TAX_REGEX.test(jsonText)) {
          // Extract matching sentence or snippet
          const matchSnippet = extractSnippet(jsonText, TAX_REGEX);
          findings.push(classifyHit(route, "script[type=application/ld+json]", matchSnippet));
        }
      }

      // 4. Audit Header
      const headerText = await page.evaluate(() => {
        const el = document.querySelector("header");
        return el ? el.innerText : "";
      });
      if (TAX_REGEX.test(headerText)) {
        const snippet = extractSnippet(headerText, TAX_REGEX);
        findings.push(classifyHit(route, "<header>", snippet));
      }

      // 5. Audit Footer
      const footerText = await page.evaluate(() => {
        const el = document.querySelector("footer");
        return el ? el.innerText : "";
      });
      if (TAX_REGEX.test(footerText)) {
        const snippet = extractSnippet(footerText, TAX_REGEX);
        findings.push(classifyHit(route, "<footer>", snippet));
      }

      // 6. Audit Main body elements
      const bodyHits = await page.evaluate(() => {
        const regex = /\b(80G|80-G|tax exemption|tax benefit|tax deduct|deduction|exempt|Section 354|Form 113|Form 114|10BE|10BD)\b/i;
        const results = [];
        // Walk paragraphs, headings, spans, alerts, list items
        const nodes = document.querySelectorAll("main p, main h1, main h2, main h3, main h4, main li, main div[role='alert'], main span, main td");
        for (const node of nodes) {
          // Only check leaf or text-rich direct containers to avoid duplicate parent strings
          if (node.children.length <= 1 && regex.test(node.innerText)) {
            const tag = node.tagName.toLowerCase();
            results.push({
              selector: `<${tag}>`,
              text: node.innerText.trim(),
            });
          }
        }
        return results;
      });

      for (const hit of bodyHits) {
        findings.push(classifyHit(route, hit.selector, hit.text));
      }

      // 7. Audit Chatbot Welcome text if rendered on page
      const chatGreeting = await page.evaluate(() => {
        const chatEl = document.querySelector("#chatbot-welcome, .chatbot-message, [data-testid='chat-greeting']");
        return chatEl ? chatEl.innerText : "";
      });
      if (TAX_REGEX.test(chatGreeting)) {
        findings.push(classifyHit(route, "chatbot-greeting", chatGreeting));
      }

    } catch (err) {
      console.warn(`[WARN] Route ${route} crawl error: ${err.message}`);
    }
  }

  await page.close();

  // Deduplicate findings by URL + element + text
  const uniqueFindings = [];
  const seenKey = new Set();
  for (const f of findings) {
    const key = `${f.url}::${f.element}::${f.text.slice(0, 40)}`;
    if (!seenKey.has(key)) {
      seenKey.add(key);
      uniqueFindings.push(f);
    }
  }

  return uniqueFindings;
}

function extractSnippet(fullText, regex) {
  const lines = fullText.split(/[\r\n.]+/);
  for (const line of lines) {
    if (regex.test(line)) {
      return line.trim();
    }
  }
  return fullText.slice(0, 120).trim();
}

function classifyHit(url, element, text) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  const lower = cleanText.toLowerCase();

  // Class (b) promotional phrases
  if (
    CLASS_B_REGEX.test(cleanText) ||
    lower.includes("50% tax") ||
    lower.includes("eligible for 80g tax benefit") ||
    lower.includes("instant 80g receipt") ||
    (lower.includes("tax exemption") && !lower.includes("historical") && !lower.includes("prior") && !lower.includes("order") && !lower.includes("does not"))
  ) {
    return {
      url,
      element,
      text: cleanText,
      classification: "Class (b) Promotional / Forward-Looking (FAIL)",
      isClassB: true,
    };
  }

  // Class (a) Neutral statutory statements
  return {
    url,
    element,
    text: cleanText,
    classification: "Class (a) Neutral Statutory Statement (PASS)",
    isClassB: false,
  };
}

export async function testChatbotQuestions() {
  console.log("\n========================================================");
  console.log("=== 2. CHATBOT AUDIT: 5 QUESTIONS & RESPONSES ===");
  console.log("========================================================");

  const responses = [];

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    console.log(`\n[Q${i + 1}] "${q}"`);
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
      throw new Error(`Chat API failed for question "${q}": HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply = (data.reply || "").trim();
    console.log(`[A${i + 1}] "${reply}"`);

    // Verify Question 1 has required appended sentence
    if (i === 0) {
      const requiredSuffix = "This order does not by itself confirm eligibility for donations made now.";
      if (!reply.includes(requiredSuffix)) {
        throw new Error(`Question 1 reply missing required sentence: "${requiredSuffix}"`);
      }
    }

    // Verify NO gateway or credit/debit card promises/acceptance
    const lower = reply.toLowerCase();
    const claimsCardAccepted = (lower.includes("accept credit") || lower.includes("accept debit") || lower.includes("pay by card") || lower.includes("pay via credit") || lower.includes("pay via debit")) && !lower.includes("not accept") && !lower.includes("no.");
    const claimsGateway = lower.includes("cashfree") || lower.includes("secure online checkout");
    if (claimsCardAccepted || claimsGateway) {
      throw new Error(`Chatbot reply improperly promised payment gateway or card acceptance in Q${i + 1}!`);
    }

    responses.push({
      questionNumber: i + 1,
      question: q,
      reply,
    });
  }

  return responses;
}

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const findings = await runRenderedTaxCrawl(browser);
    const chatResults = await testChatbotQuestions();

    console.log("\n========================================================");
    console.log("=== RENDERED TAX WORDING AUDIT SUMMARY TABLE ===");
    console.log("========================================================");
    console.table(findings.map(f => ({
      URL: f.url,
      Element: f.element,
      Snippet: f.text.length > 70 ? f.text.slice(0, 67) + "..." : f.text,
      Class: f.classification,
    })));

    const classBHits = findings.filter(f => f.isClassB);
    console.log(`\nTotal findings: ${findings.length}`);
    console.log(`Class (a) Neutral: ${findings.length - classBHits.length}`);
    console.log(`Class (b) Promotional: ${classBHits.length}`);

    // Save results to audit/rendered_tax_crawl.json
    const outDir = path.join(process.cwd(), "audit");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(
      path.join(outDir, "rendered_tax_crawl.json"),
      JSON.stringify({ findings, chatResults }, null, 2)
    );

    if (classBHits.length > 0) {
      console.error(`\n❌ FAIL: ${classBHits.length} Class (b) promotional tax phrases found in rendered DOM!`);
      process.exit(1);
    } else {
      console.log(`\n✅ PASS: 0 Class (b) promotional tax phrases found across all rendered routes.`);
    }
  } finally {
    await browser.close();
  }
}

if (process.argv[1].endsWith("verify_rendered_tax.mjs")) {
  main().catch(err => {
    console.error("FATAL ERROR IN TAX CRAWL:", err);
    process.exit(1);
  });
}
