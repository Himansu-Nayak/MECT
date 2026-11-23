"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { downloadPortalReceiptPdf } from "@/lib/portal-api";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  Heart,
  HelpCircle,
  Loader2,
  Receipt,
  Search,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

function formatInr(val: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val || 0);
}

function statusBadgeVariant(status: string): "forest" | "gold" | "outline" {
  if (status === "SUCCESSFUL" || status === "SUCCESS" || status === "VERIFIED") return "forest";
  if (
    status === "PENDING" ||
    status === "PENDING_VERIFICATION" ||
    status === "UTR_SUBMITTED" ||
    status === "UNDER_REVIEW" ||
    status === "CREATED"
  ) {
    return "gold";
  }
  return "outline";
}

export default function PortalDonationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, token, dashboard } = usePortalAuth();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingNum, setDownloadingNum] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?next=/portal/donations");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleDownload = async (receiptNum: string) => {
    if (!token) return;
    setDownloadingNum(receiptNum);
    setErrorMsg(null);
    try {
      await downloadPortalReceiptPdf(token, receiptNum);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to download PDF receipt.");
    } finally {
      setDownloadingNum(null);
    }
  };

  const filteredHistory = useMemo(() => {
    if (!dashboard?.donationHistory) return [];
    return dashboard.donationHistory.filter((item) => {
      if (statusFilter !== "ALL") {
        if (statusFilter === "SUCCESSFUL" && item.status !== "SUCCESSFUL" && item.status !== "SUCCESS") return false;
        if (
          statusFilter === "PENDING" &&
          !["PENDING", "CREATED", "PENDING_VERIFICATION", "UTR_SUBMITTED"].includes(item.status)
        )
          return false;
        if (statusFilter === "FAILED" && !["FAILED", "EXPIRED", "CANCELLED"].includes(item.status)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.donationReference.toLowerCase().includes(q) ||
          item.programmeName.toLowerCase().includes(q) ||
          (item.receiptNumber || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [dashboard, statusFilter, searchQuery]);

  if (isLoading || !dashboard) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-16">
        <Container className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto mb-3" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink-muted">
            Loading Contribution History...
          </p>
        </Container>
      </div>
    );
  }

  return (
    <>
      <PortalNav />
      <div className="bg-[#FAF7F2] min-h-screen py-10 md:py-14">
      <Container className="max-w-5xl space-y-6">
        
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E1D8] pb-4">
          <div className="space-y-1">
            <Link
              href="/portal/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-dark hover:text-forest"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest">
              My Contribution History
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Complete auditable record of all voluntary contributions made to MECT programmes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/donate">
              <Button variant="primary" size="sm" className="shadow-xs">
                <Heart className="w-3.5 h-3.5 mr-1.5 fill-current" />
                <span>Make a Contribution</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Portal Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E6E1D8] overflow-x-auto pb-1 text-xs font-bold">
          <Link href="/portal/dashboard" className="px-3 py-2 text-ink-muted hover:text-forest">
            Dashboard
          </Link>
          <Link
            href="/portal/donations"
            className="px-3 py-2 text-terracotta-dark border-b-2 border-terracotta"
          >
            Donations ({dashboard.donationHistory.length})
          </Link>
          <Link href="/portal/receipts" className="px-3 py-2 text-ink-muted hover:text-forest">
            Receipts ({dashboard.donationSummary.successfulCount})
          </Link>
          <Link href="/portal/profile" className="px-3 py-2 text-ink-muted hover:text-forest">
            Profile Details
          </Link>
          <Link href="/portal/security" className="px-3 py-2 text-ink-muted hover:text-forest">
            Security &amp; Settings
          </Link>
        </div>

        {errorMsg && (
          <div role="alert" className="p-3.5 rounded-xs bg-red-50 border border-red-200 text-xs text-red-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <Card padding="md" className="bg-white border-[#E6E1D8] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference, programme, or receipt..."
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mr-1">
                Filter:
              </span>
              {[
                { id: "ALL", label: "All" },
                { id: "SUCCESSFUL", label: "Confirmed" },
                { id: "PENDING", label: "Pending Verification" },
                { id: "FAILED", label: "Unsettled" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-2.5 py-1 text-xs rounded-xs font-semibold transition-colors ${
                    statusFilter === f.id
                      ? "bg-forest text-white"
                      : "bg-[#FAF7F2] text-forest border border-[#E6E1D8] hover:bg-forest/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Donations List / Table */}
        {filteredHistory.length === 0 ? (
          <Card padding="lg" className="bg-white border-[#E6E1D8] text-center py-16 space-y-3">
            <Receipt className="w-10 h-10 text-ink-muted mx-auto" />
            <h3 className="font-serif font-bold text-forest text-lg">No Matching Contributions Found</h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              {searchQuery || statusFilter !== "ALL"
                ? "Try clearing your search query or switching your status filter."
                : "You have not made any recorded contributions yet. Support a MECT programme to generate your first official receipt."}
            </p>
            <div className="pt-2">
              <Link href="/donate">
                <Button variant="primary" size="sm">
                  Support a Cause Now
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <Card
                key={item.donationReference}
                padding="md"
                className="bg-white border-[#E6E1D8] hover:border-forest/40 transition-colors shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-forest text-sm">
                        {item.donationReference}
                      </span>
                      <Badge variant={statusBadgeVariant(item.status)} size="sm">
                        {item.status}
                      </Badge>
                      <span className="text-[11px] text-ink-muted font-mono">
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="text-xs text-ink font-semibold">
                      {item.programmeName}
                    </div>

                    <div className="text-[11px] text-ink-muted flex items-center gap-3 flex-wrap">
                      <span>Method: <strong>{item.paymentMethod}</strong></span>
                      {item.receiptNumber && (
                        <span>Receipt: <strong className="font-mono text-forest">{item.receiptNumber}</strong></span>
                      )}
                      {item.dedicationMessage && (
                        <span className="italic">&ldquo;{item.dedicationMessage}&rdquo;</span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E6E1D8]">
                    <span className="font-mono font-bold text-forest text-lg sm:text-xl">
                      {formatInr(item.amount)}
                    </span>

                    {item.receiptAvailable && item.receiptNumber && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={downloadingNum === item.receiptNumber}
                        onClick={() => handleDownload(item.receiptNumber!)}
                        className="text-xs h-8"
                      >
                        {downloadingNum === item.receiptNumber ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            <span>PDF...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            <span>Download Receipt</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </Container>
    </div>
    </>
  );
}
