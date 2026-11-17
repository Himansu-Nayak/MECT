"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import {
  GraduationCap,
  Scissors,
  Droplets,
  Utensils,
  HeartHandshake,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function CompactWorkAreasSection() {
  const workAreas = [
    {
      id: "education",
      title: "Education & Learning",
      description:
        "After-school remedial coaching hubs, board exam mentoring, and textbook distributions supporting rural students from daily-wage households.",
      href: "/programmes#education",
      icon: GraduationCap,
      tag: "Academic Enablement",
    },
    {
      id: "women-empowerment",
      title: "Women Empowerment & Livelihoods",
      description:
        "Certified vocational tailoring, pattern cutting, and craft workshops equipping rural women with skills and tooling for home-based micro-enterprises.",
      href: "/programmes#women-empowerment",
      icon: Scissors,
      tag: "Vocational Skills",
    },
    {
      id: "water",
      title: "Safe Water & Community Wellbeing",
      description:
        "Jal Seva purified drinking water kiosks and summer heatwave hydration relief deployed across transit corridors and hospital vicinities.",
      href: "/programmes#water",
      icon: Droplets,
      tag: "Public Health Action",
    },
    {
      id: "food-relief",
      title: "Food Security & Nutrition",
      description:
        "Jan Ahar subsidized community meals serving impoverished attendants caring for admitted patients at Balangir District Hospital.",
      href: "/programmes#food-relief",
      icon: Utensils,
      tag: "Civic Relief",
    },
    {
      id: "community-welfare",
      title: "Community Welfare",
      description:
        "Seasonal warm-clothing relief, disaster aid, and grassroots legal awareness sessions informing citizens of basic constitutional rights.",
      href: "/programmes#community-welfare",
      icon: HeartHandshake,
      tag: "Grassroots Care",
    },
  ];

  return (
    <section
      id="work-areas"
      aria-labelledby="work-areas-heading"
      className="py-16 sm:py-20 md:py-24 bg-sand-light/40 border-b border-border-warm scroll-mt-16"
    >
      <Container size="default" className="space-y-12">
        {/* Section Header */}
        <Reveal direction="up" className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-forest/10 text-forest text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Documented Programmes</span>
          </div>
          <h2
            id="work-areas-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight"
          >
            Our Areas of Work
          </h2>
          <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
            Five core developmental programmes addressing education, vocational independence, clean water, and humanitarian relief across Western Odisha.
          </p>
        </Reveal>

        {/* 5 Development Areas Grid */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.06}>
          {workAreas.map((area) => {
            const Icon = area.icon;
            return (
              <StaggerItem key={area.id}>
                <Card
                  variant="elevated"
                  className="p-6 bg-white border border-border-warm shadow-xs hover:border-terracotta/40 transition-all flex flex-col justify-between space-y-4 h-full group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-sand" aria-hidden="true" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta-dark font-bold bg-sand-light/80 px-2 py-0.5 rounded-2xs">
                        {area.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-forest group-hover:text-terracotta-dark transition-colors">
                      {area.title}
                    </h3>

                    <p className="text-xs text-ink-sand leading-relaxed font-sans">
                      {area.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border-warm/60">
                    <Link
                      href={area.href}
                      className="inline-flex items-center text-xs font-semibold text-terracotta-dark hover:text-forest transition-colors gap-1.5"
                    >
                      <span>Programme Details</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </div>
                </Card>
              </StaggerItem>
            );
          })}

          {/* 6th Card: Invitation to view complete programmes directory */}
          <StaggerItem>
            <div className="p-6 rounded-xs bg-forest text-white border border-sand/30 shadow-xs flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sand block font-bold">
                  Operational Directory
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Explore Full Programme Archive
                </h3>
                <p className="text-xs text-cream/80 leading-relaxed font-sans">
                  Review complete curriculum details, centre schedules, verified activity registers, and field photo records across all 5 sectors.
                </p>
              </div>

              <div className="pt-2 border-t border-white/15">
                <Link href="/programmes">
                  <Button variant="gold" size="sm" className="w-full justify-center text-xs font-bold">
                    <span>View All Programmes</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </Container>
    </section>
  );
}
