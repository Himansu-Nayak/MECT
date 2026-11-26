import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = 3014;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = path.resolve("reports/screenshots/donation-flow");
const ARTIFACT_DIR = "C:\\Users\\himan\\.gemini\\antigravity\\brain\\255a9b69-48ce-42ba-9f45-36878b63452e\\screenshots";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
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

async function captureScreenshots() {
  console.log("========================================================");
  console.log("=== CAPTURING MECT DONATION FLOW HIGH-RES SCREENSHOTS ===");
  console.log("========================================================");

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

  let browser;
  const capturedFiles = [];

  try {
    await waitForServer(`${BASE_URL}/donate`);
    console.log(`Server responded successfully at ${BASE_URL}/donate`);

    browser = await chromium.launch({ channel: "chrome", headless: true });
    
    // Desktop Viewport Context
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2
    });
    const page = await desktopContext.newPage();

    async function saveScreenshot(filename, clipOrFull = {}) {
      const targetPath = path.join(OUTPUT_DIR, filename);
      await page.screenshot({ path: targetPath, ...clipOrFull });
      // copy to artifact directory
      const artifactPath = path.join(ARTIFACT_DIR, filename);
      fs.copyFileSync(targetPath, artifactPath);
      capturedFiles.push({ filename, localPath: targetPath, artifactPath });
      console.log(`[CAPTURED] ${filename}`);
    }

    // 1. STEP 1: Programme Selection
    console.log("Capturing Step 1: Programme Selection...");
    await page.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });
    await page.waitForSelector("text=General Charitable Fund");
    await page.waitForTimeout(600);
    await saveScreenshot("01_step1_programme_selection.png", { fullPage: true });

    // Select Education Programme
    await page.locator("label:has-text('Education & Learning Support')").click();
    await page.waitForTimeout(300);

    // 2. STEP 2: Account & Verification
    console.log("Capturing Step 2: Account Verification...");
    await page.locator("button:has-text('Continue to Donate')").click();
    await page.waitForSelector("text=Verify Your Account", { state: "visible" });
    await page.waitForTimeout(400);
    await saveScreenshot("02_step2_account_verification.png", { fullPage: true });

    // Send Passcode
    console.log("Capturing Step 2b: Passcode Entry...");
    await page.locator("input#auth-target").fill("9876543210");
    await page.locator("button:has-text('Send Passcode')").click();
    await page.waitForSelector("input#auth-otp", { state: "visible" });
    await page.waitForTimeout(400);
    await saveScreenshot("02b_step2_passcode_entry.png", { fullPage: true });

    // 3. STEP 3: Donor Identification & Tax Treatment
    console.log("Capturing Step 3: Donor Details...");
    await page.locator("input#auth-otp").fill("123456");
    await page.locator("button:has-text('Verify & Continue')").click();
    await page.waitForSelector("text=Step 3 of 6 • Donor Identification", { state: "visible" });
    
    // Fill Donor Details
    await page.locator("input#donor-name").fill("Ramesh Kumar Sharma");
    await page.locator("input#donor-email").fill("ramesh.sharma@example.org");
    await page.locator("input#donor-phone").fill("9876543210");
    await page.locator("input#donor-pan").fill("ABCDE1234F");
    await page.locator("input#donor-address").fill("Plot 12, Civil Township, Rourkela, Odisha 769004");
    await page.waitForTimeout(400);
    await saveScreenshot("03_step3_donor_details.png", { fullPage: true });

    // 4. STEP 4: Contribution Amount
    console.log("Capturing Step 4: Contribution Amount...");
    await page.locator("button:has-text('Continue to Amount')").click();
    await page.waitForSelector("text=Step 4 of 6 • Contribution Amount", { state: "visible" });
    // Select ₹2,500 preset
    await page.locator("button:has-text('₹2,500')").click();
    await page.waitForTimeout(400);
    await saveScreenshot("04_step4_amount_selection.png", { fullPage: true });

    // 5. STEP 5: Review Contribution Summary
    console.log("Capturing Step 5: Review Summary...");
    await page.locator("button:has-text('Continue to Review')").click();
    await page.waitForSelector("text=Review Contribution Summary", { state: "visible" });
    await page.waitForTimeout(400);
    await saveScreenshot("05_step5_review_summary.png", { fullPage: true });

    // 6. STEP 6: Payment Remittance Channels
    console.log("Capturing Step 6: Payment Execution & Approved Coordinates...");
    await page.locator("button:has-text('Proceed to Payment')").click();
    await page.waitForSelector("text=Select Active Payment Channel", { state: "visible" });
    await page.locator("input#utr-reference").fill("SBIN202611260089");
    await page.waitForTimeout(400);
    await saveScreenshot("06_step6_payment_remittance.png", { fullPage: true });

    // 7. STEP 7: Confirmation & Reconciliation Status
    console.log("Capturing Step 7: Confirmation & Receipt Lifecycle...");
    await page.locator("button:has-text('Submit Remittance Claim')").click();
    await page.waitForSelector("text=Contribution Recorded Successfully", { state: "visible", timeout: 10000 });
    await page.waitForTimeout(600);
    await saveScreenshot("07_step7_confirmation.png", { fullPage: true });

    // 8. MOBILE VIEWPORT SCREENSHOTS (iPhone 14 - 390x844)
    console.log("\nCapturing Mobile Viewport Screenshots (390x844)...");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2
    });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });
    await mobilePage.waitForSelector("text=General Charitable Fund");
    await mobilePage.waitForTimeout(500);
    const m1Path = path.join(OUTPUT_DIR, "08_mobile_step1_programme.png");
    await mobilePage.screenshot({ path: m1Path, fullPage: true });
    fs.copyFileSync(m1Path, path.join(ARTIFACT_DIR, "08_mobile_step1_programme.png"));
    capturedFiles.push({ filename: "08_mobile_step1_programme.png", localPath: m1Path, artifactPath: path.join(ARTIFACT_DIR, "08_mobile_step1_programme.png") });
    console.log("[CAPTURED] 08_mobile_step1_programme.png");

    console.log("\n========================================================");
    console.log(`=== ALL ${capturedFiles.length} SCREENSHOTS CAPTURED SUCCESSFULLY ===`);
    console.log(`Saved locally in: ${OUTPUT_DIR}`);
    console.log(`Copied to artifacts in: ${ARTIFACT_DIR}`);
    console.log("========================================================\n");

  } finally {
    if (browser) await browser.close();
    serverProcess.kill("SIGTERM");
  }
}

captureScreenshots().catch((err) => {
  console.error("FATAL CAPTURE ERROR:", err);
  process.exit(1);
});
