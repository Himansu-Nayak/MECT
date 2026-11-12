import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ORG } from "@content/org";
import { COMPLIANCE } from "@content/compliance";
import { TaxStatusNotice } from "@/components/compliance/TaxStatusNotice";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/MotionPrimitives";
import {
  ShieldCheck,
  Building2,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  Landmark,
  Phone,
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
                    Statutory &amp; Fiduciary Disclosure (Govt. of India / Govt. of Odisha)
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

        {/* Tier 2: Main Institutional Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-7 pb-10 border-b border-white/15">
          {/* Col 1 & 2: Institutional Brand, Multi-Sector Mission & Offices */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-3.5 group focus-visible:outline-2 focus-visible:outline-sand"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-sand bg-white flex items-center justify-center shadow-xs shrink-0 aspect-square">
                <Image
                  src={ORG.branding.logoPath}
                  alt={ORG.branding.logoAlt}
                  width={44}
                  height={44}
                  loading="lazy"
                  className="w-full h-full object-cover scale-[1.06]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base sm:text-lg text-white tracking-wide group-hover:text-sand transition-colors">
                  {ORG.name}
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-cream">
                  Public Charitable Trust ({ORG.shortName})
                </span>
              </div>
            </Link>

            <p className="text-xs text-cream/90 leading-relaxed max-w-sm font-sans">
              An irrevocable public charitable trust ({ORG.trustDeed.summaryLine}; {ORG.trustDeed.bookVolume}). {ORG.subtext}
            </p>

            <div className="pt-2 text-xs text-cream/90 space-y-2.5 font-sans">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sand shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">
                  <strong>{ORG.addresses.registered.title}:</strong> {ORG.addresses.registered.full}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-sand shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">
                  <strong>{ORG.addresses.corporateLiaison.title}:</strong> {ORG.addresses.corporateLiaison.full}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sand shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${ORG.emails.official}`}
                  className="hover:text-sand transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  {ORG.emails.official}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sand shrink-0" aria-hidden="true" />
                <a
                  href={ORG.helpline.href}
                  className="hover:text-sand transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Helpline: {ORG.helpline.display}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sand shrink-0" aria-hidden="true" />
                <span>Working Hours: {ORG.helpline.hours}</span>
              </div>
            </div>
          </div>

          {/* Col 2: About, Governance & Impact */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-cream block">
              About &amp; Governance
            </span>
            <ul className="space-y-2 text-xs text-cream/90">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  About the Trust (13+ Years)
                </Link>
              </li>
              <li>
                <Link
                  href="/governance"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Board of Trustees &amp; Charter
                </Link>
              </li>
              <li>
                <Link
                  href="/statutory-disclosures"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Statutory Disclosures
                </Link>
              </li>
              <li>
                <Link
                  href="/impact"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Our Impact &amp; Civic Metrics
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
                  href="/faq"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: The Five Development Sectors (Our Work) */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-cream block">
              Our Work (5 Sectors)
            </span>
            <ul className="space-y-2 text-xs text-cream/90">
              <li>
                <Link
                  href="/programmes#education"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  1. Education &amp; Remedial Coaching
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#women-empowerment"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  2. Women Empowerment &amp; Tailoring
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#water"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  3. Safe Water &amp; Jal Seva Kiosks
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#hunger-relief"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  4. Food Security &amp; Jan Ahar Relief
                </Link>
              </li>
              <li>
                <Link
                  href="/programmes#pillars"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  5. Community Welfare &amp; Relief
                </Link>
              </li>
              <li className="pt-1 border-t border-white/15">
                <Link
                  href="/scholarships"
                  className="hover:text-white transition-colors font-medium text-cream focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Higher Education Scholarships
                </Link>
              </li>
              <li>
                <Link
                  href="/scholarships/track"
                  className="hover:text-white transition-colors text-cream/85 focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Track Scholarship Application
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Get Involved & Statutory Credentials */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-cream block">
              Get Involved &amp; CSR
            </span>
            <ul className="space-y-2 text-xs text-cream/90">
              <li>
                <Link
                  href="/donate"
                  className="hover:text-white transition-colors font-semibold text-sand focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Donate Now
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
                  href="/csr-partnerships"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Corporate CSR Partnership
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                >
                  Contact &amp; Offices
                </Link>
              </li>
            </ul>

            {/* Quick Statutory References Summary */}
            <div className="pt-2 text-[11px] text-cream/85 space-y-1 border-t border-white/15">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sand block">
                Statutory Identifiers
              </span>
              <p>12A URN: <span className="text-white font-mono">{ORG.ids.urn12A}</span></p>
              <p>80G URN: <span className="text-white font-mono">{ORG.ids.urn80G}</span></p>
              <p>CSR-1: <span className="text-white font-mono">{ORG.ids.csr1}</span></p>
              <p>NGO Darpan: <span className="text-white font-mono">{ORG.ids.darpan}</span></p>
              <p>e-Anudaan: <span className="text-white font-mono">{ORG.ids.eAnudaan}</span></p>
              <p>PAN: <span className="text-white font-mono">{ORG.ids.pan}</span></p>
            </div>
          </div>

          {/* Col 5: Official State Bank of India Donation Account */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-cream flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
              <span>{ORG.bank.bankName} Transfer</span>
            </span>
            <div className="bg-forest-deep p-3 rounded-xs border border-sand/25 space-y-1.5 text-[11px]">
              <div>
                <span className="text-sage block">Bank Name:</span>
                <span className="text-white font-bold uppercase tracking-wide">{ORG.bank.bankName}</span>
              </div>
              <div>
                <span className="text-sage block">Account Holder:</span>
                <span className="text-white font-medium text-[10px] leading-tight block">
                  {ORG.bank.accountName}
                </span>
              </div>
              <div>
                <span className="text-sage block">Account No ({ORG.bank.accountType}):</span>
                <span className="text-sand font-mono font-bold tracking-wider">
                  {ORG.bank.accountNumber}
                </span>
              </div>
              <div>
                <span className="text-sage block">IFSC Code:</span>
                <span className="text-white font-mono font-bold">{ORG.bank.ifsc}</span>
              </div>
              <div>
                <span className="text-sage block">UPI ID (SBI Scan &amp; Pay):</span>
                <span className="text-sand font-mono font-bold">{ORG.bank.upiId}</span>
              </div>
              <div className="pt-1 text-[10px] text-cream/85 border-t border-white/15 leading-snug">
                {ORG.bank.branch}
              </div>
            </div>
            <Link
              href="/donate"
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs text-white font-bold px-3 py-2.5 bg-terracotta hover:bg-terracotta-dark border border-terracotta-dark rounded-xs shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-sand"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-white" aria-hidden="true" />
              <span>Donate Now</span>
            </Link>
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
              Architect: Himansu Nayak (HN)
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
              Fiduciary Charter
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
