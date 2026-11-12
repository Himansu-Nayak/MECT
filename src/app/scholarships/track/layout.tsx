import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Track Scholarship Status",
  description:
    "Track your scholarship application progress across document scrutiny, college verification, committee approval, and treasury disbursal.",
  path: "/scholarships/track",
});

export default function ScholarshipTrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
