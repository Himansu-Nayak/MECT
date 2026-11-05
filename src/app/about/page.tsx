import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DeveloperCreditCard } from "@/components/DeveloperCreditCard";
import { ABOUT_CONTENT } from "@/lib/about-content";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us & Institutional Heritage",
  description:
    "Learn about MAHAVIR TRUST's foundational heritage, mission, organizational structure, core values, and roadmap to advance higher education access across all 30 districts of Odisha, India.",
  alternates: {
    canonical: "https://mect.org.in/about",
  },
  openGraph: {
    title: "About Us & Institutional Heritage | MAHAVIR TRUST",
    description:
      "MAHAVIR TRUST's foundational heritage, mission, organizational structure, core values, and roadmap to advance higher education access across Odisha, India.",
    url: "https://mect.org.in/about",
    siteName: "MAHAVIR TRUST",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us & Institutional Heritage | MAHAVIR TRUST",
    description:
      "Advancing higher education access, merit grants, and academic mentorship across all 30 districts of Odisha, India.",
  },
};

export default function AboutPage() {
  const { hero, narrative, visionMission, values, governanceTiers, roadmap, cta } =
    ABOUT_CONTENT;

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://mect.org.in",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About Us",
            "item": "https://mect.org.in/about",
          },
        ],
      },
      {
        "@type": "NGO",
        "@id": "https://mect.org.in/#organization",
        "name": "Mahaveer Educational & Charitable Trust",
        "alternateName": "MAHAVIR TRUST",
        "url": "https://mect.org.in",
        "logo": "https://mect.org.in/icon.png",
        "foundingDate": "2025",
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Odisha, India",
        },
        "description":
          "Public charitable educational trust dedicated to higher education tuition grants, merit fellowships, and community study facilities across all 30 districts of Odisha.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bhubaneswar",
          "addressRegion": "Odisha",
          "postalCode": "751001",
          "addressCountry": "IN",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col w-full">
        {/* SECTION 1: Page Hero & Schema Breadcrumbs */}
        <PageHero
          badge={hero.badge}
          title={hero.title}
          description={hero.description}
          breadcrumbs={hero.breadcrumbs}
          actions={
            <>
              <Link href="/governance">
                <Button variant="gold" size="sm">
                  <span>Fiduciary Governance</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/scholarships">
                <Button variant="dark-outline" size="sm">
                  <span>Scholarship Schemes</span>
                </Button>
              </Link>
            </>
          }
        />

        {/* SECTION 2: Foundational Philosophy & Structural Problem */}
        <section
          className="py-20 md:py-28 bg-[#FDFBF7]"
          aria-label="Foundational Narrative & Structural Problem"
        >
          <Container size="default">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Narrative Left */}
              <div className="lg:col-span-7 space-y-6">
                <Badge variant="forest">{narrative.badge}</Badge>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B3B24] leading-tight tracking-tight">
                  {narrative.title}
                </h2>
                {narrative.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans"
                  >
                    {p}
                  </p>
                ))}

                {/* Guiding Safeguards */}
                <div className="pt-4 border-t border-[#0B3B24]/10 space-y-4">
                  {narrative.safeguards.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xs bg-[#0B3B24]/10 text-[#0B3B24] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[#0B3B24]" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-serif text-sm font-bold text-[#0B3B24]">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#4A5568] mt-0.5 font-sans leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vision & Mission Cards Right (Section 3 Integration) */}
              <div className="lg:col-span-5 bg-[#F4EFE6] p-8 sm:p-10 rounded-xs border border-[#0B3B24]/15 shadow-sm space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A5E24] block">
                    {visionMission.badge}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#0B3B24]">
                    {visionMission.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  <Card
                    variant="default"
                    className="p-5 bg-white border-[#0B3B24]/10 shadow-xs space-y-2"
                  >
                    <Badge variant="gold" size="sm">
                      {visionMission.vision.tag}
                    </Badge>
                    <h4 className="font-serif text-sm font-bold text-[#0B3B24]">
                      {visionMission.vision.title}
                    </h4>
                    <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                      {visionMission.vision.description}
                    </p>
                  </Card>

                  <Card
                    variant="default"
                    className="p-5 bg-white border-[#0B3B24]/10 shadow-xs space-y-2"
                  >
                    <Badge variant="forest" size="sm">
                      {visionMission.mission.tag}
                    </Badge>
                    <h4 className="font-serif text-sm font-bold text-[#0B3B24]">
                      {visionMission.mission.title}
                    </h4>
                    <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                      {visionMission.mission.description}
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 4: Four Institutional Guiding Values */}
        <section
          className="py-20 bg-[#F4EFE6] border-y border-[#0B3B24]/10"
          aria-label="Our Guiding Values"
        >
          <Container size="default" className="space-y-12">
            <SectionHeader
              badge="Institutional Anchors"
              title="Our Guiding Values"
              subtitle="Ethical principles that govern every grant appraisal, college relationship, and rupee deployed."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    variant="elevated"
                    className="p-7 bg-white border-[#0B3B24]/12 flex flex-col justify-between space-y-4 shadow-xs hover:border-[#C5A059]/60 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-xs bg-[#0B3B24] text-[#E4C88A] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <Badge variant="contrast-gold" size="sm">
                        {item.tag}
                      </Badge>
                      <h3 className="font-serif text-lg font-bold text-[#0B3B24]">
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

        {/* SECTION 5: Multi-Tier Governance & Oversight Architecture */}
        <section
          className="py-20 md:py-28 bg-[#FDFBF7] border-b border-[#0B3B24]/10"
          aria-label="Organizational Architecture"
        >
          <Container size="default" className="space-y-14">
            <SectionHeader
              badge="Fiduciary Governance Structure"
              title="Organizational & Oversight Architecture"
              subtitle="MAHAVIR TRUST operates under a multi-tier governance model designed to prevent conflict of interest, eliminate administrative bias, and guarantee institutional accountability."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {governanceTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <Card
                    key={tier.tier}
                    variant="elevated"
                    className="p-7 sm:p-8 bg-white border-[#0B3B24]/15 shadow-xs space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#0B3B24]/10">
                      <Badge variant="contrast-gold" size="sm">
                        {tier.tier}
                      </Badge>
                      <span className="text-[10px] font-semibold text-[#0B3B24] bg-[#0B3B24]/8 px-2.5 py-0.5 rounded-xs font-sans">
                        {tier.role}
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xs bg-[#072617] text-[#E4C88A] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-[#0B3B24]">
                          {tier.title}
                        </h3>
                        <p className="text-xs text-[#4A5568] mt-1.5 leading-relaxed font-sans">
                          {tier.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#0B3B24]/10 flex items-center justify-between text-[11px] font-sans">
                      <span className="text-[#4A5568] font-medium">Compliance Note:</span>
                      <span className="font-semibold text-[#0B3B24] italic">{tier.status}</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Statutory Disclosure Callout */}
            <div className="p-6 bg-[#F4EFE6] rounded-xs border border-[#0B3B24]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#0B3B24] shrink-0" aria-hidden="true" />
                <p className="text-[#4A5568] font-sans">
                  <strong>Statutory Notice:</strong> Official Trustee Board gazetted notifications and Section 12A/80G filings will be published for public inspection following government certificate issuance.
                </p>
              </div>
              <Link href="/governance" className="shrink-0">
                <Button variant="secondary" size="sm">
                  <span>View Fiduciary Charter</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* SECTION 6: Phased Evolution Roadmap (2025–2027) */}
        <section
          className="py-20 md:py-28 bg-[#072617] text-[#EDE6D8] border-b border-[#C5A059]/20 relative overflow-hidden"
          aria-label="Phased Evolution Roadmap"
        >
          <div
            className="absolute inset-0 opacity-5 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
            aria-hidden="true"
          />

          <Container size="default" className="relative space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <Badge
                variant="gold-dark"
                icon={<Clock className="w-3.5 h-3.5 text-[#C5A059]" aria-hidden="true" />}
              >
                {roadmap.badge}
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {roadmap.title}
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                {roadmap.subtitle}
              </p>
            </div>

            {/* Timeline Progress Bar (Desktop Visual Indicator) */}
            <div className="hidden lg:block relative mx-8 -mb-4">
              <div className="h-0.5 w-full bg-white/15 absolute top-1/2 -translate-y-1/2" />
              <div className="flex justify-between relative z-10">
                {roadmap.milestones.map((m, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-[#072617] border-2 border-[#C5A059] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E4C88A]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roadmap.milestones.map((milestone) => (
                <div
                  key={milestone.year}
                  className="p-6 bg-white/5 border border-white/10 rounded-xs hover:border-[#C5A059]/50 transition-all flex flex-col justify-between space-y-4 backdrop-blur-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="font-serif text-2xl font-bold text-[#E4C88A]">
                        {milestone.year}
                      </span>
                      <Badge variant="gold-dark" size="sm">
                        {milestone.badge}
                      </Badge>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed font-sans">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link href="/programmes">
                <Button variant="gold" size="md">
                  <span>Explore Programmatic Initiatives</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* SECTION 7: Developer Credit Card — Himansu Nayak */}
        <DeveloperCreditCard />

        {/* SECTION 8: Institutional Engagement Call-to-Action */}
        <section
          className="py-20 bg-[#0B3B24] text-white relative overflow-hidden"
          aria-label="Institutional Engagement Call to Action"
        >
          <Container size="default">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge variant="gold-dark">{cta.badge}</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#EDE6D8]">
                {cta.title}
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                {cta.subtitle}
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link href="/scholarships">
                  <Button variant="gold" size="md">
                    <span>Explore Scholarships</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/governance">
                  <Button variant="dark-outline" size="md">
                    <span>Review Fiduciary Charter</span>
                  </Button>
                </Link>
                <Link href="/volunteer">
                  <Button variant="secondary" size="md">
                    <span>Volunteer Network</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
