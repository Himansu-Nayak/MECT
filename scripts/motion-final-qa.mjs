import { chromium } from "playwright";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const PORT = 3230;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_2/final-verification");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Timeout waiting for server at ${url}`);
}

async function run() {
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    shell: true,
    stdio: "inherit",
  });

  const cleanup = () => {
    try {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", String(server.pid), "/f", "/t"], { shell: true });
      } else {
        server.kill();
      }
    } catch {}
  };

  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  try {
    await waitForServer(BASE_URL);
    console.log("Server ready. Launching headless Edge browser...");

    const browser = await chromium.launch({
      channel: "msedge",
      headless: true,
    });

    const report = {
      timestamp: new Date().toISOString(),
      primitives: {},
      parallax: {},
      countUp: {},
      reducedMotion: {},
      cssAnimations: {},
      responsive: {},
      performance: {},
      consoleErrors: [],
    };

    // -------------------------------------------------------------
    // TEST 1: Normal Motion Verification on Fixture Page
    // -------------------------------------------------------------
    console.log("\n=== 1. VERIFYING PRIMITIVES (NORMAL MOTION) ===");
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          report.consoleErrors.push({ text: msg.text(), location: msg.location() });
        }
      });

      await page.goto(`${BASE_URL}/temp-motion-fixture`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      // HeroEntrance
      const heroCheck = await page.evaluate(() => {
        const h1 = document.querySelector("#hero-title");
        const container = h1?.closest("div");
        if (!h1 || !container) return { exists: false };
        const cs = window.getComputedStyle(container);
        return {
          exists: true,
          opacity: cs.opacity,
          transform: cs.transform,
          h1Visible: cs.display !== "none" && cs.visibility !== "hidden",
        };
      });
      report.primitives.heroEntrance = heroCheck;
      console.log("  [HeroEntrance]:", heroCheck);

      // Reveal Directions
      const revealCheck = await page.evaluate(() => {
        const directions = ["up", "down", "left", "right", "fade"];
        const results = {};
        for (const dir of directions) {
          const el = document.querySelector(`#reveal-${dir}`);
          const comp = el?.closest("[class*='rounded']");
          if (!comp) {
            results[dir] = { exists: false };
            continue;
          }
          const cs = window.getComputedStyle(comp);
          results[dir] = {
            exists: true,
            opacity: cs.opacity,
            visible: parseFloat(cs.opacity) > 0.8,
            transform: cs.transform,
          };
        }
        return results;
      });
      report.primitives.reveal = revealCheck;
      console.log("  [Reveal (5 directions)]:", revealCheck);

      // StaggerGroup & StaggerItem
      const staggerCheck = await page.evaluate(() => {
        const items = ["stagger-1", "stagger-2", "stagger-3", "stagger-4"];
        const count = items.filter((id) => document.querySelector(`#${id}`)).length;
        return {
          allExist: count === 4,
          count,
        };
      });
      report.primitives.stagger = staggerCheck;
      console.log("  [StaggerGroup]:", staggerCheck);

      // EditorialTextReveal
      const editorialCheck = await page.evaluate(() => {
        const h2Span = document.querySelector("#editorial-h2");
        const h2 = h2Span?.closest("h2");
        const pSpan = document.querySelector("#editorial-p");
        const p = pSpan?.closest("p");
        return {
          h2Exists: !!h2,
          h2Overflow: h2 ? window.getComputedStyle(h2).overflow : null,
          h2Opacity: h2Span ? window.getComputedStyle(h2Span).opacity : null,
          pExists: !!p,
          pOverflow: p ? window.getComputedStyle(p).overflow : null,
          pOpacity: pSpan ? window.getComputedStyle(pSpan).opacity : null,
        };
      });
      report.primitives.editorialTextReveal = editorialCheck;
      console.log("  [EditorialTextReveal]:", editorialCheck);

      // ImageReveal & GalleryReveal (Viewport Trigger verification)
      const imageRevealBeforeScroll = await page.evaluate(() => {
        const img = document.querySelector("#image-reveal-content")?.parentElement;
        return img ? window.getComputedStyle(img).opacity : null;
      });

      // Scroll into view to trigger viewport entry
      await page.locator("#fixture-images").scrollIntoViewIfNeeded();
      await page.waitForTimeout(800); // Allow editorial reveal duration (0.72s)

      const imageRevealCheck = await page.evaluate(() => {
        const img = document.querySelector("#image-reveal-content")?.parentElement;
        const gallery = document.querySelector("#gallery-reveal-content")?.parentElement;
        const imgOuter = img?.parentElement;
        const galleryOuter = gallery?.parentElement;
        return {
          imgContainerOverflow: imgOuter ? window.getComputedStyle(imgOuter).overflow : null,
          imgVisibleAfterScroll: img ? window.getComputedStyle(img).opacity : null,
          galleryContainerOverflow: galleryOuter ? window.getComputedStyle(galleryOuter).overflow : null,
          galleryVisibleAfterScroll: gallery ? window.getComputedStyle(gallery).opacity : null,
        };
      });
      report.primitives.imageReveal = {
        beforeScrollOpacity: imageRevealBeforeScroll,
        ...imageRevealCheck,
      };
      console.log("  [ImageReveal & GalleryReveal]:", report.primitives.imageReveal);

      // Scroll to CountUpStat to trigger animation
      await page.locator("#fixture-countup").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000); // Allow counter duration (400ms) to complete
      const countUpCheck = await page.evaluate(() => {
        return {
          years: document.querySelector(".stat-years")?.textContent?.trim(),
          scholarships: document.querySelector(".stat-scholarships")?.textContent?.trim(),
          patients: document.querySelector(".stat-patients")?.textContent?.trim(),
          families: document.querySelector(".stat-families")?.textContent?.trim(),
          aid: document.querySelector(".stat-aid")?.textContent?.trim(),
          lakhs: document.querySelector(".stat-lakhs")?.textContent?.trim(),
          rate: document.querySelector(".stat-rate")?.textContent?.trim(),
        };
      });
      report.countUp.normalMotion = countUpCheck;
      console.log("  [CountUpStat Normal Values]:", countUpCheck);

      // CSS Animation computed styles
      const cssAnimCheck = await page.evaluate(() => {
        const el = document.querySelector("#css-animate-in-target");
        if (!el) return null;
        const cs = window.getComputedStyle(el);
        return {
          animationDuration: cs.animationDuration,
          animationTimingFunction: cs.animationTimingFunction,
          animationFillMode: cs.animationFillMode,
          opacity: cs.opacity,
        };
      });
      report.cssAnimations.normalMotion = cssAnimCheck;
      console.log("  [CSS Animation Utilities]:", cssAnimCheck);

      // Parallax scroll check on Desktop
      const parallaxBeforeScroll = await page.evaluate(() => {
        const el = document.querySelector("#parallax-inner")?.parentElement;
        return el ? window.getComputedStyle(el).transform : null;
      });
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(300);
      const parallaxAfterScroll = await page.evaluate(() => {
        const el = document.querySelector("#parallax-inner")?.parentElement;
        return el ? window.getComputedStyle(el).transform : null;
      });
      report.parallax.desktop = {
        beforeScroll: parallaxBeforeScroll,
        afterScroll: parallaxAfterScroll,
        hasMovement: parallaxBeforeScroll !== parallaxAfterScroll,
      };
      console.log("  [Parallax Desktop Scroll Movement]:", report.parallax.desktop);

      // Test Parallax unmount
      await page.click("#btn-toggle-parallax");
      await page.waitForTimeout(200);
      const parallaxUnmounted = await page.evaluate(() => !document.querySelector("#parallax-inner"));
      report.parallax.cleanUnmount = parallaxUnmounted;
      console.log("  [Parallax Clean Unmount]:", parallaxUnmounted);

      // Capture desktop screenshot
      const desktopScreenshotPath = path.join(SCREENSHOT_DIR, "fixture-desktop-normal.png");
      await page.screenshot({ path: desktopScreenshotPath, fullPage: true });

      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 2: Parallax on Mobile (<768px)
    // -------------------------------------------------------------
    console.log("\n=== 2. VERIFYING PARALLAX ON MOBILE (<768px) ===");
    {
      const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/temp-motion-fixture`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);

      const mobileParallaxTransform = await page.evaluate(() => {
        const el = document.querySelector("#parallax-inner")?.parentElement;
        return el ? window.getComputedStyle(el).transform : null;
      });
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(200);
      const mobileParallaxAfterScroll = await page.evaluate(() => {
        const el = document.querySelector("#parallax-inner")?.parentElement;
        return el ? window.getComputedStyle(el).transform : null;
      });

      report.parallax.mobile = {
        beforeScroll: mobileParallaxTransform,
        afterScroll: mobileParallaxAfterScroll,
        disabledOrSuppressed:
          mobileParallaxTransform === "none" ||
          mobileParallaxTransform === "matrix(1, 0, 0, 1, 0, 0)" ||
          mobileParallaxTransform === mobileParallaxAfterScroll,
      };
      console.log("  [Parallax Mobile (Suppressed <768px)]:", report.parallax.mobile);

      const mobileScreenshotPath = path.join(SCREENSHOT_DIR, "fixture-mobile-normal.png");
      await page.screenshot({ path: mobileScreenshotPath, fullPage: true });
      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 3: Reduced Motion Emulation
    // -------------------------------------------------------------
    console.log("\n=== 3. VERIFYING REDUCED MOTION EMULATION ===");
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/temp-motion-fixture`, { waitUntil: "domcontentloaded" });

      // Immediate check of CountUpStat (0ms delay - should be target immediately)
      const instantStats = await page.evaluate(() => {
        return {
          years: document.querySelector(".stat-years")?.textContent?.trim(),
          scholarships: document.querySelector(".stat-scholarships")?.textContent?.trim(),
          patients: document.querySelector(".stat-patients")?.textContent?.trim(),
          families: document.querySelector(".stat-families")?.textContent?.trim(),
          aid: document.querySelector(".stat-aid")?.textContent?.trim(),
          lakhs: document.querySelector(".stat-lakhs")?.textContent?.trim(),
          rate: document.querySelector(".stat-rate")?.textContent?.trim(),
        };
      });
      report.reducedMotion.instantStats = instantStats;
      console.log("  [Reduced Motion Instant Stats]:", instantStats);

      // Hero & Editorial & Image in Reduced Motion
      const reducedElements = await page.evaluate(() => {
        const hero = document.querySelector("#hero-title")?.closest("div");
        const h2 = document.querySelector("#editorial-h2")?.closest("h2");
        const img = document.querySelector("#image-reveal-content");
        const parallax = document.querySelector("#parallax-inner")?.parentElement;
        const cssAnim = document.querySelector("#css-animate-in-target");

        return {
          heroOpacity: hero ? window.getComputedStyle(hero).opacity : null,
          heroTransform: hero ? window.getComputedStyle(hero).transform : null,
          h2Opacity: h2 ? window.getComputedStyle(h2).opacity : null,
          imgVisible: img ? window.getComputedStyle(img).opacity : null,
          parallaxTransform: parallax ? window.getComputedStyle(parallax).transform : null,
          cssAnimAnimation: cssAnim ? window.getComputedStyle(cssAnim).animationName : null,
          cssAnimOpacity: cssAnim ? window.getComputedStyle(cssAnim).opacity : null,
        };
      });
      report.reducedMotion.elements = reducedElements;
      console.log("  [Reduced Motion Elements State]:", reducedElements);

      const reducedDesktopPath = path.join(SCREENSHOT_DIR, "fixture-desktop-reduced.png");
      await page.screenshot({ path: reducedDesktopPath, fullPage: true });
      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 4: Performance & Layout Shift Measurement
    // -------------------------------------------------------------
    console.log("\n=== 4. PERFORMANCE & CLS MEASUREMENT ===");
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();

      // Setup PerformanceObserver for layout-shift
      await page.addInitScript(() => {
        window.__cls = 0;
        window.__longTasks = 0;
        try {
          const po = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                window.__cls += entry.value;
              }
            }
          });
          po.observe({ type: "layout-shift", buffered: true });

          const poLong = new PerformanceObserver((list) => {
            window.__longTasks += list.getEntries().length;
          });
          poLong.observe({ type: "longtask", buffered: true });
        } catch {}
      });

      await page.goto(`${BASE_URL}/temp-motion-fixture`, { waitUntil: "networkidle" });
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(1000);

      const perfMetrics = await page.evaluate(() => {
        return {
          cumulativeLayoutShift: window.__cls || 0,
          longTasksCount: window.__longTasks || 0,
        };
      });
      report.performance = perfMetrics;
      console.log("  [Performance Metrics]:", perfMetrics);

      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 5: Responsive Verification Across 7 Viewports
    // -------------------------------------------------------------
    console.log("\n=== 5. RESPONSIVE VERIFICATION ACROSS 7 VIEWPORTS ===");
    const viewports = [
      { name: "320px", width: 320, height: 640 },
      { name: "360px", width: 360, height: 740 },
      { name: "390px", width: 390, height: 844 },
      { name: "768px", width: 768, height: 1024 },
      { name: "1024px", width: 1024, height: 768 },
      { name: "1440px", width: 1440, height: 900 },
      { name: "1920px", width: 1920, height: 1080 },
    ];

    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/temp-motion-fixture`, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);

      const overflowCheck = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const bodyWidth = document.body.scrollWidth;
        return {
          hasHorizontalOverflow: docWidth > winWidth || bodyWidth > winWidth,
          docWidth,
          winWidth,
        };
      });

      report.responsive[vp.name] = {
        viewport: vp,
        pass: !overflowCheck.hasHorizontalOverflow,
        docWidth: overflowCheck.docWidth,
        winWidth: overflowCheck.winWidth,
      };

      console.log(`  [Viewport ${vp.name}]: Overflow Pass: ${!overflowCheck.hasHorizontalOverflow}`);
      await context.close();
    }

    await browser.close();

    // Write summary report
    const summaryPath = path.join(SCREENSHOT_DIR, "verification-summary.json");
    fs.writeFileSync(summaryPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`\nVerification complete. Summary saved to: ${summaryPath}`);
  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
