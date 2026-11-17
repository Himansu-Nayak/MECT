import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_5_8_1");
const REPORT_PATH = path.resolve(process.cwd(), "reports/volunteer-phase21-5-8-1-results.json");

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
    lifecycleReconciliationAudit: {},
    safeguardingAudit: {},
    formContractValidationAudit: {},
    homepageFiveSectionAudit: {},
    viewportsTested: [],
    reducedMotionTest: {},
    consoleErrors: [],
  };

  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      results.consoleErrors.push(msg.text());
      console.error(`[Browser Console Error]: ${msg.text()}`);
    }
  });

  try {
    // 1. Audit /volunteer Route & Hero
    console.log("Navigating to /volunteer...");
    const volResponse = await page.goto(`${BASE_URL}/volunteer`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    const httpStatus = volResponse?.status() ?? 0;
    const heroTitle = await page.$eval("h1", (el) => el.textContent?.trim() || "");
    const heroDesc = await page.$eval("section p", (el) => el.textContent?.trim() || "");

    // 2. Audit Opportunities (Exactly 6 tracks, with verified titles and status badges)
    console.log("Auditing opportunity classifications & track titles...");
    const opportunityCards = await page.$$eval("#opportunities .grid > div", (els) =>
      els.map((el) => {
        const title = el.querySelector("h3")?.textContent?.trim() || "";
        const badge = el.querySelector("span.uppercase")?.textContent?.trim() || "";
        const note = el.querySelector("p.italic")?.textContent?.trim() || "";
        return { title, badge, note };
      })
    );

    const opportunityBadges = opportunityCards.map((c) => c.badge);
    const opportunityTitles = opportunityCards.map((c) => c.title);

    const validClassifications = ["OPEN", "INTEREST REGISTRATION", "PLANNED", "CLOSED"];
    const badgesAreValid =
      opportunityBadges.length === 6 &&
      opportunityBadges.every((b) => validClassifications.includes(b));

    const interestRegCount = opportunityBadges.filter((b) => b === "INTEREST REGISTRATION").length;
    const plannedCount = opportunityBadges.filter((b) => b === "PLANNED").length;

    const expectedTitles = [
      "Remedial Education Mentor",
      "Digital Skills Guide",
      "Women's SHG Mentor",
      "Field Documentation Fellow",
      "Seasonal Jal Seva Kiosk Volunteer",
      "District Community Reading Hub Steward",
    ];

    const titlesMatch = expectedTitles.every((t) => opportunityTitles.includes(t));

    results.opportunityClassificationAudit = {
      opportunityCount: opportunityCards.length,
      badgesFound: opportunityBadges,
      badgesAreValid,
      interestRegistrationCount: interestRegCount,
      plannedCount: plannedCount,
      titlesMatch,
      titlesFound: opportunityTitles,
    };

    // 3. Audit Lifecycle Reconciliation
    console.log("Auditing lifecycle presentation & backend status reconciliation...");
    const lifecycleSectionTitle = await page.$eval("#lifecycle h2", (el) => el.textContent?.trim() || "");
    const lifecycleText = await page.$eval("#lifecycle", (el) => el.textContent || "");

    const lifecycleAudit = {
      hasReconciledHeading: lifecycleSectionTitle.includes("How the Participation Process is Expected to Work"),
      mentionsAwaitingOrientation: lifecycleText.includes("AWAITING_ORIENTATION"),
      mentionsUnderReview: lifecycleText.includes("UNDER_REVIEW"),
      mentionsOrientationCompleted: lifecycleText.includes("ORIENTATION_COMPLETED"),
      mentionsActiveMentor: lifecycleText.includes("ACTIVE_MENTOR"),
      clarifiesNoSelfServiceTracking: lifecycleText.includes("does not create an employment contract, automatic approval timeline, or self-service status-tracking portal"),
    };
    results.lifecycleReconciliationAudit = lifecycleAudit;

    // 4. Audit Safeguarding & Code of Conduct Callout
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

    // 5. Audit Form Contract Compatibility & Options Constraints
    console.log("Auditing volunteer form contract compatibility & field constraints...");
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

    // Evaluate max length of all select options
    const roleOptionsMaxLen = await page.$$eval("#vol-role option", (options) =>
      Math.max(...options.map((o) => o.value.length))
    );

    const modeOptionsMaxLen = await page.$$eval("#vol-mode option", (options) =>
      Math.max(...options.map((o) => o.value.length))
    );

    const availOptionsMaxLen = await page.$$eval("#vol-availability option", (options) =>
      Math.max(...options.map((o) => o.value.length))
    );

    const roleWithinLimit = roleOptionsMaxLen <= 50;
    const modeWithinLimit = modeOptionsMaxLen <= 30;
    const availWithinLimit = availOptionsMaxLen <= 50;

    const dataMinimizationBadge = await page.$eval("#register", (el) =>
      el.textContent?.includes("Data Minimization Protocol") || false
    );

    results.formContractValidationAudit = {
      totalFields: formFields.length,
      fieldNames,
      noSensitiveFields,
      hasMandatoryConsent,
      roleOptionsMaxLen,
      roleWithinLimit,
      modeOptionsMaxLen,
      modeWithinLimit,
      availOptionsMaxLen,
      availWithinLimit,
      dataMinimizationBadge,
    };

    // 6. Overall Volunteer Page Audit Verdict
    results.volunteerPageAudit = {
      httpStatus,
      heroTitle,
      hasCorrectHeading: heroTitle.includes("Bring Your Time. Share Your Skills. Strengthen a Community."),
      allChecksPassed:
        badgesAreValid &&
        titlesMatch &&
        lifecycleAudit.hasReconciledHeading &&
        safeguardingAudit.hasNonCommercialClause &&
        safeguardingAudit.hasSupervisionClause &&
        safeguardingAudit.hasDataPrivacyClause &&
        noSensitiveFields &&
        hasMandatoryConsent &&
        roleWithinLimit &&
        modeWithinLimit &&
        availWithinLimit &&
        dataMinimizationBadge,
    };

    console.log(
      `Volunteer Page Functional Integrity: HTTP ${httpStatus}, All Checks Passed: ${results.volunteerPageAudit.allChecksPassed}`
    );

    // 7. Test 10 Viewports for Horizontal Overflow & Visual Quality
    console.log("Beginning Viewport Overflow Audit for /volunteer across 10 viewports...");
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - document.documentElement.clientWidth;
      });

      const screenshotPath = path.join(SCREENSHOT_DIR, `volunteer_${vp.name}.png`);
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

    // 8. Verify Homepage 5-Section Architecture Preservation
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

    // 9. Test Reduced Motion behavior on /volunteer
    console.log("Testing prefers-reduced-motion on /volunteer...");
    const motionPage = await browser.newPage();
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

    console.log(`\nAudit complete! Results written to ${REPORT_PATH}`);
    fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2), "utf8");
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
