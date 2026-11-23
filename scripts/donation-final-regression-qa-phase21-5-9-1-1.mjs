import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_5_9_1_1");
const REPORT_PATH = path.resolve(process.cwd(), "reports/financial-regression-phase21-5-9-1-1-results.json");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
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

const MOCK_CONFIG = {
  programmes: [
    {
      code: "EDUCATION_LEARNING",
      name: "Education & Learning (Shiksha Setu)",
      tagline: "Direct remedial learning, scholarship guidance, and school kit support.",
      description: "Supports student stipends, school fee support, and remedial learning across rural and semi-urban learning centres.",
      active: true,
    },
    {
      code: "WOMEN_EMPOWERMENT",
      name: "Women Empowerment & Livelihoods (Swavalamban)",
      tagline: "Self-help group facilitation, tailoring training, and micro-enterprise mentorship.",
      description: "Equips rural women with livelihood skills, micro-enterprise training, and community leadership opportunities.",
      active: true,
    },
    {
      code: "SAFE_WATER_SANITATION",
      name: "Safe Water & Sanitation (Jal Seva)",
      tagline: "Community drinking water kiosks and sanitation infrastructure maintenance.",
      description: "Funds local drinking water points, summer Jal Seva kiosks, and sanitation infrastructure maintenance.",
      active: true,
    },
    {
      code: "FOOD_SECURITY_RELIEF",
      name: "Food Security & Nutrition (Jan Ahar)",
      tagline: "Nutritional ration support for distressed families and emergency community relief.",
      description: "Distributes nutritious grains and meal assistance to vulnerable households facing distress.",
      active: true,
    },
    {
      code: "COMMUNITY_WELFARE",
      name: "Community Welfare & Relief (Samaj Kalyan)",
      tagline: "Emergency medical aid, calamity relief, and community welfare interventions.",
      description: "Provides responsive emergency assistance, winter warm-clothes distribution, and distress welfare support.",
      active: true,
    },
  ],
  gatewayStatus: {
    cashfreeActive: true,
    razorpayActive: true,
    himActive: true,
    checkoutEnvironment: "sandbox",
  },
  config: {
    cashfreeEnabled: true,
    sbiQrEnabled: true,
    himEnabled: false,
    primaryMethod: "GATEWAY",
    fallbackEnabled: true,
    minAmount: 100,
    maxAmount: 1000000,
    presetAmounts: [500, 1000, 1500, 3000, 5000, 10000],
    generalFundEnabled: false,
    sbiBankName: "State Bank of India",
    sbiAccountName: "MAHAVEER EDUCATIONAL CHARITA",
    sbiAccountNumber: "33341302498",
    sbiIfsc: "SBIN0001701",
    sbiBranch: "Main Branch, Balangir",
    sbiUpiId: "86971610172@sbi",
    sbiQrImageUrl: "/images/mect-sbi-upi-qr.png",
    paymentInstructions: "Verify beneficiary name MAHAVEER EDUCATIONAL CHARITA in your UPI app before confirming transfer, then submit your 12-digit UTR/reference for verification.",
    gatewayNoticeText: "Online payments are processed via Cashfree. Direct SBI UPI/bank transfers are verified manually by MECT Accounts before final receipt issuance.",
    statutoryStatus: "UNCONFIRMED_FY_2026_27",
    statutoryFinancialYear: "FY 2026-27",
    statutoryEffectiveDate: "2024-01-29",
    statutoryExpiryDate: "2026-03-31",
    statutoryUrn80g: "AADTM5474FF20241",
    statutoryUrn12a: "AADTM5474FE20231",
    statutoryClaimApproved: false,
    statutoryDisclosureText: "Historical Form 10AC Section 12A (URN: AADTM5474FE20231) and Section 80G (URN: AADTM5474FF20241) orders dated 29-01-2024 covered AY 2024-25 to AY 2026-27. Current tax year 2026-27 eligibility is pending Chartered Accountant confirmation.",
  },
};

async function run() {
  console.log("=== MECT Phase 21.5.9.1.1 Final Receipt & Financial Regression Verification ===");
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });
  const results = {
    timestamp: new Date().toISOString(),
    viewports: {},
    homepageSections: [],
    financialIntegrityChecks: {},
    passCount: 0,
    failCount: 0,
  };

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent: "MECT-QA-Agent/21.5.9.1.1",
      });
      const page = await context.newPage();

      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });
      page.on("pageerror", (err) => {
        consoleErrors.push(err.message);
      });

      // Route mock API handler with complete MOCK_CONFIG
      await page.route("**/api/v1/public/donations/config", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(MOCK_CONFIG),
        });
      });

      await page.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      const overflow = await page.evaluate(() => {
        const docEl = document.documentElement;
        return {
          scrollWidth: docEl.scrollWidth,
          clientWidth: docEl.clientWidth,
          hasOverflow: docEl.scrollWidth > docEl.clientWidth,
          overflowPx: docEl.scrollWidth - docEl.clientWidth,
        };
      });

      const screenshotPath = path.join(SCREENSHOT_DIR, `donate_${vp.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      const vpResult = {
        name: vp.name,
        width: vp.width,
        height: vp.height,
        overflowPx: overflow.overflowPx,
        hasOverflow: overflow.hasOverflow,
        consoleErrors,
        screenshot: screenshotPath,
        passed: overflow.overflowPx === 0 && consoleErrors.length === 0,
      };

      if (vpResult.passed) {
        results.passCount++;
        console.log(`  ✓ Passed (Overflow: 0px, Errors: 0)`);
      } else {
        results.failCount++;
        console.log(`  ✗ Failed: Overflow=${overflow.overflowPx}px, Errors=${consoleErrors.length}`);
      }

      results.viewports[vp.name] = vpResult;
      await context.close();
    }

    // Comprehensive content, contact, outbox copy, and PAN checks at 1280px
    console.log("\n=== Checking Donate Content, Contact, Outbox Copy & PAN Minimization ===");
    const testContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const testPage = await testContext.newPage();

    await testPage.route("**/api/v1/public/donations/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CONFIG),
      });
    });

    await testPage.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });

    const htmlContent = await testPage.content();

    // 1. Contact address verification: donations@mect.org.in must be present, contact@mahavirtrust.org must NOT exist
    const hasCanonicalDonationsEmail = htmlContent.includes("donations@mect.org.in");
    const hasCanonicalPhone = htmlContent.includes("+91 94371 23616");
    const hasUnverifiedMockEmail = htmlContent.includes("contact@mahavirtrust.org");

    console.log(`  Canonical donations email (donations@mect.org.in): ${hasCanonicalDonationsEmail ? "PRESENT ✓" : "MISSING ✗"}`);
    console.log(`  Canonical phone (+91 94371 23616): ${hasCanonicalPhone ? "PRESENT ✓" : "MISSING ✗"}`);
    console.log(`  Old unverified mock email (contact@mahavirtrust.org): ${!hasUnverifiedMockEmail ? "ABSENT (CLEAN) ✓" : "DETECTED ✗"}`);

    // 2. Outbox receipt persistence wording in footer
    const hasOutboxFooterCopy = htmlContent.includes("transactional outbox for email delivery") || htmlContent.includes("permanently accessible in your authenticated Donor Portal");
    console.log(`  Outbox queuing footer copy: ${hasOutboxFooterCopy ? "PRESENT ✓" : "MISSING ✗"}`);

    // 3. Step through form to inspect Step 3 Donor Info (Email and PAN minimization)
    // Select first programme
    const firstProg = testPage.locator('button:has-text("Education & Learning (Shiksha Setu)")');
    if (await firstProg.count() > 0) {
      await firstProg.click();
    }
    // Continue to amount
    const continueBtn1 = testPage.locator('button:has-text("Continue to Amount")');
    if (await continueBtn1.count() > 0) {
      await continueBtn1.click();
      await testPage.waitForTimeout(300);
    }
    // Continue to Donor Info
    const continueBtn2 = testPage.locator('button:has-text("Continue to Donor Info")');
    if (await continueBtn2.count() > 0) {
      await continueBtn2.click();
      await testPage.waitForTimeout(300);
    }

    const step3Html = await testPage.content();
    const hasEmailOutboxNote = step3Html.includes("Receipts are immediately available in your Donor Portal; an electronic copy is queued to this address.");
    const hasPanMinimizationNote = step3Html.includes("80G claims are pending CA confirmation. Optional PAN is recorded solely for future statutory filings if approved.");

    console.log(`  Email outbox helper note on Step 3: ${hasEmailOutboxNote ? "PRESENT ✓" : "MISSING ✗"}`);
    console.log(`  PAN data minimization & CA confirmation disclaimer on Step 3: ${hasPanMinimizationNote ? "PRESENT ✓" : "MISSING ✗"}`);

    results.financialIntegrityChecks = {
      hasCanonicalDonationsEmail,
      hasCanonicalPhone,
      hasNoMockEmail: !hasUnverifiedMockEmail,
      hasOutboxFooterCopy,
      hasEmailOutboxNote,
      hasPanMinimizationNote,
    };

    await testContext.close();

    // 4. Verify Homepage Exactly 5 Sections
    console.log("\n=== Checking Homepage Five-Section Architecture ===");
    const homeContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const homePage = await homeContext.newPage();
    await homePage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

    const expectedSections = [
      { id: "hero", label: "Cinematic Hero" },
      { id: "institutional-intro", label: "Institutional Introduction" },
      { id: "development-pillars", label: "Development Pillars" },
      { id: "stories", label: "Field Dispatches (Stories)" },
      { id: "institutional-impact", label: "Institutional Impact & Evidence" },
    ];

    for (const sec of expectedSections) {
      const el = homePage.locator(`section#${sec.id}`);
      const count = await el.count();
      results.homepageSections.push({
        id: sec.id,
        label: sec.label,
        found: count > 0,
      });
      console.log(`  Section #${sec.id} (${sec.label}): ${count > 0 ? "FOUND ✓" : "MISSING ✗"}`);
    }

    const totalSectionsOnMain = await homePage.evaluate(() => {
      const main = document.querySelector("main");
      if (!main) return 0;
      return main.querySelectorAll("section").length;
    });
    console.log(`  Total sections in <main>: ${totalSectionsOnMain} (Expected: 5)`);
    results.exactFiveSections = totalSectionsOnMain === 5;

    await homeContext.close();

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    await browser.close();
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2));
  console.log(`\nResults written to: ${REPORT_PATH}`);
  console.log(`Pass count: ${results.passCount} / ${VIEWPORTS.length}`);
}

run();
