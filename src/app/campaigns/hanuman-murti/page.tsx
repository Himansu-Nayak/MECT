import React from "react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/Accordion";
import { HanumanMurtiVisual } from "@/components/campaigns/HanumanMurtiVisual";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import { createPageMetadata } from "@/lib/seo";
import {
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  Building2,
  Layers,
  ArrowRight,
  FileText,
  AlertCircle,
  HelpCircle,
  Calendar,
  Users,
} from "lucide-react";

export const metadata = createPageMetadata({
  title: "The Grand Hanuman Murti Project — Proposed 80–100-Foot Monument | MECT",
  description:
    "A Monumental Vision of Faith, Devotion and Community Participation. Join Mahaveer Educational & Charitable Trust in supporting the proposed 80–100-foot Hanuman Murti initiative with transparent, segregated project accounting.",
  path: "/campaigns/hanuman-murti",
  ogImage: "/images/og-default.png",
});

export default function HanumanMurtiCampaignPage() {
  const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

  const MILESTONES = [
    {
      date: "Initiative Formulation",
      title: "Conceptual Vision & Community Outline",
      status: "ACTIVE",
      description:
        "The proposed vision for an 80–100-foot Hanuman Murti initiative was outlined to serve as a regional landmark of devotion, service, and moral inspiration. Public consultations and initial concept discussions are underway.",
    },
    {
      date: "Planning & Feasibility",
      title: "Technical Feasibility & Site Assessment",
      status: "IN_PROGRESS",
      description:
        "Structural design, site feasibility, soil bearing assessment, and required clearances will be finalized following professional evaluation and applicable approvals before civil work commences.",
    },
    {
      date: "Accounting & Governance",
      title: "Dedicated Project Sub-Ledger Segregation",
      status: "ACTIVE",
      description:
        "Voluntary contributions for this proposed initiative are accounted under a strictly segregated project sub-ledger (HANUMAN_MURTI) with zero educational or general fund commingling.",
    },
    {
      date: "Future Roadmap",
      title: "Statutory Approvals & Structural Design Review",
      status: "SCHEDULED",
      description:
        "Following completion of technical appraisals and receipt of necessary administrative and environmental clearances, formal architectural models and foundation planning will be presented to the community.",
    },
  ];

  const FAQS = [
    {
      q: "What is the primary objective of the Grand Hanuman Murti Project?",
      a: "The project represents a community-inspired initiative by Mahaveer Educational & Charitable Trust to erect an 80–100-foot monument of Lord Hanuman in Odisha. It aims to create an enduring symbol of selfless service, devotion, strength, and communal harmony, complemented by planned community learning and cultural spaces.",
    },
    {
      q: "What is the proposed height and design of the monument?",
      a: "The conceptual design specifies an approximate elevation of 80 to 100 feet from ground level, mounted upon a reinforced stepped architectural pedestal reflecting traditional Kalinga and Nagara heritage. Final dimensions will be published upon conclusion of soil bearing and structural tests.",
    },
    {
      q: "Is the project currently under construction?",
      a: "No. The project is currently in the formal planning and feasibility appraisal phase. Civil construction will commence only after all requisite structural clearances, environmental reviews, and board sanctions are formally completed.",
    },
    {
      q: "How are campaign donations managed and accounted for?",
      a: "All contributions to this initiative are credited under a strictly segregated project ledger (code: HANUMAN_MURTI). Funds are never commingled with MECT's general educational grants or scholarship budgets. Detailed financial audits will be published in annual public reports.",
    },
    {
      q: "Will I receive an official receipt for my contribution?",
      a: "Yes. Every verified contribution immediately generates an auditable, serialized Official Donation Receipt & Payment Acknowledgement (PDF) with a cryptographic SHA-256 hash, downloadable in your authenticated Donor Portal.",
    },
    {
      q: "Can institutional or corporate donors support this initiative?",
      a: "Yes. Organizations interested in partnering for cultural preservation, park landscaping, or civic amenities surrounding the monument are invited to connect with the Secretariat via our official inquiry desk.",
    },
  ];

  return (
    <div className="bg-cream min-h-screen pb-16">
      {/* 1. Page Hero */}
      <PageHero
        title="The Grand Hanuman Murti Project"
        description="A Monumental Vision of Faith, Devotion and Community Participation. Join Mahaveer Educational & Charitable Trust in supporting this proposed 80–100-foot spiritual and cultural landmark."
        breadcrumbs={[
          { label: "Campaigns", href: "/campaigns" },
          { label: "Hanuman Murti Project" },
        ]}
        actions={
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#participate">
              <Button variant="primary" className="!bg-sand !text-forest-deep hover:!bg-cream font-bold">
                <Heart className="w-4 h-4 mr-2 fill-current" />
                Support the Campaign
              </Button>
            </a>
            <a href="#project-overview">
              <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                Project Overview &amp; Vision
              </Button>
            </a>
            <a href="#updates">
              <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                Milestones &amp; Updates
              </Button>
            </a>
          </div>
        }
      />

      <Container size="default" className="py-12 space-y-16">
        {/* SECTION A & B: PROJECT OVERVIEW & CONCEPTUAL VISUAL */}
        <section id="project-overview" className="scroll-mt-24 space-y-8">
          <Reveal direction="up">
            <SectionHeader
              badge="Institutional Initiative"
              title="A Monument of Devotion, Harmony & Resilience"
              subtitle="Proposed 80–100-Foot Landmark by Mahaveer Educational & Charitable Trust"
            />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Conceptual Visualization Artwork */}
            <div className="lg:col-span-5">
              <Reveal direction="left" distance={12}>
                <HanumanMurtiVisual variant="hero" />
              </Reveal>
            </div>

            {/* Right: Vision & Institutional Purpose */}
            <div className="lg:col-span-7 space-y-5 text-ink">
              <Reveal direction="right" distance={12} className="space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-sand/40 border border-sand text-xs font-semibold text-forest">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta-dark" />
                  <span>Verified Status: Proposed Project (Planning &amp; Feasibility Stage)</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-tight">
                  An Enduring Spiritual Horizon Rooted in Community Service
                </h2>

                <p className="text-sm text-ink-sand leading-relaxed">
                  Mahaveer Educational &amp; Charitable Trust (MECT) was established under its 2013 registered charter to serve society through education, health, and moral upliftment. In alignment with this mission, the Trust is championing the <strong>Grand Hanuman Murti Project</strong>: a proposed 80 to 100-foot monumental manifestation of Lord Hanuman, the supreme emblem of selfless service (<em>Seva</em>), moral strength, and boundless compassion.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white border border-border-soft rounded-xs space-y-1 shadow-2xs hover:border-terracotta/40 transition-colors">
                    <div className="text-xs font-bold uppercase tracking-wider text-terracotta-dark">
                      Proposed Height
                    </div>
                    <div className="font-serif text-xl font-bold text-forest">80–100 Feet</div>
                    <p className="text-[11px] text-ink-muted">
                      Elevated on an earthquake-resistant multi-tiered architectural plinth.
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-border-soft rounded-xs space-y-1 shadow-2xs hover:border-terracotta/40 transition-colors">
                    <div className="text-xs font-bold uppercase tracking-wider text-terracotta-dark">
                      Ledger Segregation
                    </div>
                    <div className="font-serif text-xl font-bold text-forest">100% Segregated</div>
                    <p className="text-[11px] text-ink-muted">
                      Maintained under dedicated campaign sub-accounts with zero educational commingling.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xs text-xs text-amber-950 space-y-1">
                  <strong>Fiduciary Truth in Disclosures:</strong> This project is currently in the conceptual design, land appraisal, and architectural feasibility phase. Civil construction has not yet commenced. MECT makes no unverified claims regarding height superlatives and operates strictly within documented institutional milestones.
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SECTION C: ARCHITECTURAL & PROJECT INFORMATION */}
        <section className="space-y-6">
          <Reveal direction="up">
            <SectionHeader
              badge="Project Specifications"
              title="Architectural Concept & Feasibility Roadmap"
              subtitle="Transparent parameters governing site selection, engineering, and cultural architecture."
            />
          </Reveal>

          <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StaggerItem>
              <Card padding="md" className="h-full bg-white border-border-soft space-y-3 hover:border-terracotta/40 hover:shadow-xs transition-all duration-300">
                <div className="w-10 h-10 rounded-xs bg-forest/10 flex items-center justify-center text-forest">
                  <Building2 className="w-5 h-5 text-forest" />
                </div>
                <h3 className="font-serif font-bold text-forest text-base">
                  1. Architectural Elevation &amp; Form
                </h3>
                <p className="text-xs text-ink-sand leading-relaxed">
                  Depicting Lord Hanuman in an upright, watchful posture (<em>Vira-Abhaya Stance</em>) with the sacred mace (<em>Gada</em>) resting grounded and the right hand raised in divine blessing and reassurance. Integrated with traditional Odishan temple stone reliefs.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card padding="md" className="h-full bg-white border-border-soft space-y-3 hover:border-terracotta/40 hover:shadow-xs transition-all duration-300">
                <div className="w-10 h-10 rounded-xs bg-terracotta/10 flex items-center justify-center text-terracotta-dark">
                  <Layers className="w-5 h-5 text-terracotta-dark" />
                </div>
                <h3 className="font-serif font-bold text-forest text-base">
                  2. Civil Engineering &amp; Durability Concept
                </h3>
                <p className="text-xs text-ink-sand leading-relaxed">
                  Structural design, site feasibility, and required clearances will be finalized following professional assessment and applicable statutory approvals. The conceptual engineering framework contemplates cyclone-resistant wind load engineering, high-grade reinforced materials, and durable exterior cladding suitable for regional conditions.
                </p>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card padding="md" className="h-full bg-white border-border-soft space-y-3 hover:border-terracotta/40 hover:shadow-xs transition-all duration-300">
                <div className="w-10 h-10 rounded-xs bg-sand/30 flex items-center justify-center text-forest">
                  <Compass className="w-5 h-5 text-forest" />
                </div>
                <h3 className="font-serif font-bold text-forest text-base">
                  3. Proposed Community Campus Concept
                </h3>
                <p className="text-xs text-ink-sand leading-relaxed">
                  Planned community campus features — including a community meditation space, remedial study reading rooms for rural youth, clean drinking water distribution points, and indigenous tree groves (<em>Pavitra Vana</em>) — represent proposed conceptual amenities to be phased subject to site approvals, master planning, and dedicated funding.
                </p>
              </Card>
            </StaggerItem>
          </StaggerGroup>
        </section>

        {/* SECTION D: FUNDRAISING & PARTICIPATION JOURNEY */}
        <section id="participate" className="scroll-mt-24 space-y-8">
          <Reveal direction="up">
            <SectionHeader
              badge="Campaign Participation"
              title="Be a Founding Part of This Historic Vision"
              subtitle="Every contribution directly supports feasibility, land planning, and construction reserves under dedicated campaign supervision."
            />
          </Reveal>

          <Reveal direction="up" delay={0.08}>
            <Card padding="lg" className="bg-white border-border-soft shadow-subtle space-y-8 max-w-4xl mx-auto">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-xs bg-sand text-forest-deep text-[11px] font-bold uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 fill-current text-terracotta" />
                  <span>Dedicated Campaign Fund: HANUMAN_MURTI</span>
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                  Select Your Voluntary Contribution
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Choose a suggested contribution tier below or enter a custom amount on our unified payment portal. Contributions are processed with instant server verification and verifiable receipt issuance.
                </p>
              </div>

              {/* Contribution Preset Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {PRESET_AMOUNTS.map((amt) => (
                  <Link
                    key={amt}
                    href={`/donate?programme=HANUMAN_MURTI&amount=${amt}`}
                    className="p-4 rounded-xs border border-border-soft bg-cream/30 hover:border-terracotta hover:bg-sand/30 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-center group"
                  >
                    <div className="text-[10px] uppercase font-bold text-ink-muted group-hover:text-terracotta-dark transition-colors">
                      Contribution
                    </div>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-forest mt-1">
                      ₹{amt.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] text-terracotta-dark font-medium mt-1 inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Donate</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Campaign Direct Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link href="/donate?programme=HANUMAN_MURTI">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold shadow-md group">
                    <Heart className="w-4 h-4 mr-2 fill-current transition-transform duration-200 group-hover:scale-110" />
                    <span>Enter Custom Amount &amp; Proceed to Donate</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/contact?category=CSR%20%26%20Institutional%20Partnerships">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <span>Institutional / CSR Partnership Inquiries</span>
                  </Button>
                </Link>
              </div>

              {/* Financial Transparency & Progress Notice */}
              <div className="pt-4 border-t border-border-soft text-center text-xs text-ink-muted space-y-1">
                <p>
                  <strong>Financial Transparency:</strong> Verified campaign progress metrics and audit statements will be published upon conclusion of the ongoing feasibility phase.
                </p>
                <p className="text-[11px]">
                  Receipts with cryptographic SHA-256 integrity hash are generated instantly and permanently accessible in your authenticated Donor Portal.
                </p>
              </div>
            </Card>
          </Reveal>
        </section>

        {/* SECTION E: PROJECT UPDATES & MILESTONE REGISTRY */}
        <section id="updates" className="scroll-mt-24 space-y-6">
          <Reveal direction="up">
            <SectionHeader
              badge="Progress Registry"
              title="Official Project Updates & Milestones"
              subtitle="Documented institutional progression verified by the Trust Board."
            />
          </Reveal>

          <div className="max-w-3xl mx-auto space-y-4">
            <StaggerGroup staggerDelay={0.07}>
              {MILESTONES.map((m, idx) => (
                <StaggerItem key={idx}>
                  <Card padding="md" className="bg-white border-border-soft flex items-start gap-4 hover:border-terracotta/40 hover:shadow-xs transition-all duration-300">
                    <div className="w-10 h-10 rounded-xs bg-forest/10 flex items-center justify-center shrink-0 text-forest mt-0.5">
                      <Calendar className="w-5 h-5 text-forest" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[11px] font-mono text-terracotta-dark font-semibold">
                          {m.date}
                        </span>
                        <Badge
                          variant={
                            m.status === "COMPLETED"
                              ? "forest"
                              : m.status === "ACTIVE"
                              ? "gold"
                              : "outline"
                          }
                          size="sm"
                        >
                          {m.status}
                        </Badge>
                      </div>
                      <h4 className="font-serif font-bold text-forest text-base">{m.title}</h4>
                      <p className="text-xs text-ink-sand leading-relaxed">{m.description}</p>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* SECTION F: FREQUENTLY ASKED QUESTIONS */}
        <section className="space-y-6">
          <Reveal direction="up">
            <SectionHeader
              badge="Common Questions"
              title="Campaign FAQs & Institutional Clarifications"
              subtitle="Straightforward answers concerning project governance, height, and fund segregation."
            />
          </Reveal>

          <Reveal direction="up" delay={0.08} className="max-w-4xl mx-auto bg-white rounded-sm border border-border-soft p-6 sm:p-8 shadow-xs">
            <Accordion
              items={FAQS.map((faq) => ({
                question: faq.q,
                answer: faq.a,
                category: "Project Governance & Scope",
              }))}
            />
          </Reveal>
        </section>

        {/* BOTTOM INSTITUTIONAL INVITATION */}
        <Reveal direction="up">
          <section className="bg-forest-deep text-cream rounded-xs p-8 sm:p-12 text-center space-y-6 border border-sand/30 shadow-elevated">
            <div className="w-12 h-12 rounded-full bg-sand/20 border border-sand/40 flex items-center justify-center mx-auto text-sand">
              <Sparkles className="w-6 h-6 text-sand" />
            </div>
            <div className="max-w-2xl mx-auto space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Join the Journey of Faith, Strength and Service
              </h3>
              <p className="text-xs sm:text-sm text-cream/80 leading-relaxed font-sans">
                Become part of a monumental cultural undertaking for Odisha. Every contribution is welcomed with full institutional transparency, documented purpose, and official receipting.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/donate?programme=HANUMAN_MURTI">
                <Button variant="primary" size="lg" className="!bg-sand !text-forest-deep hover:!bg-cream font-bold group">
                  <Heart className="w-4 h-4 mr-2 fill-current text-terracotta transition-transform duration-200 group-hover:scale-110" />
                  <span>Contribute to Hanuman Murti Project</span>
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white/10">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>View Institutional Reports</span>
                </Button>
              </Link>
            </div>
          </section>
        </Reveal>
      </Container>
    </div>
  );
}
