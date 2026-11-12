// motion: owner = Motion
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  BookOpen,
  Building2,
  FileText,
  Heart,
  HelpCircle,
  Home,
  Mail,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { TRUST_CONFIG } from "@/lib/config";
import { MOTION_TRANSITIONS } from "@/lib/motion";

interface SearchRouteItem {
  id: string;
  label: string;
  href: string;
  group: string;
  keywords: string[];
  icon: React.ReactNode;
}

const VERIFIED_SEARCH_ROUTES: SearchRouteItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    group: "Core Pages",
    keywords: ["mect", "mahaveer", "odisha", "balangir", "trust"],
    icon: <Home className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "about",
    label: "About MECT & Mission",
    href: "/about",
    group: "Core Pages",
    keywords: ["trustees", "mission", "vision", "2013", "history"],
    icon: <Building2 className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "programmes",
    label: "Programmes & Five Pillars",
    href: "/programmes",
    group: "Core Pages",
    keywords: ["education", "women", "water", "food", "community", "200"],
    icon: <BookOpen className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "impact",
    label: "Impact & Outreach",
    href: "/impact",
    group: "Core Pages",
    keywords: ["odisha", "districts", "angul", "dhenkanal", "balangir", "reach"],
    icon: <Users className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "donate",
    label: "Donate (SBI NEFT / UPI)",
    href: "/donate",
    group: "Support",
    keywords: ["sbi", "bank", "ifsc", "upi", "qr", "donation", "receipt"],
    icon: <Heart className="w-4 h-4 text-terracotta" aria-hidden="true" />,
  },
  {
    id: "csr",
    label: "CSR Partnerships",
    href: "/csr-partnerships",
    group: "Support",
    keywords: ["csr-1", "corporate", "mca", "partnership"],
    icon: <Building2 className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "volunteer",
    label: "Volunteer With Us",
    href: "/volunteer",
    group: "Support",
    keywords: ["volunteer", "field", "odisha", "join"],
    icon: <Users className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "scholarships",
    label: "Mahaveer Shiksha Protsahan Yojana",
    href: "/scholarships",
    group: "Programmes",
    keywords: ["scholarship", "yojana", "students", "education"],
    icon: <BookOpen className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "statutory",
    label: "Statutory Disclosures",
    href: "/statutory-disclosures",
    group: "Governance & Compliance",
    keywords: ["12a", "80g", "pan", "darpan", "e-anudaan", "deed", "certificates"],
    icon: <ShieldCheck className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "governance",
    label: "Governance & Board of Trustees",
    href: "/governance",
    group: "Governance & Compliance",
    keywords: ["board", "trustees", "chairman", "fiduciary"],
    icon: <ShieldCheck className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "reports",
    label: "Annual Reports & Financials",
    href: "/reports",
    group: "Governance & Compliance",
    keywords: ["audit", "form 10b", "financials", "annual report"],
    icon: <FileText className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "faq",
    label: "Frequently Asked Questions",
    href: "/faq",
    group: "Help & Contact",
    keywords: ["faq", "questions", "tax", "80g", "help"],
    icon: <HelpCircle className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
  {
    id: "contact",
    label: "Contact & Offices",
    href: "/contact",
    group: "Help & Contact",
    keywords: ["balangir", "bhubaneswar", "helpline", "email", "address"],
    icon: <Mail className="w-4 h-4 text-forest" aria-hidden="true" />,
  },
];

export function SiteSearchTrigger() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const items = useMemo(() => {
    const navChildren: SearchRouteItem[] = [];
    for (const nav of TRUST_CONFIG.navigation) {
      if (!nav.children) continue;
      for (const child of nav.children) {
        if (!VERIFIED_SEARCH_ROUTES.some((r) => r.href === child.href)) {
          navChildren.push({
            id: `nav-${child.href}`,
            label: child.label,
            href: child.href,
            group: nav.label,
            keywords: [child.description],
            icon: <FileText className="w-4 h-4 text-forest" aria-hidden="true" />,
          });
        }
      }
    }
    return [...VERIFIED_SEARCH_ROUTES, ...navChildren];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [items, query]);

  const openSearch = () => {
    setActiveIndex(0);
    setOpen(true);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) {
          setOpen(false);
        } else {
          openSearch();
        }
        return;
      }

      if (!isInput && e.key === "/" && !open) {
        e.preventDefault();
        openSearch();
      }

      if (e.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const navigateTo = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openSearch}
        aria-label="Search site (Press / or Ctrl+K)"
        className="inline-flex items-center gap-1.5 px-2.5 py-2 min-h-[36px] text-[11.5px] font-medium text-forest border border-border-warm bg-white/80 hover:bg-sage/55 rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-terracotta shrink-0"
      >
        <Search className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
        <span className="hidden xl:inline">Search</span>
        <kbd className="hidden 2xl:inline-block px-1 py-0.5 text-[10px] font-mono bg-cream border border-border-warm rounded-xs text-ink-secondary">
          /
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={MOTION_TRANSITIONS.fast}
            className="fixed inset-0 z-[80] bg-forest-deep/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setOpen(false);
                triggerRef.current?.focus();
              }
            }}
          >
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label="Search MECT website"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={MOTION_TRANSITIONS.fast}
              className="w-full max-w-lg bg-cream border border-border-warm rounded-xs shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border-warm bg-white">
                <Search className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        filtered.length ? (prev + 1) % filtered.length : 0
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        filtered.length
                          ? (prev - 1 + filtered.length) % filtered.length
                          : 0
                      );
                    } else if (e.key === "Enter" && filtered[activeIndex]) {
                      e.preventDefault();
                      navigateTo(filtered[activeIndex].href);
                    }
                  }}
                  placeholder="Search pages, programmes, SBI details, 12A/80G..."
                  aria-label="Search pages and statutory disclosures"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-secondary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  aria-label="Close search"
                  className="p-1.5 min-h-[32px] min-w-[32px] inline-flex items-center justify-center rounded-xs text-forest hover:bg-sage/60 focus-visible:outline-2 focus-visible:outline-terracotta"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border-warm/50">
                {filtered.length === 0 ? (
                  <p className="py-8 text-center text-xs text-ink-secondary">
                    No matching pages found for &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  filtered.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateTo(item.href)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-xs transition-colors ${
                        idx === activeIndex
                          ? "bg-sand/55 text-forest-deep"
                          : "hover:bg-sage/45 text-ink"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        {item.icon}
                        <span className="text-xs font-semibold truncate">
                          {item.label}
                        </span>
                      </span>
                      <span className="text-[10px] font-mono text-ink-secondary shrink-0 ml-2">
                        {item.group}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

