"use client";

import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getAdminAuditLogs, AdminAuditLog } from "@/lib/api";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, Search, AlertCircle, Shield, Globe, Clock } from "lucide-react";

export default function AdminAuditLogsPage() {
  const { token } = useAdminAuth();
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchLogs = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminAuditLogs(token);
      setLogs(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch statutory audit trail.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  const filtered = logs.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.actorUsername.toLowerCase().includes(q) ||
      l.resourceType.toLowerCase().includes(q) ||
      (l.resourceId && l.resourceId.toLowerCase().includes(q)) ||
      (l.details && l.details.toLowerCase().includes(q)) ||
      (l.ipAddress && l.ipAddress.includes(q))
    );
  });

  const getActionBadge = (action: string) => {
    if (action.includes("FAILED") || action.includes("BLOCKED") || action.includes("LOCKED")) {
      return <Badge variant="danger">{action}</Badge>;
    }
    if (action.includes("STATUS") || action.includes("UPDATE")) {
      return <Badge variant="warning">{action}</Badge>;
    }
    if (action.includes("SUCCESS") || action.includes("APPLIED") || action.includes("CREATED")) {
      return <Badge variant="success">{action}</Badge>;
    }
    return <Badge variant="neutral">{action}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B3B24]">Statutory Audit & Access Trail</h1>
          <p className="text-xs text-gray-500 mt-1">
            Immutable transactional event ledger recording all staff actions, state changes, and authentication logs.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchLogs} disabled={isLoading}>
          Refresh Audit Ledger
        </Button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Search Bar */}
      <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by action, actor, resource ID, IP address, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </Card>

      {/* Table Container */}
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">Client IP</th>
                <th className="p-3.5">Audit Context / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Loading statutory audit trail from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No audit records match the query.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 whitespace-nowrap text-gray-500 text-[11px] font-mono">
                      {new Date(log.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="p-3.5 font-bold text-gray-900">{log.actorUsername}</td>
                    <td className="p-3.5">{getActionBadge(log.action)}</td>
                    <td className="p-3.5 font-mono text-[11px] text-gray-700">
                      {log.resourceType}
                      {log.resourceId ? `:${log.resourceId}` : ""}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-gray-500">{log.ipAddress || "—"}</td>
                    <td className="p-3.5 text-gray-600 max-w-xs truncate" title={log.details || ""}>
                      {log.details || "—"}
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
