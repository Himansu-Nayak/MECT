import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const ARTIFACT_DIR = "C:\\Users\\himan\\.gemini\\antigravity\\brain\\255a9b69-48ce-42ba-9f45-36878b63452e\\screenshots";
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runAcceptanceAudit() {
  console.log("========================================================");
  console.log("=== LIVE PRODUCTION BROWSER ACCEPTANCE AUDIT ===");
  console.log("=== Target: https://mect.org.in/donate ===");
  console.log("========================================================");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  });

  const page = await context.newPage();

  const auditReport = {
    url: "https://mect.org.in/donate",
    timestamp: new Date().toISOString(),
    tests: {},
    consoleErrors: [],
    networkRequests: []
  };

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log(`[Browser Console ERROR] ${msg.text()}`);
      auditReport.consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    console.error(`[Browser PageError] ${err.message}`);
    auditReport.consoleErrors.push(err.message);
  });

  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("cashfree") || url.includes("/api/")) {
      auditReport.networkRequests.push({ method: req.method(), url });
      console.log(`[Network Request] ${req.method()} ${url}`);
    }
  });

  // 1. Initial Page Load
  console.log("\n--- Gate 1: Loading /donate ---");
  const resp = await page.goto("https://mect.org.in/donate", { waitUntil: "networkidle", timeout: 30000 });
  auditReport.tests.initialStatusCode = resp.status();
  console.log(`HTTP Status: ${resp.status()}`);

  const html = await page.content();
  const hasRawLoadingText = html.includes("Loading donation journey...");
  auditReport.tests.hasRawLoadingText = hasRawLoadingText;
  console.log(`Old "Loading donation journey..." present in DOM: ${hasRawLoadingText}`);

  const policyText = await page.$eval(".bg-sand\\/20", el => el.innerText).catch(() => "Not found");
  auditReport.tests.policyBannerText = policyText;
  console.log(`Policy Banner Text:\n${policyText}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, "gate1_desktop_donate_portal.png"), fullPage: true });
  console.log("Captured gate1_desktop_donate_portal.png");

  // 2. Step 1: Select Programme
  console.log("\n--- Gate 2: Step 1 Programme Selection ---");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "gate2_step1_programme_select.png") });
  const step1Btn = await page.waitForSelector("button:has-text('Continue to Amount')", { timeout: 5000 });
  await step1Btn.click();
  await page.waitForTimeout(1000);

  // 3. Step 2: Select Amount (500)
  console.log("\n--- Gate 3: Step 2 Amount Selection ---");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "gate3_step2_amount_selection.png") });
  const step2Btn = await page.waitForSelector("button:has-text('Continue to Verification')", { timeout: 5000 });
  await step2Btn.click();
  await page.waitForTimeout(1000);

  // 4. Step 3: Auth & Guest Checkout Option
  console.log("\n--- Gate 4: Step 3 Donor Auth & Guest Option ---");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "gate4_step3_auth_and_guest.png") });

  const guestBtn = await page.$("button:has-text('Continue as Guest (Direct Details)')");
  auditReport.tests.guestButtonPresent = guestBtn !== null;
  console.log(`"Continue as Guest (Direct Details)" button visible: ${guestBtn !== null}`);

  if (guestBtn) {
    console.log("Clicking 'Continue as Guest (Direct Details)'...");
    await guestBtn.click();
    await page.waitForTimeout(1000);
  } else {
    throw new Error("Guest checkout button was not found in Step 3!");
  }

  // 5. Step 4: Donor Details Form
  console.log("\n--- Gate 5: Step 4 Donor Details ---");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "gate5_step4_donor_details.png") });

  await page.fill("#donor-name", "Dr. Ramesh Chandra Sahoo");
  await page.fill("#donor-email", "ramesh.sahoo@example.org");
  await page.fill("#donor-phone", "9437100000");

  await page.screenshot({ path: path.join(ARTIFACT_DIR, "gate5_step4_donor_details_filled.png") });

  const step4Btn = await page.waitForSelector("button:has-text('Continue to Review')", { timeout: 5000 });
  await step4Btn.click();
  await page.waitForTimeout(1000);

  // 6. Step 5: Review Summary
  console.log("\n--- Gate 6: Step 5 Review Summary ---");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "gate6_step5_review_summary.png") });

  const step5Btn = await page.waitForSelector("button:has-text('Proceed to Payment')", { timeout: 5000 });
  await step5Btn.click();
  await page.waitForTimeout(1000);

  // 7. Step 6: Payment Remittance & Cashfree Gateway Default
  console.log("\n--- Gate 7: Step 6 Payment Remittance Selection ---");
  await page.screenshot({ path: path.join(ARTIFACT_DIR, "gate7_step6_payment_options.png") });

  const paymentPageContent = await page.content();
  const cashfreeActive = paymentPageContent.includes("Pay Online (Cashfree)") || paymentPageContent.includes("Cashfree");
  auditReport.tests.cashfreeOptionRendered = cashfreeActive;
  console.log(`Cashfree payment option visible in Step 6: ${cashfreeActive}`);

  // Check if Cashfree checkout button exists
  const cfPayBtn = await page.$("button:has-text('Proceed to Cashfree Checkout')");
  auditReport.tests.cashfreeButtonPresent = cfPayBtn !== null;
  console.log(`'Proceed to Cashfree Checkout' button present: ${cfPayBtn !== null}`);

  // Check if Direct Bank / UPI option is also available
  const bankOption = await page.$("button:has-text('Direct Bank / UPI')");
  auditReport.tests.directBankOptionAvailable = bankOption !== null;
  console.log(`'Direct Bank / UPI' option available: ${bankOption !== null}`);

  // 8. Mobile Viewport Check (375x812)
  console.log("\n--- Gate 8: Mobile Viewport Audit (375x812) ---");
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("https://mect.org.in/donate", { waitUntil: "networkidle", timeout: 30000 });
  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, "gate8_mobile_donate_portal.png"), fullPage: true });
  console.log("Captured gate8_mobile_donate_portal.png");

  await browser.close();

  // Save audit JSON
  fs.writeFileSync(
    path.join(ARTIFACT_DIR, "phase36_live_acceptance_audit.json"),
    JSON.stringify(auditReport, null, 2)
  );

  console.log("\n========================================================");
  console.log("✅ LIVE BROWSER ACCEPTANCE AUDIT COMPLETED SUCCESSFULLY!");
  console.log("========================================================");
}

runAcceptanceAudit().catch((err) => {
  console.error("FATAL AUDIT FAILURE:", err);
  process.exit(1);
});
