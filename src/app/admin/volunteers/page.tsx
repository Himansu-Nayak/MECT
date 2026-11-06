"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getAdminVolunteers, updateAdminVolunteerStatus, AdminVolunteer } from "@/lib/api";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Search, AlertCircle, CheckCircle2, Shield } from "lucide-react";

const ODISHA_DISTRICTS = [
  "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh",
  "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
  "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj",
  "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
];

const VOLUNTEER_STATUSES = [
  { value: "AWAITING_ORIENTATION", label: "Awaiting Orientation" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "ORIENTATION_COMPLETED", label: "Orientation Completed" },
  { value: "ACTIVE_MENTOR", label: "Active Mentor" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "REJECTED", label: "Rejected" },
];

export default function AdminVolunteersPage() {
  const { token } = useAdminAuth();
  const [volunteers, setVolunteers] = useState<AdminVolunteer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [districtFilter, setDistrictFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchVolunteers = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminVolunteers(token);
      setVolunteers(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch volunteer records.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let isCancelled = false;
    if (!token) return;

    getAdminVolunteers(token)
      .then((data) => {
        if (!isCancelled) {
          setVolunteers(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to fetch volunteer records.");
          }
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [token]);

  const handleStatusChange = async (volunteerId: number, newStatus: string) => {
    if (!token) return;
    setActionMessage(null);
    try {
      const res = await updateAdminVolunteerStatus(token, volunteerId, newStatus);
      setVolunteers((prev) =>
        prev.map((v) => (v.id === volunteerId ? { ...v, verificationStatus: res.verificationStatus, version: res.version } : v))
      );
      setActionMessage(`Volunteer #${volunteerId} status transitioned to ${res.verificationStatus}.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to update volunteer status.");
      }
    }
  };

  const filtered = volunteers.filter((v) => {
    if (districtFilter && v.district !== districtFilter) return false;
    if (statusFilter && v.verificationStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.fullName.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.phone.includes(q) ||
        v.roleInterest.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AWAITING_ORIENTATION":
        return <Badge variant="warning">Awaiting Orientation</Badge>;
      case "UNDER_REVIEW":
        return <Badge variant="neutral">Under Review</Badge>;
      case "ORIENTATION_COMPLETED":
        return <Badge variant="success">Orientation Completed</Badge>;
      case "ACTIVE_MENTOR":
        return <Badge variant="success">Active Mentor</Badge>;
      case "INACTIVE":
        return <Badge variant="neutral">Inactive</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B3B24]">Volunteer Coordination Desk</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage student mentors, academic tutors, and intake volunteers across all 30 Odisha districts.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchVolunteers} disabled={isLoading}>
          Refresh Table
        </Button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Name, Phone, Email, Role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">All Volunteer Statuses</option>
              {VOLUNTEER_STATUSES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">District Filter</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">All Odisha Districts</option>
              {ODISHA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table Container */}
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Volunteer</th>
                <th className="p-3.5">Role Interest</th>
                <th className="p-3.5">District</th>
                <th className="p-3.5">Registered</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Transition Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Loading volunteer registry...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No volunteer records match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-gray-900">{v.fullName}</div>
                      <div className="text-[11px] text-gray-500">{v.phone} • {v.email}</div>
                    </td>
                    <td className="p-3.5 font-medium text-gray-800">{v.roleInterest}</td>
                    <td className="p-3.5 text-gray-700">{v.district || "Unassigned"}</td>
                    <td className="p-3.5 text-gray-500">
                      {new Date(v.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-3.5">{getStatusBadge(v.verificationStatus)}</td>
                    <td className="p-3.5 text-right">
                      <select
                        value={v.verificationStatus}
                        onChange={(e) => handleStatusChange(v.id, e.target.value)}
                        className="px-2 py-1 text-[11px] font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      >
                        {VOLUNTEER_STATUSES.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
