"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Briefcase,
  Users,
  ShieldCheck,
  PhoneCall,
  X,
  Layers,
} from "lucide-react";
import { TRUST_CONFIG } from "@/lib/config";

export function QuickActionDock() {
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile dock on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const quickLinks = [
    {
      href: "/donate",
      label: "Donate (80G)",
      subtext: "50% Tax Deduction",
      icon: Heart,
      iconColor: "text-[#D97706]",
      highlight: true,
    },
    {
      href: "/csr-partnerships",
      label: "CSR Partnerships",
      subtext: "MCA Reg CSR00081063",
      icon: Briefcase,
      iconColor: "text-[#E4C88A]",
    },
    {
      href: "/statutory-disclosures",
      label: "Statutory Vault",
      subtext: "12A, 80G, Darpan",
      icon: ShieldCheck,
      iconColor: "text-[#E4C88A]",
    },
    {
      href: "/volunteer",
      label: "Join as Volunteer",
      subtext: "Mentor & Support",
      icon: Users,
      iconColor: "text-[#E4C88A]",
    },
    {
      href: `tel:${TRUST_CONFIG.contact.phones.helpline}`,
      label: "Secretariat Desk",
      subtext: TRUST_CONFIG.contact.phones.helpline,
      icon: PhoneCall,
      iconColor: "text-[#E4C88A]",
    },
  ];

  return (
    <>
      {/* Desktop Floating Right Ribbon Dock (print:hidden) */}
      <aside
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col bg-[#0A192F]/95 backdrop-blur-md border-l border-y border-[#C5A059]/40 rounded-l-md shadow-2xl overflow-hidden py-1 transition-all print:hidden"
        aria-label="Institutional Quick Actions Dock"
      >
        {quickLinks.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 text-white/90 hover:text-[#E4C88A] hover:bg-white/5 transition-colors group relative border-b border-white/5 last:border-b-0 focus-visible:outline-2 focus-visible:outline-[#C5A059] ${
                item.highlight ? "bg-[#D97706]/10" : ""
              }`}
              title={`${item.label} — ${item.subtext}`}
            >
              <div
                className={`w-8 h-8 rounded-xs bg-[#0F172A] border border-[#C5A059]/30 flex items-center justify-center ${item.iconColor} group-hover:scale-105 transition-transform shrink-0`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="flex flex-col pr-2">
                <span className="text-xs font-semibold tracking-wide leading-tight text-white group-hover:text-[#E4C88A]">
                  {item.label}
                </span>
                <span className="text-[10px] text-white/60 font-sans">
                  {item.subtext}
                </span>
              </div>
            </Link>
          );
        })}
      </aside>

      {/* Mobile Floating Action Button & Accessible Modal Sheet (print:hidden) */}
      <div className="xl:hidden print:hidden">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className="fixed bottom-6 right-5 z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 rounded-full bg-[#0A192F] text-[#E4C88A] border-2 border-[#C5A059] shadow-xl flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#C5A059] hover:scale-105 transition-transform"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close quick actions menu" : "Open quick actions menu"}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-white" aria-hidden="true" />
            ) : (
              <Layers className="w-5 h-5 text-[#E4C88A]" aria-hidden="true" />
            )}
          </button>
        </div>

        {isOpen && (
          <div
            className="fixed bottom-20 right-5 w-72 bg-[#0A192F] text-white border border-[#C5A059]/40 rounded-md shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
            role="menu"
            aria-label="Mobile Quick Access Services"
          >
            <div className="px-2 py-1.5 border-b border-white/10 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">
                Quick Institutional Access
              </span>
            </div>
            <div className="space-y-1">
              {quickLinks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-xs hover:bg-white/5 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-xs bg-[#0F172A] border border-[#C5A059]/30 flex items-center justify-center text-[#E4C88A] shrink-0">
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-white/60">
                        {item.subtext}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
