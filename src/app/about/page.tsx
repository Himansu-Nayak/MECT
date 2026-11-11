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
import { Reveal } from "@/components/ui/MotionPrimitives";
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
    "Learn about MECT's heritage, mission, governance and multi-sector work across education, women's livelihoods, safe water, nutrition and community welfare in Odisha.",
  alternates: {
    canonical: "https://mect.org.in/about",
  },
  openGraph: {
    title: "About Us & Institutional Heritage | Mahaveer Educational & Charitable Trust (MECT)",
    description:
      "MECT's heritage, mission, governance and community-development work across education, livelihoods, safe water and nutrition in Odisha.",
    url: "https://mect.org.in/about",
    siteName: "Mahaveer Educational & Charitable Trust (MECT)",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us & Institutional Heritage | Mahaveer Educational & Charitable Trust (MECT)",
    description:
      "Strengthening people and communities through learning, livelihoods, safe water, nutrition and accountable community programmes.",
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
        "alternateName": "MECT",
        "url": "https://mect.org.in",
        "logo": "https://mect.org.in/images/mect-official-emblem.png",
        "foundingDate": "2013-07-27",
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Odisha, India",
        },
        "description":
          "Registered public charitable trust established in 2013 (Deed No. 40311302194), working across education, women's vocational livelihoods, safe-water initiatives, nutrition support and community welfare in Odisha.",
        "address": [
          {
            "@type": "PostalAddress",
            "name": "Registered Office",
            "streetAddress": "Near Sai Mandir, Rugudipara",
            "addressLocality": "Balangir",
            "addressRegion": "Odisha",
            "postalCode": "767001",
            "addressCountry": "IN",
          },
          {
            "@type": "PostalAddress",
            "name": "Corporate Liaison Secretariat",
            "streetAddress": "A1, 3rd Floor, Lewis Plaza, BJB Nagar",
            "addressLocality": "Bhubaneswar",
            "addressRegion": "Odisha",
            "postalCode": "751014",
            "addressCountry": "IN",
          },
        ],
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
          className="py-20 md:py-28 bg-cream"
          aria-label="Foundational Narrative & Structural Problem"
        >
          <Container size="default">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Narrative Left */}
              <Reveal direction="left" className="lg:col-span-7 space-y-6">
                <Badge variant="forest">{narrative.badge}</Badge>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-terracotta-dark leading-tight tracking-tight">
                  {narrative.title}
                </h2>
                {narrative.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base text-ink-sand leading-relaxed font-sans"
                  >
                    {p}
                  </p>
                ))}

                {/* Guiding Safeguards */}
                <div className="pt-4 border-t border-border-warm space-y-4">
                  {narrative.safeguards.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-xs bg-cream text-terracotta-dark flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-terracotta-dark" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-serif text-sm font-bold text-terracotta-dark">
                          {item.title}
                        </h3>
                        <p className="text-xs text-ink-sand mt-0.5 font-sans leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Vision & Mission Cards Right (Section 3 Integration) */}
              <Reveal direction="right" delay={0.08} className="lg:col-span-5 bg-sand-light p-8 sm:p-10 rounded-xs border border-border-warm shadow-sm space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-forest block">
                    {visionMission.badge}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-terracotta-dark">
                    {visionMission.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  <Card
                    variant="default"
                    className="p-5 bg-white border-border-warm shadow-xs space-y-2"
                  >
                    <Badge variant="gold" size="sm">
                      {visionMission.vision.tag}
                    </Badge>
                    <h4 className="font-serif text-sm font-bold text-terracotta-dark">
                      {visionMission.vision.title}
                    </h4>
                    <p className="text-xs text-ink-sand leading-relaxed font-sans">
                      {visionMission.vision.description}
                    </p>
                  </Card>

                  <Card
                    variant="default"
                    className="p-5 bg-white border-border-warm shadow-xs space-y-2"
                  >
                    <Badge variant="forest" size="sm">
                      {visionMission.mission.tag}
                    </Badge>
                    <h4 className="font-serif text-sm font-bold text-terracotta-dark">
                      {visionMission.mission.title}
                    </h4>
                    <p className="text-xs text-ink-sand leading-relaxed font-sans">
                      {visionMission.mission.description}
                    </p>
                  </Card>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* SECTION 4: Four Institutional Guiding Values */}
        <section
          className="py-20 bg-white border-y border-border-warm"
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
                    className="p-7 bg-white border-border-warm flex flex-col justify-between space-y-4 shadow-xs hover:border-sand/60 transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-xs bg-terracotta text-white flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <Badge variant="contrast-gold" size="sm">
                        {item.tag}
                      </Badge>
                      <h3 className="font-serif text-lg font-bold text-terracotta-dark">
                        {item.title}
                      </h3>
                      <p className="text-xs text-ink-sand leading-relaxed font-sans">
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
          className="py-20 md:py-28 bg-cream border-b border-border-warm"
          aria-label="Organizational Architecture"
        >
          <Container size="default" className="space-y-14">
            <SectionHeader
              badge="Fiduciary Governance Structure"
              title="Organizational & Oversight Architecture"
              subtitle="Mahaveer Educational & Charitable Trust (MECT) operates under a multi-tier governance model designed to prevent conflict of interest, eliminate administrative bias, and guarantee institutional accountability."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {governanceTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <Card
                    key={tier.tier}
                    variant="elevated"
                    className="p-7 sm:p-8 bg-white border-border-warm shadow-xs space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-border-warm">
                      <Badge variant="contrast-gold" size="sm">
                        {tier.tier}
                      </Badge>
                      <span className="text-[10px] font-semibold text-terracotta-dark bg-terracotta/8 px-2.5 py-0.5 rounded-xs font-sans">
                        {tier.role}
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xs bg-forest text-cream flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-terracotta-dark">
                          {tier.title}
                        </h3>
                        <p className="text-xs text-ink-sand mt-1.5 leading-relaxed font-sans">
                          {tier.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border-warm flex items-center justify-between text-[11px] font-sans">
                      <span className="text-ink-sand font-medium">Compliance Note:</span>
                      <span className="font-semibold text-terracotta-dark italic">{tier.status}</span>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Statutory Disclosure Callout */}
            <div className="p-6 bg-sand-light rounded-xs border border-border-warm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-forest shrink-0" aria-hidden="true" />
                <p className="text-ink font-sans">
                  <strong className="text-forest">Statutory Notice:</strong> Registered Trust Deed No. 40311302194, Form 10AC historical 12A/80G orders (AY 2024–25 to AY 2026–27), CSR Registration CSR00081063, and NITI Aayog Darpan records are published in the{" "}
                  <Link href="/statutory-disclosures" className="font-semibold underline text-forest">
                    Statutory Disclosures Vault
                  </Link>
                  . Current approval for Tax Year 2026–27 has not yet been established from reviewed records.
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
          className="py-20 md:py-28 bg-forest text-cream border-b border-sand/20 relative overflow-hidden"
          aria-label="Phased Evolution Roadmap"
        >
          <div
            className="absolute inset-0 opacity-5 bg-[radial-gradient(#E5C499_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
            aria-hidden="true"
          />

          <Container size="default" className="relative space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <Badge
                variant="gold-dark"
                icon={<Clock className="w-3.5 h-3.5 text-sand" aria-hidden="true" />}
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
                    <div className="w-4 h-4 rounded-full bg-forest border-2 border-sand flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-sand-light" />
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
                  className="p-6 bg-white/5 border border-white/10 rounded-xs hover:border-sand/50 transition-all flex flex-col justify-between space-y-4 backdrop-blur-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="font-serif text-2xl font-bold text-cream">
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
          className="py-20 bg-sand-light text-ink border-t border-border-warm relative overflow-hidden"
          aria-label="Institutional Engagement Call to Action"
        >
          <Container size="default">
            <div className="max-w-3xl mx-auto text-center space-y-6 bg-white border border-border-warm rounded-xs p-8 sm:p-10 shadow-xs">
              <Badge variant="contrast-gold">{cta.badge}</Badge>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-forest">
                {cta.title}
              </h2>
              <p className="text-sm sm:text-base text-ink leading-relaxed font-sans">
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
                  <Button variant="outline" size="md">
                    <span>Review Fiduciary Charter</span>
                  </Button>
                </Link>
                <Link href="/volunteer">
                  <Button variant="primary" size="md">
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
