import { chromium } from "file:///C:/Users/himan/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3107;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.join(process.cwd(), "scratch", "complete-qa");
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: "home-mobile-320", width: 320, height: 740, shot: true },
  { name: "home-mobile-360", width: 360, height: 800, shot: true },
  { name: "home-mobile-375", width: 375, height: 812, shot: false },
  { name: "home-mobile-390", width: 390, height: 844, shot: true },
  { name: "home-mobile-430", width: 430, height: 932, shot: false },
  { name: "home-tablet-768", width: 768, height: 1024, shot: true },
  { name: "home-laptop-1024", width: 1024, height: 768, shot: false },
  { name: "home-desktop-1280", width: 1280, height: 800, shot: false },
  { name: "home-desktop-1440", width: 1440, height: 900, shot: true },
  { name: "home-desktop-1920", width: 1920, height: 1080, shot: true },
];

const ROUTES = ["/about", "/programmes", "/impact", "/csr-partnerships", "/governance", "/donate", "/contact"];

const parseX = (t) => (!t || t === "none" ? 0 : Number((t.match(/matrix\(([^)]+)\)/)?.[1] || "").split(",")[4] || 0));

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 350));
  }
  throw new Error(`Server timeout at ${url}`);
}

const server = spawn("npx", ["next", "start", "-p", String(PORT), "-H", "127.0.0.1"], {
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
});

let browser;
let failures = 0;

try {
  await waitForServer(BASE);
  browser = await chromium.launch({ channel: "msedge", headless: true });

  console.log("=== 1. 10-VIEWPORT HOMEPAGE HERO, MOTION & OVERFLOW QA ===");
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().includes("127.0.0.1:8081") && !m.text().includes("Failed to load resource")) errs.push(m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400 && !r.url().includes("/api/v1/")) errs.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(300);

    const mobile = vp.width < 768;
    const x1 = parseX(
      await page.evaluate((m) => {
        const el = document.querySelector(m ? ".hero-mobile-track-ltr" : ".hero-bg-track-ltr");
        return el ? getComputedStyle(el).transform : "none";
      }, mobile)
    );
    await page.waitForTimeout(900);

    const m = await page.evaluate((isMobile) => {
      const el = document.querySelector(isMobile ? ".hero-mobile-track-ltr" : ".hero-bg-track-ltr");
      const scope = isMobile ? el : document.querySelector(".hero-bg-marquee-wrapper");
      const visibleImgs = Array.from(scope?.querySelectorAll("img") || []).filter((i) => i.getClientRects().length > 0 && i.getBoundingClientRect().right > 0 && i.getBoundingClientRect().left < window.innerWidth);
      const brokenInView = visibleImgs.filter((i) => i.complete && i.naturalWidth === 0).length;
      const cls = (performance.getEntriesByType("layout-shift") || []).reduce((s, e) => (!e.hadRecentInput ? s + e.value : s), 0);
      return {
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        anim: el ? getComputedStyle(el).animationName : "none",
        transform: el ? getComputedStyle(el).transform : "none",
        visibleImgs: visibleImgs.length,
        brokenInView,
        cls: Number(cls.toFixed(4)),
      };
    }, mobile);

    const dx = parseX(m.transform) - x1;
    const ok = m.scrollW <= m.innerW && m.anim === "hero-bg-marquee-ltr" && dx > 0 && m.brokenInView === 0 && m.cls < 0.05 && errs.length === 0;
    if (!ok) failures++;
    console.log(`[${ok ? "PASS" : "FAIL"}] ${vp.name.padEnd(19)} | scroll=${m.scrollW}/${m.innerW} | dx=${dx.toFixed(1)}px | visImgs=${m.brokenInView}/${m.visibleImgs} | cls=${m.cls} | errs=${errs.length}`);
    if (vp.shot) await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}.png`), fullPage: false });
    await ctx.close();
  }

  console.log("\n=== 2. SBI QR CODE, COPY FEEDBACK, DOWNLOAD & COUNT-UP VERIFICATION ===");
  for (const vp of [{ name: "qr-mobile-390", width: 390, height: 844 }, { name: "qr-desktop-1440", width: 1440, height: 900 }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, permissions: ["clipboard-read", "clipboard-write"] });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/#donate-sbi`, { waitUntil: "load", timeout: 45000 });
    const sbi = page.locator("#donate-sbi");
    await sbi.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);

    const qrImg = sbi.locator('img[alt*="Scan and Pay QR Code"]');
    await qrImg.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await sbi.getByRole("button", { name: /Copy Official SBI UPI ID/i }).click();
    await page.waitForTimeout(250);

    const check = await page.evaluate(() => {
      const el = document.querySelector("#donate-sbi");
      const img = el?.querySelector('img[alt*="Scan and Pay QR Code"]');
      const dl = el?.querySelector('a[download="MECT-SBI-UPI-QR.png"]');
      const text = el?.textContent || "";
      return {
        qrLoaded: !!img && img.complete && img.naturalWidth > 0,
        qrStationary: !!img && getComputedStyle(img).transform === "none" && getComputedStyle(img).filter === "none",
        hasUpi: text.includes("86971610172@sbi"),
        hasHonestLabel: text.includes("Static UPI QR") && text.includes("not auto-verified") && !text.includes("Verified UPI QR"),
        copyToastVisible: text.includes("Copied 86971610172@sbi"),
        hasDownload: !!dl && dl.getAttribute("href") === "/images/mect-sbi-upi-qr.png",
      };
    });

    const impactOk = await page.evaluate(() => {
      const txt = document.body.innerText;
      return txt.includes("13+") && txt.includes("350+") && txt.includes("120+") && txt.includes("10,000+");
    });

    const ok = check.qrLoaded && check.qrStationary && check.hasUpi && check.hasHonestLabel && check.copyToastVisible && check.hasDownload && impactOk;
    if (!ok) failures++;
    console.log(`[${ok ? "PASS" : "FAIL"}] ${vp.name} |`, JSON.stringify(check), "| metrics=", impactOk);
    await sbi.screenshot({ path: path.join(OUT_DIR, `${vp.name}.png`) });
    await ctx.close();
  }

  console.log("\n=== 3. ROUTES, PAGEHERO BADGE & RESPONSIVE OVERFLOW ===");
  for (const route of ROUTES) {
    for (const w of [390, 1440]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 } });
      const page = await ctx.newPage();
      const errs = [];
      page.on("response", (r) => {
        if (r.status() >= 400 && !r.url().includes("/api/v1/")) errs.push(`${r.status()} ${r.url()}`);
      });
      const res = await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 45000 });
      await page.waitForTimeout(250);
      const rInfo = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        hasH1: !!document.querySelector("h1")?.textContent?.trim(),
      }));
      const ok = res.status() === 200 && rInfo.scrollW <= rInfo.innerW && rInfo.hasH1 && errs.length === 0;
      if (!ok) failures++;
      console.log(`[${ok ? "PASS" : "FAIL"}] ${route.padEnd(18)} @${w}px | http=${res.status()} | scroll=${rInfo.scrollW}/${rInfo.innerW} | errs=${errs.length}`);
      if ((route === "/about" || route === "/donate" || route === "/programmes") && w === 1440) {
        await page.screenshot({ path: path.join(OUT_DIR, `route-${route.replace("/", "")}-1440.png`), fullPage: false });
      }
      if (route === "/donate" && w === 390) {
        await page.locator("#donate-sbi").scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
        await page.screenshot({ path: path.join(OUT_DIR, `donate-qr-390.png`), fullPage: false });
      }
      await ctx.close();
    }
  }

  console.log("\n=== 4. MOBILE DRAWER & REDUCED-MOTION ACCESSIBILITY ===");
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(200);
    const rm = await page.evaluate(() => {
      const mTrack = document.querySelector(".hero-mobile-track-ltr");
      const clone = document.querySelector(".hero-mobile-clone");
      return {
        anim: mTrack ? getComputedStyle(mTrack).animationName : "missing",
        cloneDisplay: clone ? getComputedStyle(clone).display : "missing",
      };
    });
    await page.getByRole("button", { name: /Open navigation menu/i }).click();
    const drawerOpen = await page.locator("#mobile-navigation-drawer").isVisible();
    await page.getByRole("button", { name: /Close menu/i }).click();
    const drawerClosed = !(await page.locator("#mobile-navigation-drawer").isVisible());
    const ok = rm.anim === "none" && rm.cloneDisplay === "none" && drawerOpen && drawerClosed;
    if (!ok) failures++;
    console.log(`[${ok ? "PASS" : "FAIL"}] Reduced Motion & Mobile Drawer |`, rm, `| open=${drawerOpen} close=${drawerClosed}`);
    await ctx.close();
  }
} finally {
  if (browser) await browser.close();
  if (process.platform === "win32" && server.pid) {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    server.kill("SIGTERM");
  }
}

console.log(`\nTotal Failures: ${failures}`);
if (failures > 0) process.exit(1);

