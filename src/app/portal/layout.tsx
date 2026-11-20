import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Donor & Supporter Portal",
  description:
    "Donor portal for Mahaveer Educational & Charitable Trust. Manage donation receipts and view verified contribution records.",
  path: "/portal",
  noIndex: true,
});

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
