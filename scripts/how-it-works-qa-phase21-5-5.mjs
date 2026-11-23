import { chromium } from "playwright";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const PORT = 3300;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_5_5");

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

      // Scroll to #how-mect-works section to trigger inView animations
      await page.evaluate(async () => {
        const el = document.getElementById("how-mect-works");
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

      // Check section content
      const sectionInfo = await page.evaluate(() => {
        const section = document.getElementById("how-mect-works");
        if (!section) return null;

        const h2 = section.querySelector("h2#how-it-works-heading");
        const h2Rect = h2 ? h2.getBoundingClientRect() : null;
        const h2Style = h2 ? window.getComputedStyle(h2) : null;

        const img = section.querySelector("img[src*='illustrative-community-library-reading']");
        const imgRect = img ? img.getBoundingClientRect() : null;
        const imgStyle = img ? window.getComputedStyle(img) : null;

        const textContent = section.textContent || "";
        const hasEyebrow = textContent.includes("Our Approach");
        const hasHeading = textContent.includes("From community needs to meaningful action.");

        // 5 Stages presence
        const hasStage1 = textContent.includes("01") && textContent.includes("Community-Informed Programme Planning") && textContent.includes("Field Consultation Practice");
        const hasStage2 = textContent.includes("02") && textContent.includes("Charitable Charter Alignment") && textContent.includes("Statutory Trust Rule");
        const hasStage3 = textContent.includes("03") && textContent.includes("Institutional Banking & General Fund Administration") && textContent.includes("Documented Banking Channel");
        const hasStage4 = textContent.includes("04") && textContent.includes("Direct Grassroots Delivery") && textContent.includes("Active Field Operations");
        const hasStage5 = textContent.includes("05") && textContent.includes("Transparent Reporting & Public Accountability") && textContent.includes("Audited Public Compliance");

        // Integrity assertions: no account numbers, no 45°C, no Form 10B balance sheet confusion, no central charitable reserve, qualified CSR wording, no statutory Section 11 fund claims
        const noEmbeddedBankAccounts = !textContent.includes("33341302498");
        const noExaggeratedTemperature = !textContent.includes("45°C");
        const noForm10BBalanceSheet = !textContent.includes("Form 10B audited balance sheets");
        const noCentralCharitableReserve = !textContent.includes("central charitable reserve");
        const hasCsrWording = textContent.includes("CSR00081063") && textContent.includes("Any CSR project engagement remains subject to applicable eligibility requirements");
        const noStatutorySection11FundClaim = !textContent.includes("general fund under Section 11") && !textContent.includes("Section 11 allocation");
        const hasInternalFundClassification = textContent.includes("internal General Fund classification");

        // 5 Questions presence
        const hasQ1 = textContent.includes("How does MECT identify and understand community needs?");
        const hasQ2 = textContent.includes("How are educational and community programmes planned?");
        const hasQ3 = textContent.includes("How are resources and institutional support organized?");
        const hasQ4 = textContent.includes("How are programmes and activities delivered?");
        const hasQ5 = textContent.includes("How are records, outcomes and institutional responsibilities communicated?");

        // 4 Audience Pathways
        const hasAudience1 = textContent.includes("Students & Families") && textContent.includes("Explore Programmes");
        const hasAudience2 = textContent.includes("Donors & Supporters") && textContent.includes("Make a Donation");
        const hasAudience3 = textContent.includes("Volunteers & Mentors") && textContent.includes("Register as Volunteer");
        const hasAudience4 = textContent.includes("CSR & Institutional Partners") && textContent.includes("CSR Partnerships");

        // Fiduciary Assurance Panel
        const hasFiduciary = textContent.includes("Fiduciary Transparency Standard") &&
                             textContent.toLowerCase().includes("honorary, non-remunerative") &&
                             !textContent.toLowerCase().includes("zero commissions");

        const hasIllustrativeContext = textContent.includes("Illustrative Context");

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
          eyebrowVerified: hasEyebrow,
          headingVerified: hasHeading,
          stagesVerified: hasStage1 && hasStage2 && hasStage3 && hasStage4 && hasStage5,
          integrityVerified: noEmbeddedBankAccounts && noExaggeratedTemperature && noForm10BBalanceSheet && noCentralCharitableReserve && hasCsrWording && noStatutorySection11FundClaim && hasInternalFundClassification,
          questionsVerified: hasQ1 && hasQ2 && hasQ3 && hasQ4 && hasQ5,
          audiencesVerified: hasAudience1 && hasAudience2 && hasAudience3 && hasAudience4,
          fiduciaryVerified: hasFiduciary,
          illustrativeContextVerified: hasIllustrativeContext,
        };
      });

      const shotPath = path.join(
        SCREENSHOT_DIR,
        `how_it_works_${vp.name.replace(/[^a-zA-Z0-9_]/g, "")}.png`
      );
      const sectionElement = await page.$("#how-mect-works");
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
        stagesVerified: sectionInfo?.stagesVerified ?? false,
        integrityVerified: sectionInfo?.integrityVerified ?? false,
        questionsVerified: sectionInfo?.questionsVerified ?? false,
        audiencesVerified: sectionInfo?.audiencesVerified ?? false,
        fiduciaryVerified: sectionInfo?.fiduciaryVerified ?? false,
        illustrativeContextVerified: sectionInfo?.illustrativeContextVerified ?? false,
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
      const el = document.getElementById("how-mect-works");
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    });
    await rmPage.waitForTimeout(600);

    const rmEval = await rmPage.evaluate(() => {
      const h2 = document.querySelector("#how-mect-works h2#how-it-works-heading");
      const img = document.querySelector("#how-mect-works img");
      return {
        h2Opacity: h2 ? window.getComputedStyle(h2).opacity : null,
        imgOpacity: img ? window.getComputedStyle(img).opacity : null,
      };
    });

    report.reducedMotionTest = rmEval;
    const rmShot = path.join(SCREENSHOT_DIR, "how_it_works_reduced_motion.png");
    const rmSection = await rmPage.$("#how-mect-works");
    if (rmSection) {
      await rmSection.screenshot({ path: rmShot });
    }
    console.log(`Saved reduced motion screenshot: ${rmShot}`);
    await rmContext.close();

    // -------------------------------------------------------------
    // TEST 3: CTA Link Destinations
    // -------------------------------------------------------------
    console.log("\nTesting CTA Links...");
    const ctaContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const ctaPage = await ctaContext.newPage();
    await ctaPage.goto(BASE_URL, { waitUntil: "networkidle" });

    const ctas = await ctaPage.evaluate(() => {
      const section = document.getElementById("how-mect-works");
      if (!section) return [];
      const links = Array.from(section.querySelectorAll("a[href]"));
      return links.map((a) => ({
        text: a.innerText.replace(/\s+/g, " ").trim(),
        href: a.getAttribute("href"),
      }));
    });

    report.ctaVerification = ctas;
    console.log("Verified CTAs:", ctas);
    await ctaContext.close();

    await browser.close();

    const resultPath = path.resolve(process.cwd(), "reports/how-it-works-phase21-5-5-results.json");
    fs.writeFileSync(resultPath, JSON.stringify(report, null, 2));
    console.log(`\nAll tests completed! Saved reports/how-it-works-phase21-5-5-results.json`);
  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
