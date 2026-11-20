import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Volunteer & Community Registry",
  description:
    "Explore volunteer opportunities, academic mentorship, and community participation pathways with Mahaveer Educational & Charitable Trust in Odisha.",
  path: "/volunteer",
  ogImage: "/images/og-disclosures.png",
});

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
