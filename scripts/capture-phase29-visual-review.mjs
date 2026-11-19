import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3290;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const BASE_DIR = path.resolve(process.cwd(), "reports/mect-phase-29");

const SUBDIRS = [
  "homepage",
  "auth",
  "portal",
  "donation",
  "campaigns",
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

    // 1. Dedicated Login Page (Desktop & Mobile)
    console.log("Capturing Dedicated Login Page (/login)...");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(BASE_DIR, "auth", "login-desktop-1440px.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(BASE_DIR, "auth", "login-mobile-390px.png"),
      fullPage: true,
    });

    // 2. Dedicated Register Page (Desktop & Mobile)
    console.log("Capturing Dedicated Register Page (/register)...");
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${BASE_URL}/register`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(BASE_DIR, "auth", "register-desktop-1440px.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(BASE_DIR, "auth", "register-mobile-390px.png"),
      fullPage: true,
    });

    // 3. Homepage (Desktop, Tablet, Mobile)
    console.log("Capturing Homepage (/)...");
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(BASE_DIR, "homepage", "homepage-desktop-1440px.png"),
      fullPage: true,
    });

    // Capture Header & Masthead specifically
    await page.screenshot({
      path: path.join(BASE_DIR, "homepage", "homepage-hero-masthead.png"),
    });

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(BASE_DIR, "homepage", "homepage-tablet-768px.png"),
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(BASE_DIR, "homepage", "homepage-mobile-390px.png"),
      fullPage: true,
    });

    // 4. Unified Donation Experience (/donate)
    console.log("Capturing Unified Donation Experience (/donate)...");
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(BASE_DIR, "donation", "donate-step1-programmes.png"),
      fullPage: true,
    });

    // 5. Hanuman Murti Campaign Page
    console.log("Capturing Hanuman Murti Campaign (/campaigns/hanuman-murti)...");
    await page.goto(`${BASE_URL}/campaigns/hanuman-murti`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(BASE_DIR, "campaigns", "hanuman-murti-desktop-1440px.png"),
      fullPage: true,
    });

    // 6. Donor Portal with Mock Authentication Session
    console.log("Setting mock authentication session in localStorage...");
    await page.goto(`${BASE_URL}/login`);
    await page.evaluate(() => {
      localStorage.setItem("mt_portal_refresh_token", "mock_refresh_token_for_review");
    });

    // Inject mock dashboard data in window for screenshot capture
    console.log("Capturing Donor Portal Subpages with PortalNav...");
    await page.goto(`${BASE_URL}/portal/dashboard`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(BASE_DIR, "portal", "portal-dashboard-screen.png"),
      fullPage: true,
    });

    await page.goto(`${BASE_URL}/portal/donations`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(BASE_DIR, "portal", "portal-donations-screen.png"),
      fullPage: true,
    });

    await page.goto(`${BASE_URL}/portal/receipts`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(BASE_DIR, "portal", "portal-receipts-screen.png"),
      fullPage: true,
    });

    await page.goto(`${BASE_URL}/portal/security`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(BASE_DIR, "portal", "portal-security-screen.png"),
      fullPage: true,
    });

    await page.goto(`${BASE_URL}/portal/profile`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(BASE_DIR, "portal", "portal-profile-screen.png"),
      fullPage: true,
    });

    console.log("Phase 29 Visual Review captures completed successfully!");
    await browser.close();
  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Visual review capture failed:", err);
  process.exit(1);
});
