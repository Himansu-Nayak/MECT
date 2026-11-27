import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Home,
  BookOpen,
  Heart,
  Mail,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found | MECT",
  description:
    "The requested page could not be located on the official Mahaveer Educational & Charitable Trust web portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col w-full bg-cream min-h-[70vh]">
      <section className="py-20 md:py-28 bg-forest text-cream border-b border-terracotta/40">
        <Container size="narrow" className="text-center space-y-6">
          <Badge variant="gold" size="md">
            HTTP 404 — Record Not Found
          </Badge>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            The Requested Page Is Not Available
          </h1>

          <p className="text-sm sm:text-base text-cream/90 max-w-xl mx-auto leading-relaxed">
            The link you followed may have moved or been consolidated into our verified institutional registers. Explore our primary portals below.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-20 bg-cream">
        <Container size="default">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/" className="group">
                <Card
                  variant="elevated"
                  className="p-6 h-full flex flex-col justify-between hover:border-forest transition-colors bg-white shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xs bg-forest/10 text-forest flex items-center justify-center group-hover:bg-forest group-hover:text-white transition-colors">
                      <Home className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-forest">Home</h3>
                    <p className="text-xs text-ink-sand leading-relaxed">
                      Return to the main institutional homepage and core mission overview.
                    </p>
                  </div>
                  <div className="pt-3 flex items-center text-xs font-semibold text-forest">
                    Visit Homepage <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Card>
              </Link>

              <Link href="/programmes" className="group">
                <Card
                  variant="elevated"
                  className="p-6 h-full flex flex-col justify-between hover:border-forest transition-colors bg-white shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xs bg-forest/10 text-forest flex items-center justify-center group-hover:bg-forest group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-forest">Programmes</h3>
                    <p className="text-xs text-ink-sand leading-relaxed">
                      Explore verified education, women’s livelihood, water, and food relief initiatives.
                    </p>
                  </div>
                  <div className="pt-3 flex items-center text-xs font-semibold text-forest">
                    View Programmes <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Card>
              </Link>

              <Link href="/donate" className="group">
                <Card
                  variant="elevated"
                  className="p-6 h-full flex flex-col justify-between hover:border-forest transition-colors bg-white shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xs bg-terracotta/10 text-terracotta flex items-center justify-center group-hover:bg-terracotta group-hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-terracotta">Donate &amp; Support</h3>
                    <p className="text-xs text-ink-sand leading-relaxed">
                      Official State Bank of India account details, verified UPI ID, and transfer claim form.
                    </p>
                  </div>
                  <div className="pt-3 flex items-center text-xs font-semibold text-terracotta">
                    Support Programmes <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Card>
              </Link>

              <Link href="/contact" className="group">
                <Card
                  variant="elevated"
                  className="p-6 h-full flex flex-col justify-between hover:border-forest transition-colors bg-white shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xs bg-forest/10 text-forest flex items-center justify-center group-hover:bg-forest group-hover:text-white transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-forest">Contact Secretariat</h3>
                    <p className="text-xs text-ink-sand leading-relaxed">
                      Public inquiry desk in Bhubaneswar, helpline, and email contacts.
                    </p>
                  </div>
                  <div className="pt-3 flex items-center text-xs font-semibold text-forest">
                    Contact Desk <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      
    </div>
  );
}
