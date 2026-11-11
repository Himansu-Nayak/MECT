import { chromium } from "file:///C:/Users/himan/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://mect.org.in";
const OUT_DIR = path.join(process.cwd(), "scratch", "live-hero-qa");
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: "live-mobile-390", width: 390, height: 844 },
  { name: "live-tablet-768", width: 768, height: 1024 },
  { name: "live-laptop-1024", width: 1024, height: 768 },
  { name: "live-desktop-1440", width: 1440, height: 900 },
  { name: "live-desktop-1920", width: 1920, height: 1080 },
];

const EXPECTED_FILES = [
  "illustrative-women-self-help-group.webp",
  "mect-legal-literacy-session.webp",
  "illustrative-community-library-reading.webp",
  "mect-women-empowerment-seminar.webp",
  "mect-clean-water-hygiene-demo.webp",
];

function parseTranslateX(transformStr) {
  if (!transformStr || transformStr === "none") return 0;
  const m = transformStr.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  const parts = m[1].split(",").map(Number);
  return parts[4] || 0;
}

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  let failures = 0;
  const consoleErrors = [];
  const httpErrors = [];

  try {
    console.log("=== 1. LIVE PRODUCTION HERO CHECK (https://mect.org.in) ===");
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(`${vp.name}: ${m.text()}`);
      });
      page.on("pageerror", (e) => consoleErrors.push(`${vp.name}: ${e.message}`));
      page.on("response", (r) => {
        if (r.status() >= 400) httpErrors.push(`${vp.name}: ${r.status()} ${r.url()}`);
      });

      const resp = await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
      await page.evaluate(() =>
        Promise.all(
          Array.from(document.images).map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((res) => {
                  img.onload = res;
                  img.onerror = res;
                })
          )
        )
      );
      await page.waitForTimeout(300);

      const t1 = await page.evaluate(() => {
        const track = document.querySelector(".hero-bg-track-ltr");
        return track ? getComputedStyle(track).transform : "none";
      });
      await page.waitForTimeout(1000);
      const t2 = await page.evaluate(() => {
        const track = document.querySelector(".hero-bg-track-ltr");
        const wrapper = document.querySelector(".hero-bg-marquee-wrapper");
        const h1 = document.querySelector("h1");
        const nav = document.querySelector("header nav");
        const imgs = Array.from(wrapper?.querySelectorAll("img") || []);
        const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0).length;
        const srcs = imgs.slice(0, 5).map((i) => i.getAttribute("src") || i.currentSrc || "");
        const h1Rect = h1?.getBoundingClientRect();
        const navRect = nav?.getBoundingClientRect();
        const h1Hit = h1Rect
          ? document.elementFromPoint(h1Rect.left + h1Rect.width / 2, h1Rect.top + h1Rect.height / 2)
          : null;
        const cls = (performance.getEntriesByType("layout-shift") || []).reduce(
          (sum, e) => (!e.hadRecentInput ? sum + e.value : sum),
          0
        );
        const footerText = document.querySelector("footer")?.innerText || "";
        return {
          transform: track ? getComputedStyle(track).transform : "none",
          animName: track ? getComputedStyle(track).animationName : "none",
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          navClearOfH1: !!navRect && !!h1Rect && navRect.bottom <= h1Rect.top,
          h1Topmost: !!h1 && (h1Hit === h1 || h1.contains(h1Hit)),
          broken,
          totalImgs: imgs.length,
          srcs,
          cls: Number(cls.toFixed(4)),
          hasAttribution:
            footerText.includes("Ganesh Dhamodkar") && footerText.includes("Sumitsurai"),
        };
      });

      const tx1 = parseTranslateX(t1);
      const tx2 = parseTranslateX(t2.transform);
      const movedLTR = tx2 > tx1;
      const allExpectedLoaded = EXPECTED_FILES.every((f) =>
        t2.srcs.some((s) => decodeURIComponent(s).includes(f))
      );

      const ok =
        resp?.status() === 200 &&
        t2.scrollW <= t2.innerW &&
        t2.animName === "hero-bg-marquee-ltr" &&
        movedLTR &&
        t2.navClearOfH1 &&
        t2.h1Topmost &&
        t2.broken === 0 &&
        allExpectedLoaded &&
        t2.hasAttribution &&
        t2.cls < 0.05;

      if (!ok) failures++;
      console.log(
        `[${ok ? "PASS" : "FAIL"}] ${vp.name.padEnd(18)} | http=${resp?.status()} | scroll=${t2.scrollW}/${t2.innerW} | dx=${(tx2 - tx1).toFixed(1)}px (LTR=${movedLTR}) | imgs=${t2.broken}/${t2.totalImgs} (expected5=${allExpectedLoaded}) | attr=${t2.hasAttribution} | cls=${t2.cls}`
      );
      await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}.png`), fullPage: false });
      await ctx.close();
    }

    console.log("\n=== 2. LIVE CTA ROUTES & REDUCED MOTION ===");
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(BASE + "/", { waitUntil: "load" });
      const pauseBtnCount = await page.locator("button:has-text('Pause Backdrop')").count();
      console.log(`Live Pause Backdrop count (expected 0): ${pauseBtnCount}`);
      if (pauseBtnCount !== 0) failures++;

      for (const route of ["/programmes", "/donate", "/csr-partnerships", "/governance"]) {
        const r = await page.request.get(BASE + route);
        console.log(`Live Route ${route} -> HTTP ${r.status()}`);
        if (r.status() !== 200) failures++;
      }
      await ctx.close();
    }

    {
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await ctx.newPage();
      await page.goto(BASE + "/", { waitUntil: "load" });
      await page.waitForTimeout(300);
      const rm = await page.evaluate(() => ({
        animName: getComputedStyle(document.querySelector(".hero-bg-track-ltr")).animationName,
        cloneDisplay: getComputedStyle(document.querySelector(".hero-bg-clone")).display,
      }));
      console.log("Live Reduced Motion:", rm);
      if (rm.animName !== "none" || rm.cloneDisplay !== "none") failures++;
      await ctx.close();
    }

    console.log("\n=== 3. OHO TECH ISOLATION CHECK ===");
    const ohoWeb = await fetch("https://ohotechn.com");
    const ohoApi = await fetch("https://api.ohotechn.com/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    console.log(`OHO TECH Web -> HTTP ${ohoWeb.status}`);
    console.log(`OHO TECH API -> HTTP ${ohoApi.status}`);
    if (ohoWeb.status !== 200 || ohoApi.status !== 401) failures++;

    console.log(`\nConsole errors: ${consoleErrors.length}, HTTP >=400 errors: ${httpErrors.length}, Failures: ${failures}`);
    if (consoleErrors.length) console.log("Console Errors:", consoleErrors);
    if (httpErrors.length) console.log("HTTP Errors:", httpErrors);
    process.exitCode = failures > 0 || consoleErrors.length > 0 || httpErrors.length > 0 ? 1 : 0;
  } finally {
    await browser.close();
  }
}

main();

