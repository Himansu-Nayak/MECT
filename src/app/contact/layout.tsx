import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Secretariat & Desk",
  description:
    "Official administrative secretariat inquiry desk for Mahaveer Educational & Charitable Trust (MECT) in Bhubaneswar, Odisha.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact MAHAVIR TRUST Secretariat",
    description:
      "Connect with the administrative inquiry desk for higher education grants, academic mentorship, and college coordination in Odisha.",
    url: "https://mect.org.in/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

