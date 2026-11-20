// motion: owner = Motion
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ORG } from "@content/org";
import { TRUST_CONFIG } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { StatutoryTicker } from "@/components/layout/StatutoryTicker";
import { SiteSearchTrigger } from "@/components/layout/SiteSearch";
import {
  MOTION_EASING,
  MOTION_DURATION,
  MOTION_STAGGER,
} from "@/components/ui/MotionPrimitives";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Heart,
  UserCheck,
  Building2,
  FileText,
  PhoneCall,
  ShieldCheck,
  Compass,
  LogOut,
  Receipt,
  FileDown,
  UserPlus,
} from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

const NAV_ODIA: Record<string, string> = {
  "About": "ଆମ ବିଷୟରେ",
  "Our Work": "କାର୍ଯ୍ୟକ୍ରମ",
  "Impact & Accountability": "ସାମାଜିକ ପ୍ରଭାବ",
  "Get Involved": "ସହଯୋଗ",
  "About the Trust": "ଟ୍ରଷ୍ଟ ବିଷୟରେ",
  "Governance & Board": "ଟ୍ରଷ୍ଟ ଶାସନ",
  "Statutory Disclosures": "ବୈଧାନିକ ସୂଚନା",
  "Civic Programmes": "ମୁଖ୍ୟ କାର୍ଯ୍ୟକ୍ରମ",
  "Higher Education Scholarships": "ଉଚ୍ଚଶିକ୍ଷା ବୃତ୍ତି",
  "Memories & Gallery": "ଚିତ୍ରଶାଳା",
  "Our Impact": "ଆମର ପ୍ରଭାବ",
  "Annual Reports & Audits": "ବାର୍ଷିକ ରିପୋର୍ଟ",
  "Field Dispatches": "କ୍ଷେତ୍ର ବାର୍ତ୍ତା",
  "Donate Now": "ଦାନ କରନ୍ତୁ",
  "Sign In": "ଲଗ୍-ଇନ୍",
  "Register": "ପଞ୍ଜୀକରଣ",
  "Menu": "ମେନୁ",
};

export function Header() {
  const { isAuthenticated, dashboard, logout } = usePortalAuth();
  const { locale } = useLanguage();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobileGroups, setExpandedMobileGroups] = useState<Record<string, boolean>>({
    About: true,
    "Our Work": true,
  });

  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const navRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileHamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef<string>("");

  // Monitor scroll for header backdrop elevation and compression
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // Close menus on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOverlayOpen(false);
    setOpenDropdown(null);
  }

  // Manage body scroll and focus when overlay opens/closes
  useEffect(() => {
    if (overlayOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = previousOverflow.current;
      };
    } else {
      document.body.style.overflow = previousOverflow.current;
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    }
    return () => {
      document.body.style.overflow = previousOverflow.current;
    };
  }, [overlayOpen]);

  // Trap focus inside overlay and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openDropdown) {
          setOpenDropdown(null);
          return;
        }
        if (overlayOpen) {
          setOverlayOpen(false);
          return;
        }
      }

      if (overlayOpen && e.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
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
  }, [overlayOpen, openDropdown]);

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

  const toggleMobileGroup = (label: string) => {
    setExpandedMobileGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Statutory Ticker Bar */}
      <StatutoryTicker />

      {/* Main Institutional Navigation Masthead */}
      <nav
        ref={navRef}
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-cream/92 backdrop-blur-md border-border-warm/90 shadow-subtle py-2 sm:py-2.5"
            : "bg-cream border-border-warm/75 py-3 sm:py-3.5"
        }`}
        aria-label="Main Navigation"
      >
        <Container size="wide" className="max-w-[1600px]">
          <div className="flex items-center justify-between gap-1.5 sm:gap-4 min-w-0 w-full">
            {/* Institutional Brand / Official Emblem */}
            <Link
              href="/"
              className="flex items-center gap-1.5 min-[360px]:gap-2 sm:gap-3 group focus-visible:outline-2 focus-visible:outline-terracotta rounded-xs min-w-0"
              aria-label="Mahaveer Educational & Charitable Trust Homepage"
            >
              <div
                className={`rounded-full overflow-hidden border-2 border-terracotta/90 bg-white flex items-center justify-center shadow-xs shrink-0 aspect-square transition-all duration-300 ${
                  isScrolled ? "w-8 h-8 sm:w-10 sm:h-10" : "w-9 h-9 sm:w-11 sm:h-11"
                }`}
              >
                <Image
                  src={ORG.branding.logoPath}
                  alt={ORG.branding.logoAlt}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover scale-[1.06]"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif font-bold text-[11px] min-[360px]:text-xs sm:text-base xl:text-[13.5px] 2xl:text-[16px] text-forest group-hover:text-terracotta-dark leading-tight tracking-tight transition-colors line-clamp-2 sm:line-clamp-none sm:whitespace-nowrap">
                  {ORG.name}
                </span>
                <span className="hidden sm:block xl:hidden 2xl:block text-[9px] 2xl:text-[10px] font-mono tracking-widest text-ink-muted uppercase mt-0.5 whitespace-nowrap">
                  Regd. Public Charitable Trust • Estd. 2013
                </span>
              </div>
            </Link>

            {/* Desktop Primary Navigation Links with Restrained Active Indicator */}
            <div className="hidden xl:flex items-center space-x-0 2xl:space-x-1 shrink-0">
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
                const disclosureId = `nav-disclosure-${item.label
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}`;
                const toggleId = `nav-toggle-${item.label
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}`;

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
                        className={`relative whitespace-nowrap px-1.5 2xl:px-2.5 py-1.5 text-[11px] 2xl:text-[13px] font-semibold rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-terracotta ${
                          isActive
                            ? "text-terracotta-dark font-bold bg-sand/40"
                            : "text-forest hover:text-forest-deep hover:bg-sage/40"
                        }`}
                      >
                        <span>{locale === "or" && NAV_ODIA[item.label] ? NAV_ODIA[item.label] : item.label}</span>
                        {isActive && (
                          <m.span
                            layoutId="active-nav-indicator"
                            initial={shouldReduceMotion ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: shouldReduceMotion ? 0 : MOTION_DURATION.fast,
                              ease: MOTION_EASING.institutional,
                            }}
                            className="absolute inset-x-2 bottom-0 h-0.5 bg-terracotta rounded-full"
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
                          onClick={() =>
                            setOpenDropdown(isItemOpen ? null : item.label)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              setOpenDropdown(null);
                            }
                          }}
                          className="min-w-[24px] min-h-[24px] p-1 inline-flex items-center justify-center text-forest/70 hover:text-terracotta-dark rounded-xs focus-visible:outline-2 focus-visible:outline-terracotta transition-colors"
                        >
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isItemOpen ? "rotate-180 text-terracotta" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>

                    {/* Accessible Sub-Navigation Disclosure Flyout */}
                    <AnimatePresence>
                      {hasChildren && isItemOpen && (
                        <m.div
                          id={disclosureId}
                          aria-labelledby={toggleId}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                          transition={{
                            duration: shouldReduceMotion ? 0 : MOTION_DURATION.fast,
                            ease: MOTION_EASING.institutional,
                          }}
                          className="absolute top-full left-0 bg-cream/98 backdrop-blur-md border border-border-warm rounded-md shadow-elevated p-3 z-50 w-80 space-y-1"
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              setOpenDropdown(null);
                              const toggleBtn = document.getElementById(toggleId);
                              toggleBtn?.focus();
                            }
                          }}
                        >
                          <div className="flex items-center justify-between px-2 pt-1 pb-1.5 border-b border-border-warm/50 mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta">
                              {item.label} Directory
                            </span>
                            <span className="text-[10px] font-mono text-ink-muted">
                              MECT Charter
                            </span>
                          </div>
                          {item.children?.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="block p-2 rounded-xs hover:bg-sand/40 transition-colors group/sub focus-visible:outline-2 focus-visible:outline-terracotta"
                            >
                              <div className="flex items-center justify-between text-xs font-semibold text-forest group-hover/sub:text-terracotta-dark">
                                <span className="group-hover/sub:translate-x-0.5 transition-transform">
                                  {locale === "or" && NAV_ODIA[subItem.label] ? NAV_ODIA[subItem.label] : subItem.label}
                                </span>
                                {subItem.badge && (
                                  <Badge variant="forest" size="sm">
                                    {subItem.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-ink-muted mt-0.5 leading-snug font-sans">
                                {subItem.description}
                              </p>
                            </Link>
                          ))}
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Desktop Direct Action Buttons & Editorial Menu Trigger */}
            <div className="hidden xl:flex items-center space-x-1 2xl:space-x-2 shrink-0">
              <LanguageToggle />
              <SiteSearchTrigger />

              {isAuthenticated ? (
                <div
                  className="relative shrink-0"
                  onMouseEnter={() => setAccountDropdownOpen(true)}
                  onMouseLeave={() => setAccountDropdownOpen(false)}
                >
                  <Link
                    href="/portal/dashboard"
                    aria-label="Donor Portal Dashboard"
                    className="flex whitespace-nowrap px-2 2xl:px-3 py-1.5 text-xs font-semibold text-forest bg-sand/50 border border-terracotta/40 hover:bg-sand/80 rounded-xs transition-colors items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-terracotta shrink-0"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
                    <span>{dashboard?.account?.profile?.fullName?.split(" ")[0] || "My Portal"}</span>
                    <ChevronDown className="w-3 h-3 text-forest/70" aria-hidden="true" />
                  </Link>

                  <AnimatePresence>
                    {accountDropdownOpen && (
                      <m.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-56 bg-white border border-border-warm rounded-md shadow-elevated p-2 z-50 space-y-1"
                      >
                        <div className="px-2.5 py-1.5 border-b border-border-warm/60 mb-1">
                          <p className="text-[11px] font-bold text-forest truncate">
                            {dashboard?.account?.profile?.fullName || "Supporter"}
                          </p>
                          <p className="text-[10px] text-ink-muted truncate font-mono">
                            {dashboard?.account?.primaryPhone || dashboard?.account?.primaryEmail || "Verified Account"}
                          </p>
                        </div>
                        <Link
                          href="/portal/dashboard"
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-forest hover:bg-cream rounded-xs transition-colors font-medium"
                        >
                          <Compass className="w-3.5 h-3.5 text-terracotta" />
                          <span>Dashboard Overview</span>
                        </Link>
                        <Link
                          href="/portal/donations"
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-forest hover:bg-cream rounded-xs transition-colors font-medium"
                        >
                          <Receipt className="w-3.5 h-3.5 text-terracotta" />
                          <span>Donation History</span>
                        </Link>
                        <Link
                          href="/portal/receipts"
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-forest hover:bg-cream rounded-xs transition-colors font-medium"
                        >
                          <FileDown className="w-3.5 h-3.5 text-terracotta" />
                          <span>Official 80G Receipts</span>
                        </Link>
                        <Link
                          href="/portal/profile"
                          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-forest hover:bg-cream rounded-xs transition-colors font-medium"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-terracotta" />
                          <span>Profile &amp; Settings</span>
                        </Link>
                        <div className="border-t border-border-warm/60 pt-1 mt-1">
                          <button
                            type="button"
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-700 hover:bg-red-50 rounded-xs transition-colors font-medium text-left"
                          >
                            <LogOut className="w-3.5 h-3.5 text-red-600" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-1 shrink-0">
                  <Link
                    href="/login"
                    aria-label="Sign in to Donor Portal"
                    className="flex whitespace-nowrap px-2 2xl:px-2.5 py-1.5 text-xs font-semibold text-forest border border-forest/30 hover:bg-sage/40 rounded-xs transition-colors items-center gap-1 focus-visible:outline-2 focus-visible:outline-terracotta shrink-0"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-terracotta shrink-0" aria-hidden="true" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    aria-label="Create Donor Account"
                    className="hidden 2xl:flex whitespace-nowrap px-2.5 py-1.5 text-xs font-semibold text-terracotta-dark border border-terracotta/30 hover:bg-sand/40 rounded-xs transition-colors items-center gap-1 focus-visible:outline-2 focus-visible:outline-terracotta shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-terracotta shrink-0" aria-hidden="true" />
                    <span>Register</span>
                  </Link>
                </div>
              )}

              {/* Editorial Fullscreen Navigation Trigger */}
              <button
                ref={menuTriggerRef}
                type="button"
                onClick={() => setOverlayOpen(true)}
                className="whitespace-nowrap px-2 2xl:px-3 py-1.5 text-xs font-semibold text-forest bg-sage/35 hover:bg-forest hover:text-cream border border-forest/25 rounded-xs transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-terracotta shrink-0"
                aria-haspopup="dialog"
                aria-expanded={overlayOpen}
                aria-controls="fullscreen-editorial-overlay"
                aria-label="Open comprehensive institutional menu"
              >
                <Compass className="w-3.5 h-3.5 text-terracotta group-hover:text-sand" aria-hidden="true" />
                <span>Menu</span>
              </button>

              {/* Primary Donation Action */}
              <Link
                href="/donate"
                aria-label="Donate Now to Mahaveer Trust"
                className="whitespace-nowrap px-2.5 2xl:px-4 py-1.5 text-xs font-bold text-white bg-terracotta hover:bg-terracotta-dark border border-terracotta hover:border-terracotta-dark rounded-xs shadow-xs transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-forest shrink-0"
              >
                <Heart className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Donate Now</span>
              </Link>
            </div>

            {/* Mobile / Tablet Header Controls */}
            <div className="flex xl:hidden items-center space-x-1 sm:space-x-2 shrink-0">
              <LanguageToggle />
              <SiteSearchTrigger />

              <Link
                href="/donate"
                aria-label="Donate to Mahaveer Trust"
                className="min-h-[44px] min-w-[44px] px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-terracotta hover:bg-terracotta-dark border border-terracotta hover:border-terracotta-dark rounded-xs shadow-xs transition-colors flex items-center justify-center gap-1 sm:gap-1.5 focus-visible:outline-2 focus-visible:outline-forest shrink-0"
              >
                <Heart className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true" />
                <span className="hidden min-[360px]:inline">Donate</span>
              </Link>

              <button
                ref={mobileHamburgerRef}
                type="button"
                onClick={() => setOverlayOpen(!overlayOpen)}
                className="min-h-[44px] min-w-[44px] p-2 text-forest hover:bg-sage/40 rounded-xs focus-visible:outline-2 focus-visible:outline-terracotta flex items-center justify-center transition-colors"
                aria-expanded={overlayOpen}
                aria-controls="fullscreen-editorial-overlay"
                aria-label={overlayOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <span
                  className={`inline-flex transition-transform duration-200 ${
                    overlayOpen ? "rotate-90" : "rotate-0"
                  }`}
                >
                  {overlayOpen ? (
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

      {/* Fullscreen Editorial Navigation Overlay (Desktop & Mobile) */}
      <AnimatePresence>
        {overlayOpen && (
          <m.div
            ref={overlayRef}
            id="fullscreen-editorial-overlay"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{
              duration: shouldReduceMotion ? 0 : MOTION_DURATION.fast,
              ease: MOTION_EASING.institutional,
            }}
            className="fixed inset-0 z-50 bg-forest-deep text-cream flex flex-col overflow-y-auto print:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="institutional-nav-title"
          >
            {/* Overlay Masthead Bar */}
            <div className="w-full border-b border-sand/20 py-4 shrink-0 bg-forest-deep/95 backdrop-blur-md sticky top-0 z-20">
              <Container size="default">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-sand bg-white flex items-center justify-center shrink-0 aspect-square shadow-sm">
                      <Image
                        src={ORG.branding.logoPath}
                        alt="MECT Official Emblem"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover scale-[1.06]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span id="institutional-nav-title" className="font-serif font-bold text-sm sm:text-base text-cream leading-tight">
                        {ORG.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-sand">
                        Institutional Navigation Index
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <LanguageToggle variant="overlay" />
                    <span className="hidden sm:inline-block text-[11px] font-mono text-sand/70 uppercase">
                      Press [Esc] to close
                    </span>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => setOverlayOpen(false)}
                      className="min-h-[44px] min-w-[44px] p-2.5 text-cream hover:text-sand hover:bg-forest rounded-xs flex items-center justify-center focus-visible:outline-2 focus-visible:outline-sand transition-colors"
                      aria-label="Close institutional menu"
                    >
                      <X className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Container>
            </div>

            {/* Overlay Main Body Content */}
            <div className="flex-1 py-8 sm:py-12">
              <Container size="default">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  {/* Left Column: Institutional Charter & Quick Support Details (Desktop: 4 cols) */}
                  <div className="lg:col-span-4 space-y-6 lg:border-r lg:border-sand/15 lg:pr-8">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-sand block mb-2">
                        Institutional Charter
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream leading-snug">
                        Dignified Education, Community Healthcare & Livelihood Upliftment.
                      </h3>
                      <p className="text-xs text-cream/75 mt-2 leading-relaxed font-sans">
                        Founded in 2013 under registered public trust deed (Doc No. {ORG.trustDeed.deedNumber}),
                        serving rural and tribal communities across Balangir and Odisha.
                      </p>
                    </div>

                    {/* Institutional Contribution & Statutory Transparency Notice */}
                    <div className="bg-forest/80 border border-sand/25 p-4 rounded-xs space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-cream">
                        <span className="font-serif">Institutional Giving</span>
                        <span className="text-[10px] bg-sand/90 text-forest-deep px-1.5 py-0.5 rounded-xs font-bold uppercase font-mono tracking-wider">
                          Statutory Transparency
                        </span>
                      </div>
                      <p className="text-xs text-cream/80 leading-relaxed font-sans">
                        Contributions to Mahaveer Trust support verified charitable programmes across Western Odisha. Tax treatment of contributions is subject to applicable law and confirmation of the Trust&apos;s current statutory eligibility.
                      </p>
                      <div className="pt-1.5 border-t border-sand/15">
                        <Link
                          href="/donate"
                          onClick={() => setOverlayOpen(false)}
                          className="min-h-[44px] py-2 inline-flex items-center gap-1.5 text-xs font-semibold text-sand hover:text-white transition-colors group/link focus-visible:outline-2 focus-visible:outline-sand"
                        >
                          <span>View Official Bank Transfer Credentials</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>

                    {/* Helpline & Quick Links */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-cream/90 min-h-[44px]">
                        <PhoneCall className="w-4 h-4 text-sand shrink-0" aria-hidden="true" />
                        <span>Helpline: </span>
                        <a
                          href={ORG.helpline.href}
                          className="font-mono text-sand hover:underline font-semibold inline-flex items-center min-h-[44px] py-2"
                        >
                          {ORG.helpline.display}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-cream/90 min-h-[36px]">
                        <Building2 className="w-4 h-4 text-sand shrink-0" aria-hidden="true" />
                        <span>Registered Office: Balangir, Odisha</span>
                      </div>
                      <div className="flex items-center gap-2 text-cream/90 min-h-[36px]">
                        <ShieldCheck className="w-4 h-4 text-sand shrink-0" aria-hidden="true" />
                        <span>Darpan: {ORG.ids.darpan} • CSR-1: {ORG.ids.csr1}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        id="overlay-primary-donate-cta"
                        href="/donate"
                        onClick={() => setOverlayOpen(false)}
                        className="w-full min-h-[44px] py-3 text-center text-sm font-bold text-white bg-terracotta hover:bg-terracotta-dark border border-terracotta hover:border-terracotta-dark rounded-xs shadow-xs flex items-center justify-center gap-2 transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                      >
                        <Heart className="w-4 h-4 fill-current" aria-hidden="true" />
                        <span>Support the Mission — Donate Now</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Structured Navigation Grid (Desktop: 8 cols) */}
                  <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {TRUST_CONFIG.navigation.map((group, groupIdx) => {
                        const isExpanded = expandedMobileGroups[group.label] ?? true;

                        return (
                          <m.div
                            key={group.label}
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: shouldReduceMotion ? 0 : MOTION_DURATION.fast,
                              delay: shouldReduceMotion ? 0 : groupIdx * MOTION_STAGGER.cards,
                              ease: MOTION_EASING.institutional,
                            }}
                            className="border-b border-sand/15 pb-6 lg:border-b-0 lg:pb-0"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Link
                                href={group.href}
                                onClick={() => setOverlayOpen(false)}
                                className="font-mono text-xs uppercase tracking-widest text-sand hover:text-cream transition-colors inline-flex items-center gap-1.5 group/header min-h-[44px] py-2"
                              >
                                <span>{group.label}</span>
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/header:opacity-100 group-hover/header:translate-x-1 transition-all" aria-hidden="true" />
                              </Link>
                              {group.children && (
                                <button
                                  type="button"
                                  onClick={() => toggleMobileGroup(group.label)}
                                  className="lg:hidden min-h-[44px] min-w-[44px] p-2 text-sand hover:text-cream flex items-center justify-center rounded-xs focus-visible:outline-2 focus-visible:outline-sand"
                                  aria-label={`Toggle ${group.label} sub-links`}
                                >
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform ${
                                      isExpanded ? "rotate-180" : ""
                                    }`}
                                    aria-hidden="true"
                                  />
                                </button>
                              )}
                            </div>

                            {/* Sub-links */}
                            {group.children && (
                              <div
                                className={`space-y-3 pl-1 ${
                                  isExpanded ? "block" : "hidden lg:block"
                                }`}
                              >
                                {group.children.map((sub) => (
                                  <Link
                                    key={sub.label}
                                    href={sub.href}
                                    onClick={() => setOverlayOpen(false)}
                                    className="group/link block min-h-[44px] py-1.5 focus-visible:outline-2 focus-visible:outline-sand rounded-xs transition-colors"
                                  >
                                    <div className="flex items-center justify-between text-sm sm:text-base font-serif font-semibold text-cream group-hover/link:text-sand transition-colors">
                                      <span>{sub.label}</span>
                                      {sub.badge && (
                                        <Badge variant="gold" size="sm" className="shrink-0 ml-2">
                                          {sub.badge}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-cream/65 font-sans mt-0.5 leading-snug group-hover/link:text-cream/85 transition-colors">
                                      {sub.description}
                                    </p>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </m.div>
                        );
                      })}
                    </div>

                    {/* Additional Institutional Fast-Links Row */}
                    <div className="mt-8 pt-6 border-t border-sand/20 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {isAuthenticated ? (
                        <>
                          <Link
                            href="/portal/dashboard"
                            onClick={() => setOverlayOpen(false)}
                            className="p-2.5 bg-forest/80 border border-sand/20 rounded hover:border-sand hover:bg-forest transition-colors text-xs flex flex-col justify-center min-h-[44px]"
                          >
                            <span className="font-semibold text-sand">My Dashboard</span>
                            <span className="text-[10px] text-cream/70">Overview &amp; status</span>
                          </Link>
                          <Link
                            href="/portal/donations"
                            onClick={() => setOverlayOpen(false)}
                            className="p-2.5 bg-forest/80 border border-sand/20 rounded hover:border-sand hover:bg-forest transition-colors text-xs flex flex-col justify-center min-h-[44px]"
                          >
                            <span className="font-semibold text-sand">Donation History</span>
                            <span className="text-[10px] text-cream/70">All contributions</span>
                          </Link>
                          <Link
                            href="/portal/receipts"
                            onClick={() => setOverlayOpen(false)}
                            className="p-2.5 bg-forest/80 border border-sand/20 rounded hover:border-sand hover:bg-forest transition-colors text-xs flex flex-col justify-center min-h-[44px]"
                          >
                            <span className="font-semibold text-sand">80G Receipts</span>
                            <span className="text-[10px] text-cream/70">Download verified PDFs</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setOverlayOpen(false);
                              logout();
                            }}
                            className="p-2.5 bg-red-950/40 border border-red-500/30 rounded hover:bg-red-900/50 transition-colors text-xs flex flex-col justify-center min-h-[44px] text-left"
                          >
                            <span className="font-semibold text-red-300">Sign Out</span>
                            <span className="text-[10px] text-red-200/70">End secure session</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            onClick={() => setOverlayOpen(false)}
                            className="p-2.5 bg-forest/80 border border-sand/20 rounded hover:border-sand hover:bg-forest transition-colors text-xs flex flex-col justify-center min-h-[44px]"
                          >
                            <span className="font-semibold text-sand">Sign In</span>
                            <span className="text-[10px] text-cream/70">OTP login for donors</span>
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setOverlayOpen(false)}
                            className="p-2.5 bg-forest/80 border border-sand/20 rounded hover:border-sand hover:bg-forest transition-colors text-xs flex flex-col justify-center min-h-[44px]"
                          >
                            <span className="font-semibold text-sand">Create Account</span>
                            <span className="text-[10px] text-cream/70">Register with mobile</span>
                          </Link>
                          <Link
                            href="/statutory-disclosures"
                            onClick={() => setOverlayOpen(false)}
                            className="p-2.5 bg-forest/80 border border-sand/20 rounded hover:border-sand hover:bg-forest transition-colors text-xs flex flex-col justify-center min-h-[44px]"
                          >
                            <span className="font-semibold text-sand">Statutory Filings</span>
                            <span className="text-[10px] text-cream/70">12A, 80G, CSR-1</span>
                          </Link>
                          <Link
                            href="/accessibility"
                            onClick={() => setOverlayOpen(false)}
                            className="p-2.5 bg-forest/80 border border-sand/20 rounded hover:border-sand hover:bg-forest transition-colors text-xs flex flex-col justify-center min-h-[44px]"
                          >
                            <span className="font-semibold text-sand">Accessibility</span>
                            <span className="text-[10px] text-cream/70">WCAG 2.2 AAA features</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
