import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Donor Portal Dashboard",
  description:
    "View your donation records, verification references, and supporter preferences in the MECT Donor Portal.",
  path: "/portal/dashboard",
  noIndex: true,
});

export default function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

