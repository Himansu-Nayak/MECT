import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const PORT = 3007;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const AXE_DIR = path.resolve("audit/axe");

if (!fs.existsSync(AXE_DIR)) {
  fs.mkdirSync(AXE_DIR, { recursive: true });
}

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
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(check, 500);
        }
      });
      req.on("error", () => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Server failed to start within ${timeout}ms`));
        } else {
          setTimeout(check, 500);
        }
      });
    }
    check();
  });
}

async function runAxeAudits() {
  console.log("=== RUNNING FULL AXE-CORE AUDIT ACROSS 9 TEMPLATES ===");

  // Ensure fresh build before testing
  console.log(`Starting standalone Next.js server on port ${PORT}...`);
  const serverProcess = spawn("node", ["server.js"], {
    cwd: path.resolve(".next/standalone"),
    stdio: "pipe",
    env: { ...process.env, PORT: String(PORT), HOSTNAME: "127.0.0.1", NODE_ENV: "production" }
  });

  serverProcess.stdout.on("data", (d) => {
    const s = d.toString().trim();
    if (s.includes("Ready") || s.includes("started") || s.includes("Listening")) {
      console.log(`[Next.js Server] ${s}`);
    }
  });

  serverProcess.stderr.on("data", (d) => {
    const s = d.toString().trim();
    if (!s.includes("internal image response failed")) {
      console.error(`[Next.js Server Error] ${s}`);
    }
  });

  await waitForServer(`${BASE_URL}/`);
  console.log(`Server responding at ${BASE_URL}. Launching browser...`);

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const summary = {};

  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    for (const item of TEMPLATES) {
      console.log(`\nAuditing template: ${item.slug} (${item.route})...`);
      await page.goto(`${BASE_URL}${item.route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      const axeResults = await new AxeBuilder({ page }).analyze();
      const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

      for (const v of axeResults.violations) {
        counts[v.impact] = (counts[v.impact] || 0) + 1;
      }

      const outPath = path.join(AXE_DIR, `${item.slug}.json`);
      fs.writeFileSync(outPath, JSON.stringify(axeResults, null, 2), "utf8");

      summary[item.slug] = {
        route: item.route,
        violations: counts,
        totalViolations: axeResults.violations.length,
        incomplete: axeResults.incomplete ? axeResults.incomplete.length : 0,
        passes: axeResults.passes ? axeResults.passes.length : 0,
        violationDetails: axeResults.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          nodes: v.nodes.length
        }))
      };

      console.log(
        `Results for ${item.slug}: ` +
        `critical=${counts.critical}, serious=${counts.serious}, ` +
        `moderate=${counts.moderate}, minor=${counts.minor}, ` +
        `incomplete=${summary[item.slug].incomplete}, passes=${summary[item.slug].passes}`
      );
    }

    console.log("\n================ AXE AUDIT COMPLETE ================");
    console.log(JSON.stringify(summary, null, 2));

    const totalCrit = Object.values(summary).reduce((a, b) => a + b.violations.critical, 0);
    const totalSer = Object.values(summary).reduce((a, b) => a + b.violations.serious, 0);
    const totalMod = Object.values(summary).reduce((a, b) => a + b.violations.moderate, 0);
    const totalMin = Object.values(summary).reduce((a, b) => a + b.violations.minor, 0);
    const totalInc = Object.values(summary).reduce((a, b) => a + b.incomplete, 0);

    console.log(`\nTOTALS: Critical=${totalCrit}, Serious=${totalSer}, Moderate=${totalMod}, Minor=${totalMin}, Incomplete=${totalInc}`);

    await page.close();
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill("SIGTERM");
      console.log("Local test server terminated.");
    }
  }
}

runAxeAudits().catch((err) => {
  console.error("Axe audit runner failed:", err);
  process.exit(1);
});
