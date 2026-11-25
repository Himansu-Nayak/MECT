import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const PORT = 3009;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const TEMPLATES = [
  { slug: "home", route: "/" },
  { slug: "programmes", route: "/programmes" },
  { slug: "donate", route: "/donate" },
  { slug: "about", route: "/about" },
  { slug: "scholarships", route: "/scholarships" },
  { slug: "contact", route: "/contact" },
  { slug: "stories", route: "/stories" },
  { slug: "reports", route: "/reports" },
  { slug: "statutory-disclosures", route: "/statutory-disclosures" }
];

function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function check() {
      const req = http.get(url, (res) => {
        if (res.statusCode === 200) resolve();
        else setTimeout(check, 500);
      });
      req.on("error", () => {
        if (Date.now() - start > timeout) reject(new Error(`Server failed to start within ${timeout}ms`));
        else setTimeout(check, 500);
      });
    }
    check();
  });
}

async function runGate1912A11y() {
  console.log("=== PHASE 3: GATE 19.12 ACCESSIBILITY FINAL VALIDATION ===");

  console.log(`Starting standalone Next.js server on port ${PORT}...`);
  const serverProcess = spawn("node", ["server.js"], {
    cwd: path.resolve(".next/standalone"),
    stdio: "pipe",
    env: { ...process.env, PORT: String(PORT), HOSTNAME: "127.0.0.1", NODE_ENV: "production" }
  });

  serverProcess.stdout.on("data", (d) => {
    const s = d.toString().trim();
    if (s.includes("Ready") || s.includes("started") || s.includes("Listening") || s.includes("Local:")) {
      console.log(`[Next.js Server] ${s}`);
    }
  });

  await waitForServer(`${BASE_URL}/`);
  console.log(`Server responding at ${BASE_URL}. Launching Chromium...`);

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const templateResults = {};

  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    for (const item of TEMPLATES) {
      console.log(`Auditing ${item.slug} (${item.route})...`);
      await page.goto(`${BASE_URL}${item.route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);

      const axeResults = await new AxeBuilder({ page }).analyze();
      const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
      for (const v of axeResults.violations) {
        counts[v.impact] = (counts[v.impact] || 0) + 1;
      }

      templateResults[item.slug] = {
        route: item.route,
        violations: counts,
        totalViolations: axeResults.violations.length,
        incomplete: axeResults.incomplete ? axeResults.incomplete.length : 0,
        passes: axeResults.passes ? axeResults.passes.length : 0,
        violationList: axeResults.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map(n => ({ target: n.target, html: n.html, failureSummary: n.failureSummary }))
        }))
      };
    }

    await page.close();
  } finally {
    await browser.close();
    serverProcess.kill("SIGTERM");
    console.log("Local test server stopped.");
  }

  // Load manual incomplete review
  const manualEvalPath = path.resolve("audit/final/manual_accessibility_evaluation.json");
  const manualEval = fs.existsSync(manualEvalPath) ? JSON.parse(fs.readFileSync(manualEvalPath, "utf8")) : [];

  const totalCrit = Object.values(templateResults).reduce((a, b) => a + b.violations.critical, 0);
  const totalSer = Object.values(templateResults).reduce((a, b) => a + b.violations.serious, 0);
  const totalMod = Object.values(templateResults).reduce((a, b) => a + b.violations.moderate, 0);
  const totalMin = Object.values(templateResults).reduce((a, b) => a + b.violations.minor, 0);
  const totalIncomplete = Object.values(templateResults).reduce((a, b) => a + b.incomplete, 0);
  const totalPasses = Object.values(templateResults).reduce((a, b) => a + b.passes, 0);

  const finalReport = {
    gate: "19.12.3",
    title: "Gate 19.12 Final Accessibility Verification (WCAG 2.2 AA)",
    timestamp: new Date().toISOString(),
    templatesAuditedCount: TEMPLATES.length,
    cumulativeViolations: {
      critical: totalCrit,
      serious: totalSer,
      moderate: totalMod,
      minor: totalMin,
      total: totalCrit + totalSer + totalMod + totalMin
    },
    totalIncompleteChecks: totalIncomplete,
    totalPassingRules: totalPasses,
    templates: templateResults,
    manualEvaluationsOfIncompleteChecks: manualEval,
    verdict: (totalCrit + totalSer + totalMod + totalMin === 0) ? "VERIFIED PASS" : "FAIL"
  };

  fs.writeFileSync("audit/final/gate_19_12_accessibility_final.json", JSON.stringify(finalReport, null, 2), "utf8");
  console.log("Written audit/final/gate_19_12_accessibility_final.json");
  console.log(`Final Accessibility Verdict: ${finalReport.verdict} (Total Violations: ${finalReport.cumulativeViolations.total})`);
}

runGate1912A11y().catch((err) => {
  console.error("Accessibility verification failed:", err);
  process.exit(1);
});
