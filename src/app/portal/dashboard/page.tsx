"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { downloadPortalReceiptPdf } from "@/lib/portal-api";
import {
  Heart,
  FileDown,
  UserCog,
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  ShieldCheck,
  Receipt,
  Sparkles,
} from "lucide-react";

const formatInr = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function PortalDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, token, dashboard, refreshDashboard, logout } = usePortalAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [downloadingReceipt, setDownloadingReceipt] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/login?next=/portal/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (token && !dashboard && !isLoading) {
      refreshDashboard();
    }
  }, [token, dashboard, isLoading, refreshDashboard]);

  const filteredHistory = useMemo(() => {
    const items = dashboard?.donationHistory ?? [];
    return items.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return (
          item.donationReference.toLowerCase().includes(q) ||
          item.programmeName.toLowerCase().includes(q) ||
          (item.receiptNumber || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [dashboard, statusFilter, searchQuery]);

  if (isLoading || !isAuthenticated || !dashboard) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-cream text-sm text-ink-sand">
        Loading your MECT Supporter Dashboard...
      </div>
    );
  }

  const { account, donationSummary, donationHistory } = dashboard;
  const fullName = account.profile?.fullName?.trim();
  const firstName = fullName ? fullName.split(/\s+/)[0] : "Supporter";

  const handleDownloadReceipt = async (receiptNumber: string) => {
    if (!token) return;
    setErrorMsg(null);
    setDownloadingReceipt(receiptNumber);
    try {
      await downloadPortalReceiptPdf(token, receiptNumber);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to download PDF receipt.");
    } finally {
      setDownloadingReceipt(null);
    }
  };

  const statusBadgeVariant = (status: string): "forest" | "terracotta" | "warning" | "outline" => {
    if (status === "SUCCESS") return "forest";
    if (status === "FAILED" || status === "EXPIRED") return "terracotta";
    if (status === "PENDING") return "warning";
    return "outline";
  };

  return (
    <div className="bg-cream min-h-screen py-10 md:py-14">
      <Container className="space-y-8">
        {/* Welcome Header */}
        <Card padding="lg" className="bg-forest text-white border-none shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="gold" size="sm">
                  {account.isDonor ? "Verified Donor Account" : "Community Member Account"}
                </Badge>
                {account.profileCompleted ? (
                  <Badge variant="outline" size="sm" className="border-white/30 text-white">
                    Profile Complete
                  </Badge>
                ) : (
                  <Link
                    href="/portal/profile?welcome=1"
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold bg-terracotta text-white rounded-xs hover:bg-terracotta-dark"
                  >
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    <span>Complete Your Profile</span>
                  </Link>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">
                Welcome back, {firstName}
              </h1>
              <p className="text-xs sm:text-sm text-cream/90 max-w-2xl">
                {account.primaryEmail || account.primaryPhone || "Verified MECT Supporter"}{" "}
                &bull; Verified donations, official PDF receipts, and programme support history appear below once settled by our payment gateway.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link href="/donate">
                <Button className="bg-terracotta hover:bg-terracotta-dark text-white font-bold text-xs flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  <span>Donate Now</span>
                </Button>
              </Link>
              <Link href="/portal/profile">
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold text-xs flex items-center gap-1.5"
                >
                  <UserCog className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Profile &amp; Consent</span>
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={logout}
                className="bg-transparent hover:bg-white/10 text-white border-white/25 font-semibold text-xs flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </Card>

        {errorMsg && (
          <div
            role="alert"
            className="p-3.5 rounded-xs bg-terracotta/10 border border-terracotta/40 flex items-start gap-2.5 text-xs text-terracotta-dark font-semibold"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* KPI Cards — Verified Ledger Data Only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" className="bg-white border-border-warm space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-sand">
              Verified Contributions
            </span>
            <p className="text-2xl font-serif font-bold text-forest">
              {formatInr(Number(donationSummary.totalSuccessfulAmount || 0))}
            </p>
            <p className="text-[11px] text-ink-sand">
              Confirmed settled transactions only
            </p>
          </Card>

          <Card padding="md" className="bg-white border-border-warm space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-sand">
              Successful Receipts
            </span>
            <p className="text-2xl font-serif font-bold text-terracotta-dark">
              {donationSummary.successfulCount}
            </p>
            <p className="text-[11px] text-ink-sand">
              Official PDF receipts ready
            </p>
          </Card>

          <Card padding="md" className="bg-white border-border-warm space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-sand">
              Pending Verification
            </span>
            <p className="text-2xl font-serif font-bold text-forest">
              {donationSummary.pendingCount}
            </p>
            <p className="text-[11px] text-ink-sand">
              Awaiting payment gateway settlement
            </p>
          </Card>

          <Card padding="md" className="bg-white border-border-warm space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-sand">
              Communication Status
            </span>
            <p className="text-sm font-bold text-forest pt-1">
              {account.preferences?.whatsappOptIn ? "Email + WhatsApp Opted In" : "Email Receipts Active"}
            </p>
            <Link href="/portal/profile" className="text-[11px] font-semibold text-terracotta-dark underline block">
              Manage preferences &amp; consent
            </Link>
          </Card>
        </div>

        {/* Non-Donor Empty State vs Verified Donation Ledger */}
        {donationHistory.length === 0 ? (
          <Card padding="lg" className="bg-white border-border-warm text-center py-12 space-y-4">
            <div className="w-12 h-12 rounded-full bg-sand-light text-terracotta flex items-center justify-center mx-auto">
              <Receipt className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-serif font-bold text-forest">
                No Verified Donations Recorded Yet
              </h2>
              <p className="text-xs sm:text-sm text-ink-sand leading-relaxed">
                Your supporter account is active. When you contribute to any verified Mahaveer Educational &amp; Charitable Trust programme, each settled donation and official downloadable PDF receipt will appear here automatically.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/donate">
                <Button className="bg-terracotta hover:bg-terracotta-dark text-white font-bold text-xs">
                  Support a MECT Programme
                </Button>
              </Link>
              <Link href="/programmes">
                <Button variant="outline" className="text-xs font-semibold">
                  Explore Programmes
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card padding="lg" className="bg-white border-border-warm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-warm pb-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-forest">
                  Donation &amp; Official Receipt History
                </h2>
                <p className="text-xs text-ink-sand">
                  Receipts are issued exclusively after cryptographic payment verification.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-ink-sand absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ref, programme, receipt..."
                    aria-label="Search donation history"
                    className="h-9 pl-8 pr-3 text-xs bg-cream border border-border-warm rounded-xs text-ink focus:outline-none focus:border-terracotta"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by donation status"
                  className="h-9 px-3 text-xs bg-cream border border-border-warm rounded-xs text-ink focus:outline-none focus:border-terracotta"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUCCESS">Verified (Success)</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border-warm text-[11px] uppercase tracking-wider text-ink-sand">
                    <th className="py-2.5 pr-4">Date &amp; Reference</th>
                    <th className="py-2.5 pr-4">Programme</th>
                    <th className="py-2.5 pr-4">Method</th>
                    <th className="py-2.5 pr-4">Amount</th>
                    <th className="py-2.5 pr-4">Status</th>
                    <th className="py-2.5 text-right">Official Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-warm">
                  {filteredHistory.map((item) => (
                    <tr key={item.donationReference} className="hover:bg-cream/60">
                      <td className="py-3 pr-4">
                        <div className="font-mono font-bold text-forest">{item.donationReference}</div>
                        <div className="text-[11px] text-ink-sand">
                          {new Date(item.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                          {item.anonymous && " • Publicly Anonymous"}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-medium text-ink">
                        {item.programmeName}
                      </td>
                      <td className="py-3 pr-4 text-ink-sand">{item.paymentMethod}</td>
                      <td className="py-3 pr-4 font-bold text-forest">
                        {formatInr(Number(item.amount))}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={statusBadgeVariant(item.status)} size="sm">
                          {item.status === "SUCCESS" ? (
                            <span className="inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                              VERIFIED
                            </span>
                          ) : item.status === "PENDING" ? (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              PENDING
                            </span>
                          ) : (
                            item.status
                          )}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        {item.receiptAvailable && item.receiptNumber ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={downloadingReceipt === item.receiptNumber}
                            onClick={() => handleDownloadReceipt(item.receiptNumber!)}
                            className="inline-flex items-center gap-1.5 text-xs"
                          >
                            <FileDown className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
                            <span>
                              {downloadingReceipt === item.receiptNumber
                                ? "Downloading..."
                                : item.receiptNumber}
                            </span>
                          </Button>
                        ) : (
                          <span className="text-[11px] text-ink-sand inline-flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                            Pending Settlement
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-ink-sand">
                        No transactions match the current search or status filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
}
