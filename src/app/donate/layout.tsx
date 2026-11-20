import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Donate — Support MECT Programmes",
  description:
    "Support education, scholarships, community welfare, and the proposed Grand Hanuman Murti initiative of Mahaveer Educational & Charitable Trust (MECT) via direct State Bank of India bank transfer or UPI with official verified receipting.",
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
