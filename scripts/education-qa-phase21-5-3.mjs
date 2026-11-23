import { chromium } from "playwright";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const PORT = 3300;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_5_3");

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
    console.log("Server ready. Launching Edge browser...");

    const browser = await chromium.launch({
      channel: "msedge",
      headless: true,
    });

    const report = {
      timestamp: new Date().toISOString(),
      viewportsTested: [],
      ctaVerification: [],
      reducedMotionTest: {},
      consoleErrors: [],
    };

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
      { name: "landscape_844px", width: 844, height: 390 },
    ];

    for (const vp of viewports) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      const pageErrors = [];
      page.on("pageerror", (err) => pageErrors.push(err.message));
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          pageErrors.push(msg.text());
        }
      });

      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      // Scroll through #free-education-200 section to trigger inView animations & lazy images
      await page.evaluate(async () => {
        const el = document.getElementById("free-education-200");
        if (el) {
          const imgs = Array.from(el.querySelectorAll("img"));
          for (const img of imgs) {
            img.scrollIntoView({ behavior: "instant", block: "center" });
            if (!img.complete) {
              await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
                setTimeout(resolve, 600);
              });
            }
          }
          el.scrollIntoView({ behavior: "instant", block: "start" });
        }
      });
      await page.waitForTimeout(600);

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          docWidth,
          winWidth,
          overflowPx: Math.max(0, docWidth - winWidth),
        };
      });

      // Check section inspection
      const sectionInfo = await page.evaluate(() => {
        const section = document.getElementById("free-education-200");
        if (!section) return null;

        const h2 = section.querySelector("h2#free-education-heading");
        const h2Rect = h2 ? h2.getBoundingClientRect() : null;
        const h2Style = h2 ? window.getComputedStyle(h2) : null;

        // Image check
        const img = section.querySelector("img[src*='illustrative-community-library-reading']");
        const imgRect = img ? img.getBoundingClientRect() : null;
        const imgStyle = img ? window.getComputedStyle(img) : null;

        // Content checks
        const textContent = section.textContent || "";
        const hasFreeEducation = textContent.includes("Phased Free Education Delivery");
        const hasShikshaProtsahan = textContent.includes("Mahaveer Shiksha Protsahan");
        const hasPratibha = textContent.includes("Pratibha Excellence");
        const hasSamarth = textContent.includes("Project Samarth");
        const hasMentorship = textContent.includes("Academic & Career Mentorship");
        const hasDotGrid = !!section.querySelector(".edu-dot") || textContent.includes("Cohort Grid");
        const hasFiveStages = textContent.includes("SUBMITTED") &&
                              textContent.includes("UNDER_SCRUTINY") &&
                              textContent.includes("INSTITUTION_VERIFIED") &&
                              textContent.includes("COMMITTEE_APPROVED") &&
                              textContent.includes("DISBURSED");
        const hasPreApp = textContent.includes("Preliminary Informational Step") &&
                          textContent.includes("Pre-Application Self-Assessment");
        const hasZeroCash = textContent.includes("Zero-Cash");
        const hasAdvisory = textContent.includes("Preliminary Discovery Notice");

        return {
          exists: true,
          h2: {
            text: h2 ? h2.innerText.replace(/\s+/g, " ").trim() : null,
            visible: h2Rect ? h2Rect.width > 0 && h2Rect.height > 0 : false,
            fontSize: h2Style ? h2Style.fontSize : null,
          },
          image: {
            src: img ? img.currentSrc || img.src : null,
            naturalWidth: img ? img.naturalWidth : 0,
            naturalHeight: img ? img.naturalHeight : 0,
            visible: imgRect ? imgRect.width > 0 && imgRect.height > 0 && imgStyle.opacity !== "0" : false,
          },
          schemesVerified: hasShikshaProtsahan && hasPratibha && hasSamarth && hasMentorship,
          fiveStagesVerified: hasFiveStages && hasPreApp,
          dotGridVerified: hasDotGrid,
          zeroCashVerified: hasZeroCash,
          advisoryNoticeVerified: hasAdvisory,
        };
      });

      const shotPath = path.join(
        SCREENSHOT_DIR,
        `education_${vp.name.replace(/[^a-zA-Z0-9_]/g, "")}.png`
      );
      const sectionElement = await page.$("#free-education-200");
      if (sectionElement) {
        await sectionElement.screenshot({ path: shotPath });
      } else {
        await page.screenshot({ path: shotPath, fullPage: false });
      }
      console.log(`Saved screenshot: ${shotPath}`);

      report.viewportsTested.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        overflowPx: overflow.overflowPx,
        sectionExists: sectionInfo?.exists ?? false,
        h2Visible: sectionInfo?.h2.visible ?? false,
        h2Text: sectionInfo?.h2.text ?? "",
        h2FontSize: sectionInfo?.h2.fontSize ?? "",
        imageLoaded: (sectionInfo?.image.naturalWidth ?? 0) > 0,
        imageVisible: sectionInfo?.image.visible ?? false,
        schemesVerified: sectionInfo?.schemesVerified ?? false,
        fiveStagesVerified: sectionInfo?.fiveStagesVerified ?? false,
        dotGridVerified: sectionInfo?.dotGridVerified ?? false,
        zeroCashVerified: sectionInfo?.zeroCashVerified ?? false,
        advisoryNoticeVerified: sectionInfo?.advisoryNoticeVerified ?? false,
        errors: pageErrors,
      });

      if (pageErrors.length > 0) {
        report.consoleErrors.push({ viewport: vp.name, errors: pageErrors });
      }

      await context.close();
    }

    // -------------------------------------------------------------
    // TEST 2: Reduced Motion
    // -------------------------------------------------------------
    console.log("\nTesting Reduced Motion preference...");
    const rmContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto(BASE_URL, { waitUntil: "networkidle" });
    await rmPage.evaluate(() => {
      const el = document.getElementById("free-education-200");
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    });
    await rmPage.waitForTimeout(600);

    const rmEval = await rmPage.evaluate(() => {
      const h2 = document.querySelector("#free-education-200 h2#free-education-heading");
      const img = document.querySelector("#free-education-200 img");
      return {
        h2Opacity: h2 ? window.getComputedStyle(h2).opacity : null,
        imgOpacity: img ? window.getComputedStyle(img).opacity : null,
      };
    });

    const rmShot = path.join(SCREENSHOT_DIR, "education_reduced_motion.png");
    const rmElement = await rmPage.$("#free-education-200");
    if (rmElement) {
      await rmElement.screenshot({ path: rmShot });
    } else {
      await rmPage.screenshot({ path: rmShot, fullPage: false });
    }
    console.log(`Saved reduced motion screenshot: ${rmShot}`);
    report.reducedMotionTest = rmEval;
    await rmContext.close();

    // -------------------------------------------------------------
    // TEST 3: CTA Links
    // -------------------------------------------------------------
    console.log("\nTesting CTA Links...");
    const ctaContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const ctaPage = await ctaContext.newPage();
    await ctaPage.goto(BASE_URL, { waitUntil: "networkidle" });

    const ctas = await ctaPage.evaluate(() => {
      const section = document.getElementById("free-education-200");
      if (!section) return [];
      const links = Array.from(section.querySelectorAll("a"));
      return links.map((a) => ({
        text: a.innerText.replace(/\s+/g, " ").trim(),
        href: a.getAttribute("href"),
      }));
    });
    report.ctaVerification = ctas;
    console.log("Verified CTAs:", ctas);
    await ctaContext.close();

    await browser.close();

    fs.writeFileSync(
      path.resolve(process.cwd(), "reports/education-phase21-5-3-results.json"),
      JSON.stringify(report, null, 2)
    );
    console.log("\nAll tests completed! Saved reports/education-phase21-5-3-results.json");
  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    cleanup();
    process.exit(0);
  }
}

run();
