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
  Building2,
  Heart,
  Landmark,
  FileCheck,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A192F] text-[#EDE6D8] border-t border-[#C5A059]/30 pt-16 pb-12 transition-colors">
      <Container size="default" className="space-y-12">
        {/* Tier 1: Mandatory Statutory & Compliance Transparency Notice Box */}
        <div className="bg-[#0F172A] border border-[#C5A059]/40 rounded-xs p-5 sm:p-6 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xs bg-[#0A192F] border border-[#C5A059]/50 flex items-center justify-center shrink-0 text-[#E4C88A]">
              <ShieldCheck className="w-5 h-5 text-[#E4C88A]" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#E4C88A] tracking-wider uppercase text-[11px] font-sans">
                  Statutory & Fiduciary Disclosure (Govt. of India / Govt. of Odisha)
                </span>
                <Badge variant="gold-dark" size="sm">
                  12A & 80G Certified
                </Badge>
                <Badge variant="forest" size="sm">
                  MCA CSR-1 Registered
                </Badge>
              </div>
              <p className="text-white/85 text-[12px] mt-1.5 leading-relaxed max-w-4xl">
                {TRUST_CONFIG.legal.registrationNotice} Donors are eligible for a{" "}
                <strong className="text-white font-semibold">50% deduction on taxable income under Section 80G</strong>.
                All grants are remitted directly to institutional or operational accounts under a strict zero-cash policy.
              </p>
            </div>
          </div>
          <Link
            href="/statutory-disclosures"
            className="inline-flex items-center gap-1.5 text-xs text-[#0A192F] font-bold px-4 py-2.5 bg-[#C5A059] hover:bg-[#E4C88A] rounded-xs transition-colors shrink-0 shadow-xs focus-visible:outline-2 focus-visible:outline-[#C5A059]"
          >
            <span>Verify Certificates</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Tier 2: Main Institutional Grid (5 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-10 border-b border-white/10">
          {/* Col 1 & 2: Institutional Brand, Heritage & Offices */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-3.5 group focus-visible:outline-2 focus-visible:outline-[#C5A059]"
              aria-label="MAHAVIR TRUST Homepage"
            >
              <div className="w-10 h-10 rounded-xs bg-[#0F172A] border-2 border-[#C5A059] flex items-center justify-center text-[#E4C88A] font-serif font-bold text-xl shadow-xs group-hover:bg-[#07111E] transition-colors shrink-0">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg text-white tracking-wider group-hover:text-[#E4C88A] transition-colors">
                  MAHAVIR TRUST
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-[#E4C88A]">
                  Mahaveer Educational & Charitable Trust (MECT)
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/75 leading-relaxed max-w-sm font-sans">
              An irrevocable public charitable trust established by registered Trust Deed on 27th July 2013 (Balangir Sub-Registrar), advancing higher education, rural women's skilling, and clean drinking water relief across Odisha.
            </p>

            <div className="pt-2 text-xs text-white/70 space-y-2.5 font-sans">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">
                  <strong>Registered Office:</strong> {TRUST_CONFIG.contact.registeredOffice.addressLine1}, {TRUST_CONFIG.contact.registeredOffice.city}, {TRUST_CONFIG.contact.registeredOffice.state} - {TRUST_CONFIG.contact.registeredOffice.pin}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">
                  <strong>Corporate Liaison:</strong> {TRUST_CONFIG.contact.corporateOffice.addressLine1}, {TRUST_CONFIG.contact.corporateOffice.city}, {TRUST_CONFIG.contact.corporateOffice.state} - {TRUST_CONFIG.contact.corporateOffice.pin}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${TRUST_CONFIG.contact.emails.official}`}
                  className="hover:text-[#E4C88A] transition-colors"
                >
                  {TRUST_CONFIG.contact.emails.official}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" aria-hidden="true" />
                <span>Working Hours: {TRUST_CONFIG.contact.hours}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Statutory Disclosures & Compliance */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E4C88A] block">
              Statutory Disclosures
            </span>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <Link href="/statutory-disclosures" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Trust Deed (2013)</span>
                  <span className="text-[10px] text-[#C5A059]">40311302194</span>
                </Link>
              </li>
              <li>
                <Link href="/statutory-disclosures" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>PAN (Income Tax)</span>
                  <span className="text-[10px] text-[#C5A059]">{TRUST_CONFIG.statutory.pan}</span>
                </Link>
              </li>
              <li>
                <Link href="/statutory-disclosures" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Section 12A URN</span>
                  <span className="text-[10px] text-[#C5A059]">{TRUST_CONFIG.statutory.section12AUrn}</span>
                </Link>
              </li>
              <li>
                <Link href="/statutory-disclosures" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Section 80G URN</span>
                  <span className="text-[10px] text-[#C5A059]">{TRUST_CONFIG.statutory.section80GUrn}</span>
                </Link>
              </li>
              <li>
                <Link href="/statutory-disclosures" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>MCA CSR-1 Reg</span>
                  <span className="text-[10px] text-[#C5A059]">{TRUST_CONFIG.statutory.mcaCsrNumber}</span>
                </Link>
              </li>
              <li>
                <Link href="/statutory-disclosures" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>NITI Aayog Darpan</span>
                  <span className="text-[10px] text-[#C5A059]">{TRUST_CONFIG.statutory.ngoDarpanId}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Core Programmes & CSR */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E4C88A] block">
              Civic Programmes & CSR
            </span>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <Link href="/programmes#education" className="hover:text-white transition-colors">
                  Remedial Rural Education (Balangir)
                </Link>
              </li>
              <li>
                <Link href="/programmes#women-empowerment" className="hover:text-white transition-colors">
                  Women's Vocational Tailoring
                </Link>
              </li>
              <li>
                <Link href="/programmes#water" className="hover:text-white transition-colors">
                  Jal Seva Clean Drinking Water
                </Link>
              </li>
              <li>
                <Link href="/programmes#hunger-relief" className="hover:text-white transition-colors">
                  Jan Ahar Destitute Nutrition
                </Link>
              </li>
              <li>
                <Link href="/csr-partnerships" className="hover:text-white transition-colors font-semibold text-[#E4C88A]">
                  Corporate CSR (Schedule VII)
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-white transition-colors">
                  Civic Beneficiary Metrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Direct Bank Transfer for 80G Donations */}
          <div className="space-y-3 font-sans">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E4C88A] block flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-[#C5A059]" aria-hidden="true" />
              <span>Direct Bank NEFT/RTGS</span>
            </span>
            <div className="bg-[#0F172A] p-3 rounded-xs border border-white/10 space-y-1.5 text-[11px]">
              <div>
                <span className="text-white/50 block">Bank Name:</span>
                <span className="text-white font-medium">{TRUST_CONFIG.bank.bankName}</span>
              </div>
              <div>
                <span className="text-white/50 block">Account Name:</span>
                <span className="text-white font-medium">{TRUST_CONFIG.bank.accountName}</span>
              </div>
              <div>
                <span className="text-white/50 block">Account No:</span>
                <span className="text-[#E4C88A] font-mono font-bold tracking-wider">{TRUST_CONFIG.bank.accountNumber}</span>
              </div>
              <div>
                <span className="text-white/50 block">IFSC Code:</span>
                <span className="text-white font-mono font-bold">{TRUST_CONFIG.bank.ifsc}</span>
              </div>
            </div>
            <Link
              href="/donate"
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-white font-bold px-3 py-2 bg-[#D97706] hover:bg-[#B45309] rounded-xs shadow-xs transition-colors"
            >
              <Heart className="w-3 h-3 fill-current" aria-hidden="true" />
              <span>Online 80G Donation</span>
            </Link>
          </div>
        </div>

        {/* Tier 3: Bottom Legal & Developer Acknowledgement Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/60 font-sans">
          <div>
            © 2013–{currentYear} Mahaveer Educational & Charitable Trust (MECT). All rights reserved. Registered under Indian Trusts Act, 1882.
          </div>

          <div className="flex items-center space-x-4 flex-wrap">
            <Link href="/about#developer-credit" className="text-[#C5A059] hover:text-[#E4C88A] transition-colors font-medium">
              Architect: Himansu Nayak (HN)
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/governance" className="hover:text-white transition-colors">
              Fiduciary Charter
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
