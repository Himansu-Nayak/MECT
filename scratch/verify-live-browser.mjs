import { chromium } from "file:///C:/Users/himan/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = "http://localhost:3000";
const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 800 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-1024", width: 1024, height: 900 },
  { name: "desktop-1280", width: 1280, height: 900 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

const ROUTES = [
  "/",
  "/about",
  "/governance",
  "/statutory-disclosures",
  "/programmes",
  "/csr-partnerships",
  "/donate",
  "/impact",
  "/reports",
  "/contact",
];

const screenshotDir = path.join(process.cwd(), "public", "images", "audit");
fs.mkdirSync(screenshotDir, { recursive: true });

const browser = await chromium.launch({ channel: "msedge", headless: true });

let failures = 0;
const consoleErrors = [];

console.log("=== 1. MULTI-VIEWPORT RESPONSIVE & OVERFLOW AUDIT ON HOMEPAGE (/) ===");
for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`${vp.name}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => consoleErrors.push(`${vp.name} PAGEERROR: ${err.message}`));

  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

  // Scroll smoothly through page so all lazy-loaded images trigger and decode before audit
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= pageHeight; y += 900) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const scrollW = doc.scrollWidth;
    const innerW = window.innerWidth;
    const imgs = Array.from(document.querySelectorAll("img")).map((img) => ({
      src: img.getAttribute("src"),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      rect: img.getBoundingClientRect(),
    }));
    const text = document.body.innerText;
    return {
      overflow: scrollW > innerW,
      scrollW,
      innerW,
      brokenImgs: imgs.filter((i) => !i.complete || i.naturalWidth === 0),
      totalImgs: imgs.length,
      hasFreeEdu200: text.includes("FREE EDUCATION FOR") && text.includes("200") && text.includes("EDUCATION TODAY. A BETTER TOMORROW."),
      hasFundraising: text.includes("SUPPORT EDUCATION. TRANSFORM LIVES."),
      hasSbi: text.includes("SUPPORT OUR MISSION") && text.includes("STATE BANK OF INDIA") && text.includes("33341302498") && text.includes("SBIN0001701"),
      hasCsr: text.includes("CSR REGISTRATION & ORGANISATIONAL DETAILS") && text.includes("CSR00081063"),
      hasRemovedStory: text.includes("Stories from the Ground"),
      hasRemovedMca: text.includes("MCA CSR-1"),
      hasRemovedTrustees: text.includes("Yudhisthir Rana") || text.includes("Ramachandra Biswal") || text.includes("Sambit Kumar Dang"),
      hasUnionBank: text.includes("Union Bank") || text.includes("381002010014021"),
    };
  });

  const vpPass =
    !metrics.overflow &&
    metrics.brokenImgs.length === 0 &&
    metrics.hasFreeEdu200 &&
    metrics.hasFundraising &&
    metrics.hasSbi &&
    metrics.hasCsr &&
    !metrics.hasRemovedStory &&
    !metrics.hasRemovedMca &&
    !metrics.hasRemovedTrustees &&
    !metrics.hasUnionBank;

  if (!vpPass) failures++;
  console.log(
    `[${vpPass ? "PASS" : "FAIL"}] ${vp.name} (${vp.width}px) | scrollW=${metrics.scrollW}/${metrics.innerW} | imgs=${metrics.totalImgs} (broken=${metrics.brokenImgs.length}) | FreeEdu=${metrics.hasFreeEdu200} | Fundraising=${metrics.hasFundraising} | SBI=${metrics.hasSbi} | CSR=${metrics.hasCsr} | RemovedOK=${!metrics.hasRemovedStory && !metrics.hasRemovedMca && !metrics.hasRemovedTrustees && !metrics.hasUnionBank}`
  );
  if (metrics.brokenImgs.length > 0) {
    console.error("  Broken images:", metrics.brokenImgs);
  }

  // Capture crisp screenshots on primary viewports
  if (vp.name === "desktop-1440") {
    await page.screenshot({ path: path.join(screenshotDir, "final-hero-desktop-1440.png") });
    await page.locator("#free-education-200").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, "final-free-edu-1440.png") });
    await page.locator("#fundraising").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, "final-fundraising-1440.png") });
    await page.locator("#csr-registration").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, "final-csr-1440.png") });
    await page.locator("#donate-sbi").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, "final-sbi-1440.png") });
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, "final-footer-1440.png") });
  } else if (vp.name === "mobile-375" || vp.name === "mobile-320") {
    await page.screenshot({ path: path.join(screenshotDir, `final-hero-${vp.name}.png`) });
    await page.locator("#donate-sbi").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(screenshotDir, `final-sbi-${vp.name}.png`) });
  }

  await context.close();
}

console.log("\n=== 2. INTERACTIVE CONTROLS & CERTIFICATE MODAL VERIFICATION ===");
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

  // Test CSR Certificate Modal
  await page.locator("button:has-text('Preview Full Letter')").scrollIntoViewIfNeeded();
  await page.locator("button:has-text('Preview Full Letter')").click();
  await page.waitForSelector("[role='dialog'][aria-label='CSR Registration Certificate Preview']");
  await page.waitForFunction(() => {
    const img = document.querySelector("[role='dialog'] img");
    return Boolean(img && img.complete && img.naturalWidth > 100);
  }, { timeout: 5000 });
  const modalImgOk = await page.evaluate(() => {
    const img = document.querySelector("[role='dialog'] img");
    return Boolean(img && img.complete && img.naturalWidth > 100);
  });
  await page.keyboard.press("Escape");
  const modalClosed = (await page.locator("[role='dialog'][aria-label='CSR Registration Certificate Preview']").count()) === 0;
  console.log(`[${modalImgOk && modalClosed ? "PASS" : "FAIL"}] CSR Certificate modal opens, renders crisp PNG, and closes on Escape`);
  if (!modalImgOk || !modalClosed) failures++;

  // Test Tax Regime Toggle (Section 202 Simplified Regime)
  await page.locator("button:has-text('Section 202 Simplified Regime')").scrollIntoViewIfNeeded();
  await page.locator("button:has-text('Section 202 Simplified Regime')").click();
  const newRegimeText = await page.locator("#donate").innerText();
  const zeroCheck = newRegimeText.includes("Section 202 Simplified Tax Regime") && newRegimeText.includes("Tax offset is ₹0");
  console.log(`[${zeroCheck ? "PASS" : "FAIL"}] Section 202 Simplified Regime toggles deduction/offset cleanly to ₹0`);
  if (!zeroCheck) failures++;

  await context.close();
}

console.log("\n=== 3. ALL PUBLIC ROUTES RENDER & NO-OVERFLOW CHECK (1280px & 375px) ===");
for (const route of ROUTES) {
  for (const w of [1280, 375]) {
    const context = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await context.newPage();
    page.on("pageerror", (err) => consoleErrors.push(`${route} (${w}px): ${err.message}`));

    const res = await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 900) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const routeCheck = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return {
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        brokenImgs: imgs.filter((i) => !i.complete || i.naturalWidth === 0).length,
        hasMcaText: document.body.innerText.includes("MCA CSR-1"),
        hasRemovedTrustees:
          document.body.innerText.includes("Yudhisthir Rana") ||
          document.body.innerText.includes("Ramachandra Biswal") ||
          document.body.innerText.includes("Sambit Kumar Dang"),
      };
    });
    const ok =
      res &&
      res.status() === 200 &&
      !routeCheck.overflow &&
      routeCheck.brokenImgs === 0 &&
      !routeCheck.hasMcaText &&
      !routeCheck.hasRemovedTrustees;
    if (!ok) failures++;
    console.log(
      `[${ok ? "PASS" : "FAIL"}] ${route} @ ${w}px | status=${res?.status()} | overflow=${routeCheck.overflow} (${routeCheck.scrollW}/${routeCheck.innerW}) | brokenImgs=${routeCheck.brokenImgs} | noMCA=${!routeCheck.hasMcaText} | noRemovedTrustees=${!routeCheck.hasRemovedTrustees}`
    );
    await context.close();
  }
}

await browser.close();

console.log(`\nConsole/Page Errors: ${consoleErrors.length}`);
if (consoleErrors.length > 0) console.log(consoleErrors);
console.log(`TOTAL BROWSER FAILURES: ${failures}`);
if (failures > 0 || consoleErrors.length > 0) process.exit(1);

