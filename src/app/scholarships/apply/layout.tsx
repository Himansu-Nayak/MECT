import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Scholarship Application",
  description:
    "Submit your need-cum-merit scholarship application for direct college tuition fee grants under Mahaveer Educational & Charitable Trust (MECT).",
  path: "/scholarships/apply",
  ogImage: "/images/og-programmes.png",
});

export default function ScholarshipApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
