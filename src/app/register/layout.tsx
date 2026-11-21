import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { isDonorPortalEnabled } from "@/config/portal";

export const metadata = createPageMetadata({
  title: "Donor Registration",
  description:
    "Register as a supporter with Mahaveer Educational & Charitable Trust to track donations and receipts.",
  path: "/register",
  noIndex: true,
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isDonorPortalEnabled()) {
    notFound();
  }
  return <>{children}</>;
}
