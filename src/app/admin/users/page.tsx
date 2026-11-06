"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getAdminUsers, createAdminUser, updateAdminUserStatus, AdminUserSummary } from "@/lib/api";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { UserCog, UserPlus, Shield, AlertCircle, CheckCircle2, Lock, X } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "ROLE_ADMIN", label: "Administrator (Full Operations)" },
  { value: "ROLE_APPLICATION_REVIEWER", label: "Scholarship Application Reviewer" },
  { value: "ROLE_FINANCE_OFFICER", label: "Finance & Disbursal Officer" },
  { value: "ROLE_VOLUNTEER_COORDINATOR", label: "Volunteer Coordinator" },
  { value: "ROLE_TRUSTEE", label: "Trustee (Board Member - Read Only Oversight)" },
];

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAdminAuth();
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New User Modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "ROLE_APPLICATION_REVIEWER",
  });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminUsers(token);
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch administrative users.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let isCancelled = false;
    if (!token) return;

    getAdminUsers(token)
      .then((data) => {
        if (!isCancelled) {
          setUsers(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to fetch administrative users.");
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const created = await createAdminUser(token, newUser);
      setUsers((prev) => [...prev, created]);
      setShowCreateModal(false);
      setNewUser({ username: "", email: "", password: "", fullName: "", role: "ROLE_APPLICATION_REVIEWER" });
      setSuccessMessage(`Account for ${created.username} provisioned successfully.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCreateError(err.message);
      } else {
        setCreateError("Failed to provision administrator account.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (userItem: AdminUserSummary) => {
    if (!token) return;
    const nextStatus = userItem.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const updated = await updateAdminUserStatus(token, userItem.id, nextStatus);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setSuccessMessage(`Status for ${userItem.username} updated to ${updated.status}.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to update status.");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="success">Active</Badge>;
      case "LOCKED":
        return <Badge variant="danger">Locked (Max Tries)</Badge>;
      case "SUSPENDED":
        return <Badge variant="neutral">Suspended</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B3B24]">Administrative Access & Staff Provisioning</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage institutional administrative personnel, assign RBAC access roles, and monitor account security states.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={fetchUsers} disabled={isLoading}>
            Refresh
          </Button>
          {(currentUser?.role === "ROLE_SUPER_ADMIN" || currentUser?.role === "ROLE_ADMIN") && (
            <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
              <UserPlus className="w-4 h-4 mr-1.5" /> Provision Staff Account
            </Button>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Users Table */}
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Staff Officer</th>
                <th className="p-3.5">Institutional Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Failed Tries</th>
                <th className="p-3.5">Provisioned</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No users recorded.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-gray-900">{u.fullName}</div>
                      <div className="text-[11px] text-gray-500 font-mono">@{u.username} • {u.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {u.role.replace("ROLE_", "")}
                      </span>
                    </td>
                    <td className="p-3.5">{getStatusBadge(u.status)}</td>
                    <td className="p-3.5 font-mono text-gray-600">{u.failedLoginAttempts}</td>
                    <td className="p-3.5 text-gray-500 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-3.5 text-right">
                      {currentUser?.role === "ROLE_SUPER_ADMIN" && u.username !== currentUser.username && (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                          {u.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Provisioning Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h2 className="text-lg font-black text-[#0B3B24]">Provision New Staff Account</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <Input
                label="Full Official Name"
                placeholder="e.g. Satyabrata Jena"
                required
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              />

              <Input
                label="Institutional Staff Username"
                placeholder="e.g. satya_officer"
                required
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />

              <Input
                label="Official Email Address"
                type="email"
                placeholder="officer@mahavirtrust.org"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />

              <Input
                label="Initial Temporary Password"
                type="password"
                placeholder="Minimum 8 characters"
                required
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />

              <Select
                label="Institutional Role"
                options={ROLE_OPTIONS}
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              />

              {createError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {createError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isCreating}>
                  {isCreating ? "Provisioning..." : "Provision Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
