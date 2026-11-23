import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3292;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SCREENSHOTS_DIR = path.resolve(process.cwd(), "reports/mect-phase-29-1/screenshots");

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Timeout waiting for server at ${url}`);
}

async function run() {
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    env: { ...process.env, PORT: String(PORT), HOSTNAME: "127.0.0.1" },
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
    console.log("Waiting for Next.js server to be reachable...");
    await waitForServer(`${BASE_URL}/login`);
    console.log("Server online! Launching Chromium via Playwright...");

    const browser = await chromium.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
    });

    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
      deviceScaleFactor: 2,
    });

    // 1. Homepage (Desktop 1440px)
    console.log("Capturing Homepage (Desktop 1440px)...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "homepage-desktop.png"),
      fullPage: true,
    });

    // 2. Homepage (Tablet 768px)
    console.log("Capturing Homepage (Tablet 768px)...");
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "homepage-tablet.png"),
      fullPage: true,
    });

    // 3. Homepage (Mobile 390px)
    console.log("Capturing Homepage (Mobile 390px)...");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "homepage-mobile.png"),
      fullPage: true,
    });

    // 4. Mobile Navigation Drawer
    console.log("Capturing Mobile Navigation Drawer...");
    const menuButton = page.locator("button[aria-label*='navigation menu']").first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "mobile-navigation.png"),
      });
      // Close overlay
      const closeButton = page.locator("button[aria-label*='Close institutional menu']").first();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(300);
      }
    }

    // Reset to Desktop Viewport
    await page.setViewportSize({ width: 1440, height: 960 });

    // 5. Standalone Login Page (Desktop & Mobile)
    console.log("Capturing Login Page (/login)...");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "login-desktop.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "login-mobile.png"),
      fullPage: true,
    });

    // 6. Login Page: OTP Input State
    console.log("Capturing Login OTP State...");
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    const phoneInput = page.locator("#donor-login-mobile");
    if (await phoneInput.isVisible()) {
      await phoneInput.fill("9853608113");
      const sendOtpBtn = page.locator("button:has-text('Send Verification Code')");
      if (await sendOtpBtn.isVisible()) {
        await sendOtpBtn.click();
        await page.waitForTimeout(800);
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, "login-otp-state.png"),
        });
      }
    }

    // 7. Standalone Registration Page (Desktop & Mobile)
    console.log("Capturing Registration Page (/register)...");
    await page.goto(`${BASE_URL}/register`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "register-desktop.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "register-mobile.png"),
      fullPage: true,
    });

    // Reset to Desktop Viewport
    await page.setViewportSize({ width: 1440, height: 960 });

    // 8. Donation Journey: Step 1 (Explore Programmes) & Programme Cards Grid
    console.log("Capturing Donation Page Step 1 & Programme Cards...");
    await page.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "donate-step1-programmes.png"),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "donation-cards-grid.png"),
    });

    // 9. Donation Journey: Step 2 (Amount Selection)
    console.log("Navigating to Donation Step 2: Amount...");
    const continueToAmountBtn = page.getByRole("button", { name: /Continue to Contribution Amount/i });
    if (await continueToAmountBtn.isVisible()) {
      await continueToAmountBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "donate-step2-amount.png"),
        fullPage: true,
      });

      // 10. Donation Journey: Step 3 (Mandatory Donor Authentication)
      console.log("Navigating to Donation Step 3: Mandatory Authentication...");
      const continueToAuthBtn = page.getByRole("button", { name: /Continue to Donor Verification/i });
      if (await continueToAuthBtn.isVisible()) {
        await continueToAuthBtn.click();
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, "donate-step3-auth.png"),
          fullPage: true,
        });
      }
    }

    // 11. Donor Portal Suite (with mock authenticated session)
    console.log("Simulating authenticated session in localStorage...");
    await page.goto(`${BASE_URL}/login`);
    await page.evaluate(() => {
      localStorage.setItem("mt_portal_refresh_token", "mock_refresh_token_for_forensic_qa");
    });

    console.log("Capturing Donor Dashboard...");
    await page.goto(`${BASE_URL}/portal/dashboard`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "donor-dashboard.png"),
      fullPage: true,
    });

    console.log("Capturing Donor Contribution History...");
    await page.goto(`${BASE_URL}/portal/donations`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "donor-donations.png"),
      fullPage: true,
    });

    console.log("Capturing Official 80G Receipts...");
    await page.goto(`${BASE_URL}/portal/receipts`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "donor-receipts.png"),
      fullPage: true,
    });

    console.log("Capturing Donor Profile & Settings...");
    await page.goto(`${BASE_URL}/portal/profile`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "donor-profile.png"),
      fullPage: true,
    });

    console.log("Capturing Donor Security & Account Settings...");
    await page.goto(`${BASE_URL}/portal/security`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "donor-security.png"),
      fullPage: true,
    });

    // 12. Major Public Website Sections
    console.log("Capturing About page...");
    await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "about-desktop.png"),
      fullPage: true,
    });

    console.log("Capturing Programmes page...");
    await page.goto(`${BASE_URL}/programmes`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "programmes-desktop.png"),
      fullPage: true,
    });

    console.log("Capturing Impact page...");
    await page.goto(`${BASE_URL}/impact`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "impact-desktop.png"),
      fullPage: true,
    });

    console.log("Capturing Hanuman Murti Campaign page...");
    await page.goto(`${BASE_URL}/campaigns/hanuman-murti`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "hanuman-murti-desktop.png"),
      fullPage: true,
    });

    console.log("Capturing Governance page...");
    await page.goto(`${BASE_URL}/governance`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "governance-desktop.png"),
      fullPage: true,
    });

    console.log("Capturing Statutory Disclosures page...");
    await page.goto(`${BASE_URL}/statutory-disclosures`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "statutory-disclosures-desktop.png"),
      fullPage: true,
    });

    console.log("Capturing Contact page...");
    await page.goto(`${BASE_URL}/contact`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "contact-desktop.png"),
      fullPage: true,
    });

    console.log("Phase 29.1 Visual Evidence captures completed successfully!");
    await browser.close();
  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Visual review capture failed:", err);
  process.exit(1);
});
