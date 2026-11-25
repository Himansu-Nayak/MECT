import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

console.log("=== PHASE 5: MULTI-SCOPE SECRET & PRIVACY FORENSIC SCAN ===");

const PATTERNS = [
  { id: "gsk", name: "Groq API Key (gsk_...)", regex: /gsk_[a-zA-Z0-9_-]{20,}/g },
  { id: "sk", name: "Secret Key (sk-... / sk_live_...)", regex: /(?:sk-[a-zA-Z0-9_-]{20,}|sk_live_[a-zA-Z0-9_-]{20,})/g },
  { id: "akia", name: "AWS Access Key ID (AKIA...)", regex: /(?:AKIA|ASIA|AIDA|AROA)[A-Z0-9]{16}/g },
  { id: "ghp", name: "GitHub Personal Access Token (ghp_...)", regex: /ghp_[a-zA-Z0-9]{36}/g },
  { id: "begin", name: "Private Key Header (-----BEGIN...)", regex: /-----BEGIN[ A-Z0-9_-]*PRIVATE KEY-----/gi },
  { id: "password", name: "Hardcoded Password Assignment", regex: /(?:password|smtp_pass|db_password)\s*[:=]\s*["'](?![$_a-zA-Z0-9]*\{)(?!(?:your_|changeme|example|password|test|root|secret|admin|postgres|mect_user))([^"'\s]{8,})["']/gi },
  { id: "jwt", name: "JWT Secret Assignment", regex: /(?:JWT_SECRET|jwt_key)\s*[:=]\s*["'](?![$_a-zA-Z0-9]*\{)(?!(?:your_|changeme|example|secret))([^"'\s]{16,})["']/gi }
];

function mask(v) {
  if (!v || v.length <= 4) return "****";
  return `${v.slice(0, 4)}...[REDACTED ${v.length - 4} chars]`;
}

// Scope A: Tracked files
console.log("Scanning Scope A: Tracked repository files...");
const trackedRaw = execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean);
const trackedFindings = [];

for (const file of trackedRaw) {
  // skip binary files or audit reports
  if (file.endsWith(".png") || file.endsWith(".jpg") || file.endsWith(".ico") || file.endsWith(".pdf") || file.endsWith(".lock")) continue;
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, "utf8");
  for (const pat of PATTERNS) {
    const matches = content.match(pat.regex);
    if (matches) {
      for (const m of matches) {
        trackedFindings.push({ file, scope: "Scope A (Tracked)", pattern: pat.name, sample: mask(m) });
      }
    }
  }
}

// Scope B: Staged changes
console.log("Scanning Scope B: Staged changes...");
let stagedFindings = [];
try {
  const stagedDiff = execSync("git diff --cached --unified=0", { encoding: "utf8" });
  for (const pat of PATTERNS) {
    const matches = stagedDiff.match(pat.regex);
    if (matches) {
      for (const m of matches) {
        stagedFindings.push({ scope: "Scope B (Staged)", pattern: pat.name, sample: mask(m) });
      }
    }
  }
} catch {}

// Scope C: Untracked files
console.log("Scanning Scope C: Untracked files...");
let untrackedFiles = [];
try {
  untrackedFiles = execSync("git ls-files --others --exclude-standard", { encoding: "utf8" }).split("\n").filter(Boolean);
} catch {}
const untrackedFindings = [];
for (const file of untrackedFiles) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, "utf8");
  for (const pat of PATTERNS) {
    const matches = content.match(pat.regex);
    if (matches) {
      for (const m of matches) {
        untrackedFindings.push({ file, scope: "Scope C (Untracked)", pattern: pat.name, sample: mask(m) });
      }
    }
  }
}

// Scope D: Ignored files advisory (e.g. .env.local)
console.log("Scanning Scope D: Ignored configuration advisory...");
const ignoredFiles = [".env.local"];
const ignoredFindings = [];
for (const file of ignoredFiles) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, "utf8");
    for (const pat of PATTERNS) {
      const matches = content.match(pat.regex);
      if (matches) {
        for (const m of matches) {
          ignoredFindings.push({ file, scope: "Scope D (Ignored Local Env)", pattern: pat.name, sample: mask(m), isGitIgnored: true });
        }
      }
    }
  }
}

// Scope F: Commit history (last 20 commits)
console.log("Scanning Scope F: Release branch commit history...");
let commitFindings = [];
try {
  const commits = execSync("git rev-list HEAD -n 20", { encoding: "utf8" }).split("\n").filter(Boolean);
  for (const c of commits) {
    const diff = execSync(`git show ${c} --unified=0`, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
    for (const pat of PATTERNS) {
      const matches = diff.match(pat.regex);
      if (matches) {
        commitFindings.push({ commit: c.slice(0, 7), pattern: pat.name, sample: mask(matches[0]) });
      }
    }
  }
} catch {}

// Check unmasked bank account in docs/audits
const auditsDir = "docs/audits";
let unmaskedAccounts = 0;
if (fs.existsSync(auditsDir)) {
  const auditFiles = fs.readdirSync(auditsDir).filter(f => f.endsWith(".md"));
  for (const f of auditFiles) {
    const c = fs.readFileSync(path.join(auditsDir, f), "utf8");
    if (c.includes("33341302498")) unmaskedAccounts++;
  }
}

const report = {
  gate: "19.12.5",
  title: "Gate 19.12 Multi-Scope Secret & Financial Privacy Forensic Scan",
  timestamp: new Date().toISOString(),
  scopes: {
    scopeA_tracked: { count: trackedFindings.length, findings: trackedFindings },
    scopeB_staged: { count: stagedFindings.length, findings: stagedFindings },
    scopeC_untracked: { count: untrackedFindings.length, findings: untrackedFindings },
    scopeD_ignoredEnvAdvisory: { count: ignoredFindings.length, findings: ignoredFindings },
    scopeF_commitHistory: { count: commitFindings.length, findings: commitFindings }
  },
  financialPrivacy: {
    unmaskedFullBankAccountsInDocs: unmaskedAccounts,
    privacyEnforced: unmaskedAccounts === 0
  },
  prePushStatus: trackedFindings.length === 0 ? "PASSED" : "BLOCKED",
  verdict: (trackedFindings.length === 0 && unmaskedAccounts === 0) ? "VERIFIED PASS" : "FAIL"
};

fs.writeFileSync("audit/final/gate_19_12_secret_privacy_results.json", JSON.stringify(report, null, 2), "utf8");
console.log("Written audit/final/gate_19_12_secret_privacy_results.json");
console.log(`Verdict: ${report.verdict} (Tracked secrets: ${trackedFindings.length}, Unmasked accounts in docs: ${unmaskedAccounts})`);
