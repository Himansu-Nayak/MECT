import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3218;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_1");

const VIEWPORTS = [
  { name: "320px", width: 320, height: 640 },
  { name: "360px", width: 360, height: 740 },
  { name: "390px", width: 390, height: 844 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1024px", width: 1024, height: 768 },
  { name: "1440px", width: 1440, height: 900 },
  { name: "1920px", width: 1920, height: 1080 },
];

const PAGES_TO_TEST = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "programmes", path: "/programmes" },
  { name: "governance", path: "/governance" },
];

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 500));
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
    await waitForServer(`${BASE_URL}/`);
    console.log("Server is ready. Launching headless Edge browser...");

    const browser = await chromium.launch({ channel: "msedge", headless: true });
    const results = [];

    for (const vp of VIEWPORTS) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      for (const p of PAGES_TO_TEST) {
        const url = `${BASE_URL}${p.path}`;
        await page.goto(url, { waitUntil: "networkidle" });

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const bodyWidth = document.body.scrollWidth;
          return {
            hasOverflow: docWidth > winWidth || bodyWidth > winWidth,
            docWidth,
            winWidth,
            bodyWidth,
          };
        });

        // Check typography styles on PageHero or SectionHeader
        const typoMetrics = await page.evaluate(() => {
          const heroH1 = document.querySelector("h1");
          const sectionH2 = document.querySelector("h2");
          return {
            h1: heroH1
              ? {
                  fontSize: window.getComputedStyle(heroH1).fontSize,
                  lineHeight: window.getComputedStyle(heroH1).lineHeight,
                  fontFamily: window.getComputedStyle(heroH1).fontFamily,
                  fontWeight: window.getComputedStyle(heroH1).fontWeight,
                }
              : null,
            h2: sectionH2
              ? {
                  fontSize: window.getComputedStyle(sectionH2).fontSize,
                  lineHeight: window.getComputedStyle(sectionH2).lineHeight,
                  fontFamily: window.getComputedStyle(sectionH2).fontFamily,
                  fontWeight: window.getComputedStyle(sectionH2).fontWeight,
                }
              : null,
          };
        });

        const screenshotName = `${p.name}-${vp.name}.png`;
        const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        results.push({
          viewport: vp.name,
          width: vp.width,
          page: p.path,
          overflow,
          typoMetrics,
          screenshotPath,
        });

        console.log(
          `  [${p.path}] Overflow: ${overflow.hasOverflow ? "FAIL (doc=" + overflow.docWidth + ", win=" + overflow.winWidth + ")" : "PASS (0px overflow)"}`
        );
        if (typoMetrics.h1) {
          console.log(`    H1 size: ${typoMetrics.h1.fontSize}, weight: ${typoMetrics.h1.fontWeight}`);
        }
        if (typoMetrics.h2) {
          console.log(`    H2 size: ${typoMetrics.h2.fontSize}, weight: ${typoMetrics.h2.fontWeight}`);
        }
      }

      await context.close();
    }

    await browser.close();

    const summaryPath = path.join(SCREENSHOT_DIR, "qa-summary.json");
    fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
    console.log(`\nResponsive QA complete. Summary written to ${summaryPath}`);
  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("QA execution failed:", err);
  process.exit(1);
});
