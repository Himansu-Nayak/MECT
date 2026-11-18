"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import {
  Heart,
  Users,
  Building2,
  GraduationCap,
  PackageOpen,
  Landmark,
  ArrowRight,
  Handshake,
} from "lucide-react";

export function TailoredParticipationPathwaysSection() {
  const pathways = [
    {
      title: "Individual Donors",
      tagline: "Direct Giving with 80G Receipting",
      description:
        "Support verified educational tuition fee grants, summer Jal Seva water points, or the Hanuman Murti cultural project with zero intermediary commissions.",
      actionLabel: "Donate Online",
      href: "/donate",
      variant: "primary" as const,
      icon: Heart,
    },
    {
      title: "Volunteers & Mentors",
      tagline: "Academic Fellowship & Field Service",
      description:
        "Share subject-matter expertise, conduct doubt-clearing sessions at rural study hubs, or assist seasonal relief distribution under our child safeguarding charter.",
      actionLabel: "Register for Fellowship",
      href: "/volunteer",
      variant: "outline" as const,
      icon: Users,
    },
    {
      title: "Corporate CSR Partners",
      tagline: "MCA CSR-1 Schedule VII Collaboration",
      description:
        "Turnkey social development projects in Western Odisha with structured project charters, milestone-based tranche disbursals, and formal Utilization Certificates.",
      actionLabel: "Explore CSR Partnerships",
      href: "/csr-partnerships",
      variant: "outline" as const,
      icon: Building2,
    },
    {
      title: "Educational Institutions",
      tagline: "Direct College Disbursal Model",
      description:
        "Accredited universities, degree colleges, and polytechnics partnering to identify deserving first-generation students and receive direct institutional fee remittances.",
      actionLabel: "Institutional Liaison",
      href: "/contact",
      variant: "outline" as const,
      icon: GraduationCap,
    },
    {
      title: "Community Supporters",
      tagline: "In-Kind Relief & Study Spaces",
      description:
        "Facilitate village study spaces, donate competitive examination books, or provide sewing machines for vocational training cohorts in rural Balangir.",
      actionLabel: "In-Kind Coordination",
      href: "/contact",
      variant: "outline" as const,
      icon: PackageOpen,
    },
    {
      title: "Institutional Collaborators",
      tagline: "Statutory & Civic Alignment",
      description:
        "District authorities, civil society networks, and legal aid clinics collaborating on civic awareness, emergency relief, and citizen entitlement access.",
      actionLabel: "Connect with Secretariat",
      href: "/contact",
      variant: "outline" as const,
      icon: Landmark,
    },
  ];

  return (
    <section
      id="participate-in-mission"
      aria-labelledby="participate-heading"
      className="py-16 sm:py-20 md:py-24 bg-cream border-b border-border-warm scroll-mt-16 relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-14">
        {/* Editorial Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-terracotta/30 bg-terracotta/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-terracotta-dark font-sans shadow-2xs">
              <Handshake className="w-3.5 h-3.5 text-terracotta-dark shrink-0" aria-hidden="true" />
              <span>Section 09 • Participate in the Mission</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="participate-heading"
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight [text-wrap:balance]"
            >
              Six Pathways to Meaningful Institutional Participation
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-sm sm:text-base text-ink leading-relaxed font-sans">
              Strengthening rural communities requires multi-stakeholder participation. Whether as an individual donor, an academic mentor, a corporate CSR decision-maker, or an accredited educational institution, there is a clear, transparent role for your involvement.
            </p>
          </Reveal>
        </div>

        {/* 6 Tailored Pathways Grid */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.07}>
          {pathways.map((item, idx) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={idx}>
                <div className="p-7 bg-white rounded-xs border border-border-warm shadow-xs hover:border-terracotta/40 transition-all flex flex-col justify-between space-y-5 h-full group">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-sand" aria-hidden="true" />
                      </div>
                      <span className="text-[10px] font-mono text-terracotta-dark font-bold uppercase tracking-wider">
                        {item.tagline}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-forest">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-[13px] text-ink-sand leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border-warm/70">
                    <Link href={item.href} className="w-full block">
                      <Button
                        variant={item.variant}
                        size="sm"
                        className="w-full justify-between font-bold"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
