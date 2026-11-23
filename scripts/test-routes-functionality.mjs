import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";

const PORT = 3228;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const ROUTES_TO_AUDIT = [
  { path: "/", name: "Homepage", criticalContent: "Dignity Through Education" },
  { path: "/about", name: "About Us", criticalContent: "Guiding Values" },
  { path: "/programmes", name: "Programmes", criticalContent: "Five Connected Areas" },
  { path: "/impact", name: "Impact", criticalContent: "Operational Reach" },
  { path: "/governance", name: "Governance", criticalContent: "Clause XVI" },
  { path: "/reports", name: "Reports Library", criticalContent: "Public Records" },
  { path: "/campaigns", name: "Campaigns Directory", criticalContent: "Educational Opportunity" },
  { path: "/campaigns/hanuman-murti", name: "Hanuman Murti 3D", criticalContent: "HANUMAN_MURTI" },
  { path: "/csr-partnerships", name: "CSR Partnerships", criticalContent: "Schedule VII" },
  { path: "/donate", name: "Unified Donation Portal", criticalContent: "Give With Purpose" },
  { path: "/scholarships", name: "Higher Education Scholarships", criticalContent: "Academic Support" },
  { path: "/volunteer", name: "Volunteer Fellowship", criticalContent: "Community Fellowship" },
  { path: "/contact", name: "Contact & Secretariat", criticalContent: "9853608113" },
  { path: "/faq", name: "Frequently Asked Questions", criticalContent: "Frequently Asked Questions" },
  { path: "/statutory-disclosures", name: "Statutory Disclosures", criticalContent: "40311302194" },
  { path: "/memories-gallery", name: "Memories & Dispatches", criticalContent: "Field Dispatches" },
  { path: "/privacy", name: "Privacy Policy", criticalContent: "Privacy" },
  { path: "/terms", name: "Terms of Service", criticalContent: "Terms" },
  { path: "/accessibility", name: "Accessibility Statement", criticalContent: "Accessibility" },
  { path: "/robots.txt", name: "Robots.txt", isStaticText: true },
  { path: "/sitemap.xml", name: "Sitemap XML", isStaticText: true },
];

async function waitForServer(url, timeoutMs = 30000) {
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
  console.log(`Starting Next.js standalone server on port ${PORT}...`);
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
    await waitForServer(`${BASE_URL}/`);
    console.log("Server online! Auditing routes...");

    const browser = await chromium.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
    });

    const page = await browser.newPage();
    const results = [];

    for (const r of ROUTES_TO_AUDIT) {
      const pageUrl = `${BASE_URL}${r.path}`;
      const consoleErrors = [];
      const failedRequests = [];

      const onConsole = (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      };

      const onRequestFailed = (req) => {
        // Ignore expected backend fetch errors on localhost:8080 when testing offline fallback
        if (!req.url().includes("localhost:8080")) {
          failedRequests.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText || "unknown"}`);
        }
      };

      page.on("console", onConsole);
      page.on("requestfailed", onRequestFailed);

      try {
        const response = await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
        const status = response?.status() || 0;
        const html = await page.content();

        let hasCriticalContent = true;
        if (r.criticalContent) {
          hasCriticalContent = html.includes(r.criticalContent);
        }

        const passed = status === 200 && hasCriticalContent && consoleErrors.length === 0;

        results.push({
          path: r.path,
          name: r.name,
          status,
          hasCriticalContent,
          consoleErrorsCount: consoleErrors.length,
          failedRequestsCount: failedRequests.length,
          passed,
          consoleErrors,
        });

        console.log(`  ${passed ? "✓ PASS" : "✗ FAIL"} [${status}] ${r.path.padEnd(28)} - ${r.name}`);
        if (consoleErrors.length > 0) {
          console.warn(`      Errors:`, consoleErrors);
        }
      } catch (err) {
        results.push({
          path: r.path,
          name: r.name,
          status: 0,
          passed: false,
          error: err.message,
        });
        console.error(`  ✗ FAIL [ERR] ${r.path}: ${err.message}`);
      } finally {
        page.off("console", onConsole);
        page.off("requestfailed", onRequestFailed);
      }
    }

    await browser.close();

    const passCount = results.filter((r) => r.passed).length;
    console.log(`\nRoute Functionality Audit Complete: ${passCount}/${results.length} PASSED.`);
    fs.writeFileSync("reports/mect-phase-27-1-route-audit.json", JSON.stringify(results, null, 2));

  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
