import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  ArrowRight,
  BookOpen,
  Camera,
  Heart,
  Landmark,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { FIELD_DISPATCHES } from "@content/stories";
import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = createPageMetadata({
  title: "Documentary Archival Gallery",
  description:
    "Photographic archive and field records of Mahaveer Educational & Charitable Trust covering education, women's livelihoods, and water in Western Odisha.",
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

      {/* 4. Integrated Documentary Field Dispatches Archive */}
      <section
        id="field-dispatches"
        className="py-16 md:py-24 bg-white border-t border-border-warm scroll-mt-24"
        aria-label="Verified Documentary Field Dispatches"
      >
        <Container size="default" className="space-y-12 md:space-y-16">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="forest">Archival Chronicles</Badge>
              <Badge variant="neutral">Western Odisha Operations</Badge>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest">
              Field Dispatches — People, Places &amp; Purpose
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary font-sans leading-relaxed">
              Factual operational chronicles from the Balangir Community Learning Centre, Vocational Training Centre, and seasonal Jal Seva kiosks, supported directly by institutional attendance registers.
            </p>
          </div>

          <div className="space-y-12">
            {FIELD_DISPATCHES.map((dispatch, index) => (
              <article
                key={dispatch.id}
                id={dispatch.slug}
                className="scroll-mt-28 rounded-xs border border-border-warm bg-sand-light/20 shadow-xs overflow-hidden"
              >
                {/* Header Strip */}
                <div className="bg-cream/90 px-6 py-4 border-b border-border-warm flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-terracotta" aria-hidden="true" />
                    <span className="font-bold text-forest uppercase tracking-widest text-[11px]">
                      {dispatch.editorialLabel} • RECORD 0{index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="forest" size="sm">
                      {dispatch.evidenceClassification}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {dispatch.programme}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-2 max-w-4xl">
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-forest">
                      {dispatch.title}
                    </h3>
                    <p className="font-serif italic text-sm sm:text-base text-ink-secondary">
                      {dispatch.subtitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-mono text-ink-sand border-t border-border-warm/60 mt-3 pt-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
                        <span>{dispatch.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                        <span>{dispatch.period}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                        <span>Source: {dispatch.sourceReference}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                    <div className="lg:col-span-8 space-y-3.5 text-xs sm:text-sm text-ink leading-relaxed font-sans">
                      {dispatch.fullNarrative.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="lg:col-span-4 bg-white p-5 rounded-xs border border-border-warm space-y-3">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-forest">
                        Documented Highlights
                      </h4>
                      <ul className="space-y-2 text-xs text-ink-secondary font-sans">
                        {dispatch.highlights.map((item, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Statutory Transparency Strip */}
      <section className="py-10 bg-cream border-t border-border-warm" aria-label="Statutory Links">
        <Container size="default">
          <div className="max-w-4xl mx-auto rounded-xs border border-border-warm bg-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-dark font-sans block">
                Fiduciary Oversight
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-forest">
                Verify Official Trust Filings &amp; Audited Statements
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary font-sans max-w-xl">
                Access certified copies of the 2013 Trust Deed, Section 12A/80G orders, and annual audited balance sheets.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/statutory-disclosures">
                <Button variant="primary" size="md">
                  <Landmark className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>Statutory Records</span>
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" size="md">
                  <FileCheck2 className="w-4 h-4 mr-2 text-forest" aria-hidden="true" />
                  <span>Annual Reports</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
