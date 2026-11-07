import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { APP_ROUTES } from "@/lib/routes";
import {
  FileQuestion,
  Home,
  BookOpen,
  PhoneCall,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Located | MAHAVIR TRUST",
  description:
    "The requested page or institutional record could not be found within the Mahaveer Educational & Charitable Trust portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  const suggestedDestinations = [
    {
      route: APP_ROUTES.HOME,
      icon: Home,
      detail: "Return to the main institutional portal and overview.",
    },
    {
      route: APP_ROUTES.PROGRAMMES,
      icon: BookOpen,
      detail: "Remedial education, tailoring, and drinking water relief.",
    },
    {
      route: APP_ROUTES.STATUTORY_DISCLOSURES,
      icon: ShieldCheck,
      detail: "12A, 80G, CSR-1, and Trust Deed documentation.",
    },
    {
      route: APP_ROUTES.CONTACT,
      icon: PhoneCall,
      detail: "Reach our Balangir registered office or secretariats.",
    },
  ];

  return (
    <main className="min-h-[70vh] py-20 md:py-28 bg-[#FDFBF7] flex items-center">
      <Container size="default" className="space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Badge
            variant="contrast-gold"
            size="md"
            icon={<FileQuestion className="w-3.5 h-3.5 text-[#7A5E24]" aria-hidden="true" />}
          >
            404 Notice • Page Not Located
          </Badge>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A192F] tracking-tight">
            Institutional Record or Page Not Found
          </h1>

          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
            The link you accessed may be outdated, relocated within our updated information architecture, or the URL was entered incorrectly. Our official public charitable services and verified disclosures remain accessible below.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/">
              <Button variant="primary" size="md">
                <Home className="w-4 h-4 mr-1.5" aria-hidden="true" />
                <span>Return to Homepage</span>
              </Button>
            </Link>
            <Link href="/contact?subject=Broken%20Link%20Report">
              <Button variant="secondary" size="md">
                <HelpCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
                <span>Report Missing Page</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Verified Suggested Routes Grid */}
        <div className="max-w-4xl mx-auto pt-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5E24] block text-center mb-6 font-sans">
            Recommended Verified Destinations
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestedDestinations.map(({ route, icon: Icon, detail }) => (
              <Link key={route.path} href={route.path} className="group focus-visible:outline-2 focus-visible:outline-[#C5A059] rounded-xs">
                <Card
                  variant="elevated"
                  className="p-5 bg-white border-[#0A192F]/10 hover:border-[#C5A059] transition-all h-full flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center shrink-0 border border-[#C5A059]/40 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#E4C88A]" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-serif text-base font-bold text-[#0A192F] group-hover:text-[#1E3A8A] transition-colors flex items-center justify-between">
                        <span>{route.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </h2>
                      <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                        {detail}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}

