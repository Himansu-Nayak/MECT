import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = 3014;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = path.resolve("reports/screenshots/recent-work");
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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};

async function captureScreenshots() {
  console.log("========================================================");
  console.log("=== CAPTURING MECT RECENT WORK HIGH-RES SCREENSHOTS ===");
  console.log("========================================================");

  console.log(`Starting Next.js server on port ${PORT}...`);
  const serverProcess = spawn("node", ["server.js"], {
    cwd: path.resolve(".next/standalone"),
    stdio: "pipe",
    env: {
      ...process.env,
      PORT: String(PORT),
      HOSTNAME: "127.0.0.1",
      NODE_ENV: "production",
      ALLOW_DEV_FALLBACK: "true",
      ENABLE_DONOR_PORTAL: "true",
      NEXT_PUBLIC_ENABLE_DONOR_PORTAL: "true"
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
    
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
      bypassCSP: true
    });

    desktopContext.on("request", (req) => {
      if (req.url().includes("otp") || req.url().includes("auth") || req.url().includes("portal")) {
        console.log(`[REQ] ${req.method()} ${req.url()}`);
      }
    });

    desktopContext.on("requestfailed", (req) => {
      console.log(`[REQ FAILED] ${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
    });

    // Mock backend network routes on context level with proper CORS preflight handling
    await desktopContext.route("**/*", async (route) => {
      const url = route.request().url();
      if (url.includes("request-otp")) {
        console.log(`[ROUTED request-otp] ${route.request().method()} ${url}`);
        if (route.request().method() === "OPTIONS") {
          await route.fulfill({ status: 204, headers: CORS_HEADERS });
          return;
        }
        await route.fulfill({
          status: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            accepted: true,
            message: "Verification code dispatched via SMS.",
            channel: "PHONE",
            cooldownSeconds: 60,
            expiresInSeconds: 300
          })
        });
        return;
      }
      if (url.includes("verify-otp")) {
        console.log(`[ROUTED verify-otp] ${route.request().method()} ${url}`);
        if (route.request().method() === "OPTIONS") {
          await route.fulfill({ status: 204, headers: CORS_HEADERS });
          return;
        }
        await route.fulfill({
          status: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            accessToken: "mock-jwt-token-session",
            refreshToken: "mock-jwt-refresh-token",
            tokenType: "Bearer",
            expiresIn: 3600,
            userUuid: "usr_asha_patnaik_889",
            primaryPhone: "+919876543210",
            fullName: "Asha Patnaik",
            profileCompleted: true,
            roles: ["ROLE_DONOR"]
          })
        });
        return;
      }
      if (url.includes("dashboard")) {
        console.log(`[ROUTED dashboard] ${route.request().method()} ${url}`);
        if (route.request().method() === "OPTIONS") {
          await route.fulfill({ status: 204, headers: CORS_HEADERS });
          return;
        }
        await route.fulfill({
          status: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            account: {
              userUuid: "usr_asha_patnaik_889",
              primaryPhone: "+919876543210",
              status: "ACTIVE",
              profileCompleted: true,
              deletionRequested: false,
              roles: ["ROLE_DONOR"],
              isDonor: true,
              verifiedContacts: [],
              profile: {
                fullName: "Asha Patnaik",
                addressLine: "Shanti Nagar",
                city: "Balangir",
                state: "Odisha",
                pinCode: "767001",
                country: "India",
                preferredLanguage: "English",
                panProvided: true,
                updatedAt: new Date().toISOString()
              },
              preferences: {
                emailReceiptsEnabled: true,
                emailUpdatesEnabled: true,
                whatsappOptIn: true,
                whatsappPhoneNumber: "+919876543210",
                whatsappConsentUpdatedAt: new Date().toISOString()
              }
            },
            donationSummary: {
              totalSuccessfulAmount: 0,
              successfulCount: 0,
              pendingCount: 0,
              failedCount: 0,
              latestDonation: null
            },
            donationHistory: []
          })
        });
        return;
      }
      if (url.includes("claim")) {
        console.log(`[ROUTED claim] ${route.request().method()} ${url}`);
        if (route.request().method() === "OPTIONS") {
          await route.fulfill({ status: 204, headers: CORS_HEADERS });
          return;
        }
        await route.fulfill({
          status: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            success: true,
            reference: "MECT-UTR-2026-BD1203",
            status: "PENDING_VERIFICATION",
            message: "Your SBI remittance claim has been recorded and queued for daily ledger reconciliation."
          })
        });
        return;
      }
      await route.continue();
    });

    const page = await desktopContext.newPage();
    page.on("console", (msg) => console.log(`[PAGE LOG] ${msg.text()}`));
    page.on("pageerror", (err) => console.log(`[PAGE ERROR] ${err.message}`));

    async function saveScreenshot(filename, clipOrFull = {}) {
      const targetPath = path.join(OUTPUT_DIR, filename);
      await page.screenshot({ path: targetPath, ...clipOrFull });
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
    // Select Education Programme
    await page.locator("label:has-text('Education & Learning Support')").click();
    await page.waitForTimeout(300);
    await saveScreenshot("01_step1_programme_selection.png", { fullPage: true });

    // 2. STEP 2: Donation Amount Selection
    console.log("Capturing Step 2: Donation Amount...");
    await page.locator("button:has-text('Continue to Amount')").click();
    await page.waitForSelector("text=Select Donation Amount", { state: "visible" });
    // Select ₹2,500 preset
    await page.locator("button:has-text('₹2,500')").click();
    await page.waitForTimeout(400);
    await saveScreenshot("02_step2_amount_selection.png", { fullPage: true });

    // 3. STEP 3: Donor Authentication (Identity screen)
    console.log("Capturing Step 3: Donor Authentication (Identity)...");
    await page.locator("button:has-text('Continue to Verification')").click();
    await page.waitForSelector("text=Verify Your Donor Account", { state: "visible" });
    await page.locator("input#auth-fullname").fill("Asha Patnaik");
    await page.waitForTimeout(400);
    await saveScreenshot("03a_step3_auth_identity.png", { fullPage: true });

    // 3b. Step 3: Location screen
    console.log("Capturing Step 3: Location Selection...");
    await page.locator("button:has-text('Continue with Mobile Number')").click();
    await page.waitForSelector("text=Where are you contributing from?", { state: "visible" });
    await page.locator("button:has-text('Balangir')").click();
    await page.waitForTimeout(300);
    await saveScreenshot("03b_step3_auth_location.png", { fullPage: true });

    // 3c. Step 3: Mobile Phone Number screen
    console.log("Capturing Step 3: Contact Screen...");
    await page.locator("button:has-text('Continue')").click();
    await page.waitForSelector("text=Enter your mobile number", { state: "visible" });
    await page.locator("input#auth-phone").fill("9876543210");
    await page.waitForTimeout(400);
    await saveScreenshot("03c_step3_auth_contact.png", { fullPage: true });

    // 3d. Step 3: 6-Cell OTP verification
    console.log("Capturing Step 3: 6-Cell OTP Screen...");
    await page.locator("button:has-text('Get Verification Code')").click();
    await page.waitForSelector("text=Verify Your Mobile Number", { state: "visible" });
    await page.waitForTimeout(300);
    // Fill 6 digits: 1 2 3 4 5 6
    const otpCells = page.locator("input[aria-label^='Digit']");
    for (let i = 0; i < 6; i++) {
      await otpCells.nth(i).fill(String(i + 1));
    }
    await page.waitForTimeout(400);
    await saveScreenshot("03d_step3_auth_otp.png", { fullPage: true });

    // 4. STEP 4: Donor Details for Official Receipt
    console.log("Capturing Step 4: Donor Identification...");
    await page.waitForSelector("text=Donor Details for Official Receipt", { state: "visible" });
    // Fill Donor Details
    await page.locator("input#donor-email").fill("asha.patnaik@example.org");
    await page.locator("input#donor-pan").fill("AADTM5474F");
    await page.locator("input#donor-address").fill("Shanti Nagar, Balangir, Odisha 767001");
    await page.waitForTimeout(400);
    await saveScreenshot("04_step4_donor_details.png", { fullPage: true });

    // 5. STEP 5: Review Contribution Summary
    console.log("Capturing Step 5: Review Summary...");
    await page.locator("button:has-text('Continue to Review')").click();
    await page.waitForSelector("text=Review Contribution Summary", { state: "visible" });
    await page.waitForTimeout(400);
    await saveScreenshot("05_step5_review_summary.png", { fullPage: true });

    // 6. STEP 6: Payment Remittance Channels
    console.log("Capturing Step 6: Payment Execution...");
    await page.locator("button:has-text('Proceed to Payment')").click();
    await page.waitForSelector("text=Select Active Payment Channel", { state: "visible" });
    await page.locator("input#utr-reference").fill("SBIN202611260089");
    await page.waitForTimeout(400);
    await saveScreenshot("06_step6_payment_remittance.png", { fullPage: true });

    // 7. STEP 7: Confirmation & Reconciliation Status
    console.log("Capturing Step 7: Confirmation...");
    await page.locator("button:has-text('Submit Remittance Claim')").click();
    await page.waitForSelector("text=Contribution Recorded Successfully", { state: "visible", timeout: 10000 });
    await page.waitForTimeout(600);
    await saveScreenshot("07_step7_confirmation.png", { fullPage: true });

    // 8. OPTIONAL LOGIN & REGISTER PAGES (If enabled)
    try {
      console.log("Checking Login Page (/login)...");
      const anonContext = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        deviceScaleFactor: 2,
        bypassCSP: true
      });
      const anonPage = await anonContext.newPage();
      const res = await anonPage.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded", timeout: 8000 });
      if (res && res.status() === 200) {
        await anonPage.waitForSelector("text=Institutional Portal", { timeout: 4000 });
        const loginPath = path.join(OUTPUT_DIR, "08_login_page.png");
        await anonPage.screenshot({ path: loginPath, fullPage: true });
        fs.copyFileSync(loginPath, path.join(ARTIFACT_DIR, "08_login_page.png"));
        capturedFiles.push({ filename: "08_login_page.png", localPath: loginPath, artifactPath: path.join(ARTIFACT_DIR, "08_login_page.png") });
        console.log("[CAPTURED] 08_login_page.png");

        const regRes = await anonPage.goto(`${BASE_URL}/register`, { waitUntil: "domcontentloaded", timeout: 8000 });
        if (regRes && regRes.status() === 200) {
          await anonPage.waitForSelector("text=Donor Community", { timeout: 4000 });
          const regPath = path.join(OUTPUT_DIR, "09_register_page.png");
          await anonPage.screenshot({ path: regPath, fullPage: true });
          fs.copyFileSync(regPath, path.join(ARTIFACT_DIR, "09_register_page.png"));
          capturedFiles.push({ filename: "09_register_page.png", localPath: regPath, artifactPath: path.join(ARTIFACT_DIR, "09_register_page.png") });
          console.log("[CAPTURED] 09_register_page.png");
        }
      } else {
        console.log("Donor portal routes gated by feature flag (HTTP 404 expected). Skipping login/register screenshots.");
      }
      await anonContext.close();
    } catch (err) {
      console.log("Skipping login/register screenshots (feature flag inactive).");
    }

    // 10. MOBILE VIEWPORT SCREENSHOTS (iPhone 14 - 390x844)
    console.log("Capturing Mobile Viewport Screenshot (/donate Step 2)...");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      bypassCSP: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });
    await mobilePage.waitForSelector("text=General Charitable Fund");
    await mobilePage.locator("button:has-text('Continue to Amount')").click();
    await mobilePage.waitForSelector("text=Select Donation Amount");
    await mobilePage.waitForTimeout(500);
    const mPath = path.join(OUTPUT_DIR, "10_mobile_step2_amount.png");
    await mobilePage.screenshot({ path: mPath, fullPage: true });
    fs.copyFileSync(mPath, path.join(ARTIFACT_DIR, "10_mobile_step2_amount.png"));
    capturedFiles.push({ filename: "10_mobile_step2_amount.png", localPath: mPath, artifactPath: path.join(ARTIFACT_DIR, "10_mobile_step2_amount.png") });
    console.log("[CAPTURED] 10_mobile_step2_amount.png");

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
