import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Donor Profile & Consent Preferences",
  description:
    "Manage your supporter contact details and communication preferences in the MECT Donor Portal.",
  path: "/portal/profile",
  noIndex: true,
});

export default function PortalProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

