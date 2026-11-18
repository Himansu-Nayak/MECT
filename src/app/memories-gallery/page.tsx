import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  ArrowRight,
  BookOpen,
  Camera,
  Heart,
  Landmark,
} from "lucide-react";
import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = createPageMetadata({
  title: "Documentary Memories & Archival Gallery",
  description:
    "Verified documentary photography and archival field records from Mahaveer Educational & Charitable Trust (MECT) covering education, women's livelihoods, safe water, and civic welfare in Western Odisha.",
  path: "/memories-gallery",
  ogImage: "/images/og-default.png",
});

export default function MemoriesGalleryPage() {
  return (
    <div className="min-h-screen bg-sand-light/40">
      {/* 1. Page Hero Banner */}
      <PageHero
        badge="Archival Field Documentation"
        badgeVariant="forest-dark"
        title="Documentary Memories & Archival Gallery"
        description="Authentic photographic chronicles of MECT's educational, vocational, and emergency relief operations across Western Odisha. Exhibited strictly under institutional child-safeguarding standards and verified consent charters."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Memories & Gallery" },
        ]}
      />

      {/* 2. Institutional Media Safeguarding & Editorial Charter */}
      <section
        className="py-8 bg-white border-b border-border-warm"
        aria-label="Institutional Safeguarding and Media Charter"
      >
        <Container size="default">
          <div className="max-w-4xl mx-auto rounded-xs border border-terracotta/40 bg-sand-light/60 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center shrink-0 border border-sand/40">
                <ShieldCheck className="w-5 h-5 text-sand" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-serif font-bold text-forest">
                  MECT Child Safeguarding Charter &amp; Media Lifecycle Standard
                </h2>
                <p className="text-xs text-ink-muted font-sans">
                  Governed by Trust Safeguarding Policy (DOC-POL-SAFEGUARDING-2024) and Clause XVI of the 2013 Foundational Trust Deed.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-ink font-sans leading-relaxed pt-2 border-t border-border-warm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-forest">
                  <Lock className="w-3.5 h-3.5 text-terracotta shrink-0" aria-hidden="true" />
                  <span>Mandatory Minor Protection &amp; Guardian Consent</span>
                </div>
                <p className="text-ink-secondary">
                  Under strict child-safeguarding regulations, no identifiable child or minor is ever published on MECT platforms without countersigned written parental/guardian consent and institutional necessity clearance. Where individual releases are withheld, imagery is kept group-focused or archived privately.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-forest">
                  <FileCheck2 className="w-3.5 h-3.5 text-forest shrink-0" aria-hidden="true" />
                  <span>Verified 7-Stage Media Review Lifecycle</span>
                </div>
                <p className="text-ink-secondary">
                  Every photograph transitions through governed review states:{" "}
                  <span className="font-mono text-[11px] bg-sand/40 px-1 py-0.5 rounded text-forest font-semibold">
                    DRAFT → PENDING CONSENT → PENDING RIGHTS VERIFICATION → APPROVED → PUBLISHED → ARCHIVED / WITHDRAWN
                  </span>
                  . Zero stock photography or fabricated scenes are permitted.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Main Gallery Collection with Interactive Lightbox */}
      <section className="py-12 sm:py-16" aria-label="Field Photographs Collection">
        <Container size="default">
          <GalleryLightbox />
        </Container>
      </section>

      {/* 4. Complementary Links (Field Dispatches & Disclosures) */}
      <section className="py-12 bg-cream border-t border-border-warm" aria-label="Related Documentary Records">
        <Container size="default">
          <div className="max-w-4xl mx-auto rounded-xs border border-border-warm bg-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-dark font-sans block">
                Complementary Field Evidence
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-forest">
                Explore In-Depth Documentary Field Dispatches
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary font-sans max-w-xl">
                Read detailed operational narratives from the Balangir Community Learning Centre, Vocational Training Centre, and Summer Hydration Taskforce registers.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/stories">
                <Button variant="primary" size="md">
                  <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>Field Dispatches</span>
                </Button>
              </Link>
              <Link href="/statutory-disclosures">
                <Button variant="outline" size="md">
                  <Landmark className="w-4 h-4 mr-2 text-forest" aria-hidden="true" />
                  <span>Public Records</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
