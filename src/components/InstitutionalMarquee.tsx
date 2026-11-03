"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import {
  ShieldCheck,
  Award,
  Building,
  Landmark,
  School,
  CheckCircle2,
} from "lucide-react";

export function InstitutionalMarquee() {
  const endorsements = [
    {
      title: "Statewide Scope",
      subtitle: "30 Districts of Odisha",
      icon: Landmark,
    },
    {
      title: "Direct Disbursement",
      subtitle: "Accredited Institutions",
      icon: Building,
    },
    {
      title: "Statutory Standards",
      subtitle: "Sec. 12A & 80G Compliant Framework",
      icon: ShieldCheck,
    },
    {
      title: "Need-Cum-Merit",
      subtitle: "Auditable Grant Appraisal",
      icon: Award,
    },
    {
      title: "College Liaison",
      subtitle: "Higher Secondary & Degree Hubs",
      icon: School,
    },
    {
      title: "Zero Intermediaries",
      subtitle: "Direct-to-College Account Policy",
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      className="bg-[#051E12] border-y border-[#C5A059]/25 py-6 overflow-hidden"
      aria-label="Institutional Standards and Public Guarantees"
    >
      <Container size="default" className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#E4C88A]">
            Institutional Standards & Public Guarantees
          </span>
          <span className="text-[11px] text-white/50 hidden sm:inline">
            Chartered Philanthropic Framework for Higher Education in Odisha
          </span>
        </div>
      </Container>

      <div className="relative w-full overflow-hidden flex items-center">
        {/* Continuous Marquee Ribbon */}
        <div className="flex shrink-0 items-center gap-6 animate-marquee py-2 whitespace-nowrap">
          {endorsements.concat(endorsements).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xs bg-[#0B3B24]/60 border border-[#C5A059]/30 hover:border-[#C5A059] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#E4C88A] shrink-0">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block font-serif">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-white/70 block">
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
