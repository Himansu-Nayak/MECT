import { chromium } from "playwright";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const PORT = 3270;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_4");

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
    console.log("Server ready. Launching Edge browser...");

    const browser = await chromium.launch({
      channel: "msedge",
      headless: true,
    });

    const report = {
      timestamp: new Date().toISOString(),
      viewportsTested: [],
      ctaVerification: {},
      reducedMotionTest: {},
      consoleErrors: [],
    };

    const viewports = [
      { name: "320px", width: 320, height: 640 },
      { name: "360px", width: 360, height: 740 },
      { name: "390px", width: 390, height: 844 },
      { name: "430px", width: 430, height: 932 },
      { name: "768px", width: 768, height: 1024 },
      { name: "1024px", width: 1024, height: 768 },
      { name: "1280px", width: 1280, height: 800 },
      { name: "1440px", width: 1440, height: 900 },
      { name: "1920px", width: 1920, height: 1080 },
      { name: "landscape_844px", width: 844, height: 390 },
    ];

    for (const vp of viewports) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      const pageErrors = [];
      page.on("pageerror", (err) => pageErrors.push(err.message));
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          pageErrors.push(msg.text());
        }
      });

      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          docWidth,
          winWidth,
          overflowPx: Math.max(0, docWidth - winWidth),
        };
      });

      // Check H1 visibility
      const h1Info = await page.evaluate(() => {
        const h1 = document.querySelector("h1");
        if (!h1) return null;
        const rect = h1.getBoundingClientRect();
        return {
          text: h1.innerText.replace(/\s+/g, " ").trim(),
          visible: rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight,
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        };
      });

      // Check LCP Image visibility
      const imageInfo = await page.evaluate(() => {
        const img = document.querySelector("section[aria-label='Institutional Introduction'] img");
        if (!img) return null;
        const rect = img.getBoundingClientRect();
        const style = window.getComputedStyle(img);
        const parentStyle = window.getComputedStyle(img.parentElement);
        return {
          src: img.src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          visible: rect.width > 0 && rect.height > 0 && style.opacity !== "0" && parentStyle.opacity !== "0",
          rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        };
      });

      // Check Metric Cards presence
      const metricsInfo = await page.evaluate(() => {
        const heroSection = document.querySelector("section[aria-label='Institutional Introduction']");
        if (!heroSection) return [];
        const cards = Array.from(heroSection.querySelectorAll(".tabular-nums"));
        return cards.map((c) => ({
          value: c.textContent.trim(),
          label: c.nextElementSibling?.textContent.trim() || "",
        }));
      });

      const shotPath = path.join(SCREENSHOT_DIR, `hero_${vp.name.replace(/[^a-zA-Z0-9_]/g, "")}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`Saved screenshot: ${shotPath}`);

      report.viewportsTested.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        overflowPx: overflow.overflowPx,
        h1Visible: h1Info?.visible ?? false,
        h1Text: h1Info?.text ?? "",
        lcpImageLoaded: (imageInfo?.naturalWidth ?? 0) > 0,
        lcpImageVisible: imageInfo?.visible ?? false,
        metricsCount: metricsInfo.length,
        errors: pageErrors,
      });

      if (pageErrors.length > 0) {
        report.consoleErrors.push({ viewport: vp.name, errors: pageErrors });
      }

      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 2: Reduced Motion
    // -------------------------------------------------------------
    console.log("\nTesting Reduced Motion preference...");
    const rmContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto(BASE_URL, { waitUntil: "networkidle" });
    await rmPage.waitForTimeout(600);

    const rmEval = await rmPage.evaluate(() => {
      const hero = document.querySelector("section[aria-label='Institutional Introduction']");
      const h1 = document.querySelector("h1");
      const chevron = hero?.querySelector("svg.lucide-chevron-down");
      return {
        h1Opacity: h1 ? window.getComputedStyle(h1).opacity : null,
        chevronAnimation: chevron ? window.getComputedStyle(chevron).animationName : null,
      };
    });

    const rmShot = path.join(SCREENSHOT_DIR, "hero_reduced_motion.png");
    await rmPage.screenshot({ path: rmShot, fullPage: false });
    console.log(`Saved reduced motion screenshot: ${rmShot}`);
    report.reducedMotionTest = rmEval;
    await rmContext.close();

    // -------------------------------------------------------------
    // TEST 3: CTA Link Destinations
    // -------------------------------------------------------------
    console.log("\nTesting CTA Links...");
    const ctaContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const ctaPage = await ctaContext.newPage();
    await ctaPage.goto(BASE_URL, { waitUntil: "networkidle" });

    const ctas = await ctaPage.evaluate(() => {
      const hero = document.querySelector("section[aria-label='Institutional Introduction']");
      if (!hero) return [];
      const links = Array.from(hero.querySelectorAll("a"));
      return links.map((a) => ({
        text: a.innerText.replace(/\s+/g, " ").trim(),
        href: a.getAttribute("href"),
      }));
    });
    report.ctaVerification = ctas;
    console.log("Verified CTAs:", ctas);
    await ctaContext.close();

    await browser.close();

    fs.writeFileSync(
      path.resolve(process.cwd(), "reports/hero-phase21-4-results.json"),
      JSON.stringify(report, null, 2)
    );
    console.log("\nAll tests completed! Saved reports/hero-phase21-4-results.json");
  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    cleanup();
    process.exit(0);
  }
}

run();
