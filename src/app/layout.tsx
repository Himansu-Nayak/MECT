import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuickActionDock } from "@/components/QuickActionDock";
import { HImChatbot } from "@/components/ai/HImChatbot";
import { TRUST_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL("https://mect.org.in"),
  title: {
    default: "MAHAVIR TRUST (MECT) — Registered Public Charitable Trust (Est. 2013) • Odisha",
    template: "%s | MAHAVEER EDUCATIONAL & CHARITABLE TRUST",
  },
  description:
    "Official website of Mahaveer Educational & Charitable Trust (MECT). Registered in 2013 (Balangir, Odisha). 12A & 80G certified (50% tax exemption), MCA CSR-1 approved, NITI Aayog Darpan registered. Advancing higher education, rural skilling, and clean water relief.",
  keywords: [
    "Mahaveer Educational & Charitable Trust",
    "MECT Odisha",
    "Mahavir Trust Balangir",
    "Mahavir Trust Bhubaneswar",
    "80G Tax Exemption Donation Odisha",
    "MCA CSR-1 Registered Trust Odisha",
    "NITI Aayog NGO Darpan Odisha",
    "Higher Education Scholarships Odisha",
    "Remedial Education Balangir",
    "Women Vocational Tailoring Odisha",
    "Jal Seva Drinking Water Relief",
  ],
  authors: [{ name: "MECT Board of Trustees" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MAHAVIR TRUST (MECT) — Registered Public Charitable Trust (Est. 2013)",
    description:
      "12+ years of civic service across Odisha. 12A & 80G tax-exempt charitable trust advancing higher education, rural women's tailoring livelihoods, and safe drinking water.",
    url: "https://mect.org.in",
    siteName: "MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAHAVIR TRUST (MECT) — Fiduciary Philanthropy & Education in Odisha",
    description:
      "12+ years of civic service. 12A & 80G tax-exempt charitable trust advancing higher education, rural skilling, and clean water relief.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Mahaveer Educational & Charitable Trust",
  alternateName: ["MAHAVIR TRUST", "MECT ODISHA", "MECT"],
  url: "https://mect.org.in",
  logo: "https://mect.org.in/logo.png",
  description:
    "An irrevocable registered public charitable trust established on 27th July 2013, dedicated to educational advancement, rural livelihood empowerment, clean water relief, and community welfare across Odisha.",
  foundingDate: "2013-07-27",
  taxID: "AADTM5474F",
  identifier: [
    {
      "@type": "PropertyValue",
      name: "Trust Deed Registration Number",
      value: "Book No. 4, Volume No. 45, Document No. 40311302194",
    },
    {
      "@type": "PropertyValue",
      name: "Income Tax Section 12A URN",
      value: "AADTM5474FE20231",
    },
    {
      "@type": "PropertyValue",
      name: "Income Tax Section 80G URN",
      value: "AADTM5474FF20241",
    },
    {
      "@type": "PropertyValue",
      name: "Ministry of Corporate Affairs CSR Registration",
      value: "CSR00081063",
    },
    {
      "@type": "PropertyValue",
      name: "NITI Aayog NGO Darpan Unique ID",
      value: "OR/2024/0466491",
    },
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Near Sai Mandir, Rugudipara",
      addressLocality: "Balangir",
      addressRegion: "Odisha",
      postalCode: "767001",
      addressCountry: "IN",
      description: "Registered Trust Office",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "A1, 3rd Floor, Lewis Plaza, BJB Nagar",
      addressLocality: "Bhubaneswar",
      addressRegion: "Odisha",
      postalCode: "751014",
      addressCountry: "IN",
      description: "Corporate & Liaison Office",
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Secretariat & Public Inquiries",
      telephone: "+91-94371-23616",
      email: "mect27072013@gmail.com",
      areaServed: "IN",
      availableLanguage: ["English", "Odia", "Hindi"],
    },
  ],
  funder: {
    "@type": "Person",
    name: "Er. Japabandhu Kampa",
    jobTitle: "Settler Founder & Managing Trustee",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1C2421] selection:bg-[#C5A059] selection:text-[#0A192F]">
        {/* WCAG 2.2 AA Accessible Skip Link */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 focus:outline-none">
          {children}
        </main>
        <QuickActionDock />
        <HImChatbot />
        <Footer />
      </body>
    </html>
  );
}
