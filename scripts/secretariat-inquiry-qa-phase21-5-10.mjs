import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_5_10");
const REPORT_PATH = path.resolve(process.cwd(), "reports/secretariat-inquiry-phase21-5-10-results.json");

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
  console.log("=== MECT Phase 21.5.10 Public Secretariat Inquiry & Guidance Desk QA ===");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const results = {
    timestamp: new Date().toISOString(),
    viewports: {},
    interactiveSubmission: null,
    homepageFiveSections: [],
    passCount: 0,
    failCount: 0,
  };

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent: "MECT-QA-Agent/21.5.10",
      });
      const page = await context.newPage();

      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });
      page.on("pageerror", (err) => {
        consoleErrors.push(err.message);
      });

      // Route mock API handler for inquiries if needed
      await page.route("**/api/v1/public/inquiries", async (route) => {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            status: "SUCCESS",
            referenceId: 104,
            message: "Your inquiry has been successfully received by the MAHAVIR TRUST Secretariat.",
            timestamp: new Date().toISOString(),
          }),
        });
      });

      await page.goto(`${BASE_URL}/contact`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      const overflow = await page.evaluate(() => {
        const docEl = document.documentElement;
        return {
          scrollWidth: docEl.scrollWidth,
          clientWidth: docEl.clientWidth,
          hasHorizontalOverflow: docEl.scrollWidth > docEl.clientWidth,
          overflowPx: Math.max(0, docEl.scrollWidth - docEl.clientWidth),
        };
      });

      // Verify key elements
      const contentChecks = await page.evaluate(() => {
        const text = document.body.innerText;
        return {
          hasHeroTitle: text.includes("Public Secretariat Inquiry & Guidance Desk"),
          hasDirectDesks: text.includes("Reach the Appropriate Functional Desk"),
          hasScholarshipDesk: text.includes("Student Support Desk"),
          hasDonationsDesk: text.includes("Donations & CSR Desk"),
          hasCommunityDesk: text.includes("Community Initiatives"),
          hasSecretariatRecords: text.includes("Secretariat & Records"),
          hasBalangirOffice: text.includes("Balangir Trust Office"),
          hasBhubaneswarOffice: text.includes("Bhubaneswar Secretariat"),
          hasHandlingProcess: text.includes("How Inquiries Are Handled"),
          hasAntiFraudNotice: text.includes("Zero-Tolerance Notice: No Intermediaries or Processing Fees"),
          hasInquiryForm: !!document.getElementById("inquiry-form"),
          hasNameInput: !!document.getElementById("inquiry-name"),
          hasEmailInput: !!document.getElementById("inquiry-email"),
          hasPhoneInput: !!document.getElementById("inquiry-phone"),
          hasCategorySelect: !!document.getElementById("inquiry-category"),
          hasMessageTextarea: !!document.getElementById("inquiry-message"),
          hasConsentCheckbox: !!document.getElementById("inquiry-consent"),
        };
      });

      const screenshotFile = `contact-${vp.name}.png`;
      const screenshotPath = path.join(SCREENSHOT_DIR, screenshotFile);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      const viewportPassed =
        !overflow.hasHorizontalOverflow &&
        consoleErrors.length === 0 &&
        contentChecks.hasHeroTitle &&
        contentChecks.hasInquiryForm &&
        contentChecks.hasDirectDesks &&
        contentChecks.hasHandlingProcess &&
        contentChecks.hasAntiFraudNotice;

      if (viewportPassed) {
        results.passCount++;
      } else {
        results.failCount++;
      }

      results.viewports[vp.name] = {
        viewport: vp,
        overflow,
        consoleErrors,
        contentChecks,
        screenshot: screenshotFile,
        passed: viewportPassed,
      };

      console.log(`  Overflow: ${overflow.overflowPx}px | Console Errors: ${consoleErrors.length} | Status: ${viewportPassed ? "PASS" : "FAIL"}`);

      // Perform interactive submission test on 1280px
      if (vp.name === "1280px") {
        console.log("  Executing interactive form submission test on 1280px...");
        await page.fill("#inquiry-name", "Ananya Dash");
        await page.fill("#inquiry-email", "ananya.dash@example.org");
        await page.fill("#inquiry-phone", "+91 94371 88990");
        await page.selectOption("#inquiry-category", "Scholarship Guidance & Applications");
        await page.fill("#inquiry-message", "Seeking detailed guidance regarding required academic certificates for direct scholarship grants.");
        
        // Ensure consent is checked
        const isChecked = await page.isChecked("#inquiry-consent");
        if (!isChecked) {
          await page.check("#inquiry-consent");
        }

        // Submit form
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1000);

        const submissionResult = await page.evaluate(() => {
          const bodyText = document.body.innerText;
          return {
            hasSuccessMessage: bodyText.includes("Inquiry Logged in Secretariat Registry"),
            hasReferenceId: bodyText.includes("#104"),
            hasWhatHappensNext: bodyText.toLowerCase().includes("what happens next"),
            hasResetButton: bodyText.includes("Submit Another Communication"),
          };
        });

        const subScreenshotFile = "contact-submission-success-1280px.png";
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, subScreenshotFile), fullPage: false });

        results.interactiveSubmission = {
          ...submissionResult,
          screenshot: subScreenshotFile,
          passed:
            submissionResult.hasSuccessMessage &&
            submissionResult.hasReferenceId &&
            submissionResult.hasWhatHappensNext &&
            submissionResult.hasResetButton,
        };

        console.log(`  Submission Test: ${results.interactiveSubmission.passed ? "PASS" : "FAIL"} (Ref #104 displayed)`);

        // Test form reset
        await page.click('button:has-text("Submit Another Communication")');
        await page.waitForTimeout(500);

        const formReset = await page.evaluate(() => {
          return !!document.getElementById("inquiry-name");
        });
        results.interactiveSubmission.formResetPassed = formReset;
        console.log(`  Form Reset Test: ${formReset ? "PASS" : "FAIL"}`);
      }

      await context.close();
    }

    // 2. Homepage Five-Section Architecture Preservation Test
    console.log("\n=== Checking Homepage Five-Section Architecture Preservation ===");
    const homeContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const homePage = await homeContext.newPage();
    const homeConsoleErrors = [];
    homePage.on("console", (msg) => {
      if (msg.type() === "error") homeConsoleErrors.push(msg.text());
    });

    await homePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await homePage.waitForTimeout(1000);

    const homeSections = await homePage.evaluate(() => {
      const sectionIds = [
        "hero",
        "institutional-intro",
        "development-pillars",
        "stories",
        "institutional-impact",
      ];
      return sectionIds.map((id) => {
        const el = document.getElementById(id);
        return {
          id,
          exists: !!el,
          tagName: el ? el.tagName.toLowerCase() : null,
          role: el ? el.getAttribute("role") : null,
          ariaLabel: el ? el.getAttribute("aria-label") : null,
        };
      });
    });

    const homeOverflow = await homePage.evaluate(() => {
      const docEl = document.documentElement;
      return {
        scrollWidth: docEl.scrollWidth,
        clientWidth: docEl.clientWidth,
        hasOverflow: docEl.scrollWidth > docEl.clientWidth,
        overflowPx: Math.max(0, docEl.scrollWidth - docEl.clientWidth),
      };
    });

    results.homepageFiveSections = homeSections;
    results.homepageOverflow = homeOverflow;
    results.homepageConsoleErrors = homeConsoleErrors;

    const allSectionsPresent = homeSections.every((s) => s.exists);
    console.log(`  All 5 Homepage Sections Present: ${allSectionsPresent ? "PASS" : "FAIL"}`);
    homeSections.forEach((s) => {
      console.log(`    #${s.id}: ${s.exists ? "FOUND" : "MISSING"} (${s.tagName})`);
    });
    console.log(`  Homepage Overflow: ${homeOverflow.overflowPx}px | Console Errors: ${homeConsoleErrors.length}`);

    await homePage.screenshot({
      path: path.join(SCREENSHOT_DIR, "homepage-preservation-1440px.png"),
      fullPage: false,
    });
    await homeContext.close();
  } finally {
    await browser.close();
    fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2));
    console.log(`\nResults written to: ${REPORT_PATH}`);
    console.log(`Overall: ${results.passCount} passed, ${results.failCount} failed.`);
  }
}

run().catch((err) => {
  console.error("QA Test execution failed:", err);
  process.exit(1);
});
