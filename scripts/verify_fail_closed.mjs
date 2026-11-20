import { chromium } from "playwright";

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

async function runFailClosedTests() {
  console.log(`[FAIL-CLOSED SUITE] Connecting to ${BASE_URL}...`);
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let donationClaimFailedClosed = false;
  let contactFailedClosed = false;

  // 1. Test /donate donation claim form with backend unreachable
  console.log("\n--> Auditing /donate claim form (fail-closed check)...");
  await page.goto(`${BASE_URL}/donate`, { waitUntil: "networkidle" });

  // Scroll to claim form
  await page.locator("#donation-claim-form").scrollIntoViewIfNeeded();

  // Fill in form inputs
  await page.fill('input[name="donorName"]', "Ananya Mishra");
  await page.fill('input[name="donorEmail"]', "ananya.mishra@example.org");
  await page.fill('input[name="donorPhone"]', "9437123616");
  await page.fill('input[name="amount"]', "2500");
  await page.fill('input[name="utrReference"]', "SBIN9876543210");
  await page.fill('input[name="transferDate"]', "2026-11-20");

  // Intercept the API response
  const [claimResponse] = await Promise.all([
    page.waitForResponse((res) => res.url().includes("/api/donations/claim")),
    page.click('#donation-claim-form button[type="submit"]'),
  ]);

  const claimStatus = claimResponse.status();
  const claimJson = await claimResponse.json();
  console.log(`    API Response: Status ${claimStatus}`, claimJson);

  if (claimStatus !== 503) {
    throw new Error(`Expected /api/donations/claim to return 503 when backend is unreachable, got ${claimStatus}`);
  }

  // Wait for alert box to be visible
  const claimAlert = page.locator('#donation-claim-form div[role="alert"]');
  await claimAlert.waitFor({ state: "visible", timeout: 5000 });
  const claimAlertText = await claimAlert.innerText();
  console.log(`    Alert Text: "${claimAlertText}"`);

  const expectedMsg = "We could not save your submission. Nothing has been recorded. Please email mect220@gmail.com or call +91 94371 23616 and quote your details.";
  if (!claimAlertText.includes(expectedMsg)) {
    throw new Error(`Alert text does not contain required advisory: "${claimAlertText}"`);
  }

  // Assert no reference text exists on screen
  const pageBodyText = await page.innerText("body");
  if (pageBodyText.includes("MECT-SBI-") || pageBodyText.includes("Claim Reference:")) {
    throw new Error("Unverified reference number was displayed on screen when backend was unreachable!");
  }
  console.log("    ✓ No reference number displayed on screen.");

  // Assert form values are preserved so user can retry
  const nameVal = await page.inputValue('input[name="donorName"]');
  const utrVal = await page.inputValue('input[name="utrReference"]');
  const amountVal = await page.inputValue('input[name="amount"]');
  if (nameVal !== "Ananya Mishra" || utrVal !== "SBIN9876543210" || amountVal !== "2500") {
    throw new Error("Form input values were cleared upon failure; expected inputs to be preserved for retry.");
  }
  console.log("    ✓ Form inputs preserved for retry.");
  donationClaimFailedClosed = true;

  // 2. Test /contact inquiry form with backend unreachable
  console.log("\n--> Auditing /contact inquiry form (fail-closed check)...");
  await page.goto(`${BASE_URL}/contact`, { waitUntil: "networkidle" });

  await page.locator("#inquiry-name").scrollIntoViewIfNeeded();

  await page.fill("#inquiry-name", "Priyanka Sahu");
  await page.fill("#inquiry-email", "priyanka.sahu@example.org");
  await page.fill("#inquiry-phone", "9437123616");
  await page.selectOption("#inquiry-category", "Scholarship");
  await page.fill("#inquiry-message", "Inquiring about tuition grant application timelines for Balangir students.");

  const [contactResponse] = await Promise.all([
    page.waitForResponse((res) => res.url().includes("/api/contact")),
    page.click('form button[type="submit"]'),
  ]);

  const contactStatus = contactResponse.status();
  const contactJson = await contactResponse.json();
  console.log(`    API Response: Status ${contactStatus}`, contactJson);

  if (contactStatus !== 503) {
    throw new Error(`Expected /api/contact to return 503 when backend is unreachable, got ${contactStatus}`);
  }

  // Wait for submission notice on contact form
  const contactNotice = page.locator("form div.bg-red-50");
  await contactNotice.waitFor({ state: "visible", timeout: 5000 });
  const contactNoticeText = await contactNotice.innerText();
  console.log(`    Notice Text: "${contactNoticeText}"`);

  if (!contactNoticeText.includes(expectedMsg)) {
    throw new Error(`Contact notice text does not contain required advisory: "${contactNoticeText}"`);
  }

  const contactBodyText = await page.innerText("body");
  if (contactBodyText.includes("MECT-INQ-") || contactBodyText.includes("Official Reference ID:")) {
    throw new Error("Unverified reference number was displayed on contact page when backend was unreachable!");
  }
  console.log("    ✓ No reference number displayed on screen.");

  // Assert form values are preserved
  const contactNameVal = await page.inputValue("#inquiry-name");
  const contactMsgVal = await page.inputValue("#inquiry-message");
  if (contactNameVal !== "Priyanka Sahu" || !contactMsgVal.includes("Inquiring about tuition grant")) {
    throw new Error("Contact form inputs were cleared upon failure; expected inputs to be preserved for retry.");
  }
  console.log("    ✓ Contact inputs preserved for retry.");
  contactFailedClosed = true;

  await context.close();
  await browser.close();

  if (donationClaimFailedClosed && contactFailedClosed) {
    console.log("\n=======================================================");
    console.log("ALL FAIL-CLOSED TESTS PASSED: HTTP 503, NO REFERENCES, FORM VALUES PRESERVED!");
    console.log("=======================================================\n");
  }
}

runFailClosedTests().catch((err) => {
  console.error("\n[FAIL-CLOSED SUITE FAILED]:", err.message);
  process.exit(1);
});
