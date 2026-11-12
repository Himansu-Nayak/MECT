import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Donor & Supporter Portal Login",
  description:
    "Sign in securely via email or phone OTP to view your MECT donation history and official receipts.",
  path: "/portal/login",
  noIndex: true,
});

export default function PortalLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

