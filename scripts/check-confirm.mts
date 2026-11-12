import fs from "node:fs";
import path from "node:path";

interface ConfirmMatch {
  file: string;
  line: number;
  marker: string;
}

const ROOT_DIR = process.cwd();
const SCAN_DIRS = [
  "app",
  "components",
  "content",
  "src/app",
  "src/components",
  "src/content",
];

const EXCLUDED_FILES = new Set([
  path.normalize("content/todo-confirm.md"),
  path.normalize("src/content/todo-confirm.md"),
]);

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".md",
  ".mdx",
  ".json",
  ".txt",
]);

const CONFIRM_PATTERN = /\{\{\s*CONFIRM:[^}]*\}\}/g;

function walkFiles(dirPath: string, results: string[]): void {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, results);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const relativePath = path.normalize(path.relative(ROOT_DIR, fullPath));
    if (EXCLUDED_FILES.has(relativePath)) {
      continue;
    }

    if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
}

function scanConfirmMarkers(): ConfirmMatch[] {
  const files: string[] = [];
  for (const relDir of SCAN_DIRS) {
    walkFiles(path.join(ROOT_DIR, relDir), files);
  }

  const matches: ConfirmMatch[] = [];
  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");
    const lines = raw.split(/\r?\n/);
    const relativePath = path.relative(ROOT_DIR, filePath).replaceAll("\\", "/");

    for (let idx = 0; idx < lines.length; idx += 1) {
      const lineText = lines[idx];
      CONFIRM_PATTERN.lastIndex = 0;
      let match = CONFIRM_PATTERN.exec(lineText);
      while (match !== null) {
        matches.push({
          file: relativePath,
          line: idx + 1,
          marker: match[0],
        });
        match = CONFIRM_PATTERN.exec(lineText);
      }
    }
  }

  return matches;
}

function main(): void {
  const isStrict =
    (process.env.NODE_ENV === "production" && process.env.CI === "true") ||
    process.argv.includes("--strict");

  const matches = scanConfirmMarkers();

  if (matches.length === 0) {
    console.log("[check-confirm] PASS: 0 unresolved {{CONFIRM: ...}} markers found.");
    process.exit(0);
  }

  const modeLabel = isStrict ? "FAIL (production + CI)" : "WARN (non-CI/non-production)";
  console.error(
    `[check-confirm] ${modeLabel}: ${matches.length} unresolved {{CONFIRM: ...}} marker(s) found:`
  );
  for (const item of matches) {
    console.error(`  - ${item.file}:${item.line} -> ${item.marker}`);
  }

  if (isStrict) {
    console.error(
      "[check-confirm] Aborting production CI build. Resolve every {{CONFIRM: ...}} marker using content/todo-confirm.md."
    );
    process.exit(1);
  }

  process.exit(0);
}

main();

