import { chromium } from "file:///C:/Users/himan/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3105;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.join(process.cwd(), "scratch", "mobile-qa");
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: "after-mobile-320", width: 320, height: 740, shot: true },
  { name: "after-mobile-360", width: 360, height: 800, shot: true },
  { name: "after-mobile-375", width: 375, height: 812, shot: true },
  { name: "after-mobile-387", width: 387, height: 866, shot: true },
  { name: "after-mobile-390", width: 390, height: 844, shot: true },
  { name: "after-mobile-430", width: 430, height: 932, shot: true },
  { name: "after-tablet-768", width: 768, height: 1024, shot: true },
  { name: "after-laptop-1024", width: 1024, height: 768, shot: false },
  { name: "after-desktop-1280", width: 1280, height: 800, shot: true },
  { name: "after-desktop-1440", width: 1440, height: 900, shot: true },
  { name: "after-desktop-1920", width: 1920, height: 1080, shot: true },
];

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

function parseTranslateX(t) {
  if (!t || t === "none") return 0;
  const m = t.match(/matrix\(([^)]+)\)/);
  if (!m) return 0;
  return Number(m[1].split(",")[4] || 0);
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

    console.log("=== 1. COMPREHENSIVE MOBILE + TABLET + DESKTOP QA ===");
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
      await page.waitForTimeout(250);

      const isMobile = vp.width < 768;
      const t1 = await page.evaluate((mobile) => {
        const el = document.querySelector(mobile ? ".hero-mobile-track-ltr" : ".hero-bg-track-ltr");
        return el ? getComputedStyle(el).transform : "none";
      }, isMobile);
      await page.waitForTimeout(900);

      const m = await page.evaluate((mobile) => {
        const activeEl = document.querySelector(mobile ? ".hero-mobile-track-ltr" : ".hero-bg-track-ltr");
        const scope = mobile
          ? activeEl
          : document.querySelector(".hero-bg-marquee-wrapper");
        const visibleImgs = Array.from(scope?.querySelectorAll("img") || []).filter(
          (i) => i.getClientRects().length > 0
        );
        const brokenVisible = visibleImgs.filter((i) => !i.complete || i.naturalWidth === 0).length;
        const h1 = document.querySelector("h1");
        const nav = document.querySelector("header nav");
        const chatBtn = document.querySelector('button[aria-label*="AI Assistant"]');
        const quickBtn = document.querySelector('button[aria-label*="quick actions menu"]');
        const heroSection = document.querySelector("section:first-of-type");
        const donateHeader = document.querySelector("header a[href='/donate']:not(.hidden)");
        const cls = (performance.getEntriesByType("layout-shift") || []).reduce(
          (s, e) => (!e.hadRecentInput ? s + e.value : s),
          0
        );
        const h1Rect = h1?.getBoundingClientRect();
        const chatRect = chatBtn?.getBoundingClientRect();
        const heroRect = heroSection?.getBoundingClientRect();
        return {
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          transform: activeEl ? getComputedStyle(activeEl).transform : "none",
          animName: activeEl ? getComputedStyle(activeEl).animationName : "none",
          primaryOpacity: activeEl ? Number(getComputedStyle(activeEl).opacity) : 0,
          brokenVisible,
          visibleImgCount: visibleImgs.length,
          h1TopClear: !!nav && !!h1Rect && nav.getBoundingClientRect().bottom <= h1Rect.top,
          chatClearOfHeroBottom: !chatRect || !heroRect || chatRect.top >= heroRect.bottom - 52,
          quickHiddenAtTop: !quickBtn,
          donateFitsHeader: !donateHeader || donateHeader.getBoundingClientRect().right <= window.innerWidth,
          cls: Number(cls.toFixed(4)),
        };
      }, isMobile);

      const dx = parseTranslateX(m.transform) - parseTranslateX(t1);
      const movedLTR = dx > 0;
      const expectedAnim = "hero-bg-marquee-ltr";

      const ok =
        m.scrollW <= m.innerW &&
        m.animName === expectedAnim &&
        movedLTR &&
        m.primaryOpacity > 0.8 &&
        m.brokenVisible === 0 &&
        m.h1TopClear &&
        m.donateFitsHeader &&
        (vp.width >= 1280 || m.quickHiddenAtTop) &&
        m.cls < 0.05;

      if (!ok) failures++;
      console.log(
        `[${ok ? "PASS" : "FAIL"}] ${vp.name.padEnd(18)} | scroll=${m.scrollW}/${m.innerW} | anim=${m.animName} | dx=${dx.toFixed(1)}px (LTR=${movedLTR}) | imgs=${m.brokenVisible}/${m.visibleImgCount} | quickHiddenAtTop=${m.quickHiddenAtTop} | headerOk=${m.donateFitsHeader} | cls=${m.cls}`
      );

      if (vp.shot) {
        await page.screenshot({ path: path.join(OUT_DIR, `${vp.name}.png`), fullPage: false });
      }
      await ctx.close();
    }

    console.log("\n=== 2. MOBILE NAVIGATION DRAWER, SCROLL DOCK & REDUCED MOTION ===");
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      await page.goto(BASE + "/", { waitUntil: "load" });
      await page.getByRole("button", { name: /Open navigation menu/i }).click();
      const drawerVisible = await page.locator("#mobile-navigation-drawer").isVisible();
      await page.getByRole("button", { name: /Close menu/i }).click();
      const drawerClosed = !(await page.locator("#mobile-navigation-drawer").isVisible());
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(200);
      const dockVisibleOnScroll = await page.getByRole("button", { name: /Open quick actions menu/i }).isVisible();
      const chatVisibleOnScroll = await page.getByRole("button", { name: /Open HIm/i }).isVisible();
      console.log(`Mobile drawer open=${drawerVisible}, close=${drawerClosed}, dockAfterScroll=${dockVisibleOnScroll}, chatAfterScroll=${chatVisibleOnScroll}`);
      if (!drawerVisible || !drawerClosed || !dockVisibleOnScroll || !chatVisibleOnScroll) failures++;
      await ctx.close();
    }

    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(BASE + "/", { waitUntil: "load" });
      const rm = await page.evaluate(() => {
        const track = document.querySelector(".hero-mobile-track-ltr");
        const clone = document.querySelector(".hero-mobile-clone");
        const extra = document.querySelector(".hero-mobile-extra-panel");
        return {
          anim: getComputedStyle(track).animationName,
          cloneDisplay: getComputedStyle(clone).display,
          extraDisplay: getComputedStyle(extra).display,
        };
      });
      console.log("Mobile Reduced Motion:", rm);
      if (rm.anim !== "none" || rm.cloneDisplay !== "none" || rm.extraDisplay !== "none") failures++;
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

