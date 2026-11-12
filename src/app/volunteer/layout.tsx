import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Volunteer Onboarding & Mentorship",
  ogTitle: "Volunteer With Mahaveer Educational & Charitable Trust (MECT)",
  description:
    "Register as an academic mentor, field coordinator, or study hub volunteer with Mahaveer Educational & Charitable Trust across all 30 districts of Odisha.",
  path: "/volunteer",
});

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

