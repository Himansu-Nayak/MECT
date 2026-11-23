import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HanumanMurtiVisual } from "@/components/campaigns/HanumanMurtiVisual";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/MotionPrimitives";
import { createPageMetadata } from "@/lib/seo";
import {
  Sparkles,
  GraduationCap,
  Heart,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
} from "lucide-react";

export const metadata = createPageMetadata({
  title: "Campaigns & Initiatives",
  description:
    "Explore institutional initiatives of Mahaveer Educational & Charitable Trust, including the proposed Hanuman Murti project and higher education support.",
  path: "/campaigns",
  ogImage: "/images/og-default.png",
});

export default function CampaignsDirectoryPage() {
  return (
    <div className="bg-cream min-h-screen pb-16">
      <PageHero
        title="Institutional Campaigns & Special Initiatives"
        description="Focused resource mobilisation, cultural preservation, and educational programmes designed for long-term community impact across Odisha."
        breadcrumbs={[{ label: "Campaigns" }]}
      />

      <Container size="default" className="py-12 space-y-12">
        <Reveal direction="up">
          <SectionHeader
            badge="Active &amp; Proposed Initiatives"
            title="Featured Institutional Undertakings"
            subtitle="Explore our dedicated campaign efforts with strictly segregated project ledgers and transparent oversight."
          />
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Campaign 1: The Grand Hanuman Murti Project */}
          <StaggerItem>
            <Card padding="lg" className="h-full bg-white border-border-soft hover:border-terracotta/40 hover:shadow-md transition-all duration-300 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="gold">Proposed Monument • 80–100 Ft</Badge>
                  <span className="text-[11px] font-mono text-ink-muted">Code: HANUMAN_MURTI</span>
                </div>
                <HanumanMurtiVisual variant="card" className="h-64" />
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest">
                    The Grand Hanuman Murti Project
                  </h3>
                  <p className="text-xs sm:text-sm text-terracotta-dark font-semibold mt-0.5">
                    A Monumental Vision of Faith, Devotion and Community Participation
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-ink-sand leading-relaxed">
                  A proposed 80 to 100-foot landmark celebrating Lord Hanuman as the supreme emblem of selfless service (Seva) and courage. Contributions are held in a strictly segregated project ledger.
                </p>
              </div>
              <div className="pt-4 border-t border-border-soft flex items-center justify-between gap-3">
                <Link href="/campaigns/hanuman-murti">
                  <Button variant="outline" size="sm" className="group">
                    <span>Explore Project Details</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/donate?programme=HANUMAN_MURTI">
                  <Button variant="primary" size="sm" className="font-bold group">
                    <Heart className="w-3.5 h-3.5 mr-1 fill-current transition-transform group-hover:scale-110" />
                    <span>Support Project</span>
                  </Button>
                </Link>
              </div>
            </Card>
          </StaggerItem>

          {/* Campaign 2: Free Education for 200 Students */}
          <StaggerItem>
            <Card padding="lg" className="h-full bg-white border-border-soft hover:border-terracotta/40 hover:shadow-md transition-all duration-300 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="forest">Proposed Target • Up to 200 Students</Badge>
                  <span className="text-[11px] font-mono text-ink-muted">Code: EDUCATION_LEARNING</span>
                </div>
                <div className="relative h-64 w-full rounded-xs overflow-hidden border border-border-soft group bg-forest shadow-xs">
                  <Image
                    src="/images/hero/mect-civic-pledge-classroom.webp"
                    alt="Rural secondary students participating in remedial education and civic pledge in Balangir"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/25 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 text-cream flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 text-xs bg-forest-dark/80 px-2.5 py-1 rounded-2xs border border-white/10 backdrop-blur-xs font-sans">
                      <GraduationCap className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
                      <span>Classroom Mentoring Circle</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-sand font-semibold bg-forest-dark/80 px-2 py-0.5 rounded-2xs border border-white/10">
                      Balangir Centre
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest">
                    Free Education (Proposed Target: Up to 200 Students)
                  </h3>
                  <p className="text-xs sm:text-sm text-forest font-semibold mt-0.5">
                    Proposed Initiative for Rural &amp; Tribal Scholars
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-ink-sand leading-relaxed">
                  Proposed target — up to 200 students, subject to formal board sanction and confirmed funding. Confirmed funded places currently stand at zero, based on the existing programme record. Phased rollout will provide comprehensive tuition, reference books, and competitive exam guidance.
                </p>
              </div>
              <div className="pt-4 border-t border-border-soft flex items-center justify-between gap-3">
                <Link href="/programmes#education">
                  <Button variant="outline" size="sm" className="group">
                    <span>Review Programme Details</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/donate?programme=EDUCATION_LEARNING">
                  <Button variant="primary" size="sm" className="font-bold group">
                    <Heart className="w-3.5 h-3.5 mr-1 fill-current transition-transform group-hover:scale-110" />
                    <span>Sponsor a Student</span>
                  </Button>
                </Link>
              </div>
            </Card>
          </StaggerItem>
        </StaggerGroup>
      </Container>
    </div>
  );
}
