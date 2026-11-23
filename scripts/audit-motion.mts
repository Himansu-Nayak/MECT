import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { spawn, type ChildProcess } from "node:child_process";
import { chromium, type Browser } from "playwright";

const DEFAULT_PORT = 3201;
const MAX_ADDED_GZIP_BYTES = 60 * 1024; // 60 KB gzipped budget on "/"
const BASELINE_BUNDLE_PATH = path.join(
  process.cwd(),
  "reports",
  "motion-baseline-bundle.txt"
);
const BASELINE_REPORT_PATH = path.join(
  process.cwd(),
  "reports",
  "motion-baseline.txt"
);
const DEFAULT_LATEST_PATH = path.join(
  process.cwd(),
  "reports",
  "motion-latest.txt"
);

type CheckName =
  | "REDUCED_MOTION"
  | "NO_JS_CONTENT"
  | "FORBIDDEN_PROPS"
  | "SINGLE_OWNER"
  | "BUNDLE_BUDGET";

interface CheckFinding {
  check: CheckName;
  target: string;
  detail: string;
  expectedFailUntil?: string;
}

function getArgValue(prefix: string): string | null {
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) {
      return arg.slice(prefix.length);
    }
  }
  return null;
}

function hasFlag(flag: string): boolean {
  return process.argv.slice(2).includes(flag);
}

function resolveBrowserExecutable(): string | undefined {
  const defaultPath = chromium.executablePath();
  if (defaultPath && fs.existsSync(defaultPath)) {
    return defaultPath;
  }
  const windowsChrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  if (fs.existsSync(windowsChrome)) {
    return windowsChrome;
  }
  return undefined;
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.status > 0) {
        return;
      }
    } catch {
      // Server still booting
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Timed out waiting for server at ${url}`);
}

async function killServerProcess(child: ChildProcess | null): Promise<void> {
  if (!child || child.killed) {
    return;
  }
  if (process.platform === "win32" && child.pid) {
    await new Promise<void>((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], {
        stdio: "ignore",
      });
      killer.on("close", () => resolve());
      killer.on("error", () => resolve());
    });
    return;
  }
  child.kill("SIGTERM");
}

function walkSourceFiles(dir: string, out: string[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSourceFiles(full, out);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
}

function checkForbiddenProps(srcRoot: string): CheckFinding[] {
  const files: string[] = [];
  walkSourceFiles(srcRoot, files);
  const findings: CheckFinding[] = [];
  const forbiddenPropRegex =
    /(?:animate\s*=\s*\{\{[^}]*|\banimate\s*\([^)]*\{[^}]*)\b(?:width|height|top|left)\s*:/g;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    forbiddenPropRegex.lastIndex = 0;
    const match = forbiddenPropRegex.exec(content);
    if (match) {
      const rel = path.relative(process.cwd(), file).replaceAll("\\", "/");
      findings.push({
        check: "FORBIDDEN_PROPS",
        target: rel,
        detail: `Disallowed layout property animated in Motion/Anime call (${match[0].slice(0, 60).replace(/\s+/g, " ")}...)`,
      });
    }
  }
  return findings;
}

function checkSingleOwner(srcRoot: string): CheckFinding[] {
  const files: string[] = [];
  walkSourceFiles(srcRoot, files);
  const findings: CheckFinding[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const importsMotion =
      /from\s+["'](?:motion\/react|framer-motion)["']/.test(content);
    const importsAnime = /from\s+["']animejs["']/.test(content);
    if (importsMotion && importsAnime && !content.includes("// motion: split")) {
      const rel = path.relative(process.cwd(), file).replaceAll("\\", "/");
      findings.push({
        check: "SINGLE_OWNER",
        target: rel,
        detail:
          'Imports both motion/react and animejs without an explicit "// motion: split" comment',
      });
    }
  }
  return findings;
}

async function discoverRoutes(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${baseUrl}/sitemap.xml`);
    if (!res.ok) return ["/"];
    const xml = await res.text();
    const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => {
      try {
        return new URL(m[1]).pathname || "/";
      } catch {
        return "/";
      }
    });
    const unique = Array.from(new Set(["/", ...locs]));
    return unique;
  } catch {
    return ["/"];
  }
}

async function measureHomeFirstLoadJs(baseUrl: string): Promise<{
  chunkCount: number;
  rawBytes: number;
  gzipBytes: number;
  chunks: Array<{ url: string; gzipBytes: number }>;
}> {
  const res = await fetch(`${baseUrl}/`);
  const html = await res.text();
  const scriptMatches = Array.from(
    html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)
  ).map((m) => m[1]);
  const uniqueScripts = Array.from(new Set(scriptMatches));

  let rawBytes = 0;
  let gzipBytes = 0;
  const chunks: Array<{ url: string; gzipBytes: number }> = [];

  for (const relUrl of uniqueScripts) {
    const diskPath = path.join(
      process.cwd(),
      ".next",
      relUrl.replace(/^\/_next\//, "").replaceAll("/", path.sep)
    );
    if (fs.existsSync(diskPath)) {
      const buf = fs.readFileSync(diskPath);
      const gz = zlib.gzipSync(buf).length;
      rawBytes += buf.length;
      gzipBytes += gz;
      chunks.push({ url: relUrl, gzipBytes: gz });
    }
  }

  return {
    chunkCount: chunks.length,
    rawBytes,
    gzipBytes,
    chunks,
  };
}

async function runPlaywrightChecks(
  browser: Browser,
  baseUrl: string,
  routes: string[],
  shotsPrefix: string | null
): Promise<CheckFinding[]> {
  const findings: CheckFinding[] = [];

  // 1. Reduced-motion check across all discovered routes
  const reducedCtx = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 900 },
  });
  const reducedPage = await reducedCtx.newPage();

  for (const route of routes) {
    await reducedPage.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await reducedPage.waitForTimeout(1000);

    const rmResult = await reducedPage.evaluate(() => {
      const anims = document.getAnimations();
      const longTransitions: string[] = [];
      const elements = Array.from(document.querySelectorAll("*"));
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const style = window.getComputedStyle(el);
        const durations = style.transitionDuration
          .split(",")
          .map((d) => {
            const trimmed = d.trim();
            if (trimmed.endsWith("ms")) return parseFloat(trimmed) / 1000;
            if (trimmed.endsWith("s")) return parseFloat(trimmed);
            return 0;
          })
          .filter((n) => !Number.isNaN(n));
        const maxDur = Math.max(0, ...durations);
        if (maxDur > 0.01 && style.transitionProperty !== "none") {
          longTransitions.push(
            `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} (${maxDur}s)`
          );
          if (longTransitions.length >= 5) break;
        }
      }
      return {
        animationCount: anims.length,
        animationNames: anims.slice(0, 5).map((a) => {
          const maybeCss = a as Animation & { animationName?: string };
          return maybeCss.animationName || a.id || "unnamed";
        }),
        longTransitions,
      };
    });

    if (rmResult.animationCount > 0) {
      const hasMarquee = rmResult.animationNames.some((n) =>
        /marquee/i.test(n)
      );
      findings.push({
        check: "REDUCED_MOTION",
        target: route,
        detail: `${rmResult.animationCount} active Web Animation(s) under prefers-reduced-motion: reduce (${rmResult.animationNames.join(", ")})`,
        ...(hasMarquee ? { expectedFailUntil: "M2.7" } : {}),
      });
    }
    if (rmResult.longTransitions.length > 0) {
      findings.push({
        check: "REDUCED_MOTION",
        target: route,
        detail: `Visible element(s) with CSS transition > 0.01s under reduced motion: ${rmResult.longTransitions.join("; ")}`,
        expectedFailUntil: "M1.1, M2.1",
      });
    }
  }
  await reducedCtx.close();

  // 2. No-JS content visibility check on "/" and "/donate"
  const noJsCtx = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const noJsPage = await noJsCtx.newPage();

  await noJsPage.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  const homeChecks = await noJsPage.evaluate(() => {
    const h1 = document.querySelector("h1");
    const h1Visible =
      !!h1 &&
      window.getComputedStyle(h1).opacity !== "0" &&
      window.getComputedStyle(h1).visibility !== "hidden" &&
      h1.getBoundingClientRect().height > 0;
    const bodyText = document.body.innerText || "";
    const requiredPillars = [
      "Education",
      "Women",
      "Water",
      "Food Security",
      "Community Welfare",
    ];
    const missingPillars = requiredPillars.filter(
      (p) => !bodyText.toLowerCase().includes(p.toLowerCase())
    );
    const footer = document.querySelector("footer");
    const footerVisible =
      !!footer &&
      (footer.innerText || "").includes("Mahaveer Educational & Charitable Trust") &&
      window.getComputedStyle(footer).opacity !== "0";
    return { h1Visible, missingPillars, footerVisible };
  });

  if (!homeChecks.h1Visible) {
    findings.push({
      check: "NO_JS_CONTENT",
      target: "/",
      detail: "Main <h1> heading is missing or hidden with JavaScript disabled",
    });
  }
  if (homeChecks.missingPillars.length > 0) {
    findings.push({
      check: "NO_JS_CONTENT",
      target: "/",
      detail: `Missing pillar text with JavaScript disabled: ${homeChecks.missingPillars.join(", ")}`,
    });
  }
  if (!homeChecks.footerVisible) {
    findings.push({
      check: "NO_JS_CONTENT",
      target: "/",
      detail: "Footer institutional text missing or hidden with JavaScript disabled",
    });
  }

  await noJsPage.goto(`${baseUrl}/donate`, { waitUntil: "domcontentloaded" });
  const donateChecks = await noJsPage.evaluate(() => {
    const text = document.body.innerText || "";
    const missing: string[] = [];
    if (!text.includes("33341302498")) missing.push("Account 33341302498");
    if (!text.includes("SBIN0001701")) missing.push("IFSC SBIN0001701");
    if (!text.includes("86971610172@sbi")) missing.push("UPI 86971610172@sbi");
    return missing;
  });
  if (donateChecks.length > 0) {
    findings.push({
      check: "NO_JS_CONTENT",
      target: "/donate",
      detail: `Bank details missing with JavaScript disabled: ${donateChecks.join(", ")}`,
    });
  }
  await noJsCtx.close();

  // 3. Optional Desktop & Mobile screenshots
  if (shotsPrefix) {
    const resolvedPrefix = path.resolve(process.cwd(), shotsPrefix);
    fs.mkdirSync(path.dirname(resolvedPrefix), { recursive: true });

    const desktopCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const desktopPage = await desktopCtx.newPage();
    await desktopPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(800);
    await desktopPage.screenshot({
      path: `${resolvedPrefix}-home-desktop.png`,
      fullPage: false,
    });
    await desktopCtx.close();

    const mobileCtx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
    });
    const mobilePage = await mobileCtx.newPage();
    await mobilePage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(800);
    await mobilePage.screenshot({
      path: `${resolvedPrefix}-home-mobile.png`,
      fullPage: false,
    });
    await mobileCtx.close();
  }

  return findings;
}

async function main(): Promise<void> {
  const port = Number(getArgValue("--port=") ?? DEFAULT_PORT);
  const baseUrl = `http://127.0.0.1:${port}`;
  const explicitOutPath = getArgValue("--out=");
  const shotsPrefix = getArgValue("--shots=");
  const saveBaseline = hasFlag("--save-baseline");
  const force = hasFlag("--force");
  const baselineMode = hasFlag("--baseline-mode");

  const srcRoot = path.join(process.cwd(), "src");
  const allFindings: CheckFinding[] = [];

  allFindings.push(...checkForbiddenProps(srcRoot));
  allFindings.push(...checkSingleOwner(srcRoot));

  let serverChild: ChildProcess | null = null;
  let browser: Browser | null = null;
  let bundleSummary = "";

  try {
    const buildIdPath = path.join(process.cwd(), ".next", "BUILD_ID");
    if (!fs.existsSync(buildIdPath)) {
      throw new Error(".next/BUILD_ID not found. Run `npm run build` before `npm run audit:motion`.");
    }

    const nextBin = path.join(
      process.cwd(),
      "node_modules",
      "next",
      "dist",
      "bin",
      "next"
    );
    serverChild = spawn(
      process.execPath,
      [nextBin, "start", "-p", String(port), "-H", "127.0.0.1"],
      {
        stdio: "ignore",
        env: { ...process.env, NODE_ENV: "production" },
      }
    );
    await waitForServer(baseUrl, 30000);

    const routes = await discoverRoutes(baseUrl);
    const bundle = await measureHomeFirstLoadJs(baseUrl);

    if (saveBaseline) {
      if (
        (fs.existsSync(BASELINE_BUNDLE_PATH) ||
          fs.existsSync(BASELINE_REPORT_PATH)) &&
        !force
      ) {
        console.log(
          "[audit-motion] Baseline files already exist and are immutable (pass --force to overwrite). Keeping existing baseline."
        );
      } else {
        fs.mkdirSync(path.dirname(BASELINE_BUNDLE_PATH), { recursive: true });
        const bundleLines = [
          `# Baseline First-Load JS on "/" (${new Date().toISOString()})`,
          `chunks=${bundle.chunkCount}`,
          `raw_bytes=${bundle.rawBytes}`,
          `gzip_bytes=${bundle.gzipBytes}`,
          `gzip_kb=${(bundle.gzipBytes / 1024).toFixed(2)}`,
          "",
          ...bundle.chunks.map(
            (c) => `${(c.gzipBytes / 1024).toFixed(2)} KB  ${c.url}`
          ),
        ];
        fs.writeFileSync(
          BASELINE_BUNDLE_PATH,
          `${bundleLines.join("\n")}\n`,
          "utf8"
        );
      }
      bundleSummary = `${(bundle.gzipBytes / 1024).toFixed(2)} KB gzipped (baseline)`;
    } else if (fs.existsSync(BASELINE_BUNDLE_PATH)) {
      const baselineText = fs.readFileSync(BASELINE_BUNDLE_PATH, "utf8");
      const match = baselineText.match(/gzip_bytes=(\d+)/);
      const baselineBytes = match ? Number(match[1]) : bundle.gzipBytes;
      const deltaBytes = bundle.gzipBytes - baselineBytes;
      bundleSummary = `${(bundle.gzipBytes / 1024).toFixed(2)} KB gzipped (baseline ${(baselineBytes / 1024).toFixed(2)} KB, delta ${(deltaBytes / 1024).toFixed(2)} KB)`;
      if (deltaBytes > MAX_ADDED_GZIP_BYTES) {
        allFindings.push({
          check: "BUNDLE_BUDGET",
          target: "/",
          detail: `First-load JS grew by ${(deltaBytes / 1024).toFixed(2)} KB gzipped (budget: +60.00 KB)`,
        });
      }
    } else {
      bundleSummary = `${(bundle.gzipBytes / 1024).toFixed(2)} KB gzipped (no baseline file found)`;
    }

    const executablePath = resolveBrowserExecutable();
    browser = await chromium.launch({
      headless: true,
      ...(executablePath ? { executablePath } : {}),
    });

    const pwFindings = await runPlaywrightChecks(
      browser,
      baseUrl,
      routes,
      shotsPrefix
    );
    allFindings.push(...pwFindings);

    const checkOrder: CheckName[] = [
      "REDUCED_MOTION",
      "NO_JS_CONTENT",
      "FORBIDDEN_PROPS",
      "SINGLE_OWNER",
      "BUNDLE_BUDGET",
    ];

    const counts = new Map<CheckName, number>();
    for (const c of checkOrder) counts.set(c, 0);
    for (const f of allFindings) counts.set(f.check, (counts.get(f.check) ?? 0) + 1);

    const lines: string[] = [];
    lines.push("================================================================");
    lines.push("MECT MOTION & ACCESSIBILITY AUDIT REPORT");
    lines.push(`Timestamp: ${new Date().toISOString()}`);
    lines.push(`Routes checked: ${routes.length}`);
    lines.push(`Home ("/") First-Load JS: ${bundleSummary}`);
    lines.push("----------------------------------------------------------------");
    lines.push("Check Category               | Status | Failures");
    lines.push("-----------------------------+--------+---------");
    for (const check of checkOrder) {
      const count = counts.get(check) ?? 0;
      const status = count === 0 ? "PASS  " : "FAIL  ";
      lines.push(`${check.padEnd(28)} | ${status} | ${String(count).padStart(8)}`);
    }
    lines.push("----------------------------------------------------------------");
    lines.push(`TOTAL FAILURES: ${allFindings.length}`);
    lines.push("================================================================");

    const unexpectedFindings = allFindings.filter(
      (f) => !f.expectedFailUntil
    );

    if (allFindings.length > 0) {
      lines.push("");
      lines.push("DETAILED FINDINGS:");
      for (const [idx, f] of allFindings.entries()) {
        const tag = f.expectedFailUntil
          ? ` [EXPECTED_FAIL_UNTIL: ${f.expectedFailUntil}]`
          : "";
        lines.push(`${idx + 1}. [${f.check}]${tag} (${f.target}) ${f.detail}`);
      }
    }

    const reportText = lines.join("\n");
    console.log(reportText);

    const targetOut = saveBaseline
      ? BASELINE_REPORT_PATH
      : explicitOutPath
        ? path.resolve(process.cwd(), explicitOutPath)
        : DEFAULT_LATEST_PATH;

    const isImmutableBaseline =
      path.resolve(targetOut) === path.resolve(BASELINE_REPORT_PATH) ||
      path.resolve(targetOut) === path.resolve(BASELINE_BUNDLE_PATH);

    if (isImmutableBaseline && fs.existsSync(targetOut) && !force) {
      console.log(
        `[audit-motion] Preserving immutable baseline at ${path.relative(process.cwd(), targetOut)} (pass --force to overwrite).`
      );
    } else {
      fs.mkdirSync(path.dirname(targetOut), { recursive: true });
      fs.writeFileSync(targetOut, `${reportText}\n`, "utf8");
      console.log(
        `[audit-motion] Saved report to ${path.relative(process.cwd(), targetOut)}`
      );
    }

    process.exitCode = baselineMode
      ? unexpectedFindings.length === 0
        ? 0
        : 1
      : allFindings.length === 0
        ? 0
        : 1;
  } finally {
    if (browser) await browser.close();
    await killServerProcess(serverChild);
  }
}

void main();

