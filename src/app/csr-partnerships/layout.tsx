import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "CSR Partnerships & Schedule VII Collaboration",
  description:
    "Collaborate with Mahaveer Educational & Charitable Trust (MECT) under Section 135 of the Companies Act, 2013. View CSR Registration CSR00081063 and Schedule VII programme areas in Odisha.",
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
