import { chromium } from "file:///C:/Users/himan/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3100;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.join(process.cwd(), "scratch", "hero-qa");
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 740 },
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "desktop-1366", width: 1366, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

const SHOTS = new Set([
  "mobile-320",
  "mobile-390",
  "tablet-768",
  "laptop-1024",
  "desktop-1440",
  "desktop-1920",
]);

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function parseTranslateX(transformStr) {
  if (!transformStr || transformStr === "none") return 0;
  const m = transformStr.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  const parts = m[1].split(",").map(Number);
  return parts[4] || 0;
}

async function run() {
  const server = spawn("npx", ["next", "start", "-p", String(PORT), "-H", "127.0.0.1"], {
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let browser;
  let failures = 0;
  const consoleErrors = [];
  const httpErrors = [];

  try {
    await waitForServer(BASE);
    browser = await chromium.launch({ channel: "msedge", headless: true });

    console.log("=== 1. 10-VIEWPORT HERO BACKGROUND & LAYOUT QA ===");
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(`${vp.name}: ${m.text()}`);
      });
      page.on("pageerror", (e) => consoleErrors.push(`${vp.name}: ${e.message}`));
      page.on("response", (r) => {
        if (r.status() >= 400 && !r.url().includes("/api/v1/")) {
          httpErrors.push(`${vp.name}: ${r.status()} ${r.url()}`);
        }
      });

      await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
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
        const heroSection = track?.closest("section");
        const h1 = document.querySelector("h1");
        const nav = document.querySelector("header nav");
        const imgs = Array.from(wrapper?.querySelectorAll("img") || []);
        const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0).length;
        const h1Rect = h1?.getBoundingClientRect();
        const heroRect = heroSection?.getBoundingClientRect();
        const navRect = nav?.getBoundingClientRect();
        const h1CenterHit = h1Rect
          ? document.elementFromPoint(
              h1Rect.left + h1Rect.width / 2,
              h1Rect.top + h1Rect.height / 2
            )
          : null;
        const cls = (performance.getEntriesByType("layout-shift") || []).reduce(
          (sum, e) => (!e.hadRecentInput ? sum + e.value : sum),
          0
        );

        return {
          transform: track ? getComputedStyle(track).transform : "none",
          animName: track ? getComputedStyle(track).animationName : "none",
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          heroHeight: heroRect ? Math.round(heroRect.height) : 0,
          h1InsideHero:
            !!h1Rect &&
            !!heroRect &&
            h1Rect.top >= heroRect.top &&
            h1Rect.bottom <= heroRect.bottom,
          navClearOfH1: !!navRect && !!h1Rect && navRect.bottom <= h1Rect.top,
          h1Topmost: !!h1 && (h1CenterHit === h1 || h1.contains(h1CenterHit)),
          wrapperBehind: wrapper ? getComputedStyle(wrapper).zIndex : "none",
          wrapperAriaHidden: wrapper?.getAttribute("aria-hidden"),
          broken,
          totalImgs: imgs.length,
          cls: Number(cls.toFixed(4)),
        };
      });

      const tx1 = parseTranslateX(t1);
      const tx2 = parseTranslateX(t2.transform);
      const movedLTR = tx2 > tx1; // Increasing translateX moves content left -> right

      const ok =
        t2.scrollW <= t2.innerW &&
        t2.animName === "hero-bg-marquee-ltr" &&
        movedLTR &&
        t2.h1InsideHero &&
        t2.navClearOfH1 &&
        t2.h1Topmost &&
        t2.wrapperAriaHidden === "true" &&
        t2.broken === 0 &&
        t2.cls < 0.05;

      if (!ok) failures++;
      console.log(
        `[${ok ? "PASS" : "FAIL"}] ${vp.name.padEnd(13)} | scroll=${t2.scrollW}/${t2.innerW} | heroH=${t2.heroHeight}px | dx=${(tx2 - tx1).toFixed(1)}px (LTR=${movedLTR}) | h1Top=${t2.h1Topmost} | navClear=${t2.navClearOfH1} | broken=${t2.broken}/${t2.totalImgs} | cls=${t2.cls}`
      );

      if (SHOTS.has(vp.name)) {
        await page.screenshot({ path: path.join(OUT_DIR, `hero-${vp.name}.png`), fullPage: false });
      }
      await ctx.close();
    }

    console.log("\n=== 2. PAUSE BUTTON, CTA NAVIGATION & REDUCED MOTION ===");
    {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(BASE + "/", { waitUntil: "load" });
      const btn = page.getByRole("button", { name: /Pause Backdrop/i });
      await btn.click();
      const pausedPlayState = await page.evaluate(() =>
        getComputedStyle(document.querySelector(".hero-bg-track-ltr")).animationPlayState
      );
      const pressedState = await page.getByRole("button", { name: /Play Backdrop/i }).getAttribute("aria-pressed");
      console.log(`Pause Backdrop -> animationPlayState=${pausedPlayState}, aria-pressed=${pressedState}`);
      if (pausedPlayState !== "paused" || pressedState !== "true") failures++;

      // Check CTA links resolve cleanly and return HTTP 200
      const ctas = await page.evaluate(() =>
        Array.from(document.querySelectorAll("section:first-of-type a")).map((a) => a.getAttribute("href"))
      );
      console.log("Hero CTA/Links:", ctas);
      for (const href of ["/programmes", "/donate", "/csr-partnerships", "/governance"]) {
        if (!ctas.includes(href)) failures++;
        const r = await page.request.get(BASE + href);
        if (r.status() !== 200) failures++;
        console.log(`Route check ${href} -> HTTP ${r.status()}`);
      }

      // Check unrelated homepage sections & footer remain intact
      const footerOk = await page.locator("footer").isVisible();
      const freeEduOk = await page.locator("#free-education-200").count();
      console.log(`Unrelated sections intact -> footer=${footerOk}, freeEducation=${freeEduOk > 0}`);
      if (!footerOk || freeEduOk === 0) failures++;

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
      const rm = await page.evaluate(() => {
        const track = document.querySelector(".hero-bg-track-ltr");
        const clone = document.querySelector(".hero-bg-clone");
        return {
          animName: getComputedStyle(track).animationName,
          display: getComputedStyle(track).display,
          cloneDisplay: getComputedStyle(clone).display,
        };
      });
      console.log("Reduced Motion (1440px):", rm);
      if (rm.animName !== "none" || rm.cloneDisplay !== "none") failures++;
      await page.screenshot({ path: path.join(OUT_DIR, "hero-reduced-motion-1440.png"), fullPage: false });
      await ctx.close();
    }

    console.log(`\nConsole errors: ${consoleErrors.length}, HTTP >=400 errors: ${httpErrors.length}, Failures: ${failures}`);
    if (consoleErrors.length) console.log("Console Errors:", consoleErrors);
    if (httpErrors.length) console.log("HTTP Errors:", httpErrors);
    process.exitCode = failures > 0 || consoleErrors.length > 0 || httpErrors.length > 0 ? 1 : 0;
  } finally {
    if (browser) await browser.close();
    if (server.pid) {
      spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { shell: true, stdio: "ignore" });
    }
    server.stdout?.destroy();
    server.stderr?.destroy();
    server.unref();
  }
}

run();

