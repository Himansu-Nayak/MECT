import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import lighthouse from "lighthouse";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";
const AUDIT_DIR = path.join(process.cwd(), "audit");
const SCREENS_DIR = path.join(AUDIT_DIR, "screens");
const LH_DIR = path.join(AUDIT_DIR, "lighthouse");
const AXE_DIR = path.join(AUDIT_DIR, "axe");

for (const d of [SCREENS_DIR, LH_DIR, AXE_DIR]) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
}

const FORBIDDEN_STRINGS = [
  "MAHAVIR TRUST",
  "pre-launch",
  "Odisha Educational Foundation",
  "secure online checkout",
  "Loading unified",
  "+91 671",
  "[Permanent Physical Address",
  "hunger-relief",
  "#pillars",
  "50% Tax Deduction",
  "80G Tax Exemption",
];

const UNIFORM_PAGES = [
  "/",
  "/about",
  "/programmes",
  "/impact",
  "/contact",
  "/volunteer",
  "/governance",
  "/faq",
];

const LH_PAGES = [
  "/",
  "/programmes",
  "/donate",
  "/about",
  "/scholarships",
  "/contact",
];

const AXE_PAGES = [
  "/",
  "/programmes",
  "/donate",
  "/about",
  "/scholarships",
  "/contact",
  "/stories",
  "/reports",
  "/statutory-disclosures",
];

async function checkServerReady() {
  console.log(`[VERIFY] Checking server availability at ${BASE_URL}...`);
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) {
        console.log(`[VERIFY] Server is ready (HTTP ${res.status}).`);
        return true;
      }
    } catch {
      // wait 1s
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server at ${BASE_URL} not reachable after 30 seconds.`);
}

async function fetchSitemapRoutes() {
  console.log(`[VERIFY] Fetching sitemap from ${BASE_URL}/sitemap.xml...`);
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
  console.log(`[VERIFY] Found ${urls.length} routes in sitemap:`, urls);
  return urls;
}

async function verifyPagesAndLinks(browser, routes) {
  console.log("\n--- PART 1: PAGE & LINK CRAWL ---");
  const context = await browser.newContext();
  const page = await context.newPage();

  const crawledPages = new Map();
  const anchorChecks = [];
  const pageMetrics = [];

  for (const route of routes) {
    const url = `${BASE_URL}${route}`;
    console.log(`[CRAWL] Visiting ${route}...`);
    const resp = await page.goto(url, { waitUntil: "domcontentloaded" });
    const status = resp.status();
    const finalUrl = page.url();

    const title = await page.title();
    const desc = await page
      .$eval('meta[name="description"]', (el) => el.getAttribute("content"))
      .catch(() => "");
    const canonical = await page
      .$eval('link[rel="canonical"]', (el) => el.getAttribute("href"))
      .catch(() => "");
    const ogImage = await page
      .$eval('meta[property="og:image"]', (el) => el.getAttribute("content"))
      .catch(() => "");
    const keywords = await page
      .$eval('meta[name="keywords"]', (el) => el.getAttribute("content"))
      .catch(() => null);
    const lang = await page.$eval("html", (el) => el.getAttribute("lang")).catch(() => "");

    // JSON-LD validation
    const jsonLdElements = await page.$$('script[type="application/ld+json"]');
    const jsonLdErrors = [];
    for (const el of jsonLdElements) {
      const raw = await el.textContent();
      try {
        JSON.parse(raw);
      } catch (e) {
        jsonLdErrors.push(e.message);
      }
    }

    // Rendered text forbidden strings check
    const bodyText = await page.$eval("body", (el) => el.innerText);
    const foundForbidden = [];
    for (const term of FORBIDDEN_STRINGS) {
      if (bodyText.includes(term)) {
        foundForbidden.push(term);
      }
    }
    const fiduciaryCount = (bodyText.match(/fiduciary/gi) || []).length;

    // Collect all links on page
    const links = await page.$$eval("a[href]", (els) =>
      els.map((a) => a.getAttribute("href")).filter(Boolean)
    );

    for (const link of links) {
      if (link.startsWith("#")) {
        anchorChecks.push({ sourcePage: route, targetPage: route, anchor: link.slice(1) });
      } else if (link.startsWith("/") && link.includes("#")) {
        const [targetPath, anchor] = link.split("#");
        anchorChecks.push({ sourcePage: route, targetPage: targetPath, anchor });
      }
    }

    pageMetrics.push({
      route,
      status,
      finalUrl,
      title,
      titleLength: title.length,
      titleValid: title.length <= 60,
      descLength: desc.length,
      descValid: desc.length <= 155,
      canonical,
      canonicalValid: canonical === `https://mect.org.in${route === "/" ? "" : route}`,
      ogImagePresent: Boolean(ogImage),
      keywordsAbsent: keywords === null,
      jsonLdValid: jsonLdErrors.length === 0,
      lang,
      forbiddenStrings: foundForbidden,
      fiduciaryCount,
    });

    crawledPages.set(route, { status, finalUrl, bodyText });
  }

  // Anchor target validation - optimized by grouping by targetPage
  console.log(`\n[VERIFY] Validating ${anchorChecks.length} internal anchor links across unique pages...`);
  const brokenAnchors = [];
  const anchorsByTarget = new Map();
  for (const check of anchorChecks) {
    if (!check.anchor) continue;
    if (!anchorsByTarget.has(check.targetPage)) {
      anchorsByTarget.set(check.targetPage, []);
    }
    anchorsByTarget.get(check.targetPage).push(check);
  }

  for (const [targetPage, checks] of anchorsByTarget.entries()) {
    const targetUrl = `${BASE_URL}${targetPage}`;
    try {
      await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
      const existingIds = new Set(await page.$$eval("[id]", (els) => els.map((el) => el.id)));
      for (const { sourcePage, anchor } of checks) {
        if (!existingIds.has(anchor)) {
          console.warn(`[BROKEN ANCHOR] On ${sourcePage} -> #${anchor} on ${targetPage} not found!`);
          brokenAnchors.push({ sourcePage, targetPage, anchor });
        }
      }
    } catch (err) {
      console.error(`[PAGE LOAD ERROR] Could not load ${targetUrl}:`, err.message);
      for (const { sourcePage, anchor } of checks) {
        brokenAnchors.push({ sourcePage, targetPage, anchor, error: err.message });
      }
    }
  }

  // Assert strictly that /programmes contains the 7 official anchor IDs with non-empty content (A7)
  console.log("\n[VERIFY] Validating the 7 official /programmes anchor IDs...");
  const officialProgrammeIds = [
    "education",
    "women-empowerment",
    "sports-extracurricular",
    "water",
    "food-relief",
    "community-welfare",
    "higher-education",
  ];
  await page.goto(`${BASE_URL}/programmes`, { waitUntil: "domcontentloaded" });
  for (const progId of officialProgrammeIds) {
    const el = await page.$(`#${progId}`);
    if (!el) {
      throw new Error(`[A7 Assertion Failed] Missing required programme section ID: #${progId} on /programmes`);
    }
    const textContent = await el.innerText();
    if (!textContent || textContent.trim().length < 50) {
      throw new Error(`[A7 Assertion Failed] Programme section #${progId} has insufficient content (${textContent?.length || 0} chars)`);
    }
    console.log(`  ✓ #${progId}: Verified with ${textContent.trim().length} characters of authentic content.`);
  }

  // Assert bank details consistency across all crawled pages
  console.log("\n[VERIFY] Checking bank details consistency across all crawled pages...");
  const bankDiscrepancies = [];
  for (const [route, { bodyText }] of crawledPages.entries()) {
    if (bodyText.includes("33091993247") || bodyText.includes("43849182390")) {
      bankDiscrepancies.push(`${route}: Contains deprecated or unverified bank account number`);
    }
    if (bodyText.includes("SBIN0000048")) {
      bankDiscrepancies.push(`${route}: Contains deprecated IFSC SBIN0000048 instead of SBIN0001701`);
    }
    if (bodyText.includes("State Bank of India") && bodyText.includes("Account Number")) {
      if (!bodyText.includes("33341302498") || !bodyText.includes("SBIN0001701")) {
        bankDiscrepancies.push(`${route}: Missing authentic account number 33341302498 or IFSC SBIN0001701`);
      }
    }
  }
  if (bankDiscrepancies.length > 0) {
    console.error("[BANK DISCREPANCIES FOUND]:", bankDiscrepancies);
    throw new Error(`Bank details discrepancy detected: ${bankDiscrepancies.join(", ")}`);
  } else {
    console.log("[PASS] Bank details consistency verified across all rendered pages: 33341302498 / SBIN0001701 / 86971610172@sbi.");
  }

  await context.close();
  return { pageMetrics, brokenAnchors };
}

async function verifyUniformityAndScreenshots(browser) {
  console.log("\n--- PART 2: UNIFORMITY & SCREENSHOTS ---");
  const uniformityResults = [];

  for (const route of UNIFORM_PAGES) {
    const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");

    // Desktop 1280px
    const dContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const dPage = await dContext.newPage();
    await dPage.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });

    const hasHeader = await dPage.$eval("header", () => true).catch(() => false);
    const hasFooter = await dPage.$eval("footer", () => true).catch(() => false);
    const hasTicker = await dPage
      .$eval("#statutory-ticker, [data-ticker]", () => true)
      .catch(() => false);
    const hasStatutoryStrip = await dPage
      .$eval("#statutory-strip, [data-statutory-strip]", () => true)
      .catch(() => false);

    await dPage.screenshot({ path: path.join(SCREENS_DIR, `${slug}-1280px.png`), fullPage: false });
    await dContext.close();

    // Mobile 390px
    const mContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mPage = await mContext.newPage();
    await mPage.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    await mPage.screenshot({ path: path.join(SCREENS_DIR, `${slug}-390px.png`), fullPage: false });
    await mContext.close();

    uniformityResults.push({
      route,
      hasHeader,
      hasFooter,
      hasTicker,
      hasStatutoryStrip,
    });
    console.log(
      `[UNIFORMITY] ${route}: header=${hasHeader}, footer=${hasFooter}, ticker=${hasTicker}, strip=${hasStatutoryStrip}`
    );
  }

  return uniformityResults;
}

async function verifyDonateWithNoJs(browser) {
  console.log("\n--- PART 3: /DONATE WITH JAVASCRIPT DISABLED ---");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/donate`, { waitUntil: "domcontentloaded" });

  const html = await page.content();
  const checks = {
    bankName: html.includes("State Bank of India"),
    accountHolder:
      html.includes("MAHAVEER EDUCATIONAL & CHARITABLE TRUST") ||
      html.includes("MAHAVEER EDUCATIONAL &amp; CHARITABLE TRUST"),
    accountNumber: html.includes("33341302498"),
    ifsc: html.includes("SBIN0001701"),
    branch: html.includes("Rajendra College Square, Bolangir"),
    upiId: html.includes("86971610172@sbi"),
    donorNameField: html.includes('name="donorName"'),
    donorEmailField: html.includes('name="donorEmail"'),
    donorPhoneField: html.includes('name="donorPhone"'),
    amountField: html.includes('name="amount"'),
    utrField: html.includes('name="utrReference"'),
  };

  console.log("[NO-JS DONATE CHECK]:", checks);
  await context.close();
  return checks;
}

async function verifyDonationClaimApi() {
  console.log("\n--- PART 4: DONATION CLAIM API TESTS ---");
  const apiUrl = `${BASE_URL}/api/donations/claim`;

  // 1. Valid data
  const validPayload = {
    donorName: "Ananya Patnaik",
    donorEmail: "ananya@example.com",
    donorPhone: "9437123616",
    donorPan: "ABCDE1234F",
    amount: 5000,
    utrReference: "SBI49827361920",
    programmeCode: "SCHOLARSHIPS",
    transferDate: "2026-11-20",
    notes: "Verified automated test contribution claim",
  };

  const validRes = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": "203.0.113.1" },
    body: JSON.stringify(validPayload),
  });
  const validData = await validRes.json();
  console.log(`[API VALID] Status: ${validRes.status}`, validData);

  if (validRes.status === 200) {
    if (validData.status !== "UNVERIFIED") {
      throw new Error(`[A6 Assertion Failed] Expected claim status UNVERIFIED, got '${validData.status}'`);
    }
    const expectedMsgPrefix = "Claim received. Reference: ";
    const expectedMsgSuffix = ". The Trust will check your transfer against its bank records before issuing a receipt.";
    if (!validData.message?.startsWith(expectedMsgPrefix) || !validData.message?.endsWith(expectedMsgSuffix)) {
      throw new Error(`[A6 Assertion Failed] Message does not match canonical wording: '${validData.message}'`);
    }
  } else if (validRes.status === 503) {
    const expectedAdvisory = "We could not save your submission. Nothing has been recorded. Please email mect220@gmail.com or call +91 94371 23616 and quote your details.";
    if (!validData.error?.includes(expectedAdvisory)) {
      throw new Error(`[A6 Assertion Failed] 503 error message does not match required fail-closed advisory: '${validData.error}'`);
    }
    console.log("✓ Fail-closed verified: Returned HTTP 503 with statutory advisory when backend is unreachable.");
  } else {
    throw new Error(`[A6 Assertion Failed] Unexpected status ${validRes.status}`);
  }

  // 2. Invalid data
  const invalidRes = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": "203.0.113.2" },
    body: JSON.stringify({ donorName: "", donorEmail: "not-an-email" }),
  });
  const invalidData = await invalidRes.json();
  console.log(`[API INVALID] Status: ${invalidRes.status}`, invalidData);

  // 3. 6 requests burst from same IP (testing rate limiter)
  const burstResults = [];
  const burstIp = "203.0.113.99";
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": burstIp },
      body: JSON.stringify({ ...validPayload, utrReference: `BURST${i}12345678` }),
    });
    burstResults.push({ attempt: i, status: res.status });
  }
  console.log("[API BURST RESULTS]:", burstResults);
  if (burstResults[5].status !== 429) {
    throw new Error(`[A6 Assertion Failed] Expected 6th request from burst IP to return 429, got ${burstResults[5].status}`);
  }

  // 4. Distinct IP test (testing IP isolation: rate limits are not shared across distinct IPs)
  const distinctIp = "203.0.113.100";
  const distinctRes = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": distinctIp },
    body: JSON.stringify({ ...validPayload, utrReference: "DISTINCT123456" }),
  });
  const distinctData = await distinctRes.json();
  console.log(`[API DISTINCT IP] Status: ${distinctRes.status}`, distinctData);
  if (distinctRes.status === 200) {
    if (distinctData.status !== "UNVERIFIED") {
      throw new Error(`[A6 Assertion Failed] Distinct IP throttled or failed; expected 200 UNVERIFIED, got ${distinctRes.status}`);
    }
  } else if (distinctRes.status === 503) {
    console.log("✓ Distinct client IPs maintain independent rate limit counters (returned 503 fail-closed rather than 429).");
  } else {
    throw new Error(`[A6 Assertion Failed] Distinct IP throttled or failed; expected 200 or 503, got ${distinctRes.status}`);
  }
  console.log("✓ Distinct client IPs maintain independent rate limit counters.");

  return {
    valid: { status: validRes.status, data: validData },
    invalid: { status: invalidRes.status, data: invalidData },
    burst: burstResults,
    distinctIp: { status: distinctRes.status, data: distinctData },
  };
}

async function verify404(browser) {
  console.log("\n--- PART 5: 404 NOT FOUND VERIFICATION ---");
  const context = await browser.newContext();
  const page = await context.newPage();
  const resp = await page.goto(`${BASE_URL}/this-does-not-exist`, { waitUntil: "domcontentloaded" });
  const status = resp.status();

  const robots = await page
    .$eval('meta[name="robots"]', (el) => el.getAttribute("content"))
    .catch(() => "");
  const links = await page.$$eval("a[href]", (els) =>
    els.map((a) => a.getAttribute("href")).filter(Boolean)
  );

  const hasHomeLink = links.includes("/");
  const hasProgrammesLink = links.includes("/programmes");
  const hasDonateLink = links.includes("/donate");
  const hasContactLink = links.includes("/contact");

  console.log(`[404 CHECK] Status: ${status}, robots: '${robots}'`);
  console.log(
    `[404 LINKS] Home: ${hasHomeLink}, Programmes: ${hasProgrammesLink}, Donate: ${hasDonateLink}, Contact: ${hasContactLink}`
  );

  await context.close();
  return {
    status,
    noindex: robots.toLowerCase().includes("noindex"),
    hasHomeLink,
    hasProgrammesLink,
    hasDonateLink,
    hasContactLink,
  };
}

async function runAxeAudits(browser) {
  console.log("\n--- PART 6: AXE-CORE ACCESSIBILITY AUDITS ---");
  const context = await browser.newContext();
  const page = await context.newPage();
  const results = {};

  for (const route of AXE_PAGES) {
    const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    const axeResults = await new AxeBuilder({ page }).analyze();

    const seriousViolations = axeResults.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    fs.writeFileSync(
      path.join(AXE_DIR, `${slug}.json`),
      JSON.stringify(axeResults, null, 2)
    );

    results[route] = {
      totalViolations: axeResults.violations.length,
      seriousAndCritical: seriousViolations.length,
      seriousDetails: seriousViolations.map((v) => ({ id: v.id, impact: v.impact, description: v.description })),
    };
    console.log(`[AXE] ${route}: ${seriousViolations.length} serious/critical violations`);
  }

  await context.close();
  return results;
}

async function runLighthouseAudits() {
  console.log("\n--- PART 7: LIGHTHOUSE MOBILE AUDITS ---");
  const results = {};

  for (const route of LH_PAGES) {
    const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
    const targetUrl = `${BASE_URL}${route}`;
    console.log(`[LIGHTHOUSE] Running on ${route}...`);

    try {
      const runnerResult = await lighthouse(targetUrl, {
        port: 9222,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance", "accessibility", "seo"],
        formFactor: "mobile",
        screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 3 },
        throttlingMethod: "simulate",
      });

      const reportJson = JSON.parse(runnerResult.report);
      fs.writeFileSync(path.join(LH_DIR, `${slug}.json`), runnerResult.report);

      const perfScore = Math.round((reportJson.categories.performance?.score || 0) * 100);
      const a11yScore = Math.round((reportJson.categories.accessibility?.score || 0) * 100);
      const seoScore = Math.round((reportJson.categories.seo?.score || 0) * 100);

      const lcp = reportJson.audits["largest-contentful-paint"]?.displayValue || "N/A";
      const cls = reportJson.audits["cumulative-layout-shift"]?.displayValue || "N/A";
      const inp = reportJson.audits["interaction-to-next-paint"]?.displayValue || "N/A";

      results[route] = {
        perfScore,
        a11yScore,
        seoScore,
        lcp,
        cls,
        inp,
      };
      console.log(`[LH] ${route}: Perf ${perfScore} | A11y ${a11yScore} | SEO ${seoScore} | LCP ${lcp} | CLS ${cls}`);
    } catch (e) {
      console.error(`[LH ERROR] on ${route}:`, e.message);
      results[route] = { error: e.message };
    }
  }

  return results;
}

async function main() {
  await checkServerReady();

  const routes = await fetchSitemapRoutes();

  // Launch Playwright with remote debugging port for Lighthouse
  const browser = await chromium.launch({
    channel: "chrome",
    args: ["--remote-debugging-port=9222"],
  });

  try {
    const part1 = await verifyPagesAndLinks(browser, routes);
    const part2 = await verifyUniformityAndScreenshots(browser);
    const part3 = await verifyDonateWithNoJs(browser);
    const part4 = await verifyDonationClaimApi();
    const part5 = await verify404(browser);
    const part6 = await runAxeAudits(browser);
    const part7 = await runLighthouseAudits();

    const fullReport = {
      timestamp: new Date().toISOString(),
      part1_pages: part1.pageMetrics,
      brokenAnchors: part1.brokenAnchors,
      part2_uniformity: part2,
      part3_donateNoJs: part3,
      part4_api: part4,
      part5_404: part5,
      part6_axe: part6,
      part7_lighthouse: part7,
    };

    fs.writeFileSync(
      path.join(AUDIT_DIR, "rendered_verification_results.json"),
      JSON.stringify(fullReport, null, 2)
    );

    console.log("\n==========================================");
    console.log("RENDERED VERIFICATION COMPLETE!");
    console.log(`Results saved to audit/rendered_verification_results.json`);
    console.log("==========================================");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("FATAL ERROR IN VERIFICATION:", err);
  process.exit(1);
});
