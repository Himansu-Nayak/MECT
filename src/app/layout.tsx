import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuickActionDock } from "@/components/QuickActionDock";

export const metadata: Metadata = {
  title: "MAHAVIR TRUST — Education, Scholarships & Community Leadership (Odisha)",
  description:
    "A premier philanthropic educational trust advancing higher education fee grants, academic mentorship, and student dignity across all 30 districts of Odisha, India.",
  keywords: [
    "Mahavir Trust",
    "Odisha Scholarships",
    "Education Charitable Trust",
    "Student Support Odisha",
    "Bhubaneswar Philanthropy",
    "Higher Education Grants",
    "Direct College Disbursal",
  ],
  authors: [{ name: "MAHAVIR TRUST Secretariat" }],
  openGraph: {
    title: "MAHAVIR TRUST — Fiduciary Educational Grants & Mentorship (Odisha)",
    description:
      "Direct-to-college tuition support, academic mentorship, and community study hubs empowering underprivileged scholars across Odisha.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
