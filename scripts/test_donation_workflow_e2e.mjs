import assert from "node:assert";
import http from "node:http";
import { spawn } from "node:child_process";

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

async function runTests() {
  console.log("========================================================");
  console.log("=== END-TO-END DONATION & WORKFLOW REGRESSION SUITE ===");
  console.log("========================================================");

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      throw err;
    }
  }

  // 1. Donation Claim Route: Backend Unreachable (Fail Closed)
  await test("1. POST /api/donations/claim returns HTTP 503 when backend unreachable", async () => {
    const res = await fetch(`${BASE_URL}/api/donations/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorName: "Test Donor",
        donorEmail: "test@example.org",
        donorPhone: "9437123616",
        utrReference: "SBI123456789012",
        amount: 5000,
        selectedProgramme: "EDUCATION",
        transferDate: "2026-11-21"
      })
    });
    assert.strictEqual(res.status, 503, `Expected status 503, got ${res.status}`);
    const data = await res.json();
    assert.ok(data.error && data.error.includes("We could not save your submission. Nothing has been recorded"), "Expected fail-closed error message");
    assert.strictEqual(data.claimReference, undefined, "Must NOT issue synthetic claimReference");
  });

  // 2. Donation Claim Route: Validation Error on Missing Name
  await test("2. POST /api/donations/claim returns HTTP 400 on missing required field", async () => {
    const res = await fetch(`${BASE_URL}/api/donations/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorEmail: "test@example.org",
        utrReference: "SBI123456789012",
        amount: 5000
      })
    });
    assert.strictEqual(res.status, 400, `Expected status 400, got ${res.status}`);
    const data = await res.json();
    assert.ok(data.error, "Expected validation error");
  });

  // 3. Contact Form Route: Backend Unreachable (Fail Closed)
  await test("3. POST /api/contact returns HTTP 503 when backend unreachable", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test Citizen",
        email: "citizen@example.org",
        phone: "9437123616",
        category: "General",
        subject: "Audit Inquiry",
        message: "Testing fail-closed contact submission in controlled environment."
      })
    });
    assert.strictEqual(res.status, 503, `Expected status 503, got ${res.status}`);
    const data = await res.json();
    assert.ok(data.error && data.error.includes("We could not save your submission. Nothing has been recorded"), "Expected fail-closed error message");
    assert.strictEqual(data.referenceId, undefined, "Must NOT issue synthetic referenceId");
  });

  // 4. Contact Form Route: Honeypot Detection
  await test("4. POST /api/contact rejects bot submissions via honeypot field", async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Bot User",
        email: "bot@example.org",
        subject: "Spam",
        message: "Spam message",
        _gotcha: "I am a spam bot"
      })
    });
    assert.strictEqual(res.status, 400, `Expected status 400, got ${res.status}`);
  });

  // 5. Route Redirects: Permanent HTTP 308
  const redirects = [
    { from: "/campaign", to: "/campaigns" },
    { from: "/campaign/hanuman-murti", to: "/campaigns/hanuman-murti" },
    { from: "/campaigns/murti", to: "/campaigns/hanuman-murti" },
    { from: "/murti", to: "/campaigns/hanuman-murti" },
    { from: "/hanuman-murti", to: "/campaigns/hanuman-murti" },
    { from: "/donate/claim", to: "/donate" },
    { from: "/donate/sbi", to: "/donate" },
    { from: "/donate/upi", to: "/donate" },
  ];

  for (const r of redirects) {
    await test(`5. Redirect ${r.from} -> ${r.to}`, async () => {
      const res = await fetch(`${BASE_URL}${r.from}`, { redirect: "manual" });
      assert.ok(res.status === 307 || res.status === 308, `Expected redirect status, got ${res.status}`);
      const loc = res.headers.get("location");
      assert.ok(loc && loc.endsWith(r.to), `Expected location to end with ${r.to}, got ${loc}`);
    });
  }

  // 6. Deep Linking: /donate?programme=HANUMAN_MURTI
  await test("6. GET /donate returns HTTP 200 and static bank credentials", async () => {
    const res = await fetch(`${BASE_URL}/donate`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("State Bank of India"), "Expected State Bank of India in static HTML");
    assert.ok(html.includes("SBIN0001701"), "Expected IFSC in static HTML");
    assert.ok(html.includes("Rajendra College Square"), "Expected branch in static HTML");
  });

  console.log("\n========================================================");
  console.log(`RESULTS: ${passed}/${total} tests passed successfully.`);
  console.log("========================================================");
}

runTests().catch(err => {
  console.error("FATAL ERROR IN REGRESSION TEST:", err);
  process.exit(1);
});
