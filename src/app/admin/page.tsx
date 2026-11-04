"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getAdminDashboardStats, AdminDashboardStats } from "@/lib/api";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAdminDashboardStats(token);
        setStats(data);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B3B24] tracking-tight">
            Secretariat Executive Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
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

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Scholarships Demand */}
        <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tuition Disbursal Demand</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#0B3B24]">
              ₹{stats ? Number(stats.totalDisbursalDemand).toLocaleString("en-IN") : "0"}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
              <span>Disbursed:</span>
              <span className="font-bold text-emerald-700">
                ₹{stats ? Number(stats.totalDisbursedAmount).toLocaleString("en-IN") : "0"}
              </span>
            </div>
          </div>
        </Card>

        {/* Metric 2: Applications Intake */}
        <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Scholarship Intake</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#0B3B24]">{stats?.totalScholarships ?? 0}</div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
              <span className="text-amber-700 font-semibold">{stats?.submittedScholarships ?? 0} Pending</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{stats?.approvedScholarships ?? 0} Approved</span>
            </div>
          </div>
        </Card>

        {/* Metric 3: Volunteers */}
        <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">District Volunteers</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#0B3B24]">{stats?.totalVolunteers ?? 0}</div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
              <span className="text-amber-700 font-semibold">{stats?.pendingVolunteers ?? 0} Awaiting Review</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{stats?.approvedVolunteers ?? 0} Active</span>
            </div>
          </div>
        </Card>

        {/* Metric 4: Inquiries & Governance */}
        <Card className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Public Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#0B3B24]">{stats?.totalInquiries ?? 0}</div>
            <div className="text-[11px] text-gray-500 mt-1">
              Active Admin Staff: <span className="font-bold text-gray-800">{stats?.totalAdminUsers ?? 1}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Administrative Action Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Scholarships Scrutiny */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#0B3B24]">Scholarship Scrutiny Desk</h2>
            </div>
            <Badge variant="neutral">{stats?.submittedScholarships ?? 0} Pending</Badge>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
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
        <Card className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#0B3B24]">Volunteer Coordination Desk</h2>
            </div>
            <Badge variant="neutral">{stats?.pendingVolunteers ?? 0} Need Orientation</Badge>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
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
      <Card className="p-5 bg-gradient-to-r from-emerald-950 to-[#0B3B24] text-white rounded-2xl shadow-md border-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300 block">
                Statutory Compliance & Audit Integrity
              </span>
              <p className="text-xs text-emerald-100/90 mt-0.5">
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
