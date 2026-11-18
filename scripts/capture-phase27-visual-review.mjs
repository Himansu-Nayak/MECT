import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3227;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const BASE_DIR = path.resolve(process.cwd(), "reports/mect-phase-27");

const SUBDIRS = [
  "homepage",
  "viewports",
  "inner-pages",
  "navigation",
  "3d",
  "motion-telemetry",
];

// Ensure all target directories exist
for (const sub of SUBDIRS) {
  const dir = path.join(BASE_DIR, sub);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const VIEWPORTS = {
  mobile390: { name: "mobile-390px", width: 390, height: 844 },
  mobile430: { name: "mobile-430px", width: 430, height: 932 },
  tablet768: { name: "tablet-768px", width: 768, height: 1024 },
  laptop1024: { name: "laptop-1024px", width: 1024, height: 768 },
  desktop1440: { name: "desktop-1440px", width: 1440, height: 900 },
  largeDesktop1920: { name: "large-desktop-1920px", width: 1920, height: 1080 },
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
    // 1. ALL 6 REQUIRED VIEWPORTS (FULL HOMEPAGE)
    // =========================================================================
    console.log("\n[1/6] Capturing All 6 Required Viewports (Full Homepage)...");
    for (const [key, vp] of Object.entries(VIEWPORTS)) {
      const vpPage = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await vpPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await vpPage.waitForTimeout(600);
      await vpPage.screenshot({
        path: path.join(BASE_DIR, `viewports/homepage-${vp.name}.png`),
        fullPage: true,
      });
      console.log(`  ✓ Captured viewports/homepage-${vp.name}.png (${vp.width}x${vp.height})`);
      await vpPage.close();
    }

    // =========================================================================
    // 2. HOMEPAGE 10-SECTION NARRATIVE JOURNEY (1440px)
    // =========================================================================
    console.log("\n[2/6] Capturing Homepage 10-Section Architecture (1440px)...");
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    const sections = [
      { id: "#hero", name: "01-the-first-impression-cinematic-hero.png", label: "01. The First Impression" },
      { id: "#why-mect-exists", name: "02-why-mect-exists-institutional-story.png", label: "02. Why MECT Exists" },
      { id: "#work-areas", name: "03-the-mect-difference-interconnected-safety-net.png", label: "03 & 04. Interconnected Safety Net" },
      { id: "#evidence-of-impact", name: "05-evidence-of-impact-audited-telemetry.png", label: "05. Evidence of Impact" },
      { id: "#field-exhibition", name: "06-real-stories-field-dispatches-safeguarding.png", label: "06. Real Stories & Safeguarding" },
      { id: "#campaigns-and-initiatives", name: "07-differentiated-campaigns-hanuman-murti-3d.png", label: "07. Differentiated Campaigns & 3D" },
      { id: "#transparency-and-governance", name: "08-transparency-governance-statutory-register.png", label: "08. Transparency & Governance" },
      { id: "#participate-in-mission", name: "09-participate-six-tailored-pathways.png", label: "09. Six Participation Pathways" },
      { id: "#closing-pledge", name: "10-closing-fiduciary-pledge-canonical-contact.png", label: "10. Closing Pledge & Contact" },
      { id: "footer", name: "11-statutory-fiduciary-footer.png", label: "11. Fiduciary Footer" },
    ];

    for (const sec of sections) {
      const el = await page.$(sec.id);
      if (el) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await el.screenshot({
          path: path.join(BASE_DIR, "homepage", sec.name),
        });
        console.log(`  ✓ Captured homepage/${sec.name} (${sec.label})`);
      } else {
        console.warn(`  ⚠ Could not find selector ${sec.id}`);
      }
    }

    // =========================================================================
    // 3. 3D & INTERACTIVE EXPERIENCES
    // =========================================================================
    console.log("\n[3/6] Capturing 3D Experiences...");
    const murtiSec = await page.$("#campaigns-and-initiatives");
    if (murtiSec) {
      await murtiSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await murtiSec.screenshot({
        path: path.join(BASE_DIR, "3d/01-hanuman-murti-3d-orbital-experience.png"),
      });
      console.log("  ✓ Captured 3d/01-hanuman-murti-3d-orbital-experience.png");
    }

    await page.goto(`${BASE_URL}/impact`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const sphere3D = (await page.$("canvas")) || (await page.$("#impact"));
    if (sphere3D) {
      await sphere3D.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await sphere3D.screenshot({
        path: path.join(BASE_DIR, "3d/02-odisha-impact-sphere-3d.png"),
      });
      console.log("  ✓ Captured 3d/02-odisha-impact-sphere-3d.png");
    }

    // =========================================================================
    // 4. MOTION & INTERACTION STATES (Phase 27 Micro-Interactions)
    // =========================================================================
    console.log("\n[4/6] Capturing Motion & Interaction States...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    // 4.1 Pillar Tab Switching Interaction (Safety Net)
    const pillar2Btn = await page.$("button:has-text('Vocational Livelihoods')");
    if (pillar2Btn) {
      await pillar2Btn.scrollIntoViewIfNeeded();
      await pillar2Btn.click();
      await page.waitForTimeout(500);
      const pillarSec = await page.$("#work-areas");
      if (pillarSec) {
        await pillarSec.screenshot({
          path: path.join(BASE_DIR, "motion-telemetry/01-active-pillar-switch-vocational.png"),
        });
        console.log("  ✓ Captured motion-telemetry/01-active-pillar-switch-vocational.png");
      }
    }

    // 4.2 Lightbox Carousel Interaction (Exhibition)
    const viewPhotoBtn = await page.$("button:has-text('View Archival Photograph')");
    if (viewPhotoBtn) {
      await viewPhotoBtn.scrollIntoViewIfNeeded();
      await viewPhotoBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(BASE_DIR, "motion-telemetry/02-documentary-lightbox-opened.png"),
      });
      console.log("  ✓ Captured motion-telemetry/02-documentary-lightbox-opened.png");

      // Close modal
      const closeBtn = await page.$("button[aria-label='Close lightbox']");
      if (closeBtn) await closeBtn.click();
      await page.waitForTimeout(300);
    }

    // 4.3 Copy Reference Interaction (Statutory Governance)
    const copyBtn = await page.$("button[title*='Copy']");
    if (copyBtn) {
      await copyBtn.scrollIntoViewIfNeeded();
      await copyBtn.click();
      await page.waitForTimeout(400);
      const govSec = await page.$("#transparency-and-governance");
      if (govSec) {
        await govSec.screenshot({
          path: path.join(BASE_DIR, "motion-telemetry/03-statutory-copy-reference-feedback.png"),
        });
        console.log("  ✓ Captured motion-telemetry/03-statutory-copy-reference-feedback.png");
      }
    }

    // =========================================================================
    // 5. NAVIGATION STATES (DESKTOP & MOBILE DRAWER)
    // =========================================================================
    console.log("\n[5/6] Capturing Navigation States...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const navEl = await page.$("header");
    if (navEl) {
      await navEl.screenshot({
        path: path.join(BASE_DIR, "navigation/01-desktop-navigation-header.png"),
      });
      console.log("  ✓ Captured navigation/01-desktop-navigation-header.png");
    }

    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(500);

    const menuBtn = await mobilePage.$(
      "button[aria-label*='menu' i], button[aria-label*='navigation' i], header button:has(svg)"
    );
    if (menuBtn) {
      await menuBtn.click();
      await mobilePage.waitForTimeout(600);
      await mobilePage.screenshot({
        path: path.join(BASE_DIR, "navigation/02-mobile-navigation-drawer.png"),
      });
      console.log("  ✓ Captured navigation/02-mobile-navigation-drawer.png");
    }
    await mobilePage.close();

    // =========================================================================
    // 6. ALL 15 CANONICAL INNER PAGES (1440px)
    // =========================================================================
    console.log("\n[6/6] Capturing All 15 Canonical Inner Pages (1440px)...");
    for (const inner of INNER_PAGES) {
      try {
        await page.goto(`${BASE_URL}${inner.path}`, { waitUntil: "networkidle", timeout: 15000 });
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(BASE_DIR, "inner-pages", `${inner.name}-1440px.png`),
          fullPage: true,
        });
        console.log(`  ✓ Captured inner-pages/${inner.name}-1440px.png (${inner.title})`);
      } catch (err) {
        console.warn(`  ⚠ Could not capture ${inner.path}: ${err.message}`);
      }
    }

    await browser.close();
    console.log("\n=======================================================");
    console.log("Phase 27 Visual Review Suite Completed Successfully!");
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
