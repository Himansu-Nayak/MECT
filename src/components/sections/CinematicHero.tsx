"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroEntrance } from "@/components/ui/MotionPrimitives";
import {
  ShieldCheck,
  Heart,
  ArrowRight,
  ChevronDown,
  MapPin,
} from "lucide-react";

export function CinematicHero() {
  return (
    <section
      id="hero"
      aria-label="Institutional Introduction"
      className="relative overflow-hidden bg-forest-deep text-white pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 border-b border-sand/20"
    >
      {/* Subtle radial atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-35 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(164, 94, 68, 0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 right-0 w-[550px] h-[550px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(229, 196, 153, 0.12) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sand/25 to-transparent" />
      </div>

      <Container size="default" className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-14 items-center">
          {/* =========================================================================
              TEXT & INTENT COLUMN (Col 1-7 on Tablet/Desktop)
              ========================================================================= */}
          <div className="order-2 md:order-1 md:col-span-7 flex flex-col items-start text-left min-w-0">
            <HeroEntrance className="w-full space-y-4 sm:space-y-5 md:space-y-6">
              {/* Institutional Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 rounded-xs border border-sand/45 bg-forest/80 backdrop-blur-xs px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-sand font-sans shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-sand shrink-0" aria-hidden="true" />
                <span>Mahaveer Educational &amp; Charitable Trust • Estd. 2013</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-bold text-white tracking-tight leading-[1.12] [text-wrap:balance]">
                Creating Opportunities.{" "}
                <span className="italic font-normal text-sand drop-shadow-xs block sm:inline">
                  Strengthening Communities.
                </span>
              </h1>

              {/* Concise Description */}
              <p className="text-[15px] sm:text-base md:text-lg text-cream/90 font-sans leading-relaxed max-w-2xl">
                Mahaveer Educational &amp; Charitable Trust works with communities through education, women&apos;s livelihoods, safe water, nutrition and community welfare.
              </p>

              {/* Two Primary Actions */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                <Link href="#work-areas" className="w-full sm:w-auto">
                  <Button
                    variant="gold"
                    size="md"
                    className="w-full sm:w-auto group font-bold px-6 h-12 text-sm shadow-md"
                  >
                    <span>Explore Our Work</span>
                    <ArrowRight
                      className="w-4 h-4 ml-2 text-forest-deep transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>

                <Link href="/donate" className="w-full sm:w-auto">
                  <Button
                    variant="dark-outline"
                    size="md"
                    className="w-full sm:w-auto group font-semibold px-6 h-12 text-sm !border-white/50 hover:!border-sand hover:!bg-forest/60"
                  >
                    <Heart
                      className="w-4 h-4 mr-2 text-sand fill-sand/20 transition-transform duration-300 group-hover:scale-110 shrink-0"
                      aria-hidden="true"
                    />
                    <span>Support Our Mission</span>
                  </Button>
                </Link>
              </div>

              {/* Quiet Fiduciary Charter Disclosure */}
              <div className="pt-3 border-t border-white/15 max-w-xl">
                <p className="text-xs text-cream/75 font-sans leading-relaxed">
                  Operating under registered Trust Deed (2013, Balangir Doc No. 40311302194). Review our{" "}
                  <Link
                    href="/governance"
                    className="text-white underline decoration-sand underline-offset-4 hover:text-sand font-semibold transition-colors"
                  >
                    Fiduciary Charter &amp; Governance Code
                  </Link>
                  .
                </p>
              </div>
            </HeroEntrance>
          </div>

          {/* =========================================================================
              PHOTO COLUMN (Col 8-12 on Tablet/Desktop)
              ========================================================================= */}
          <div className="order-1 md:order-2 md:col-span-5 relative w-full">
            <div className="relative group">
              <div className="relative w-full aspect-[16/11] sm:aspect-[4/3] rounded-sm overflow-hidden border border-sand/35 shadow-2xl bg-forest">
                <Image
                  src="/images/hero/mect-legal-literacy-session.webp"
                  alt="MECT resource speaker addressing community members during an awareness session in Balangir"
                  fill
                  priority
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 42vw"
                  className="object-cover object-[54%_24%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(29, 41, 36, 0.92) 0%, rgba(29, 41, 36, 0.35) 60%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 rounded-xs bg-forest-deep/90 border border-sand/35 px-2.5 py-1 text-xs text-cream font-sans backdrop-blur-xs">
                    <MapPin className="w-3.5 h-3.5 text-sand shrink-0" aria-hidden="true" />
                    <span className="font-medium">Community Session • Balangir, Odisha</span>
                  </div>
                  <span className="hidden sm:inline-block text-[10px] text-cream/70 uppercase tracking-widest font-mono">
                    Documented Archive
                  </span>
                </div>
              </div>

              {/* Secondary Accent Card (Desktop Depth) */}
              <div
                className="hidden lg:block absolute -bottom-5 -left-5 xl:-bottom-6 xl:-left-6 w-48 xl:w-56 aspect-[4/3] rounded-sm overflow-hidden border-2 border-sand/40 shadow-2xl bg-forest z-20 pointer-events-none"
                style={{
                  boxShadow: "0 16px 32px -6px rgba(12, 18, 15, 0.7)",
                }}
              >
                <Image
                  src="/images/hero/mect-women-empowerment-seminar.webp"
                  alt="MECT women empowerment and vocational seminar"
                  fill
                  loading="lazy"
                  sizes="230px"
                  className="object-cover object-[58%_32%]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-forest-deep/95 via-forest-deep/60 to-transparent"
                />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] font-sans font-semibold text-sand leading-tight">
                    Women Vocational Training
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restful Scroll Cue */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-1.5 text-center text-cream/70">
          <Link
            href="#work-areas"
            aria-label="Scroll to explore MECT development areas"
            className="group inline-flex flex-col items-center gap-1 focus-visible:outline-2 focus-visible:outline-sand rounded-xs p-1"
          >
            <span className="text-[11px] font-sans uppercase tracking-[0.16em] font-semibold text-cream/80 group-hover:text-sand transition-colors">
              Explore Our Work
            </span>
            <ChevronDown
              className="w-4 h-4 text-sand transition-transform duration-300 group-hover:translate-y-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
