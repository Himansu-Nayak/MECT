import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = process.cwd();
const LASTMOD_PATH = path.join(ROOT, "content", "lastmod.json");

const FILES_TO_TRACK = {
  "/": "src/app/page.tsx",
  "/donate": "src/app/donate/page.tsx",
  "/programmes": "src/app/programmes/page.tsx",
  "/about": "src/app/about/page.tsx",
  "/scholarships": "src/app/scholarships/page.tsx",
  "/scholarships/apply": "src/app/scholarships/apply/page.tsx",
  "/scholarships/track": "src/app/scholarships/track/page.tsx",
  "/campaigns": "src/app/campaigns/page.tsx",
  "/campaigns/hanuman-murti": "src/app/campaigns/hanuman-murti/page.tsx",
  "/statutory-disclosures": "src/app/statutory-disclosures/page.tsx",
  "/csr-partnerships": "src/app/csr-partnerships/page.tsx",
  "/reports": "src/app/reports/page.tsx",
  "/impact": "src/app/impact/page.tsx",
  "/stories": "src/app/stories/page.tsx",
  "/memories-gallery": "src/app/memories-gallery/page.tsx",
  "/governance": "src/app/governance/page.tsx",
  "/volunteer": "src/app/volunteer/page.tsx",
  "/contact": "src/app/contact/page.tsx",
  "/faq": "src/app/faq/page.tsx",
  "/privacy": "src/app/privacy/page.tsx",
  "/terms": "src/app/terms/page.tsx",
  "/accessibility": "src/app/accessibility/page.tsx",
  "/stories/classroom": "content/stories.ts",
  "/stories/workshop": "content/stories.ts",
  "/stories/water-point": "content/stories.ts",
};

const lastmodMap = {};

for (const [route, filePath] of Object.entries(FILES_TO_TRACK)) {
  try {
    const stdout = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: "utf8",
      timeout: 5000,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (stdout && !isNaN(new Date(stdout).getTime())) {
      lastmodMap[route] = stdout;
    } else {
      lastmodMap[route] = "2026-11-20T10:00:00+05:30";
    }
  } catch {
    lastmodMap[route] = "2026-11-20T10:00:00+05:30";
  }
}

fs.writeFileSync(LASTMOD_PATH, JSON.stringify(lastmodMap, null, 2) + "\n", "utf8");
console.log(`Generated ${LASTMOD_PATH} with ${Object.keys(lastmodMap).length} entries.`);
