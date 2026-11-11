"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TRUST_CONFIG } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { StatutoryTicker } from "@/components/layout/StatutoryTicker";
import { MOTION_EASING, MOTION_DURATION, MOTION_STAGGER } from "@/components/ui/MotionPrimitives";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Heart,
  UserCheck,
} from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Monitor scroll for header backdrop elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change and restore focus if drawer was open
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }

  // Manage body scroll and focus when mobile menu opens/closes
  useEffect(() => {
    if (mobileMenuOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Trap focus inside mobile drawer and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
        return;
      }

      if (mobileMenuOpen && e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
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
  }, [mobileMenuOpen]);

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
            ? "bg-cream/95 backdrop-blur-md border-border-warm shadow-sm py-2.5"
            : "bg-cream border-border-warm py-3.5"
        }`}
        aria-label="Main Navigation"
      >
        <Container size="default">
          <div className="flex items-center justify-between">
            {/* Institutional Brand / Official Emblem */}
            <Link
              href="/"
              className="flex items-center space-x-1.5 sm:space-x-3 group focus-visible:outline-2 focus-visible:outline-terracotta min-w-0 shrink sm:shrink-0"
              aria-label="Mahaveer Educational & Charitable Trust Homepage"
            >
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-terracotta bg-white flex items-center justify-center shadow-xs shrink-0 aspect-square">
                <Image
                  src="/images/mect-official-emblem.png"
                  alt="Mahaveer Educational & Charitable Trust Official Emblem"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover scale-[1.06]"
                  priority
                />
              </div>
              <span className="font-serif font-bold text-[10.5px] min-[375px]:text-[11.5px] sm:text-sm xl:text-[14px] 2xl:text-[15.5px] tracking-normal sm:tracking-tight text-forest group-hover:text-terracotta-dark leading-tight transition-colors max-w-[140px] min-[375px]:max-w-[180px] sm:max-w-[240px] lg:max-w-[185px] xl:max-w-none xl:whitespace-nowrap">
                Mahaveer Educational &amp; Charitable Trust
              </span>
            </Link>

            {/* Desktop Primary Navigation — WAI-ARIA Disclosure Navigation Pattern */}
            <div className="hidden lg:flex items-center space-x-0.5 2xl:space-x-1.5 shrink-0">
              {TRUST_CONFIG.navigation.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive =
                  pathname === item.href ||
                  (item.children &&
                    item.children.some(
                      (c) =>
                        pathname === c.href ||
                        (c.href !== "/" && pathname.startsWith(c.href))
                    ));
                const isItemOpen = openDropdown === item.label;
                const disclosureId = `nav-disclosure-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                const toggleId = `nav-toggle-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

                return (
                  <div
                    key={item.label}
                    className="relative shrink-0"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setOpenDropdown(null);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`relative whitespace-nowrap px-1 xl:px-2 2xl:px-3 py-2 text-[11.5px] xl:text-[12.5px] 2xl:text-[13px] font-semibold rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-terracotta ${
                          isActive
                            ? "text-terracotta-dark font-bold bg-sand/55"
                            : "text-forest hover:text-forest-deep hover:bg-sage/65"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <motion.span
                            layoutId={shouldReduceMotion ? undefined : "mect-nav-active-indicator"}
                            transition={{
                              duration: shouldReduceMotion ? 0 : MOTION_DURATION.fast,
                              ease: MOTION_EASING.institutional,
                            }}
                            className="absolute inset-x-1 bottom-0 h-0.5 bg-terracotta rounded-full"
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                      {hasChildren && (
                        <button
                          type="button"
                          id={toggleId}
                          aria-expanded={isItemOpen}
                          aria-controls={disclosureId}
                          aria-label={`${item.label} sub-navigation menu`}
                          onClick={() => setOpenDropdown(isItemOpen ? null : item.label)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              setOpenDropdown(null);
                            }
                          }}
                          className="min-w-[24px] min-h-[24px] p-1 inline-flex items-center justify-center text-forest/75 hover:text-terracotta-dark rounded-xs focus-visible:outline-2 focus-visible:outline-terracotta transition-colors"
                        >
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isItemOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>

                    {/* Accessible Sub-Navigation Disclosure Flyout */}
                    <AnimatePresence>
                      {hasChildren && isItemOpen && (
                        <motion.div
                          id={disclosureId}
                          aria-labelledby={toggleId}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                          transition={{
                            duration: shouldReduceMotion ? 0 : MOTION_DURATION.fast,
                            ease: MOTION_EASING.institutional,
                          }}
                          className="absolute top-full left-0 bg-white border border-border-warm rounded-xs shadow-2xl p-3 z-50 w-80 space-y-1"
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              setOpenDropdown(null);
                              const toggleBtn = document.getElementById(toggleId);
                              toggleBtn?.focus();
                            }
                          }}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-forest px-2 block mb-1 font-sans">
                            {item.label} Overview
                          </span>
                          {item.children?.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block p-2 rounded-xs hover:bg-cream/65 transition-colors group/sub focus-visible:outline-2 focus-visible:outline-terracotta"
                            >
                              <div className="flex items-center justify-between text-xs font-semibold text-terracotta-dark group-hover/sub:text-forest-deep">
                                <span>{subItem.label}</span>
                                {subItem.badge && (
                                  <Badge variant="forest" size="sm">
                                    {subItem.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-ink-secondary mt-0.5 leading-snug font-sans">
                                {subItem.description}
                              </p>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Desktop Direct Action Buttons — Approved Terracotta & Forest Charcoal Palette */}
            <div className="hidden lg:flex items-center space-x-1.5 xl:space-x-2 shrink-0">
              <Link
                href="/portal/login"
                aria-label="Donor Portal"
                className="px-2 2xl:px-3.5 py-2 text-xs font-semibold text-forest border border-forest/30 hover:bg-sage/55 rounded-xs transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-terracotta shrink-0"
              >
                <UserCheck className="w-3.5 h-3.5 text-terracotta shrink-0" aria-hidden="true" />
                <span><span className="hidden xl:inline">Donor </span>Portal</span>
              </Link>
              <Link
                href="/donate"
                aria-label="Donate Now"
                className="px-2.5 xl:px-3.5 2xl:px-4 py-2 text-xs font-bold text-white bg-terracotta hover:bg-terracotta-dark border border-terracotta hover:border-terracotta-dark rounded-xs shadow-xs transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-forest shrink-0"
              >
                <Heart className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Donate<span className="hidden xl:inline"> Now</span></span>
              </Link>
            </div>

            {/* Mobile Menu Hamburger & Quick Donate Button */}
            <div className="flex lg:hidden items-center space-x-1 sm:space-x-2 shrink-0">
              <Link
                href="/donate"
                className="min-h-[44px] px-2.5 sm:px-3.5 py-2 text-[11px] sm:text-xs font-bold text-white bg-terracotta hover:bg-terracotta-dark border border-terracotta hover:border-terracotta-dark rounded-xs shadow-xs transition-colors flex items-center gap-1 sm:gap-1.5 focus-visible:outline-2 focus-visible:outline-forest"
              >
                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" aria-hidden="true" />
                <span>Donate</span>
              </Link>
              <button
                ref={hamburgerRef}
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-h-[44px] min-w-[40px] sm:min-w-[44px] p-2 text-forest hover:bg-sage/60 rounded-xs focus-visible:outline-2 focus-visible:outline-terracotta flex items-center justify-center transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <span
                  className={`inline-flex transition-transform duration-200 ${
                    mobileMenuOpen ? "rotate-90" : "rotate-0"
                  }`}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Menu className="w-6 h-6" aria-hidden="true" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Mobile Drawer Navigation (print:hidden) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={drawerRef}
            id="mobile-navigation-drawer"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
            transition={{
              duration: shouldReduceMotion ? 0 : MOTION_DURATION.fast,
              ease: MOTION_EASING.institutional,
            }}
            className="fixed inset-0 z-50 bg-cream lg:hidden flex flex-col pt-16 px-6 pb-8 overflow-y-auto print:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-warm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-terracotta bg-white flex items-center justify-center shrink-0 aspect-square shadow-xs">
                  <Image
                    src="/images/mect-official-emblem.png"
                    alt="Mahaveer Educational & Charitable Trust Official Emblem"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover scale-[1.06]"
                  />
                </div>
                <span className="font-serif font-bold text-sm text-forest leading-tight">
                  Mahaveer Educational &amp; Charitable Trust
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] min-w-[44px] p-2.5 text-forest hover:bg-sage/60 rounded-xs flex items-center justify-center focus-visible:outline-2 focus-visible:outline-terracotta transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Links List with Restrained Stagger */}
            <div className="py-4 space-y-1 divide-y divide-border-warm">
              {TRUST_CONFIG.navigation.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : MOTION_DURATION.fast,
                    delay: shouldReduceMotion ? 0 : idx * MOTION_STAGGER.nav,
                    ease: MOTION_EASING.institutional,
                  }}
                  className="pt-2"
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between min-h-[44px] py-2 text-base font-semibold text-forest hover:text-terracotta-dark"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-terracotta" aria-hidden="true" />
                  </Link>
                  {item.children && (
                    <div className="pl-3 pb-2 space-y-1">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between min-h-[44px] py-1.5 px-2 text-xs text-ink-sand hover:text-terracotta-dark hover:bg-white/60 rounded-xs transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-ink">{sub.label}</span>
                            <span className="text-[11px] text-ink-sand">{sub.description}</span>
                          </div>
                          {sub.badge && (
                            <Badge variant="forest" size="sm" className="shrink-0 ml-2">
                              {sub.badge}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Mobile Secondary Actions & Statutory Highlight */}
            <div className="mt-auto pt-6 border-t border-border-warm space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/portal/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] py-2.5 text-center text-xs font-semibold text-forest border border-forest/30 hover:bg-sage/50 rounded-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
                  <span>Donor Portal</span>
                </Link>
                <Link
                  href="/volunteer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] py-2.5 text-center text-xs font-semibold text-forest border border-forest/30 hover:bg-sage/50 rounded-xs flex items-center justify-center transition-colors"
                >
                  Volunteer
                </Link>
              </div>

              <div className="bg-forest text-white p-3 rounded-xs text-xs space-y-1">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>State Bank of India</span>
                  <span className="text-[10px] bg-sand text-forest-deep px-1.5 rounded-xs font-bold">SBI Direct</span>
                </div>
                <p className="text-[11px] text-cream font-mono">
                  A/C: {TRUST_CONFIG.bank.accountNumber} • IFSC: {TRUST_CONFIG.bank.ifsc}
                </p>
              </div>

              <Link
                href="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] py-3 text-center text-sm font-bold text-white bg-terracotta hover:bg-terracotta-dark border border-terracotta hover:border-terracotta-dark rounded-xs shadow-xs flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-forest"
              >
                <Heart className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Donate Now</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
