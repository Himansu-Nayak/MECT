import type { MetadataRoute } from "next";
import { execSync } from "child_process";
import { FIELD_DISPATCHES } from "@content/stories";
import LASTMOD_MAP from "@content/lastmod.json";

const LASTMOD: Record<string, string> = LASTMOD_MAP;

/**
 * Derives route lastModified date from git history when available,
 * falling back to the committed content/lastmod.json (for Docker builds without .git).
 * Never uses dynamic `new Date()` runtime timestamps.
 */
function getGitCommitDate(filePath: string, routePath: string): Date {
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
    // Git unavailable (e.g. minimal Docker build without .git)
  }
  const committedIso = LASTMOD[routePath || "/"] || LASTMOD["/"] || "2026-11-20T10:00:00+05:30";
  return new Date(committedIso);
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
    ...FIELD_DISPATCHES.map((d) => ({
      path: `/stories/${d.slug}`,
      filePath: "content/stories.ts",
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  return entries.map((entry) => ({
    url: `${baseUrl}${entry.path}`,
    lastModified: getGitCommitDate(entry.filePath, entry.path),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
