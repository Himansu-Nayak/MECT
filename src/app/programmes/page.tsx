import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
  Scissors,
  Droplets,
  Utensils,
  Heart,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Civic Programmes & Educational Initiatives — MECT Odisha",
  description:
    "Explore the 4 core programmatic pillars of Mahaveer Educational & Charitable Trust (MECT): Remedial Rural Education, Women's Vocational Tailoring, Jal Seva Drinking Water, and Jan Ahar Hospital Food Relief.",
};

export default function ProgrammesPage() {
  const verifiedPillars = [
    {
      id: "education",
      number: "01",
      badge: "Grassroots Pillar",
      tag: "Shiksha Setu",
      name: "Remedial Rural Education & Coaching Centres",
      tagline: "Bridging Secondary Dropout Gaps for Underprivileged & Tribal Students in Balangir",
      overview:
        "Since 2014, MECT has operated free after-school remedial coaching centres across rural Balangir and Puintala blocks. These centres provide scholastic reinforcement, textbook sets, and entrance exam preparation for students from economically weaker sections, SC/ST communities, and daily-wage households.",
      metrics: [
        { label: "Active Students Coached", value: "350+ Annually" },
        { label: "Key Operating Blocks", value: "Balangir & Puintala" },
        { label: "Scholastic Focus", value: "Class 8–10 & +2 Science/Arts" },
        { label: "Zero Cost Guarantee", value: "100% Free Tuition & Books" },
      ],
      objectives: [
        "Prevent academic dropouts at the critical secondary to higher-secondary transition",
        "Provide certified volunteer educators for mathematics, science, and English coaching",
        "Distribute free annual sets of textbooks, notebooks, and reference materials",
        "Conduct competitive entrance counseling for polytechnics, ITIs, and degree colleges",
      ],
      icon: GraduationCap,
      accentColor: "border-[#C5A059]",
    },
    {
      id: "women-empowerment",
      number: "02",
      badge: "Vocational Livelihood",
      tag: "Swavalamban",
      name: "Women's Vocational Tailoring & Livelihood Training",
      tagline: "Empowering Rural Women Toward Financial Self-Reliance & Entrepreneurship",
      overview:
        "Operating out of our Balangir training center, MECT provides intensive 6-month certified vocational training courses in modern tailoring, garment cutting, embroidery, and craft fabrication for rural women, young widows, and Self-Help Group (SHG) members.",
      metrics: [
        { label: "Graduated Artisans", value: "120+ Rural Women" },
        { label: "Course Duration", value: "6 Months Intensive" },
        { label: "Tooling Support", value: "Sewing Machine Toolkits" },
        { label: "Livelihood Outcome", value: "Independent Income & Micro-SHGs" },
      ],
      objectives: [
        "Provide professional technical instruction in apparel stitching and pattern cutting",
        "Empower rural women to establish village tailoring micro-enterprises and generate steady monthly income",
        "Facilitate cooperative bulk order sewing for local school uniforms and community textiles",
        "Deliver financial literacy, micro-banking, and digital payment awareness",
      ],
      icon: Scissors,
      accentColor: "border-[#D97706]",
    },
    {
      id: "water",
      number: "03",
      badge: "Clean Water & Sanitation",
      tag: "Jal & Arogya",
      name: "Jal Seva: Clean Drinking Water & Summer Hydration",
      tagline: "Life-Saving Drinking Water Infrastructure During Severe Summer Heatwaves",
      overview:
        "Western Odisha experiences extreme summer heatwaves exceeding 45°C. MECT deploys annual summer Jal Seva drinking water kiosks at major rural transit intersections, bus stands, and hospital premises in Balangir, providing cold, purified water to tens of thousands of citizens.",
      metrics: [
        { label: "Citizens Served", value: "10,000+ Beneficiaries" },
        { label: "Summer Kiosks", value: "Multiple High-Footfall Points" },
        { label: "Water Quality", value: "Hygienically Filtered Water" },
        { label: "Public Health", value: "Heatstroke Prevention & ORS Kits" },
      ],
      objectives: [
        "Prevent severe dehydration, heat exhaustion, and heatstroke among outdoor manual laborers",
        "Maintain clean, earthen-pot and water-cooler distribution points with daily sanitary maintenance",
        "Provide electrolyte and ORS packets to vulnerable elderly commuters and rural patients",
        "Conduct village water-sanitation awareness drives on waterborne disease prevention",
      ],
      icon: Droplets,
      accentColor: "border-[#1E3A8A]",
    },
    {
      id: "hunger-relief",
      number: "04",
      badge: "Destitute Food Relief",
      tag: "Annadaan",
      name: "Jan Ahar: Hospital Food Relief & Destitute Nutrition",
      tagline: "Nutritious Meals for Impoverished Patients, Hospital Attendants & Destitute Citizens",
      overview:
        "Hundreds of rural families traveling to Balangir District Headquarters Hospital for medical treatment exhaust their meager savings on travel and medicines, leaving attendants without food. MECT operates compassionate Jan Ahar meal drives providing fresh, wholesome cooked food.",
      metrics: [
        { label: "Location", value: "Balangir District Hospital Vicinity" },
        { label: "Beneficiaries", value: "Patient Attendants & Wage Earners" },
        { label: "Meal Quality", value: "Fresh, Hot, Hygienic Thali" },
        { label: "Ethos", value: "Universal Dignity • No Intermediaries" },
      ],
      objectives: [
        "Relieve hunger for rural families tending to hospitalized kin far from their native villages",
        "Distribute fresh rice, dal, and vegetable curry prepared in sanitary, monitored kitchens",
        "Partner with local civic volunteers to identify destitute elders and disabled individuals",
        "Provide emergency dry ration kits during seasonal disruptions and local emergencies",
      ],
      icon: Utensils,
      accentColor: "border-[#991B1B]",
    },
  ];

  const futureExpansion = [
    {
      title: "Statewide Higher Education Tuition Grants",
      scope: "Undergraduate & Polytechnic Scholars Across Odisha",
      description:
        "Direct-to-college bank transfers (RTGS) covering verified tuition fees for economically challenged merit scholars enrolled in B.Sc, B.Com, B.A, and engineering polytechnics.",
      icon: School,
    },
    {
      title: "Project Samarth Community Learning Hubs",
      scope: "Balangir & Bhubaneswar Reference Centres",
      description:
        "Solar-backed study libraries equipped with high-yield competitive exam books (UPSC, OPSC, GATE, Banking), high-speed Wi-Fi, and 1-on-1 faculty mentorship desks.",
      icon: BookOpen,
    },
    {
      title: "Corporate CSR Turnkey Implementation",
      scope: "Schedule VII Compliant Partnerships",
      description:
        "Customized corporate CSR collaborations backed by MCA CSR-1 registration (CSR00081063), independent CA auditing, and verifiable impact reporting.",
      icon: Briefcase,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="12+ Years of Civic Action • Est. 2013"
        title="Civic Programmes, Rural Skilling & Educational Upliftment"
        description="Explore the four verified programmatic pillars of Mahaveer Educational & Charitable Trust (MECT) spanning remedial education, women's tailoring livelihoods, clean drinking water relief, and hospital nutrition."
        breadcrumbs={[{ label: "Programmes" }]}
        actions={
          <>
            <Link href="#pillars">
              <Button variant="gold" size="sm">
                <span>The Four Pillars</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="dark-outline" size="sm">
                <Heart className="w-3.5 h-3.5 mr-1 text-[#E4C88A]" />
                <span>Support a Programme (80G)</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Programmatic Impact Highlight Ribbon */}
      <section className="py-8 bg-[#F4EFE6] border-b border-[#0A192F]/10">
        <Container size="default">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {TRUST_CONFIG.impactHighlights.map((item, idx) => (
              <div key={idx} className="space-y-1 border-r border-[#0A192F]/10 last:border-r-0 pr-4 last:pr-0">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#0A192F]">
                  {item.figure}
                </span>
                <p className="text-xs font-bold text-[#7A5E24] uppercase tracking-wider font-sans">
                  {item.label}
                </p>
                <p className="text-[11px] text-[#4A5568] font-sans">
                  {item.subtext}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. The Four Core Pillars in Depth */}
      <section id="pillars" className="py-20 md:py-28 bg-[#FDFBF7]">
        <Container size="default" className="space-y-16">
          <SectionHeader
            badge="Verified Core Interventions"
            title="The Four Core Mission Pillars"
            subtitle="Documented across our 2021–2024 annual audit records, each pillar directly addresses systemic inequalities in Western Odisha."
            align="center"
          />

          <div className="space-y-14">
            {verifiedPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card
                  key={pillar.id}
                  variant="elevated"
                  className="p-8 sm:p-10 bg-white border-[#0A192F]/15 shadow-sm hover:border-[#C5A059] transition-all space-y-6"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#0A192F]/10 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-3xl font-bold text-[#7A5E24]">
                        {pillar.number}
                      </span>
                      <Badge variant="contrast-gold">
                        {pillar.tag}
                      </Badge>
                      <span className="text-xs text-[#0A192F] font-bold font-sans">
                        {pillar.badge}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-[#15803D] font-bold font-sans">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Audited Programme</span>
                    </span>
                  </div>

                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center shrink-0 shadow-xs border border-[#C5A059]/40">
                      <Icon className="w-6 h-6 text-[#E4C88A]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
                        {pillar.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#7A5E24] font-semibold font-sans mt-1">
                        {pillar.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#4A5568] leading-relaxed font-sans">
                    {pillar.overview}
                  </p>

                  {/* Metrics Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {pillar.metrics.map((m, idx) => (
                      <div key={idx} className="p-3 bg-[#F4EFE6] rounded-xs border border-[#0A192F]/10 text-center font-sans">
                        <span className="text-xs text-[#4A5568] block">{m.label}</span>
                        <span className="text-sm font-bold text-[#0A192F] block mt-0.5">{m.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Strategic Objectives */}
                  <div className="p-5 bg-[#FDFBF7] rounded-xs border border-[#0A192F]/10 space-y-3 font-sans">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0A192F] block">
                      Core Strategic Objectives
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#4A5568]">
                      {pillar.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#0A192F]/10">
                    <div className="text-xs text-[#4A5568] font-sans">
                      <span>Eligible for 50% Tax Deduction under Section 80G &amp; Schedule VII CSR Grants.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href="/donate">
                        <Button variant="gold" size="sm" className="font-bold">
                          <Heart className="w-3.5 h-3.5 mr-1.5 fill-current" />
                          <span>Support This Initiative</span>
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button variant="outline" size="sm">
                          <span>Inquire / Partner</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Strategic Horizons & Future Expansion */}
      <section className="py-20 bg-[#0A192F] text-[#EDE6D8] border-y border-[#C5A059]/30">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Strategic Expansion"
            title="Statewide Education Grants & Learning Hubs"
            subtitle="Scaling our proven Balangir operational model into all 30 districts of Odisha through technology and institutional partnerships."
            align="center"
            theme="dark"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {futureExpansion.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-7 rounded-xs bg-white/5 border border-white/10 space-y-4">
                  <div className="w-10 h-10 rounded-xs bg-[#0F172A] border border-[#C5A059]/40 flex items-center justify-center text-[#E4C88A]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#C5A059] uppercase font-bold tracking-wider font-sans block">
                      {item.scope}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white mt-1">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link href="/csr-partnerships">
              <Button variant="gold" size="lg" className="font-bold shadow-lg">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>Explore Corporate CSR Partnership Gateway</span>
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
