import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuickActionDock } from "@/components/QuickActionDock";
import { HImChatbot } from "@/components/ai/HImChatbot";
import { TRUST_CONFIG } from "@/lib/config";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const loraSerif = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mect.org.in"),
  title: {
    default: "Mahaveer Educational & Charitable Trust (MECT) — Registered Public Charitable Trust • Odisha",
    template: "%s | Mahaveer Educational & Charitable Trust (MECT)",
  },
  description:
    "Official website of Mahaveer Educational & Charitable Trust (MECT), Odisha. Explore our work in education, women's livelihoods, safe water, nutrition and community welfare, alongside governance and statutory disclosures.",
  keywords: [
    "Mahaveer Educational & Charitable Trust",
    "MECT Odisha",
    "MECT Balangir",
    "MECT Bhubaneswar",
    "80G Tax Exemption Donation Odisha",
    "Schedule VII CSR Registered Trust Odisha",
    "NITI Aayog NGO Darpan Odisha",
    "Community Development NGO Odisha",
    "Women Empowerment & Livelihood Odisha",
    "Safe Drinking Water Community Programmes Odisha",
    "Food Security & Nutrition Odisha",
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
    title: "Mahaveer Educational & Charitable Trust (MECT) — Registered Public Charitable Trust",
    description:
      "A registered charitable trust rooted in Odisha, working across education, women's livelihoods, safe water, nutrition and community welfare.",
    url: "https://mect.org.in",
    siteName: "Mahaveer Educational & Charitable Trust (MECT)",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mahaveer Educational & Charitable Trust (MECT) — Fiduciary Philanthropy & Education in Odisha",
    description:
      "A multi-sector charitable development organisation supporting education, livelihoods, safe water, nutrition and community wellbeing across Odisha.",
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
  alternateName: ["MECT", "MECT Odisha"],
  url: "https://mect.org.in",
  logo: "https://mect.org.in/images/mect-official-emblem.png",
  description:
    "A registered public charitable trust established on 27th July 2013, working across education, women's livelihoods, safe-water access, nutrition and community welfare in Odisha.",
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
      name: "CSR Registration Number",
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
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${loraSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cream text-ink font-sans antialiased selection:bg-sand selection:text-forest-deep">
        {/* WCAG 2.2 AA Accessible Skip Link */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <QuickActionDock />
        <HImChatbot />
        <Footer />
      </body>
    </html>
  );
}
