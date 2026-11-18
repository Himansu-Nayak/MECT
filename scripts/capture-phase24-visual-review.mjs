import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3224;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const BASE_DIR = path.resolve(process.cwd(), "reports/mect-phase-24");

const SUBDIRS = [
  "homepage",
  "brand-design",
  "inner-pages",
  "motion",
  "3d",
  "imagery",
  "navigation",
  "mobile",
  "tablet",
  "desktop",
  "before-after",
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
  wide: { width: 1920, height: 1080 },
};

const INNER_PAGES = [
  { name: "about", path: "/about", title: "About Us & Institutional Heritage" },
  { name: "programmes", path: "/programmes", title: "Core Development Pillars" },
  { name: "impact", path: "/impact", title: "Documented Community Impact & 3D Reach" },
  { name: "governance", path: "/governance", title: "Governance & Fiduciary Charter" },
  { name: "reports", path: "/reports", title: "Public Records Library" },
  { name: "campaigns", path: "/campaigns", title: "Campaigns Directory" },
  { name: "hanuman-murti", path: "/campaigns/hanuman-murti", title: "The Grand Hanuman Murti 3D" },
  { name: "csr-partnerships", path: "/csr-partnerships", title: "CSR Partnerships" },
  { name: "donate", path: "/donate", title: "Unified Donation Portal" },
  { name: "scholarships", path: "/scholarships", title: "Higher Education Scholarships" },
  { name: "volunteer", path: "/volunteer", title: "Volunteer Fellowship" },
  { name: "contact", path: "/contact", title: "Contact & Secretariat (9853608113 / mect220@gmail.com)" },
  { name: "faq", path: "/faq", title: "Frequently Asked Questions" },
  { name: "statutory-disclosures", path: "/statutory-disclosures", title: "Statutory Disclosures" },
  { name: "memories-gallery", path: "/memories-gallery", title: "Archival Memories & Field Dispatches" },
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
  console.log(`Starting Next.js standalone server on port ${PORT}...`);
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
    console.log("Waiting for Next.js standalone server...");
    await waitForServer(`${BASE_URL}/`);
    console.log("Server online! Launching Chromium via Playwright...");

    const browser = await chromium.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
    });

    // =========================================================================
    // 1. HOMEPAGE CAPTURE (DESKTOP 1440px)
    // =========================================================================
    console.log("\n[1/7] Capturing Homepage & Section Architecture (1440px)...");
    const page = await browser.newPage({ viewport: VIEWPORTS.desktop });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Full homepage desktop
    await page.screenshot({
      path: path.join(BASE_DIR, "desktop/homepage-full-1440px.png"),
      fullPage: true,
    });
    console.log("  ✓ Captured desktop/homepage-full-1440px.png");

    // Sections
    const sectionSelectors = [
      { id: "#hero", name: "01-cinematic-hero-1440px.png", label: "01. Cinematic Hero" },
      { id: "#institutional-identity", name: "02-institutional-identity-trust-1440px.png", label: "02. Institutional Identity & Fiduciary Roots" },
      { id: "#work-areas", name: "03-interconnected-safety-net-1440px.png", label: "03. Interconnected Safety Net Architecture" },
      { id: "#initiatives-and-impact", name: "04-unified-initiatives-telemetry-1440px.png", label: "04. Initiatives & Documented Telemetry" },
      { id: "#memories-preview", name: "05-archival-memories-preview-1440px.png", label: "05. Archival Field Exhibition" },
      { id: "#get-involved", name: "06-get-involved-pathways-1440px.png", label: "06. Pathways to Participate" },
      { id: "#final-cta", name: "07-final-cta-canonical-contact-1440px.png", label: "07. Final Fiduciary Pledge & Contact" },
    ];

    for (const sec of sectionSelectors) {
      const el = await page.$(sec.id);
      if (el) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await el.screenshot({
          path: path.join(BASE_DIR, "homepage", sec.name),
        });
        console.log(`  ✓ Captured homepage/${sec.name} (${sec.label})`);
      }
    }

    // Capture Footer
    const footerEl = await page.$("footer");
    if (footerEl) {
      await footerEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await footerEl.screenshot({
        path: path.join(BASE_DIR, "homepage/08-footer-statutory-1440px.png"),
      });
      console.log("  ✓ Captured homepage/08-footer-statutory-1440px.png");
    }

    // =========================================================================
    // 2. BRAND DESIGN & NEW ARCHITECTURE EVIDENCE
    // =========================================================================
    console.log("\n[2/7] Capturing Brand Design & Architecture Details...");
    const identitySec = await page.$("#institutional-identity");
    if (identitySec) {
      await identitySec.screenshot({
        path: path.join(BASE_DIR, "brand-design/01-fiduciary-identity-typography.png"),
      });
      console.log("  ✓ Captured brand-design/01-fiduciary-identity-typography.png");
    }

    const safetyNetSec = await page.$("#work-areas");
    if (safetyNetSec) {
      await safetyNetSec.screenshot({
        path: path.join(BASE_DIR, "brand-design/02-interconnected-safety-net-architecture.png"),
      });
      console.log("  ✓ Captured brand-design/02-interconnected-safety-net-architecture.png");
    }

    // =========================================================================
    // 3. 3D & IMMERSIVE VISUALIZATIONS
    // =========================================================================
    console.log("\n[3/7] Capturing 3D Experiences...");
    // 3D Hanuman Murti on Homepage / Campaign
    const murtiContainer = await page.$("#initiatives-and-impact");
    if (murtiContainer) {
      await murtiContainer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await murtiContainer.screenshot({
        path: path.join(BASE_DIR, "3d/01-hanuman-murti-3d-experience.png"),
      });
      console.log("  ✓ Captured 3d/01-hanuman-murti-3d-experience.png");
    }

    // 3D Odisha Impact Sphere on /impact
    await page.goto(`${BASE_URL}/impact`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const sphere3D = await page.$("canvas") || await page.$("#impact");
    if (sphere3D) {
      await sphere3D.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await sphere3D.screenshot({
        path: path.join(BASE_DIR, "3d/02-odisha-impact-sphere-3d.png"),
      });
      console.log("  ✓ Captured 3d/02-odisha-impact-sphere-3d.png");
    }

    // =========================================================================
    // 4. NAVIGATION EXPERIENCES (DESKTOP & MOBILE DRAWER)
    // =========================================================================
    console.log("\n[4/7] Capturing Navigation States...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Desktop Nav Bar
    const navEl = await page.$("header");
    if (navEl) {
      await navEl.screenshot({
        path: path.join(BASE_DIR, "navigation/01-desktop-navigation-header.png"),
      });
      console.log("  ✓ Captured navigation/01-desktop-navigation-header.png");
    }

    // Mobile Navigation Drawer (390px)
    const mobilePage = await browser.newPage({ viewport: VIEWPORTS.mobile });
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(500);

    // Click mobile hamburger menu
    const menuBtn = await mobilePage.$("button[aria-label*='menu' i], button[aria-label*='navigation' i], header button:has(svg)");
    if (menuBtn) {
      await menuBtn.click();
      await mobilePage.waitForTimeout(600);
      await mobilePage.screenshot({
        path: path.join(BASE_DIR, "navigation/02-mobile-navigation-drawer.png"),
      });
      console.log("  ✓ Captured navigation/02-mobile-navigation-drawer.png");
    }

    // =========================================================================
    // 5. RESPONSIVE VIEWPORTS (TABLET 768px & MOBILE 390px)
    // =========================================================================
    console.log("\n[5/7] Capturing Responsive Viewports...");
    // Mobile Homepage Full Page
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({
      path: path.join(BASE_DIR, "mobile/homepage-full-390px.png"),
      fullPage: true,
    });
    console.log("  ✓ Captured mobile/homepage-full-390px.png");

    // Tablet Homepage Full Page
    const tabletPage = await browser.newPage({ viewport: VIEWPORTS.tablet });
    await tabletPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await tabletPage.waitForTimeout(600);
    await tabletPage.screenshot({
      path: path.join(BASE_DIR, "tablet/homepage-full-768px.png"),
      fullPage: true,
    });
    console.log("  ✓ Captured tablet/homepage-full-768px.png");

    // =========================================================================
    // 6. ALL 15 CANONICAL INNER PAGES
    // =========================================================================
    console.log("\n[6/7] Capturing All 15 Canonical Inner Pages (1440px)...");
    for (const inner of INNER_PAGES) {
      try {
        await page.goto(`${BASE_URL}${inner.path}`, { waitUntil: "networkidle", timeout: 15000 });
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(BASE_DIR, "inner-pages", `${inner.name}-1440px.png`),
          fullPage: true,
        });
        console.log(`  ✓ Captured inner-pages/${inner.name}-1440px.png (${inner.title})`);
      } catch (err) {
        console.warn(`  ⚠ Could not capture ${inner.path}: ${err.message}`);
      }
    }

    // =========================================================================
    // 7. BEFORE / AFTER COMPARISON EVIDENCE
    // =========================================================================
    console.log("\n[7/7] Capturing Before / After Transformation Visuals...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    const safetyNetPillar = await page.$("#work-areas");
    if (safetyNetPillar) {
      await safetyNetPillar.screenshot({
        path: path.join(BASE_DIR, "before-after/phase24-interconnected-safety-net.png"),
      });
      console.log("  ✓ Captured before-after/phase24-interconnected-safety-net.png");
    }

    const contactSection = await page.$("#final-cta");
    if (contactSection) {
      await contactSection.screenshot({
        path: path.join(BASE_DIR, "before-after/phase24-canonical-contact-9853608113.png"),
      });
      console.log("  ✓ Captured before-after/phase24-canonical-contact-9853608113.png");
    }

    await browser.close();
    console.log("\n=======================================================");
    console.log("Phase 24 Visual Review Suite Completed Successfully!");
    console.log(`Evidence captured in: ${BASE_DIR}`);
    console.log("=======================================================\n");

  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
