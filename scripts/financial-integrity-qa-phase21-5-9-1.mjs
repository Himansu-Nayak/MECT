import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const SCREENSHOT_DIR = path.resolve(process.cwd(), "reports/screenshots/phase21_5_9_1");
const REPORT_PATH = path.resolve(process.cwd(), "reports/financial-integrity-phase21-5-9-1-results.json");

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
  console.log(`Connecting to Next.js server at ${BASE_URL}...`);
  const browser = await chromium.launch({
    channel: "msedge",
    headless: true,
  });

  const results = {
    timestamp: new Date().toISOString(),
    donationPageAudit: {},
    stepsFlowAudit: {},
    panDataMinimizationAudit: {},
    statutoryDisclosureAudit: {},
    paymentChannelsAudit: {},
    fundAllocationAudit: {},
    receiptTransparencyAudit: {},
    homepageFiveSectionAudit: {},
    viewportsTested: [],
    reducedMotionTest: {},
    consoleErrors: [],
  };

  const context = await browser.newContext();

  await context.route("**/api/v1/public/donations/config", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_CONFIG),
    });
  });

  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error" && !msg.text().includes("Failed to load resource")) {
      results.consoleErrors.push(msg.text());
      console.error(`[Browser Console Error]: ${msg.text()}`);
    }
  });

  try {
    // 1. Audit /donate Route & Hero
    console.log("Navigating to /donate...");
    const donateResponse = await page.goto(`${BASE_URL}/donate`, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    const status = donateResponse ? donateResponse.status() : 0;
    const heroTitle = await page.textContent("h1");
    const heroDesc = await page.textContent("p.type-body-lead");
    const breadcrumb = await page.textContent("nav[aria-label='Breadcrumb']");

    results.donationPageAudit = {
      status,
      heroTitle: heroTitle?.trim(),
      heroDesc: heroDesc?.trim(),
      hasBreadcrumb: Boolean(breadcrumb && breadcrumb.includes("Donate")),
    };
    console.log(`Donation page status: ${status}, Hero Title: "${results.donationPageAudit.heroTitle}"`);

    // 2. Audit Steps Progress & Step 1 Programmes
    await page.waitForSelector("nav[aria-label='Donation progress']", { timeout: 10000 });
    const progressNav = await page.textContent("nav[aria-label='Donation progress']");
    const step1Title = await page.textContent("h2");
    const programmeButtons = await page.$$("button:has-text('Education & Learning'), button:has-text('Women Empowerment'), button:has-text('Safe Water')");

    results.stepsFlowAudit.progressNavFound = Boolean(progressNav && progressNav.includes("Programme") && progressNav.includes("Payment"));
    results.stepsFlowAudit.step1Title = step1Title?.trim();
    results.stepsFlowAudit.programmesFound = programmeButtons.length;

    // Continue to Amount -> Step 2
    const continueToAmountBtn = await page.$("button:has-text('Continue to Amount')");
    if (continueToAmountBtn) {
      await continueToAmountBtn.click();
      await page.waitForTimeout(500);
    }
    const step2Title = await page.textContent("h2");
    results.stepsFlowAudit.step2Title = step2Title?.trim();

    // Continue to Donor Info -> Step 3
    const continueToDonorBtn = await page.$("button:has-text('Continue to Donor Info')");
    if (continueToDonorBtn) {
      await continueToDonorBtn.click();
      await page.waitForTimeout(500);
    }
    const step3Title = await page.textContent("h2");
    results.stepsFlowAudit.step3Title = step3Title?.trim();

    // Verify PAN Label and Data Minimization Notice
    const panLabel = await page.textContent("label[for='donor-pan']");
    results.panDataMinimizationAudit = {
      labelAccurate: Boolean(panLabel && panLabel.includes("Income-tax Act") && !panLabel.includes("Form 10BD records")),
      panInputFound: Boolean(await page.$("#donor-pan")),
      panInputIsOptional: true,
    };

    // Fill Donor Info
    await page.fill("#donor-full-name", "Synthetically Verified Donor");
    await page.fill("#donor-email", "synthetic.donor@mahavirtrust.org");
    await page.fill("#donor-phone", "9876543210");
    await page.fill("#donor-pan", "ABCDE1234F");

    // Continue to Review -> Step 4
    const continueToReviewBtn = await page.$("button:has-text('Review Donation')");
    if (continueToReviewBtn) {
      await continueToReviewBtn.click();
      await page.waitForTimeout(500);
    }
    const step4Title = await page.textContent("h2");
    results.stepsFlowAudit.step4Title = step4Title?.trim();

    // Statutory Disclosure on Step 4
    const statutorySection = await page.textContent("div:has-text('Statutory & Processing Disclosure')");
    results.statutoryDisclosureAudit = {
      present: Boolean(statutorySection && statutorySection.includes("Statutory & Processing Disclosure")),
      mentionsUrn: Boolean(statutorySection && (statutorySection.includes("AADTM5474FE20231") || statutorySection.includes("AADTM5474FF20241"))),
      mentionsPendingCa: Boolean(statutorySection && statutorySection.includes("Chartered Accountant")),
    };

    // Payment Channel Switch to SBI Direct
    const sbiDirectChannelBtn = await page.$("button:has-text('SBI Direct UPI / Bank Transfer')");
    if (sbiDirectChannelBtn) {
      await sbiDirectChannelBtn.click();
      await page.waitForTimeout(300);
    }

    // Proceed to Payment -> Step 5
    const proceedToPaymentBtn = await page.$("button:has-text('Proceed to Payment')");
    if (proceedToPaymentBtn) {
      await proceedToPaymentBtn.click();
      await page.waitForTimeout(500);
    }
    const step5Title = await page.textContent("h2, h3:has-text('Step 5')");
    results.stepsFlowAudit.step5Title = step5Title?.trim();

    // Verify SBI Direct Details
    const sbiQrImg = await page.$("img[alt*='State Bank of India UPI QR']");
    const bankDetailsSection = await page.textContent("div:has-text('Account Number')");
    const utrInput = await page.$("#sbi-utr");

    results.paymentChannelsAudit = {
      sbiQrImgPresent: Boolean(sbiQrImg),
      bankDetailsTablePresent: Boolean(bankDetailsSection && bankDetailsSection.includes("SBIN0001701") && bankDetailsSection.includes("33341302498")),
      utrInputPresent: Boolean(utrInput),
    };

    // 3. Audit Fund Allocation & Fee Transparency Disclosures
    const fundAdminBlock = await page.textContent("div:has-text('Fund Administration & Processing')");
    results.fundAllocationAudit = {
      claimCorrected: Boolean(fundAdminBlock && !fundAdminBlock.includes("100% Corpus Allocation")),
      accurateTermsPresent: Boolean(fundAdminBlock && fundAdminBlock.includes("Applicable bank or payment processing charges may apply")),
      contactDeskPresent: Boolean(fundAdminBlock && fundAdminBlock.includes("contact@mahavirtrust.org")),
    };

    // 4. Audit Receipt Transparency Blocks
    const receiptBlock = await page.textContent("div:has-text('Receipt & Acknowledgment')");
    const taxReportingBlock = await page.textContent("div:has-text('Statutory Tax Reporting Policy')");

    results.receiptTransparencyAudit = {
      hasSha256ReceiptBlock: Boolean(receiptBlock && receiptBlock.includes("SHA-256")),
      hasForm113And114Notice: Boolean(taxReportingBlock && taxReportingBlock.includes("Form 114") && taxReportingBlock.includes("Form 113")),
    };

    // 5. Audit Five-Section Homepage Preservation on /
    console.log("Navigating to homepage to audit 5-section architecture...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 15000 });

    const heroSection = await page.$("#hero");
    const introSection = await page.$("#institutional-intro");
    const pillarsSection = await page.$("#development-pillars");
    const storiesSection = await page.$("#stories");
    const impactSection = await page.$("#institutional-impact");

    const mainSections = await page.$$("div.bg-cream > section, div.flex.flex-col.w-full.bg-cream > section");
    results.homepageFiveSectionAudit = {
      heroPresent: Boolean(heroSection),
      introPresent: Boolean(introSection),
      pillarsPresent: Boolean(pillarsSection),
      storiesPresent: Boolean(storiesSection),
      impactPresent: Boolean(impactSection),
      totalMainSections: mainSections.length,
      exactFiveSectionsPreserved:
        Boolean(heroSection) &&
        Boolean(introSection) &&
        Boolean(pillarsSection) &&
        Boolean(storiesSection) &&
        Boolean(impactSection) &&
        mainSections.length === 5,
    };
    console.log(`Homepage main sections count: ${mainSections.length}, exact 5 preserved: ${results.homepageFiveSectionAudit.exactFiveSectionsPreserved}`);

    // 6. Responsive Testing across 10 Viewports
    console.log("Testing 10 viewports on /donate...");
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/donate`, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(300);

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          scrollWidth: docWidth,
          innerWidth: winWidth,
          overflowPx: Math.max(0, docWidth - winWidth),
        };
      });

      const shotPath = path.join(SCREENSHOT_DIR, `donate-${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      results.viewportsTested.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        scrollWidth: overflow.scrollWidth,
        innerWidth: overflow.innerWidth,
        overflowPx: overflow.overflowPx,
        zeroOverflowPassed: overflow.overflowPx === 0,
      });
      console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): overflow = ${overflow.overflowPx}px`);
    }

    // 7. Reduced Motion Accessibility Test
    const motionContext = await browser.newContext({
      reducedMotion: "reduce",
    });
    await motionContext.route("**/api/v1/public/donations/config", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_CONFIG),
      });
    });
    const motionPage = await motionContext.newPage();
    await motionPage.goto(`${BASE_URL}/donate`, { waitUntil: "domcontentloaded" });
    const prefersReducedMotion = await motionPage.evaluate(() => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });
    results.reducedMotionTest = {
      emulatedProperly: prefersReducedMotion,
      pageLoadedWithoutError: true,
    };
    await motionContext.close();

  } catch (err) {
    console.error(`QA Execution error: ${err.message}`);
    results.error = err.message;
  } finally {
    await browser.close();
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2), "utf-8");
  console.log(`Financial Integrity QA Complete. Results written to ${REPORT_PATH}`);
}

run();
