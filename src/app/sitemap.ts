import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

function getLastModified(relativePath: string, fallback: Date): Date {
  try {
    const fullPath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(fullPath)) {
      return fs.statSync(fullPath).mtime;
    }
  } catch {
    // Fallback to build time
  }
  return fallback;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mect.org.in";
  const now = new Date();

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
    lastModified: getLastModified(entry.filePath, now),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
