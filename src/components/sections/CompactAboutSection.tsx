"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { Landmark, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

export function CompactAboutSection() {
  return (
    <section
      id="about-mect"
      aria-labelledby="about-mect-title"
      className="py-16 sm:py-20 md:py-24 bg-cream border-b border-border-warm relative overflow-hidden"
    >
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Authentic Field Documentation Photo */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal direction="up" className="relative group">
              <div className="relative w-full aspect-[4/3] rounded-xs overflow-hidden border border-sand/40 shadow-lg bg-forest">
                <Image
                  src="/images/hero/mect-trustees-field-review.webp"
                  alt="MECT trustees and facilitators reviewing community learning operations in Balangir"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1023px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-20 pointer-events-none bg-gradient-to-t from-forest-deep/90 via-forest-deep/40 to-transparent"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-cream font-sans">
                  <div className="inline-flex items-center gap-1.5 text-xs bg-forest-deep/85 px-2.5 py-1 rounded-2xs border border-sand/30">
                    <MapPin className="w-3 h-3 text-sand shrink-0" aria-hidden="true" />
                    <span>Western Odisha Field Operations</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-sand">
                    Estd. 2013
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: 70-90 Word Institutional Narrative */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <Reveal direction="up">
              <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-sand-light/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta-dark font-sans shadow-2xs">
                <Landmark className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
                <span>Institutional Profile</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.06}>
              <h2
                id="about-mect-title"
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight [text-wrap:balance]"
              >
                Grassroots Commitment, Fiduciary Integrity
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.12}>
              <p className="text-sm sm:text-base text-ink leading-relaxed font-sans">
                Established in 2013 under registered public Trust Deed in Balangir, Mahaveer Educational &amp; Charitable Trust (MECT) is an irrevocable public charitable institution dedicated to grassroots community development across Western Odisha. Governed by an honorary Board of Trustees under strict fiduciary oversight, the Trust works directly with daily-wage families, agrarian communities, and youth through verifiable, non-intermediary initiatives in education, vocational empowerment, safe drinking water, and civic relief.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.16} className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="/about">
                <Button variant="primary" size="md" className="font-bold">
                  <span>Discover Our Story</span>
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/governance">
                <Button variant="outline" size="md">
                  <ShieldCheck className="w-4 h-4 mr-2 text-forest" aria-hidden="true" />
                  <span>Trustees &amp; Governance</span>
                </Button>
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
