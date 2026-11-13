"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getAdminDashboardStats, AdminDashboardStats } from "@/lib/api";
import { AdminDonationSummaryDto, fetchAdminDonationSummary } from "@/lib/portal-api";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  GraduationCap,
  Users,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Landmark,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { token, user } = useAdminAuth();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [donationSummary, setDonationSummary] = useState<AdminDonationSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const [data, donSummary] = await Promise.all([
          getAdminDashboardStats(token),
          fetchAdminDonationSummary(token).catch(() => null),
        ]);
        setStats(data);
        setDonationSummary(donSummary);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load dashboard metrics.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-warm pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-terracotta-dark tracking-tight">
            Secretariat Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-ink-sand mt-1">
            Institutional governance summary for {user?.fullName || user?.username} ({user?.role.replace("ROLE_", "")})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/scholarships">
            <Button variant="primary" size="sm">
              <GraduationCap className="w-4 h-4 mr-1.5" /> Review Scholarships
            </Button>
          </Link>
          <Link href="/admin/volunteers">
            <Button variant="secondary" size="sm">
              <Users className="w-4 h-4 mr-1.5" /> Volunteer Desk
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Donation Ecosystem Financial Snapshot */}
      {donationSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-forest text-white rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cream/80">Total Verified Donations</span>
            <div className="mt-3">
              <div className="text-2xl font-black font-mono">
                ₹{Number(donationSummary.totalVerifiedAmount).toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-cream/80 mt-1">
                {donationSummary.verifiedDonationCount} verified · Last 30d: ₹{Number(donationSummary.last30DaysVerifiedAmount).toLocaleString("en-IN")}
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-white border border-border-warm rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-sand">Channel Split (Verified)</span>
            <div className="mt-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Cashfree Gateway:</span>
                <strong className="font-mono text-forest">₹{Number(donationSummary.cashfreeVerifiedAmount).toLocaleString("en-IN")}</strong>
              </div>
              <div className="flex justify-between">
                <span>SBI Direct Verified:</span>
                <strong className="font-mono text-forest">₹{Number(donationSummary.sbiVerifiedAmount).toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-white border border-border-warm rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-sand">SBI UTR Review Queue</span>
            <div className="mt-3 flex items-end justify-between">
              <div className="text-2xl font-black text-terracotta-dark">{donationSummary.utrReviewQueueCount}</div>
              <Link href="/admin/donors" className="text-xs font-bold text-forest underline">
                Open Queue &rarr;
              </Link>
            </div>
          </Card>
          <Card className="p-5 bg-white border border-border-warm rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-sand">Gateway Pending / Failed</span>
            <div className="mt-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Pending Gateway:</span>
                <strong className="font-mono">{donationSummary.pendingGatewayCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Failed / Expired:</span>
                <strong className="font-mono text-red-700">{donationSummary.failedOrExpiredCount}</strong>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Scholarships Demand */}
        <Card className="p-5 bg-white border border-border-warm shadow-sm rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-sand uppercase tracking-wider">Tuition Disbursal Demand</span>
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta-dark flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-terracotta-dark">
              ₹{stats ? Number(stats.totalDisbursalDemand).toLocaleString("en-IN") : "0"}
            </div>
            <div className="text-[11px] text-ink-sand mt-1 flex items-center gap-1.5">
              <span>Disbursed:</span>
              <span className="font-bold text-forest">
                ₹{stats ? Number(stats.totalDisbursedAmount).toLocaleString("en-IN") : "0"}
              </span>
            </div>
          </div>
        </Card>

        {/* Metric 2: Applications Intake */}
        <Card className="p-5 bg-white border border-border-warm shadow-sm rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-sand uppercase tracking-wider">Scholarship Intake</span>
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-forest flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-terracotta-dark">{stats?.totalScholarships ?? 0}</div>
            <div className="text-[11px] text-ink-sand mt-1 flex items-center gap-2">
              <span className="text-terracotta-dark font-semibold">{stats?.submittedScholarships ?? 0} Pending</span>
              <span>•</span>
              <span className="text-forest font-semibold">{stats?.approvedScholarships ?? 0} Approved</span>
            </div>
          </div>
        </Card>

        {/* Metric 3: Volunteers */}
        <Card className="p-5 bg-white border border-border-warm shadow-sm rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-sand uppercase tracking-wider">District Volunteers</span>
            <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta-dark flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-terracotta-dark">{stats?.totalVolunteers ?? 0}</div>
            <div className="text-[11px] text-ink-sand mt-1 flex items-center gap-2">
              <span className="text-terracotta-dark font-semibold">{stats?.pendingVolunteers ?? 0} Awaiting Review</span>
              <span>•</span>
              <span className="text-forest font-semibold">{stats?.approvedVolunteers ?? 0} Active</span>
            </div>
          </div>
        </Card>

        {/* Metric 4: Inquiries & Governance */}
        <Card className="p-5 bg-white border border-border-warm shadow-sm rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-sand uppercase tracking-wider">Public Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-terracotta-dark">{stats?.totalInquiries ?? 0}</div>
            <div className="text-[11px] text-ink-sand mt-1">
              Active Admin Staff: <span className="font-bold text-ink">{stats?.totalAdminUsers ?? 1}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Administrative Action Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Scholarships Scrutiny */}
        <Card className="p-6 bg-white border border-border-warm shadow-sm rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sand-light text-forest flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-terracotta-dark">Scholarship Scrutiny Desk</h2>
            </div>
            <Badge variant="neutral">{stats?.submittedScholarships ?? 0} Pending</Badge>
          </div>
          <p className="text-xs text-ink-sand leading-relaxed">
            Review student household income certificates, verify college enrolment against institutional demand
            letters, and execute board status approvals with direct college bank remittance.
          </p>
          <div className="pt-2">
            <Link href="/admin/scholarships">
              <Button variant="primary" size="sm" className="w-full sm:w-auto">
                Open Scholarship Desk <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Module 2: Volunteer Registry */}
        <Card className="p-6 bg-white border border-border-warm shadow-sm rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sand-light text-forest flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-terracotta-dark">Volunteer Coordination Desk</h2>
            </div>
            <Badge variant="neutral">{stats?.pendingVolunteers ?? 0} Need Orientation</Badge>
          </div>
          <p className="text-xs text-ink-sand leading-relaxed">
            Manage 30-district ground mentors and scholarship intake assistants across Odisha. Transition volunteer
            stages with complete transactional audit recording and optimistic concurrency locking.
          </p>
          <div className="pt-2">
            <Link href="/admin/volunteers">
              <Button variant="primary" size="sm" className="w-full sm:w-auto">
                Open Volunteer Desk <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Statutory Architecture Telemetry Box */}
      <Card className="p-5 bg-forest text-white rounded-2xl shadow-md border border-sand/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-sand shrink-0" />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-cream block">
                Statutory Compliance & Audit Integrity
              </span>
              <p className="text-xs text-cream/90 mt-0.5">
                Every administrative state mutation triggers mandatory audit persistence. Disbursals enforce zero-cash
                handout rules.
              </p>
            </div>
          </div>
          <Link href="/admin/audit-logs">
            <button className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shrink-0">
              Inspect Audit Log
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
