import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer Onboarding & Mentorship",
  description:
    "Register as an academic mentor, field coordinator, or study hub volunteer with Mahaveer Educational & Charitable Trust across all 30 districts of Odisha.",
  alternates: {
    canonical: "/volunteer",
  },
  openGraph: {
    title: "Volunteer With MAHAVIR TRUST (Odisha)",
    description:
      "Join our volunteer corps to mentor underprivileged students, coordinate direct college fee grants, and empower community learning across Odisha.",
    url: "https://mect.org.in/volunteer",
  },
};

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

