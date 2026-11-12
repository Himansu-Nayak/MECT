"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { ORG } from "@content/org";

export function QuickActionDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileDock, setShowMobileDock] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Show compact mobile dock after scrolling past hero actions, and auto-tuck away when reaching footer
  useEffect(() => {
    const onScroll = () => {
      setShowMobileDock(window.scrollY > 320);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const footerEl = document.querySelector("footer");
    let observer: IntersectionObserver | null = null;
    if (footerEl && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => setIsNearFooter(entries[0]?.isIntersecting ?? false),
        { threshold: 0.12 }
      );
      observer.observe(footerEl);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  // Manage focus and scroll lock when mobile sheet opens/closes
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Focus first link in modal sheet
      const timer = setTimeout(() => {
        const firstLink = modalRef.current?.querySelector<HTMLElement>("a, button");
        firstLink?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  // Trap focus inside mobile sheet and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>("a, button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const quickLinks = [
    {
      href: "/donate",
      label: "Donate Now",
      subtext: "SBI • Direct Transfer",
      icon: Heart,
      iconColor: "text-white",
      highlight: true,
    },
    {
      href: "/csr-partnerships",
      label: "CSR Partnerships",
      subtext: "Schedule VII Projects",
      icon: Briefcase,
      iconColor: "text-cream",
    },
    {
      href: "/statutory-disclosures",
      label: "Statutory Vault",
      subtext: "12A, 80G, Darpan",
      icon: ShieldCheck,
      iconColor: "text-cream",
    },
    {
      href: "/volunteer",
      label: "Join as Volunteer",
      subtext: "Mentor & Support",
      icon: Users,
      iconColor: "text-cream",
    },
    {
      href: ORG.helpline.href,
      label: "Secretariat Desk",
      subtext: ORG.helpline.display,
      icon: PhoneCall,
      iconColor: "text-cream",
    },
  ];

  return (
    <>
      {/* Desktop Floating Right Ribbon Dock (print:hidden) */}
      <aside
        className="group/dock fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col w-[52px] hover:w-[228px] focus-within:w-[228px] bg-forest border-l border-y border-sand/35 rounded-l-md shadow-2xl overflow-hidden py-1 transition-all duration-200 print:hidden"
        aria-label="Institutional Quick Actions Dock"
      >
        {quickLinks.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-2.5 py-2.5 text-white hover:text-cream hover:bg-terracotta/40 transition-colors group relative border-b border-white/10 last:border-b-0 focus-visible:outline-2 focus-visible:outline-sand whitespace-nowrap ${
                item.highlight ? "bg-terracotta hover:bg-terracotta-dark" : ""
              }`}
              title={`${item.label} — ${item.subtext}`}
              aria-label={`${item.label} — ${item.subtext}`}
            >
              <div
                className={`w-8 h-8 rounded-xs ${
                  item.highlight ? "bg-terracotta-dark border-sand/50" : "bg-forest-deep border-sand/30"
                } border flex items-center justify-center ${item.iconColor} group-hover:scale-105 transition-transform shrink-0`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="hidden group-hover/dock:flex group-focus-within/dock:flex flex-col pr-2">
                <span className="text-xs font-semibold tracking-wide leading-tight text-white group-hover:text-sand">
                  {item.label}
                </span>
                <span className="text-[10px] text-cream/85 font-sans">
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
            className="fixed inset-0 bg-forest-deep/55 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}

        {((showMobileDock && !isNearFooter) || isOpen) && (
          <div className="fixed bottom-[max(0.625rem,env(safe-area-inset-bottom))] right-[62px] sm:bottom-5 sm:right-20 z-40">
            <button
              ref={triggerRef}
              onClick={() => setIsOpen(!isOpen)}
              className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-terracotta hover:bg-terracotta-dark text-white border-2 border-sand shadow-xl flex items-center justify-center focus-visible:outline-2 focus-visible:outline-sand hover:scale-105 active:scale-95 transition-transform"
              aria-expanded={isOpen}
              aria-haspopup="true"
              aria-controls="mobile-quick-actions-sheet"
              aria-label={isOpen ? "Close quick actions menu" : "Open quick actions menu"}
            >
              {isOpen ? (
                <X className="w-5 h-5 text-white" aria-hidden="true" />
              ) : (
                <Layers className="w-5 h-5 text-cream" aria-hidden="true" />
              )}
            </button>
          </div>
        )}

        {isOpen && (
          <div
            ref={modalRef}
            id="mobile-quick-actions-sheet"
            className="fixed bottom-18 sm:bottom-20 right-4 sm:right-5 w-[calc(100vw-2rem)] max-w-xs bg-forest text-cream border border-sand/40 rounded-md shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Quick Access Services"
          >
            <div className="px-2 py-1.5 border-b border-white/15 mb-2 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-sand">
                Quick Institutional Access
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-cream/75 hover:text-white p-1 rounded-xs"
                aria-label="Close quick actions panel"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-1">
              {quickLinks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 min-h-[44px] rounded-xs hover:bg-forest-deep/70 transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                  >
                    <div className="w-7 h-7 rounded-xs bg-terracotta border border-sand/30 flex items-center justify-center text-white shrink-0">
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-cream/80">
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
