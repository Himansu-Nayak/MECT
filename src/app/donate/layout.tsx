import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Donate — Support Programmes",
  description:
    "Support education, scholarships, and community welfare with MECT via direct SBI bank transfer or UPI with official verified receipting.",
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
