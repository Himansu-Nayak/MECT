"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
  ImageReveal,
} from "@/components/ui/MotionPrimitives";
import {
  Landmark,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Users,
  Building,
  FileCheck,
  ChevronDown,
  Calendar,
} from "lucide-react";

/**
 * MECT Phase 27 — Section 02: Institutional Story & Historical Manifesto
 *
 * Immersive upgrade with:
 * - Sequenced stagger for the 3 core fiduciary covenants
 * - ImageReveal with subtle zoom-settling for the campus photograph
 * - Interactive chronological deed milestones drawer
 */
export function InstitutionalStorySection() {
  const [showMilestones, setShowMilestones] = useState(false);

  const corePrinciples = [
    {
      number: "01",
      title: "100% Honorary Trusteeship (Clause XVI)",
      detail:
        "Under registered Trust Deed Clause XVI, every member of the Board of Trustees serves entirely pro bono — receiving zero salary, sitting fees, honoraria, or administrative per diem.",
      badge: "Statutory Deed Clause XVI",
    },
    {
      number: "02",
      title: "Direct College Fee Remittance Model",
      detail:
        "100% of educational grants are remitted directly from the Trust's verified bank account to accredited colleges and polytechnics. Funds never pass through intermediary hands or student cash disbursements.",
      badge: "Zero Intermediary Routing",
    },
    {
      number: "03",
      title: "13+ Years of Continuous Grassroots Tenure",
      detail:
        "Executed on 27 July 2013 (Registered Doc No. 40311302194 at Balangir), MECT has operated without interruption through severe heatwaves, droughts, and economic distress in Western Odisha.",
      badge: "Continuous Registered Record",
    },
  ];

  return (
    <section
      id="why-mect-exists"
      aria-labelledby="story-section-title"
      className="py-16 sm:py-20 md:py-24 bg-[#FAF7F2] border-b border-[#E7E0D5] relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-16 max-w-[1520px]">
        {/* Editorial Section Eyebrow */}
        <div className="space-y-4 max-w-3xl">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-terracotta-dark shadow-xs">
              <Landmark className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>Section 02 • Institutional Heritage &amp; Fiduciary Roots</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="story-section-title"
              className="font-serif text-[clamp(1.9rem,3.2vw,3rem)] font-bold text-ink tracking-tight leading-[1.14] [text-wrap:balance]"
            >
              Why MECT Exists: Building a Permanent Institutional Buffer in Western Odisha
            </h2>
          </Reveal>
        </div>

        {/* Large Archival Manifesto Quote */}
        <Reveal direction="up" delay={0.1}>
          <div className="p-6 sm:p-8 md:p-10 rounded-[2px] bg-white border border-[#E7E0D5] border-l-4 border-l-terracotta shadow-xs">
            <blockquote className="font-serif text-lg sm:text-xl md:text-2xl text-ink leading-relaxed italic">
              &ldquo;In the agrarian villages of Western Odisha, where drought cycles and 45°C summer heatwaves chronically destabilize daily-wage families, vulnerability rarely comes from a single misfortune. A single medical emergency or crop loss triggers debt traps that force children out of school. MECT was established on 27 July 2013 to ensure rural families have an enduring, honest institutional safety net.&rdquo;
            </blockquote>
            <div className="mt-4 pt-4 border-t border-[#E7E0D5]/70 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted font-sans">
              <span className="font-mono uppercase tracking-wider text-terracotta font-semibold">
                Balangir Registered Deed No. 40311302194
              </span>
              <span>Deed Book 4, Volume 45, Pages 32–48</span>
            </div>
          </div>
        </Reveal>

        {/* Main Narrative & Photographic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Core Fiduciary Ledger (Col 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            <Reveal direction="up" delay={0.12} className="space-y-5">
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
                Unlike entities that rely on distant fundraising intermediaries, MECT was founded by local educators, legal advocates, and community elders who live and work directly in Balangir. Every programme is governed by three non-negotiable statutory principles:
              </p>

              {/* Staggered Ledger Principles */}
              <StaggerGroup className="space-y-4 pt-2" staggerDelay={0.08}>
                {corePrinciples.map((item) => (
                  <StaggerItem key={item.number}>
                    <div className="p-5 rounded-[2px] bg-white border border-[#E7E0D5] hover:border-terracotta/50 transition-all shadow-xs group">
                      <div className="flex items-start gap-4">
                        <span className="font-mono text-base font-bold text-terracotta shrink-0 pt-0.5">
                          {item.number}
                        </span>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h3 className="font-serif text-base sm:text-lg font-bold text-ink group-hover:text-terracotta-dark transition-colors">
                              {item.title}
                            </h3>
                            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-sand/40 text-ink-secondary font-semibold">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>

              {/* Action Buttons & Interactive Milestones Trigger */}
              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                <Link href="/about">
                  <Button variant="primary" size="md" className="font-bold group bg-terracotta hover:bg-terracotta-dark text-white">
                    <span>Read Full Institutional History</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowMilestones(!showMilestones)}
                  className="px-4 py-2.5 rounded-sm border border-[#E7E0D5] text-xs font-mono font-bold text-ink hover:bg-white transition-colors flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-terracotta"
                  aria-expanded={showMilestones}
                >
                  <Calendar className="w-4 h-4 text-terracotta" />
                  <span>{showMilestones ? "Hide Deed Milestones" : "View Deed Milestones"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMilestones ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Expandable Chronological Deed Milestones */}
              {showMilestones && (
                <div className="p-4 rounded-[2px] bg-white border border-[#E7E0D5] space-y-2 text-xs font-sans animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-terracotta font-bold">
                    Official Sub-Registrar Chronology
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-ink-secondary font-mono">
                    <div className="p-2 bg-[#FAF7F2] rounded-[2px] border border-[#E7E0D5]">
                      <span className="text-ink font-bold block">27 July 2013</span>
                      <span className="text-[10px] text-ink-muted">Deed Execution by Settler Founder</span>
                    </div>
                    <div className="p-2 bg-[#FAF7F2] rounded-[2px] border border-[#E7E0D5]">
                      <span className="text-ink font-bold block">30 July 2013</span>
                      <span className="text-[10px] text-ink-muted">Official Registration (Doc 40311302194)</span>
                    </div>
                    <div className="p-2 bg-[#FAF7F2] rounded-[2px] border border-[#E7E0D5]">
                      <span className="text-ink font-bold block">Book 4, Vol 45</span>
                      <span className="text-[10px] text-ink-muted">Sub-Registrar Balangir Registry</span>
                    </div>
                  </div>
                </div>
              )}
            </Reveal>
          </div>

          {/* Right Column: Documentary Field Photograph & Docket Plaque (Col 8-12) */}
          <div className="lg:col-span-5 relative w-full">
            <Reveal direction="up" delay={0.15} className="relative group">
              <ImageReveal scaleFrom={1.03} className="rounded-[2px] border border-[#E7E0D5] shadow-md bg-[#16221D]">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/images/hero/mect-faculty-puintala-campus.webp"
                    alt="MECT faculty members and trustees gathered at the rural Puīntalā campus in Balangir"
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-28 pointer-events-none bg-gradient-to-t from-[#0D1512]/95 via-[#0D1512]/50 to-transparent"
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-cream font-sans">
                    <div className="inline-flex items-center gap-1.5 text-xs bg-[#0D1512]/90 px-2.5 py-1 rounded-[2px] border border-white/15 backdrop-blur-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#C4924A] shrink-0" aria-hidden="true" />
                      <span>Puīntalā Faculty Centre, Balangir</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#E5C499] font-semibold">
                      REGD. 2013
                    </span>
                  </div>
                </div>
              </ImageReveal>

              {/* Physical Audit Ledger Plaque */}
              <div className="mt-4 p-4 rounded-[2px] bg-white border border-[#E7E0D5] shadow-xs flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-terracotta shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs text-ink-secondary leading-snug font-sans">
                  <strong className="text-ink font-semibold">Physical Public Registry Notice:</strong> Original Trust Deed, 12A/80G orders, and annual activity ledgers are maintained at our Balangir registered office and open for inspection during statutory hours.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
