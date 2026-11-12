import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Welcome to Donor Portal",
  description:
    "Complete your onboarding inside the MECT Donor & Supporter Portal.",
  path: "/portal/welcome",
  noIndex: true,
});

export default function PortalWelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

