import { chromium } from "file:///C:/Users/himan/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.VERIFY_BASE_URL || "http://localhost:3000";

const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 800 },
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

const SCREENSHOT_SET = new Set(["mobile-320", "mobile-360", "tablet-768", "desktop-1280", "desktop-1440", "desktop-1920"]);
const outDir = path.join(process.cwd(), "scratch", "audit-screenshots", "hero");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  let failures = 0;
  const consoleErrors = [];
  const httpErrors = [];

  console.log("=== 1. FULL 10-VIEWPORT HERO GALLERY & RESPONSIVE QA ===");
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`${vp.name}: ${m.text()}`); });
    page.on("pageerror", (e) => consoleErrors.push(`${vp.name}: ${e.message}`));
    page.on("response", (r) => { if (r.status() >= 400) httpErrors.push(`${vp.name}: ${r.status()} ${r.url()}`); });

    await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
    await page.evaluate(() =>
      Promise.all(
        Array.from(document.images).map((img) =>
          img.complete ? Promise.resolve() : new Promise((res) => { img.onload = res; img.onerror = res; })
        )
      )
    );
    await page.waitForTimeout(350);

    const m = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const track1 = document.querySelector(".hero-gallery-track-ltr");
      const track2 = document.querySelector(".hero-gallery-track-rtl");
      const imgs = Array.from(document.querySelectorAll(".hero-gallery-wrapper img"));
      const visibleImgs = imgs.filter((img) => {
        const s = getComputedStyle(img);
        return s.display !== "none" && s.visibility !== "hidden" && img.getClientRects().length > 0;
      });
      const brokenVisible = visibleImgs.filter((i) => !i.complete || i.naturalWidth === 0).length;
      const track2Container = track2?.parentElement;
      const track2Visible = track2Container ? getComputedStyle(track2Container).display !== "none" : false;
      const bodyBg = getComputedStyle(document.body).backgroundColor;
      const clsEntries = performance.getEntriesByType("layout-shift") || [];
      const cls = clsEntries.reduce((sum, e) => (!e.hadRecentInput ? sum + e.value : sum), 0);

      return {
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        h1Visible: !!h1 && h1.getBoundingClientRect().height > 0,
        track1Anim: track1 ? getComputedStyle(track1).animationName : "none",
        track2Anim: track2 ? getComputedStyle(track2).animationName : "none",
        track2Visible,
        brokenVisible,
        visibleImgCount: visibleImgs.length,
        bodyBg,
        cls: Number(cls.toFixed(4)),
      };
    });

    const isMobile = vp.width < 768;
    const expectedTracksOk = isMobile ? !m.track2Visible : m.track2Visible;
    const animOk = m.track1Anim === "hero-marquee-ltr" && (isMobile || m.track2Anim === "hero-marquee-rtl");
    const ok = m.scrollW <= m.innerW && m.h1Visible && expectedTracksOk && animOk && m.brokenVisible === 0 && m.cls < 0.1;
    if (!ok) failures++;

    console.log(
      `[${ok ? "PASS" : "FAIL"}] ${vp.name} (${vp.width}px) | scroll=${m.scrollW}/${m.innerW} | track2Vis=${m.track2Visible} | anim1=${m.track1Anim} | broken=${m.brokenVisible}/${m.visibleImgCount} | cls=${m.cls}`
    );

    if (SCREENSHOT_SET.has(vp.name)) {
      await page.screenshot({ path: path.join(outDir, `hero-${vp.name}.png`), fullPage: false });
    }
    await ctx.close();
  }

  console.log("\n=== 2. PAUSE BUTTON & KEYBOARD ACCESSIBILITY CHECK ===");
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
    const pauseBtn = page.getByRole("button", { name: /Pause Gallery/i });
    await pauseBtn.click();
    const pausedState = await page.evaluate(() => {
      const t1 = document.querySelector(".hero-gallery-track-ltr");
      const btn = document.querySelector('[aria-pressed="true"]');
      return {
        playState: t1 ? getComputedStyle(t1).animationPlayState : "",
        ariaPressed: !!btn,
        btnText: btn?.textContent?.trim(),
      };
    });
    const ok = pausedState.playState === "paused" && pausedState.ariaPressed;
    if (!ok) failures++;
    console.log(`[${ok ? "PASS" : "FAIL"}] Pause toggle -> animationPlayState=${pausedState.playState}, ariaPressed=${pausedState.ariaPressed}, label="${pausedState.btnText}"`);
    await ctx.close();
  }

  console.log("\n=== 3. PREFERS-REDUCED-MOTION CHECK (1440px) ===");
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(250);
    const rm = await page.evaluate(() => {
      const t1 = document.querySelector(".hero-gallery-track-ltr");
      const clones = Array.from(document.querySelectorAll(".hero-gallery-clone"));
      const clonesHidden = clones.every((c) => getComputedStyle(c).display === "none");
      return {
        anim1: t1 ? getComputedStyle(t1).animationName : "",
        clonesHidden,
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
        uniqueCards: document.querySelectorAll(".hero-gallery-seq:not(.hero-gallery-clone) .hero-gallery-card").length,
      };
    });
    const ok = rm.anim1 === "none" && rm.clonesHidden && rm.scrollW <= rm.innerW && rm.uniqueCards === 6;
    if (!ok) failures++;
    console.log(`[${ok ? "PASS" : "FAIL"}] Reduced motion -> anim1=${rm.anim1}, clonesHidden=${rm.clonesHidden}, scroll=${rm.scrollW}/${rm.innerW}, uniqueCards=${rm.uniqueCards}`);
    await page.screenshot({ path: path.join(outDir, "hero-reduced-motion-1440.png"), fullPage: false });
    await ctx.close();
  }

  console.log("\n=== 4. HERO OLD PANEL REMOVAL & ASSET CHECK ===");
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 45000 });
    const domCheck = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const ctas = ["Explore Our Work", "Support Our Mission", "Partner With Us"].map(
        (t) => Array.from(document.querySelectorAll("a, button")).some((el) => el.textContent?.includes(t))
      );
      return {
        hasOldBoxHeading: bodyText.includes("Documented Programme Pillars"),
        hasOldJalSevaCard: bodyText.includes("Electronic College Remittance"),
        hasHeadline: bodyText.includes("Stronger communities begin with opportunity, dignity and care."),
        hasDeed: bodyText.includes("40311302194"),
        all3CtasPresent: ctas.every(Boolean),
      };
    });
    const ok = !domCheck.hasOldBoxHeading && !domCheck.hasOldJalSevaCard && domCheck.hasHeadline && domCheck.hasDeed && domCheck.all3CtasPresent;
    if (!ok) failures++;
    console.log(`[${ok ? "PASS" : "FAIL"}] Hero DOM audit -> oldBoxRemoved=${!domCheck.hasOldBoxHeading && !domCheck.hasOldJalSevaCard}, headline=${domCheck.hasHeadline}, deed=${domCheck.hasDeed}, all3Ctas=${domCheck.all3CtasPresent}`);
    await ctx.close();
  }

  console.log(`\nConsole/Page errors: ${consoleErrors.length}`);
  if (consoleErrors.length) console.log(consoleErrors.join("\n"));
  console.log(`HTTP >=400 errors: ${httpErrors.length}`);
  if (httpErrors.length) console.log(httpErrors.join("\n"));

  await browser.close();
  if (failures > 0 || consoleErrors.length > 0 || httpErrors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

