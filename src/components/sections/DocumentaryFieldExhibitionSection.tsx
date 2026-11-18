"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { Camera, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { getPublishedGalleryItems } from "@content/gallery";

export function DocumentaryFieldExhibitionSection() {
  const allPublished = getPublishedGalleryItems();
  const featured = allPublished[0];
  const secondaryItems = allPublished.slice(1, 5);

  return (
    <section
      id="field-exhibition"
      aria-labelledby="exhibition-title"
      className="py-16 sm:py-20 md:py-24 bg-sand-light/40 border-b border-border-warm scroll-mt-16"
    >
      <Container size="default" className="space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-warm pb-8">
          <Reveal direction="up" className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-terracotta/10 text-terracotta-dark text-[11px] font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-terracotta-dark" aria-hidden="true" />
              <span>Section 06 • Real Stories, Real People</span>
            </div>
            <h2
              id="exhibition-title"
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight"
            >
              Documentary Field Dispatches &amp; Archival Records
            </h2>
            <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans max-w-xl">
              Authentic photographic chronicles of MECT&apos;s educational coaching, vocational tailoring, clean water kiosks, and hospital corridor relief across Western Odisha.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.1} className="shrink-0">
            <Link href="/memories-gallery">
              <Button variant="primary" size="md" className="font-bold group">
                <Camera className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Explore Full Archival Gallery</span>
                <ArrowRight
                  className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
            </Link>
          </Reveal>
        </div>

        {/* Editorial Asymmetric Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Featured Editorial Story (Col 1-7) */}
          {featured && (
            <Reveal direction="up" className="lg:col-span-7 flex flex-col h-full">
              <Link
                href="/memories-gallery"
                className="group relative flex-1 min-h-[300px] sm:min-h-[380px] rounded-xs overflow-hidden border border-sand/40 bg-forest shadow-sm block focus-visible:outline-2 focus-visible:outline-terracotta"
                aria-label={`View full record for ${featured.title}`}
              >
                <Image
                  src={featured.src}
                  alt={featured.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-forest-deep/95 via-forest-deep/60 to-transparent pointer-events-none"
                />
                <div className="absolute top-3.5 left-3.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-2xs text-[11px] font-bold uppercase tracking-wider bg-forest/90 text-sand border border-sand/30 font-sans backdrop-blur-xs">
                    {featured.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5 text-white">
                  <div className="flex items-center gap-2 text-xs text-sand font-sans">
                    <MapPin className="w-3.5 h-3.5 text-sand shrink-0" aria-hidden="true" />
                    <span>{featured.location}</span>
                    <span className="text-sand/50">•</span>
                    <span className="text-[11px] text-cream/80">{featured.period}</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-sand transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-xs text-cream/90 font-sans line-clamp-2 max-w-xl">
                    {featured.caption}
                  </p>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Secondary 2x2 Grid (Col 8-12) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {secondaryItems.map((item, idx) => (
              <Reveal key={item.id} direction="up" delay={0.06 * (idx + 1)}>
                <Link
                  href="/memories-gallery"
                  className="group relative aspect-[4/3] rounded-xs overflow-hidden border border-border-warm bg-forest shadow-2xs block focus-visible:outline-2 focus-visible:outline-terracotta"
                  aria-label={`View ${item.title} in Memories & Gallery`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 21vw"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-forest-deep/95 via-forest-deep/50 to-transparent pointer-events-none"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-2xs text-[10px] font-bold uppercase tracking-wider bg-forest-deep/85 text-cream border border-sand/20 font-sans backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <p className="font-serif text-xs font-bold text-white group-hover:text-sand transition-colors truncate">
                      {item.title}
                    </p>
                    <p className="text-[10.5px] text-cream/75 font-sans truncate">
                      {item.location}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Child Safeguarding Charter Disclosure */}
        <Reveal direction="up" delay={0.2}>
          <div className="rounded-xs border border-border-warm/80 bg-white/70 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink-sand font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
              <span>
                <strong>Institutional Safeguarding Standard:</strong> All field media complies strictly with MECT Child Safeguarding Charter (DOC-POL-SAFEGUARDING-2024). Verified written guardian consent is mandatory prior to public display; zero student roll numbers or private residential addresses are published.
              </span>
            </div>
            <Link
              href="/memories-gallery"
              className="text-terracotta-dark font-semibold hover:underline shrink-0 inline-flex items-center gap-1"
            >
              <span>Exhibition Charter</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
