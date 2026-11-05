"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import {
  ShieldCheck,
  Award,
  Building,
  Building2,
  Landmark,
  School,
  CheckCircle2,
} from "lucide-react";
import { HOMEPAGE_CONTENT } from "@/lib/homepage-content";

const ICON_MAP = {
  Landmark,
  Building,
  Building2,
  ShieldCheck,
  Award,
  School,
  CheckCircle2,
};

export function InstitutionalMarquee() {
  const endorsements = HOMEPAGE_CONTENT.standards;

  return (
    <section
      className="bg-[#07111E] border-y border-[#C5A059]/30 py-5 overflow-hidden transition-colors"
      aria-label="Institutional Standards and Public Accreditations"
    >
      <Container size="default" className="mb-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#E4C88A]">
            Statutory Accreditations & Fiduciary Standards
          </span>
          <span className="text-[11px] text-white/60 hidden sm:inline font-sans">
            Registered Public Charitable Trust (Balangir 2013) • 12A/80G & MCA CSR-1 Certified
          </span>
        </div>
      </Container>

      <div className="relative w-full overflow-hidden flex items-center">
        {/* Continuous Marquee Ribbon */}
        <div className="flex shrink-0 items-center gap-5 animate-marquee py-1.5 whitespace-nowrap">
          {endorsements.concat(endorsements).map((item, idx) => {
            const IconComponent =
              ICON_MAP[item.iconName as keyof typeof ICON_MAP] || ShieldCheck;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xs bg-[#0A192F]/80 border border-[#C5A059]/35 hover:border-[#C5A059] transition-colors shadow-xs"
              >
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#E4C88A] shrink-0">
                  <IconComponent className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block font-serif">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-white/75 block font-sans">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
