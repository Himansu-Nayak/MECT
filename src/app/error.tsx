"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RotateCcw, Home, HelpCircle } from "lucide-react";

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected runtime error to console for diagnostic auditing
    console.error("Institutional Portal Render Interruption:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] py-20 md:py-28 bg-[#FDFBF7] flex items-center">
      <Container size="default" className="space-y-8">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <Badge
            variant="warning"
            size="md"
            icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-900" aria-hidden="true" />}
          >
            System Interruption • 500
          </Badge>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A192F] tracking-tight">
            An Unexpected Interruption Occurred
          </h1>

          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
            The page could not be rendered due to a transient client-side processing interruption. No institutional data or user submission was compromised.
          </p>

          {error.digest && (
            <div className="p-3 bg-[#F4EFE6] rounded-xs border border-[#0A192F]/10 text-xs text-[#7A5E24] font-mono inline-block">
              Reference Incident Digest: {error.digest}
            </div>
          )}

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => reset()}
            >
              <RotateCcw className="w-4 h-4 mr-1.5" aria-hidden="true" />
              <span>Retry Page Render</span>
            </Button>
            <Link href="/">
              <Button variant="secondary" size="md">
                <Home className="w-4 h-4 mr-1.5" aria-hidden="true" />
                <span>Return to Homepage</span>
              </Button>
            </Link>
            <Link href="/contact?subject=System%20Error%20Report">
              <Button variant="ghost" size="md">
                <HelpCircle className="w-4 h-4 mr-1.5" aria-hidden="true" />
                <span>Contact Secretariat</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

