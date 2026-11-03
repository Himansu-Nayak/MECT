"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquareText,
  PhoneCall,
  FileDown,
  HeartHandshake,
  X,
  Sparkles,
} from "lucide-react";

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

  return (
    <>
      {/* Desktop Floating Right Ribbon Dock (print:hidden) */}
      <aside
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col bg-[#072617]/95 backdrop-blur-md border-l border-y border-[#C5A059]/40 rounded-l-md shadow-2xl overflow-hidden py-1 transition-all print:hidden"
        aria-label="Quick Access Services Dock"
      >
        <Link
          href="/contact"
          className="flex items-center gap-3 px-3.5 py-2.5 text-white/90 hover:text-[#E4C88A] hover:bg-white/5 transition-colors group relative border-b border-white/5 focus-visible:outline-2 focus-visible:outline-[#C5A059]"
          title="Send Official Inquiry to Secretariat"
        >
          <div className="w-8 h-8 rounded-xs bg-[#0B3B24] border border-[#C5A059]/30 flex items-center justify-center text-[#E4C88A] group-hover:scale-105 transition-transform shrink-0">
            <MessageSquareText className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium tracking-wide pr-2">
            Quick Inquiry
          </span>
        </Link>

        <Link
          href="/scholarships"
          className="flex items-center gap-3 px-3.5 py-2.5 text-white/90 hover:text-[#E4C88A] hover:bg-white/5 transition-colors group relative border-b border-white/5 focus-visible:outline-2 focus-visible:outline-[#C5A059]"
          title="Explore Higher Education Scholarships"
        >
          <div className="w-8 h-8 rounded-xs bg-[#0B3B24] border border-[#C5A059]/30 flex items-center justify-center text-[#E4C88A] group-hover:scale-105 transition-transform shrink-0">
            <FileDown className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium tracking-wide pr-2">
            Scholarships
          </span>
        </Link>

        <Link
          href="/volunteer"
          className="flex items-center gap-3 px-3.5 py-2.5 text-white/90 hover:text-[#E4C88A] hover:bg-white/5 transition-colors group relative border-b border-white/5 focus-visible:outline-2 focus-visible:outline-[#C5A059]"
          title="Join Volunteer and Mentor Network"
        >
          <div className="w-8 h-8 rounded-xs bg-[#0B3B24] border border-[#C5A059]/30 flex items-center justify-center text-[#E4C88A] group-hover:scale-105 transition-transform shrink-0">
            <HeartHandshake className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium tracking-wide pr-2">
            Mentor a Scholar
          </span>
        </Link>

        <Link
          href="/contact"
          className="flex items-center gap-3 px-3.5 py-2.5 text-white/90 hover:text-[#E4C88A] hover:bg-white/5 transition-colors group relative focus-visible:outline-2 focus-visible:outline-[#C5A059]"
          title="Secretariat Desk Helpline"
        >
          <div className="w-8 h-8 rounded-xs bg-[#0B3B24] border border-[#C5A059]/30 flex items-center justify-center text-[#E4C88A] group-hover:scale-105 transition-transform shrink-0">
            <PhoneCall className="w-4 h-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium tracking-wide pr-2">
            Secretariat Desk
          </span>
        </Link>
      </aside>

      {/* Mobile Floating Action Button & Accessible Modal Sheet (print:hidden) */}
      <div className="xl:hidden print:hidden">
        {/* Backdrop overlay when open */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className="fixed bottom-6 right-5 z-50">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close Quick Actions Menu" : "Open Quick Actions Menu"}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className="w-13 h-13 rounded-full bg-[#072617] text-[#E4C88A] border-2 border-[#C5A059] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]"
          >
            {isOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Sparkles className="w-6 h-6 animate-pulse" aria-hidden="true" />
            )}
          </button>

          {isOpen && (
            <div
              role="dialog"
              aria-label="Quick Actions Navigation"
              className="absolute bottom-16 right-0 w-72 bg-[#072617] border border-[#C5A059]/40 rounded-sm shadow-2xl p-3 space-y-2 animate-in fade-in zoom-in-95 duration-150 text-white"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#E4C88A]">
                  MAHAVIR Quick Actions
                </span>
                <span className="text-[10px] text-white/50 font-mono">Esc to close</span>
              </div>

              <div className="space-y-1">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xs text-xs text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                >
                  <div className="w-7 h-7 rounded-xs bg-[#0B3B24] border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                    <MessageSquareText className="w-3.5 h-3.5 text-[#E4C88A]" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">Send Official Inquiry</span>
                    <span className="text-[10px] text-white/60">Secretariat inquiry form</span>
                  </div>
                </Link>

                <Link
                  href="/scholarships"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xs text-xs text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                >
                  <div className="w-7 h-7 rounded-xs bg-[#0B3B24] border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                    <FileDown className="w-3.5 h-3.5 text-[#E4C88A]" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">Scholarship Schemes</span>
                    <span className="text-[10px] text-white/60">Undergraduate & STEM aid</span>
                  </div>
                </Link>

                <Link
                  href="/volunteer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xs text-xs text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                >
                  <div className="w-7 h-7 rounded-xs bg-[#0B3B24] border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#E4C88A]" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">Mentor a Scholar</span>
                    <span className="text-[10px] text-white/60">Volunteer for Odisha youth</span>
                  </div>
                </Link>

                <Link
                  href="/governance"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xs text-xs text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                >
                  <div className="w-7 h-7 rounded-xs bg-[#0B3B24] border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-3.5 h-3.5 text-[#E4C88A]" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">Fiduciary Governance</span>
                    <span className="text-[10px] text-white/60">Charter & transparency</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
