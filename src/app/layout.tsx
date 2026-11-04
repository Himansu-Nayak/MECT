import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuickActionDock } from "@/components/QuickActionDock";

export const metadata: Metadata = {
  metadataBase: new URL("https://mect.org.in"),
  title: {
    default: "MAHAVIR TRUST — Education, Scholarships & Community Leadership (Odisha)",
    template: "%s | MAHAVIR TRUST",
  },
  description:
    "A premier philanthropic educational trust advancing higher education fee grants, academic mentorship, and student dignity across all 30 districts of Odisha, India.",
  keywords: [
    "Mahavir Trust",
    "Mahaveer Educational & Charitable Trust",
    "MECT Odisha",
    "Odisha Scholarships",
    "Education Charitable Trust",
    "Student Support Odisha",
    "Bhubaneswar Philanthropy",
    "Higher Education Grants",
    "Direct College Disbursal",
  ],
  authors: [{ name: "MAHAVIR TRUST Secretariat" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MAHAVIR TRUST — Fiduciary Educational Grants & Mentorship (Odisha)",
    description:
      "Direct-to-college tuition support, academic mentorship, and community study hubs empowering underprivileged scholars across Odisha.",
    url: "https://mect.org.in",
    siteName: "MAHAVIR TRUST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAHAVIR TRUST — Education, Scholarships & Community Leadership",
    description:
      "Direct-to-college tuition support, academic mentorship, and community study hubs empowering underprivileged scholars across Odisha.",
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
  alternateName: "MAHAVIR TRUST",
  url: "https://mect.org.in",
  description:
    "A premier philanthropic educational trust advancing higher education fee grants, academic mentorship, and student dignity across all 30 districts of Odisha, India.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bhubaneswar",
    addressRegion: "Odisha",
    postalCode: "751001",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Secretariat Office",
    email: "contact@mahavirtrust.org",
    areaServed: "IN",
    availableLanguage: ["English", "Odia", "Hindi"],
  },
  knowsAbout: [
    "Higher Education Scholarships",
    "Direct College Tuition Disbursal",
    "Academic Mentorship in Odisha",
    "Need-cum-Merit Financial Grants",
  ],
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
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1C2421] selection:bg-[#C5A059] selection:text-[#072617]">
        {/* WCAG 2.2 AA Accessible Skip Link */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 focus:outline-none">
          {children}
        </main>
        <QuickActionDock />
        <Footer />
      </body>
    </html>
  );
}
