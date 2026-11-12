import fs from "node:fs";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";

const PRODUCTION_ORIGIN = "https://mect.org.in";
const DEFAULT_PORT = 3199;

const FORBIDDEN_PATTERNS: ReadonlyArray<{ label: string; regex: RegExp }> = [
  { label: "MAHAVIR TRUST", regex: /\bMAHAVIR TRUST\b/ },
  { label: "Mahavir Trust", regex: /\bMahavir Trust\b/ },
  { label: "671 234 5678", regex: /671\s+234\s+5678/ },
  {
    label: "Subject to Trustee Confirmation",
    regex: /Subject to Trustee Confirmation/i,
  },
  {
    label: "will be published upon statutory certificate issuance",
    regex: /will be published upon statutory certificate issuance/i,
  },
  { label: "Pending Gazette", regex: /Pending Gazette/i },
  { label: "pre-launch", regex: /\bpre-?launch\b/i },
];

type FailureCategory =
  | "NON_200_PAGE"
  | "BROKEN_INTERNAL_HREF"
  | "BROKEN_FRAGMENT"
  | "FORBIDDEN_TEXT"
  | "CANONICAL_MISMATCH"
  | "MISSING_OR_DUPLICATE_TITLE"
  | "MISSING_META_DESCRIPTION"
  | "MISSING_OG_IMAGE"
  | "IMAGE_ALT_ISSUE"
  | "TEL_WITH_SPACES"
  | "MULTIPLE_H1";

interface Finding {
  category: FailureCategory;
  page: string;
  detail: string;
}

interface FragmentRef {
  sourcePage: string;
  targetPath: string;
  fragment: string;
}

interface HtmlAttributeMap {
  [key: string]: string | true;
}

function decodeHtmlEntities(input: string): string {
  return input
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&nbsp;", " ");
}

function parseAttributes(tagContent: string): HtmlAttributeMap {
  const attrs: HtmlAttributeMap = {};
  const attrRegex =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match = attrRegex.exec(tagContent);
  while (match !== null) {
    const key = match[1].toLowerCase();
    const rawValue = match[2] ?? match[3] ?? match[4];
    attrs[key] = rawValue === undefined ? true : decodeHtmlEntities(rawValue);
    match = attrRegex.exec(tagContent);
  }
  return attrs;
}

function normalizeRoutePath(rawPathname: string): string {
  if (!rawPathname || rawPathname === "/") {
    return "/";
  }
  let cleaned = rawPathname.startsWith("/") ? rawPathname : `/${rawPathname}`;
  if (cleaned.length > 1 && cleaned.endsWith("/")) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}

function normalizeCanonicalUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const pathname = normalizeRoutePath(parsed.pathname);
    return pathname === "/" ? parsed.origin : `${parsed.origin}${pathname}`;
  } catch {
    return rawUrl.trim();
  }
}

function isAssetPath(pathname: string): boolean {
  return /\.(pdf|png|jpe?g|webp|avif|gif|svg|ico|css|js|json|xml|txt|woff2?|ttf|eot|mp4|webm)$/i.test(
    pathname
  );
}

function extractRenderedText(html: string): string {
  const withoutScriptsStyles = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  const stripped = withoutScriptsStyles.replace(/<[^>]+>/g, " ");
  return decodeHtmlEntities(stripped).replace(/\s+/g, " ").trim();
}

function extractTitle(html: string): string[] {
  const titles: string[] = [];
  const regex = /<title\b[^>]*>([\s\S]*?)<\/title>/gi;
  let match = regex.exec(html);
  while (match !== null) {
    titles.push(decodeHtmlEntities(match[1]).replace(/\s+/g, " ").trim());
    match = regex.exec(html);
  }
  return titles;
}

function extractMetaContents(html: string): {
  description: string | null;
  ogImage: string | null;
} {
  let description: string | null = null;
  let ogImage: string | null = null;
  const metaRegex = /<meta\b([^>]*?)>/gi;
  let match = metaRegex.exec(html);
  while (match !== null) {
    const attrs = parseAttributes(match[1]);
    const name = typeof attrs.name === "string" ? attrs.name.toLowerCase() : "";
    const property =
      typeof attrs.property === "string" ? attrs.property.toLowerCase() : "";
    const content = typeof attrs.content === "string" ? attrs.content.trim() : "";

    if (name === "description" && content.length > 0) {
      description = content;
    }
    if (property === "og:image" && content.length > 0) {
      ogImage = content;
    }
    match = metaRegex.exec(html);
  }
  return { description, ogImage };
}

function extractCanonical(html: string): string | null {
  const linkRegex = /<link\b([^>]*?)>/gi;
  let match = linkRegex.exec(html);
  while (match !== null) {
    const attrs = parseAttributes(match[1]);
    const rel = typeof attrs.rel === "string" ? attrs.rel.toLowerCase() : "";
    const relTokens = rel.split(/\s+/);
    if (relTokens.includes("canonical") && typeof attrs.href === "string") {
      return attrs.href.trim();
    }
    match = linkRegex.exec(html);
  }
  return null;
}

function extractElementIds(html: string): Set<string> {
  const ids = new Set<string>();
  const idRegex = /\b(?:id|name)\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
  let match = idRegex.exec(html);
  while (match !== null) {
    const rawId = match[1] ?? match[2] ?? "";
    if (rawId) {
      ids.add(decodeHtmlEntities(rawId));
    }
    match = idRegex.exec(html);
  }
  return ids;
}

function extractImages(html: string): HtmlAttributeMap[] {
  const images: HtmlAttributeMap[] = [];
  const imgRegex = /<img\b([^>]*?)>/gi;
  let match = imgRegex.exec(html);
  while (match !== null) {
    images.push(parseAttributes(match[1]));
    match = imgRegex.exec(html);
  }
  return images;
}

function extractAnchors(html: string): string[] {
  const hrefs: string[] = [];
  const anchorRegex = /<a\b([^>]*?)>/gi;
  let match = anchorRegex.exec(html);
  while (match !== null) {
    const attrs = parseAttributes(match[1]);
    if (typeof attrs.href === "string") {
      hrefs.push(attrs.href.trim());
    }
    match = anchorRegex.exec(html);
  }
  return hrefs;
}

function countH1s(html: string): number {
  const bodyMatch = /<body\b[^>]*>([\s\S]*)<\/body>/i.exec(html);
  const scope = bodyMatch ? bodyMatch[1] : html;
  const h1Matches = scope.match(/<h1\b[^>]*>/gi);
  return h1Matches ? h1Matches.length : 0;
}

async function waitForServer(baseUrl: string, timeoutMs: number): Promise<void> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/`, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) {
        return;
      }
    } catch {
      // Server still booting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting ${timeoutMs}ms for ${baseUrl} to respond.`);
}

async function killServerProcess(child: ChildProcess | null): Promise<void> {
  if (!child || child.pid === undefined) {
    return;
  }
  if (process.platform === "win32") {
    await new Promise<void>((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
      killer.on("close", () => resolve());
      killer.on("error", () => resolve());
    });
    return;
  }
  child.kill("SIGTERM");
}

async function fetchSitemapPaths(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(`${baseUrl}/sitemap.xml`);
    if (!res.ok) {
      return [];
    }
    const xml = await res.text();
    const paths: string[] = [];
    const locRegex = /<loc>([\s\S]*?)<\/loc>/gi;
    let match = locRegex.exec(xml);
    while (match !== null) {
      const rawLoc = decodeHtmlEntities(match[1].trim());
      try {
        const parsed = new URL(rawLoc);
        paths.push(normalizeRoutePath(parsed.pathname));
      } catch {
        if (rawLoc.startsWith("/")) {
          paths.push(normalizeRoutePath(rawLoc));
        }
      }
      match = locRegex.exec(xml);
    }
    return paths;
  } catch {
    return [];
  }
}

function classifyHref(
  rawHref: string,
  currentPagePath: string,
  baseUrl: string
):
  | { kind: "tel"; value: string }
  | { kind: "internal"; routePath: string; fragment: string | null }
  | { kind: "ignore" } {
  if (!rawHref || rawHref.startsWith("mailto:") || rawHref.startsWith("javascript:")) {
    return { kind: "ignore" };
  }

  if (rawHref.toLowerCase().startsWith("tel:")) {
    return { kind: "tel", value: rawHref };
  }

  if (rawHref.startsWith("#")) {
    const fragment = rawHref.slice(1).trim();
    return fragment
      ? { kind: "internal", routePath: currentPagePath, fragment }
      : { kind: "ignore" };
  }

  try {
    const baseOriginUrl = new URL(baseUrl);
    const resolved = new URL(rawHref, `${baseOriginUrl.origin}${currentPagePath}`);
    const prodOrigin = new URL(PRODUCTION_ORIGIN).origin;
    const isInternalOrigin =
      resolved.origin === baseOriginUrl.origin || resolved.origin === prodOrigin;

    if (!isInternalOrigin) {
      return { kind: "ignore" };
    }

    const fragment = resolved.hash ? decodeURIComponent(resolved.hash.slice(1)) : null;
    return {
      kind: "internal",
      routePath: normalizeRoutePath(resolved.pathname),
      fragment: fragment && fragment.length > 0 ? fragment : null,
    };
  } catch {
    return { kind: "ignore" };
  }
}

async function runAudit(baseUrl: string): Promise<{
  exitCode: number;
  reportText: string;
}> {
  const findings: Finding[] = [];
  const routeStatuses = new Map<string, number>();
  const pageIds = new Map<string, Set<string>>();
  const pageTitles = new Map<string, string[]>();
  const hrefReferences = new Map<string, Set<string>>();
  const fragmentRefs: FragmentRef[] = [];

  const queued = new Set<string>(["/"]);
  const queue: string[] = ["/"];

  const sitemapPaths = await fetchSitemapPaths(baseUrl);
  for (const sitemapPath of sitemapPaths) {
    if (!queued.has(sitemapPath)) {
      queued.add(sitemapPath);
      queue.push(sitemapPath);
    }
  }

  const visited = new Set<string>();
  let htmlPagesCrawled = 0;
  let assetLinksChecked = 0;

  while (queue.length > 0) {
    const routePath = queue.shift() as string;
    if (visited.has(routePath)) {
      continue;
    }
    visited.add(routePath);

    const targetUrl = `${baseUrl}${routePath === "/" ? "" : routePath}`;
    let res: Response;
    try {
      res = await fetch(targetUrl, { redirect: "follow" });
    } catch (error) {
      findings.push({
        category: "NON_200_PAGE",
        page: routePath,
        detail: `Fetch failed: ${error instanceof Error ? error.message : String(error)}`,
      });
      continue;
    }

    routeStatuses.set(routePath, res.status);
    const contentType = (res.headers.get("content-type") ?? "").toLowerCase();

    if (isAssetPath(routePath)) {
      assetLinksChecked += 1;
      if (res.status !== 200) {
        findings.push({
          category: "BROKEN_INTERNAL_HREF",
          page: routePath,
          detail: `Internal asset returned HTTP ${res.status}`,
        });
      }
      continue;
    }

    if (res.status !== 200) {
      findings.push({
        category: "NON_200_PAGE",
        page: routePath,
        detail: `HTTP status ${res.status}`,
      });
      continue;
    }

    if (!contentType.includes("text/html")) {
      continue;
    }

    htmlPagesCrawled += 1;
    const html = await res.text();

    // 1. Element IDs (for fragment verification)
    pageIds.set(routePath, extractElementIds(html));

    // 2. Titles
    const titles = extractTitle(html);
    if (titles.length === 0 || !titles[0]) {
      findings.push({
        category: "MISSING_OR_DUPLICATE_TITLE",
        page: routePath,
        detail: "Missing or empty <title> element",
      });
    } else {
      if (titles.length > 1) {
        findings.push({
          category: "MISSING_OR_DUPLICATE_TITLE",
          page: routePath,
          detail: `Multiple <title> elements on page (${titles.length})`,
        });
      }
      const existingPages = pageTitles.get(titles[0]) ?? [];
      existingPages.push(routePath);
      pageTitles.set(titles[0], existingPages);
    }

    // 3. Meta description and og:image
    const { description, ogImage } = extractMetaContents(html);
    if (!description) {
      findings.push({
        category: "MISSING_META_DESCRIPTION",
        page: routePath,
        detail: "Missing or empty <meta name=\"description\">",
      });
    }
    if (!ogImage) {
      findings.push({
        category: "MISSING_OG_IMAGE",
        page: routePath,
        detail: "Missing or empty <meta property=\"og:image\">",
      });
    }

    // 4. Canonical URL
    const canonical = extractCanonical(html);
    const expectedCanonical =
      routePath === "/" ? PRODUCTION_ORIGIN : `${PRODUCTION_ORIGIN}${routePath}`;
    if (!canonical) {
      findings.push({
        category: "CANONICAL_MISMATCH",
        page: routePath,
        detail: `Missing <link rel="canonical"> (expected ${expectedCanonical})`,
      });
    } else if (normalizeCanonicalUrl(canonical) !== expectedCanonical) {
      findings.push({
        category: "CANONICAL_MISMATCH",
        page: routePath,
        detail: `Canonical "${canonical}" != expected "${expectedCanonical}"`,
      });
    }

    // 5. H1 count
    const h1Count = countH1s(html);
    if (h1Count > 1) {
      findings.push({
        category: "MULTIPLE_H1",
        page: routePath,
        detail: `Found ${h1Count} <h1> elements (maximum 1 allowed)`,
      });
    }

    // 6. Image alt attributes
    const images = extractImages(html);
    for (const img of images) {
      const srcLabel = typeof img.src === "string" ? img.src : "(no src)";
      if (!("alt" in img)) {
        findings.push({
          category: "IMAGE_ALT_ISSUE",
          page: routePath,
          detail: `<img> missing alt attribute (src=${srcLabel})`,
        });
        continue;
      }

      const altText = typeof img.alt === "string" ? img.alt.trim() : "";
      const isDecorative =
        img["aria-hidden"] === "true" ||
        img.role === "presentation" ||
        img.role === "none" ||
        img["data-decorative"] === "true";

      if (altText.length === 0 && !isDecorative) {
        findings.push({
          category: "IMAGE_ALT_ISSUE",
          page: routePath,
          detail: `<img> has empty alt="" without decorative flag (src=${srcLabel})`,
        });
      }
    }

    // 7. Rendered text + title/meta forbidden text check
    const renderedText = `${titles.join(" ")} ${description ?? ""} ${extractRenderedText(html)}`;
    for (const rule of FORBIDDEN_PATTERNS) {
      const matched = rule.regex.exec(renderedText);
      if (matched) {
        const start = Math.max(0, matched.index - 35);
        const end = Math.min(renderedText.length, matched.index + matched[0].length + 35);
        const snippet = renderedText.slice(start, end);
        findings.push({
          category: "FORBIDDEN_TEXT",
          page: routePath,
          detail: `Forbidden text "${rule.label}" matched: "...${snippet}..."`,
        });
      }
    }

    // 8. Anchors (tel:, internal hrefs, fragments)
    const anchors = extractAnchors(html);
    for (const href of anchors) {
      const classified = classifyHref(href, routePath, baseUrl);
      if (classified.kind === "tel") {
        if (/\s/.test(classified.value)) {
          findings.push({
            category: "TEL_WITH_SPACES",
            page: routePath,
            detail: `tel: link contains whitespace: "${classified.value}"`,
          });
        }
        continue;
      }

      if (classified.kind === "internal") {
        const sources = hrefReferences.get(classified.routePath) ?? new Set<string>();
        sources.add(routePath);
        hrefReferences.set(classified.routePath, sources);

        if (!queued.has(classified.routePath)) {
          queued.add(classified.routePath);
          queue.push(classified.routePath);
        }

        if (classified.fragment) {
          fragmentRefs.push({
            sourcePage: routePath,
            targetPath: classified.routePath,
            fragment: classified.fragment,
          });
        }
      }
    }
  }

  // Cross-page duplicate titles check
  for (const [title, pages] of pageTitles.entries()) {
    if (pages.length > 1) {
      for (const page of pages) {
        findings.push({
          category: "MISSING_OR_DUPLICATE_TITLE",
          page,
          detail: `Duplicate <title> "${title}" shared across: ${pages.join(", ")}`,
        });
      }
    }
  }

  // Check if any discovered internal href returned non-200
  for (const [targetPath, sourcePages] of hrefReferences.entries()) {
    const status = routeStatuses.get(targetPath);
    if (status !== undefined && status !== 200) {
      findings.push({
        category: "BROKEN_INTERNAL_HREF",
        page: Array.from(sourcePages).join(", "),
        detail: `Internal href "${targetPath}" returned HTTP ${status}`,
      });
    }
  }

  // Fragment target ID check
  const seenFragmentIssues = new Set<string>();
  for (const ref of fragmentRefs) {
    const ids = pageIds.get(ref.targetPath);
    if (!ids) {
      continue; // Already reported as non-200/broken href
    }
    if (!ids.has(ref.fragment)) {
      const key = `${ref.sourcePage}->${ref.targetPath}#${ref.fragment}`;
      if (!seenFragmentIssues.has(key)) {
        seenFragmentIssues.add(key);
        findings.push({
          category: "BROKEN_FRAGMENT",
          page: ref.sourcePage,
          detail: `Missing target id="#${ref.fragment}" on ${ref.targetPath}`,
        });
      }
    }
  }

  // Summaries
  const categoryOrder: FailureCategory[] = [
    "NON_200_PAGE",
    "BROKEN_INTERNAL_HREF",
    "BROKEN_FRAGMENT",
    "FORBIDDEN_TEXT",
    "CANONICAL_MISMATCH",
    "MISSING_OR_DUPLICATE_TITLE",
    "MISSING_META_DESCRIPTION",
    "MISSING_OG_IMAGE",
    "IMAGE_ALT_ISSUE",
    "TEL_WITH_SPACES",
    "MULTIPLE_H1",
  ];

  const counts = new Map<FailureCategory, number>();
  for (const category of categoryOrder) {
    counts.set(category, 0);
  }
  for (const finding of findings) {
    counts.set(finding.category, (counts.get(finding.category) ?? 0) + 1);
  }

  const lines: string[] = [];
  lines.push("================================================================");
  lines.push("MECT SITE CRAWLER AUDIT REPORT");
  lines.push(`Timestamp: ${new Date().toISOString()}`);
  lines.push(`Base URL: ${baseUrl}`);
  lines.push(`Sitemap routes discovered: ${sitemapPaths.length}`);
  lines.push(`HTML pages crawled: ${htmlPagesCrawled}`);
  lines.push(`Asset hrefs checked: ${assetLinksChecked}`);
  lines.push(`Fragment links checked: ${fragmentRefs.length}`);
  lines.push("----------------------------------------------------------------");
  lines.push("CHECK SUMMARY (PASS / FAIL COUNTS)");
  lines.push("Check Category               | Status | Failures");
  lines.push("-----------------------------+--------+---------");

  for (const category of categoryOrder) {
    const count = counts.get(category) ?? 0;
    const status = count === 0 ? "PASS  " : "FAIL  ";
    lines.push(`${category.padEnd(28)} | ${status} | ${String(count).padStart(8)}`);
  }

  lines.push("----------------------------------------------------------------");
  lines.push(`TOTAL FAILURES: ${findings.length}`);
  lines.push("================================================================");

  if (findings.length > 0) {
    lines.push("");
    lines.push("DETAILED FINDINGS:");
    for (const [idx, finding] of findings.entries()) {
      lines.push(
        `${idx + 1}. [${finding.category}] (${finding.page}) ${finding.detail}`
      );
    }
  }

  return {
    exitCode: findings.length === 0 ? 0 : 1,
    reportText: lines.join("\n"),
  };
}

function getArgValue(prefix: string): string | null {
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) {
      return arg.slice(prefix.length);
    }
  }
  return null;
}

async function runCommandCapture(cmd: string, args: string[]): Promise<number> {
  return await new Promise<number>((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("close", (code) => resolve(code ?? 1));
    child.on("error", reject);
  });
}

async function main(): Promise<void> {
  const externalBaseUrl = getArgValue("--base-url=");
  const outputFile = getArgValue("--out=");
  const port = Number(getArgValue("--port=") ?? DEFAULT_PORT);
  const baseUrl = externalBaseUrl ?? `http://127.0.0.1:${port}`;

  let serverChild: ChildProcess | null = null;

  try {
    if (!externalBaseUrl) {
      const buildIdPath = path.join(process.cwd(), ".next", "BUILD_ID");
      if (!fs.existsSync(buildIdPath)) {
        console.log("[audit-site] .next/BUILD_ID not found; running npm run build...");
        const buildExit = await runCommandCapture("npm", ["run", "build"]);
        if (buildExit !== 0) {
          throw new Error(`npm run build failed with exit code ${buildExit}`);
        }
      }

      const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
      serverChild = spawn(process.execPath, [nextBin, "start", "-p", String(port), "-H", "127.0.0.1"], {
        stdio: "ignore",
        env: { ...process.env, NODE_ENV: "production" },
      });

      await waitForServer(baseUrl, 30000);
    }

    const { exitCode, reportText } = await runAudit(baseUrl);
    console.log(reportText);

    if (outputFile) {
      const resolvedOut = path.resolve(process.cwd(), outputFile);
      fs.mkdirSync(path.dirname(resolvedOut), { recursive: true });
      fs.writeFileSync(resolvedOut, `${reportText}\n`, "utf8");
      console.log(`[audit-site] Saved report to ${outputFile}`);
    }

    process.exitCode = exitCode;
  } finally {
    await killServerProcess(serverChild);
  }
}

void main();

