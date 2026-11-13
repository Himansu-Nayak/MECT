"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  claimGuestDonations,
  downloadPortalReceiptPdf,
} from "@/lib/portal-api";
import { usePortalAuth } from "@/context/PortalAuthContext";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileDown,
  Heart,
  HelpCircle,
  Link2,
  Lock,
  LogOut,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  UserCog,
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
  if (status === "PENDING" || status === "PENDING_VERIFICATION" || status === "UTR_SUBMITTED" || status === "UNDER_REVIEW") {
    return "gold";
  }
  return "outline";
}

export default function PortalDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: loading, token, dashboard, refreshDashboard, logout: authLogout } = usePortalAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [claimBanner, setClaimBanner] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingReceipt, setDownloadingReceipt] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/portal/login?next=/portal/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  const handleDownloadReceipt = async (receiptNumber: string) => {
    if (!token) return;
    setDownloadingReceipt(receiptNumber);
    setErrorMsg(null);
    try {
      await downloadPortalReceiptPdf(token, receiptNumber);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to download PDF receipt.");
    } finally {
      setDownloadingReceipt(null);
    }
  };

  const handleClaimGuestDonations = async () => {
    if (!token) return;
    setClaiming(true);
    setErrorMsg(null);
    setClaimBanner(null);
    try {
      const res = await claimGuestDonations(token);
      setClaimBanner(res.message);
      await refreshDashboard();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to claim guest donations.");
    } finally {
      setClaiming(false);
    }
  };

  const logout = () => {
    authLogout();
    router.push("/portal/login");
  };

  const filteredHistory = useMemo(() => {
    if (!dashboard) return [];
    return dashboard.donationHistory.filter((item) => {
      if (statusFilter !== "ALL") {
        if (statusFilter === "SUCCESSFUL" && item.status !== "SUCCESSFUL" && item.status !== "SUCCESS") return false;
        if (statusFilter === "PENDING" && !["PENDING", "CREATED", "PENDING_VERIFICATION"].includes(item.status)) return false;
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

  if (loading) {
    return (
      <div className="bg-cream min-h-screen py-16">
        <Container className="text-center">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-sand mt-3">
            Loading Your MECT Portal...
          </p>
        </Container>
      </div>
    );
  }

  if (!dashboard) return null;

  const { account, donationSummary, donationHistory, manualClaims = [] } = dashboard;
  const firstName = account.profile?.fullName?.split(" ")[0] || "Supporter";
  const claimableCount = donationSummary.claimableGuestDonationsCount || 0;

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
                &bull; Track your Cashfree &amp; SBI transfers, download official PDF receipts, claim guest donations, and manage consent.
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
                  <span>Profile &amp; Preferences</span>
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
          <div role="alert" className="p-3.5 rounded-xs bg-terracotta/10 border border-terracotta/40 flex items-start gap-2.5 text-xs text-terracotta-dark font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {claimBanner && (
          <div className="p-3.5 rounded-xs bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" aria-hidden="true" />
            <span>{claimBanner}</span>
          </div>
        )}

        {/* Claim Guest Donations Banner */}
        <Card padding="md" className="bg-white border-border-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xs bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-terracotta-dark">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-forest text-sm">
                Claim Guest Donations{" "}
                {claimableCount > 0 && (
                  <Badge variant="gold" size="sm" className="ml-1.5">
                    {claimableCount} Matched
                  </Badge>
                )}
              </h2>
              <p className="text-xs text-ink-sand mt-0.5">
                {claimableCount > 0
                  ? `We found ${claimableCount} guest donation(s) matching your OTP-verified email or mobile number.`
                  : "Previously donated without signing in? Link any guest contributions matching your verified email or mobile number."}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant={claimableCount > 0 ? "primary" : "outline"}
            size="sm"
            onClick={handleClaimGuestDonations}
            disabled={claiming}
            className="shrink-0 text-xs"
          >
            {claiming ? "Linking..." : "Check & Claim Donations"}
          </Button>
        </Card>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" className="bg-white border-border-warm space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-sand">
              Verified Contributions
            </span>
            <p className="text-2xl font-serif font-bold text-forest">
              {formatInr(Number(donationSummary.totalSuccessfulAmount || 0))}
            </p>
            <p className="text-[11px] text-ink-sand">Confirmed settled transactions</p>
          </Card>

          <Card padding="md" className="bg-white border-border-warm space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-sand">
              Downloadable Receipts
            </span>
            <p className="text-2xl font-serif font-bold text-terracotta-dark">
              {donationSummary.successfulCount}
            </p>
            <p className="text-[11px] text-ink-sand">Official PDF acknowledgements</p>
          </Card>

          <Card padding="md" className="bg-white border-border-warm space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-sand">
              Pending Verification
            </span>
            <p className="text-2xl font-serif font-bold text-forest">
              {donationSummary.pendingCount}
            </p>
            <p className="text-[11px] text-ink-sand">Gateway or SBI UTR review</p>
          </Card>

          <Card padding="md" className="bg-white border-border-warm space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-sand">
              Communication &amp; Security
            </span>
            <p className="text-sm font-bold text-forest pt-1">
              {account.preferences?.whatsappOptIn ? "Email + WhatsApp Active" : "Email Receipts Active"}
            </p>
            <Link href="/portal/profile" className="text-[11px] font-semibold text-terracotta-dark underline block">
              Manage consent &amp; verified contacts
            </Link>
          </Card>
        </div>

        {/* Pending Payment Verification (SBI UTR Claims) */}
        {manualClaims.length > 0 && (
          <Card padding="lg" className="bg-white border-border-warm space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-border-warm pb-3">
              <div>
                <h2 className="text-lg font-serif font-bold text-forest">
                  SBI Direct Transfer Verification Tracker
                </h2>
                <p className="text-xs text-ink-sand">
                  Workflow: UTR_SUBMITTED &rarr; UNDER_REVIEW &rarr; VERIFIED (final PDF receipt issued upon verification).
                </p>
              </div>
              <Badge variant="gold" size="sm">{manualClaims.length} Claim(s)</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {manualClaims.map((claim) => (
                <div key={claim.claimReference} className="border border-border-warm rounded-xs p-3.5 bg-cream/40 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-forest">{claim.claimReference}</span>
                    <Badge variant={statusBadgeVariant(claim.status)} size="sm">{claim.status}</Badge>
                  </div>
                  <div className="text-ink font-medium">{claim.programmeName} · {formatInr(Number(claim.claimedAmount))}</div>
                  <div className="font-mono text-[11px] text-ink-sand">
                    UTR: {claim.utrNormalized} · Date: {claim.transferDate}
                  </div>
                  {claim.verificationNotes && (
                    <div className="text-[11px] text-forest bg-white border border-border-warm rounded-xs p-2 mt-1">
                      Note: {claim.verificationNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* My Donations, Payment History & Download Receipts */}
        {donationHistory.length === 0 ? (
          <Card padding="lg" className="bg-white border-border-warm text-center py-12 space-y-4">
            <div className="w-12 h-12 rounded-full bg-sand-light text-terracotta flex items-center justify-center mx-auto">
              <Receipt className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-serif font-bold text-forest">No Verified Donations Recorded Yet</h2>
              <p className="text-xs sm:text-sm text-ink-sand leading-relaxed">
                Contribute to any verified MECT programme or click &ldquo;Check &amp; Claim Donations&rdquo; above if you previously donated as a guest.
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
                  My Donations, Payment History &amp; Receipts
                </h2>
                <p className="text-xs text-ink-sand">
                  Official receipts are generated strictly after verified Cashfree or SBI statement settlement.
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
                  <option value="SUCCESSFUL">Verified</option>
                  <option value="PENDING">Pending / Verification</option>
                  <option value="FAILED">Failed / Expired</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border-warm text-[11px] uppercase tracking-wider text-ink-sand">
                    <th className="py-2.5 pr-4">Date &amp; Reference</th>
                    <th className="py-2.5 pr-4">Programme</th>
                    <th className="py-2.5 pr-4">Channel</th>
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
                      <td className="py-3 pr-4 font-medium text-ink">{item.programmeName}</td>
                      <td className="py-3 pr-4 text-ink-sand">
                        <div>{item.provider || item.paymentMethod}</div>
                      </td>
                      <td className="py-3 pr-4 font-bold text-forest">{formatInr(Number(item.amount))}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={statusBadgeVariant(item.status)} size="sm">
                          {item.status === "SUCCESSFUL" || item.status === "SUCCESS" ? (
                            <span className="inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                              VERIFIED
                            </span>
                          ) : item.status === "PENDING" || item.status === "PENDING_VERIFICATION" ? (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" aria-hidden="true" />
                              {item.status === "PENDING_VERIFICATION" ? "VERIFYING UTR" : "PENDING"}
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
                              {downloadingReceipt === item.receiptNumber ? "Downloading..." : item.receiptNumber}
                            </span>
                          </Button>
                        ) : (
                          <span className="text-[11px] text-ink-sand inline-flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                            Awaiting Verification
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

        {/* Help & Support + Account Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding="md" className="bg-white border-border-warm space-y-2">
            <div className="flex items-center gap-2 font-serif font-bold text-forest text-base">
              <HelpCircle className="w-4 h-4 text-terracotta-dark" />
              <span>Help &amp; Receipt Support</span>
            </div>
            <p className="text-xs text-ink-sand leading-relaxed">
              Need help reconciling a pending Cashfree or SBI transfer? Contact our Finance &amp; Donor Desk with your donation reference or UTR.
            </p>
            <Link href="/contact" className="text-xs font-bold text-terracotta-dark underline inline-block">
              Contact MECT Donor Support &rarr;
            </Link>
          </Card>

          <Card padding="md" className="bg-white border-border-warm space-y-2">
            <div className="flex items-center gap-2 font-serif font-bold text-forest text-base">
              <Lock className="w-4 h-4 text-terracotta-dark" />
              <span>Account Security &amp; Verified Contacts</span>
            </div>
            <p className="text-xs text-ink-sand leading-relaxed">
              Verified identities: {account.verifiedContacts.map((c) => c.contactValue).join(", ") || "OTP Verified"}. Manage profile, PAN, WhatsApp consent, or deletion requests.
            </p>
            <Link href="/portal/profile" className="text-xs font-bold text-terracotta-dark underline inline-block">
              Open Account &amp; Security Settings &rarr;
            </Link>
          </Card>
        </div>
      </Container>
    </div>
  );
}
