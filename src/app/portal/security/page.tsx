"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { PortalNav } from "@/components/portal/PortalNav";
import {
  requestPortalDeletion,
  requestPortalOtp,
  updatePortalPreferences,
  verifyPortalContactChange,
} from "@/lib/portal-api";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Phone,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
} from "lucide-react";

export default function PortalSecurityPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, token, dashboard, refreshDashboard, logout } = usePortalAuth();

  const [savingPrefs, setSavingPrefs] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Contact Change States
  const [showContactChange, setShowContactChange] = useState(false);
  const [changeChannel, setChangeChannel] = useState<"EMAIL" | "PHONE">("EMAIL");
  const [changeTarget, setChangeTarget] = useState("");
  const [changeOtp, setChangeOtp] = useState("");
  const [changeStep, setChangeStep] = useState<"IDLE" | "OTP_SENT">("IDLE");
  const [requestingContactOtp, setRequestingContactOtp] = useState(false);
  const [verifyingContactOtp, setVerifyingContactOtp] = useState(false);

  // Deletion Request States
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [submittingDelete, setSubmittingDelete] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?next=/portal/security");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !dashboard || !token) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-16">
        <Container className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto mb-3" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink-muted">
            Loading Security Settings...
          </p>
        </Container>
      </div>
    );
  }

  const { account } = dashboard;
  const prefs = account.preferences;

  const handleToggleWhatsApp = async (enabled: boolean) => {
    setSavingPrefs(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      await updatePortalPreferences(token, {
        emailReceiptsEnabled: prefs?.emailReceiptsEnabled ?? true,
        emailUpdatesEnabled: prefs?.emailUpdatesEnabled ?? false,
        whatsappOptIn: enabled,
        whatsappPhoneNumber: account.primaryPhone || undefined,
        consentVersion: "v2026.1",
      });
      await refreshDashboard();
      setStatusMsg(enabled ? "WhatsApp receipt alerts enabled." : "WhatsApp receipt alerts disabled.");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update notification preferences.");
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleRequestContactChangeOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeTarget.trim()) return;
    setRequestingContactOtp(true);
    setErrorMsg(null);
    try {
      await requestPortalOtp(
        {
          channel: changeChannel,
          target: changeTarget.trim(),
          purpose: "CONTACT_CHANGE",
        },
        token
      );
      setChangeStep("OTP_SENT");
      setStatusMsg(`Verification code sent to ${changeTarget.trim()}.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to send verification code.");
    } finally {
      setRequestingContactOtp(false);
    }
  };

  const handleVerifyContactChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeOtp.trim()) return;
    setVerifyingContactOtp(true);
    setErrorMsg(null);
    try {
      await verifyPortalContactChange(token, {
        channel: changeChannel,
        target: changeTarget.trim(),
        otpCode: changeOtp.trim(),
        purpose: "CONTACT_CHANGE",
      });
      setChangeTarget("");
      setChangeOtp("");
      setChangeStep("IDLE");
      setShowContactChange(false);
      await refreshDashboard();
      setStatusMsg("New verified contact attached successfully.");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Invalid or expired verification code.");
    } finally {
      setVerifyingContactOtp(false);
    }
  };

  const handleDeleteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionReason.trim()) return;
    setSubmittingDelete(true);
    setErrorMsg(null);
    try {
      const res = await requestPortalDeletion(token, deletionReason.trim());
      await refreshDashboard();
      setStatusMsg(res.message);
      setDeletionReason("");
      setShowDeletePanel(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not submit deletion request.");
    } finally {
      setSubmittingDelete(false);
    }
  };

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
                Security &amp; Account Settings
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted">
                Manage verified authentication contacts, communication preferences, and data privacy controls.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-xs text-red-800 border-red-300 hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              <span>Sign Out</span>
            </Button>
          </div>

        {statusMsg && (
          <div className="p-3.5 rounded-xs bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{statusMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div role="alert" className="p-3.5 rounded-xs bg-red-50 border border-red-200 text-xs text-red-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* 1. Account Identity & Verified Credentials */}
        <Card padding="lg" className="bg-white border-[#E6E1D8] shadow-xs space-y-4">
          <div className="border-b border-[#E6E1D8] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-forest" />
              <h2 className="font-serif font-bold text-forest text-base">
                1. Account Credentials &amp; Verification Status
              </h2>
            </div>
            <Badge variant={account.isDonor ? "forest" : "gold"} size="sm">
              {account.isDonor ? "Verified Donor" : "Supporter Account"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-forest" />
                <span>Primary Verified Mobile</span>
              </span>
              <p className="font-mono font-bold text-forest text-sm">
                {account.primaryPhone || "Not linked"}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium">✓ Cryptographically Verified</span>
            </div>

            <div className="p-3.5 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-forest" />
                <span>Primary Verified Email</span>
              </span>
              <p className="font-bold text-forest text-sm truncate">
                {account.primaryEmail || "Not linked"}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium">✓ Receipt Delivery Channel</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-ink-muted">
              Need to update your mobile number or email?
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowContactChange(!showContactChange)}
              className="text-xs"
            >
              {showContactChange ? "Cancel" : "Add / Update Contact"}
            </Button>
          </div>

          {/* Contact Verification Form Drawer */}
          {showContactChange && (
            <div className="p-4 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8] space-y-3.5 mt-3">
              <h3 className="font-serif font-bold text-forest text-sm">
                Verify New Contact Method via OTP
              </h3>

              {changeStep === "IDLE" ? (
                <form onSubmit={handleRequestContactChangeOtp} className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setChangeChannel("EMAIL")}
                      className={`px-3 py-1.5 rounded-xs text-xs font-bold border ${
                        changeChannel === "EMAIL"
                          ? "bg-forest text-white border-forest"
                          : "bg-white text-forest border-[#D4CEBE]"
                      }`}
                    >
                      Email Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setChangeChannel("PHONE")}
                      className={`px-3 py-1.5 rounded-xs text-xs font-bold border ${
                        changeChannel === "PHONE"
                          ? "bg-forest text-white border-forest"
                          : "bg-white text-forest border-[#D4CEBE]"
                      }`}
                    >
                      Mobile Phone
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-forest mb-1">
                      {changeChannel === "EMAIL" ? "New Email Address" : "New Mobile Number (+91...)"}
                    </label>
                    <Input
                      value={changeTarget}
                      onChange={(e) => setChangeTarget(e.target.value)}
                      placeholder={changeChannel === "EMAIL" ? "new.email@example.org" : "+919853608113"}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={requestingContactOtp || !changeTarget.trim()}
                  >
                    {requestingContactOtp ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      <span>Send Verification Code</span>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyContactChange} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-forest mb-1">
                      Enter 6-Digit Code sent to {changeTarget}
                    </label>
                    <Input
                      maxLength={6}
                      value={changeOtp}
                      onChange={(e) => setChangeOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="• • • • • •"
                      className="font-mono text-center tracking-widest text-lg font-bold"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={verifyingContactOtp || changeOtp.length !== 6}
                    >
                      {verifyingContactOtp ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Confirm &amp; Attach Contact</span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setChangeStep("IDLE")}
                    >
                      Back
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </Card>

        {/* 2. Communication & Alert Preferences */}
        <Card padding="lg" className="bg-white border-[#E6E1D8] shadow-xs space-y-4">
          <div className="border-b border-[#E6E1D8] pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-forest" />
            <h2 className="font-serif font-bold text-forest text-base">
              2. Transactional Receipts &amp; Alerts
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between gap-4 p-3 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8]">
              <div>
                <strong className="text-forest block">WhatsApp Instant Receipt Delivery</strong>
                <p className="text-ink-muted mt-0.5">
                  Receive verified PDF receipt confirmations directly to your verified phone on WhatsApp upon successful payment.
                </p>
              </div>
              <Button
                type="button"
                variant={prefs?.whatsappOptIn ? "primary" : "outline"}
                size="sm"
                disabled={savingPrefs}
                onClick={() => handleToggleWhatsApp(!prefs?.whatsappOptIn)}
                className="shrink-0 text-xs"
              >
                {prefs?.whatsappOptIn ? "Opted In ✓" : "Enable"}
              </Button>
            </div>

            <div className="flex items-start justify-between gap-4 p-3 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8]">
              <div>
                <strong className="text-forest block">Email Transactional Outbox</strong>
                <p className="text-ink-muted mt-0.5">
                  Automated computer-signed receipts and statutory Form 113/114 status dispatches.
                </p>
              </div>
              <span className="text-emerald-700 font-bold text-xs shrink-0 pt-1">
                Mandatory Active ✓
              </span>
            </div>
          </div>
        </Card>

        {/* 3. Data Privacy & Account Deletion */}
        <Card padding="lg" className="bg-white border-[#E6E1D8] shadow-xs space-y-4">
          <div className="border-b border-[#E6E1D8] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-700" />
              <h2 className="font-serif font-bold text-forest text-base">
                3. Data Privacy &amp; Account Deletion
              </h2>
            </div>
            {account.deletionRequested && (
              <Badge variant="outline" size="sm" className="border-red-300 text-red-800 bg-red-50">
                Deletion Queued
              </Badge>
            )}
          </div>

          <p className="text-xs text-ink-muted leading-relaxed">
            In compliance with applicable personal data protection laws, you may request the deletion of your online portal account. Note that under the Income-tax Act and Indian Trusts Act, historical accounting records and settled contribution receipts must be preserved by MECT for statutory audit periods.
          </p>

          {!account.deletionRequested ? (
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDeletePanel(!showDeletePanel)}
                className="text-xs text-red-800 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                <span>Request Account Deletion</span>
              </Button>

              {showDeletePanel && (
                <form onSubmit={handleDeleteRequest} className="mt-3 p-4 rounded-xs bg-red-50/60 border border-red-200 space-y-3">
                  <label htmlFor="del-reason" className="block text-xs font-bold text-red-950">
                    Reason for Deletion Request
                  </label>
                  <Input
                    id="del-reason"
                    value={deletionReason}
                    onChange={(e) => setDeletionReason(e.target.value)}
                    placeholder="Please let us know why you wish to delete your portal profile..."
                    required
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={submittingDelete || !deletionReason.trim()}
                      className="bg-red-700 hover:bg-red-800 text-xs"
                    >
                      {submittingDelete ? "Submitting..." : "Confirm Deletion Request"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeletePanel(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xs bg-red-50 border border-red-200 text-xs text-red-900">
              Your deletion request has been recorded and queued for secretariat review.
            </div>
          )}
        </Card>

      </Container>
    </div>
    </>
  );
}
