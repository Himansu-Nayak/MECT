import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/portal",
          "/portal/",
          "/login",
          "/register",
          "/api",
          "/api/",
        ],
      },
    ],
    sitemap: "https://mect.org.in/sitemap.xml",
  };
}
