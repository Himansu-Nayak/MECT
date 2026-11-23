import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_5_8");

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
    volunteerPageAudit: {},
    opportunityClassificationAudit: {},
    safeguardingAudit: {},
    formValidationAudit: {},
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

    // 1. Audit /volunteer Page Structure & Content
    console.log("Navigating to /volunteer...");
    const volResponse = await page.goto(`${BASE_URL}/volunteer`, {
      waitUntil: "networkidle",
    });

    const httpStatus = volResponse?.status() ?? 0;

    // Check Hero title & description
    const heroTitle = await page.$eval("h1", (el) => el.textContent?.trim() || "");
    const heroDesc = await page.$eval("section p", (el) => el.textContent?.trim() || "");

    // 2. Audit Participation Opportunities & Status Classifications
    console.log("Auditing opportunity classifications...");
    const opportunityBadges = await page.$$eval(
      "#opportunities .grid > div span.uppercase",
      (els) => els.map((el) => el.textContent?.trim())
    );

    const validClassifications = ["OPEN", "INTEREST REGISTRATION", "PLANNED", "CLOSED"];
    const badgesAreValid =
      opportunityBadges.length > 0 &&
      opportunityBadges.every((b) => validClassifications.includes(b));

    const opportunityCount = await page.$$eval(
      "#opportunities .grid > div",
      (els) => els.length
    );

    results.opportunityClassificationAudit = {
      opportunityCount,
      badgesFound: opportunityBadges,
      badgesAreValid,
      hasPlannedOpportunities: opportunityBadges.includes("PLANNED"),
      hasInterestRegistration: opportunityBadges.includes("INTEREST REGISTRATION"),
    };

    // 3. Audit Safeguarding & Code of Conduct Callout
    console.log("Auditing safeguarding protections...");
    const safeguardingSectionText = await page.$eval(
      "#safeguarding",
      (el) => el.textContent || ""
    );

    const safeguardingAudit = {
      hasNonCommercialClause: safeguardingSectionText.includes("Zero commercial transactions are permitted"),
      hasSupervisionClause: safeguardingSectionText.includes("Supervised Environments Only"),
      hasDataPrivacyClause: safeguardingSectionText.includes("Digital Personal Data Protection Act"),
      hasContactRoute: safeguardingSectionText.includes("contact@mect.org.in"),
    };
    results.safeguardingAudit = safeguardingAudit;

    // 4. Audit Form Fields & Absence of Sensitive Requests
    console.log("Auditing volunteer form accessibility & fields...");
    const formFields = await page.$$eval("form input, form select, form textarea", (els) =>
      els.map((el) => ({
        id: el.getAttribute("id"),
        name: el.getAttribute("name"),
        type: el.getAttribute("type") || el.tagName.toLowerCase(),
        required: el.hasAttribute("required"),
      }))
    );

    const fieldNames = formFields.map((f) => f.name);
    const noSensitiveFields =
      !fieldNames.includes("aadhaar") &&
      !fieldNames.includes("pan") &&
      !fieldNames.includes("bankAccount") &&
      !fieldNames.includes("medicalHistory");

    const hasMandatoryConsent = formFields.some(
      (f) => f.name === "consentDeclared" && f.type === "checkbox"
    );

    results.formValidationAudit = {
      totalFields: formFields.length,
      fieldNames,
      noSensitiveFields,
      hasMandatoryConsent,
    };

    // 5. Overall Governance / Integrity Verdict
    results.volunteerPageAudit = {
      httpStatus,
      heroTitle,
      hasCorrectHeading: heroTitle.includes("Bring Your Time. Share Your Skills. Strengthen a Community."),
      allChecksPassed:
        httpStatus === 200 &&
        badgesAreValid &&
        opportunityCount >= 6 &&
        safeguardingAudit.hasNonCommercialClause &&
        safeguardingAudit.hasSupervisionClause &&
        safeguardingAudit.hasDataPrivacyClause &&
        noSensitiveFields &&
        hasMandatoryConsent,
    };

    console.log(
      `Volunteer Page Audit: HTTP ${httpStatus}, All Checks Passed: ${results.volunteerPageAudit.allChecksPassed}`
    );

    // 6. Viewport Overflow Audit across 10 viewports
    console.log("Beginning Viewport Overflow Audit for /volunteer...");
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/volunteer`, { waitUntil: "networkidle" });
      await page.waitForTimeout(200);

      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - window.innerWidth;
      });

      const screenshotPath = path.join(
        SCREENSHOT_DIR,
        `volunteer_${vp.name}.png`
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

      console.log(`  Viewport ${vp.name}: ${overflow <= 1 ? "PASS" : "FAIL"} (${overflow}px overflow)`);
    }

    // 7. Verify Homepage 5-Section Architecture Preservation
    console.log("Verifying Homepage Five-Section Architecture...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const homepageSectionIds = await page.evaluate(() => {
      const main = document.querySelector("main");
      if (!main) return [];
      const sections = Array.from(main.querySelectorAll(":scope > div > section, :scope > section"));
      return sections.map((s) => s.id).filter(Boolean);
    });

    const expectedFiveIds = [
      "hero",
      "institutional-intro",
      "development-pillars",
      "stories",
      "institutional-impact",
    ];

    const exactFiveCount = homepageSectionIds.length === 5;
    const orderMatches = JSON.stringify(homepageSectionIds) === JSON.stringify(expectedFiveIds);

    results.homepageFiveSectionAudit = {
      totalSectionsFound: homepageSectionIds.length,
      exactFiveCount,
      actualIds: homepageSectionIds,
      expectedIds: expectedFiveIds,
      orderMatches,
      noSixthSection: exactFiveCount && orderMatches,
    };

    console.log(
      `Homepage Five-Section Audit: ${results.homepageFiveSectionAudit.noSixthSection ? "PASS" : "FAIL"} (Count: ${homepageSectionIds.length}, IDs: ${homepageSectionIds.join(" -> ")})`
    );

    // 8. Test Reduced Motion behavior on /volunteer
    console.log("Testing prefers-reduced-motion on /volunteer...");
    const motionPage = await browser.newPage({
      extraHTTPHeaders: {},
    });
    await motionPage.emulateMedia({ reducedMotion: "reduce" });
    await motionPage.goto(`${BASE_URL}/volunteer`, { waitUntil: "networkidle" });

    const animatedElementsCount = await motionPage.evaluate(() => {
      const allEls = Array.from(document.querySelectorAll("*"));
      return allEls.filter((el) => {
        const style = window.getComputedStyle(el);
        return (
          style.animationName !== "none" &&
          style.animationDuration !== "0s" &&
          parseFloat(style.animationDuration) > 0.05
        );
      }).length;
    });

    results.reducedMotionTest = {
      reducedMotionEnabled: true,
      activeLongAnimations: animatedElementsCount,
      status: animatedElementsCount === 0 ? "PASS" : "NOTICE",
    };
    await motionPage.close();

    // Write final QA results JSON
    const reportPath = path.resolve(process.cwd(), "reports/volunteer-phase21-5-8-results.json");
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), "utf8");
    console.log(`\nAudit complete! Results written to ${reportPath}`);
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("Test Suite execution failed:", err);
  process.exit(1);
});
