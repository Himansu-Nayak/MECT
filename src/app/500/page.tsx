import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Home, BookOpen, Heart, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "500 — Server Incident | MECT",
  description: "Temporary server error encountered.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error500Page() {
  return (
    <div className="flex flex-col w-full bg-cream min-h-[70vh]">
      <section className="py-20 md:py-28 bg-forest text-cream border-b border-terracotta/40">
        <Container size="narrow" className="text-center space-y-6">
          <Badge variant="gold" size="md">
            HTTP 500 — Server Incident
          </Badge>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Temporary Server Error
          </h1>

          <p className="text-sm sm:text-base text-cream/90 max-w-xl mx-auto leading-relaxed">
            The secretariat server encountered an unexpected error. Please return to the homepage or visit one of the primary sections below.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-20 bg-cream">
        <Container size="default">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/">
                <Card variant="elevated" className="p-6 h-full bg-white hover:border-forest transition-colors shadow-xs">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-forest" />
                    <h3 className="font-serif text-lg font-bold text-forest">Home</h3>
                  </div>
                  <p className="text-xs text-ink-sand mt-2">Return to the institutional homepage.</p>
                </Card>
              </Link>

              <Link href="/programmes">
                <Card variant="elevated" className="p-6 h-full bg-white hover:border-forest transition-colors shadow-xs">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-forest" />
                    <h3 className="font-serif text-lg font-bold text-forest">Programmes</h3>
                  </div>
                  <p className="text-xs text-ink-sand mt-2">Explore our community programmes.</p>
                </Card>
              </Link>

              <Link href="/donate">
                <Card variant="elevated" className="p-6 h-full bg-white hover:border-forest transition-colors shadow-xs">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-forest" />
                    <h3 className="font-serif text-lg font-bold text-forest">Donate</h3>
                  </div>
                  <p className="text-xs text-ink-sand mt-2">State Bank of India transfer and UPI details.</p>
                </Card>
              </Link>

              <Link href="/contact">
                <Card variant="elevated" className="p-6 h-full bg-white hover:border-forest transition-colors shadow-xs">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-forest" />
                    <h3 className="font-serif text-lg font-bold text-forest">Contact</h3>
                  </div>
                  <p className="text-xs text-ink-sand mt-2">Secretariat helpline and registered offices.</p>
                </Card>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
