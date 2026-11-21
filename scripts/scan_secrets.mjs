import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// 1. Secret patterns as requested in Loop 9 Item 5
const PATTERNS = [
  { id: "gsk", name: "Groq API Key (gsk_...)", regex: /gsk_[a-zA-Z0-9_-]{20,}/g },
  { id: "sk", name: "Secret Key (sk-... / sk_live_...)", regex: /(?:sk-[a-zA-Z0-9_-]{20,}|sk_live_[a-zA-Z0-9_-]{20,})/g },
  { id: "akia", name: "AWS Access Key ID (AKIA...)", regex: /(?:AKIA|ASIA|AIDA|AROA)[A-Z0-9]{16}/g },
  { id: "ghp", name: "GitHub Personal Access Token (ghp_...)", regex: /ghp_[a-zA-Z0-9]{36}/g },
  { id: "xox", name: "Slack Token (xox...)", regex: /xox[baprs]-[0-9a-zA-Z]{10,}/g },
  { id: "begin", name: "Private Key Header (-----BEGIN...)", regex: /-----BEGIN[ A-Z0-9_-]*PRIVATE KEY-----/gi },
  { id: "password", name: "Hardcoded Password Assignment", regex: /(?:password|smtp_pass|db_password)\s*[:=]\s*["'](?![$_a-zA-Z0-9]*\{)(?!(?:your_|changeme|example|password|test|root|secret|admin|postgres|mect_user))([^"'\s]{8,})["']/gi },
  { id: "jwt", name: "JWT Secret Assignment", regex: /(?:JWT_SECRET|jwt_key)\s*[:=]\s*["'](?![$_a-zA-Z0-9]*\{)(?!(?:your_|changeme|example|secret))([^"'\s]{16,})["']/gi },
  { id: "secret", name: "API Client Secret Assignment", regex: /(?:api_secret|client_secret|app_secret)\s*[:=]\s*["'](?![$_a-zA-Z0-9]*\{)(?!(?:your_|changeme|example|secret))([^"'\s]{12,})["']/gi },
  { id: "smtp", name: "SMTP Credential Assignment", regex: /(?:smtp_password|smtp_pass)\s*[:=]\s*["'](?![$_a-zA-Z0-9]*\{)(?!(?:your_|changeme|example|password))([^"'\s]{6,})["']/gi },
];

/**
 * Masks any detected secret value so at most the first 4 characters are shown.
 * e.g., "gsk_1234567890..." -> "gsk_...[REDACTED 48 chars]"
 */
export function maskSecret(val) {
  if (!val || val.length <= 4) return "****";
  const prefix = val.slice(0, 4);
  const remaining = val.length - 4;
  return `${prefix}...[REDACTED ${remaining} chars]`;
}

export function scanGitHistory() {
  console.log("========================================================");
  console.log("=== 1. SCANNING GIT COMMIT HISTORY ===");
  console.log("========================================================");

  let commits = [];
  try {
    const raw = execSync("git rev-list origin/main..HEAD", { encoding: "utf8" }).trim();
    commits = raw.split("\n").filter(Boolean);
  } catch {
    const raw = execSync("git rev-list HEAD -n 250", { encoding: "utf8" }).trim();
    commits = raw.split("\n").filter(Boolean);
  }

  console.log(`Auditing ${commits.length} commits on release branch history...`);

  const commitReport = new Map();

  for (const commit of commits) {
    let commitInfo = "";
    try {
      commitInfo = execSync(`git log -1 --format="%h|%ad|%s" --date=short ${commit}`, { encoding: "utf8" }).trim();
    } catch {
      continue;
    }
    const [shortHash, date, subject] = commitInfo.split("|");

    try {
      const diff = execSync(`git show ${commit} --unified=0`, {
        encoding: "utf8",
        maxBuffer: 15 * 1024 * 1024,
      });

      const lines = diff.split("\n");
      let currentFile = "";

      for (const line of lines) {
        if (line.startsWith("diff --git a/")) {
          const match = line.match(/diff --git a\/.* b\/(.*)$/);
          currentFile = match ? match[1] : "";
        }

        if (
          currentFile.includes(".env.example") ||
          currentFile.includes(".example") ||
          currentFile.includes("scan_secrets") ||
          currentFile.endsWith(".png") ||
          currentFile.endsWith(".jpg") ||
          currentFile.endsWith(".ico") ||
          currentFile.endsWith(".pdf")
        ) {
          continue;
        }

        if (line.startsWith("+") && !line.startsWith("+++")) {
          const addedContent = line.substring(1);

          for (const pat of PATTERNS) {
            pat.regex.lastIndex = 0;
            let match;
            while ((match = pat.regex.exec(addedContent)) !== null) {
              const fullMatch = match[0];
              const masked = maskSecret(fullMatch);

              if (!commitReport.has(shortHash)) {
                commitReport.set(shortHash, {
                  hash: shortHash,
                  date,
                  subject: (subject || "").slice(0, 50),
                  findings: [],
                });
              }

              commitReport.get(shortHash).findings.push({
                file: currentFile,
                pattern: pat.name,
                maskedSecret: masked,
              });
            }
          }
        }
      }
    } catch {
      // Diff size or binary skip
    }
  }

  return Array.from(commitReport.values());
}

export function isGitTracked(relPath) {
  try {
    execSync(`git ls-files --error-unmatch "${relPath}"`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function scanWorkingTree() {
  console.log("\n========================================================");
  console.log("=== 2. SCANNING WORKING TREE FILES ===");
  console.log("========================================================");

  const findings = [];
  const ignoreDirs = new Set(["node_modules", ".git", ".next", "dist", "build", "target", ".turbo"]);

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (!ignoreDirs.has(ent.name)) {
          walk(path.join(dir, ent.name));
        }
      } else if (ent.isFile()) {
        const rel = path.relative(process.cwd(), full).replace(/\\/g, "/");

        if (
          rel.includes(".env.example") ||
          rel.includes(".example") ||
          rel.includes("scan_secrets") ||
          rel.endsWith(".png") ||
          rel.endsWith(".jpg") ||
          rel.endsWith(".jpeg") ||
          rel.endsWith(".ico") ||
          rel.endsWith(".pdf") ||
          rel.endsWith(".jar") ||
          rel.endsWith(".class")
        ) {
          continue;
        }

        const tracked = isGitTracked(rel);

        try {
          const content = fs.readFileSync(full, "utf8");

          if (path.basename(full).startsWith(".env")) {
            const lines = content.split("\n");
            for (const l of lines) {
              const trimmed = l.trim();
              if (trimmed && !trimmed.startsWith("#")) {
                const parts = trimmed.split("=");
                if (parts.length >= 2) {
                  const val = parts.slice(1).join("=").replace(/^["']|["']$/g, "").trim();
                  if (/^[A-Za-z0-9+/]{40,}={0,2}$/.test(val)) {
                    findings.push({
                      file: rel,
                      tracked,
                      pattern: "Base64 blob > 40 chars in .env",
                      maskedSecret: maskSecret(val),
                    });
                  }
                }
              }
            }
          }

          for (const pat of PATTERNS) {
            pat.regex.lastIndex = 0;
            let match;
            while ((match = pat.regex.exec(content)) !== null) {
              const fullMatch = match[0];
              findings.push({
                file: rel,
                tracked,
                pattern: pat.name,
                maskedSecret: maskSecret(fullMatch),
              });
            }
          }
        } catch {
          // Binary or read permission
        }
      }
    }
  }

  walk(process.cwd());
  return findings;
}

export function main() {
  const commitFindings = scanGitHistory();
  const treeFindings = scanWorkingTree();

  console.log("\n========================================================");
  console.log("=== SECRET SCAN SUMMARY: COMMIT HISTORY ===");
  console.log("========================================================");

  if (commitFindings.length === 0) {
    console.log("✓ Zero secrets detected across inspected branch commit history.");
  } else {
    console.table(commitFindings.map(c => ({
      Commit: c.hash,
      Date: c.date,
      Subject: c.subject,
      "Secret Count": c.findings.length,
      Patterns: Array.from(new Set(c.findings.map(f => f.pattern))).join(", "),
      "Sample Masked": c.findings[0]?.maskedSecret,
    })));
  }

  const trackedFindings = treeFindings.filter(t => t.tracked);
  const ignoredFindings = treeFindings.filter(t => !t.tracked);

  console.log("\n========================================================");
  console.log("=== SECRET SCAN SUMMARY: TRACKED WORKING TREE ===");
  console.log("========================================================");

  if (trackedFindings.length === 0) {
    console.log("✓ Zero secrets detected in tracked git repository files.");
  } else {
    console.table(trackedFindings.map(t => ({
      File: t.file,
      Pattern: t.pattern,
      Masked: t.maskedSecret,
    })));
  }

  if (ignoredFindings.length > 0) {
    console.log("\n--- ADVISORY: UNTRACKED / GIT-IGNORED LOCAL ENVIRONMENT FILES ---");
    console.log("(These files are git-ignored and will not be pushed to the remote repository):");
    console.table(ignoredFindings.map(t => ({
      File: t.file,
      Pattern: t.pattern,
      Masked: t.maskedSecret,
    })));
  }

  const outDir = path.join(process.cwd(), "audit");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "secret_scan_report.json"),
    JSON.stringify({ commitFindings, trackedFindings, ignoredFindings }, null, 2)
  );

  console.log(`\nScan results written to audit/secret_scan_report.json`);

  if (trackedFindings.length > 0) {
    console.error(`\n❌ FAIL: Active secret(s) found in TRACKED files! Pre-push check blocked.`);
    process.exit(1);
  } else {
    console.log(`\n✅ PASS: Tracked working tree is 100% clean of hardcoded secrets. Pre-push check passed.`);
  }
}

if (process.argv[1].endsWith("scan_secrets.mjs")) {
  main();
}
