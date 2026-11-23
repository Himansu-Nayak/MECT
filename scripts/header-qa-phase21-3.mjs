import { chromium } from "playwright";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const PORT = 3240;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_3");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function waitForServer(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Timeout waiting for server at ${url}`);
}

async function run() {
  console.log(`Starting Next.js production server on port ${PORT}...`);
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
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
    await waitForServer(BASE_URL);
    console.log("Server ready. Launching headless Edge browser...");

    const browser = await chromium.launch({
      channel: "msedge",
      headless: true,
    });

    const report = {
      timestamp: new Date().toISOString(),
      viewportsTested: [],
      dropdownTest: {},
      overlayDesktopTest: {},
      overlayMobileTest: {},
      scrollResponsiveTest: {},
      reducedMotionTest: {},
      routeRegression: [],
      performance: {},
      consoleErrors: [],
    };

    // -------------------------------------------------------------
    // TEST 1: Responsive Viewports (9 viewports + landscape)
    // -------------------------------------------------------------
    console.log("\n=== 1. RESPONSIVE VIEWPORT TESTING (9 SIZES) ===");
    const viewports = [
      { name: "320px", width: 320, height: 640 },
      { name: "360px", width: 360, height: 740 },
      { name: "390px", width: 390, height: 844 },
      { name: "430px", width: 430, height: 932 },
      { name: "768px", width: 768, height: 1024 },
      { name: "1024px", width: 1024, height: 768 },
      { name: "1280px", width: 1280, height: 800 },
      { name: "1440px", width: 1440, height: 900 },
      { name: "1920px", width: 1920, height: 1080 },
      { name: "landscape-844px", width: 844, height: 390 },
    ];

    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          report.consoleErrors.push({ viewport: vp.name, text: msg.text() });
        }
      });

      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);

      const check = await page.evaluate(() => {
        const header = document.querySelector("header");
        const headerRect = header ? header.getBoundingClientRect() : null;
        const headerScrollWidth = header ? header.scrollWidth : 0;
        const winWidth = window.innerWidth;
        const logo = document.querySelector("header img");
        const donateBtns = Array.from(document.querySelectorAll("header a[href='/donate']"));
        const visibleDonateBtn = donateBtns.find((b) => {
          const r = b.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && window.getComputedStyle(b).display !== "none";
        });

        const headerCS = header ? window.getComputedStyle(header) : null;
        const logoRect = logo ? logo.getBoundingClientRect() : null;
        const headerOverflows = headerScrollWidth > winWidth || (headerRect ? Math.round(headerRect.width) > winWidth : false);

        return {
          hasHeaderOverflow: headerOverflows,
          headerScrollWidth,
          winWidth,
          isSticky: headerCS ? headerCS.position === "sticky" : false,
          headerHeight: header ? header.offsetHeight : 0,
          logoVisible: logoRect ? logoRect.width > 0 && logoRect.height > 0 : false,
          logoWidth: logoRect ? Math.round(logoRect.width) : 0,
          donateVisible: !!visibleDonateBtn,
        };
      });

      const screenshotName = `header-${vp.name}.png`;
      const screenshotPath = path.join(SCREENSHOT_DIR, screenshotName);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      report.viewportsTested.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        overflowPass: !check.hasHeaderOverflow,
        isSticky: check.isSticky,
        headerHeight: check.headerHeight,
        logoVisible: check.logoVisible,
        logoWidth: check.logoWidth,
        donateVisible: check.donateVisible,
        screenshot: screenshotName,
      });

      console.log(`  [${vp.name}] Header Overflow Pass: ${!check.hasHeaderOverflow} | Sticky: ${check.isSticky} | Header Height: ${check.headerHeight}px | Donate CTA: ${check.donateVisible}`);
      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 2: Desktop Dropdown Navigation (1440px)
    // -------------------------------------------------------------
    console.log("\n=== 2. DESKTOP DROPDOWN NAVIGATION (1440px) ===");
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

      // Test About dropdown disclosure button
      const aboutToggle = page.locator("#nav-toggle-about");
      await aboutToggle.click();
      await page.waitForTimeout(300);

      const dropdownState = await page.evaluate(() => {
        const toggle = document.querySelector("#nav-toggle-about");
        const flyout = document.querySelector("#nav-disclosure-about");
        const links = flyout ? Array.from(flyout.querySelectorAll("a")).map((a) => a.textContent?.trim()) : [];
        return {
          ariaExpanded: toggle?.getAttribute("aria-expanded"),
          flyoutVisible: flyout ? window.getComputedStyle(flyout).opacity === "1" : false,
          childLinksCount: links.length,
          childLinks: links,
        };
      });

      const dropdownScreenshotPath = path.join(SCREENSHOT_DIR, "desktop-dropdown-about.png");
      await page.screenshot({ path: dropdownScreenshotPath });

      // Test Escape key dismissal
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
      const afterEscapeState = await page.evaluate(() => {
        const toggle = document.querySelector("#nav-toggle-about");
        const flyout = document.querySelector("#nav-disclosure-about");
        return {
          ariaExpanded: toggle?.getAttribute("aria-expanded"),
          flyoutExists: !!flyout,
        };
      });

      report.dropdownTest = {
        openState: dropdownState,
        escapeDismissal: afterEscapeState.ariaExpanded === "false" || !afterEscapeState.flyoutExists,
      };
      console.log("  [About Dropdown Open]:", dropdownState);
      console.log("  [About Dropdown Escape Dismiss]:", report.dropdownTest.escapeDismissal);

      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 3: Fullscreen Editorial Navigation Overlay (Desktop 1440px)
    // -------------------------------------------------------------
    console.log("\n=== 3. FULLSCREEN EDITORIAL NAVIGATION OVERLAY (1440px) ===");
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

      // Click "Menu" trigger
      const menuBtn = page.locator("header button[aria-label='Open comprehensive institutional menu']");
      await menuBtn.click();
      await page.waitForTimeout(400);

      const overlayDesktopState = await page.evaluate(() => {
        const overlay = document.querySelector("#fullscreen-editorial-overlay");
        const bodyOverflow = document.body.style.overflow;
        const charterHeading = overlay?.querySelector("h3");
        const institutionalGivingCard = overlay?.textContent?.includes("80G Tax Benefit") && overlay?.textContent?.includes("Bank Transfer Credentials");
        const navLinks = overlay ? Array.from(overlay.querySelectorAll("a[href]")).length : 0;
        const closeBtn = overlay?.querySelector("button[aria-label='Close institutional menu']");
        const activeElementTag = document.activeElement?.tagName;
        const activeElementAria = document.activeElement?.getAttribute("aria-label");

        return {
          overlayVisible: !!overlay,
          role: overlay?.getAttribute("role"),
          ariaModal: overlay?.getAttribute("aria-modal"),
          ariaLabelledBy: overlay?.getAttribute("aria-labelledby"),
          hasAccessibleName: !!document.querySelector("#institutional-nav-title"),
          bodyOverflowLocked: bodyOverflow === "hidden",
          charterHeading: charterHeading?.textContent?.trim().slice(0, 45),
          institutionalGivingCardPresent: institutionalGivingCard,
          navLinksCount: navLinks,
          closeButtonFocused: activeElementAria === "Close institutional menu",
        };
      });

      const overlayScreenshotPath = path.join(SCREENSHOT_DIR, "overlay-desktop-1440px.png");
      await page.screenshot({ path: overlayScreenshotPath });

      // Test Escape key closes overlay and restores body scroll
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);

      const afterCloseState = await page.evaluate(() => {
        const overlay = document.querySelector("#fullscreen-editorial-overlay");
        const bodyOverflow = document.body.style.overflow;
        return {
          overlayClosed: !overlay,
          bodyScrollRestored: bodyOverflow === "unset" || bodyOverflow === "",
        };
      });

      report.overlayDesktopTest = {
        openState: overlayDesktopState,
        closeState: afterCloseState,
      };
      console.log("  [Desktop Overlay Open]:", overlayDesktopState);
      console.log("  [Desktop Overlay Escape Close]:", afterCloseState);

      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 4: Mobile Navigation Overlay & Touch Usability (360px & 390px)
    // -------------------------------------------------------------
    console.log("\n=== 4. MOBILE NAVIGATION DRAWER & TOUCH TARGETS (360px & 390px) ===");
    for (const width of [360, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: 800 },
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

      // Click mobile hamburger
      const hamburger = page.locator("header button[aria-label='Open navigation menu']");
      await hamburger.click();
      await page.waitForTimeout(400);

      const mobileCheck = await page.evaluate(() => {
        const overlay = document.querySelector("#fullscreen-editorial-overlay");
        const links = overlay ? Array.from(overlay.querySelectorAll("a, button")) : [];
        let touchTargetViolations = 0;
        for (const el of links) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            if (rect.height < 38) {
              touchTargetViolations++;
            }
          }
        }
        const donateNowBtn = overlay?.querySelector("#overlay-primary-donate-cta") || overlay?.querySelector("a[href='/donate']");
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;

        return {
          overlayVisible: !!overlay,
          horizontalOverflow: docWidth > winWidth,
          touchTargetViolations,
          donateNowVisible: donateNowBtn ? donateNowBtn.getBoundingClientRect().height >= 44 : false,
        };
      });

      const mobileScreenshotPath = path.join(SCREENSHOT_DIR, `overlay-mobile-${width}px.png`);
      await page.screenshot({ path: mobileScreenshotPath });

      // Close via close button
      const closeBtn = page.locator("button[aria-label='Close institutional menu']");
      await closeBtn.click();
      await page.waitForTimeout(300);

      report.overlayMobileTest[`${width}px`] = {
        openCheck: mobileCheck,
      };
      console.log(`  [Mobile ${width}px] Overflow: ${!mobileCheck.horizontalOverflow} | Touch Targets Pass: ${mobileCheck.touchTargetViolations === 0} | Donate CTA: ${mobileCheck.donateNowVisible}`);
      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 5: Scroll-Responsive Header Compression
    // -------------------------------------------------------------
    console.log("\n=== 5. SCROLL-RESPONSIVE COMPRESSION & BACKDROP BLUR (1440px) ===");
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

      const initialHeaderState = await page.evaluate(() => {
        const nav = document.querySelector("header nav");
        return {
          paddingTop: nav ? window.getComputedStyle(nav).paddingTop : null,
          paddingBottom: nav ? window.getComputedStyle(nav).paddingBottom : null,
          height: nav ? nav.offsetHeight : 0,
        };
      });

      // Scroll down 400px
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(400);

      const scrolledHeaderState = await page.evaluate(() => {
        const nav = document.querySelector("header nav");
        const cs = nav ? window.getComputedStyle(nav) : null;
        return {
          paddingTop: cs?.paddingTop,
          paddingBottom: cs?.paddingBottom,
          height: nav ? nav.offsetHeight : 0,
          backdropFilter: cs?.backdropFilter,
          boxShadow: cs?.boxShadow,
        };
      });

      const scrolledScreenshotPath = path.join(SCREENSHOT_DIR, "header-scrolled-1440px.png");
      await page.screenshot({ path: scrolledScreenshotPath });

      report.scrollResponsiveTest = {
        initial: initialHeaderState,
        scrolled: scrolledHeaderState,
        compressionDelta: initialHeaderState.height - scrolledHeaderState.height,
        hasElevation: scrolledHeaderState.boxShadow !== "none",
      };
      console.log("  [Initial Header]:", initialHeaderState);
      console.log("  [Scrolled Header]:", scrolledHeaderState);
      console.log("  [Height Compression]:", `${report.scrollResponsiveTest.compressionDelta}px reduction`);

      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 6: Reduced Motion Emulation (1440px)
    // -------------------------------------------------------------
    console.log("\n=== 6. REDUCED MOTION BEHAVIOUR (1440px) ===");
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

      // Open menu overlay in reduced motion
      const menuBtn = page.locator("header button[aria-label='Open comprehensive institutional menu']");
      await menuBtn.click();
      await page.waitForTimeout(100); // 100ms only (should be immediate)

      const reducedCheck = await page.evaluate(() => {
        const overlay = document.querySelector("#fullscreen-editorial-overlay");
        const cs = overlay ? window.getComputedStyle(overlay) : null;
        return {
          overlayImmediateOpacity: cs?.opacity,
          overlayImmediateTransform: cs?.transform,
          overlayVisible: cs?.opacity === "1",
        };
      });

      const reducedScreenshotPath = path.join(SCREENSHOT_DIR, "header-reduced-motion-1440px.png");
      await page.screenshot({ path: reducedScreenshotPath });

      report.reducedMotionTest = reducedCheck;
      console.log("  [Reduced Motion Immediate Display]:", reducedCheck);

      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 7: Route Regression & Active Navigation Detection
    // -------------------------------------------------------------
    console.log("\n=== 7. FUNCTIONAL ROUTE REGRESSION (15 KEY ROUTES) ===");
    const testRoutes = [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Programmes", path: "/programmes" },
      { name: "Impact", path: "/impact" },
      { name: "Governance", path: "/governance" },
      { name: "CSR Partnerships", path: "/csr-partnerships" },
      { name: "Scholarships", path: "/scholarships" },
      { name: "Volunteer", path: "/volunteer" },
      { name: "Reports", path: "/reports" },
      { name: "Donate", path: "/donate" },
      { name: "Contact", path: "/contact" },
      { name: "Statutory Disclosures", path: "/statutory-disclosures" },
      { name: "Donor Portal Login", path: "/portal/login" },
      { name: "FAQ", path: "/faq" },
      { name: "Accessibility", path: "/accessibility" },
    ];

    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();

      for (const route of testRoutes) {
        const res = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle" });
        const status = res?.status();
        const headerInfo = await page.evaluate(() => {
          const h = document.querySelector("header");
          if (!h) return { present: false, overflowPass: false };
          const rect = h.getBoundingClientRect();
          const winW = window.innerWidth;
          const overflows = h.scrollWidth > winW || Math.round(rect.width) > winW;
          return { present: true, overflowPass: !overflows };
        });

        report.routeRegression.push({
          name: route.name,
          path: route.path,
          status,
          headerPresent: headerInfo.present,
          overflowPass: headerInfo.overflowPass,
        });

        console.log(`  [Route ${route.path}] HTTP ${status} | Header: ${headerInfo.present} | Header Overflow Pass: ${headerInfo.overflowPass}`);
      }
      await context.close();
    }

    await browser.close();

    // Save full JSON summary
    const summaryPath = path.join(SCREENSHOT_DIR, "header-qa-summary.json");
    fs.writeFileSync(summaryPath, JSON.stringify(report, null, 2), "utf8");
    console.log(`\nPhase 21.3 QA Complete! Summary saved to: ${summaryPath}`);
  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("QA script failed:", err);
  process.exit(1);
});
