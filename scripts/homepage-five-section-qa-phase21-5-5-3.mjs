import { chromium } from "playwright";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const PORT = 3300;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_5_5_3");

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
      sectionCountAudit: {},
      relocatedContentAudit: {},
      viewportsTested: [],
      reducedMotionTest: {},
      consoleErrors: [],
    };

    // -------------------------------------------------------------
    // TEST 1: Exact Five-Section Architecture & DOM Landmark Verification
    // -------------------------------------------------------------
    console.log("\nVerifying Homepage Five-Section Architecture...");
    const auditContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const auditPage = await auditContext.newPage();
    await auditPage.goto(BASE_URL, { waitUntil: "networkidle" });
    await auditPage.waitForTimeout(600);

    const sectionAudit = await auditPage.evaluate(() => {
      const main = document.querySelector("main");
      if (!main) return { error: "No <main> landmark found" };

      // Query all direct or top-level content sections inside main
      const sections = Array.from(main.querySelectorAll(":scope > div > section, :scope > section"));
      const sectionDetails = sections.map((s, idx) => ({
        index: idx + 1,
        id: s.id || null,
        ariaLabel: s.getAttribute("aria-label") || null,
        ariaLabelledby: s.getAttribute("aria-labelledby") || null,
        visible: s.offsetHeight > 0 && s.offsetWidth > 0,
      }));

      const expectedIds = [
        "hero",
        "institutional-intro",
        "development-pillars",
        "stories",
        "institutional-impact",
      ];

      const actualIds = sectionDetails.map((s) => s.id);
      const exactFiveCount = sections.length === 5;
      const exactOrder = expectedIds.every((id, idx) => actualIds[idx] === id);

      // Verify no obsolete/retired sections remain rendered on homepage
      const text = main.textContent || "";
      const hasObsoleteVolunteerForm = !!main.querySelector("#participate form");
      const hasObsoleteInquiryForm = !!main.querySelector("#contact-desk form");
      const hasObsoleteCalculator = !!main.querySelector("#eligibility-calculator");
      const hasObsoleteSchemeExplorer = !!main.querySelector("#scheme-explorer");
      const hasObsoleteOperatingModel = !!main.querySelector("#how-mect-works");

      return {
        totalSectionsFound: sections.length,
        exactFiveCount,
        sectionDetails,
        expectedIds,
        actualIds,
        orderMatches: exactOrder,
        noObsoleteSections:
          !hasObsoleteVolunteerForm &&
          !hasObsoleteInquiryForm &&
          !hasObsoleteCalculator &&
          !hasObsoleteSchemeExplorer &&
          !hasObsoleteOperatingModel,
      };
    });

    report.sectionCountAudit = sectionAudit;
    console.log("Section Count Audit Result:", JSON.stringify(sectionAudit, null, 2));

    if (!sectionAudit.exactFiveCount) {
      throw new Error(`Expected exactly 5 sections on homepage, but found ${sectionAudit.totalSectionsFound}`);
    }

    // -------------------------------------------------------------
    // TEST 2: Relocated Content Presence on Dedicated Destination Pages
    // -------------------------------------------------------------
    console.log("\nVerifying Relocated Content on Destination Pages...");

    // A. Check /about has HowMectWorksSection
    await auditPage.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
    const aboutAudit = await auditPage.evaluate(() => {
      const el = document.getElementById("how-mect-works");
      return {
        hasHowMectWorks: !!el,
        has5Stages: el ? el.textContent.includes("01") && el.textContent.includes("05") : false,
        hasCSR1: el ? el.textContent.includes("CSR00081063") : false,
      };
    });

    // B. Check /scholarships has SchemeExplorer, EligibilityCalculator & DirectDisbursalFlowchart
    await auditPage.goto(`${BASE_URL}/scholarships`, { waitUntil: "networkidle" });
    const scholarshipsAudit = await auditPage.evaluate(() => {
      const calc = document.getElementById("eligibility-calculator");
      const explorer = document.getElementById("scheme-explorer");
      const disbursal = document.getElementById("direct-disbursal");
      return {
        hasCalculator: !!calc,
        hasSchemeExplorer: !!explorer,
        hasDisbursalFlowchart: !!disbursal,
      };
    });

    // C. Check /programmes has FreeEducationSection
    await auditPage.goto(`${BASE_URL}/programmes`, { waitUntil: "networkidle" });
    const programmesAudit = await auditPage.evaluate(() => {
      const freeEdu = document.getElementById("free-education-200");
      return {
        hasFreeEducation: !!freeEdu,
      };
    });

    // D. Check /csr-partnerships has CsrRegistrationSection
    await auditPage.goto(`${BASE_URL}/csr-partnerships`, { waitUntil: "networkidle" });
    const csrAudit = await auditPage.evaluate(() => {
      const csr = document.getElementById("csr-registration");
      return {
        hasCsrFramework: !!csr,
      };
    });

    // E. Check /volunteer has volunteer form
    await auditPage.goto(`${BASE_URL}/volunteer`, { waitUntil: "networkidle" });
    const volunteerAudit = await auditPage.evaluate(() => {
      const form = document.querySelector("form");
      return {
        hasVolunteerForm: !!form,
      };
    });

    // F. Check /contact has secretariat inquiry form
    await auditPage.goto(`${BASE_URL}/contact`, { waitUntil: "networkidle" });
    const contactAudit = await auditPage.evaluate(() => {
      const form = document.querySelector("form");
      return {
        hasInquiryForm: !!form,
      };
    });

    report.relocatedContentAudit = {
      aboutPage: aboutAudit,
      scholarshipsPage: scholarshipsAudit,
      programmesPage: programmesAudit,
      csrPage: csrAudit,
      volunteerPage: volunteerAudit,
      contactPage: contactAudit,
    };

    console.log("Relocated Content Audit:", JSON.stringify(report.relocatedContentAudit, null, 2));
    await auditContext.close();

    // -------------------------------------------------------------
    // TEST 3: Multi-Viewport Responsive Matrix (10 Viewports)
    // -------------------------------------------------------------
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
      await page.waitForTimeout(600);

      // Scroll across sections to trigger inView animations
      await page.evaluate(async () => {
        const sections = document.querySelectorAll("main section");
        for (const s of sections) {
          s.scrollIntoView({ behavior: "instant", block: "center" });
          await new Promise((r) => setTimeout(r, 100));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          docWidth,
          winWidth,
          overflowPx: Math.max(0, docWidth - winWidth),
        };
      });

      const shotPath = path.join(
        SCREENSHOT_DIR,
        `homepage_5sections_${vp.name.replace(/[^a-zA-Z0-9_]/g, "")}.png`
      );
      await page.screenshot({ path: shotPath, fullPage: true });
      console.log(`Saved screenshot: ${shotPath}`);

      report.viewportsTested.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        overflowPx: overflow.overflowPx,
        errors: pageErrors,
      });

      if (pageErrors.length > 0) {
        report.consoleErrors.push({ viewport: vp.name, errors: pageErrors });
      }

      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 4: Reduced Motion Preference
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
      const h1 = document.querySelector("h1");
      const sections = Array.from(document.querySelectorAll("main section"));
      return {
        h1Opacity: h1 ? window.getComputedStyle(h1).opacity : null,
        sectionsVisible: sections.every((s) => s.offsetHeight > 0),
        sectionCount: sections.length,
      };
    });

    report.reducedMotionTest = rmEval;
    await rmContext.close();

    await browser.close();

    const resultPath = path.resolve(process.cwd(), "reports/homepage-five-section-phase21-5-5-3-results.json");
    fs.writeFileSync(resultPath, JSON.stringify(report, null, 2));
    console.log(`\nAll tests completed! Saved reports/homepage-five-section-phase21-5-5-3-results.json`);
  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
