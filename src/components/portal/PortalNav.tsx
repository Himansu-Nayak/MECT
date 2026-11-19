"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  FileDown,
  UserCog,
  ShieldCheck,
  Heart,
  LogOut,
} from "lucide-react";
import { usePortalAuth } from "@/context/PortalAuthContext";

export function PortalNav() {
  const pathname = usePathname();
  const { dashboard, logout } = usePortalAuth();

  const totalDonationsCount = dashboard?.donationHistory?.length || 0;
  const verifiedReceiptsCount =
    dashboard?.donationHistory?.filter(
      (d) =>
        (d.status === "SUCCESSFUL" || d.status === "SUCCESS") &&
        Boolean(d.receiptNumber)
    ).length || 0;

  const navItems = [
    {
      href: "/portal/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: "/portal/donations",
      label: "Donation History",
      icon: Receipt,
      badge: totalDonationsCount > 0 ? String(totalDonationsCount) : null,
    },
    {
      href: "/portal/receipts",
      label: "80G Receipts",
      icon: FileDown,
      badge: verifiedReceiptsCount > 0 ? String(verifiedReceiptsCount) : null,
    },
    {
      href: "/portal/profile",
      label: "Profile & 80G PAN",
      icon: UserCog,
      badge: dashboard?.account?.profileCompleted ? null : "Action Needed",
    },
    {
      href: "/portal/security",
      label: "Security & Settings",
      icon: ShieldCheck,
      badge: null,
    },
  ];

  return (
    <nav
      aria-label="Donor Portal Navigation"
      className="bg-white border-b border-border-warm sticky top-0 z-30 shadow-2xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 overflow-x-auto py-2 no-scrollbar">
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xs transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-terracotta ${
                    isActive
                      ? "bg-sand/60 text-terracotta-dark font-bold shadow-2xs"
                      : "text-forest hover:bg-cream hover:text-forest-deep"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-terracotta" : "text-ink-sand"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        item.badge === "Action Needed"
                          ? "bg-amber-100 text-amber-900"
                          : isActive
                          ? "bg-terracotta text-white"
                          : "bg-forest/10 text-forest"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0 pl-4 border-l border-border-warm/60">
            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-terracotta hover:bg-terracotta-dark rounded-xs transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span className="hidden sm:inline">Make a Donation</span>
              <span className="sm:hidden">Donate</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-ink-sand hover:text-terracotta transition-colors rounded-xs"
              title="Sign Out of Portal"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
