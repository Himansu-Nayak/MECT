import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "CSR Partnerships",
  description:
    "Collaborate with MECT under Section 135 of Companies Act, 2013. View MCA CSR registration CSR00081063 and eligible Schedule VII focus areas in Odisha.",
  path: "/csr-partnerships",
  ogImage: "/images/og-disclosures.png",
});

export default function CsrPartnershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
