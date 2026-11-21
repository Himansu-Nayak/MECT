import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { isDonorPortalEnabled } from "@/config/portal";

export const metadata = createPageMetadata({
  title: "Donor Portal Login",
  description:
    "Sign in securely via email or phone OTP to view your MECT donation history and official receipts.",
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isDonorPortalEnabled()) {
    notFound();
  }
  return <>{children}</>;
}
