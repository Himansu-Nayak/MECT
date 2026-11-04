"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  MessageSquare,
  ShieldAlert,
  UserCog,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from "lucide-react";

function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const { user, token, isAuthenticated, isLoading, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0B3B24] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Verifying Secretariat Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Scholarships", href: "/admin/scholarships", icon: GraduationCap },
    { label: "Volunteers", href: "/admin/volunteers", icon: Users },
    { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
    { label: "Staff & Users", href: "/admin/users", icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#072617] text-white p-4 flex items-center justify-between border-b border-[#C5A059]/30">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-[#E4C88A]" />
          <span className="font-serif font-bold tracking-wide text-sm">MECT Secretariat</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1 rounded text-white hover:bg-white/10"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`w-full md:w-64 bg-[#072617] text-white flex flex-col shrink-0 border-r border-[#C5A059]/20 ${
          mobileNavOpen ? "block" : "hidden md:flex"
        }`}
      >
        <div className="p-6 border-b border-white/10 hidden md:block">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#C5A059] flex items-center justify-center text-[#072617] font-serif font-bold text-lg shadow-md">
              M
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm text-white tracking-wide">
                MAHAVIR TRUST
              </h1>
              <p className="text-[10px] text-[#E4C88A] tracking-wider uppercase">
                Administrative Desk
              </p>
            </div>
          </div>
        </div>

        {/* User Identity Pill */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white/95 truncate max-w-[140px]">
              {user?.fullName || user?.username}
            </div>
            <div className="text-[10px] text-[#E4C88A] uppercase tracking-wider font-mono">
              {user?.role?.replace("ROLE_", "")}
            </div>
          </div>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#C5A059] text-[#072617] font-semibold shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#072617]" : "text-[#E4C88A]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Public Portal & Sign Out Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Portal</span>
            </span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center space-x-2 w-full px-3 py-2 text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Administrative Workbench */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AdminAuthProvider>
  );
}

