import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_5_7");

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
  console.log(`Connecting to Next.js server at ${BASE_URL}...`);
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const results = {
    timestamp: new Date().toISOString(),
    governancePageAudit: {},
    statutoryStripAudit: {},
    stewardshipStatementAudit: {},
    clauseMatrixAudit: {},
    inspectionProcedureAudit: {},
    homepageFiveSectionAudit: {},
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

    // 1. Audit /governance Page Structure & Content
    console.log("Navigating to /governance...");
    const govResponse = await page.goto(`${BASE_URL}/governance`, {
      waitUntil: "networkidle",
    });

    const httpStatus = govResponse?.status() ?? 0;

    // Check Managing Trustee identity & designations
    const managingTrusteeName = await page.$eval(
      "#leadership h3",
      (el) => el.textContent?.trim() || ""
    );
    const managingTrusteeBadge = await page.$eval(
      "#leadership span.font-mono",
      (el) => el.textContent?.trim() || ""
    );

    // 2. Audit Statutory Strip (Phase 21.5.7.1)
    const statutoryStripHeading = await page.$eval(
      "#statutory-strip h2",
      (el) => el.textContent?.trim() || ""
    );
    const statutoryStripAria = await page.$eval(
      "#statutory-strip",
      (el) => el.getAttribute("aria-label") || ""
    );
    const statutoryStripText = await page.$eval(
      "#statutory-strip",
      (el) => el.textContent || ""
    );

    results.statutoryStripAudit = {
      heading: statutoryStripHeading,
      ariaLabel: statutoryStripAria,
      isCorrectlyRenamed:
        statutoryStripAria.includes("Statutory Registrations & Institutional Identifiers"),
      hasPan: statutoryStripText.includes("AADTM5474F"),
      has12AUrn: statutoryStripText.includes("AADTM5474FE20231"),
      hasNoStaleDate: !statutoryStripText.includes("Verified against Government registries as of November 2024"),
      hasDocumentsOnFile: statutoryStripText.includes("Documents on file"),
      hasNoHallucinatedPan: !statutoryStripText.includes("AAATM1840"),
    };

    // 3. Audit Stewardship Statement (Phase 21.5.7.1)
    const statementHeading = await page.$eval(
      "#stewardship-statement h2",
      (el) => el.textContent?.trim() || ""
    );
    const statementText = await page.$eval(
      "#stewardship-statement",
      (el) => el.textContent || ""
    );

    results.stewardshipStatementAudit = {
      heading: statementHeading,
      isStatementNamed: statementHeading.includes("Institutional Stewardship Statement"),
      hasNoFabricatedQuotes: !statementText.includes("Public trust is not an entitlement granted to a charitable institution"),
      hasInstitutionalPrinciple: statementText.includes("institutional principle of stewardship"),
    };

    // 4. Audit Clause Matrix (8 clauses)
    const clausesFound = await page.$$eval(
      'section[aria-label="Key Trust Deed Clauses"] span.font-mono.font-bold',
      (els) => els.map((el) => el.textContent?.trim())
    );

    const expectedClauses = [
      "Clause 8(1)",
      "Clause 8(2) & 10",
      "Clause 12",
      "Clause 9(XVI)",
      "Clause 9(VII) & Clause 16",
      "Clause 23",
      "Clause 24",
      "Clause 25",
    ];

    const allClausesPresent = expectedClauses.every((c) =>
      clausesFound.some((cf) => cf && cf.includes(c))
    );

    // Check Clause XVI bounded scope text
    const bodyText = await page.textContent("body") || "";
    const hasBoundedScope =
      bodyText.includes("does not imply zero operational, banking, or vendor procurement expenses");

    results.clauseMatrixAudit = {
      clausesFound,
      expectedClauses,
      allClausesPresent,
      hasBoundedScope,
    };

    // 5. Audit Inspection Procedure
    const inspectionText = await page.$eval(
      "#statutory-registry",
      (el) => el.textContent || ""
    );
    const inspectionQualified =
      inspectionText.toLowerCase().includes("prior written appointment") &&
      inspectionText.includes("Confidentiality & Record Safeguards");

    results.inspectionProcedureAudit = {
      inspectionQualified,
      mentionsAppointment: inspectionText.toLowerCase().includes("prior written appointment"),
      mentionsConfidentiality: inspectionText.includes("Confidentiality"),
    };

    results.governancePageAudit = {
      httpStatus,
      managingTrusteeName,
      managingTrusteeBadge,
      allChecksPassed:
        httpStatus === 200 &&
        managingTrusteeName.includes("Japabandhu Kampa") &&
        results.statutoryStripAudit.isCorrectlyRenamed &&
        results.statutoryStripAudit.hasPan &&
        results.statutoryStripAudit.has12AUrn &&
        results.statutoryStripAudit.hasNoStaleDate &&
        results.statutoryStripAudit.hasDocumentsOnFile &&
        results.statutoryStripAudit.hasNoHallucinatedPan &&
        results.stewardshipStatementAudit.isStatementNamed &&
        allClausesPresent &&
        hasBoundedScope &&
        inspectionQualified,
    };

    console.log(
      `Governance Audit: HTTP ${httpStatus}, All Checks Passed: ${results.governancePageAudit.allChecksPassed}`
    );

    // 6. Audit Viewport Overflow on /governance across all 10 viewports
    console.log("Beginning Viewport Overflow Audit for /governance...");
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/governance`, { waitUntil: "networkidle" });
      await page.waitForTimeout(200);

      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - window.innerWidth;
      });

      const screenshotPath = path.join(
        SCREENSHOT_DIR,
        `governance_${vp.name}.png`
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

    // 7. Confirm Homepage Five-Section Architecture is strictly preserved
    console.log("Verifying Homepage Five-Section Architecture...");
    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    const sectionElements = await page.$$eval("main section", (sections) =>
      sections.map((sec, idx) => ({
        index: idx + 1,
        id: sec.id || null,
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

    results.homepageFiveSectionAudit = {
      totalSectionsFound: sectionElements.length,
      exactFiveCount,
      actualIds,
      expectedIds,
      orderMatches,
      noSixthSection: exactFiveCount,
    };

    console.log(
      `Homepage Five-Section Audit: ${exactFiveCount && orderMatches ? "PASS" : "FAIL"} (Count: ${sectionElements.length}, IDs: ${actualIds.join(" -> ")})`
    );

    // 8. Reduced Motion Audit
    console.log("Testing prefers-reduced-motion on /governance...");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${BASE_URL}/governance`, { waitUntil: "networkidle" });

    const governanceHeroVisible = await page.$eval(
      "#leadership",
      (el) => {
        const rect = el.getBoundingClientRect();
        return rect.height > 0;
      }
    );

    results.reducedMotionTest = {
      reducedMotionActive: true,
      governanceHeroVisible,
    };

    console.log(`Reduced Motion Audit: ${governanceHeroVisible ? "PASS" : "FAIL"}`);

    // Write final audit results
    const reportPath = path.resolve(
      process.cwd(),
      "reports/governance-phase21-5-7-results.json"
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
