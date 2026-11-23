import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PORT = 3222;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const BASE_DIR = path.resolve(process.cwd(), "reports/mect-brand-transformation");

const SUBDIRS = [
  "homepage",
  "inner-pages",
  "desktop",
  "tablet",
  "mobile",
  "3d-experiences",
  "navigation",
  "gallery",
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
  { name: "contact", path: "/contact", title: "Contact & Secretariat" },
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
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
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

    // 1. HOMEPAGE 7-SECTION ARCHITECTURE CAPTURE
    console.log("Capturing Homepage 7-Section Architecture (Desktop 1440px)...");
    const page = await browser.newPage({ viewport: VIEWPORTS.desktop });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Full page desktop
    await page.screenshot({
      path: path.join(BASE_DIR, "desktop/homepage-full-1440px.png"),
      fullPage: true,
    });

    const sectionSelectors = [
      { id: "#hero", name: "01-cinematic-hero-1440px.png", label: "01. Cinematic Hero" },
      { id: "#institutional-identity", name: "02-institutional-identity-trust-1440px.png", label: "02. Institutional Identity & Trust" },
      { id: "#work-areas", name: "03-work-areas-1440px.png", label: "03. Areas of Work" },
      { id: "#initiatives-and-impact", name: "04-unified-initiatives-and-impact-1440px.png", label: "04. Initiatives & Impact" },
      { id: "#memories-preview", name: "05-archival-memories-preview-1440px.png", label: "05. Memories Preview" },
      { id: "#get-involved", name: "06-get-involved-1440px.png", label: "06. Get Involved" },
      { id: "#final-cta", name: "07-final-cta-1440px.png", label: "07. Final Institutional CTA" },
    ];

    for (const sec of sectionSelectors) {
      const el = await page.$(sec.id);
      if (el) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await el.screenshot({
          path: path.join(BASE_DIR, "homepage", sec.name),
        });
        console.log(`  ✓ Captured ${sec.label}`);
      }
    }

    // 2. 3D EXPERIENCES DEEP-DIVE
    console.log("Capturing 3D Experiences...");

    // Hanuman Murti 3D
    await page.goto(`${BASE_URL}/campaigns/hanuman-murti`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    const murti3D = await page.$("div[aria-label*='Interactive 3D Conceptual']");
    if (murti3D) {
      await murti3D.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await murti3D.screenshot({
        path: path.join(BASE_DIR, "3d-experiences/01-hanuman-murti-3d-default-1440px.png"),
      });

      // Pointer drag to orbit
      const box = await murti3D.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2 - 40, { steps: 10 });
        await page.mouse.up();
        await page.waitForTimeout(600);
        await murti3D.screenshot({
          path: path.join(BASE_DIR, "3d-experiences/02-hanuman-murti-3d-tilted-1440px.png"),
        });
        console.log("  ✓ Captured Hanuman Murti 3D Orbit Inspection");
      }
    }

    // Odisha Impact 3D Sphere on /impact
    await page.goto(`${BASE_URL}/impact`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    const impact3D = await page.$("div[aria-label*='3D Geographical Reach']");
    if (impact3D) {
      await impact3D.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await impact3D.screenshot({
        path: path.join(BASE_DIR, "3d-experiences/03-odisha-impact-3d-sphere-default-1440px.png"),
      });

      // Select a different hub
      const puintalaBtn = await page.$("button:has-text('Puintala Block Circle')");
      if (puintalaBtn) {
        await puintalaBtn.click();
        await page.waitForTimeout(400);
        await impact3D.screenshot({
          path: path.join(BASE_DIR, "3d-experiences/04-odisha-impact-3d-sphere-hub-selected-1440px.png"),
        });
        console.log("  ✓ Captured Odisha Impact 3D Sphere Telemetry");
      }
    }

    // 3. ARCHIVAL GALLERY & INTEGRATED FIELD DISPATCHES
    console.log("Capturing Archival Memories & Field Dispatches (/memories-gallery)...");
    await page.goto(`${BASE_URL}/memories-gallery`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(BASE_DIR, "gallery/01-gallery-default-1440px.png"),
      fullPage: true,
    });

    const firstPhoto = await page.$("button[aria-label*='View larger']:first-of-type, .group button:first-of-type, [role='button']:first-of-type");
    if (firstPhoto) {
      await firstPhoto.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(BASE_DIR, "gallery/02-gallery-lightbox-modal-open-1440px.png"),
      });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
    }

    const fieldDispatches = await page.$("#field-dispatches");
    if (fieldDispatches) {
      await fieldDispatches.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await fieldDispatches.screenshot({
        path: path.join(BASE_DIR, "gallery/03-integrated-field-dispatches-1440px.png"),
      });
      console.log("  ✓ Captured Integrated Field Dispatches Section");
    }

    // 4. NAVIGATION STATES
    console.log("Capturing Navigation States...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    const header = await page.$("header");
    if (header) {
      await header.screenshot({
        path: path.join(BASE_DIR, "navigation/desktop-header-default.png"),
      });
    }

    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(400);
    if (header) {
      await header.screenshot({
        path: path.join(BASE_DIR, "navigation/desktop-header-scrolled.png"),
      });
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    const navItems = ["About", "Our Work", "Impact & Accountability", "Get Involved", "Resources & Help"];
    for (const item of navItems) {
      const trigger = await page.$(`nav a:has-text('${item}')`);
      if (trigger) {
        await trigger.hover();
        await page.waitForTimeout(300);
        const slug = item.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        await page.screenshot({
          path: path.join(BASE_DIR, `navigation/dropdown-${slug}.png`),
        });
      }
    }

    // 5. ALL CANONICAL INNER PAGES ACROSS VIEWPORTS
    console.log("Capturing All 15 Canonical Inner Pages across Desktop, Tablet, Mobile...");

    for (const p of INNER_PAGES) {
      // Desktop (1440px)
      await page.setViewportSize(VIEWPORTS.desktop);
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(BASE_DIR, `desktop/${p.name}-1440px.png`),
        fullPage: true,
      });

      // Tablet (768px)
      await page.setViewportSize(VIEWPORTS.tablet);
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(BASE_DIR, `tablet/${p.name}-768px.png`),
        fullPage: true,
      });

      // Mobile (390px)
      await page.setViewportSize(VIEWPORTS.mobile);
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(BASE_DIR, `mobile/${p.name}-390px.png`),
        fullPage: true,
      });
      console.log(`  ✓ Captured ${p.name} across all 3 viewports`);
    }

    // Mobile Drawer Open
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    const mobileMenuBtn = await page.$("button[aria-label*='navigation'], button[aria-label*='menu'], header button:last-of-type");
    if (mobileMenuBtn) {
      await mobileMenuBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(BASE_DIR, "navigation/mobile-drawer-open-390px.png"),
      });
      console.log("  ✓ Captured Mobile Drawer Open (390px)");
    }

    // Homepage Mobile & Tablet full page
    await page.setViewportSize(VIEWPORTS.mobile);
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(BASE_DIR, "mobile/homepage-full-390px.png"),
      fullPage: true,
    });

    await page.setViewportSize(VIEWPORTS.tablet);
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(BASE_DIR, "tablet/homepage-full-768px.png"),
      fullPage: true,
    });

    await browser.close();
    console.log("\n=======================================================");
    console.log("SUCCESS: All Brand Transformation Evidence Captured!");
    console.log(`Directory: ${BASE_DIR}`);
    console.log("=======================================================\n");
  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
