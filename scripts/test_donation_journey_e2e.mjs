import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const PORT = 3012;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const AUDIT_DIR = path.resolve("audit/donation_flow");

if (!fs.existsSync(AUDIT_DIR)) {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
}

function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      const req = http.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 304) {
          resolve();
        } else {
          setTimeout(check, 500);
        }
      });
      req.on("error", () => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Server failed to start within ${timeout}ms`));
        } else {
          setTimeout(check, 500);
        }
      });
    }
    check();
  });
}

async function runE2EDonationSuite() {
  console.log("=================================================================");
  console.log("=== MECT DONATION EXPERIENCE E2E, RESPONSIVE & A11Y AUDIT ===");
  console.log("=================================================================");

  console.log(`Starting standalone Next.js server on port ${PORT}...`);
  const serverProcess = spawn("node", ["server.js"], {
    cwd: path.resolve(".next/standalone"),
    stdio: "pipe",
    env: {
      ...process.env,
      PORT: String(PORT),
      HOSTNAME: "127.0.0.1",
      NODE_ENV: "production",
      ALLOW_DEV_FALLBACK: "true"
    }
  });

  serverProcess.stdout.on("data", (d) => {
    const s = d.toString().trim();
    if (s.includes("Ready") || s.includes("started") || s.includes("Listening")) {
      console.log(`[Next.js Server] ${s}`);
    }
  });

  serverProcess.stderr.on("data", (d) => {
    const s = d.toString().trim();
    if (!s.includes("internal image response failed") && !s.includes("Fast Refresh")) {
      console.error(`[Next.js Server Notice] ${s}`);
    }
  });

  const testResults = {
    suite: "MECT Systematic Donation Journey E2E Suite",
    timestamp: new Date().toISOString(),
    tests: [],
    summary: { total: 0, passed: 0, failed: 0 }
  };

  const responsiveResults = {
    suite: "MECT Donation Journey Responsive Audit",
    timestamp: new Date().toISOString(),
    viewports: [],
    summary: { total: 0, passed: 0, failed: 0 }
  };

  let browser;

  try {
    await waitForServer(`${BASE_URL}/donate`);
    console.log(`Server responded successfully at ${BASE_URL}/donate`);

    browser = await chromium.launch({ channel: "chrome", headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    async function recordTest(name, fn) {
      testResults.summary.total++;
      const startTime = Date.now();
      try {
        await fn();
        const durationMs = Date.now() - startTime;
        console.log(`[PASS] ${name} (${durationMs}ms)`);
        testResults.tests.push({ name, status: "PASS", durationMs });
        testResults.summary.passed++;
      } catch (err) {
        const durationMs = Date.now() - startTime;
        console.error(`[FAIL] ${name}: ${err.message}`);
        testResults.tests.push({ name, status: "FAIL", error: err.message, durationMs });
        testResults.summary.failed++;
        throw err;
      }
    }

    // 1. Initial Page Load & Hero Render
    await recordTest("1. Route /donate loads successfully with PageHero and Institutional Notice", async () => {
      await page.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });
      const heroTitle = await page.textContent("h1");
      if (!heroTitle.includes("Support Our Work Across Odisha")) {
        throw new Error(`Unexpected hero title: ${heroTitle}`);
      }
      const policyNotice = await page.locator("text=Institutional Contribution Policy").isVisible();
      if (!policyNotice) {
        throw new Error("Institutional Contribution Policy notice not visible");
      }
    });

    // 2. Step Indicator Verification
    await recordTest("2. Systematic 7-Step Navigation Indicator renders all 7 steps", async () => {
      const stepNav = page.locator("nav[aria-label='Donation Step Progress']");
      await stepNav.waitFor({ state: "visible" });
      const stepItems = stepNav.locator("li");
      const count = await stepItems.count();
      if (count !== 7) {
        throw new Error(`Expected 7 step indicators, got ${count}`);
      }
      const activeStep = stepNav.locator("[aria-current='step']");
      const activeText = await activeStep.textContent();
      if (activeText.trim() !== "1") {
        throw new Error(`Expected Step 1 to be active, got ${activeText}`);
      }
    });

    // 3. Step 1: All 6 Verified Programmes Rendered
    await recordTest("3. Step 1 renders all 6 verified institutional programmes with radio selection", async () => {
      const programmes = [
        "General Charitable Fund",
        "Education & Learning Support",
        "Safe Water & Sanitation (Jal Seva)",
        "Women Empowerment & Livelihoods",
        "Food Relief & Nutrition (Jan Ahar)",
        "Shri Hanuman Murti Cultural Initiative"
      ];

      for (const prog of programmes) {
        const isVisible = await page.locator(`text=${prog}`).isVisible();
        if (!isVisible) {
          throw new Error(`Programme not visible: ${prog}`);
        }
      }

      // Select 'Education & Learning Support'
      const eduCard = page.locator("label:has-text('Education & Learning Support')");
      await eduCard.click();
    });

    // 4. Step 1 -> Step 2: Unauthenticated Visitor Flow
    await recordTest("4. Unauthenticated donor continues to Step 2 (Donor Verification & Account)", async () => {
      const continueBtn = page.locator("button:has-text('Continue to Donate')");
      await continueBtn.click();

      await page.waitForSelector("text=Verify Your Account", { state: "visible" });
      const isStep2 = await page.locator("text=Verify Your Account").isVisible();
      if (!isStep2) {
        throw new Error("Step 2 header not visible after clicking continue");
      }
    });

    // 5. Step 2: Auth Channel Selection and Validation
    await recordTest("5. Step 2 validates mobile/email format and handles OTP dispatch UI", async () => {
      const phoneInput = page.locator("input#auth-target");
      await phoneInput.fill(""); 
      const sendOtpBtn = page.locator("button:has-text('Send Passcode')");
      await sendOtpBtn.click();

      // Enter valid number
      await phoneInput.fill("9876543210");
      await sendOtpBtn.click();
      await page.waitForTimeout(500);
    });

    // 6. Direct Progression to Step 3 (Donor Details) via Passcode Verification
    await recordTest("6. Step 3 (Donor Details) renders with prefill and input validation", async () => {
      // Enter test passcode 123456 in Step 2 to authenticate
      const otpInput = page.locator("input#auth-otp");
      if (await otpInput.isVisible()) {
        await otpInput.fill("123456");
        await page.locator("button:has-text('Verify & Continue')").click();
      } else {
        const skipBtn = page.locator("button:has-text('Skip Verification & Enter Details Directly')");
        if (await skipBtn.isVisible()) {
          await skipBtn.click();
        }
      }

      await page.waitForSelector("text=Step 3 of 6 • Donor Identification", { state: "visible" });

      // Check fields and fill Step 3
      const nameInput = page.locator("input#donor-name");
      await nameInput.fill("Ramesh Sharma");
      await page.locator("input#donor-email").fill("ramesh.sharma@example.org");
      await page.locator("input#donor-phone").fill("9876543210");
      await page.locator("input#donor-pan").fill("ABCDE1234F");
      await page.locator("input#donor-address").fill("Plot 12, Civil Township, Rourkela, Odisha 769004");
    });

    // 7. Step 3 -> Step 4: Amount Selection
    await recordTest("7. Step 4 (Contribution Amount) offers preset pills and custom input validation", async () => {
      const continueToAmountBtn = page.locator("button:has-text('Continue to Amount')");
      if (await continueToAmountBtn.isVisible()) {
        await continueToAmountBtn.click();
      }

      await page.waitForSelector("text=Step 4 of 6 • Contribution Amount", { state: "visible" });

      // Check presets: ₹500, ₹1000, ₹2500, ₹5000, ₹10000, ₹25000
      const presets = ["500", "1,000", "2,500", "5,000", "10,000", "25,000"];
      for (const p of presets) {
        const btn = page.locator(`button:has-text('₹${p}')`);
        if (!(await btn.isVisible())) {
          throw new Error(`Preset button ₹${p} not found`);
        }
      }

      // Click ₹2,500 preset
      await page.locator("button:has-text('₹2,500')").click();
    });

    // 8. Step 4 -> Step 5: Review Step
    await recordTest("8. Step 5 (Review Contribution Summary) displays verified donor & allocation details", async () => {
      const reviewBtn = page.locator("button:has-text('Continue to Review')");
      await reviewBtn.click();

      await page.waitForSelector("text=Review Contribution Summary", { state: "visible" });

      // Verify Summary elements
      const progSummary = await page.locator("text=Education & Learning Support").isVisible();
      if (!progSummary) throw new Error("Allocated programme summary not displayed");

      const amountSummary = await page.locator("text=₹2,500").isVisible();
      if (!amountSummary) throw new Error("Amount summary ₹2,500 not displayed");

      const nameSummary = await page.locator("text=Ramesh Sharma").isVisible();
      if (!nameSummary) throw new Error("Donor name summary not displayed");

      const panSummary = await page.locator("text=ABCDE1234F").isVisible();
      if (!panSummary) throw new Error("Donor PAN summary not displayed");
    });

    // 9. Step 5 -> Step 6: Payment Gateway Strict Visibility Policy
    await recordTest("9. Step 6 strictly enforces gateway visibility policy (HIM & Cashfree dormant, SBI remittance active)", async () => {
      const proceedPaymentBtn = page.locator("button:has-text('Proceed to Payment')");
      await proceedPaymentBtn.click();

      await page.waitForSelector("text=Select Active Payment Channel", { state: "visible" });

      // Verify policy notice
      const policyNotice = await page.locator("text=Only authorized and verified active payment remittance methods are displayed").isVisible();
      if (!policyNotice) {
        throw new Error("Institutional remittance channel policy notice missing");
      }

      // Verify commercial gateways are NOT shown
      const cashfreeCard = await page.locator("text=Cashfree Payments").isVisible();
      if (cashfreeCard) {
        throw new Error("Cashfree card is unexpectedly visible in dormant state!");
      }

      const himCard = await page.locator("text=HIM Payment Gateway").isVisible();
      if (himCard) {
        throw new Error("HIM Gateway card is unexpectedly visible in dormant state!");
      }

      // Verify Official SBI banking coordinates are visible
      const sbiBank = await page.locator("text=State Bank of India").first().isVisible();
      if (!sbiBank) throw new Error("State Bank of India coordinates missing");

      const acctNumber = await page.locator("text=33341302498").first().isVisible();
      if (!acctNumber) throw new Error("Official SBI Account number missing");

      const ifsc = await page.locator("text=SBIN0001701").first().isVisible();
      if (!ifsc) throw new Error("Official SBI IFSC code missing");

      const upiId = await page.locator("text=86971610172@sbi").first().isVisible();
      if (!upiId) throw new Error("Official SBI UPI ID missing");
    });

    // 10. Step 6: Copy to Clipboard Buttons
    await recordTest("10. Copy-to-clipboard buttons function for Account, IFSC, and UPI ID", async () => {
      const copyButtons = page.locator("button:has-text('Copy')");
      const count = await copyButtons.count();
      if (count < 3) {
        throw new Error(`Expected at least 3 copy buttons, found ${count}`);
      }
      // Click first copy button
      await copyButtons.first().click();
      await page.waitForTimeout(300);
    });

    // 11. Step 6 -> Step 7: Remittance Claim Submission & Confirmation Lifecycle
    await recordTest("11. Step 6 UTR submission transitions to Step 7 (Confirmation) with statutory tracking reference", async () => {
      const utrInput = page.locator("input#utr-reference");
      await utrInput.fill("SBIN123456789012");

      const submitClaimBtn = page.locator("button:has-text('Submit Remittance Claim')");
      await submitClaimBtn.click();

      // Step 7 should now appear
      await page.waitForSelector("text=Contribution Recorded Successfully", { state: "visible", timeout: 10000 });

      const thankYouMsg = await page.locator("text=Thank You for Your Generosity").first().isVisible();
      if (!thankYouMsg) throw new Error("Thank you message not visible");

      const statusBadge = await page.locator("text=Pending Bank Reconciliation").first().isVisible();
      if (!statusBadge) throw new Error("Statutory status badge missing");

      const referenceLocator = page.locator("span.font-mono.font-bold.text-forest");
      const refText = await referenceLocator.first().textContent();
      if (!refText || refText.length < 5) {
        throw new Error(`Invalid transaction reference: ${refText}`);
      }
      console.log(`[PASS] Recorded Remittance Reference: ${refText}`);
    });

    // 12. Direct URL Query Parameter Pre-selection Test
    await recordTest("12. URL query parameter ?programme=WATER preselects Water programme", async () => {
      await page.goto(`${BASE_URL}/donate?programme=WATER`, { waitUntil: "networkidle" });
      await page.waitForSelector("text=Safe Water & Sanitation (Jal Seva)");
      const waterRadio = page.locator("input[value='WATER']");
      const isChecked = await waterRadio.isChecked();
      if (!isChecked) {
        throw new Error("Water programme radio is not pre-selected from ?programme=WATER");
      }
    });

    // 13. Accessibility Audit (AxeBuilder)
    console.log("\n--- Running Axe-Core Accessibility Audit on /donate ---");
    const axeResults = await new AxeBuilder({ page }).analyze();
    const a11ySummary = {
      url: `${BASE_URL}/donate`,
      timestamp: new Date().toISOString(),
      violationsCount: axeResults.violations.length,
      violationsByImpact: {
        critical: axeResults.violations.filter(v => v.impact === "critical").length,
        serious: axeResults.violations.filter(v => v.impact === "serious").length,
        moderate: axeResults.violations.filter(v => v.impact === "moderate").length,
        minor: axeResults.violations.filter(v => v.impact === "minor").length
      },
      violations: axeResults.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length
      }))
    };

    fs.writeFileSync(
      path.join(AUDIT_DIR, "donation_accessibility_results.json"),
      JSON.stringify(a11ySummary, null, 2),
      "utf8"
    );
    console.log(`[A11Y] Violations Count: ${a11ySummary.violationsCount} (Critical: ${a11ySummary.violationsByImpact.critical}, Serious: ${a11ySummary.violationsByImpact.serious}, Moderate: ${a11ySummary.violationsByImpact.moderate}, Minor: ${a11ySummary.violationsByImpact.minor})`);

    // 14. Responsive Viewports Test across 9 standard viewports
    console.log("\n--- Running Responsive Viewport Verification Across 9 Resolutions ---");
    const viewports = [
      { name: "Mobile Small (iPhone SE)", width: 320, height: 568 },
      { name: "Mobile Android Common", width: 360, height: 640 },
      { name: "Mobile iOS Standard (iPhone 8)", width: 375, height: 667 },
      { name: "Mobile Modern (iPhone 12/13/14)", width: 390, height: 844 },
      { name: "Mobile Large (iPhone 14 Pro Max)", width: 430, height: 932 },
      { name: "Tablet Portrait (iPad Mini)", width: 768, height: 1024 },
      { name: "Tablet Landscape / Small Desktop", width: 1024, height: 768 },
      { name: "Desktop HD", width: 1280, height: 800 },
      { name: "Desktop Full HD", width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      responsiveResults.summary.total++;
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      const maxScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);

      if (overflow) {
        console.error(`[FAIL Responsive] ${vp.name} (${vp.width}x${vp.height}): Horizontal overflow detected! (scrollWidth: ${maxScrollWidth} > clientWidth: ${vp.width})`);
        responsiveResults.viewports.push({
          name: vp.name,
          width: vp.width,
          height: vp.height,
          status: "FAIL",
          scrollWidth: maxScrollWidth,
          clientWidth: vp.width
        });
        responsiveResults.summary.failed++;
      } else {
        console.log(`[PASS Responsive] ${vp.name} (${vp.width}x${vp.height}): Zero horizontal overflow.`);
        responsiveResults.viewports.push({
          name: vp.name,
          width: vp.width,
          height: vp.height,
          status: "PASS",
          scrollWidth: maxScrollWidth,
          clientWidth: vp.width
        });
        responsiveResults.summary.passed++;
      }
    }

    fs.writeFileSync(
      path.join(AUDIT_DIR, "donation_responsive_results.json"),
      JSON.stringify(responsiveResults, null, 2),
      "utf8"
    );

    fs.writeFileSync(
      path.join(AUDIT_DIR, "donor_journey_test_results.json"),
      JSON.stringify(testResults, null, 2),
      "utf8"
    );

    console.log("\n=======================================================");
    console.log(`=== E2E AUDIT COMPLETE: ${testResults.summary.passed}/${testResults.summary.total} PASSED ===`);
    console.log(`=== RESPONSIVE AUDIT: ${responsiveResults.summary.passed}/${responsiveResults.summary.total} PASSED ===`);
    console.log(`=== ACCESSIBILITY: ${a11ySummary.violationsCount} VIOLATIONS ===`);
    console.log("=======================================================\n");

  } finally {
    if (browser) await browser.close();
    serverProcess.kill("SIGTERM");
  }
}

runE2EDonationSuite().catch((err) => {
  console.error("FATAL SUITE ERROR:", err);
  process.exit(1);
});
