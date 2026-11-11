import { chromium } from "file:///C:/Users/himan/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
import { spawn, spawnSync } from "node:child_process";

const PORT = 3114;
const BASE = `http://127.0.0.1:${PORT}`;

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 350));
  }
  throw new Error(`Server timeout at ${url}`);
}

const server = spawn("npx", ["next", "start", "-p", String(PORT), "-H", "127.0.0.1"], {
  shell: true,
  stdio: ["ignore", "pipe", "pipe"],
});

let browser;
let failures = 0;

function check(name, cond, detail = "") {
  if (cond) {
    console.log(`PASS | ${name}${detail ? " :: " + detail : ""}`);
  } else {
    console.error(`FAIL | ${name}${detail ? " :: " + detail : ""}`);
    failures++;
  }
}

try {
  await waitForServer(`${BASE}/donate`);
  browser = await chromium.launch({ headless: true, channel: "chrome" });

  const consoleErrors = [];
  const pageErrors = [];
  let initiateCount = 0;
  let verifyCalls = 0;
  let verifyMode = "USER_DROPPED";
  let sdkLaunchedWithSession = null;

  async function installApiMocks(page) {
    await page.route("https://sdk.cashfree.com/js/v3/cashfree.js", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `
          window.Cashfree = function(cfg) {
            window.__cfMode = cfg && cfg.mode;
            return {
              checkout: async function(opts) {
                window.__cfLastSession = opts && opts.paymentSessionId;
                return { paymentDetails: { paymentMessage: "Simulated SDK finish" } };
              }
            };
          };
        `,
      });
    });

    await page.route("**/api/v1/public/donations/gateway-status", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          provider: "CASHFREE",
          configured: true,
          sandboxMode: true,
          dynamicQrSupported: false,
          checkoutMode: "CASHFREE_SDK_V3",
          checkoutEnvironment: "sandbox",
          reason: "Cashfree Payment Gateway active (sandbox)",
        }),
      });
    });

    await page.route("**/api/v1/public/donations/programmes", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            code: "EDUCATION_LEARNING",
            name: "Education & Learning (Shiksha Setu)",
            tagline: "Remedial coaching & college fees",
            description: "Free education for students in Odisha.",
            generalFund: false,
            active: true,
            displayOrder: 1,
          },
          {
            id: 2,
            code: "WOMEN_EMPOWERMENT",
            name: "Women Empowerment (Swavalamban)",
            tagline: "Vocational tailoring toolkits",
            description: "Livelihood support.",
            generalFund: false,
            active: true,
            displayOrder: 2,
          },
        ]),
      });
    });

    await page.route("**/api/v1/public/donations/initiate", async (route) => {
      initiateCount++;
      const body = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          donationReference: `MECT-DON-2026-E2E${initiateCount}`,
          orderId: `MECT-DON-2026-E2E${initiateCount}`,
          status: "PENDING",
          amount: body.amount,
          currency: "INR",
          programmeCode: body.programmeCode,
          programmeName: "Education & Learning (Shiksha Setu)",
          paymentMethod: "GATEWAY_CHECKOUT",
          provider: "CASHFREE",
          providerOrderId: `MECT-DON-2026-E2E${initiateCount}`,
          cfOrderId: `CF_E2E_${initiateCount}`,
          paymentSessionId: `session_e2e_test_${initiateCount}`,
          checkoutEnvironment: "sandbox",
          checkoutMode: "CASHFREE_SDK_V3",
          expiresAt: new Date(Date.now() + 900000).toISOString(),
        }),
      });
    });

    await page.route("**/api/v1/payments/cashfree/verify", async (route) => {
      verifyCalls++;
      const reqBody = route.request().postDataJSON();
      if (verifyMode === "USER_DROPPED") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            donationReference: reqBody.orderId,
            orderId: reqBody.orderId,
            cfOrderId: "CF_E2E_1",
            provider: "CASHFREE",
            status: "USER_DROPPED",
            paymentStatus: "USER_DROPPED",
            amount: 2750,
            currency: "INR",
            programmeName: "Education & Learning (Shiksha Setu)",
            paymentMethod: "GATEWAY_CHECKOUT",
            failureReason: "Donor closed Cashfree prompt before payment",
            receiptAvailable: false,
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            donationReference: reqBody.orderId,
            orderId: reqBody.orderId,
            cfOrderId: "CF_E2E_2",
            provider: "CASHFREE",
            status: "SUCCESSFUL",
            paymentStatus: "SUCCESSFUL",
            paymentGroup: "upi",
            bankReference: "UTR8877665544",
            amount: 2750,
            currency: "INR",
            programmeName: "Education & Learning (Shiksha Setu)",
            paymentMethod: "GATEWAY_CHECKOUT",
            confirmedAt: new Date().toISOString(),
            receiptNumber: "MECT-RCPT-2026-TEST01",
            receiptAvailable: true,
          }),
        });
      }
    });
  }

  // 1. Desktop flow (1440x900)
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktopCtx.newPage();
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  await installApiMocks(page);

  await page.goto(`${BASE}/donate`, { waitUntil: "domcontentloaded" });

  const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  check("Desktop /donate no horizontal overflow", !desktopOverflow);

  let hasCashfreeCta = false;
  try {
    await page.locator("button:has-text('Proceed to Cashfree Secure Checkout')").waitFor({ state: "visible", timeout: 8000 });
    hasCashfreeCta = true;
  } catch {}
  check("Desktop Cashfree CTA renders when provider=CASHFREE", hasCashfreeCta);

  // Verify preset click + custom amount + small amount validation inside #smart-donate
  const checkout = page.locator("#smart-donate");
  await checkout.locator("button:has-text('₹5,000')").click();
  check("Preset button sets custom input to 5000", (await checkout.locator("#smart-custom-amount").inputValue()) === "5000");

  await checkout.locator("#smart-custom-amount").fill("0");
  await checkout.locator("#smart-donor-name").fill("E2E Supporter");
  await checkout.locator("button[type='submit']").click();
  const invalidAmountBlocked = await checkout.locator("#smart-custom-amount").evaluate((el) => !el.checkValidity());
  await checkout.locator("#smart-custom-amount").fill("1");
  const oneRupeeValid = await checkout.locator("#smart-custom-amount").evaluate((el) => el.checkValidity());
  check("Rejects amount < INR 1 and allows INR 1 cleanly", invalidAmountBlocked && oneRupeeValid && initiateCount === 0);

  // Enter valid amount 2750 + submit -> USER_DROPPED -> Retry -> SUCCESSFUL
  await checkout.locator("#smart-custom-amount").fill("2750");
  await checkout.locator("#smart-donor-email").fill("e2e@example.org");
  await checkout.locator("#smart-donor-phone").fill("+919876543210");
  await checkout.locator("button[type='submit']").click();

  await checkout.locator("text=Payment Not Completed (USER_DROPPED)").waitFor({ timeout: 10000 });
  sdkLaunchedWithSession = await page.evaluate(() => window.__cfLastSession);
  check("Cashfree SDK v3 launched with backend session", sdkLaunchedWithSession === "session_e2e_test_1");
  check("USER_DROPPED shows server-verified failure/drop panel & Retry", await checkout.locator("button:has-text('Try Payment Again')").isVisible());

  // Retry cleanly -> settled SUCCESSFUL
  verifyMode = "SUCCESSFUL";
  await checkout.locator("button:has-text('Try Payment Again')").click();
  await checkout.locator("button[type='submit']").click();
  await checkout.locator("text=Payment Verified & Confirmed").waitFor({ timeout: 10000 });

  check("Settled state shows receipt number MECT-RCPT-2026-TEST01", await checkout.locator("text=MECT-RCPT-2026-TEST01").first().isVisible());
  check("Settled state preserves Donor Portal link", await checkout.locator("a[href='/portal/dashboard']").first().isVisible());

  // 2. Direct return URL (?order_id=...) triggers server verification automatically
  await page.goto(`${BASE}/donate?order_id=MECT-DON-2026-RET99`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("text=Payment Verified & Confirmed", { timeout: 10000 });
  check("Return URL ?order_id=... automatically verifies server-side", verifyCalls >= 3 && (await page.locator("text=UTR8877665544").isVisible()));

  // Preserve verified SBI fallback visibility
  const bodyText = await page.evaluate(() => document.body.innerText);
  check("SBI Bank Account 33341302498 preserved intact", bodyText.includes("33341302498") && bodyText.includes("SBIN0001701"));

  await desktopCtx.close();

  // 3. Mobile responsiveness check (390x844)
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mobileCtx.newPage();
  mPage.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  mPage.on("pageerror", (e) => pageErrors.push(String(e)));
  await installApiMocks(mPage);

  await mPage.goto(`${BASE}/donate`, { waitUntil: "domcontentloaded" });
  const mobileOverflow = await mPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  check("Mobile (390px) /donate no horizontal overflow", !mobileOverflow);
  let mobileCtaVisible = false;
  try {
    await mPage.locator("button:has-text('Proceed to Cashfree Secure Checkout')").waitFor({ state: "visible", timeout: 8000 });
    mobileCtaVisible = true;
  } catch {}
  check("Mobile Cashfree CTA visible", mobileCtaVisible);
  await mobileCtx.close();

  check("Zero browser console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
  check("Zero uncaught page errors", pageErrors.length === 0, pageErrors.join(" | "));
} finally {
  if (browser) await browser.close();
  if (process.platform === "win32" && server.pid) {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    server.kill("SIGTERM");
  }
}

if (failures > 0) {
  console.error(`\nTotal E2E failures: ${failures}`);
  process.exit(1);
}
console.log("\nALL CASHFREE E2E FRONTEND VERIFICATIONS PASSED.");

