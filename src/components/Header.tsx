"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TRUST_CONFIG } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { StatutoryTicker } from "@/components/layout/StatutoryTicker";
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
  Heart,
  Scale,
  FileText,
  Users,
  HandHeart,
  ExternalLink,
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
      setIsScrolled(window.scrollY > 20);
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
      {/* Top Statutory Ticker Bar */}
      <StatutoryTicker />

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
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xs bg-[#0A192F] border-2 border-[#C5A059] flex items-center justify-center text-[#E4C88A] font-serif font-bold text-xl shadow-xs group-hover:bg-[#07111E] transition-colors shrink-0">
                M
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-serif tracking-wider font-bold text-lg sm:text-xl text-[#0A192F] leading-tight group-hover:text-[#1E3A8A] transition-colors">
                    MAHAVIR TRUST
                  </span>
                  <span className="hidden sm:inline-flex text-[9px] font-bold uppercase tracking-wider bg-[#0B3B24]/10 text-[#0B3B24] px-1.5 py-0.5 rounded-xs border border-[#0B3B24]/20">
                    Est. 2013
                  </span>
                </div>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-[#7A5E24] font-sans">
                  Mahaveer Educational & Charitable Trust (MECT)
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
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059] ${
                        isActive
                          ? "text-[#0A192F] font-bold bg-[#0A192F]/8"
                          : "text-[#1C2421] hover:text-[#0A192F] hover:bg-[#0A192F]/4"
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
                        className="absolute top-full left-0 bg-[#FDFBF7] border border-[#0A192F]/15 rounded-xs shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150 w-80 space-y-1"
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
                            <div className="flex items-center justify-between text-xs font-semibold text-[#0A192F] group-hover/sub:text-[#1E3A8A]">
                              <span>{subItem.label}</span>
                              {subItem.badge && (
                                <Badge variant="forest" size="sm">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-[#4A5568] mt-0.5 leading-snug font-sans">
                              {subItem.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Direct Action Buttons */}
            <div className="hidden lg:flex items-center space-x-2.5">
              <Link
                href="/volunteer"
                className="px-3.5 py-2 text-xs font-semibold text-[#0A192F] border border-[#0A192F]/30 hover:bg-[#0A192F]/5 rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A059]"
              >
                Volunteer
              </Link>
              <Link
                href="/donate"
                className="px-4 py-2 text-xs font-bold text-white bg-[#D97706] hover:bg-[#B45309] rounded-xs shadow-xs transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#C5A059]"
              >
                <Heart className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Donate (80G Tax Exemption)</span>
              </Link>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <Link
                href="/donate"
                className="px-2.5 py-1.5 text-xs font-bold text-white bg-[#D97706] hover:bg-[#B45309] rounded-xs shadow-xs transition-colors flex items-center gap-1"
              >
                <Heart className="w-3 h-3 fill-current" aria-hidden="true" />
                <span>Donate</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#0A192F] hover:bg-[#0A192F]/5 rounded-xs focus-visible:outline-2 focus-visible:outline-[#C5A059]"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Mobile Drawer Navigation (print:hidden) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#FDFBF7] lg:hidden flex flex-col pt-16 px-6 pb-8 overflow-y-auto print:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#0A192F]/10">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xs bg-[#0A192F] border-2 border-[#C5A059] flex items-center justify-center text-[#E4C88A] font-serif font-bold text-lg">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base text-[#0A192F]">MAHAVIR TRUST</span>
                <span className="text-[9px] uppercase tracking-wider text-[#7A5E24] font-semibold">
                  MECT Odisha • Est. 2013
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#0A192F] hover:bg-[#0A192F]/10 rounded-xs"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Links List */}
          <div className="py-4 space-y-1 divide-y divide-[#0A192F]/5">
            {TRUST_CONFIG.navigation.map((item) => (
              <div key={item.label} className="pt-2">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 text-base font-semibold text-[#0A192F]"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059]" aria-hidden="true" />
                </Link>
                {item.children && (
                  <div className="pl-3 pb-2 space-y-1">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 text-xs text-[#4A5568] hover:text-[#0A192F]"
                      >
                        • {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Statutory & Contact Info Box */}
          <div className="mt-auto pt-6 border-t border-[#0A192F]/10 space-y-3">
            <div className="bg-[#0A192F] text-white p-3 rounded-xs text-xs space-y-1">
              <div className="flex items-center justify-between text-[#E4C88A] font-semibold">
                <span>Section 80G Tax Exemption</span>
                <span className="text-[10px] bg-[#C5A059] text-[#0A192F] px-1 rounded-xs">Verified</span>
              </div>
              <p className="text-[11px] text-white/80">
                URN: {TRUST_CONFIG.statutory.section80GUrn} • 50% Tax Deduction
              </p>
            </div>

            <Link
              href="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center text-sm font-bold text-white bg-[#D97706] hover:bg-[#B45309] rounded-xs shadow-xs flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>Donate (80G Tax Exemption)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
