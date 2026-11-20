import type { MetadataRoute } from "next";
import { execSync } from "child_process";

const FALLBACK_DATES: Record<string, string> = {
  "": "2026-11-20T10:00:00.000Z",
  "/donate": "2026-11-20T10:00:00.000Z",
  "/programmes": "2026-11-20T10:00:00.000Z",
  "/about": "2026-11-20T10:00:00.000Z",
  "/scholarships": "2026-11-20T10:00:00.000Z",
  "/scholarships/apply": "2026-11-20T10:00:00.000Z",
  "/scholarships/track": "2026-11-20T10:00:00.000Z",
  "/campaigns": "2026-11-20T10:00:00.000Z",
  "/campaigns/hanuman-murti": "2026-11-20T10:00:00.000Z",
  "/statutory-disclosures": "2026-11-20T10:00:00.000Z",
  "/csr-partnerships": "2026-11-20T10:00:00.000Z",
  "/reports": "2026-11-20T10:00:00.000Z",
  "/impact": "2026-11-20T10:00:00.000Z",
  "/stories": "2026-11-20T10:00:00.000Z",
  "/memories-gallery": "2026-11-20T10:00:00.000Z",
  "/governance": "2026-11-20T10:00:00.000Z",
  "/volunteer": "2026-11-20T10:00:00.000Z",
  "/contact": "2026-11-20T10:00:00.000Z",
  "/faq": "2026-11-20T10:00:00.000Z",
  "/privacy": "2026-11-20T10:00:00.000Z",
  "/terms": "2026-11-20T10:00:00.000Z",
  "/accessibility": "2026-11-20T10:00:00.000Z",
};

function getGitCommitDate(filePath: string, fallbackIso: string): Date {
  try {
    const stdout = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: "utf8",
      timeout: 3000,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (stdout) {
      const d = new Date(stdout);
      if (!isNaN(d.getTime())) {
        return d;
      }
    }
  } catch {
    // Fallback to static constant per page
  }
  return new Date(fallbackIso);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mect.org.in";

  const entries: {
    path: string;
    filePath: string;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: number;
  }[] = [
    { path: "", filePath: "src/app/page.tsx", changeFrequency: "weekly", priority: 1.0 },
    { path: "/donate", filePath: "src/app/donate/page.tsx", changeFrequency: "weekly", priority: 0.95 },
    { path: "/programmes", filePath: "src/app/programmes/page.tsx", changeFrequency: "weekly", priority: 0.9 },
    { path: "/about", filePath: "src/app/about/page.tsx", changeFrequency: "monthly", priority: 0.85 },
    { path: "/scholarships", filePath: "src/app/scholarships/page.tsx", changeFrequency: "weekly", priority: 0.85 },
    { path: "/scholarships/apply", filePath: "src/app/scholarships/apply/page.tsx", changeFrequency: "weekly", priority: 0.85 },
    { path: "/scholarships/track", filePath: "src/app/scholarships/track/page.tsx", changeFrequency: "monthly", priority: 0.75 },
    { path: "/campaigns", filePath: "src/app/campaigns/page.tsx", changeFrequency: "weekly", priority: 0.85 },
    { path: "/campaigns/hanuman-murti", filePath: "src/app/campaigns/hanuman-murti/page.tsx", changeFrequency: "monthly", priority: 0.8 },
    { path: "/statutory-disclosures", filePath: "src/app/statutory-disclosures/page.tsx", changeFrequency: "monthly", priority: 0.85 },
    { path: "/csr-partnerships", filePath: "src/app/csr-partnerships/page.tsx", changeFrequency: "monthly", priority: 0.85 },
    { path: "/reports", filePath: "src/app/reports/page.tsx", changeFrequency: "monthly", priority: 0.8 },
    { path: "/impact", filePath: "src/app/impact/page.tsx", changeFrequency: "monthly", priority: 0.8 },
    { path: "/stories", filePath: "src/app/stories/page.tsx", changeFrequency: "weekly", priority: 0.8 },
    { path: "/memories-gallery", filePath: "src/app/memories-gallery/page.tsx", changeFrequency: "weekly", priority: 0.85 },
    { path: "/governance", filePath: "src/app/governance/page.tsx", changeFrequency: "monthly", priority: 0.75 },
    { path: "/volunteer", filePath: "src/app/volunteer/page.tsx", changeFrequency: "monthly", priority: 0.75 },
    { path: "/contact", filePath: "src/app/contact/page.tsx", changeFrequency: "monthly", priority: 0.7 },
    { path: "/faq", filePath: "src/app/faq/page.tsx", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", filePath: "src/app/privacy/page.tsx", changeFrequency: "yearly", priority: 0.4 },
    { path: "/terms", filePath: "src/app/terms/page.tsx", changeFrequency: "yearly", priority: 0.4 },
    { path: "/accessibility", filePath: "src/app/accessibility/page.tsx", changeFrequency: "yearly", priority: 0.4 },
  ];

  return entries.map((entry) => ({
    url: `${baseUrl}${entry.path}`,
    lastModified: getGitCommitDate(entry.filePath, FALLBACK_DATES[entry.path] || "2026-11-20T10:00:00.000Z"),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
