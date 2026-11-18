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
  CheckCircle2,
  Users,
  Building,
} from "lucide-react";

export function InstitutionalStorySection() {
  const corePrinciples = [
    {
      title: "100% Honorary Trusteeship",
      detail:
        "Under registered Trust Deed Clause XVI, every trustee serves without salary, sitting fees, honoraria, or per diem reimbursement.",
      icon: Users,
    },
    {
      title: "Direct College Fee Grants",
      detail:
        "100% of educational grants are remitted directly to accredited institutions via verified NEFT/RTGS channels with zero intermediary deductions.",
      icon: CheckCircle2,
    },
    {
      title: "13+ Years of Continuous Roots",
      detail:
        "Established on 27 July 2013 under registered public Trust Deed in Balangir (Doc No. 40311302194), serving rural communities without interruption.",
      icon: Building,
    },
  ];

  return (
    <section
      id="why-mect-exists"
      aria-labelledby="story-section-title"
      className="py-16 sm:py-20 md:py-24 bg-cream border-b border-border-warm relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-16">
        {/* Main Narrative & Photographic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Authentic Campus Walk Photograph (Col 1-5) */}
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
                  className="absolute inset-x-0 bottom-0 h-28 pointer-events-none bg-gradient-to-t from-forest-deep/95 via-forest-deep/50 to-transparent"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-cream font-sans">
                  <div className="inline-flex items-center gap-1.5 text-xs bg-forest-deep/90 px-2.5 py-1 rounded-2xs border border-sand/30 backdrop-blur-xs">
                    <MapPin className="w-3.5 h-3.5 text-sand shrink-0" aria-hidden="true" />
                    <span>Balangir Field Operations, Odisha</span>
                  </div>
                  <span className="text-[11px] uppercase font-mono tracking-wider text-sand font-semibold">
                    Estd. 2013
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Institutional Story (Col 6-12) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <Reveal direction="up">
              <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta-dark font-sans shadow-2xs">
                <Landmark className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
                <span>Section 02 • Institutional Heritage</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.06}>
              <h2
                id="story-section-title"
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight [text-wrap:balance]"
              >
                Why MECT Exists: A Grassroots Safety Net in Western Odisha
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.12} className="space-y-3.5 text-sm sm:text-base text-ink leading-relaxed font-sans">
              <p>
                In the agrarian districts of Western Odisha—where prolonged droughts, distress migration, and summer heatwaves exceeding 45°C chronically destabilize daily-wage families—vulnerability rarely comes from a single misfortune. A single contaminated water source or acute medical emergency at Balangir District Hospital can trigger crippling debt, forcing parents to borrow from unregulated moneylenders and withdraw children from school.
              </p>
              <p>
                Established on 27 July 2013 under registered public Trust Deed in Balangir (Doc No. 40311302194), Mahaveer Educational &amp; Charitable Trust (MECT) was created to build a permanent, reliable institutional buffer against these compounded shocks.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.16} className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/about">
                <Button variant="primary" size="md" className="font-bold group">
                  <span>Read Full Institutional History</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/governance">
                <Button variant="outline" size="md">
                  <ShieldCheck className="w-4 h-4 mr-2 text-forest" aria-hidden="true" />
                  <span>Trustees &amp; Governance Charter</span>
                </Button>
              </Link>
            </Reveal>
          </div>
        </div>

        {/* 3 Core Institutional Commitments Grid */}
        <Reveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border-warm">
            {corePrinciples.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xs bg-white border border-border-warm shadow-xs space-y-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xs bg-forest text-sand flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h3 className="font-serif font-bold text-sm text-forest">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-ink-sand leading-relaxed font-sans">
                    {item.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
