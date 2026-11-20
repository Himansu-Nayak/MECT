import { createPageMetadata } from "@/lib/seo";

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
  return <>{children}</>;
}
