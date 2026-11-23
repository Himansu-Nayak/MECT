import path from "node:path";
import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ENABLE_DONOR_PORTAL:
      (process.env.ENABLE_DONOR_PORTAL || "").trim().toLowerCase() === "true" ||
      (process.env.NEXT_PUBLIC_ENABLE_DONOR_PORTAL || "").trim().toLowerCase() === "true"
        ? "true"
        : "false",
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/gallery",
        destination: "/memories-gallery",
        permanent: true,
      },
      {
        source: "/memories",
        destination: "/memories-gallery",
        permanent: true,
      },
      {
        source: "/campaign",
        destination: "/campaigns",
        permanent: true,
      },
      {
        source: "/campaign/hanuman-murti",
        destination: "/campaigns/hanuman-murti",
        permanent: true,
      },
      {
        source: "/campaigns/murti",
        destination: "/campaigns/hanuman-murti",
        permanent: true,
      },
      {
        source: "/murti",
        destination: "/campaigns/hanuman-murti",
        permanent: true,
      },
      {
        source: "/hanuman-murti",
        destination: "/campaigns/hanuman-murti",
        permanent: true,
      },
      {
        source: "/donate/claim",
        destination: "/donate",
        permanent: true,
      },
      {
        source: "/donate/sbi",
        destination: "/donate",
        permanent: true,
      },
      {
        source: "/donate/upi",
        destination: "/donate",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
