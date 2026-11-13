import { chromium } from "file:///C:/Users/himan/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://mect.org.in";

const KEY_VIEWPORTS = [
  { name: "mobile-360", width: 360, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1366", width: 1366, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const ALL_PUBLIC_ROUTES = [
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
  "/scholarships",
  "/scholarships/apply",
  "/scholarships/track",
  "/volunteer",
  "/faq",
  "/privacy",
  "/terms",
  "/accessibility",
  "/admin/login",
];

const outDir = path.join(process.cwd(), "scratch", "audit-screenshots", "prod");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  let failures = 0;
  const consoleErrors = [];
  const failedRequests = [];

  console.log("=== 1. HOMEPAGE RESPONSIVE CHECK (360, 768, 1366, 1440) ===");
  for (const vp of KEY_VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`home@${vp.name}: ${m.text()}`); });
    page.on("pageerror", (e) => consoleErrors.push(`home@${vp.name}: ${e.message}`));
    page.on("response", (res) => {
      if (res.status() >= 400 && !res.url().includes("/api/v1/admin")) {
        failedRequests.push(`home@${vp.name}: ${res.status()} ${res.url()}`);
      }
    });
    const res = await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(300);
    const metrics = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return {
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        brokenImgs: imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
        headerBg: getComputedStyle(document.querySelector("header") || document.body).backgroundColor,
        bodyBg: getComputedStyle(document.body).backgroundColor,
      };
    });
    const ok = res?.status() === 200 && metrics.scrollW <= metrics.innerW && metrics.brokenImgs.length === 0;
    if (!ok) failures++;
    console.log(`[${ok ? "PASS" : "FAIL"}] ${vp.name} | status=${res?.status()} | scrollW=${metrics.scrollW}/${metrics.innerW} | brokenImgs=${metrics.brokenImgs.length} | bodyBg=${metrics.bodyBg}`);
    if (vp.name === "desktop-1440" || vp.name === "mobile-360") {
      await page.screenshot({ path: path.join(outDir, `home-${vp.name}.png`), fullPage: false });
    }
    await ctx.close();
  }

  console.log("\n=== 2. ALL 19 ROUTES LIVE PRODUCTION CHECK (1366px + 360px) ===");
  for (const route of ALL_PUBLIC_ROUTES) {
    for (const width of [1366, 360]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await ctx.newPage();
      page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`${route}@${width}: ${m.text()}`); });
      page.on("pageerror", (e) => consoleErrors.push(`${route}@${width}: ${e.message}`));
      page.on("response", (res) => {
        if (res.status() >= 400 && !res.url().includes("/api/v1/admin")) {
          failedRequests.push(`${route}@${width}: ${res.status()} ${res.url()}`);
        }
      });

      const res = await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 45000 });
      await page.evaluate(async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 900) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 25));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(100);

      const m = await page.evaluate(() => ({
        title: document.title,
        h1Count: document.querySelectorAll("h1").length,
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        brokenImgs: Array.from(document.querySelectorAll("img"))
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.src),
      }));

      const isAdminLogin = route === "/admin/login";
      const ok = res?.status() === 200 && m.title.length > 0 && (isAdminLogin ? true : m.h1Count >= 1) && m.scrollW <= m.innerW && m.brokenImgs.length === 0;
      if (!ok) failures++;
      console.log(`[${ok ? "PASS" : "FAIL"}] ${route} @${width}px | status=${res?.status()} | h1=${m.h1Count} | scroll=${m.scrollW}/${m.innerW} | brokenImgs=${m.brokenImgs.length}`);
      if (m.brokenImgs.length > 0) console.log("   Broken:", m.brokenImgs);
      await ctx.close();
    }
  }

  console.log("\n=== 3. KEY FUNCTIONAL, FORM, DOCUMENT & AUTH GUARD CHECKS ===");
  {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const page = await ctx.newPage();

    // Admin route guard
    await page.goto(`${BASE}/admin`, { waitUntil: "networkidle", timeout: 30000 });
    const adminUrl = page.url();
    const hasLoginInput = await page.locator('input[type="password"], input[name*="email"], input[name*="username"]').count();
    const adminGuarded = adminUrl.includes("/admin/login") || hasLoginInput > 0;
    if (!adminGuarded) failures++;
    console.log(`[${adminGuarded ? "PASS" : "FAIL"}] /admin unauth guard -> url=${adminUrl}, loginInputs=${hasLoginInput}`);

    // Forms render check (read-only, no submission)
    for (const [route, selector] of [
      ["/donate", "button, a"],
      ["/volunteer", "form input, form select"],
      ["/scholarships/apply", "input, select, textarea"],
      ["/scholarships/track", "form input"],
      ["/contact", "form input, form textarea"],
      ["/statutory-disclosures", "button"],
    ]) {
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 30000 });
      const count = await page.locator(selector).count();
      const ok = count > 0;
      if (!ok) failures++;
      console.log(`[${ok ? "PASS" : "FAIL"}] ${route} interactive check (${selector}) -> count=${count}`);
    }
    await ctx.close();
  }

  console.log("\n=== 4. PUBLIC ASSETS & READ-ONLY LIVE BACKEND DB QUERY TEST (NON-MUTATING) ===");
  const csrResp = await fetch(`${BASE}/documents/mect-csr1-certificate.png`);
  const csrOk = csrResp.status === 200 && (csrResp.headers.get("content-type") || "").includes("image/png");
  if (!csrOk) failures++;
  console.log(`[${csrOk ? "PASS" : "FAIL"}] GET /documents/mect-csr1-certificate.png -> HTTP ${csrResp.status} (${csrResp.headers.get("content-type")})`);

  const trackResp = await fetch(`${BASE}/api/v1/public/scholarships/track/MECT-TEST-000`);
  const trackStatus = trackResp.status;
  const trackBody = await trackResp.text();
  const trackOk = trackStatus === 404;
  if (!trackOk) failures++;
  console.log(`[${trackOk ? "PASS" : "FAIL"}] GET /api/v1/public/scholarships/track/MECT-TEST-000 -> HTTP ${trackStatus} ${trackBody.slice(0, 140)}`);

  console.log("\n=== SUMMARY ===");
  console.log(`Console/Page errors: ${consoleErrors.length}`);
  if (consoleErrors.length) console.log(consoleErrors.slice(0, 10).join("\n"));
  console.log(`Failed HTTP >=400 requests: ${failedRequests.length}`);
  if (failedRequests.length) console.log(failedRequests.slice(0, 10).join("\n"));

  await browser.close();
  if (failures > 0 || consoleErrors.length > 0 || failedRequests.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

