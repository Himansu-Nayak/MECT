import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSR Partnerships & Schedule VII Collaboration (CSR00081063)",
  description:
    "Collaborate with Mahaveer Educational & Charitable Trust (MECT) under Section 135 of the Companies Act, 2013. View CSR Registration CSR00081063 and Schedule VII programme areas in Odisha.",
  alternates: {
    canonical: "/csr-partnerships",
  },
  openGraph: {
    title: "CSR Partnerships & Collaboration | Mahaveer Educational & Charitable Trust (MECT)",
    description:
      "Schedule VII focus areas, verified CSR registration certificate (CSR00081063), and institutional CSR enquiry desk for Odisha.",
    url: "https://mect.org.in/csr-partnerships",
    type: "website",
  },
};

export default function CsrPartnershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

