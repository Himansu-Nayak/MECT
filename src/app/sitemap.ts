import type { MetadataRoute } from "next";
import { getSitemapRoutes } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mect.org.in";
  // Fixed deployment date baseline to prevent spurious cache invalidations
  const buildDate = new Date("2026-11-05T12:00:00.000Z");

  return getSitemapRoutes().map((route) => ({
    url: route.path === "/" ? baseUrl : `${baseUrl}${route.path}`,
    lastModified: buildDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
