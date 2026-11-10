import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate — Direct State Bank of India Remittance & Receipt Desk",
  description:
    "Support Free Education for 200 Students and community programmes of Mahaveer Educational & Charitable Trust (MECT) via State Bank of India NEFT, RTGS, or IMPS bank transfer.",
  alternates: {
    canonical: "/donate",
  },
  openGraph: {
    title: "Donate | Mahaveer Educational & Charitable Trust (MECT)",
    description:
      "Verified State Bank of India trust account details, illustrative tax deduction mechanics under Section 133 / legacy Section 80G, and donor receipt desk.",
    url: "https://mect.org.in/donate",
    type: "website",
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

