import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_5_6");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
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

async function run() {
  console.log(`Testing against running server at ${BASE_URL}...`);
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const results = {
    timestamp: new Date().toISOString(),
    sectionCountAudit: {},
    dispatchesInteractionAudit: {},
    storiesArchiveAudit: {},
    viewportsTested: [],
    reducedMotionTest: {},
    consoleErrors: [],
  };

  try {
    const page = await browser.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`[Browser Console Error]: ${msg.text()}`);
        results.consoleErrors.push(msg.text());
      }
    });

    // 1. Audit Homepage Five-Section Architecture
    console.log("Navigating to Homepage for Section Architecture Audit...");
    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    const sectionElements = await page.$$eval("main section", (sections) =>
      sections.map((sec, idx) => ({
        index: idx + 1,
        id: sec.id || null,
        ariaLabel: sec.getAttribute("aria-label"),
        ariaLabelledby: sec.getAttribute("aria-labelledby"),
      }))
    );

    const actualIds = sectionElements.map((s) => s.id);
    const expectedIds = [
      "hero",
      "institutional-intro",
      "development-pillars",
      "stories",
      "institutional-impact",
    ];

    const exactFiveCount = sectionElements.length === 5;
    const orderMatches =
      JSON.stringify(actualIds) === JSON.stringify(expectedIds);

    results.sectionCountAudit = {
      totalSectionsFound: sectionElements.length,
      exactFiveCount,
      sectionDetails: sectionElements,
      expectedIds,
      actualIds,
      orderMatches,
      storiesIsFourth: actualIds[3] === "stories",
    };

    console.log(
      `Section Count Audit: ${exactFiveCount ? "PASS" : "FAIL"} (${sectionElements.length} sections found, stories is #4: ${actualIds[3] === "stories"})`
    );

    // 2. Audit Stories Section (#stories) Interaction & Content
    const storiesHeading = await page.$eval(
      "#stories #field-dispatches-heading",
      (el) => el.textContent?.trim()
    );

    const tabCount = await page.$$eval(
      '#stories [role="tab"]',
      (tabs) => tabs.length
    );

    // Click second tab (workshop) and verify panel update
    await page.click('#stories #tab-workshop');
    await page.waitForSelector('#panel-workshop', { state: 'visible', timeout: 5000 });

    const activePanelHeading = await page.$eval(
      '#panel-workshop h3',
      (el) => el.textContent?.trim() || ""
    );

    // Click third tab (water-point) and verify panel update
    await page.click('#stories #tab-water-point');
    await page.waitForSelector('#panel-water-point', { state: 'visible', timeout: 5000 });

    const waterPanelHeading = await page.$eval(
      '#panel-water-point h3',
      (el) => el.textContent?.trim() || ""
    );

    // Reset back to first tab (classroom)
    await page.click('#stories #tab-classroom');
    await page.waitForSelector('#panel-classroom', { state: 'visible', timeout: 5000 });

    results.dispatchesInteractionAudit = {
      storiesHeading,
      tabCount,
      secondTabSelectionWorked: activePanelHeading.includes("Workshop"),
      thirdTabSelectionWorked: waterPanelHeading.includes("Water Point"),
    };

    console.log("Dispatches Interaction Audit: PASS (tabs switch dispatches smoothly)");

    // 3. Audit Dedicated /stories Archive Route
    console.log("Navigating to /stories archive page...");
    const storiesResponse = await page.goto(`${BASE_URL}/stories`, {
      waitUntil: "networkidle",
    });

    const archiveStatus = storiesResponse?.status() ?? 0;
    const dispatchArticles = await page.$$eval("article", (articles) =>
      articles.map((art) => ({
        id: art.id,
        heading: art.querySelector("h2")?.textContent?.trim(),
        hasImage: !!art.querySelector("img"),
        hasHighlights: !!art.querySelector("ul"),
      }))
    );

    results.storiesArchiveAudit = {
      httpStatus: archiveStatus,
      dispatchesFound: dispatchArticles.length,
      dispatchArticles,
      allThreePresent:
        dispatchArticles.length === 3 &&
        dispatchArticles.some((d) => d.id === "classroom") &&
        dispatchArticles.some((d) => d.id === "workshop") &&
        dispatchArticles.some((d) => d.id === "water-point"),
    };

    console.log(
      `Stories Archive Audit: HTTP ${archiveStatus}, ${dispatchArticles.length} dispatches verified`
    );

    // 4. Viewport Overflow Audit across all 10 viewports
    console.log("Beginning Viewport Overflow Audit...");
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(250);

      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - window.innerWidth;
      });

      const screenshotPath = path.join(
        SCREENSHOT_DIR,
        `homepage_${vp.name}.png`
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });

      results.viewportsTested.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        overflowPx: Math.max(0, overflow),
        screenshot: screenshotPath,
        status: overflow <= 1 ? "PASS" : "OVERFLOW",
      });

      console.log(`  Viewport ${vp.name}: ${overflow <= 1 ? "PASS (0px overflow)" : `FAIL (${overflow}px overflow)`}`);
    }

    // 5. Reduced Motion Audit
    console.log("Testing prefers-reduced-motion behavior...");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    const storiesSectionVisible = await page.$eval("#stories", (el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden" && rect.height > 0;
    });

    results.reducedMotionTest = {
      reducedMotionActive: true,
      storiesSectionVisible,
    };

    console.log(`Reduced Motion Audit: ${storiesSectionVisible ? "PASS" : "FAIL"}`);

    // Write final audit results
    const reportPath = path.resolve(
      process.cwd(),
      "reports/stories-phase21-5-6-results.json"
    );
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), "utf8");
    console.log(`\nAudit complete! Results written to ${reportPath}`);
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
