"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import { Heart, Users, Building2, ArrowRight, Sparkles } from "lucide-react";

export function CompactGetInvolvedSection() {
  const options = [
    {
      title: "Online Donation",
      tagline: "Direct Electronic Giving",
      description:
        "Support verified charitable programmes in education, livelihoods, clean water, or the proposed Hanuman Murti project. Zero intermediary commissions.",
      actionLabel: "Donate Online",
      href: "/donate",
      variant: "primary" as const,
      icon: Heart,
    },
    {
      title: "Volunteer Fellowship",
      tagline: "Share Time & Practical Skills",
      description:
        "Join our network of honorary educators, mentors, and community organizers. Contribute directly to after-school tutoring and community relief.",
      actionLabel: "Register Interest",
      href: "/volunteer",
      variant: "outline" as const,
      icon: Users,
    },
    {
      title: "Corporate CSR",
      tagline: "Schedule VII Partnerships",
      description:
        "Collaborate on turnkey CSR projects with verified project charters, milestone-based tranche disbursals, and formal Utilization Certificates.",
      actionLabel: "Explore CSR Collaboration",
      href: "/csr-partnerships",
      variant: "outline" as const,
      icon: Building2,
    },
  ];

  return (
    <section
      id="get-involved"
      aria-labelledby="get-involved-heading"
      className="py-16 sm:py-20 md:py-24 bg-cream border-b border-border-warm scroll-mt-16"
    >
      <Container size="default" className="space-y-12">
        {/* Section Header */}
        <Reveal direction="up" className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-terracotta/10 text-terracotta-dark text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Community Participation</span>
          </div>
          <h2
            id="get-involved-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight"
          >
            Get Involved With MECT
          </h2>
          <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
            Choose how you would like to participate in strengthening rural communities across Western Odisha.
          </p>
        </Reveal>

        {/* 3 Participation Cards */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.08}>
          {options.map((item, idx) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={idx}>
                <Card
                  variant="elevated"
                  className="p-7 bg-white border border-border-warm shadow-xs hover:border-terracotta/40 transition-all flex flex-col justify-between space-y-5 h-full"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-sand" aria-hidden="true" />
                      </div>
                      <span className="text-[10.5px] font-mono text-ink-sand uppercase tracking-wider font-semibold">
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

                  <div className="pt-2 border-t border-border-warm/60">
                    <Link href={item.href} className="w-full block">
                      <Button
                        variant={item.variant}
                        size="sm"
                        className="w-full justify-center text-xs font-bold"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
