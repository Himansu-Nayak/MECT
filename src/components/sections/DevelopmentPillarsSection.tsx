"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import {
  GraduationCap,
  Scissors,
  Droplets,
  Utensils,
  HeartHandshake,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Landmark,
  FileText,
  Sparkles,
} from "lucide-react";

export interface DevelopmentPillar {
  number: string;
  tag: string;
  category: string;
  title: string;
  description: string;
  href: string;
  stat: string;
  statLabel: string;
  location: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition: string;
  keyPoints: string[];
  icon: React.ElementType;
}

export const DEVELOPMENT_PILLARS: DevelopmentPillar[] = [
  {
    number: "01",
    tag: "Shiksha Setu",
    category: "Academic Enablement",
    title: "Education & Remedial Learning Support",
    description:
      "Preventing secondary school dropout gaps through community after-school remedial learning hubs, board examination preparation, and free scholastic materials for rural and tribal students from daily-wage households.",
    href: "/programmes#education",
    stat: "350+",
    statLabel: "Participation Entries (FY 2023–24)",
    location: "Balangir & Puintala Hubs",
    imageSrc: "/images/hero/mect-civic-pledge-classroom.jpg",
    imageAlt:
      "Students participating in an after-school remedial classroom and civic pledge mentoring session with MECT facilitators in Balangir",
    objectPosition: "object-[50%_35%]",
    keyPoints: [
      "Class 8–10 scholastic coaching & exam prep",
      "Free textbook sets, stationery & notebooks",
      "Zero cost to daily-wage & agrarian families",
    ],
    icon: GraduationCap,
  },
  {
    number: "02",
    tag: "Swavalamban",
    category: "Vocational Livelihood",
    title: "Women's Vocational Training & Micro-Enterprise",
    description:
      "Intensive certified training in apparel tailoring, pattern cutting, and craft fabrication empowering rural women, young widows, and Self-Help Group members to establish dignified micro-enterprises.",
    href: "/programmes#women-empowerment",
    stat: "120+",
    statLabel: "Course Enrolments (FY 2021–23)",
    location: "Balangir Training Centre",
    imageSrc: "/images/hero/mect-women-empowerment-seminar.jpg",
    imageAlt:
      "Rural women artisans participating in vocational tailoring, garment cutting, and livelihood self-reliance training in Balangir",
    objectPosition: "object-[50%_25%]",
    keyPoints: [
      "Structured tailoring & apparel cutting",
      "Tooling access & sewing machine support",
      "Independent monthly income generation",
    ],
    icon: Scissors,
  },
  {
    number: "03",
    tag: "Jal & Arogya",
    category: "Public Health Action",
    title: "Jal Seva: Clean Drinking Water & Summer Relief",
    description:
      "Deploying hygienic filtered drinking water points and electrolyte kiosks during severe summer heatwaves exceeding 45°C across high-footfall transit corridors, bus stations, and hospital vicinities.",
    href: "/programmes#water",
    stat: "10,000+",
    statLabel: "Service Instances Recorded",
    location: "Transit Corridors & Hospitals",
    imageSrc: "/images/hero/mect-clean-water-hygiene-demo.webp",
    imageAlt:
      "Clean drinking water and community hygiene awareness demonstration conducted by MECT coordinators in Balangir",
    objectPosition: "object-[50%_40%]",
    keyPoints: [
      "Hygienically filtered water distribution",
      "Electrolyte & ORS packets for outdoor workers",
      "Community waterborne disease awareness",
    ],
    icon: Droplets,
  },
  {
    number: "04",
    tag: "Annadaan",
    category: "Compassionate Relief",
    title: "Jan Ahar: Food Security & Nutrition Relief",
    description:
      "Providing freshly cooked nutritious meals and emergency dry ration kits to impoverished hospital attendants, patient families traveling from remote tribal villages, and destitute community members.",
    href: "/programmes#hunger-relief",
    stat: "Daily",
    statLabel: "Hospital Vicinity Relief",
    location: "District Hospital Vicinity",
    imageSrc: "/images/hero/mect-public-health-awareness.jpg",
    imageAlt:
      "Public health, nutrition guidance, and meal support outreach organized by MECT coordinators in Odisha",
    objectPosition: "object-[50%_30%]",
    keyPoints: [
      "Fresh, hot hygienic cooked thali meals",
      "Support for impoverished patient attendants",
      "Direct volunteer distribution without middlemen",
    ],
    icon: Utensils,
  },
  {
    number: "05",
    tag: "Samaj Kalyan",
    category: "Grassroots Action",
    title: "Rural Community Welfare & Emergency Assistance",
    description:
      "Delivering seasonal winter warmth essentials, flood and severe storm relief supplies, and rapid compassionate interventions for vulnerable elderly citizens and disadvantaged families in rural Western Odisha.",
    href: "/programmes#pillars",
    stat: "Direct",
    statLabel: "Field Action & Relief",
    location: "Rural Western Odisha",
    imageSrc: "/images/hero/mect-faculty-puintala-campus.jpg",
    imageAlt:
      "MECT trustees, faculty coordinators, and community volunteers assembled at the Puintala outreach campus in Balangir",
    objectPosition: "object-[50%_35%]",
    keyPoints: [
      "Winter blanket & seasonal relief drives",
      "Rapid emergency supplies in disaster events",
      "Decentralized volunteer response teams",
    ],
    icon: HeartHandshake,
  },
];

export function DevelopmentPillarsSection() {
  const leadPillar = DEVELOPMENT_PILLARS[0];
  const supportingPillars = DEVELOPMENT_PILLARS.slice(1);

  return (
    <section
      id="development-pillars"
      aria-labelledby="pillars-section-title"
      className="py-16 sm:py-20 md:py-24 lg:py-28 bg-sand-light/40 border-b border-border-warm scroll-mt-24 relative overflow-hidden"
    >
      <span id="programs" className="sr-only" />
      {/* Subtle institutional ambient backlight rings */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(229, 196, 153, 0.35) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(164, 94, 68, 0.25) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container size="default" className="relative z-10 space-y-12 sm:space-y-16">
        {/* =========================================================================
            1. SECTION HEADER (Editorial Eyebrow, Lora H2, Narrative)
            ========================================================================= */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-white/80 px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-terracotta-dark font-sans shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>Multi-Sector Community Development</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="pillars-section-title"
              className="font-serif text-[clamp(1.85rem,4.4vw,2.75rem)] font-bold text-forest tracking-tight leading-[1.18] [text-wrap:balance]"
            >
              Five Documented Pillars of Civic Stewardship
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-[15px] sm:text-base md:text-lg text-ink leading-relaxed font-sans">
              Addressing connected rural challenges across Western Odisha through grassroots
              community participation, volunteer-led delivery, and zero-intermediary accountability.
            </p>
          </Reveal>
        </div>

        {/* =========================================================================
            2. FLAGSHIP PILLAR (Pillar 01 — Education & Remedial Learning)
            ========================================================================= */}
        <Reveal direction="up" delay={0.16}>
          <div className="rounded-sm bg-white border border-border-warm shadow-md overflow-hidden transition-all duration-300 hover:border-terracotta/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Flagship Left: Large Photographic Panel (7 cols) */}
              <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] bg-forest-deep overflow-hidden group">
                <Image
                  src={leadPillar.imageSrc}
                  alt={leadPillar.imageAlt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1023px) 100vw, 58vw"
                  className={`object-cover ${leadPillar.objectPosition} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-forest-deep/95 via-forest-deep/30 to-transparent pointer-events-none"
                />

                {/* Top Badge: Number and Cultural Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-2xs bg-forest-deep/90 border border-sand/40 text-sand backdrop-blur-xs">
                    Pillar {leadPillar.number}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-2xs bg-terracotta text-white shadow-xs">
                    {leadPillar.tag}
                  </span>
                </div>

                {/* Bottom Photographic Metadata Chip */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 rounded-xs bg-forest-deep/90 border border-sand/35 px-2.5 py-1 text-[11px] text-cream font-sans backdrop-blur-xs">
                    <MapPin className="w-3 h-3 text-sand shrink-0" aria-hidden="true" />
                    <span>{leadPillar.location}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-sand bg-forest-deep/80 px-2 py-0.5 rounded-2xs font-mono">
                    {leadPillar.stat} {leadPillar.statLabel}
                  </span>
                </div>
              </div>

              {/* Flagship Right: Editorial Content & Direct Actions (5 cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6 bg-cream/20">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-dark font-sans">
                    <leadPillar.icon className="w-4 h-4 shrink-0 text-terracotta-dark" aria-hidden="true" />
                    <span>{leadPillar.category}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-[1.7rem] font-bold text-forest leading-snug">
                    {leadPillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-ink leading-relaxed font-sans">
                    {leadPillar.description}
                  </p>

                  {/* Bulleted Operational Commitments */}
                  <div className="pt-2 space-y-2.5">
                    {leadPillar.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-ink-sand font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-4 border-t border-border-warm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-forest">
                      {leadPillar.stat}
                    </span>
                    <span className="text-xs text-text-muted font-sans">
                      {leadPillar.statLabel}
                    </span>
                  </div>

                  <Link href={leadPillar.href} className="w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full sm:w-auto group font-semibold shadow-2xs"
                    >
                      <span>Explore Pillar</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                        aria-hidden="true"
                      />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* =========================================================================
            3. SUPPORTING FOUR PILLARS (2x2 Asymmetric Editorial Grid)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {supportingPillars.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <Reveal key={pillar.number} direction="up" delay={0.2 + idx * 0.06}>
                <div className="h-full flex flex-col rounded-sm bg-white border border-border-warm shadow-xs hover:shadow-md hover:border-terracotta/40 transition-all duration-300 overflow-hidden group">
                  {/* Card Image Container */}
                  <div className="relative w-full aspect-[16/10] bg-forest-deep overflow-hidden">
                    <Image
                      src={pillar.imageSrc}
                      alt={pillar.imageAlt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 767px) 100vw, 48vw"
                      className={`object-cover ${pillar.objectPosition} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/20 to-transparent pointer-events-none"
                    />

                    {/* Top Chips */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-2xs bg-forest-deep/90 border border-sand/40 text-sand backdrop-blur-xs">
                        Pillar {pillar.number}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-2xs bg-sand-light/95 border border-sand text-forest shadow-2xs">
                        {pillar.tag}
                      </span>
                    </div>

                    {/* Bottom Metadata Chip */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <div className="inline-flex items-center gap-1.5 rounded-xs bg-forest-deep/90 border border-sand/30 px-2.5 py-0.5 text-[10.5px] text-cream font-sans backdrop-blur-xs">
                        <MapPin className="w-3 h-3 text-sand shrink-0" aria-hidden="true" />
                        <span>{pillar.location}</span>
                      </div>
                      <span className="text-[10.5px] font-semibold text-sand bg-forest-deep/80 px-2 py-0.5 rounded-2xs font-mono">
                        {pillar.stat} {pillar.statLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-terracotta-dark font-sans">
                        <IconComp className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
                        <span>{pillar.category}</span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-forest group-hover:text-terracotta-dark transition-colors">
                        {pillar.title}
                      </h3>

                      <p className="text-xs sm:text-[13px] text-ink leading-relaxed font-sans">
                        {pillar.description}
                      </p>

                      <div className="pt-1.5 space-y-1.5">
                        {pillar.keyPoints.map((point, kIdx) => (
                          <div key={kIdx} className="flex items-start gap-2 text-[11.5px] text-ink-sand font-sans">
                            <CheckCircle2 className="w-3 h-3 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3.5 mt-2 border-t border-border-warm flex items-center justify-between">
                      <span className="text-xs font-semibold text-forest bg-sage/50 px-2 py-0.5 rounded-xs border border-border-warm">
                        {pillar.stat} {pillar.statLabel}
                      </span>

                      <Link
                        href={pillar.href}
                        className="text-xs font-bold text-terracotta-dark hover:text-forest inline-flex items-center gap-1 group/link"
                      >
                        <span>Explore Pillar</span>
                        <ArrowRight
                          className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* =========================================================================
            4. INSTITUTIONAL CLOSING DISCOVERY & STATUTORY ACTION BAR
            ========================================================================= */}
        <Reveal direction="up" delay={0.28}>
          <div className="rounded-sm bg-white border border-border-warm p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border-warm">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-forest">
                  <Landmark className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider font-sans">
                    Statutory Framework &amp; Verified Governance
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                  Field-Verified Work Across Five Grassroots Priorities
                </h3>
                <p className="text-xs sm:text-sm text-ink-sand font-sans leading-relaxed">
                  Every initiative is governed under registered Trust Deed No. 40311302194 (Balangir, 2013).
                  Trustees serve on an honorary, non-remunerative basis under Clause XVI, ensuring direct,
                  uncompromised community delivery.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link href="/programmes" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto font-semibold group shadow-xs"
                  >
                    <span>Explore All Programmes</span>
                    <ArrowRight
                      className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>

                <Link href="/scholarships" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full sm:w-auto font-semibold"
                  >
                    <GraduationCap className="w-4 h-4 mr-2 text-forest" aria-hidden="true" />
                    <span>Higher Education Grants</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Additional Statutory Cross-links */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-text-muted">
              <span>
                Accredited under Section 12A URN <strong className="text-forest">AADTM5474FE20231</strong> &amp; Section 80G URN <strong className="text-forest">AADTM5474FF20241</strong>.
              </span>
              <div className="flex items-center gap-4">
                <Link
                  href="/statutory-disclosures"
                  className="text-terracotta-dark hover:text-forest font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Statutory Disclosures</span>
                </Link>
                <Link
                  href="/governance"
                  className="text-terracotta-dark hover:text-forest font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Board Governance</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
