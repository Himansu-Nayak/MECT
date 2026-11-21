"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import { isDonorPortalEnabled } from "@/config/portal";
import {
  Heart,
  Users,
  Building2,
  GraduationCap,
  PackageOpen,
  Landmark,
  ArrowRight,
  Handshake,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
} from "lucide-react";

/**
 * MECT Phase 26 — Section 09: Bespoke Participation Pathways Atelier
 *
 * Implements purposeful visual differentiation across engagement paths:
 * - Individual Donors: Prominent terracotta card with numbered donation receipt acknowledgement.
 * - Corporate CSR: Sovereign dark slate executive docket with Schedule VII audit covenants.
 * - Academic Mentors & Fellows: Literary fellowship card with safeguarding charter alignment.
 * - Institutional & Community Lanes: Clean structured engagement channels.
 */
export function TailoredParticipationPathwaysSection() {
  return (
    <section
      id="participate-in-mission"
      aria-labelledby="participate-heading"
      className="py-16 sm:py-20 md:py-24 bg-[#FAF7F2] border-b border-[#E7E0D5] scroll-mt-16 relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-16 max-w-[1520px]">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-terracotta-dark shadow-xs">
              <Handshake className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>Section 09 • Meaningful Participation Pathways</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="participate-heading"
              className="font-serif text-[clamp(1.9rem,3.2vw,3rem)] font-bold text-ink tracking-tight leading-[1.14] [text-wrap:balance]"
            >
              Participate in the Mission: Tailored Channels of Engagement
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
              Whether you are an individual donor seeking transparent community sponsorship, an academic professional offering voluntary coaching, or a corporate CSR leader structuring Schedule VII interventions, MECT provides clear, accountable collaboration pathways.
            </p>
          </Reveal>
        </div>

        {/* Tier 1: Two High-Priority Anchor Ateliers (Donors & CSR) */}
        <StaggerGroup staggerDelay={0.08} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Pathway 01: Individual Donors (Terracotta-Framed Paper Card) */}
          <StaggerItem className="lg:col-span-6 h-full flex flex-col">
            <div className="p-7 sm:p-9 bg-white rounded-[2px] border-2 border-terracotta/40 hover:border-terracotta hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E7E0D5]">
                  <span className="font-mono text-xs uppercase tracking-wider text-terracotta font-bold">
                    Pathway 01 • Individual Philanthropy
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-terracotta/10 text-terracotta-dark font-semibold">
                    Verified Public Trust
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-terracotta text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Heart className="w-6 h-6 fill-white/20" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                      Direct Giving &amp; Tuition Fee Sponsorship
                    </h3>
                    <p className="text-xs text-ink-secondary font-sans mt-0.5">
                      100% of educational donations remit directly to accredited colleges with zero commission.
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                  Support first-generation college grants, summer heatstroke water points, or the Hanuman Murti cultural project. Every donation generates an official computer-signed receipt with verified Trust PAN (AADTM5474F) and registered public trust credentials.
                </p>

                <div className="space-y-2 pt-1 text-xs text-ink-secondary font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0" />
                    <span>Official Donation Receipt & Payment Acknowledgement PDF.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0" />
                    <span>Direct State Bank of India Bank Transfer (NEFT/RTGS) &amp; Official UPI.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7E0D5] flex flex-wrap items-center gap-3">
                <Link href="/donate">
                  <Button variant="primary" size="md" className="w-full sm:w-auto font-bold bg-terracotta hover:bg-terracotta-dark text-white">
                    <Heart className="w-4 h-4 mr-2 fill-white/20" />
                    <span>Donate Direct via Bank / UPI</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                {isDonorPortalEnabled() && (
                  <Link
                    href="/login?next=/portal/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-forest hover:text-terracotta-dark hover:bg-sand/30 rounded-xs border border-forest/20 transition-colors"
                  >
                    <span>Donor Portal &amp; Receipts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </StaggerItem>

          {/* Pathway 02: Corporate CSR Partners (Executive Dark Slate Docket) */}
          <StaggerItem className="lg:col-span-6 h-full flex flex-col">
            <div className="p-7 sm:p-9 bg-[#0F1714] text-white rounded-[2px] border border-white/20 hover:border-[#C4924A]/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/15">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#C4924A] font-bold">
                    Pathway 02 • Corporate Social Responsibility
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#C4924A]/20 text-[#E5C499] border border-[#C4924A]/40 font-semibold">
                    MCA CSR-1 CSR00081063
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#16221D] border border-[#C4924A]/50 text-[#C4924A] flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-[#C4924A]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      Schedule VII Turnkey CSR Partnerships
                    </h3>
                    <p className="text-xs text-cream/80 font-sans mt-0.5">
                      Co-designed impact projects across Balangir and Western Odisha with audited milestone covenants.
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-cream/90 leading-relaxed font-sans">
                  MECT partners with public and private sector enterprises under Section 135 of the Companies Act, 2013. We execute structured education, women&apos;s tailoring, and drinking water interventions backed by quarterly progress telemetry and formal Chartered Accountant Utilization Certificates.
                </p>

                <div className="space-y-2 pt-1 text-xs text-cream/80 font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C4924A] shrink-0" />
                    <span>Tranche-based disbursals against audited milestone delivery.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C4924A] shrink-0" />
                    <span>Comprehensive third-party impact assessment &amp; board reports.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15">
                <Link href="/csr-partnerships">
                  <Button variant="primary" size="md" className="w-full sm:w-auto font-bold bg-[#C4924A] hover:bg-[#A87B39] text-[#0D1512] border-0">
                    <span>Explore CSR Framework &amp; Dossier</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </StaggerItem>
        </StaggerGroup>

        {/* Tier 2: Four Specialized Institutional & Field Lanes */}
        <StaggerGroup staggerDelay={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Lane 03: Academic Mentors & Fellows */}
          <StaggerItem className="h-full flex flex-col">
            <div className="p-6 bg-white rounded-[2px] border border-[#E7E0D5] hover:border-terracotta/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E7E0D5] flex items-center justify-center text-terracotta">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-ink">
                  Academic Mentors &amp; Volunteers
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                  Teach high school mathematics, science, or English at rural study hubs under our Child Safeguarding charter.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E7E0D5]">
                <Link href="/volunteer" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-terracotta hover:text-terracotta-dark">
                  <span>Apply for Fellowship</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </StaggerItem>

          {/* Lane 04: Accredited Educational Institutions */}
          <StaggerItem className="h-full flex flex-col">
            <div className="p-6 bg-white rounded-[2px] border border-[#E7E0D5] hover:border-terracotta/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E7E0D5] flex items-center justify-center text-terracotta">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-ink">
                  Educational Institutions
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                  Degree colleges and polytechnics partnering to identify deserving students and receive direct institutional fee remittances.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E7E0D5]">
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-terracotta hover:text-terracotta-dark">
                  <span>Institutional Liaison</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </StaggerItem>

          {/* Lane 05: Community In-Kind Logistics */}
          <StaggerItem className="h-full flex flex-col">
            <div className="p-6 bg-white rounded-[2px] border border-[#E7E0D5] hover:border-terracotta/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E7E0D5] flex items-center justify-center text-terracotta">
                  <PackageOpen className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-ink">
                  Community In-Kind Supplies
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                  Donate competitive exam books, sewing machines for vocational training, or facilitate village study spaces in rural blocks.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E7E0D5]">
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-terracotta hover:text-terracotta-dark">
                  <span>In-Kind Coordination</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </StaggerItem>

          {/* Lane 06: Statutory & Civil Society Collaborators */}
          <StaggerItem className="h-full flex flex-col">
            <div className="p-6 bg-white rounded-[2px] border border-[#E7E0D5] hover:border-terracotta/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E7E0D5] flex items-center justify-center text-terracotta">
                  <Landmark className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-ink">
                  Civil Society &amp; District Agencies
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                  District authorities, legal aid networks, and grassroots NGOs collaborating on emergency relief and citizen rights camps.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E7E0D5]">
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-terracotta hover:text-terracotta-dark">
                  <span>Secretariat Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </Container>
    </section>
  );
}
