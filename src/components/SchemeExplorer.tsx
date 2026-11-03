"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  GraduationCap,
  BookOpen,
  Award,
  ArrowRight,
  ShieldCheck,
  Clock,
  Users,
  Building2,
  CheckCircle2,
} from "lucide-react";

export function SchemeExplorer() {
  const [activeTab, setActiveTab] = useState<"all" | "grants" | "stem" | "mentorship">("all");

  const initiatives = [
    {
      id: "shiksha-protsahan",
      category: "grants",
      badge: "Undergraduate Tuition Grant",
      title: "Mahavir Shiksha Protsahan Yojana",
      tagline: "Proposed Need-cum-Merit Higher Education Tuition Fee Grants",
      target: "Underprivileged undergraduate scholars across Odisha",
      criteria: "Minimum 60% aggregate in +2 / Higher Secondary; verified household annual income criteria.",
      disbursement: "100% Direct College Disbursal (Zero Cash Policy)",
      timeline: "Annual Academic Cycle (Provisional)",
      coverage: "Direct College Tuition Fees + Annual Textbook Grant",
      icon: GraduationCap,
      href: "/scholarships",
    },
    {
      id: "pratibha-fellowship",
      category: "stem",
      badge: "Competitive Exam & STEM Fellowship",
      title: "Pratibha Excellence Fellowship",
      tagline: "Proposed Entrance Test & Professional Certification Stipend",
      target: "Merit-ranked candidates preparing for national professional and graduate admissions",
      criteria: "Demonstrated academic aptitude in state/national entrance rankings and STEM disciplines.",
      disbursement: "Direct study grant toward examination fees & learning resources",
      timeline: "Quarterly Application Review (Draft Proposal)",
      coverage: "Examination Registration Fees + Specialized Learning Resources",
      icon: Award,
      href: "/scholarships",
    },
    {
      id: "samarth-learning",
      category: "mentorship",
      badge: "Community Infrastructure",
      title: "Project Samarth: Community Study Hubs",
      tagline: "Proposed Reference Study Points & High-Speed Learning Desks",
      target: "Rural and semi-urban scholars lacking quiet study spaces and exam texts",
      criteria: "Open to enrolled higher education students in pilot cluster districts.",
      disbursement: "Physical infrastructure, text archives, and supervised study halls",
      timeline: "Phase 1 Logistics & Cluster Pilot (Khordha)",
      coverage: "Supervised Study Halls, Reference Archives, Solar Powered Desks",
      icon: BookOpen,
      href: "/programmes",
    },
    {
      id: "mentorship-circle",
      category: "mentorship",
      badge: "Career Stewardship",
      title: "Academic & Career Mentorship Circle",
      tagline: "1-to-1 Guidance from University Faculty & Industry Leaders",
      target: "First-generation degree college students across Odisha",
      criteria: "Enrolled Mahavir Trust grant recipients and university partner referrals.",
      disbursement: "Structured monthly advisory sessions and mock career reviews",
      timeline: "Year-round Volunteer Cohorts",
      coverage: "1-on-1 Faculty Mentorship, Career Roadmaps, Mock Interviews",
      icon: Users,
      href: "/volunteer",
    },
  ];

  const filtered =
    activeTab === "all"
      ? initiatives
      : initiatives.filter((item) => item.category === activeTab);

  return (
    <section
      id="programs"
      className="py-20 md:py-28 bg-[#FDFBF7] border-y border-[#0B3B24]/10"
      aria-label="Institutional Initiatives and Schemes Explorer"
    >
      <Container size="default" className="space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gold">Institutional Initiatives</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B3B24] tracking-tight">
            Academic Grants & Student Support Ecosystem
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
            Explorable educational interventions designed to address critical barriers across a scholar’s journey from higher secondary completion to professional independence.
          </p>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <Button
              variant={activeTab === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("all")}
            >
              All Initiatives
            </Button>
            <Button
              variant={activeTab === "grants" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("grants")}
            >
              Tuition Fee Grants
            </Button>
            <Button
              variant={activeTab === "stem" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("stem")}
            >
              STEM Fellowships
            </Button>
            <Button
              variant={activeTab === "mentorship" ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("mentorship")}
            >
              Study Hubs & Mentorship
            </Button>
          </div>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                variant="elevated"
                className="p-8 space-y-5 bg-white border-[#0B3B24]/15 hover:border-[#C5A059] transition-all flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="gold" size="sm">
                      {item.badge}
                    </Badge>
                    <div className="w-10 h-10 rounded-xs bg-[#0B3B24] text-[#E4C88A] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#0B3B24]">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#7A5E24] mt-0.5">
                      {item.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {item.criteria}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#0B3B24]/10 text-xs text-[#1C2421]">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0B3B24] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong>Disbursement Mode:</strong> {item.disbursement}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-[#0B3B24] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong>Grant Coverage:</strong> {item.coverage}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-[#0B3B24] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong>Application Window:</strong> {item.timeline}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#0B3B24]/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#4A5568] font-medium">
                    Statewide Scheme
                  </span>
                  <Link href={item.href}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <span>View Guidelines</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
