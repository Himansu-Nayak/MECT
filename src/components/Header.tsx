"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TRUST_CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import {
  Menu,
  X,
  ChevronDown,
  Award,
  PhoneCall,
  ShieldCheck,
  Building2,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Scale,
} from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Monitor scroll for header backdrop elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Global keydown listener for Escape key to close open menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Dismiss dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Institutional Notification Ticker & Secretariat Bar */}
      <div
        className="bg-[#072617] text-[#EDE6D8] border-b border-[#C5A059]/30 text-xs py-1.5"
        role="region"
        aria-label="Institutional Announcements and Desk"
      >
        <Container size="default">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-xs bg-[#C5A059] text-[#072617] text-[10px] font-bold uppercase tracking-wider">
                Notice
              </span>
              <div className="overflow-hidden whitespace-nowrap text-xs text-white/90">
                <span className="inline-block animate-marquee font-medium">
                  📢 Academic Year 2026-27: Preliminary Higher Education Grant & Mentorship guidelines published for trustee review. Secretariat inquiry desk is open for educational institutions across all 30 districts of Odisha.
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4 shrink-0 text-[11px] text-white/80 font-sans">
              <Link
                href="/governance"
                className="hover:text-[#E4C88A] transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
              >
                Statutory Governance
              </Link>
              <span className="text-white/30" aria-hidden="true">|</span>
              <Link
                href="/scholarships"
                className="hover:text-[#E4C88A] transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
              >
                Eligibility Matrix
              </Link>
              <span className="text-white/30" aria-hidden="true">|</span>
              <Link
                href="/contact"
                className="hover:text-[#E4C88A] transition-colors flex items-center gap-1.5 text-[#E4C88A] font-semibold focus-visible:outline-2 focus-visible:outline-[#C5A059]"
              >
                <PhoneCall className="w-3 h-3 text-[#C5A059]" aria-hidden="true" />
                <span>Secretariat Desk</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar */}
      <nav
        ref={navRef}
        className={`w-full transition-all duration-200 border-b ${
          isScrolled
            ? "bg-[#FDFBF7]/95 backdrop-blur-md border-[#0B3B24]/15 shadow-sm py-2.5"
            : "bg-[#FDFBF7] border-[#0B3B24]/10 py-3.5"
        }`}
        aria-label="Main Navigation"
      >
        <Container size="default">
          <div className="flex items-center justify-between">
            {/* Institutional Brand / Monogram */}
            <Link
              href="/"
              className="flex items-center space-x-3.5 group focus-visible:outline-2 focus-visible:outline-[#C5A059]"
              aria-label="MAHAVIR TRUST Homepage"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xs bg-[#0B3B24] border-2 border-[#C5A059] flex items-center justify-center text-[#E4C88A] font-serif font-bold text-xl shadow-xs group-hover:bg-[#072617] transition-colors shrink-0">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-wider font-bold text-lg sm:text-xl text-[#0B3B24] leading-tight group-hover:text-[#072617] transition-colors">
                  MAHAVIR TRUST
                </span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-[#7A5E24] font-sans">
                  Odisha Educational Foundation
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {TRUST_CONFIG.navigation.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive =
                  pathname === item.href ||
                  (item.children && item.children.some((c) => pathname === c.href));
                const isItemOpen = openDropdown === item.label;

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      aria-expanded={hasChildren ? isItemOpen : undefined}
                      aria-haspopup={hasChildren ? "menu" : undefined}
                      className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059] ${
                        isActive
                          ? "text-[#0B3B24] font-bold bg-[#0B3B24]/8"
                          : "text-[#1C2421] hover:text-[#0B3B24] hover:bg-[#0B3B24]/4"
                      }`}
                    >
                      <span>{item.label}</span>
                      {hasChildren && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-[#1C2421]/60 transition-transform duration-200 ${
                            isItemOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </Link>

                    {/* Accessible Institutional Mega-Menu Flyout */}
                    {hasChildren && isItemOpen && (
                      <div
                        role="menu"
                        aria-label={`${item.label} sub-navigation`}
                        className={`absolute top-full left-0 bg-[#FDFBF7] border border-[#0B3B24]/15 rounded-xs shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${
                          item.label === "Scholarships" || item.label === "About Trust"
                            ? "w-[480px] grid grid-cols-5 gap-4"
                            : "w-72"
                        }`}
                      >
                        {/* Sub-links Column */}
                        <div
                          className={
                            item.label === "Scholarships" || item.label === "About Trust"
                              ? "col-span-3 space-y-1"
                              : "space-y-1"
                          }
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5E24] px-2 block mb-1">
                            {item.label} Sections
                          </span>
                          {item.children?.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              role="menuitem"
                              className="block p-2 rounded-xs hover:bg-[#F4EFE6] transition-colors group/sub focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                            >
                              <div className="flex items-center justify-between text-xs font-semibold text-[#0B3B24] group-hover/sub:text-[#072617]">
                                <span>{subItem.label}</span>
                                {subItem.isPlanned && (
                                  <Badge variant="warning" size="sm">
                                    Planned
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-[#4A5568] mt-0.5 leading-snug font-sans">
                                {subItem.description}
                              </p>
                            </Link>
                          ))}
                        </div>

                        {/* Featured Callout Card in Mega-Menu */}
                        {(item.label === "Scholarships" || item.label === "About Trust") && (
                          <div className="col-span-2 bg-[#072617] text-[#EDE6D8] p-3.5 rounded-xs border border-[#C5A059]/30 flex flex-col justify-between shadow-xs">
                            <div className="space-y-2">
                              {item.label === "Scholarships" ? (
                                <>
                                  <div className="w-7 h-7 rounded-xs bg-[#0B3B24] border border-[#C5A059]/40 flex items-center justify-center text-[#E4C88A]">
                                    <GraduationCap className="w-4 h-4" aria-hidden="true" />
                                  </div>
                                  <h4 className="font-serif font-bold text-xs text-white">
                                    Direct Fee Disbursal
                                  </h4>
                                  <p className="text-[10px] text-white/80 leading-relaxed font-sans">
                                    100% of awarded grants are remitted straight to accredited Odisha institutions. Zero intermediaries.
                                  </p>
                                </>
                              ) : (
                                <>
                                  <div className="w-7 h-7 rounded-xs bg-[#0B3B24] border border-[#C5A059]/40 flex items-center justify-center text-[#E4C88A]">
                                    <Scale className="w-4 h-4" aria-hidden="true" />
                                  </div>
                                  <h4 className="font-serif font-bold text-xs text-white">
                                    Fiduciary Charter
                                  </h4>
                                  <p className="text-[10px] text-white/80 leading-relaxed font-sans">
                                    Rigorous ethical governance and public statutory transparency under proposed trust deed.
                                  </p>
                                </>
                              )}
                            </div>

                            <Link
                              href={item.label === "Scholarships" ? "/scholarships#eligibility" : "/governance"}
                              className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#E4C88A] hover:text-white transition-colors uppercase tracking-wider"
                            >
                              <span>Explore Standards</span>
                              <ArrowRight className="w-3 h-3" aria-hidden="true" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Action CTAs */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link href="/scholarships">
                <Button variant="outline" size="sm" className="gap-1.5 font-semibold">
                  <Award className="w-3.5 h-3.5 text-[#0B3B24]" aria-hidden="true" />
                  <span>Scholarships</span>
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="gold" size="sm" className="gap-1.5 shadow-xs">
                  <PhoneCall className="w-3.5 h-3.5 text-[#072617]" aria-hidden="true" />
                  <span>Secretariat</span>
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-[#0B3B24] hover:bg-[#F4EFE6] rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                aria-label="Open Navigation Drawer"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Slide-in Off-Canvas Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Off-Canvas Panel */}
            <div
              role="dialog"
              aria-label="Mobile Navigation Menu"
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#FDFBF7] shadow-2xl flex flex-col justify-between border-l border-[#0B3B24]/20 z-50 animate-in slide-in-from-right duration-300"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-[#0B3B24]/10 flex items-center justify-between bg-[#F4EFE6]/60">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xs bg-[#0B3B24] border border-[#C5A059] flex items-center justify-center text-[#E4C88A] font-serif font-bold text-sm">
                    M
                  </div>
                  <span className="font-serif font-bold text-base text-[#0B3B24]">
                    MAHAVIR TRUST
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#0B3B24] hover:bg-[#EDE6D8] rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                  aria-label="Close Navigation Drawer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
                {TRUST_CONFIG.navigation.map((item) => (
                  <div key={item.label} className="border-b border-[#0B3B24]/10 pb-2.5">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-bold text-[#0B3B24] py-1 hover:text-[#072617]"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="pl-3 mt-1.5 space-y-2 border-l-2 border-[#C5A059]/40">
                        {item.children.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-xs text-[#4A5568] hover:text-[#0B3B24] py-0.5"
                          >
                            <span className="font-medium text-[#1C2421]">{sub.label}</span>
                            <span className="block text-[11px] text-[#4A5568]/80">{sub.description}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Statutory Warning Box in Drawer */}
                <div className="p-3 bg-[#0B3B24]/8 rounded-xs border border-[#0B3B24]/15 text-xs text-[#0B3B24] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-[#7A5E24]">
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Direct Disbursal Guarantee</span>
                  </div>
                  <p className="text-[11px] text-[#4A5568] leading-relaxed">
                    Zero cash policy. All financial assistance is remitted directly to registered educational colleges.
                  </p>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-4 border-t border-[#0B3B24]/10 bg-[#F4EFE6]/50 flex flex-col gap-2.5">
                <Link href="/scholarships" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">
                    Explore Scholarships
                  </Button>
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gold" className="w-full justify-center">
                    Secretariat Desk
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
