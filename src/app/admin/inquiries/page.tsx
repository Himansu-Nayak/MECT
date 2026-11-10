"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getAdminInquiries, AdminInquiry } from "@/lib/api";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageSquare, Search, AlertCircle, Mail, Phone, Calendar } from "lucide-react";

export default function AdminInquiriesPage() {
  const { token } = useAdminAuth();
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchInquiries = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminInquiries(token);
      setInquiries(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch public inquiries.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let isCancelled = false;
    if (!token) return;

    getAdminInquiries(token)
      .then((data) => {
        if (!isCancelled) {
          setInquiries(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to fetch public inquiries.");
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

  const filtered = inquiries.filter((inq) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inq.fullName.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.category.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-warm pb-4">
        <div>
          <h1 className="text-2xl font-black text-terracotta-dark">Public Contact & Grievance Inquiries</h1>
          <p className="text-xs text-ink-sand mt-1">
            Review incoming public messages, student assistance requests, and institutional collaboration queries.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchInquiries} disabled={isLoading}>
          Refresh Inquiries
        </Button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Search Bar */}
      <Card className="p-4 bg-white border border-border-warm rounded-xl shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-ink-secondary" />
          <input
            type="text"
            placeholder="Search by sender name, email, category, or message keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-border-warm rounded-lg focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>
      </Card>

      {/* Table Container */}
      <Card className="bg-white border border-border-warm rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-cream/65 border-b border-border-warm text-ink-sand font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Sender</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Received Date</th>
                <th className="p-3.5">Message Content</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-ink-secondary">
                    Loading inquiries...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-ink-secondary">
                    No inquiries recorded in database.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-cream/65/70 transition-colors align-top">
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-ink">{item.fullName}</div>
                      <div className="text-[11px] text-ink-sand flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {item.email}
                      </div>
                      <div className="text-[11px] text-ink-sand flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {item.phone}
                      </div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <Badge variant="neutral">{item.category}</Badge>
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-ink-sand text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3.5 text-forest leading-relaxed max-w-lg">
                      <p className="line-clamp-4">{item.message}</p>
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
