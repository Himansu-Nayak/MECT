import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TRUST_CONFIG } from "@/lib/config";
import {
  GraduationCap,
  Award,
  School,
  Users,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sun,
  Wifi,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Educational & Community Programmes — MAHAVIR TRUST",
  description:
    "Comprehensive overview of higher education grants, Pratibha STEM fellowships, and Project Samarth community study hubs in Odisha.",
};

export default function ProgrammesPage() {
  const flagshipPrograms = [
    {
      id: "shiksha-protsahan",
      number: "01",
      badge: "Flagship Tuition Grant",
      name: "Mahavir Shiksha Protsahan Yojana",
      tagline: "Proposed Need-cum-Merit Higher Education Tuition Fee Subsidies",
      overview:
        "The cornerstone initiative of MAHAVIR TRUST. This programme directly reimburses approved undergraduate college tuition fees on behalf of meritorious students from economically distressed families across Odisha.",
      objectives: [
        "Prevent academic dropouts after Higher Secondary (+2) education due to admission fee constraints",
        "Enable first-generation scholars to complete 3-year and 4-year degree programs with full institutional dignity",
        "Maintain 100% direct-to-college bank transfers (RTGS) to eliminate cash intermediaries",
      ],
      beneficiaries:
        "Deserving students enrolled in accredited B.Sc, B.Com, B.A, and technical polytechnic colleges across Odisha whose household income falls below ₹2.5 Lakhs annually.",
      coverage: "Direct college tuition fees + annual textbook resource allowance",
      scope: "Statewide across all 30 districts of Odisha (Phased rollout starting in Khordha & Cuttack)",
      icon: GraduationCap,
      href: "/scholarships",
    },
    {
      id: "pratibha-fellowship",
      number: "02",
      badge: "Competitive Exam & STEM Grant",
      name: "Pratibha Excellence Fellowship",
      tagline: "Proposed Entrance Test & Professional Certification Support",
      overview:
        "Designed to propel high-aptitude scholars into premier technical institutions and public administration. This fellowship subsidizes exam registration fees, specialized technical textbooks, and expert coaching access.",
      objectives: [
        "Eliminate financial barriers preventing top rural performers from taking national competitive entrance tests (GATE, CAT, Banking, OPSC, Civil Services)",
        "Provide curated technical reference literature and mock evaluation rubrics",
        "Pair fellows with subject matter mentors and senior academic practitioners",
      ],
      beneficiaries:
        "Merit-ranked students in final year degree or technical courses demonstrating strong aptitude in STEM, commerce, or administrative studies.",
      coverage: "Examination registration subsidies + standard reference text sets + 1-on-1 mentor pairing",
      scope: "Statewide merit selection based on transparent entrance score benchmarks",
      icon: Award,
      href: "/scholarships",
    },
    {
      id: "samarth-learning",
      number: "03",
      badge: "Community Infrastructure",
      name: "Project Samarth: Community Study Hubs",
      tagline: "Proposed Reference Study Points & High-Speed Learning Desks",
      overview:
        "Many promising students in Odisha share single-room homes lacking quiet study spaces, reliable electricity, or expensive competitive exam books. Project Samarth deploys solar-powered study centers in cluster localities.",
      objectives: [
        "Establish peaceful, well-lit, solar-backed study spaces operating 7 days a week",
        "Provide shared archives of expensive engineering, medical, and civil services reference texts",
        "Facilitate digital learning with high-speed internet access points for university lectures",
      ],
      beneficiaries:
        "All enrolled higher education students in pilot cluster districts who need dedicated study environments.",
      coverage: "Supervised study hall access, reference book archives, solar desks & high-speed Wi-Fi",
      scope: "Phase 1 Logistics & Cluster Pilot in Bhubaneswar/Khordha",
      icon: BookOpen,
      href: "/contact",
    },
  ];

  const hubSpecs = [
    {
      title: "Solar-Backed Power Continuity",
      description: "Equipped with dedicated solar inverter units ensuring uninterrupted lighting and charging during rural grid outages.",
      icon: Sun,
    },
    {
      title: "High-Speed Academic Wi-Fi",
      description: "Secured, filtered high-speed internet connectivity for streaming university lectures, NPTEL modules, and digital mock tests.",
      icon: Wifi,
    },
    {
      title: "Competitive Reference Archives",
      description: "Physical collections of updated UPSC, OPSC, GATE, banking, and degree syllabus textbooks available for quiet reference.",
      icon: BookOpen,
    },
    {
      title: "Volunteer Mentor Desk",
      description: "Bi-weekly scheduled advisory hours where visiting professors and professionals conduct doubt-clearing and career guidance.",
      icon: Users,
    },
  ];

  const districtPhases = [
    {
      phase: "Phase 1: Pilot Cluster",
      region: "Central Educational Corridor",
      districts: "Khordha (Bhubaneswar) & Cuttack",
      focus: "Establishing college bursar verification protocols and proof-of-concept Project Samarth study hub.",
      status: "Framework Active",
    },
    {
      phase: "Phase 2: Coastal & Industrial",
      region: "Eastern & Central Odisha",
      districts: "Puri, Jagatsinghpur, Balasore, Bhadrak, Dhenkanal, Angul",
      focus: "Expanding tuition fee support across government-aided degree colleges and polytechnics.",
      status: "Cluster Outreach Planned",
    },
    {
      phase: "Phase 3: Western & Southern",
      region: "Southern, Western & Tribal Belts",
      districts: "Sambalpur, Koraput, Kalahandi, Bolangir, Mayurbhanj, Sundargarh",
      focus: "Partnering with regional universities to reach rural first-generation degree seekers.",
      status: "Long-Term Mandate",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Programmatic Portfolio"
        title="Educational Initiatives & Learning Infrastructure"
        description="Explore the full spectrum of higher education tuition fee grants, STEM fellowships, and community study hubs designed to uplift students across Odisha."
        breadcrumbs={[{ label: "Programmes" }]}
        actions={
          <>
            <Link href="#flagship">
              <Button variant="gold" size="sm">
                <span>Flagship Initiatives</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="#hubs">
              <Button variant="dark-outline" size="sm">
                <span>Project Samarth Hubs</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Three Flagship Initiatives in Depth */}
      <section id="flagship" className="py-20 md:py-28 bg-[#FDFBF7]">
        <Container size="default" className="space-y-16">
          <SectionHeader
            badge="Core Interventions"
            badgeVariant="forest"
            title="Three Flagship Initiatives"
            subtitle="Every initiative addresses a verified structural barrier across an underprivileged student’s educational trajectory."
            align="center"
          />

          <div className="space-y-12">
            {flagshipPrograms.map((program) => {
              const Icon = program.icon;
              return (
                <Card
                  key={program.id}
                  variant="elevated"
                  padding="lg"
                  className="space-y-6 relative overflow-hidden"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#0B3B24]/10 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-3xl font-bold text-[#7A5E24]">
                        {program.number}
                      </span>
                      <Badge variant="contrast-gold">
                        {program.badge}
                      </Badge>
                    </div>
                    <Badge variant="neutral">
                      {program.scope}
                    </Badge>
                  </div>

                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xs bg-[#0B3B24] text-[#E4C88A] flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B3B24]">
                        {program.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#7A5E24] font-semibold mt-1">
                        {program.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#4A5568] leading-relaxed">
                    {program.overview}
                  </p>

                  {/* Objectives & Beneficiaries Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="p-5 bg-[#FDFBF7] rounded-xs border border-[#0B3B24]/10 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0B3B24] block">
                        Key Strategic Objectives
                      </span>
                      <ul className="space-y-2 text-xs text-[#4A5568]">
                        {program.objectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 bg-[#FDFBF7] rounded-xs border border-[#0B3B24]/10 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0B3B24] block">
                        Target Beneficiaries & Coverage
                      </span>
                      <p className="text-xs text-[#4A5568] leading-relaxed">
                        <strong className="text-[#0B3B24]">Target Cohort:</strong> {program.beneficiaries}
                      </p>
                      <p className="text-xs text-[#4A5568] leading-relaxed pt-2 border-t border-[#0B3B24]/10">
                        <strong className="text-[#0B3B24]">Grant Benefit:</strong>{" "}
                        <span className="text-[#0B3B24] font-semibold">{program.coverage}</span>
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#0B3B24]/10">
                    <span className="text-xs text-[#4A5568] italic flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      Zero processing fee • 100% direct-to-college disbursals
                    </span>
                    <Link href={program.href}>
                      <Button variant="primary" size="sm">
                        <span>View Scheme Guidelines</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Project Samarth: Community Study Hubs Blueprint */}
      <section
        id="hubs"
        className="py-20 md:py-28 bg-[#072617] text-[#EDE6D8] border-y border-[#C5A059]/25 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <Container size="default" className="relative space-y-14">
          <SectionHeader
            badge={
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-[#0B3B24] border border-[#C5A059]/40 text-xs text-[#E4C88A] uppercase font-bold tracking-wider">
                <School className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Community Learning Infrastructure</span>
              </div>
            }
            title="Project Samarth: Community Study Hubs"
            subtitle="Bridging the study environment divide. Deploying quiet, solar-backed reference reading rooms across semi-urban and rural clusters in Odisha."
            align="center"
            theme="dark"
          />

          {/* Hub Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hubSpecs.map((spec) => {
              const Icon = spec.icon;
              return (
                <Card
                  key={spec.title}
                  variant="dark"
                  padding="md"
                  className="space-y-3 hover:border-[#C5A059]/40 transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-xs bg-[#0B3B24] border border-[#C5A059]/40 text-[#E4C88A] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-white">
                    {spec.title}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    {spec.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Community Hub Steward Notice */}
          <div className="bg-[#0B3B24]/90 border border-[#C5A059]/40 rounded-xs p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E4C88A]">
                Volunteer Stewardship
              </span>
              <h4 className="font-serif text-xl font-bold text-white">
                Interested in Stewarding a Local Learning Hub?
              </h4>
              <p className="text-xs text-white/75 max-w-xl">
                Educators and community centers can collaborate with the Secretariat to coordinate local book collections and supervised study hours.
              </p>
            </div>
            <Link href="/volunteer" className="shrink-0">
              <Button variant="gold" size="md">
                <span>Register as a Hub Steward</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 4. Statewide District Outreach & Phased Rollout */}
      <section className="py-20 md:py-28 bg-[#F4EFE6] border-b border-[#0B3B24]/10">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Statewide Vision"
            badgeVariant="gold"
            title="Odisha 30-District Engagement Strategy"
            subtitle="A disciplined, phased rollout ensuring institutional durability, transparent college partnerships, and audit compliance."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {districtPhases.map((phase) => (
              <Card
                key={phase.phase}
                variant="elevated"
                padding="lg"
                className="space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#0B3B24]/10">
                    <Badge variant="contrast-gold">
                      {phase.phase}
                    </Badge>
                    <Badge variant="neutral">
                      {phase.status}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0B3B24]">
                    {phase.districts}
                  </h3>
                  <p className="text-xs text-[#7A5E24] font-semibold">
                    Region: {phase.region}
                  </p>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {phase.focus}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
