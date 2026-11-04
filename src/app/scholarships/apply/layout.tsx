import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarship Online Intake & Application",
  description:
    "Submit your need-cum-merit scholarship application for direct college tuition fee grant under Mahaveer Educational & Charitable Trust.",
  alternates: {
    canonical: "/scholarships/apply",
  },
  openGraph: {
    title: "Apply for Higher Education Scholarship | MAHAVIR TRUST",
    description:
      "Secure online scholarship application for underprivileged students in Odisha with direct-to-college institutional fee disbursal.",
    url: "https://mect.org.in/scholarships/apply",
  },
};

export default function ScholarshipApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

