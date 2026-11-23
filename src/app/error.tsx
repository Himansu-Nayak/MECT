"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Home, BookOpen, Heart, Mail, RotateCcw, AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for institutional diagnostics
    console.error("[MECT Application Error]:", error);
  }, [error]);

  return (
    <div className="flex flex-col w-full bg-cream min-h-[70vh]">
      <section className="py-20 md:py-28 bg-forest text-cream border-b border-terracotta/40">
        <Container size="narrow" className="text-center space-y-6">
          <Badge variant="gold" size="md">
            HTTP 500 — Server Incident
          </Badge>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Temporary Service Disruption
          </h1>

          <p className="text-sm sm:text-base text-cream/90 max-w-xl mx-auto leading-relaxed">
            The secretariat server encountered an unexpected situation while processing this request. Our technical team has been notified.
          </p>

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => reset()}
              className="!border-sand !text-cream hover:!bg-white/15 text-xs inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </Button>
          </div>
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
                      View our community programmes in education, livelihoods, and relief.
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href="/donate" className="group">
                <Card
                  variant="elevated"
                  className="p-6 h-full flex flex-col justify-between hover:border-forest transition-colors bg-white shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xs bg-forest/10 text-forest flex items-center justify-center group-hover:bg-forest group-hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-forest">Donate</h3>
                    <p className="text-xs text-ink-sand leading-relaxed">
                      View verified State Bank of India account and UPI credentials.
                    </p>
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
                    <h3 className="font-serif text-lg font-bold text-forest">Contact</h3>
                    <p className="text-xs text-ink-sand leading-relaxed">
                      Reach our official secretariat helpline or registered offices.
                    </p>
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
