import { createPageMetadata } from "@/lib/seo";

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
  return <>{children}</>;
}
