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
  MapPin,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  Users,
  ShieldCheck,
  FileText,
  Scissors,
  Droplets,
  Utensils,
  Heart,
  Briefcase,
  Building2,
  Landmark,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Audited Civic Impact & Beneficiary Metrics — MECT Odisha",
  description:
    "Explore 12+ years of verified civic impact by Mahaveer Educational & Charitable Trust (MECT): 350+ remedial students, 120+ skilled rural women, 10,000+ Jal Seva beneficiaries, and statewide 30-district expansion roadmap.",
};

export default function ImpactPage() {
  const verifiedImpactMetrics = [
    {
      title: "Remedial Rural Education",
      metric: "350+ Students",
      subtext: "Balangir & Puintala Blocks",
      description:
        "Daily after-school tutoring in math, science, and English, paired with free textbooks to prevent secondary dropouts.",
      icon: GraduationCap,
      badge: "Shiksha Setu",
    },
    {
      title: "Women's Livelihood Tailoring",
      metric: "120+ Women Skilled",
      subtext: "Certified 6-Month Courses",
      description:
        "Technical apparel fabrication instruction, sewing machine toolkits, and micro-enterprise creation for rural women and SHGs.",
      icon: Scissors,
      badge: "Swavalamban",
    },
    {
      title: "Jal Seva Safe Drinking Water",
      metric: "10,000+ Citizens Served",
      subtext: "Western Odisha Summer Relief",
      description:
        "Clean, purified cold drinking water stations and heatwave electrolyte distribution across transit points and hospitals.",
      icon: Droplets,
      badge: "Jal & Arogya",
    },
    {
      title: "Jan Ahar Destitute Nutrition",
      metric: "Daily Meal Distribution",
      subtext: "Balangir Hospital Vicinity",
      description:
        "Wholesome, hot cooked meals for impoverished attendants and families caring for hospitalized kin far from home.",
      icon: Utensils,
      badge: "Annadaan",
    },
  ];

  const districtZones = [
    {
      zone: "Western Operational Hub (Foundational Base)",
      count: "7 Districts",
      districts: ["Balangir (HQ & Regd. Office)", "Subarnapur", "Bargarh", "Sambalpur", "Nuapada", "Kalahandi", "Jharsuguda"],
      phase: "Operational Ground Centres (2013–Present)",
      status: "Active Operational Centres",
      highlight: true,
    },
    {
      zone: "Central & Capital Liaison Corridor",
      count: "7 Districts",
      districts: ["Khordha (Bhubaneswar Secretariat)", "Cuttack", "Puri", "Jagatsinghpur", "Kendrapara", "Jajpur", "Nayagarh"],
      phase: "Statewide Grant & CSR Liaison",
      status: "Liaison & Expansion Hub",
      highlight: false,
    },
    {
      zone: "Northern & Industrial Belt",
      count: "7 Districts",
      districts: ["Sundargarh (Rourkela)", "Keonjhar", "Mayurbhanj (Baripada)", "Balasore", "Bhadrak", "Angul", "Dhenkanal"],
      phase: "Technical & Polytechnic Outreach",
      status: "Polytechnic Outreach Scheduled",
      highlight: false,
    },
    {
      zone: "Southern & Tribal Welfare Belts",
      count: "9 Districts",
      districts: ["Ganjam (Berhampur)", "Gajapati", "Kandhamal", "Boudh", "Rayagada", "Koraput", "Nabarangpur", "Malkangiri", "Deogarh"],
      phase: "First-Generation Scholar Focus",
      status: "Tribal Fellowship Mandate",
      highlight: false,
    },
  ];

  const groundCaseStudies = [
    {
      title: "Remedial Coaching Transforms Rural Board Exam Scores",
      location: "Puintala Block, Balangir District",
      scenario:
        "In a rural agricultural cluster where the high school dropout rate exceeded 35%, MECT established an after-school study centre with solar lighting and dedicated volunteer teachers. Over 40 students completed their matriculation exams with first-division honours.",
      impact: "100% board exam pass rate among regular attendees; 18 students enrolled in government polytechnics.",
      category: "Education",
    },
    {
      title: "Tailoring Trade Training Creates Financial Independence",
      location: "Rugudipara Training Centre, Balangir",
      scenario:
        "A cohort of 25 rural women from landless laborer households enrolled in MECT's 6-month intensive tailoring course. Equipped with pedal sewing machine kits upon graduation, they formed a stitching cooperative fulfilling bulk orders for local school uniforms.",
      impact: "Average monthly household income increased by ₹4,500 – ₹7,000 per artisan.",
      category: "Women Livelihood",
    },
    {
      title: "Emergency Summer Jal Seva Reaches Scorched Transit Nodes",
      location: "Balangir Bus Terminus & District Hospital",
      scenario:
        "During extreme summer heatwaves with temperatures reaching 46°C, MECT deployed 4 shaded drinking water distribution points with clean earthen storage pots, water coolers, and ORS packets.",
      impact: "Over 10,000 cold water portions served with zero heatstroke casualties reported at monitored transit points.",
      category: "Public Health",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Audited Civic Outcomes • 12+ Years Heritage"
        title="Verifiable Community Impact & 30-District Odisha Strategy"
        description="Authentic philanthropy is measured by real beneficiaries, degree completions, vocational livelihoods, and emergency relief. Explore 12+ years of verified grassroots outcomes across Western Odisha."
        breadcrumbs={[{ label: "Community Impact" }]}
        actions={
          <>
            <Link href="#metrics">
              <Button variant="gold" size="sm">
                <span>Core Impact Metrics</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="dark-outline" size="sm">
                <FileText className="w-3.5 h-3.5 mr-1 text-[#E4C88A]" />
                <span>Audited Annual Reports</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Four Verified Metric Counters */}
      <section id="metrics" className="py-20 md:py-28 bg-[#FDFBF7]">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Verified Ground Telemetry"
            title="Grassroots Impact Across 4 Operational Tracks"
            subtitle="Extracted from MECT's 2021–2024 certified annual activity reports and field ledgers."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verifiedImpactMetrics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={idx}
                  variant="elevated"
                  className="p-6 bg-white border-[#0A192F]/12 shadow-xs hover:border-[#C5A059] transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center border border-[#C5A059]/40">
                        <Icon className="w-5 h-5 text-[#E4C88A]" />
                      </div>
                      <Badge variant="contrast-gold" size="sm">
                        {item.badge}
                      </Badge>
                    </div>

                    <div>
                      <span className="font-serif text-2xl font-bold text-[#0A192F] block">
                        {item.metric}
                      </span>
                      <span className="text-xs font-semibold text-[#7A5E24] font-sans block mt-0.5">
                        {item.subtext}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-[#0A192F]">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Authentic Grassroots Case Studies */}
      <section className="py-20 bg-[#F4EFE6] border-y border-[#0A192F]/10">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Field Case Studies"
            title="Ground-Level Stories of Transformation"
            subtitle="Documented field initiatives illustrating the life outcomes enabled by MECT's non-profit interventions in Odisha."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {groundCaseStudies.map((story, idx) => (
              <Card
                key={idx}
                variant="elevated"
                className="p-7 bg-white border-[#0A192F]/12 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#0A192F]/10 text-[11px] font-sans">
                    <span className="text-[#7A5E24] font-bold">{story.location}</span>
                    <Badge variant="forest" size="sm">
                      {story.category}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                    {story.title}
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                    {story.scenario}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0A192F]/10 space-y-1 text-xs font-sans">
                  <span className="text-[10px] uppercase font-bold text-[#15803D] block">
                    Verified Ground Impact:
                  </span>
                  <p className="text-xs text-[#0A192F] font-semibold leading-snug">
                    {story.impact}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Coverage Strategy Across All 30 Odisha Districts */}
      <section className="py-20 md:py-28 bg-[#FDFBF7]" aria-label="30-District Framework">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Geographic Mandate"
            title="Odisha 30-District Outreach & Cluster Architecture"
            subtitle="From our registered base in Balangir and corporate secretariat in Bhubaneswar, MECT progressively extends higher education and civic relief across all administrative zones."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {districtZones.map((zone) => (
              <Card
                key={zone.zone}
                variant={zone.highlight ? "elevated" : "default"}
                className={`p-7 bg-white space-y-4 transition-all ${
                  zone.highlight
                    ? "border-2 border-[#C5A059] shadow-md"
                    : "border-[#0A192F]/12 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#0A192F]/10">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-serif font-bold text-lg text-[#0A192F]">
                      {zone.zone}
                    </span>
                  </div>
                  <Badge variant="contrast-gold">
                    {zone.count}
                  </Badge>
                </div>

                <div className="space-y-1.5 font-sans">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A5E24] block">
                    Districts in Cluster:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.districts.map((d) => (
                      <span
                        key={d}
                        className="text-xs bg-[#F4EFE6] text-[#0A192F] px-2.5 py-1 rounded-xs border border-[#0A192F]/10 font-medium"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#0A192F]/10 flex items-center justify-between text-xs font-sans">
                  <span className="text-[#4A5568]">{zone.phase}</span>
                  <span className="text-[#0A192F] font-bold">{zone.status}</span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Annual Reports & Audit Link */}
      <section className="py-20 bg-[#0A192F] text-[#EDE6D8]">
        <Container size="default">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="gold-dark">
              Public Fiduciary Archive
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Transparent, Audited Annual Reports &amp; Balance Sheets
            </h2>
            <p className="text-sm text-white/80 leading-relaxed font-sans max-w-2xl mx-auto">
              MECT publishes certified annual activity reports and balance sheets audited by independent Chartered Accountants, in accordance with the Indian Trusts Act and Income Tax Act Section 12A/80G norms.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link href="/reports">
                <Button variant="gold" size="lg" className="shadow-lg font-bold">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Inspect Annual Reports Archive</span>
                </Button>
              </Link>
              <Link href="/statutory-disclosures">
                <Button variant="dark-outline" size="lg" className="font-semibold">
                  <span>View 12A/80G Credentials</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
