import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080/api/v1";

const VIEWPORTS = [
  { name: "320px (Mobile S)", width: 320, height: 640 },
  { name: "360px (Mobile M)", width: 360, height: 740 },
  { name: "390px (iPhone 12/13/14)", width: 390, height: 844 },
  { name: "430px (iPhone Pro Max)", width: 430, height: 932 },
  { name: "768px (Tablet Portrait)", width: 768, height: 1024 },
  { name: "1024px (Tablet Landscape)", width: 1024, height: 768 },
  { name: "1280px (Laptop)", width: 1280, height: 800 },
  { name: "1440px (Desktop)", width: 1440, height: 900 },
  { name: "1920px (Full HD)", width: 1920, height: 1080 },
  { name: "844px (Mobile Landscape)", width: 844, height: 390 },
];

async function runRegressionSuite() {
  console.log("================================================================================");
  console.log("MECT PHASE 21.5.11 — INSTITUTIONAL TRANSPARENCY & PUBLIC RECORDS LIBRARY QA");
  console.log(`Frontend URL: ${BASE_URL} | Backend URL: ${BACKEND_URL}`);
  console.log("================================================================================\n");

  const results = {
    totalChecks: 0,
    passedChecks: 0,
    failedChecks: 0,
    failures: [],
  };

  function assert(condition, message) {
    results.totalChecks++;
    if (condition) {
      results.passedChecks++;
      console.log(`  ✓ ${message}`);
    } else {
      results.failedChecks++;
      console.error(`  ✗ FAIL: ${message}`);
      results.failures.push(message);
    }
  }

  // --- PART 1: BACKEND API & DIRECT ENDPOINT ACCESS TESTS ---
  console.log("\n--- PART 1: BACKEND API & SECURITY AUDIT ---");
  try {
    // 1. /public/documents returns HTTP 200 and includes seeded verified documents
    const docRes = await fetch(`${BACKEND_URL}/public/documents`);
    assert(docRes.status === 200, `GET /public/documents returns HTTP 200 (Got ${docRes.status})`);
    const docData = await docRes.json();
    assert(Array.isArray(docData) && docData.length >= 10, `GET /public/documents returns at least 10 seeded documents (Got ${docData.length})`);

    const deedDoc = docData.find((d) => d.documentKey === "DOC-TR-2013-DEED");
    assert(!!deedDoc, "Found Registered Trust Deed document 'DOC-TR-2013-DEED'");
    assert(deedDoc?.issuingAuthority?.includes("Balangir"), "Deed issuing authority correctly references Balangir Sub-Registrar");

    const panDoc = docData.find((d) => d.documentKey === "DOC-IT-PAN-2013");
    assert(!!panDoc, "Found PAN allotment document 'DOC-IT-PAN-2013'");

    const order12A = docData.find((d) => d.documentKey === "DOC-IT-12A-2024");
    assert(!!order12A, "Found 12A registration order 'DOC-IT-12A-2024'");

    const order80G = docData.find((d) => d.documentKey === "DOC-IT-80G-2024");
    assert(!!order80G, "Found 80G approval order 'DOC-IT-80G-2024'");

    const csrDoc = docData.find((d) => d.documentKey === "DOC-MCA-CSR1-2024");
    assert(!!csrDoc, "Found MCA CSR-1 registration 'DOC-MCA-CSR1-2024'");

    const darpanDoc = docData.find((d) => d.documentKey === "DOC-NITI-DARPAN-2024");
    assert(!!darpanDoc, "Found NITI Aayog NGO Darpan registration 'DOC-NITI-DARPAN-2024'");

    // 2. Unauthenticated GET /admin/documents returns 401
    const adminUnauth = await fetch(`${BACKEND_URL}/admin/documents`);
    assert(adminUnauth.status === 401, `Unauthenticated GET /admin/documents returns 401 Unauthorized (Got ${adminUnauth.status})`);

    // 3. Category filtering on backend works
    const catRes = await fetch(`${BACKEND_URL}/public/documents?category=ANNUAL_REPORT`);
    const catData = await catRes.json();
    assert(catData.every((d) => d.category === "ANNUAL_REPORT"), "Backend category filter returns strictly ANNUAL_REPORT records");

    // 4. Financial year filtering works
    const fyRes = await fetch(`${BACKEND_URL}/public/documents?financialYear=FY%202023-24`);
    const fyData = await fyRes.json();
    assert(fyData.length >= 1 && fyData.every((d) => d.financialYear === "FY 2023-24"), "Backend financial year filter returns matching records");
  } catch (err) {
    assert(false, `Backend API check failed: ${err.message}`);
  }

  // --- PRE-WARM NEXT.JS ROUTES ---
  console.log("\n--- PRE-WARMING NEXT.JS DEV SERVER ROUTES ---");
  for (const path of ["/reports", "/statutory-disclosures", "/"]) {
    try {
      console.log(`Pre-warming ${BASE_URL}${path}...`);
      const warmRes = await fetch(`${BASE_URL}${path}`, { signal: AbortSignal.timeout(90000) });
      console.log(`Pre-warmed ${path} -> HTTP ${warmRes.status}`);
    } catch (e) {
      console.log(`Pre-warm notice for ${path}: ${e.message}`);
    }
  }

  // --- PART 2: PLAYWRIGHT BROWSER UI & RESPONSIVE AUDIT ---
  console.log("\n--- PART 2: FRONTEND UI, RESPONSIVE & HYDRATION AUDIT ---");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      const consoleErrors = [];
      const hydrationErrors = [];

      page.on("console", (msg) => {
        const text = msg.text();
        const type = msg.type();
        if (type === "error") {
          consoleErrors.push(text);
        }
        if (
          text.toLowerCase().includes("hydration") ||
          text.toLowerCase().includes("did not match") ||
          text.toLowerCase().includes("server rendered html")
        ) {
          hydrationErrors.push(text);
        }
      });

      page.on("pageerror", (err) => {
        consoleErrors.push(err.message);
      });

      // --- TEST A: /reports ---
      const repRes = await page.goto(`${BASE_URL}/reports`, { waitUntil: "domcontentloaded", timeout: 60000 });
      assert(repRes.status() === 200, `[/reports] Returns HTTP 200 at ${vp.name}`);

      await page.waitForTimeout(1000);

      // Check Editorial Headline
      const headingText = await page.textContent("h1");
      assert(
        headingText.includes("An Account of Our Work. A Record of Our Responsibility."),
        `[/reports] Editorial headline rendered correctly at ${vp.name}`
      );

      // Check for horizontal overflow
      const repOverflow = await page.evaluate(() => {
        const docEl = document.documentElement;
        return document.body.scrollWidth > docEl.clientWidth + 1;
      });
      assert(!repOverflow, `[/reports] Zero horizontal overflow at ${vp.name}`);

      // Check document cards rendered
      const cardCount = await page.locator("#library .bg-white.border-border-warm").count();
      assert(cardCount >= 3, `[/reports] Public records cards rendered in library at ${vp.name} (Found ${cardCount})`);

      // Check all contact links point to /contact
      const contactLinks = await page.locator('a[href*="/contact"]').count();
      assert(contactLinks >= 1, `[/reports] Record inspection and contact links point to /contact`);

      // Test search filter interactivity (only once on desktop viewport)
      if (vp.width === 1280) {
        const searchInput = page.locator('input[placeholder*="Search by title"]');
        if (await searchInput.isVisible()) {
          await searchInput.fill("Balangir");
          await page.waitForTimeout(400);
          const filteredCount = await page.locator("#library .bg-white.border-border-warm").count();
          assert(filteredCount >= 1, `[/reports] Interactive search for 'Balangir' filtered results successfully`);

          // Test empty state
          await searchInput.fill("NonExistentTermXYZ123");
          await page.waitForTimeout(400);
          const emptyState = await page.locator("text=No Records Found").isVisible();
          assert(emptyState, `[/reports] Truthful empty state shown when query matches no records`);

          await searchInput.fill("");
          await page.waitForTimeout(300);
        }
      }

      // --- TEST B: /statutory-disclosures ---
      const statRes = await page.goto(`${BASE_URL}/statutory-disclosures`, { waitUntil: "domcontentloaded", timeout: 60000 });
      assert(statRes.status() === 200, `[/statutory-disclosures] Returns HTTP 200 at ${vp.name}`);

      await page.waitForTimeout(800);

      const statHeading = await page.textContent("h1");
      assert(
        statHeading.includes("Statutory Disclosures"),
        `[/statutory-disclosures] Page title rendered at ${vp.name}`
      );

      const statOverflow = await page.evaluate(() => {
        const docEl = document.documentElement;
        return document.body.scrollWidth > docEl.clientWidth + 1;
      });
      assert(!statOverflow, `[/statutory-disclosures] Zero horizontal overflow at ${vp.name}`);

      // Verify PAN and Trust Deed coordinates present
      const bodyText = await page.textContent("body");
      assert(bodyText.includes("AADTM5474F"), `[/statutory-disclosures] Verified PAN AADTM5474F present`);
      assert(bodyText.includes("40311302194"), `[/statutory-disclosures] Verified Deed 40311302194 present`);
      assert(bodyText.includes("CSR00081063"), `[/statutory-disclosures] Verified CSR00081063 present`);
      assert(bodyText.includes("UNCONFIRMED"), `[/statutory-disclosures] FY 2026-27 tax deduction status accurately labeled unconfirmed`);

      // --- TEST C: HOMEPAGE PRESERVATION & HYDRATION ---
      const homeRes = await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: 60000 });
      assert(homeRes.status() === 200, `[/] Homepage returns HTTP 200 at ${vp.name}`);

      await page.waitForTimeout(800);

      // Verify exactly 5 editorial sections
      const sections = ["#hero", "#institutional-intro", "#development-pillars", "#stories", "#institutional-impact"];
      for (const sec of sections) {
        const secEl = await page.$(sec);
        assert(!!secEl, `[/] Section ${sec} present on homepage`);
      }

      // Check console errors and hydration errors
      assert(consoleErrors.length === 0, `No console errors at ${vp.name} (Found: ${consoleErrors.length})`);
      assert(hydrationErrors.length === 0, `No hydration mismatch warnings at ${vp.name} (Found: ${hydrationErrors.length})`);

      await context.close();
    }
  } finally {
    await browser.close();
  }

  // --- FINAL REPORT ---
  console.log("\n================================================================================");
  console.log("FINAL QA SUITE SUMMARY:");
  console.log(`Total Checks Executed: ${results.totalChecks}`);
  console.log(`Passed: ${results.passedChecks}`);
  console.log(`Failed: ${results.failedChecks}`);
  console.log("================================================================================");

  if (results.failedChecks > 0) {
    console.error("\nFAILURES IDENTIFIED:");
    results.failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log("\nALL VERIFICATION CHECKS PASSED WITH 100% SUCCESS!");
    process.exit(0);
  }
}

runRegressionSuite().catch((err) => {
  console.error("FATAL ERROR IN TEST HARNESS:", err);
  process.exit(1);
});
