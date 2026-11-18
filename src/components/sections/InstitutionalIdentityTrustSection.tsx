"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import {
  Landmark,
  ArrowRight,
  ShieldCheck,
  MapPin,
  FileCheck,
  Building2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export function InstitutionalIdentityTrustSection() {
  const credentials = [
    {
      label: "Registered Public Trust",
      detail: "Deed 2013 • Balangir No. 40311302194",
      icon: Landmark,
    },
    {
      label: "Sections 12A & 80G",
      detail: "Income-tax Act • URN: AADTM5474FE20231",
      icon: FileCheck,
    },
    {
      label: "MCA CSR-1 Registration",
      detail: "Reg: CSR00081063 • Schedule VII",
      icon: Building2,
    },
    {
      label: "NITI Aayog NGO Darpan",
      detail: "Enrolment: OD/2021/0285141",
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      id="institutional-identity"
      aria-labelledby="identity-title"
      className="py-14 sm:py-18 md:py-20 bg-cream border-b border-border-warm relative overflow-hidden"
    >
      <Container size="default" className="space-y-10 sm:space-y-12">
        {/* Main Narrative & Imagery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Authentic Field Documentation Photo */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal direction="up" className="relative group">
              <div className="relative w-full aspect-[4/3] rounded-xs overflow-hidden border border-sand/40 shadow-lg bg-forest">
                <Image
                  src="/images/hero/mect-trustees-campus-walk.webp"
                  alt="MECT trustees and facilitators reviewing community learning operations in Balangir"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-24 pointer-events-none bg-gradient-to-t from-forest-deep/95 via-forest-deep/40 to-transparent"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-cream font-sans">
                  <div className="inline-flex items-center gap-1.5 text-xs bg-forest-deep/90 px-2.5 py-1 rounded-2xs border border-sand/30 backdrop-blur-xs">
                    <MapPin className="w-3.5 h-3.5 text-sand shrink-0" aria-hidden="true" />
                    <span>Western Odisha Operations</span>
                  </div>
                  <span className="text-[11px] uppercase font-mono tracking-wider text-sand font-semibold">
                    Estd. 2013
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: 50-80 Word Institutional Narrative */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-4 sm:space-y-5">
            <Reveal direction="up">
              <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-sand-light/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta-dark font-sans shadow-2xs">
                <Landmark className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
                <span>Institutional Profile</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.06}>
              <h2
                id="identity-title"
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight [text-wrap:balance]"
              >
                Grassroots Commitment, Fiduciary Integrity
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.12}>
              <p className="text-sm sm:text-base text-ink leading-relaxed font-sans max-w-2xl">
                Established in 2013 under registered public Trust Deed in Balangir, Mahaveer Educational &amp; Charitable Trust (MECT) is an irrevocable public charitable institution dedicated to grassroots community development across Western Odisha. Governed by an honorary Board of Trustees under strict fiduciary oversight, the Trust works directly with daily-wage families, agrarian communities, and youth through verifiable initiatives in education, vocational empowerment, safe drinking water, and civic relief.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.16} className="pt-1 flex flex-wrap items-center gap-3">
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

        {/* Coherent Integrated Statutory Trust Strip */}
        <Reveal direction="up" delay={0.2}>
          <div className="rounded-xs border border-border-warm bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
                {credentials.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2.5 rounded-xs bg-sand-light/50 border border-border-warm/60"
                    >
                      <div className="w-8 h-8 rounded-xs bg-forest text-sand flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif font-bold text-xs text-forest truncate">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-ink-sand leading-snug font-sans">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 lg:pt-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-border-warm shrink-0 flex items-center justify-start lg:justify-end">
                <Link
                  href="/statutory-disclosures"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-dark hover:text-forest transition-colors font-sans py-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
                  <span>Statutory Disclosures Archive</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
