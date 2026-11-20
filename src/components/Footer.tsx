import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ORG } from "@content/org";
import { COMPLIANCE } from "@content/compliance";
import { TaxStatusNotice } from "@/components/compliance/TaxStatusNotice";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion";
import {
  ShieldCheck,
  ArrowRight,
  Heart,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest text-cream border-t-2 border-terracotta pt-16 pb-12 transition-colors">
      <Reveal direction="fade" tone="slow">
        <Container size="default" className="space-y-12">
        {/* Tier 1: Mandatory Statutory & Tax Status Notice Box */}
        {COMPLIANCE.isTaxEligibilityConfirmed ? (
          <div className="bg-forest-deep border border-sand/30 rounded-xs p-5 sm:p-6 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xs bg-forest border border-sand/45 flex items-center justify-center shrink-0 text-sand">
                <ShieldCheck className="w-5 h-5 text-sand" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white tracking-wider uppercase text-[11px] font-sans">
                    Statutory &amp; Institutional Disclosure (Govt. of India / Govt. of Odisha)
                  </span>
                  <Badge variant="gold-dark" size="sm">
                    12A &amp; 80G Recorded
                  </Badge>
                  <Badge variant="forest" size="sm">
                    NGO Darpan Verified
                  </Badge>
                  <Badge variant="forest" size="sm">
                    e-Anudaan Enrolled
                  </Badge>
                </div>
                <p className="text-cream/95 text-[12px] mt-1.5 leading-relaxed max-w-4xl">
                  {ORG.trustDeed.summaryLine} ({ORG.trustDeed.bookVolume}). PAN: {ORG.ids.pan}. CSR-1: {ORG.ids.csr1}. NITI Aayog Darpan: {ORG.ids.darpan}. e-Anudaan: {ORG.ids.eAnudaan}. {COMPLIANCE.historical12ASummary} and {COMPLIANCE.historical80GSummary}. {ORG.chairman.honoraryClause}
                </p>
              </div>
            </div>
            <Link
              href="/statutory-disclosures"
              className="inline-flex items-center gap-1.5 text-xs text-white font-bold px-4 py-2.5 bg-terracotta hover:bg-terracotta-dark border border-terracotta-dark rounded-xs transition-colors shrink-0 shadow-xs focus-visible:outline-2 focus-visible:outline-sand"
            >
              <span>Verify Certificates</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <TaxStatusNotice variant="dark" />
        )}

        {/* Tier 2: Main Institutional 5-Column Grid (Restructured per Director Guidelines) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 pb-10 border-b border-white/15">
          {/* Column 1: Institution */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 group focus-visible:outline-2 focus-visible:outline-sand"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sand bg-white flex items-center justify-center shadow-xs shrink-0 aspect-square">
                <Image
                  src={ORG.branding.logoPath}
                  alt={ORG.branding.logoAlt}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="w-full h-full object-cover scale-[1.06]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sm sm:text-base text-white tracking-wide group-hover:text-sand transition-colors">
                  {ORG.name}
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-cream">
                  Public Charitable Trust ({ORG.shortName})
                </span>
              </div>
            </Link>

            <p className="text-xs text-cream/90 leading-relaxed font-sans">
              An irrevocable public charitable trust established under registered deed in Odisha. Dedicated to grassroots education, women&apos;s livelihoods, community healthcare, and cultural preservation.
            </p>

            <div className="pt-1">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs text-sand hover:text-white font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-sand"
              >
                <span>Learn About Our Heritage</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Column 2: Our Work */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-sand block">
              Our Work
            </span>
            <ul className="space-y-2 text-xs text-cream/90">
              <li>
                <Link
                  href="/programmes#education"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Education &amp; Remedial Coaching
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#women-empowerment"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Women Empowerment &amp; Tailoring
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#sports-extracurricular"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Sports &amp; Extracurriculars
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#water"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Safe Water &amp; Jal Seva Kiosks
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#food-relief"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Food Relief &amp; Jan Ahar
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#community-welfare"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Community Welfare &amp; Rural Relief
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#higher-education"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Higher Education Scholarships
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Campaigns */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-sand block">
              Campaigns
            </span>
            <ul className="space-y-2 text-xs text-cream/90">
              <li>
                <Link
                  href="/campaigns/hanuman-murti"
                  className="hover:text-white font-semibold text-sand transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  The Grand Hanuman Murti Project
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#free-education-200"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Free Education (Target: Up to 200)
                </Link>
              </li>
              <li>
                <Link
                  href="/campaigns"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  All Institutional Initiatives
                </Link>
              </li>
              <li>
                <Link
                  href="/csr-partnerships"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Corporate CSR Collaborations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-sand block">
              Resources
            </span>
            <ul className="space-y-2 text-xs text-cream/90">
              <li>
                <Link
                  href="/stories"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Blog &amp; Field Dispatches
                </Link>
              </li>
              <li>
                <Link
                  href="/memories-gallery"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Memories &amp; Archival Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/reports#library"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Public Records Library
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Annual Reports &amp; Audits
                </Link>
              </li>
              <li>
                <Link
                  href="/statutory-disclosures"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Statutory Accreditation Register
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Support & Inquiries */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-sand block">
              Support &amp; Inquiries
            </span>
            <ul className="space-y-2 text-xs text-cream/90">
              <li>
                <Link
                  href="/donate"
                  className="hover:text-white font-semibold text-sand transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Donate to MECT
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Donor Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Create Supporter Account
                </Link>
              </li>
              <li>
                <Link
                  href="/portal/dashboard"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Donor Portal &amp; 80G Receipts
                </Link>
              </li>
              <li>
                <Link
                  href="/volunteer"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Volunteer &amp; Mentorship
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Secretariat Inquiry Desk
                </Link>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/donate"
                className="w-full min-h-[40px] inline-flex items-center justify-center gap-1.5 text-xs text-white font-bold px-3 py-2 bg-terracotta hover:bg-terracotta-dark border border-terracotta-dark rounded-xs shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-sand"
              >
                <Heart className="w-3.5 h-3.5 fill-current text-white" aria-hidden="true" />
                <span>Support Our Work</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tier 3: Bottom Legal & Developer Acknowledgement Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-cream/90 font-sans">
          <div>
            &copy; {ORG.foundedYear}&ndash;{currentYear} {ORG.legalName}. All rights reserved.{" "}
            {ORG.trustDeed.shortDeedRef}
          </div>

          <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
            <Link
              href="/about#developer-credit"
              className="inline-flex items-center min-h-[24px] py-1 text-sand hover:text-white transition-colors font-medium focus-visible:outline-2 focus-visible:outline-sand"
            >
              Website developed by Himansu Nayak
            </Link>
            <span className="text-white/25" aria-hidden="true">|</span>
            <Link
              href="/privacy"
              className="inline-flex items-center min-h-[24px] py-1 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
            >
              Privacy Policy
            </Link>
            <span className="text-white/25" aria-hidden="true">|</span>
            <Link
              href="/terms"
              className="inline-flex items-center min-h-[24px] py-1 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
            >
              Terms of Service
            </Link>
            <span className="text-white/25" aria-hidden="true">|</span>
            <Link
              href="/accessibility"
              className="inline-flex items-center min-h-[24px] py-1 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
            >
              Accessibility Statement
            </Link>
            <span className="text-white/25" aria-hidden="true">|</span>
            <Link
              href="/governance"
              className="inline-flex items-center min-h-[24px] py-1 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
            >
              Governance Charter
            </Link>
          </div>
        </div>

        {/* Photographic Attribution Notice */}
        <div className="pt-3 mt-3 border-t border-white/10 text-[10.5px] text-cream/80 font-sans leading-relaxed">
          Hero backdrop photography combines MECT Balangir archive &amp; field photography with illustrative stock photography via Wikimedia Commons: &ldquo;Self Help Group&rdquo; by Ganesh Dhamodkar (
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-sand/60 hover:text-sand"
          >
            CC BY 4.0
          </a>
          , cropped &amp; exposure-balanced) and &ldquo;Rammohun Library Main Reading Room&rdquo; by Sumitsurai (
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-sand/60 hover:text-sand"
          >
            CC BY-SA 4.0
          </a>
          , cropped &amp; exposure-balanced), plus a user-supplied outreach reference image. See full asset register in repository documentation.
        </div>
      </Container>
      </Reveal>
    </footer>
  );
}
