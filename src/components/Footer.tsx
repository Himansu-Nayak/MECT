import React from "react";
import Link from "next/link";
import { TRUST_CONFIG } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldAlert,
  Mail,
  MapPin,
  ArrowRight,
  Clock,
  ShieldCheck,
  Scale,
  BookOpen,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#072617] text-[#EDE6D8] border-t border-[#C5A059]/20 pt-16 pb-12">
      <Container size="default" className="space-y-12">
        {/* Tier 1: Mandatory Statutory & Compliance Transparency Notice Box */}
        <div className="bg-[#0B3B24]/90 border border-[#C5A059]/40 rounded-xs p-5 sm:p-6 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xs bg-[#072617] border border-[#C5A059]/40 flex items-center justify-center shrink-0 text-[#E4C88A]">
              <ShieldAlert className="w-5 h-5 text-[#E4C88A]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#E4C88A] tracking-wider uppercase text-[11px] font-sans">
                  Statutory & Compliance Transparency Notice
                </span>
                <Badge variant="gold-dark" size="sm">
                  Fiduciary Standard
                </Badge>
              </div>
              <p className="text-white/85 text-[12px] mt-1.5 leading-relaxed max-w-4xl">
                {TRUST_CONFIG.legal.registrationNotice} MAHAVIR TRUST operates under a strict{" "}
                <strong className="text-white font-semibold">100% Direct-to-College Disbursal Policy</strong>.
                Zero cash transactions, commercial agent intermediaries, or unauthorized donations are accepted on this portal.
              </p>
            </div>
          </div>
          <Link
            href="/governance"
            className="inline-flex items-center gap-1.5 text-xs text-[#E4C88A] hover:text-white font-semibold whitespace-nowrap px-4 py-2.5 bg-[#072617] border border-[#C5A059]/40 rounded-xs transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-[#C5A059]"
          >
            <span>Fiduciary Charter</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Tier 2: Main Institutional Grid (5 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-10 border-b border-white/10">
          {/* Col 1 & 2: Institutional Brand & Secretariat */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-3.5 group focus-visible:outline-2 focus-visible:outline-[#C5A059]"
              aria-label="MAHAVIR TRUST Homepage"
            >
              <div className="w-10 h-10 rounded-xs bg-[#0B3B24] border-2 border-[#C5A059] flex items-center justify-center text-[#E4C88A] font-serif font-bold text-xl shadow-xs group-hover:bg-[#072617] transition-colors shrink-0">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl text-white tracking-wider group-hover:text-[#E4C88A] transition-colors">
                  MAHAVIR TRUST
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#E4C88A]">
                  Odisha Educational Foundation
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/75 leading-relaxed max-w-sm font-sans">
              {TRUST_CONFIG.subtext}
            </p>

            <div className="pt-2 text-xs text-white/70 space-y-2.5 font-sans">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">
                  {TRUST_CONFIG.contact.addressLine1}, {TRUST_CONFIG.contact.city}, {TRUST_CONFIG.contact.state} - {TRUST_CONFIG.contact.pin}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${TRUST_CONFIG.contact.generalEmail}`}
                  className="hover:text-[#E4C88A] transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                >
                  {TRUST_CONFIG.contact.generalEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" aria-hidden="true" />
                <span>Secretariat Hours: Mon - Fri (10:00 AM - 5:00 PM IST)</span>
              </div>
            </div>
          </div>

          {/* Col 3: Scholarship Grants */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#E4C88A] font-sans flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" aria-hidden="true" />
              <span>Scholarship Grants</span>
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/scholarships" className="hover:text-white transition-colors">
                  Higher Education Grants
                </Link>
              </li>
              <li>
                <Link href="/scholarships#eligibility" className="hover:text-white transition-colors">
                  Eligibility Matrix & Norms
                </Link>
              </li>
              <li>
                <Link href="/programmes" className="hover:text-white transition-colors">
                  Project Samarth Study Hubs
                </Link>
              </li>
              <li>
                <Link href="/scholarships" className="hover:text-white transition-colors">
                  Pratibha STEM Fellowship
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional Governance */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#E4C88A] font-sans flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" aria-hidden="true" />
              <span>Trust Governance</span>
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/governance" className="hover:text-white transition-colors">
                  Fiduciary Charter & Ethics
                </Link>
              </li>
              <li>
                <Link href="/governance#trustees" className="hover:text-white transition-colors">
                  Trustee Board Structure
                </Link>
              </li>
              <li>
                <Link href="/governance#disbursal" className="hover:text-white transition-colors">
                  Direct Disbursal Guarantee
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-white transition-colors">
                  Odisha 30-District Mandate
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Foundational Heritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Community & Grievance */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#E4C88A] font-sans flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" aria-hidden="true" />
              <span>Get Involved</span>
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <Link href="/volunteer" className="hover:text-white transition-colors">
                  Academic Mentors Network
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-white transition-colors">
                  College Institutional Liaison
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Corporate CSR Partnership
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Direct Secretariat Desk
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-white transition-colors">
                  Accessibility Commitment
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Tier 3: Bottom Legal & Statutory Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/60 gap-4">
          <p>
            © {currentYear} MAHAVIR TRUST (Odisha, India). All institutional rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-white/70">
            <Link href="/privacy" className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]">
              Privacy Policy
            </Link>
            <span className="text-white/20" aria-hidden="true">•</span>
            <Link href="/terms" className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]">
              Terms of Use
            </Link>
            <span className="text-white/20" aria-hidden="true">•</span>
            <Link href="/accessibility" className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]">
              Accessibility (WCAG 2.2 AA)
            </Link>
            <span className="text-white/20" aria-hidden="true">•</span>
            <Link href="/governance" className="hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]">
              Statutory Disclosures
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
