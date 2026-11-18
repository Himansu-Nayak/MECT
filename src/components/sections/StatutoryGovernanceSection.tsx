"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { ORG } from "@content/org";
import {
  ShieldCheck,
  FileText,
  Building2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Lock,
  ArrowRight,
} from "lucide-react";

export function StatutoryGovernanceSection() {
  const credentials = [
    {
      title: "Registered Trust Deed",
      regNo: "Deed No. 40311302194",
      authority: "Balangir Sub-Registrar, Govt. of Odisha",
      date: "Executed 27-07-2013 • Registered 30-07-2013",
      icon: Building2,
      badge: "Deed Book 4, Vol 45",
    },
    {
      title: "Permanent Account Number",
      regNo: "PAN: AADTM5474F",
      authority: "Income Tax Department, Govt. of India",
      date: "Trust Status: Public Charitable Trust",
      icon: FileText,
      badge: "Govt. of India",
    },
    {
      title: "Section 12A & 80G Orders",
      regNo: "12A: AADTM5474FE20231 | 80G: AADTM5474FF20241",
      authority: "Income Tax Department (Form 10AC)",
      date: "Historical coverage: AY 2024-25 to AY 2026-27",
      icon: CheckCircle2,
      badge: "Statutory Order",
    },
    {
      title: "MCA CSR-1 Registration",
      regNo: "Reg No: CSR00081063",
      authority: "Ministry of Corporate Affairs (ROC Delhi)",
      date: "Approved: 09-11-2024 • SRN: N14617237",
      icon: ShieldCheck,
      badge: "Schedule VII Eligible",
    },
    {
      title: "NITI Aayog NGO Darpan",
      regNo: "Darpan ID: OR/2024/0466491",
      authority: "NITI Aayog, Government of India",
      date: "Enrolled voluntary organisation register",
      icon: ExternalLink,
      badge: "National Portal",
    },
    {
      title: "MoSJE e-Anudaan",
      regNo: "Portal ID: OR/00040466",
      authority: "Ministry of Social Justice & Empowerment",
      date: "Official government grant management portal",
      icon: FileText,
      badge: "Central Registry",
    },
  ];

  return (
    <section
      id="transparency-and-governance"
      aria-labelledby="statutory-heading"
      className="py-16 sm:py-20 md:py-24 bg-sand-light/35 border-b border-border-warm scroll-mt-16 relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-14">
        {/* Editorial Section Header */}
        <div className="max-w-3xl space-y-4">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-xs border border-forest/30 bg-forest/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest font-sans shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-forest shrink-0" aria-hidden="true" />
              <span>Section 08 • Transparency &amp; Governance</span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.06}>
            <h2
              id="statutory-heading"
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest tracking-tight leading-tight [text-wrap:balance]"
            >
              Statutory Transparency &amp; Fiduciary Accountability
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-sm sm:text-base text-ink leading-relaxed font-sans">
              MECT operates with complete statutory openness. All legal registrations, tax exemption orders, and annual filing summaries are published for public verification and open to physical inspection at our registered office in Balangir.
            </p>
          </Reveal>
        </div>

        {/* 6 Statutory Credentials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((cred, idx) => {
            const Icon = cred.icon;
            return (
              <Reveal key={idx} direction="up" delay={0.05 * (idx + 1)}>
                <div className="p-6 bg-white rounded-xs border border-border-warm shadow-xs hover:border-sand transition-all flex flex-col justify-between space-y-4 h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xs bg-forest text-sand flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
                        {cred.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-sm text-forest">
                        {cred.title}
                      </h3>
                      <p className="font-mono text-xs font-bold text-terracotta-dark mt-0.5 break-all">
                        {cred.regNo}
                      </p>
                    </div>

                    <div className="text-[11px] text-ink-sand space-y-1 font-sans border-t border-border-warm pt-2">
                      <p className="font-semibold text-ink">{cred.authority}</p>
                      <p>{cred.date}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Physical Inspection Venue Notice */}
        <Reveal direction="up" delay={0.2}>
          <div className="p-5 sm:p-6 rounded-xs bg-white border border-border-warm shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-xs font-sans">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xs bg-sand-light text-forest flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-terracotta-dark" aria-hidden="true" />
              </div>
              <div className="space-y-1 max-w-2xl">
                <h4 className="font-serif font-bold text-sm text-forest">
                  Registered Physical Inspection Venue
                </h4>
                <p className="text-ink-sand leading-relaxed">
                  Mahaveer Educational &amp; Charitable Trust (MECT), Near Sai Mandir, Rugudipara, Balangir – 767001, Odisha. Public inspection of statutory certificates and audited annual financial statements is available during official working hours by prior written appointment via <code className="text-terracotta-dark font-mono font-bold">mect220@gmail.com</code>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/statutory-disclosures">
                <Button variant="primary" size="sm" className="font-bold group">
                  <span>Verify All Certificates</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" size="sm" className="text-xs">
                  <span>Public Records Library</span>
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
