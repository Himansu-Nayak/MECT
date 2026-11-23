import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3220;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_2");

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
  { name: "csr", path: "/csr-partnerships" },
];

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return true;
    } catch {}
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
    console.log("Server ready. Launching headless Edge browser...");

    const browser = await chromium.launch({ channel: "msedge", headless: true });
    const results = [];
    const consoleErrors = [];

    // 1. Run across all 7 viewports in standard motion mode
    for (const vp of VIEWPORTS) {
      console.log(`\nTesting viewport (normal motion): ${vp.name} (${vp.width}x${vp.height})`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        reducedMotion: "no-preference",
      });
      const page = await context.newPage();
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push({ viewport: vp.name, text: msg.text() });
        }
      });

      for (const p of PAGES_TO_TEST) {
        const url = `${BASE_URL}${p.path}`;
        await page.goto(url, { waitUntil: "networkidle" });
        await page.evaluate(() => window.scrollTo(0, 300));
        await page.waitForTimeout(300);

        const check = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const bodyWidth = document.body.scrollWidth;
          const h1 = document.querySelector("h1");
          const stats = Array.from(document.querySelectorAll(".tabular-nums")).map((el) => el.textContent?.trim());
          return {
            hasOverflow: docWidth > winWidth || bodyWidth > winWidth,
            docWidth,
            winWidth,
            h1Text: h1 ? h1.textContent?.trim().slice(0, 40) : null,
            h1Visible: h1 ? window.getComputedStyle(h1).opacity !== "0" && window.getComputedStyle(h1).display !== "none" : false,
            statSample: stats.slice(0, 3),
          };
        });

        const screenshotName = `${p.name}-${vp.name}-normal.png`;
        const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        results.push({
          viewport: vp.name,
          mode: "normal-motion",
          page: p.path,
          overflow: !check.hasOverflow,
          h1Visible: check.h1Visible,
          h1Text: check.h1Text,
          statSample: check.statSample,
          screenshotPath,
        });

        console.log(`  [${p.path}] Overflow: ${!check.hasOverflow ? "PASS" : "FAIL"} | H1 Visible: ${check.h1Visible} | Stats: ${check.statSample.join(", ")}`);
      }
      await context.close();
    }

    // 2. Test reduced motion mode across desktop & mobile
    const reducedMotionViewports = [
      { name: "360px", width: 360, height: 740 },
      { name: "1440px", width: 1440, height: 900 },
    ];

    for (const vp of reducedMotionViewports) {
      console.log(`\nTesting reduced-motion preference: ${vp.name}`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();

      for (const p of PAGES_TO_TEST) {
        const url = `${BASE_URL}${p.path}`;
        await page.goto(url, { waitUntil: "networkidle" });
        await page.evaluate(() => window.scrollTo(0, 300));
        await page.waitForTimeout(200);

        const check = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const h1 = document.querySelector("h1");
          const stats = Array.from(document.querySelectorAll(".tabular-nums")).map((el) => el.textContent?.trim());
          return {
            hasOverflow: docWidth > winWidth,
            h1Visible: h1 ? window.getComputedStyle(h1).opacity === "1" : false,
            statSample: stats.slice(0, 3),
          };
        });

        const screenshotName = `${p.name}-${vp.name}-reduced.png`;
        const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        results.push({
          viewport: vp.name,
          mode: "reduced-motion",
          page: p.path,
          overflow: !check.hasOverflow,
          h1Visible: check.h1Visible,
          statSample: check.statSample,
          screenshotPath,
        });

        console.log(`  [${p.path}] Reduced Motion: H1 Immediate Visible: ${check.h1Visible} | Overflow: ${!check.hasOverflow ? "PASS" : "FAIL"}`);
      }
      await context.close();
    }

    await browser.close();

    const summaryPath = path.join(SCREENSHOT_DIR, "motion-qa-summary.json");
    fs.writeFileSync(
      summaryPath,
      JSON.stringify({ timestamp: new Date().toISOString(), consoleErrors, results }, null, 2)
    );
    console.log(`\nMotion QA complete. Results saved to ${summaryPath}`);
  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Motion QA failed:", err);
  process.exit(1);
});
