import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Volunteer & Community Participation Registry",
  ogTitle: "Volunteer & Community Participation Registry — Mahaveer Educational & Charitable Trust",
  description:
    "Explore verified volunteer opportunities, academic mentorship tracks, and community participation pathways with Mahaveer Educational & Charitable Trust (MECT) across Western Odisha.",
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
