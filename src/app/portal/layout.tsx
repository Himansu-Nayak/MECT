import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { isDonorPortalEnabled } from "@/config/portal";

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
  if (!isDonorPortalEnabled()) {
    notFound();
  }
  return <>{children}</>;
}
