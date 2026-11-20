import { chromium } from "playwright";
import lighthouse from "lighthouse";
import fs from "fs";
import path from "path";

const BASE_URL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const AUDIT_DIR = path.resolve(process.cwd(), "audit");
const LH_DIR = path.resolve(AUDIT_DIR, "lighthouse-perf-runs");

if (!fs.existsSync(LH_DIR)) {
  fs.mkdirSync(LH_DIR, { recursive: true });
}

const TARGET_PAGES = [
  "/",
  "/programmes",
  "/donate",
  "/about",
  "/scholarships",
  "/contact",
];

const NUM_RUNS = 3;

async function checkServerReady() {
  console.log(`[PERF SUITE] Checking server availability at ${BASE_URL}...`);
  for (let attempt = 1; attempt <= 15; attempt++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) {
        console.log("[PERF SUITE] Server is ready (HTTP " + res.status + ").");
        return;
      }
    } catch {
      // wait and retry
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Server at ${BASE_URL} not reachable. Start Next.js with 'npm run start' or 'next start -p 3000'.`);
}

function computeStats(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const spread = Math.round((max - min) * 1000) / 1000;
  // For 3 runs, median is index 1
  const median = sorted[Math.floor(sorted.length / 2)];
  return { median, min, max, spread, runs: sorted };
}

async function runSingleLighthouse(url) {
  const runnerResult = await lighthouse(url, {
    port: 9222,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "seo"],
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 3 },
    throttlingMethod: "simulate",
  });

  const reportJson = JSON.parse(runnerResult.report);
  const perfScore = Math.round((reportJson.categories.performance?.score || 0) * 100);
  const a11yScore = Math.round((reportJson.categories.accessibility?.score || 0) * 100);
  const seoScore = Math.round((reportJson.categories.seo?.score || 0) * 100);

  const lcpMs = reportJson.audits["largest-contentful-paint"]?.numericValue || 0;
  const lcpSec = Math.round((lcpMs / 1000) * 100) / 100;

  const cls = Math.round((reportJson.audits["cumulative-layout-shift"]?.numericValue || 0) * 1000) / 1000;

  return {
    perfScore,
    a11yScore,
    seoScore,
    lcpSec,
    cls,
    rawReport: runnerResult.report,
  };
}

async function main() {
  await checkServerReady();

  console.log("\n=======================================================");
  console.log(`MECT MULTI-RUN LIGHTHOUSE MOBILE PERFORMANCE SUITE`);
  console.log(`Auditing ${TARGET_PAGES.length} routes x ${NUM_RUNS} runs each against ${BASE_URL}`);
  console.log("=======================================================\n");

  const browser = await chromium.launch({
    channel: "chrome",
    args: ["--remote-debugging-port=9222"],
  });

  const allResults = {};
  let anyFailure = false;

  try {
    for (const route of TARGET_PAGES) {
      const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
      const url = `${BASE_URL}${route}`;
      console.log(`\n--> Auditing ${route} (${NUM_RUNS} runs)...`);

      const runs = [];
      for (let run = 1; run <= NUM_RUNS; run++) {
        process.stdout.write(`    Run ${run}/${NUM_RUNS}... `);
        const res = await runSingleLighthouse(url);
        runs.push(res);
        console.log(`Perf: ${res.perfScore} | LCP: ${res.lcpSec}s | CLS: ${res.cls} | A11y: ${res.a11yScore}`);
        fs.writeFileSync(path.join(LH_DIR, `${slug}-run${run}.json`), res.rawReport);
      }

      const perfStats = computeStats(runs.map((r) => r.perfScore));
      const lcpStats = computeStats(runs.map((r) => r.lcpSec));
      const clsStats = computeStats(runs.map((r) => r.cls));
      const a11yMedian = computeStats(runs.map((r) => r.a11yScore)).median;
      const seoMedian = computeStats(runs.map((r) => r.seoScore)).median;

      const perfPass = perfStats.median >= 90;
      const lcpPass = lcpStats.median <= 2.5;
      const clsPass = clsStats.median <= 0.1;
      const routePass = perfPass && lcpPass && clsPass;

      if (!routePass) {
        anyFailure = true;
      }

      allResults[route] = {
        route,
        status: routePass ? "PASS" : "FAIL",
        runsCount: NUM_RUNS,
        perf: perfStats,
        lcp: lcpStats,
        cls: clsStats,
        a11yMedian,
        seoMedian,
        gates: {
          perfGte90: perfPass,
          lcpLte2_5s: lcpPass,
          clsLte0_1: clsPass,
        },
      };

      console.log(`    => SUMMARY for ${route}:`);
      console.log(`       Perf Median: ${perfStats.median} (spread: ${perfStats.spread}, min: ${perfStats.min}, max: ${perfStats.max}) [${perfPass ? "PASS" : "FAIL"}]`);
      console.log(`       LCP Median:  ${lcpStats.median}s (spread: ${lcpStats.spread}s, min: ${lcpStats.min}s, max: ${lcpStats.max}s) [${lcpPass ? "PASS" : "FAIL"}]`);
      console.log(`       CLS Median:  ${clsStats.median} (spread: ${clsStats.spread}, min: ${clsStats.min}, max: ${clsStats.max}) [${clsPass ? "PASS" : "FAIL"}]`);
    }

    const reportPath = path.join(AUDIT_DIR, "perf_multi_run_results.json");
    fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
    console.log(`\n[PERF SUITE] All results written to ${reportPath}`);

    console.log("\n=======================================================");
    console.log("FINAL MULTI-RUN SUMMARY TABLE");
    console.log("=======================================================");
    console.table(
      Object.values(allResults).map((r) => ({
        Route: r.route,
        Status: r.status,
        "Perf Median": r.perf.median,
        "Perf Spread": r.perf.spread,
        "LCP Median (s)": r.lcp.median,
        "LCP Spread (s)": r.lcp.spread,
        "CLS Median": r.cls.median,
        "CLS Spread": r.cls.spread,
      }))
    );

    console.log("\nNote: Localhost tests exclude real network latency, TLS handshake, and CDN edge caching.");
    console.log("Post-deployment verification requires Google PageSpeed Insights against https://mect.org.in/.\n");

    if (anyFailure) {
      console.error("[PERF SUITE FAILED] One or more routes failed performance gates on the median.");
      process.exit(1);
    } else {
      console.log("[PERF SUITE PASSED] All 6 routes passed median Performance >= 90, LCP <= 2.5s, CLS <= 0.1.");
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("FATAL ERROR IN PERF VERIFICATION:", err);
  process.exit(1);
});
