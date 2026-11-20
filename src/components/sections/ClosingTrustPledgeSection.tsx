"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { ORG } from "@content/org";
import {
  Heart,
  Mail,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";

/**
 * MECT Phase 26 — Section 10: Closing Institutional Trust Commitment
 *
 * Concludes the homepage with a solemn editorial composition, displaying
 * the Board's institutional pledge, canonical contact coordinates, and clear actions.
 */
export function ClosingTrustPledgeSection() {
  return (
    <section
      id="closing-pledge"
      aria-labelledby="closing-pledge-heading"
      className="py-18 sm:py-24 md:py-28 bg-[#0D1512] text-white border-b border-border-dark relative overflow-hidden"
    >
      {/* Warm Ambient Radial Atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      >
        <div
          className="absolute -bottom-28 -left-28 w-[580px] h-[580px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(184, 93, 59, 0.28) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-28 -right-28 w-[580px] h-[580px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(196, 146, 74, 0.22) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C4924A]/30 to-transparent" />
      </div>

      <Container size="narrow" className="text-center space-y-10 relative z-10 max-w-4xl">
        <Reveal direction="up" className="space-y-5">
          {/* Trusteeship Seal Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-[#16221D] border border-[#C4924A]/40 text-[#E5C499] text-[11px] font-mono uppercase tracking-[0.14em] mx-auto shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#C4924A]" aria-hidden="true" />
            <span>Section 10 • Institutional Trusteeship Covenant</span>
          </div>

          {/* Literary Headline */}
          <h2
            id="closing-pledge-heading"
            className="font-serif text-[clamp(2.1rem,4.2vw,3.6rem)] font-bold text-white tracking-tight leading-[1.12] [text-wrap:balance]"
          >
            An Earned Commitment to Grassroots Dignity and Financial Accountability
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-cream/90 max-w-2xl mx-auto leading-relaxed font-sans">
            Every rupee entrusted to Mahaveer Educational &amp; Charitable Trust is governed by an honorary Board of Trustees under registered deed Clause XVI, remitted through verified banking channels, and dedicated entirely to the dignity and resilience of rural families in Western Odisha.
          </p>
        </Reveal>

        {/* Action Triggers */}
        <Reveal direction="up" delay={0.1} className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link href="/donate">
            <Button
              variant="primary"
              size="md"
              className="font-bold px-8 h-12 text-sm shadow-md bg-terracotta hover:bg-terracotta-dark text-white border-0"
            >
              <Heart className="w-4 h-4 mr-2 fill-white/20" aria-hidden="true" />
              <span>Make a Contribution (Instant 80G Receipt)</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="dark-outline"
              size="md"
              className="!border-white/35 !text-cream hover:!border-[#C4924A] hover:!bg-[#16221D]/80 px-7 h-12 text-sm font-semibold"
            >
              <Mail className="w-4 h-4 mr-2 text-[#C4924A]" aria-hidden="true" />
              <span>Contact Secretariat Desk</span>
            </Button>
          </Link>
        </Reveal>

        {/* Canonical Contact & Registered Office Plaque */}
        <Reveal direction="up" delay={0.15}>
          <div className="pt-6 border-t border-white/15 max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-5 rounded-[2px] bg-[#16221D]/90 border border-white/15 backdrop-blur-md text-xs font-sans">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#E5C499] font-mono font-bold text-[11px] uppercase tracking-wider">
                  <Phone className="w-3.5 h-3.5 text-[#C4924A]" aria-hidden="true" />
                  <span>Direct Telephony</span>
                </div>
                <p className="text-white text-sm">
                  Helpline:{" "}
                  <a
                    href={ORG.helpline.href}
                    className="font-mono font-bold text-[#E5C499] hover:text-white underline underline-offset-4"
                  >
                    {ORG.helpline.display}
                  </a>
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-cream/70">
                  <Clock className="w-3 h-3 text-[#C4924A]" aria-hidden="true" />
                  <span>Mon–Sat, 10:00–17:30 IST</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#E5C499] font-mono font-bold text-[11px] uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-[#C4924A]" aria-hidden="true" />
                  <span>Official Secretariat Email</span>
                </div>
                <p className="text-white text-sm">
                  <a
                    href={`mailto:${ORG.emails.official}`}
                    className="font-mono text-cream hover:text-[#E5C499] underline underline-offset-4"
                  >
                    {ORG.emails.official}
                  </a>
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-cream/70">
                  <ShieldCheck className="w-3 h-3 text-terracotta" aria-hidden="true" />
                  <span>Verified Accounts Inquiries</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-cream/70 font-sans">
              <MapPin className="w-3.5 h-3.5 text-[#C4924A] shrink-0" aria-hidden="true" />
              <span>Registered Office: {ORG.addresses.registered.full}</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
