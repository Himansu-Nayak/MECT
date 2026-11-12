import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Donate — Direct State Bank of India Transfer & Receipt Desk",
  description:
    "Support education and community programmes of Mahaveer Educational & Charitable Trust (MECT) via State Bank of India NEFT, RTGS, IMPS or SBI UPI.",
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
