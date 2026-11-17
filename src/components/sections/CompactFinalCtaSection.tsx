"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { Heart, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export function CompactFinalCtaSection() {
  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-heading"
      className="py-16 sm:py-20 bg-forest-deep text-white border-b border-sand/20 relative overflow-hidden"
    >
      <Container size="narrow" className="text-center space-y-6 relative z-10">
        <Reveal direction="up" className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-sand/15 border border-sand/30 text-sand text-[11px] font-bold uppercase tracking-wider mx-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
            <span>Fiduciary Commitment</span>
          </div>

          <h2
            id="final-cta-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight [text-wrap:balance]"
          >
            Building Resilient, Self-Reliant Communities
          </h2>

          <p className="text-xs sm:text-sm text-cream/80 max-w-xl mx-auto leading-relaxed font-sans">
            Every initiative at Mahaveer Educational &amp; Charitable Trust is shaped by community needs, executed by trusted local facilitators, and governed with transparent statutory accountability.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.1} className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/donate">
            <Button variant="gold" size="md" className="font-bold px-6">
              <Heart className="w-4 h-4 mr-2 fill-current text-forest-deep" aria-hidden="true" />
              <span>Support Our Mission</span>
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="dark-outline"
              size="md"
              className="!border-sand/40 !text-sand hover:!bg-forest/60 px-6"
            >
              <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Contact Secretariat</span>
            </Button>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
