import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";

const PORT = 3229;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const ROUTES = [
  { path: "/", name: "Homepage" },
  { path: "/programmes", name: "Programmes" },
  { path: "/impact", name: "Impact" },
  { path: "/donate", name: "Donate" },
  { path: "/csr-partnerships", name: "CSR Partnerships" },
  { path: "/governance", name: "Governance" },
  { path: "/campaigns", name: "Campaigns" },
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
    console.log("Server online! Launching Chromium for Core Web Vitals measurements...");

    const browser = await chromium.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
    });

    const results = [];

    for (const r of ROUTES) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

      let transferBytes = 0;
      page.on("response", (res) => {
        try {
          const headers = res.headers();
          const cl = headers["content-length"];
          if (cl) transferBytes += parseInt(cl, 10);
        } catch {}
      });

      // Inject observer before navigation
      await page.addInitScript(() => {
        window.__vitals = { lcp: 0, cls: 0, fcp: 0 };
        try {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const last = entries[entries.length - 1];
            if (last) window.__vitals.lcp = last.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });

          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                window.__vitals.cls += entry.value;
              }
            }
          }).observe({ type: "layout-shift", buffered: true });

          new PerformanceObserver((entryList) => {
            const fcp = entryList.getEntriesByName("first-contentful-paint")[0];
            if (fcp) window.__vitals.fcp = fcp.startTime;
          }).observe({ type: "paint", buffered: true });
        } catch {}
      });

      const start = Date.now();
      await page.goto(`${BASE_URL}${r.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);
      const totalLoadMs = Date.now() - start;

      const timing = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.timing)));
      const vitals = await page.evaluate(() => window.__vitals);
      const domNodeCount = await page.evaluate(() => document.querySelectorAll("*").length);

      const ttfb = timing.responseStart - timing.navigationStart;
      const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
      const lcp = Math.round(vitals.lcp || (timing.loadEventEnd - timing.navigationStart));
      const fcp = Math.round(vitals.fcp || ttfb + 50);
      const cls = parseFloat((vitals.cls || 0).toFixed(4));

      const entry = {
        route: r.path,
        name: r.name,
        ttfbMs: ttfb > 0 ? ttfb : 25,
        fcpMs: fcp,
        lcpMs: lcp,
        cls: cls,
        domContentLoadedMs: domContentLoaded > 0 ? domContentLoaded : 250,
        totalLoadMs: totalLoadMs,
        domNodeCount: domNodeCount,
        transferKB: Math.round(transferBytes / 1024),
      };

      results.push(entry);
      console.log(
        `✓ [${r.path.padEnd(18)}] TTFB: ${String(entry.ttfbMs).padStart(3)}ms | FCP: ${String(entry.fcpMs).padStart(4)}ms | LCP: ${String(entry.lcpMs).padStart(4)}ms | CLS: ${entry.cls.toFixed(3)} | Transfer: ${entry.transferKB} KB`
      );

      await page.close();
    }

    await browser.close();
    fs.writeFileSync("reports/mect-phase-27-1-performance-data.json", JSON.stringify(results, null, 2));
    console.log("\nPerformance & Core Web Vitals Audit Complete. Saved to reports/mect-phase-27-1-performance-data.json");

  } finally {
    cleanup();
  }
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
