import React from "react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  StaggerGroup,
  StaggerItem,
  CountUpStat,
  Reveal,
  MOTION_STAGGER,
} from "@/components/ui/MotionPrimitives";
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

export const metadata = createPageMetadata({
  title: "Community Impact & Programme Outcomes",
  description:
    "Documented programme reach across education, women's livelihoods, safe-water initiatives, and nutrition relief alongside Balangir and Bhubaneswar operating locations.",
  path: "/impact",
  ogImage: "/images/og-programmes.png",
});

export default function ImpactPage() {
  const verifiedImpactMetrics = [
    {
      title: "Education & Learning",
      metric: "350+ Students",
      subtext: "Balangir & Puintala Blocks",
      description:
        "Daily after-school tutoring in math, science, and English, paired with free textbooks to prevent secondary dropouts.",
      icon: GraduationCap,
      badge: "Shiksha Setu",
    },
    {
      title: "Women Empowerment & Livelihoods",
      metric: "120+ Women Skilled",
      subtext: "Certified 6-Month Courses",
      description:
        "Technical apparel fabrication instruction, sewing machine toolkits, and micro-enterprise creation for rural women and SHGs.",
      icon: Scissors,
      badge: "Swavalamban",
    },
    {
      title: "Safe Water & Community Wellbeing",
      metric: "10,000+ Citizens Served",
      subtext: "Western Odisha Summer Relief",
      description:
        "Clean, purified cold drinking water stations and heatwave electrolyte distribution across transit points and hospitals.",
      icon: Droplets,
      badge: "Jal & Arogya",
    },
    {
      title: "Food Security & Nutrition",
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

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        title="Documented Community Impact Across Our Work"
        description="Understand programme reach, community outcomes and the work behind the numbers. Geographic expansion plans are distinguished from active programme locations."
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
                <FileText className="w-3.5 h-3.5 mr-1 text-cream" />
                <span>Audited Annual Reports</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Four Verified Metric Counters */}
      <section id="metrics" className="py-20 md:py-28 bg-cream">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Verified Ground Telemetry"
            title="Impact Across Four Connected Development Areas"
            subtitle="Programme indicators are drawn from the trust's reported activity records; figures should be refreshed with the relevant reporting period before publication."
            align="center"
          />

          <StaggerGroup staggerDelay={MOTION_STAGGER.cards} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verifiedImpactMetrics.map((item, idx) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={idx}>
                  <Card
                    variant="elevated"
                    className="h-full p-6 bg-white border-border-warm shadow-xs hover:border-sand transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xs bg-forest text-white flex items-center justify-center border border-sand/45">
                          <Icon className="w-5 h-5 text-cream" />
                        </div>
                        <Badge variant="contrast-gold" size="sm">
                          {item.badge}
                        </Badge>
                      </div>

                      <div>
                        <CountUpStat
                          value={item.metric}
                          className="font-serif text-2xl font-bold text-forest block"
                        />
                        <span className="text-xs font-semibold text-forest font-sans block mt-0.5">
                          {item.subtext}
                        </span>
                      </div>

                      <h3 className="font-serif text-base font-bold text-forest">
                        {item.title}
                      </h3>

                      <p className="text-xs text-ink leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </Container>
      </section>

      {/* 3. Coverage Strategy Across All 30 Odisha Districts */}
      <section className="py-20 md:py-28 bg-white" aria-label="30-District Framework">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Reach & Presence"
            title="Where We Work: Current Presence & Outreach Priorities"
            subtitle="The map of activity must distinguish established programme locations, liaison offices, outreach areas and planned expansion. A listed district is not automatically an active project location."
            align="center"
          />

          <Reveal direction="fade" tone="slow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {districtZones.map((zone) => (
              <Card
                key={zone.zone}
                variant={zone.highlight ? "elevated" : "default"}
                className={`p-7 bg-white space-y-4 transition-all ${
                  zone.highlight
                    ? "border-2 border-sand shadow-md"
                    : "border-border-warm shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-border-warm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sand" />
                    <span className="font-serif font-bold text-lg text-terracotta-dark">
                      {zone.zone}
                    </span>
                  </div>
                  <Badge variant="contrast-gold">
                    {zone.count}
                  </Badge>
                </div>

                <div className="space-y-1.5 font-sans">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-forest block">
                    Districts in Cluster:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.districts.map((d) => (
                      <span
                        key={d}
                        className="text-xs bg-sand-light text-forest px-2.5 py-1 rounded-xs border border-border-warm font-medium"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border-warm flex items-center justify-between text-xs font-sans">
                  <span className="text-ink-sand">{zone.phase}</span>
                  <span className="text-terracotta-dark font-bold">{zone.status}</span>
                </div>
              </Card>
            ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 5. Annual Reports & Audit Link */}
      <section className="py-20 bg-sand-light text-ink border-t border-border-warm">
        <Container size="default">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-white border border-border-warm rounded-xs p-8 sm:p-10 shadow-xs">
            <Badge variant="contrast-gold">
              Public Fiduciary Archive
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              Transparent, Audited Annual Reports &amp; Balance Sheets
            </h2>
            <p className="text-sm text-ink leading-relaxed font-sans max-w-2xl mx-auto">
              MECT publishes certified annual activity reports and balance sheets audited by independent Chartered Accountants, in accordance with the Indian Trusts Act and Income Tax Act Section 12A/80G norms.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link href="/reports">
                <Button variant="gold" size="lg" className="shadow-sm font-bold">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Inspect Annual Reports Archive</span>
                </Button>
              </Link>
              <Link href="/statutory-disclosures">
                <Button variant="outline" size="lg" className="font-semibold">
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
