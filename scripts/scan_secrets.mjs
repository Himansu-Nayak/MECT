import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const SECRET_PATTERNS = [
  { name: "Private Key Header", regex: /-----BEGIN\s+(?:RSA|OPENSSH|EC|DSA|PGP)?\s*PRIVATE KEY-----/i },
  { name: "Live Groq API Key", regex: /gsk_[a-zA-Z0-9]{40,}/ },
  { name: "GitHub Personal Access Token", regex: /ghp_[a-zA-Z0-9]{36}/ },
  { name: "Stripe Live Secret Key", regex: /sk_live_[0-9a-zA-Z]{24}/ },
  { name: "AWS Access Key ID", regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/ },
  { name: "Hardcoded Password Assignment", regex: /(?:password|smtp_password|db_password)\s*[:=]\s*["'](?![$_a-zA-Z0-9]*\{)(?!(?:your_|changeme|example|password|test|root|secret|admin|postgres|mect_user))([^"'\s]{8,})["']/i },
  { name: "Hardcoded JWT Secret", regex: /JWT_SECRET\s*[:=]\s*["'](?![$_a-zA-Z0-9]*\{)(?!(?:your_|changeme|example|secret))([^"'\s]{16,})["']/i },
  { name: "Hardcoded OTP Pepper", regex: /OTP_HASH_PEPPER\s*[:=]\s*["'](?![$_a-zA-Z0-9]*\{)(?!(?:your_|changeme|example|pepper))([^"'\s]{10,})["']/i },
  { name: "Hardcoded Bank PIN", regex: /(?:bank_pin|atm_pin|card_pin)\s*[:=]\s*["']?\d{4,6}["']?/i },
];

function scanGitHistory() {
  console.log("=== SCANNING GIT HISTORY (All commits on fix/audit-loop) ===");
  const commits = execSync("git rev-list origin/main..fix/audit-loop", { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);

  console.log(`Scanning ${commits.length} commits on fix/audit-loop...`);
  const findings = [];

  for (const commit of commits) {
    const files = execSync(`git diff-tree --no-commit-id --name-only -r ${commit}`, { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);

    for (const file of files) {
      if (
        file.includes(".env.example") ||
        file.includes(".example") ||
        file.includes("scan_secrets.mjs") ||
        file.endsWith(".png") ||
        file.endsWith(".jpg") ||
        file.endsWith(".ico") ||
        file.endsWith(".pdf")
      ) {
        continue;
      }

      try {
        const diff = execSync(`git diff ${commit}~1 ${commit} -- "${file}"`, {
          encoding: "utf8",
          maxBuffer: 20 * 1024 * 1024,
        });

        const lines = diff.split("\n");
        for (const line of lines) {
          if (line.startsWith("+") && !line.startsWith("+++")) {
            const added = line.substring(1);
            for (const p of SECRET_PATTERNS) {
              if (p.regex.test(added)) {
                findings.push({
                  commit: commit.slice(0, 7),
                  file,
                  pattern: p.name,
                  snippet: added.trim().slice(0, 80),
                });
              }
            }
          }
        }
      } catch {
        // First commit or root diff
      }
    }
  }

  return findings;
}

function scanWorkingTree() {
  console.log("\n=== SCANNING WORKING TREE FILES ===");
  const findings = [];
  const ignoreDirs = new Set(["node_modules", ".git", ".next", "dist", "build"]);

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory()) {
        if (!ignoreDirs.has(ent.name)) {
          walk(path.join(dir, ent.name));
        }
      } else if (ent.isFile()) {
        const full = path.join(dir, ent.name);
        const rel = path.relative(process.cwd(), full).replace(/\\/g, "/");
        if (
          rel.includes(".env.example") ||
          rel.includes(".example") ||
          rel.includes("scan_secrets.mjs") ||
          rel.endsWith(".png") ||
          rel.endsWith(".jpg") ||
          rel.endsWith(".ico") ||
          rel.endsWith(".pdf")
        ) {
          continue;
        }

        const content = fs.readFileSync(full, "utf8");
        const lines = content.split("\n");
        lines.forEach((line, idx) => {
          for (const p of SECRET_PATTERNS) {
            if (p.regex.test(line)) {
              findings.push({
                file: rel,
                line: idx + 1,
                pattern: p.name,
                snippet: line.trim().slice(0, 80),
              });
            }
          }
        });
      }
    }
  }

  walk(process.cwd());
  return findings;
}

function main() {
  const historyFindings = scanGitHistory();
  const treeFindings = scanWorkingTree();

  console.log(`\nHistory scan findings: ${historyFindings.length}`);
  for (const f of historyFindings) {
    console.log(`  [CRITICAL FINDING IN GIT HISTORY] ${f.commit} (${f.file}): ${f.pattern} -> ${f.snippet}`);
  }

  console.log(`\nWorking tree scan findings: ${treeFindings.length}`);
  for (const f of treeFindings) {
    console.log(`  [CRITICAL FINDING IN WORKING TREE] ${f.file}:${f.line}: ${f.pattern} -> ${f.snippet}`);
  }

  if (historyFindings.length === 0 && treeFindings.length === 0) {
    console.log("\n=======================================================");
    console.log("SECRET SCAN RESULT: 0 SECRETS DETECTED. ALL GATES PASSED.");
    console.log("=======================================================\n");
  } else {
    console.error("\n=======================================================");
    console.error("FATAL: REAL SECRETS OR SENSITIVE TOKENS FOUND!");
    console.error("DO NOT PUSH. STOP AND REPORT.");
    console.error("=======================================================\n");
    process.exit(1);
  }
}

main();
