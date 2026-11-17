"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ShieldCheck, FileCheck, Landmark, ArrowRight, Building2, CheckCircle2 } from "lucide-react";

export function CompactTrustStrip() {
  const credentials = [
    {
      label: "Registered Public Trust",
      detail: "Deed 2013 • Balangir No. 40311302194",
      icon: Landmark,
    },
    {
      label: "Sections 12A & 80G",
      detail: "Income-tax Act • URN: AADTM5474FE20231",
      icon: FileCheck,
    },
    {
      label: "MCA CSR-1 Registration",
      detail: "Reg: CSR00081063 • Schedule VII",
      icon: Building2,
    },
    {
      label: "NITI Aayog NGO Darpan",
      detail: "Enrolment: OD/2021/0285141",
      icon: CheckCircle2,
    },
  ];

  return (
    <section
      id="trust-strip"
      aria-label="Statutory Credentials Strip"
      className="bg-sand-light/60 border-b border-border-warm py-5 sm:py-6"
    >
      <Container size="default">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
            {credentials.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2 rounded-xs transition-colors"
                >
                  <div className="w-8 h-8 rounded-xs bg-forest/10 text-forest flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-forest" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-xs text-forest truncate">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-ink-sand leading-snug truncate">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 lg:pt-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-border-warm shrink-0 flex items-center justify-start lg:justify-end">
            <Link
              href="/statutory-disclosures"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-dark hover:text-forest transition-colors font-sans py-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
              <span>Statutory Disclosures Archive</span>
              <ArrowRight className="w-3 h-3 ml-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
