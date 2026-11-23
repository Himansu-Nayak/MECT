import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3280;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const BASE_DIR = path.resolve(process.cwd(), "reports/mect-phase-28");

const SUBDIRS = [
  "journey",
  "programmes",
  "auth",
  "dashboard",
  "viewports",
];

for (const sub of SUBDIRS) {
  const dir = path.join(BASE_DIR, sub);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function waitForServer(url, timeoutMs = 40000) {
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
    await waitForServer(`${BASE_URL}/donate`);
    console.log("Server online! Launching Chromium via Playwright...");

    const browser = await chromium.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
    });

    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
      deviceScaleFactor: 2,
    });

    // 1. Step 1: Explore Programmes (Desktop)
    console.log("Capturing Step 1: Explore Programmes (Desktop 1440px)...");
    await page.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(BASE_DIR, "journey", "step1-explore-programmes-desktop.png"),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(BASE_DIR, "programmes", "programme-cards-grid.png"),
    });

    // 2. Step 1: Mobile Viewport (390px)
    console.log("Capturing Step 1: Explore Programmes (Mobile 390px)...");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(BASE_DIR, "viewports", "step1-programmes-mobile-390px.png"),
      fullPage: true,
    });

    // Reset to Desktop Viewport
    await page.setViewportSize({ width: 1440, height: 960 });

    // 3. Navigate to Step 2: Amount
    console.log("Navigating to Step 2: Amount Selection...");
    const continueToAmountBtn = page.getByRole("button", { name: /Continue to Contribution Amount/i });
    if (await continueToAmountBtn.isVisible()) {
      await continueToAmountBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(BASE_DIR, "journey", "step2-contribution-amount-desktop.png"),
        fullPage: true,
      });
    }

    // 4. Navigate to Step 3: Mandatory Mobile Authentication
    console.log("Navigating to Step 3: Mandatory Mobile Authentication...");
    const continueToVerificationBtn = page.getByRole("button", { name: /Continue to Donor Verification/i });
    if (await continueToVerificationBtn.isVisible()) {
      await continueToVerificationBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(BASE_DIR, "journey", "step3-mobile-auth-phone-input.png"),
        fullPage: true,
      });
      await page.screenshot({
        path: path.join(BASE_DIR, "auth", "step3-otp-phone-entry.png"),
      });
    }

    // Capture Mobile Auth in Mobile Viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(BASE_DIR, "viewports", "step3-mobile-auth-mobile-390px.png"),
      fullPage: true,
    });
    await page.setViewportSize({ width: 1440, height: 960 });

    // 5. Simulate Authenticated Session to Capture Steps 4, 5, 6
    console.log("Setting authenticated donor token to capture Steps 4, 5, 6...");
    await page.evaluate(() => {
      localStorage.setItem("mt_portal_refresh_token", "demo_refresh_token_for_visual_preview");
    });

    // Reload with simulated auth state or direct test params
    await page.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    // 6. Capture Donor Portal Dashboard & Profile
    console.log("Capturing Donor Portal Login / Dashboard View...");
    await page.goto(`${BASE_URL}/portal/login`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(BASE_DIR, "auth", "portal-login-screen.png"),
      fullPage: true,
    });

    // Capture Campaign with Sub-ledger Ringfencing Notice
    console.log("Capturing Hanuman Murti Campaign with Sub-Ledger Ringfencing...");
    await page.goto(`${BASE_URL}/campaigns/hanuman-murti`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(BASE_DIR, "programmes", "hanuman-murti-ringfenced-subledger.png"),
      fullPage: true,
    });

    await browser.close();
    console.log(`Phase 28 visual review capture completed successfully into: ${BASE_DIR}`);
  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Visual review capture failed:", err);
  process.exit(1);
});
