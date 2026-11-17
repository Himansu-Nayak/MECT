import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileCheck2,
  FileText,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FIELD_DISPATCHES } from "@content/stories";
import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = createPageMetadata({
  title: "Field Dispatches & Community Stories",
  description:
    "Documentary dispatches from Mahaveer Educational & Charitable Trust (MECT) covering remedial education, women's vocational training, and Jal Seva emergency relief in Western Odisha.",
  path: "/stories",
  ogImage: "/images/og-default.png",
});

export default function StoriesArchivePage() {
  return (
    <div className="min-h-screen bg-sand-light/30">
      {/* 1. Page Hero Banner */}
      <PageHero
        badge="Documentary Field Archive"
        badgeVariant="forest-dark"
        title="Field Dispatches — People, Places & Purpose"
        description="Factual chronicles of MECT's educational mentoring, women's vocational training, and seasonal climate relief across Western Odisha, grounded in institutional registers and verified field documentation."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Field Dispatches" },
        ]}
      />

      {/* 2. Institutional Editorial Integrity Charter */}
      <section className="py-8 bg-white border-b border-border-warm" aria-label="Editorial Integrity Standards">
        <Container size="default">
          <div className="max-w-4xl mx-auto rounded-xs border border-terracotta/40 bg-sand-light/50 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center shrink-0 border border-sand/40">
              <ShieldCheck className="w-5 h-5 text-sand" aria-hidden="true" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-ink-secondary font-sans leading-relaxed">
              <p className="font-semibold text-forest">
                MECT Editorial Standard &amp; Dignity Charter:
              </p>
              <p>
                In adherence to institutional accountability, MECT does not publish fabricated beneficiary names, invented quotes, or staged transformation stories. All dispatches represent documented programme activities supported by operational attendance logs and audited annual activity summaries.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Comprehensive Dispatches Feed */}
      <section className="py-16 md:py-24" aria-label="Published Field Dispatches">
        <Container size="default" className="space-y-16 md:space-y-24">
          {FIELD_DISPATCHES.map((dispatch, index) => (
            <article
              key={dispatch.id}
              id={dispatch.slug}
              className="scroll-mt-28 rounded-xs border border-border-warm bg-white shadow-xs overflow-hidden"
            >
              {/* Header Bar */}
              <div className="bg-cream/80 px-6 py-4 border-b border-border-warm flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-terracotta" aria-hidden="true" />
                  <span className="font-bold text-forest uppercase tracking-widest text-[11px]">
                    {dispatch.editorialLabel} • DISPATCH 0{index + 1}
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

              {/* Main Content Layout */}
              <div className="p-6 sm:p-8 lg:p-12 space-y-8">
                {/* Titles & Metadata */}
                <div className="space-y-3 max-w-4xl">
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest leading-tight">
                    {dispatch.title}
                  </h2>
                  <p className="font-serif italic text-base sm:text-lg text-ink-secondary">
                    {dispatch.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-ink-sand border-y border-border-warm py-2.5">
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

                {/* Documentary Image Feature */}
                <div className="rounded-xs border border-border-warm overflow-hidden bg-forest-deep">
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
                    <Image
                      src={dispatch.image.src}
                      alt={dispatch.image.alt}
                      fill
                      sizes="(max-width: 1280px) 100vw, 1200px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 bg-forest-deep text-cream/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans border-t border-sand/20">
                    <p className="leading-relaxed">
                      <strong className="text-sand-light font-semibold mr-1.5">Record Caption:</strong>
                      {dispatch.image.caption}
                    </p>
                    <span className="shrink-0 text-[11px] font-mono text-cream/70">
                      {dispatch.image.credit}
                    </span>
                  </div>
                </div>

                {/* Narrative Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-2">
                  {/* Left: Full Narrative Text (8 cols) */}
                  <div className="lg:col-span-8 space-y-4 text-sm sm:text-base text-ink leading-relaxed font-sans">
                    {dispatch.fullNarrative.map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Right: Key Documented Observations & Provenance (4 cols) */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="rounded-xs border border-border-warm bg-sand-light/50 p-5 space-y-4">
                      <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-forest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
                        <span>Documented Highlights</span>
                      </h3>
                      <ul className="space-y-2.5 text-xs text-ink-sand font-sans">
                        {dispatch.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2">
                            <CheckCircle2
                              className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xs border border-border-warm bg-white p-5 space-y-2 text-xs text-ink-secondary">
                      <p className="font-mono text-[11px] font-bold text-forest uppercase tracking-wider">
                        Institutional Governance Note:
                      </p>
                      <p className="leading-relaxed">
                        {dispatch.verificationNotes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </Container>
      </section>

      {/* 4. Fiduciary Cross-Links Banner */}
      <section className="py-16 bg-cream border-t border-border-warm" aria-label="Institutional Cross References">
        <Container size="default">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="forest">Transparency &amp; Fiduciary Reporting</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              Review Verified Institutional Records &amp; Audits
            </h2>
            <p className="text-sm text-ink-sand font-sans max-w-xl mx-auto leading-relaxed">
              Every programme dispatch is cross-referenced with independent Chartered Accountant audit statements and statutory submissions filed under Indian Trusts Act requirements.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link href="/reports">
                <Button variant="primary" size="md">
                  <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>Annual Reports &amp; CA Audits</span>
                </Button>
              </Link>
              <Link href="/statutory-disclosures">
                <Button variant="outline" size="md">
                  <span>Statutory Disclosures (12A / 80G / CSR-1)</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
