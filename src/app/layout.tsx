import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ORG } from "@content/org";

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
  metadataBase: new URL(ORG.branding.canonicalOrigin),
  title: {
    default: `Home | ${ORG.legalName}`,
    template: `%s | ${ORG.legalName}`,
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
  name: ORG.name,
  alternateName: [ORG.shortName, "MECT Odisha"],
  url: ORG.branding.canonicalOrigin,
  logo: `${ORG.branding.canonicalOrigin}${ORG.branding.logoPath}`,
  description:
    "A registered public charitable trust established on 27th July 2013, working across education, women's livelihoods, safe-water access, nutrition and community welfare in Odisha.",
  foundingDate: "2013-07-27",
  taxID: ORG.ids.pan,
  identifier: [
    {
      "@type": "PropertyValue",
      name: "Trust Deed Registration Number",
      value: ORG.trustDeed.bookVolume,
    },
    {
      "@type": "PropertyValue",
      name: "Income Tax Section 12A URN",
      value: ORG.ids.urn12A,
    },
    {
      "@type": "PropertyValue",
      name: "Income Tax Section 80G URN",
      value: ORG.ids.urn80G,
    },
    {
      "@type": "PropertyValue",
      name: "CSR Registration Number",
      value: ORG.ids.csr1,
    },
    {
      "@type": "PropertyValue",
      name: "NITI Aayog NGO Darpan Unique ID",
      value: ORG.ids.darpan,
    },
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: ORG.addresses.registered.line1,
      addressLocality: ORG.addresses.registered.city,
      addressRegion: ORG.addresses.registered.state,
      postalCode: ORG.addresses.registered.pin,
      addressCountry: "IN",
      description: ORG.addresses.registered.title,
    },
    {
      "@type": "PostalAddress",
      streetAddress: ORG.addresses.corporateLiaison.line1,
      addressLocality: ORG.addresses.corporateLiaison.city,
      addressRegion: ORG.addresses.corporateLiaison.state,
      postalCode: ORG.addresses.corporateLiaison.pin,
      addressCountry: "IN",
      description: ORG.addresses.corporateLiaison.title,
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Secretariat & Public Inquiries",
      telephone: ORG.helpline.e164,
      email: ORG.emails.official,
      areaServed: "IN",
      availableLanguage: ["English", "Odia", "Hindi"],
    },
  ],
  funder: {
    "@type": "Person",
    name: ORG.chairman.name,
    jobTitle: ORG.chairman.role,
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
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
