import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FIELD_DISPATCHES } from "@content/stories";
import {
  MapPin,
  Calendar,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Heart,
  Share2,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FIELD_DISPATCHES.map((d) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dispatch = FIELD_DISPATCHES.find((d) => d.slug === slug);
  if (!dispatch) return notFound();

  const title = `${dispatch.title.split(":")[0].trim()} | MECT Stories`;
  const truncatedDesc =
    dispatch.summary.length > 152
      ? `${dispatch.summary.slice(0, 149)}...`
      : dispatch.summary;

  return createPageMetadata({
    title: title.length > 60 ? `${dispatch.title.slice(0, 45)}... | MECT` : title,
    description: truncatedDesc,
    path: `/stories/${dispatch.slug}`,
    ogImage: dispatch.image.src,
  });
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const dispatch = FIELD_DISPATCHES.find((d) => d.slug === slug);
  if (!dispatch) return notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: dispatch.title,
    description: dispatch.summary,
    image: [`https://mect.org.in${dispatch.image.src}`],
    datePublished: dispatch.datePublished,
    dateModified: "2026-11-20T10:00:00.000Z",
    author: {
      "@type": "Organization",
      name: "Mahaveer Educational & Charitable Trust (MECT)",
      url: "https://mect.org.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Mahaveer Educational & Charitable Trust (MECT)",
      url: "https://mect.org.in",
      logo: {
        "@type": "ImageObject",
        url: "https://mect.org.in/images/mect-official-emblem.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://mect.org.in/stories/${dispatch.slug}`,
    },
  };

  return (
    <div className="flex flex-col w-full bg-cream min-h-screen">
      {/* Schema.org Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* 1. Page Hero Landmark */}
      <PageHero
        badge={dispatch.programmeTag}
        badgeVariant="gold-dark"
        title={dispatch.title}
        description={dispatch.subtitle}
        breadcrumbs={[
          { label: "Stories & Dispatches", href: "/stories" },
          { label: dispatch.title },
        ]}
      />

      {/* 2. Article Body Container */}
      <article className="py-12 sm:py-16">
        <Container size="default">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Metadata Citation Bar */}
            <div className="p-4 sm:p-5 rounded-xs border border-border-warm bg-white shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-ink-sand">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-bold text-terracotta uppercase tracking-wider">
                  {dispatch.editorialLabel}
                </span>
                <span className="text-sand/70">•</span>
                <span className="flex items-center gap-1.5 text-forest">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
                  <span>{dispatch.location}</span>
                </span>
                <span className="text-sand/70">•</span>
                <span className="flex items-center gap-1.5 text-forest">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{dispatch.period}</span>
                </span>
              </div>
              <Badge variant="forest" size="sm">
                {dispatch.evidenceClassification}
              </Badge>
            </div>

            {/* Featured Hero Photo */}
            <div className="rounded-xs overflow-hidden border border-border-warm bg-forest-deep shadow-md">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={dispatch.image.src}
                  alt={dispatch.image.alt}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 896px"
                  className="object-cover object-center"
                />
              </div>
              <div className="p-3 sm:p-4 bg-forest-deep text-cream text-xs font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-sand/20">
                <span className="italic text-sand-light">{dispatch.image.caption}</span>
                <span className="text-[11px] font-mono text-sand shrink-0">
                  Credit: {dispatch.image.credit}
                </span>
              </div>
            </div>

            {/* Safeguarding & Privacy Note */}
            {dispatch.beneficiaryPrivacyNote && (
              <div className="p-4 rounded-xs border border-sand bg-sand-light/50 flex items-start gap-3 text-xs font-sans text-ink-sand">
                <ShieldCheck className="w-4 h-4 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-bold text-forest uppercase font-mono tracking-wider text-[11px] block">
                    Institutional Safeguarding &amp; Ethical Attribution
                  </span>
                  <p className="mt-0.5 leading-relaxed text-ink-secondary">
                    {dispatch.beneficiaryPrivacyNote}
                  </p>
                </div>
              </div>
            )}

            {/* Key Documented Highlights */}
            <div className="p-6 rounded-xs border border-border-warm bg-white space-y-4 shadow-xs">
              <h2 className="font-mono text-xs uppercase tracking-wider font-bold text-forest flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-terracotta" aria-hidden="true" />
                <span>Documented Operational Highlights</span>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-ink-secondary font-sans">
                {dispatch.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Full Narrative Text */}
            <div className="space-y-6 text-sm sm:text-base text-ink-secondary font-sans leading-relaxed pt-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
                Operational Dispatch &amp; Community Context
              </h2>
              {dispatch.fullNarrative.map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Photo Gallery Component */}
            {dispatch.gallery && dispatch.gallery.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-border-warm">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-forest" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-bold text-forest">
                    Archival Field Photographic Records
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {dispatch.gallery.map((photo, gIdx) => (
                    <div
                      key={gIdx}
                      className="rounded-xs overflow-hidden border border-border-warm bg-white shadow-xs"
                    >
                      <div className="relative aspect-[16/10] w-full bg-forest-deep">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, 420px"
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="p-3 bg-cream text-xs text-ink-muted border-t border-sand/20">
                        <p className="italic">{photo.caption}</p>
                        <p className="text-[10px] font-mono text-ink-sand mt-1">
                          Source: {photo.credit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Docket Source Citation & CA Review Reference */}
            <div className="p-5 rounded-xs border border-border-warm bg-cream/70 text-xs font-mono text-ink-muted space-y-1">
              <div className="flex items-center gap-1.5 text-forest font-bold">
                <FileCheck2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Primary Verification Docket Reference:</span>
              </div>
              <p className="pl-5 text-ink-sand">{dispatch.sourceReference}</p>
              <p className="pl-5 text-[11px] italic text-ink-muted">{dispatch.verificationNotes}</p>
            </div>

            {/* Bottom Actions Navigation */}
            <div className="pt-8 border-t border-border-warm flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link href="/stories">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  <span>All Field Dispatches</span>
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/programmes">
                  <Button variant="outline" size="sm">
                    <span>Explore Programmes</span>
                  </Button>
                </Link>
                <Link href="/donate">
                  <Button variant="primary" size="sm">
                    <Heart className="w-3.5 h-3.5 mr-1 fill-white/20" />
                    <span>Support This Work</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </article>
    </div>
  );
}
