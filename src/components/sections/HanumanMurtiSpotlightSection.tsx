"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { HanumanMurtiVisual } from "@/components/campaigns/HanumanMurtiVisual";
import {
  Sparkles,
  Heart,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Compass,
} from "lucide-react";

export function HanumanMurtiSpotlightSection() {
  return (
    <section
      id="hanuman-murti-spotlight"
      aria-labelledby="hanuman-murti-heading"
      className="py-14 sm:py-18 md:py-20 bg-forest-deep text-white border-b border-sand/25 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-32 left-10 w-[450px] h-[450px] rounded-full opacity-15 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(164, 94, 68, 0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container size="default" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Conceptual Architectural Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <Reveal direction="up" className="w-full max-w-md">
              <HanumanMurtiVisual variant="card" className="w-full" />
            </Reveal>
          </div>

          {/* Right Column: Narrative, Vision, Ledger Segregation & Action CTAs */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <Reveal direction="up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-sand text-forest-deep text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-forest-deep" aria-hidden="true" />
                <span>Proposed Monument • 80–100 Feet Elevation</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.06}>
              <h2
                id="hanuman-murti-heading"
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight [text-wrap:balance]"
              >
                The Grand Hanuman Murti Project
              </h2>
              <p className="text-sm sm:text-base text-sand font-medium font-serif italic mt-1">
                &ldquo;A Monumental Vision of Faith, Devotion and Community Participation.&rdquo;
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.12}>
              <p className="text-xs sm:text-sm text-cream/90 font-sans leading-relaxed">
                Join Mahaveer Educational &amp; Charitable Trust in its proposed 80–100-foot Hanuman Murti initiative. Celebrating Lord Hanuman as the universal embodiment of selfless service (<em>Seva</em>), physical resilience, and moral guidance.
              </p>
            </Reveal>

            {/* Quick Factual Badges Strip */}
            <Reveal direction="up" delay={0.16}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-forest/80 border border-sand/30 rounded-xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-sand">
                    Project Status
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    Proposed Initiative
                  </div>
                  <div className="text-[10.5px] text-cream/70 mt-0.5">
                    Feasibility &amp; land appraisal
                  </div>
                </div>

                <div className="p-3 bg-forest/80 border border-sand/30 rounded-xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-sand">
                    Financial Ledger
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    100% Segregated
                  </div>
                  <div className="text-[10.5px] text-cream/70 mt-0.5">
                    Zero educational commingling
                  </div>
                </div>

                <div className="p-3 bg-forest/80 border border-sand/30 rounded-xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-sand">
                    Receipting
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    Official PDF Receipt
                  </div>
                  <div className="text-[10.5px] text-cream/70 mt-0.5">
                    SHA-256 cryptographic hash
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Direct Action CTAs */}
            <Reveal direction="up" delay={0.2}>
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="/donate?programme=HANUMAN_MURTI" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto !bg-sand !text-forest-deep hover:!bg-cream font-bold px-6 shadow-md"
                  >
                    <Heart className="w-4 h-4 mr-2 fill-current text-terracotta" aria-hidden="true" />
                    <span>Support This Initiative</span>
                  </Button>
                </Link>

                <Link href="/campaigns/hanuman-murti" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full sm:w-auto !border-white/40 !text-white hover:!bg-white/10 font-semibold"
                  >
                    <span>View Campaign Roadmap</span>
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </Reveal>

            {/* Truth in Disclosures Note */}
            <Reveal direction="up" delay={0.24}>
              <p className="text-[10.5px] text-cream/65 font-sans leading-relaxed border-t border-white/15 pt-2.5">
                <strong>Statutory Notice:</strong> This project is in the planning and conceptual design stage. MECT operates strictly on verified institutional milestones. Campaign progress and fund utilization reports are audited and published for complete civic accountability.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
