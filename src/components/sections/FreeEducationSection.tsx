import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
  CountUpStat,
  MOTION_STAGGER,
} from "@/components/ui/MotionPrimitives";
import { HOMEPAGE_CONTENT } from "@/lib/homepage-content";
import { FreeEducationDotGrid } from "@/components/motion/FreeEducationDotGrid";
import {
  GraduationCap,
  BookOpen,
  Compass,
  Users,
  Heart,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const PILLAR_ICONS = [GraduationCap, BookOpen, Compass];

export function FreeEducationSection() {
  const data = HOMEPAGE_CONTENT.freeEducation200;

  return (
    <section
      id="free-education-200"
      className="py-16 sm:py-20 md:py-28 bg-cream border-b border-border-warm scroll-mt-32"
      aria-labelledby="free-education-heading"
    >
      <Container size="default">
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Narrative & Programme Structure */}
            <Reveal direction="left" className="lg:col-span-7 space-y-6">
              <div className="space-y-3.5">
                <Badge variant="contrast-gold" size="md">
                  {data.badge}
                </Badge>
                <h2
                  id="free-education-heading"
                  className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-forest tracking-tight leading-[1.12]"
                >
                  FREE EDUCATION FOR{" "}
                  <span className="inline-flex items-baseline px-3 py-0.5 rounded-xs bg-terracotta text-white border border-terracotta-dark tabular-nums shadow-xs">
                    <CountUpStat value={String(data.targetCount)} />
                  </span>{" "}
                  STUDENTS
                </h2>
                <p className="font-serif text-base sm:text-lg font-bold tracking-[0.06em] text-terracotta-dark uppercase border-l-2 border-terracotta pl-3">
                  {data.supportingHeadline}
                </p>
                <p className="text-sm sm:text-base font-medium text-forest font-sans">
                  {data.supportingStatement}
                </p>
              </div>

              <p className="text-sm sm:text-base text-ink leading-relaxed font-sans max-w-2xl">
                {data.objective}
              </p>

              {/* Support Details Grid */}
              <StaggerGroup staggerDelay={MOTION_STAGGER.cards} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {data.supportPillars.map((pillar, idx) => {
                  const Icon = PILLAR_ICONS[idx] || BookOpen;
                  return (
                    <StaggerItem key={pillar.title}>
                      <Card
                        variant="default"
                        className="h-full p-4 sm:p-5 bg-white border-border-warm border-t-2 border-t-terracotta shadow-xs space-y-2.5 hover:border-terracotta transition-colors flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="w-9 h-9 rounded-xs bg-terracotta text-white flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" aria-hidden="true" />
                          </div>
                          <h3 className="font-serif text-sm sm:text-base font-bold text-forest leading-snug">
                            {pillar.title}
                          </h3>
                          <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                            {pillar.detail}
                          </p>
                        </div>
                      </Card>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>

              {/* Verified Beneficiary & Fundraising Context */}
              <div className="p-5 rounded-xs bg-sand-light border-l-4 border-terracotta space-y-2.5 text-xs font-sans">
                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-ink leading-relaxed">
                    <strong className="text-forest">Intended Beneficiaries:</strong>{" "}
                    {data.beneficiaryScope}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-ink leading-relaxed">
                    <strong className="text-forest">Fundraising Purpose:</strong>{" "}
                    {data.fundraisingPurpose}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link href="/donate?programme=EDUCATION_LEARNING">
                  <Button variant="primary" size="lg" className="font-bold shadow-md">
                    <Heart className="w-4 h-4 mr-2 fill-current" aria-hidden="true" />
                    <span>Donate for Education</span>
                  </Button>
                </Link>
                <Link href="/programmes#free-education-200">
                  <Button variant="outline" size="lg" className="font-semibold bg-white/70">
                    <span>View Programme Scope</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </Reveal>

            {/* Right Highlight Visual Panel (Non-Photographic Safeguarding-Compliant Composition) */}
            <Reveal direction="right" delay={0.08} className="lg:col-span-5">
              <div className="bg-forest text-cream rounded-xs border-2 border-sand/50 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                <div className="relative flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white font-sans">
                    MECT Education Initiative
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-terracotta text-white border border-sand/40 rounded-xs">
                    Target Cohort Capacity
                  </span>
                </div>

                <div className="relative py-5 text-center space-y-2 bg-forest-deep rounded-xs border border-sand/35 p-6 shadow-inner">
                  <span className="block font-serif text-6xl sm:text-7xl font-bold text-white tracking-tight leading-none tabular-nums">
                    200
                  </span>
                  <div className="w-10 h-0.5 bg-sand mx-auto my-2" aria-hidden="true" />
                  <span className="block text-sm sm:text-base font-bold uppercase tracking-widest text-sand pt-0.5 font-sans">
                    Target Students Capacity
                  </span>
                  <p className="text-xs text-cream/95 max-w-xs mx-auto font-sans leading-relaxed pt-1">
                    Planned phased delivery of remedial instruction, textbooks, study materials, and tuition relief.
                  </p>
                </div>

                <div className="relative space-y-3 text-xs font-sans">
                  <div className="p-3.5 rounded-xs bg-forest-deep border border-white/15 flex items-center justify-between gap-2">
                    <span className="text-cream/90">Programme Status</span>
                    <span className="font-bold text-sand text-right">Approved Priority Initiative</span>
                  </div>
                  <div className="p-3.5 rounded-xs bg-forest-deep border border-white/15 flex items-center justify-between gap-2">
                    <span className="text-cream/90">Application Cost</span>
                    <span className="font-bold text-white text-right">Zero Fees Charged (₹0)</span>
                  </div>
                  <div className="p-3.5 rounded-xs bg-forest-deep border border-white/15 flex items-center justify-between gap-2">
                    <span className="text-cream/90">Donation Bank Channel</span>
                    <span className="font-bold text-sand text-right">State Bank of India</span>
                  </div>
                </div>

                <div className="relative pt-2 flex items-start gap-2.5 text-[11px] text-cream/95 font-sans">
                  <ShieldCheck className="w-4 h-4 text-sand shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="leading-relaxed">
                    Student enrolment and distribution logs are maintained directly at the Balangir Trust Office without intermediaries. Cohort intake proceeds strictly in line with available verified funding.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 20x10 Cohort Dot Grid (Anime.js stagger) */}
          <FreeEducationDotGrid />

          {/* Structured 6-Point Programme Framework (Operational & Accountability Details) */}
          <Reveal direction="fade" tone="slow">
            <div className="bg-white rounded-xs border border-border-warm p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-warm pb-3.5">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-forest">
                Programme Structure, Eligibility &amp; Accountability Specifications
              </h3>
              <span className="text-xs font-semibold text-terracotta-dark font-sans">
                Phased target intake • Zero application fees
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {data.specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="p-4 rounded-xs bg-cream/65 border border-border-warm space-y-1.5"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest block font-sans">
                    {spec.label}
                  </span>
                  <p className="text-xs text-ink leading-relaxed font-sans">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
