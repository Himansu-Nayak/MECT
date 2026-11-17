import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Donate — Unified Contribution & Transparent Receipting Portal",
  description:
    "Support education, scholarships, community welfare, and the proposed Grand Hanuman Murti initiative of Mahaveer Educational & Charitable Trust (MECT) with secure online checkout and instant verified receipting.",
  path: "/donate",
  ogImage: "/images/og-donate.png",
});

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
