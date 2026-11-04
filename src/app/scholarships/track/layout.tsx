import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Scholarship Status",
  description:
    "Track your scholarship application progress across document scrutiny, college verification, committee approval, and treasury disbursal.",
  alternates: {
    canonical: "/scholarships/track",
  },
  openGraph: {
    title: "Track Application Lifecycle | MAHAVIR TRUST",
    description:
      "Real-time 5-stage tracking of educational scholarship applications with transparent institutional audit logging.",
    url: "https://mect.org.in/scholarships/track",
  },
};

export default function ScholarshipTrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

