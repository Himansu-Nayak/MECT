"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  AdminDonationRow,
  AdminDonorRow,
  AdminManualClaimRow,
  AdminOutboxItem,
  DonationProgrammeItem,
  downloadAdminReceiptPdf,
  exportAdminDonationsCsv,
  fetchAdminDonations,
  fetchAdminDonors,
  fetchAdminManualClaims,
  fetchAdminOutbox,
  fetchAdminProgrammes,
  fetchDonationReconciliationLogs,
  reconcileAdminDonation,
  retryAdminOutbox,
  reviewAdminManualClaim,
  toggleAdminProgramme,
} from "@/lib/portal-api";
import {
  Users,
  IndianRupee,
  MailCheck,
  Layers,
  Landmark,
  Search,
  Download,
  FileDown,
  RefreshCw,
  History,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

type AdminTab = "DONORS" | "DONATIONS" | "SBI_QUEUE" | "OUTBOX" | "PROGRAMMES";

const formatInr = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function AdminDonorsManagementPage() {
  const { token, user } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>("DONORS");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Donors tab state
  const [donors, setDonors] = useState<AdminDonorRow[]>([]);
  const [donorSearch, setDonorSearch] = useState("");
  const [donorRoleFilter, setDonorRoleFilter] = useState("ALL");

  // Donations tab state
  const [donations, setDonations] = useState<AdminDonationRow[]>([]);
  const [donationStatusFilter, setDonationStatusFilter] = useState("ALL");
  const [donationProviderFilter, setDonationProviderFilter] = useState("ALL");
  const [donationSearch, setDonationSearch] = useState("");
  const [donationSummary, setDonationSummary] = useState({
    totalSuccessfulAmount: 0,
    successfulCount: 0,
    pendingCount: 0,
    failedCount: 0,
    userDroppedCount: 0,
    expiredCount: 0,
    refundedCount: 0,
  });
  const [reconciliationRef, setReconciliationRef] = useState<string | null>(null);
  const [reconciliationLogs, setReconciliationLogs] = useState<
    Array<{
      id: number;
      previousStatus: string;
      newStatus: string;
      source: string;
      actor: string;
      note: string;
      createdAt: string;
    }>
  >([]);

  // Outbox & Programmes & SBI Claims state
  const [outboxItems, setOutboxItems] = useState<AdminOutboxItem[]>([]);
  const [programmes, setProgrammes] = useState<DonationProgrammeItem[]>([]);
  const [manualClaims, setManualClaims] = useState<AdminManualClaimRow[]>([]);
  const [claimStatusFilter, setClaimStatusFilter] = useState("ALL");
  const [reviewingClaimRef, setReviewingClaimRef] = useState<string | null>(null);
  const [bankStmtInputs, setBankStmtInputs] = useState<Record<string, string>>({});
  const [reviewNoteInputs, setReviewNoteInputs] = useState<Record<string, string>>({});

  const canVerifyClaims =
    user?.role === "ROLE_SUPER_ADMIN" ||
    user?.role === "ROLE_ADMIN" ||
    user?.role === "ROLE_FINANCE_OFFICER" ||
    user?.role === "ROLE_DONATION_VERIFICATION_OFFICER";

  const loadTabData = useCallback(async () => {
    if (!token) return;
    await Promise.resolve();
    setLoading(true);
    setErrorMsg(null);
    try {
      if (activeTab === "DONORS") {
        const res = await fetchAdminDonors(token, donorSearch, donorRoleFilter);
        setDonors(res.content || []);
      } else if (activeTab === "DONATIONS") {
        const res = await fetchAdminDonations(token, donationStatusFilter, donationProviderFilter, donationSearch);
        setDonations(res.content || []);
        if (res.summary) {
          setDonationSummary({
            userDroppedCount: 0,
            ...res.summary,
          });
        }
      } else if (activeTab === "SBI_QUEUE") {
        const claims = await fetchAdminManualClaims(token, claimStatusFilter);
        setManualClaims(claims || []);
      } else if (activeTab === "OUTBOX") {
        const res = await fetchAdminOutbox(token);
        setOutboxItems(res.content || []);
      } else if (activeTab === "PROGRAMMES") {
        const res = await fetchAdminProgrammes(token);
        setProgrammes(res || []);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load Trust ledger data.");
    } finally {
      setLoading(false);
    }
  }, [token, activeTab, donorSearch, donorRoleFilter, donationStatusFilter, donationProviderFilter, donationSearch, claimStatusFilter]);

  const handleReviewClaim = async (
    claimReference: string,
    decision: "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "NEEDS_REVIEW"
  ) => {
    if (!token || !canVerifyClaims) return;
    setReviewingClaimRef(claimReference);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const updated = await reviewAdminManualClaim(token, claimReference, {
        decision,
        bankStatementReference: bankStmtInputs[claimReference] || undefined,
        verificationNotes: reviewNoteInputs[claimReference] || undefined,
      });
      setStatusMsg(
        decision === "VERIFIED"
          ? `Claim ${claimReference} verified. Official receipt ${updated.receiptNumber || ""} generated and queued for email delivery.`
          : `Claim ${claimReference} updated to ${updated.status}.`
      );
      await loadTabData();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to review SBI claim.");
    } finally {
      setReviewingClaimRef(null);
    }
  };

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadTabData();
    }, 0);
    return () => window.clearTimeout(id);
  }, [loadTabData]);

  const handleExportCsv = async () => {
    if (!token) return;
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      await exportAdminDonationsCsv(token);
      setStatusMsg("Verified donation ledger CSV exported successfully.");
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Only Finance Officer, Trustee, or Super Admin roles can export financial ledgers."
      );
    }
  };

  const handleDownloadReceipt = async (receiptNumber: string) => {
    if (!token) return;
    setErrorMsg(null);
    try {
      await downloadAdminReceiptPdf(token, receiptNumber);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to download PDF receipt.");
    }
  };

  const handleOpenReconciliation = async (donationReference: string) => {
    if (!token) return;
    setErrorMsg(null);
    try {
      const logs = await fetchDonationReconciliationLogs(token, donationReference);
      setReconciliationRef(donationReference);
      setReconciliationLogs(logs || []);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to load reconciliation audit trail.");
    }
  };

  const handleRetryOutbox = async (id: number) => {
    if (!token) return;
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      await retryAdminOutbox(token, id);
      setStatusMsg(`Outbox item #${id} re-dispatched.`);
      await loadTabData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Retry failed.");
    }
  };

  const handleToggleProgramme = async (id: number) => {
    if (!token) return;
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const updated = await toggleAdminProgramme(token, id);
      setStatusMsg(`Programme "${updated.name}" is now ${updated.active ? "ACTIVE" : "PAUSED"}.`);
      await loadTabData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to toggle programme state.");
    }
  };

  const canExportCsv = user?.role
    ? [
        "SUPER_ADMIN",
        "ROLE_SUPER_ADMIN",
        "TRUSTEE",
        "ROLE_TRUSTEE",
        "FINANCE_OFFICER",
        "ROLE_FINANCE_OFFICER",
      ].includes(user.role.toUpperCase())
    : false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest">
            Supporters, Donations, Outbox &amp; Campaigns
          </h1>
          <p className="text-xs text-ink-sand mt-1">
            Unified donor verification, immutable reconciliation logs, transactional email/WhatsApp outbox, and approved MECT fundraising programmes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={loadTabData} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </Button>
          {activeTab === "DONATIONS" && (
            <Button
              type="button"
              size="sm"
              onClick={handleExportCsv}
              disabled={!canExportCsv}
              title={
                canExportCsv
                  ? "Export verified donation ledger CSV"
                  : "Restricted to Super Admin, Trustee, or Finance Officer"
              }
              className="bg-forest text-white hover:bg-forest-deep"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Tab Strip */}
      <div className="flex flex-wrap gap-2 border-b border-border-warm pb-3">
        {[
          { id: "DONORS" as const, label: "Donors & Supporters", icon: Users },
          { id: "DONATIONS" as const, label: "Donations & Reconciliation", icon: IndianRupee },
          { id: "SBI_QUEUE" as const, label: "SBI UTR Verification Queue", icon: Landmark },
          { id: "OUTBOX" as const, label: "Notification Outbox", icon: MailCheck },
          { id: "PROGRAMMES" as const, label: "Programmes & Campaigns", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xs border transition-colors ${
                active
                  ? "bg-forest text-white border-forest shadow-xs"
                  : "bg-white text-forest border-border-warm hover:bg-sage/40"
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {statusMsg && (
        <div
          role="status"
          className="p-3 rounded-xs bg-sage/50 border border-forest/30 flex items-center gap-2 text-xs font-semibold text-forest"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="p-3 rounded-xs bg-terracotta/10 border border-terracotta/40 flex items-center gap-2 text-xs font-semibold text-terracotta-dark"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: DONORS & SUPPORTERS */}
      {activeTab === "DONORS" && (
        <Card padding="lg" className="bg-white border-border-warm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="w-3.5 h-3.5 text-ink-sand absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                value={donorSearch}
                onChange={(e) => setDonorSearch(e.target.value)}
                placeholder="Search name, email, phone..."
                className="w-full h-9 pl-8 pr-3 text-xs bg-cream border border-border-warm rounded-xs text-ink"
              />
            </div>
            <select
              value={donorRoleFilter}
              onChange={(e) => setDonorRoleFilter(e.target.value)}
              className="h-9 px-3 text-xs bg-cream border border-border-warm rounded-xs text-ink"
            >
              <option value="ALL">All Portal Accounts</option>
              <option value="ROLE_DONOR">Donors Only (ROLE_DONOR)</option>
              <option value="ROLE_GENERAL_USER">General Supporters Only</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-warm text-[11px] uppercase tracking-wider text-ink-sand">
                  <th className="py-2 pr-4">Supporter</th>
                  <th className="py-2 pr-4">Verified Contact</th>
                  <th className="py-2 pr-4">Roles</th>
                  <th className="py-2 pr-4">WhatsApp Consent</th>
                  <th className="py-2 pr-4">Donations</th>
                  <th className="py-2">Total Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm">
                {donors.map((d) => (
                  <tr key={d.userUuid} className="hover:bg-cream/60">
                    <td className="py-3 pr-4">
                      <div className="font-bold text-forest">{d.fullName || "Unnamed User"}</div>
                      <div className="text-[11px] text-ink-sand">
                        {[d.city, d.state].filter(Boolean).join(", ") || "Profile pending"}
                        {d.deletionRequested && " • DELETION REQUESTED"}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-ink">
                      <div>{d.primaryEmail || "—"}</div>
                      <div className="text-[11px] text-ink-sand">{d.primaryPhone || "—"}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {d.roles.map((r) => (
                          <Badge key={r} variant={r === "ROLE_DONOR" ? "terracotta" : "forest"} size="sm">
                            {r.replace("ROLE_", "")}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={d.whatsappConsentStatus === "OPTED_IN" ? "forest" : "outline"} size="sm">
                        {d.whatsappConsentStatus}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-forest">{d.successfulDonationsCount}</td>
                    <td className="py-3 font-bold text-forest">
                      {formatInr(Number(d.totalDonatedAmount || 0))}
                    </td>
                  </tr>
                ))}
                {donors.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-ink-sand">
                      No supporter accounts match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 2: DONATIONS & RECONCILIATION */}
      {activeTab === "DONATIONS" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card padding="md" className="bg-white border-border-warm">
              <div className="text-[11px] uppercase text-ink-sand font-bold">Total Verified</div>
              <div className="text-lg font-serif font-bold text-forest mt-1">
                {formatInr(Number(donationSummary.totalSuccessfulAmount || 0))}
              </div>
            </Card>
            <Card padding="md" className="bg-white border-border-warm">
              <div className="text-[11px] uppercase text-ink-sand font-bold">Settled (Success)</div>
              <div className="text-lg font-serif font-bold text-terracotta-dark mt-1">
                {donationSummary.successfulCount}
              </div>
            </Card>
            <Card padding="md" className="bg-white border-border-warm">
              <div className="text-[11px] uppercase text-ink-sand font-bold">Pending</div>
              <div className="text-lg font-serif font-bold text-forest mt-1">
                {donationSummary.pendingCount}
              </div>
            </Card>
            <Card padding="md" className="bg-white border-border-warm">
              <div className="text-[11px] uppercase text-ink-sand font-bold">Failed / Dropped / Expired</div>
              <div className="text-lg font-serif font-bold text-ink-sand mt-1">
                {donationSummary.failedCount + (donationSummary.userDroppedCount || 0) + donationSummary.expiredCount}
              </div>
            </Card>
          </div>

          <Card padding="lg" className="bg-white border-border-warm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-forest uppercase tracking-wider">
                Payment Verification Ledger
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-ink-sand absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="text"
                    value={donationSearch}
                    onChange={(e) => setDonationSearch(e.target.value)}
                    placeholder="Search ref, order ID, donor..."
                    className="w-full h-9 pl-8 pr-3 text-xs bg-cream border border-border-warm rounded-xs text-ink"
                  />
                </div>
                <select
                  value={donationProviderFilter}
                  onChange={(e) => setDonationProviderFilter(e.target.value)}
                  className="h-9 px-3 text-xs bg-cream border border-border-warm rounded-xs text-ink"
                >
                  <option value="ALL">All Gateways</option>
                  <option value="CASHFREE">CASHFREE</option>
                  <option value="RAZORPAY">RAZORPAY</option>
                </select>
                <select
                  value={donationStatusFilter}
                  onChange={(e) => setDonationStatusFilter(e.target.value)}
                  className="h-9 px-3 text-xs bg-cream border border-border-warm rounded-xs text-ink"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SUCCESSFUL">SUCCESSFUL</option>
                  <option value="PENDING">PENDING</option>
                  <option value="USER_DROPPED">USER_DROPPED</option>
                  <option value="FAILED">FAILED</option>
                  <option value="EXPIRED">EXPIRED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border-warm text-[11px] uppercase tracking-wider text-ink-sand">
                    <th className="py-2 pr-4">Reference &amp; Gateway</th>
                    <th className="py-2 pr-4">Donor</th>
                    <th className="py-2 pr-4">Programme</th>
                    <th className="py-2 pr-4">Amount</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-warm">
                  {donations.map((row) => (
                    <tr key={row.donationReference} className="hover:bg-cream/60">
                      <td className="py-3 pr-4">
                        <div className="font-mono font-bold text-forest">{row.donationReference}</div>
                        <div className="text-[11px] text-ink-sand">
                          {new Date(row.createdAt).toLocaleString("en-IN")}
                          {row.provider ? ` • ${row.provider}` : ""}
                          {row.paymentGroup ? ` (${row.paymentGroup})` : ""}
                        </div>
                        {(row.providerPaymentId || row.cfOrderId) && (
                          <div className="text-[10px] font-mono text-ink-sand">
                            {row.providerPaymentId ? `PayID: ${row.providerPaymentId}` : ""}
                            {row.cfOrderId ? `${row.providerPaymentId ? " • " : ""}CF: ${row.cfOrderId}` : ""}
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-medium text-ink">{row.donorName}</div>
                        <div className="text-[11px] text-ink-sand">
                          {row.donorEmail || row.donorPhone || "—"}
                        </div>
                      </td>
                      <td className="py-3 pr-4">{row.programmeName}</td>
                      <td className="py-3 pr-4 font-bold text-forest">{formatInr(Number(row.amount))}</td>
                      <td className="py-3 pr-4">
                        <Badge
                          variant={
                            row.status === "SUCCESSFUL" || row.status === "SUCCESS"
                              ? "forest"
                              : row.status === "PENDING"
                                ? "warning"
                                : "terracotta"
                          }
                          size="sm"
                        >
                          {row.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right space-x-2 whitespace-nowrap">
                        {row.provider === "CASHFREE" && row.status !== "SUCCESSFUL" && row.status !== "REFUNDED" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              if (!token) return;
                              setErrorMsg(null);
                              try {
                                const res = await reconcileAdminDonation(token, row.donationReference);
                                setStatusMsg(`Reconciled ${row.donationReference}: ${res.status}`);
                                await loadTabData();
                              } catch (err: unknown) {
                                setErrorMsg(err instanceof Error ? err.message : "Reconciliation failed.");
                              }
                            }}
                          >
                            <RefreshCw className="w-3.5 h-3.5 mr-1 text-forest" aria-hidden="true" />
                            Verify
                          </Button>
                        )}
                        {row.receiptNumber && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadReceipt(row.receiptNumber!)}
                          >
                            <FileDown className="w-3.5 h-3.5 mr-1 text-terracotta" aria-hidden="true" />
                            PDF
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenReconciliation(row.donationReference)}
                        >
                          <History className="w-3.5 h-3.5 mr-1 text-forest" aria-hidden="true" />
                          Audit
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {donations.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-ink-sand">
                        No donations recorded under this filter yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {reconciliationRef && (
            <Card padding="lg" className="bg-sand-light/60 border-forest/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-serif font-bold text-forest">
                  Reconciliation Trail: <span className="font-mono">{reconciliationRef}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setReconciliationRef(null)}
                  className="p-1 text-ink-sand hover:text-forest"
                  aria-label="Close reconciliation panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {reconciliationLogs.map((log) => (
                  <div key={log.id} className="p-2.5 bg-white border border-border-warm rounded-xs flex flex-wrap justify-between gap-2">
                    <div>
                      <span className="font-bold text-forest">
                        {log.previousStatus} &rarr; {log.newStatus}
                      </span>{" "}
                      <span className="text-ink-sand">
                        via {log.source} ({log.actor})
                      </span>
                      <p className="text-ink mt-0.5">{log.note}</p>
                    </div>
                    <span className="text-[11px] text-ink-sand">
                      {new Date(log.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 3: OUTBOX */}
      {activeTab === "OUTBOX" && (
        <Card padding="lg" className="bg-white border-border-warm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-warm text-[11px] uppercase tracking-wider text-ink-sand">
                  <th className="py-2 pr-4">Channel &amp; Event</th>
                  <th className="py-2 pr-4">Recipient &amp; Sender</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Retries &amp; Error</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm">
                {outboxItems.map((item) => (
                  <tr key={item.id} className="hover:bg-cream/60">
                    <td className="py-3 pr-4">
                      <div className="font-bold text-forest">{item.channel} • {item.eventType}</div>
                      <div className="text-[11px] text-ink-sand">{item.subject || item.templateCode}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <div>{item.recipient}</div>
                      <div className="text-[11px] text-ink-sand">From: {item.senderIdentity}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={item.status === "SENT" ? "forest" : item.status === "FAILED" ? "terracotta" : "warning"} size="sm">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-[11px] text-ink-sand max-w-xs truncate">
                      Tries: {item.retryCount} {item.lastError ? `• ${item.lastError}` : ""}
                    </td>
                    <td className="py-3 text-right">
                      {item.status !== "SENT" && (
                        <Button type="button" size="sm" variant="outline" onClick={() => handleRetryOutbox(item.id)}>
                          Retry Dispatch
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {outboxItems.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink-sand">
                      Notification outbox is currently empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB: SBI UTR VERIFICATION QUEUE */}
      {activeTab === "SBI_QUEUE" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-border-warm rounded-xs p-3">
            <div className="text-xs text-ink-sand">
              Reconcile donor-submitted SBI UTRs against bank statement credits before issuing official receipts.
            </div>
            <select
              value={claimStatusFilter}
              onChange={(e) => setClaimStatusFilter(e.target.value)}
              className="h-9 px-3 text-xs bg-cream border border-border-warm rounded-xs text-ink"
            >
              <option value="ALL">All Claim States</option>
              <option value="UTR_SUBMITTED">UTR Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {manualClaims.length === 0 ? (
            <Card padding="lg" className="bg-white border-border-warm text-center text-xs text-ink-sand py-10">
              No manual SBI transfer claims match the selected filter.
            </Card>
          ) : (
            <div className="space-y-3">
              {manualClaims.map((claim) => (
                <Card key={claim.claimReference} padding="md" className="bg-white border-border-warm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-warm pb-2.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-forest">{claim.claimReference}</span>
                        <Badge variant={claim.status === "VERIFIED" ? "forest" : claim.status === "REJECTED" ? "outline" : "gold"} size="sm">
                          {claim.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-ink-sand">
                        Donation <span className="font-mono font-semibold text-forest">{claim.donationReference}</span> · {claim.programmeName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-lg text-forest">{formatInr(Number(claim.claimedAmount))}</div>
                      <div className="text-[11px] text-ink-sand">Transfer Date: {claim.transferDate}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-ink-sand block">Donor:</span>
                      <strong className="text-forest">{claim.donorName}</strong> ({claim.donorEmail || claim.donorPhone || "N/A"})
                    </div>
                    <div>
                      <span className="text-ink-sand block">Normalized UTR:</span>
                      <span className="font-mono font-bold text-terracotta-dark">{claim.utrNormalized}</span>
                    </div>
                    <div>
                      <span className="text-ink-sand block">Mode / Proof Note:</span>
                      <span>{claim.paymentModeNote || "SBI Transfer"} {claim.proofSummary ? `· ${claim.proofSummary}` : ""}</span>
                    </div>
                  </div>

                  {claim.status !== "VERIFIED" && canVerifyClaims && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-2 border-t border-border-warm items-center">
                      <input
                        type="text"
                        placeholder="Bank Statement Ref (e.g. SBI-STMT-..."
                        value={bankStmtInputs[claim.claimReference] ?? claim.bankStatementReference ?? ""}
                        onChange={(e) => setBankStmtInputs({ ...bankStmtInputs, [claim.claimReference]: e.target.value })}
                        className="md:col-span-4 h-9 px-2.5 text-xs bg-cream border border-border-warm rounded-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Verification Notes"
                        value={reviewNoteInputs[claim.claimReference] ?? claim.verificationNotes ?? ""}
                        onChange={(e) => setReviewNoteInputs({ ...reviewNoteInputs, [claim.claimReference]: e.target.value })}
                        className="md:col-span-4 h-9 px-2.5 text-xs bg-cream border border-border-warm rounded-xs"
                      />
                      <div className="md:col-span-4 flex flex-wrap justify-end gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={reviewingClaimRef === claim.claimReference}
                          onClick={() => handleReviewClaim(claim.claimReference, "UNDER_REVIEW")}
                          className="text-[11px]"
                        >
                          Under Review
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={reviewingClaimRef === claim.claimReference}
                          onClick={() => handleReviewClaim(claim.claimReference, "REJECTED")}
                          className="text-[11px] text-red-700 border-red-200"
                        >
                          Reject
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          disabled={reviewingClaimRef === claim.claimReference}
                          onClick={() => handleReviewClaim(claim.claimReference, "VERIFIED")}
                          className="text-[11px]"
                        >
                          Verify &amp; Issue Receipt
                        </Button>
                      </div>
                    </div>
                  )}

                  {claim.receiptNumber && (
                    <div className="text-xs text-emerald-800 font-mono font-semibold">
                      Verified by {claim.reviewedBy} · Issued Receipt: {claim.receiptNumber}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PROGRAMMES */}
      {activeTab === "PROGRAMMES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programmes.map((p) => (
            <Card key={p.id} padding="md" className="bg-white border-border-warm flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-terracotta-dark font-bold">{p.code}</span>
                  <Badge variant={p.active ? "forest" : "outline"} size="sm">
                    {p.active ? "Active on Checkout" : "Paused"}
                  </Badge>
                </div>
                <h3 className="text-base font-serif font-bold text-forest">{p.name}</h3>
                <p className="text-xs text-ink-sand">{p.tagline}</p>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleProgramme(p.id)}
                >
                  {p.active ? "Pause Programme" : "Activate Programme"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
