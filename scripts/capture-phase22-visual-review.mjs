import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3222;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const BASE_DIR = path.resolve(process.cwd(), "reports/phase-22-visual-review");

const SUBDIRS = [
  "homepage",
  "inner-pages",
  "navigation",
  "gallery",
  "mobile",
  "tablet",
  "desktop",
];

// Ensure all target directories exist
for (const sub of SUBDIRS) {
  const dir = path.join(BASE_DIR, sub);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

const INNER_PAGES = [
  { name: "about", path: "/about", title: "About Us" },
  { name: "programmes", path: "/programmes", title: "Five Development Pillars" },
  { name: "impact", path: "/impact", title: "Documented Impact" },
  { name: "governance", path: "/governance", title: "Governance & Fiduciary Charter" },
  { name: "reports", path: "/reports", title: "Public Records Library" },
  { name: "campaigns", path: "/campaigns", title: "Campaigns Directory" },
  { name: "hanuman-murti", path: "/campaigns/hanuman-murti", title: "Proposed Hanuman Murti" },
  { name: "csr-partnerships", path: "/csr-partnerships", title: "CSR Partnerships" },
  { name: "donate", path: "/donate", title: "Unified Donation Portal" },
  { name: "scholarships", path: "/scholarships", title: "Higher Education Scholarships" },
  { name: "volunteer", path: "/volunteer", title: "Volunteer Fellowship" },
  { name: "contact", path: "/contact", title: "Contact & Secretariat" },
  { name: "faq", path: "/faq", title: "Frequently Asked Questions" },
  { name: "statutory-disclosures", path: "/statutory-disclosures", title: "Statutory Disclosures" },
  { name: "memories-gallery", path: "/memories-gallery", title: "Archival Memories Gallery" },
];

async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return true;
    } catch {
      // keep polling
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Timeout waiting for server at ${url}`);
}

async function run() {
  console.log(`Starting Next.js standalone production server on port ${PORT}...`);
  const server = spawn("node", [".next/standalone/server.js"], {
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
    console.log("Waiting for server to become responsive...");
    await waitForServer(`${BASE_URL}/`);
    console.log("Next.js server is online. Launching Google Chrome via Playwright...");

    const browser = await chromium.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
    });

    // =========================================================================
    // 1. HOMEPAGE FULL & SECTION-LEVEL CAPTURE
    // =========================================================================
    console.log("\n--- Capturing Homepage Screenshots ---");
    for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
      const context = await browser.newContext({ viewport: vp });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      // Full page
      const fullPath = path.join(BASE_DIR, vpName, `homepage-${vp.width}px.png`);
      await page.screenshot({ path: fullPath, fullPage: true });
      console.log(`[Homepage Full] Captured: ${fullPath}`);
      await context.close();
    }

    // Section-level screenshots on 1440px desktop
    const desktopContext = await browser.newContext({ viewport: VIEWPORTS.desktop });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(1000);

    const sections = [
      { id: "#hero", filename: "01-cinematic-hero-1440px.png", name: "01 Cinematic Hero" },
      { id: "#institutional-identity", filename: "02-identity-trust-1440px.png", name: "02 Identity & Trust" },
      { id: "#work-areas", filename: "03-work-areas-1440px.png", name: "03 Work Areas" },
      { id: "#featured-initiatives", filename: "04-featured-initiatives-1440px.png", name: "04 Featured Initiatives" },
      { id: "#impact-at-a-glance", filename: "05-documented-impact-1440px.png", name: "05 Documented Impact" },
      { id: "#how-mect-works", filename: "06-how-mect-works-1440px.png", name: "06 How MECT Works" },
      { id: "#memories-preview", filename: "07-memories-gallery-preview-1440px.png", name: "07 Memories Preview" },
      { id: "#get-involved", filename: "08-get-involved-1440px.png", name: "08 Get Involved" },
      { id: "#final-cta", filename: "09-final-cta-1440px.png", name: "09 Final CTA" },
      { id: "footer", filename: "10-footer-1440px.png", name: "10 Footer" },
    ];

    for (const sec of sections) {
      const locator = desktopPage.locator(sec.id);
      if (await locator.count() > 0) {
        await locator.scrollIntoViewIfNeeded();
        await desktopPage.waitForTimeout(400);
        const secPath = path.join(BASE_DIR, "homepage", sec.filename);
        await locator.screenshot({ path: secPath });
        console.log(`[Homepage Section] ${sec.name} captured: ${secPath}`);
      } else {
        console.warn(`[Homepage Section Warning] Locator ${sec.id} not found.`);
      }
    }
    await desktopContext.close();

    // =========================================================================
    // 2. INNER PAGES FULL-PAGE CAPTURE ACROSS VIEWPORTS
    // =========================================================================
    console.log("\n--- Capturing Inner Pages Screenshots ---");
    for (const ip of INNER_PAGES) {
      for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
        const context = await browser.newContext({ viewport: vp });
        const page = await context.newPage();
        await page.goto(`${BASE_URL}${ip.path}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(800);

        // Save in viewport folder
        const vpPath = path.join(BASE_DIR, vpName, `${ip.name}-${vp.width}px.png`);
        await page.screenshot({ path: vpPath, fullPage: true });

        // Also save canonical desktop copy in inner-pages
        if (vpName === "desktop") {
          const canonicalPath = path.join(BASE_DIR, "inner-pages", `${ip.name}-1440px.png`);
          await page.screenshot({ path: canonicalPath, fullPage: true });
        }

        console.log(`[Inner Page] ${ip.title} (${vpName}) captured.`);
        await context.close();
      }
    }

    // =========================================================================
    // 3. NAVIGATION & INTERACTION CAPTURE
    // =========================================================================
    console.log("\n--- Capturing Navigation Screenshots ---");
    const navContext = await browser.newContext({ viewport: VIEWPORTS.desktop });
    const navPage = await navContext.newPage();
    await navPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await navPage.waitForTimeout(600);

    // Desktop Header Default
    const headerLocator = navPage.locator("header");
    await headerLocator.screenshot({ path: path.join(BASE_DIR, "navigation", "desktop-header-default-1440px.png") });
    console.log("[Navigation] Desktop header captured.");

    // Desktop Header Dropdowns
    const navItems = ["About", "Our Work", "Impact & Accountability", "Get Involved", "Resources & Help"];
    for (const item of navItems) {
      try {
        const btn = navPage.locator(`button[aria-label="${item} sub-navigation menu"]`).first();
        if (await btn.count() > 0) {
          await btn.click();
          await navPage.waitForTimeout(400);
          const safeName = item.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          await navPage.screenshot({
            path: path.join(BASE_DIR, "navigation", `dropdown-${safeName}-1440px.png`),
            clip: { x: 0, y: 0, width: 1440, height: 600 },
          });
          console.log(`[Navigation] Dropdown ${item} captured.`);
          // Click again to close
          await btn.click();
          await navPage.waitForTimeout(200);
        } else {
          console.warn(`[Navigation Warning] Dropdown button not found for: ${item}`);
        }
      } catch (err) {
        console.warn(`[Navigation Warning] Error capturing dropdown for ${item}: ${err.message}`);
      }
    }

    // Search Trigger (Ctrl+K)
    try {
      const searchBtn = navPage.locator('button[aria-label*="Search"]').first();
      if (await searchBtn.count() > 0) {
        await searchBtn.click();
        await navPage.waitForTimeout(500);
        await navPage.screenshot({
          path: path.join(BASE_DIR, "navigation", "search-modal-open-1440px.png"),
          clip: { x: 0, y: 0, width: 1440, height: 700 },
        });
        console.log("[Navigation] Search modal captured.");
        await navPage.keyboard.press("Escape");
        await navPage.waitForTimeout(300);
      }
    } catch (err) {
      console.warn(`[Navigation Warning] Error capturing search modal: ${err.message}`);
    }

    await navContext.close();

    // Mobile Navigation Drawer (390px)
    console.log("\n--- Capturing Mobile Drawer Navigation ---");
    const mobileContext = await browser.newContext({ viewport: VIEWPORTS.mobile });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(600);

    try {
      const hamburger = mobilePage.locator('button[aria-label="Open navigation menu"]').first();
      if (await hamburger.count() > 0) {
        await hamburger.click();
        await mobilePage.waitForTimeout(500);
        await mobilePage.screenshot({
          path: path.join(BASE_DIR, "navigation", "mobile-drawer-open-390px.png"),
          fullPage: false,
        });
        console.log("[Navigation] Mobile drawer captured.");
      } else {
        console.warn("[Navigation Warning] Hamburger button not found.");
      }
    } catch (err) {
      console.warn(`[Navigation Warning] Error capturing mobile drawer: ${err.message}`);
    }
    await mobileContext.close();

    // =========================================================================
    // 4. ARCHIVAL GALLERY & LIGHTBOX DEEP DIVE
    // =========================================================================
    console.log("\n--- Capturing Archival Gallery & Lightbox ---");
    const galContext = await browser.newContext({ viewport: VIEWPORTS.desktop });
    const galPage = await galContext.newPage();
    await galPage.goto(`${BASE_URL}/memories-gallery`, { waitUntil: "networkidle" });
    await galPage.waitForTimeout(800);

    // Gallery Default View
    await galPage.screenshot({
      path: path.join(BASE_DIR, "gallery", "01-gallery-default-1440px.png"),
      fullPage: true,
    });
    console.log("[Gallery] Default full page captured.");

    // Filter by Category: Women's Livelihoods
    try {
      const filterBtn = galPage.locator('button:has-text("Women\'s Livelihoods")').first();
      if (await filterBtn.count() > 0) {
        await filterBtn.click();
        await galPage.waitForTimeout(500);
        await galPage.screenshot({
          path: path.join(BASE_DIR, "gallery", "02-gallery-filter-womens-livelihoods-1440px.png"),
          clip: { x: 0, y: 0, width: 1440, height: 1100 },
        });
        console.log("[Gallery] Category filter view captured.");
      }
    } catch (err) {
      console.warn(`[Gallery Warning] Category filter error: ${err.message}`);
    }

    // Lightbox Modal Open
    try {
      // Click first photo card
      const firstCard = galPage.locator('button:has(img[alt*="Rural women"])').first();
      if (await firstCard.count() > 0) {
        await firstCard.click();
        await galPage.waitForTimeout(600);
        await galPage.screenshot({
          path: path.join(BASE_DIR, "gallery", "03-gallery-lightbox-modal-open-1440px.png"),
        });
        console.log("[Gallery] Lightbox modal captured.");
        await galPage.keyboard.press("Escape");
        await galPage.waitForTimeout(300);
      } else {
        // Fallback: click any card in the grid
        const anyCard = galPage.locator('section[aria-label="Field Photographs Collection"] button').first();
        if (await anyCard.count() > 0) {
          await anyCard.click();
          await galPage.waitForTimeout(600);
          await galPage.screenshot({
            path: path.join(BASE_DIR, "gallery", "03-gallery-lightbox-modal-open-1440px.png"),
          });
          console.log("[Gallery] Lightbox modal (fallback card) captured.");
          await galPage.keyboard.press("Escape");
          await galPage.waitForTimeout(300);
        }
      }
    } catch (err) {
      console.warn(`[Gallery Warning] Lightbox modal error: ${err.message}`);
    }

    await galContext.close();
    await browser.close();
    console.log("\n=======================================================");
    console.log("All screenshots successfully captured in reports/phase-22-visual-review/");
    console.log("=======================================================\n");
  } catch (error) {
    console.error("Execution error during visual review capture:", error);
  } finally {
    cleanup();
    process.exit(0);
  }
}

run();
