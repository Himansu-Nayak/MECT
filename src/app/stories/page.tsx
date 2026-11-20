import React from "react";
import Link from "next/link";
import Image from "next/image";
import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FIELD_DISPATCHES } from "@content/stories";
import { MapPin, Calendar, FileCheck2, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Field Stories & Dispatches | MECT",
  description:
    "Verified documentary field dispatches from MECT community programmes in healthcare, education, safe water, and relief across Western Odisha.",
  path: "/stories",
  ogImage: "/images/og-programmes.png",
});

export default function StoriesPage() {
  return (
    <div className="flex flex-col w-full bg-cream min-h-screen">
      {/* 1. Page Hero Landmark */}
      <PageHero
        badge="Documentary Field Archive"
        badgeVariant="gold-dark"
        title="Field Stories & Community Dispatches"
        description="Evidence-led records of frontline interventions across Western Odisha. Compiled from official activity logbooks with documented dates, verified figures, and zero invented testimonials."
        breadcrumbs={[{ label: "Field Stories & Dispatches" }]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/programmes">
              <Button variant="gold" size="sm">
                <span>Explore Core Programmes</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="dark-outline" size="sm">
                <Heart className="w-3.5 h-3.5 mr-1 text-cream fill-current" />
                <span>Support Frontline Work</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* 2. Dispatches Grid Section */}
      <section className="py-14 sm:py-20" aria-label="Verified Field Dispatches">
        <Container size="default">
          <div className="space-y-12">
            {/* Editorial Standard Disclosure Banner */}
            <div className="p-4 sm:p-5 rounded-xs border border-border-warm bg-sand-light/60 flex items-start sm:items-center gap-3.5 text-xs font-sans text-ink-sand">
              <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
              <div className="space-y-1">
                <span className="font-bold text-forest uppercase tracking-wider font-mono text-[11px] block">
                  MECT Documentary Editorial Standard
                </span>
                <p className="leading-relaxed text-ink-secondary text-[11px] sm:text-xs">
                  Strictly zero fabricated quotations, unverified individual claims, or commercial endorsements. Field records reflect institutional attendance and activity logs with documented operating cycles.
                </p>
              </div>
            </div>

            {/* Grid of Verified Dispatches */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FIELD_DISPATCHES.map((dispatch) => (
                <article
                  key={dispatch.id}
                  className="rounded-xs border border-border-warm bg-white shadow-xs overflow-hidden flex flex-col justify-between hover:border-sand transition-all duration-300 group"
                >
                  <div>
                    {/* Featured Image Frame */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest-deep">
                      <Image
                        src={dispatch.image.src}
                        alt={dispatch.image.alt}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest-deep/90 via-forest-deep/40 to-transparent pointer-events-none"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider bg-forest-deep/90 text-sand border border-white/15 backdrop-blur-xs font-semibold">
                          {dispatch.programmeTag}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-3 right-3 text-[11px] text-cream/90 font-mono flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-sand shrink-0" aria-hidden="true" />
                        <span className="truncate">{dispatch.location}</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted border-b border-sand/30 pb-2.5">
                        <span className="uppercase font-bold text-terracotta tracking-wider">
                          {dispatch.editorialLabel}
                        </span>
                        <span className="flex items-center gap-1 text-ink-sand">
                          <Calendar className="w-3 h-3" aria-hidden="true" />
                          <span>{dispatch.period}</span>
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-forest group-hover:text-terracotta-dark transition-colors line-clamp-2">
                          <Link href={`/stories/${dispatch.slug}`}>
                            {dispatch.title}
                          </Link>
                        </h2>
                        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans line-clamp-3">
                          {dispatch.summary}
                        </p>
                      </div>

                      {/* Source Citation */}
                      <div className="pt-2 text-[10px] font-mono text-ink-muted flex items-start gap-1.5">
                        <FileCheck2 className="w-3 h-3 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="line-clamp-1 italic">{dispatch.sourceReference}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Link */}
                  <div className="p-6 pt-0 border-t border-sand/20 mt-4">
                    <Link
                      href={`/stories/${dispatch.slug}`}
                      className="inline-flex items-center justify-between w-full pt-3 text-xs font-semibold text-forest group-hover:text-terracotta-dark transition-colors"
                    >
                      <span>Read Complete Dispatch</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
