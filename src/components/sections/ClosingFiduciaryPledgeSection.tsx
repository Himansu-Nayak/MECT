"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { Heart, Mail, ArrowRight, ShieldCheck, MapPin, Phone, Clock } from "lucide-react";

export function ClosingFiduciaryPledgeSection() {
  return (
    <section
      id="closing-pledge"
      aria-labelledby="closing-pledge-heading"
      className="py-18 sm:py-24 bg-forest-deep text-white border-b border-sand/20 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(164, 94, 68, 0.25) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(229, 196, 153, 0.2) 0%, transparent 70%)",
          }}
        />
      </div>

      <Container size="narrow" className="text-center space-y-8 relative z-10">
        <Reveal direction="up" className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-sand/15 border border-sand/30 text-sand text-[11px] font-bold uppercase tracking-wider mx-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
            <span>Section 10 • The Fiduciary Pledge</span>
          </div>

          <h2
            id="closing-pledge-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] [text-wrap:balance]"
          >
            An Earned Commitment to Grassroots Dignity and Accountability
          </h2>

          <p className="text-sm sm:text-base text-cream/90 max-w-2xl mx-auto leading-relaxed font-sans">
            Every rupee entrusted to Mahaveer Educational &amp; Charitable Trust is governed by an honorary Board of Trustees under registered deed Clause XVI, disbursed through verified electronic banking channels, and dedicated entirely to the dignity and resilience of rural families in Western Odisha.
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.1} className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link href="/donate">
            <Button variant="gold" size="md" className="font-bold px-7 h-12 text-sm shadow-md">
              <Heart className="w-4 h-4 mr-2 fill-current text-forest-deep" aria-hidden="true" />
              <span>Support Our Mission</span>
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="dark-outline"
              size="md"
              className="!border-sand/50 !text-sand hover:!bg-forest/60 px-7 h-12 text-sm"
            >
              <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
              <span>Contact Secretariat Desk</span>
            </Button>
          </Link>
        </Reveal>

        {/* Canonical Contact & Registered Office Card */}
        <Reveal direction="up" delay={0.15}>
          <div className="pt-6 border-t border-white/15 max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-5 rounded-xs bg-forest/80 border border-sand/30 backdrop-blur-xs text-xs font-sans">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sand font-bold text-[11px] uppercase tracking-wider">
                  <Phone className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
                  <span>Direct Telephony</span>
                </div>
                <p className="text-white">
                  Helpline:{" "}
                  <a href="tel:+919853608113" className="font-mono font-bold underline hover:text-sand">
                    9853608113
                  </a>
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-cream/70">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  <span>Mon–Sat, 10:00–17:30 IST</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sand font-bold text-[11px] uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
                  <span>Official Secretariat Email</span>
                </div>
                <p className="text-white">
                  Email:{" "}
                  <a href="mailto:mect220@gmail.com" className="font-mono font-bold underline hover:text-sand">
                    mect220@gmail.com
                  </a>
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-cream/70">
                  <ShieldCheck className="w-3 h-3 text-sand" aria-hidden="true" />
                  <span>Direct trustee response desk</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-cream/70 font-sans">
              <MapPin className="w-3.5 h-3.5 text-sand shrink-0" aria-hidden="true" />
              <span>
                Registered Office: Near Sai Mandir, Rugudipara, Balangir – 767001, Odisha (Doc No. 40311302194)
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
