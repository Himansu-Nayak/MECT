"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  DonationProgrammeItem,
  DonationStatusResponse,
  GatewayStatusResponse,
  InitiatedDonationResponse,
  fetchDonationProgrammes,
  fetchDonationStatus,
  fetchGatewayStatus,
  initiateDonation,
} from "@/lib/portal-api";
import {
  QrCode,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Landmark,
  ArrowDown,
  RefreshCw,
  UserCheck,
  Sparkles,
} from "lucide-react";

const PRESET_AMOUNTS = [500, 1500, 3000, 5000, 10000];

export function SmartDonationCheckout() {
  const [programmes, setProgrammes] = useState<DonationProgrammeItem[]>([]);
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatusResponse | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [selectedCode, setSelectedCode] = useState("EDUCATION_LEARNING");
  const [amount, setAmount] = useState<number>(3000);
  const [customAmountStr, setCustomAmountStr] = useState<string>("3000");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [donorPan, setDonorPan] = useState("");
  const [dedication, setDedication] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const [isInitiating, setIsInitiating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initiatedPayment, setInitiatedPayment] = useState<InitiatedDonationResponse | null>(null);
  const [liveStatus, setLiveStatus] = useState<DonationStatusResponse | null>(null);

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const [progs, gw] = await Promise.all([
          fetchDonationProgrammes(),
          fetchGatewayStatus(),
        ]);
        if (!active) return;
        setProgrammes(progs);
        if (progs.length > 0) setSelectedCode(progs[0].code);
        setGatewayStatus(gw);
      } catch {
        // Fallback programmes rendered if backend offline
      } finally {
        if (active) setLoadingConfig(false);
      }
    }
    init();
    return () => { active = false; };
  }, []);

  // Safe background status polling while payment is PENDING
  useEffect(() => {
    if (!initiatedPayment) return;
    if (liveStatus && ["SUCCESSFUL", "FAILED", "EXPIRED", "REFUNDED"].includes(liveStatus.status)) {
      return;
    }

    const timer = setInterval(async () => {
      try {
        const st = await fetchDonationStatus(initiatedPayment.donationReference);
        setLiveStatus(st);
      } catch {
        // Silent retry
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [initiatedPayment, liveStatus]);

  const handleAmountPick = (val: number) => {
    setAmount(val);
    setCustomAmountStr(String(val));
  };

  const handleManualStatusRefresh = async () => {
    if (!initiatedPayment) return;
    try {
      const st = await fetchDonationStatus(initiatedPayment.donationReference);
      setLiveStatus(st);
    } catch {
      // ignore
    }
  };

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsedAmount = Number(customAmountStr);
    if (!parsedAmount || parsedAmount < 10) {
      setErrorMsg("Please enter a voluntary contribution of at least ₹10.");
      return;
    }
    if (!donorName.trim()) {
      setErrorMsg("Please provide your full name for accounting records.");
      return;
    }

    setIsInitiating(true);
    try {
      // Attach portal token seamlessly if user is signed in
      const refresh = typeof window !== "undefined" ? localStorage.getItem("mt_portal_refresh_token") : null;
      let portalToken: string | null = null;
      if (refresh) {
        try {
          const { refreshPortalToken } = await import("@/lib/portal-api");
          const auth = await refreshPortalToken(refresh);
          portalToken = auth.accessToken;
          localStorage.setItem("mt_portal_refresh_token", auth.refreshToken);
        } catch {
          portalToken = null;
        }
      }

      const res = await initiateDonation(
        {
          programmeCode: selectedCode,
          amount: parsedAmount,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim() || undefined,
          donorPhone: donorPhone.trim() || undefined,
          donorAddress: donorAddress.trim() || undefined,
          donorPan: donorPan.trim() ? donorPan.trim().toUpperCase() : undefined,
          dedicationMessage: dedication.trim() || undefined,
          anonymous,
          paymentMethod: "UPI_QR",
        },
        portalToken
      );

      setInitiatedPayment(res);
      setLiveStatus(null);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to initiate online dynamic QR donation.");
    } finally {
      setIsInitiating(false);
    }
  };

  const currentStatus = liveStatus?.status || initiatedPayment?.status || "PENDING";

  return (
    <Card variant="elevated" className="border-2 border-sand/60 overflow-hidden bg-white">
      <div className="bg-forest text-white p-6 sm:p-8 border-b-2 border-terracotta flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-sand">
            <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Smart One-Time Donation &amp; Dynamic UPI QR</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Contribute Directly to an Approved Programme
          </h2>
          <p className="text-xs sm:text-sm text-cream/90 max-w-2xl">
            Voluntary one-time support verified server-side. Sign in to the Donor Portal to automatically link receipts to your account.
          </p>
        </div>

        <Link href="/portal/login?next=/donate" className="shrink-0">
          <Button variant="gold" size="sm" className="font-bold">
            <UserCheck className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
            <span>Donor Sign-In (OTP)</span>
          </Button>
        </Link>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Honest Gateway Status Notice */}
        {!loadingConfig && gatewayStatus && !gatewayStatus.configured && !gatewayStatus.sandboxMode && (
          <div className="p-4 rounded-xs bg-sand-light border border-terracotta/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
            <div className="flex items-start gap-2.5 text-ink">
              <AlertCircle className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" />
              <div>
                <strong className="text-forest block">Dynamic Payment Gateway Pending Activation</strong>
                <span className="text-ink-sand">{gatewayStatus.reason}</span>
              </div>
            </div>
            <Link href="#bank-details" className="shrink-0">
              <Button variant="secondary" size="sm">
                <Landmark className="w-3.5 h-3.5 mr-1.5" />
                <span>Use SBI QR / Bank Transfer</span>
                <ArrowDown className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        )}

        {initiatedPayment ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Dynamic QR Display Card */}
            <div className="lg:col-span-5 bg-sand-light border-2 border-sand rounded-xs p-6 text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-forest text-cream text-[11px] font-bold uppercase tracking-wider">
                {currentStatus === "SUCCESSFUL" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sand" />
                    <span>Payment Verified &amp; Confirmed</span>
                  </>
                ) : currentStatus === "EXPIRED" || currentStatus === "FAILED" ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-sand" />
                    <span>Status: {currentStatus}</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-sand animate-pulse" />
                    <span>Awaiting Verified Settlement ({currentStatus})</span>
                  </>
                )}
              </div>

              {currentStatus === "PENDING" || currentStatus === "CREATED" ? (
                <div className="mx-auto w-56 h-56 bg-white p-3 rounded-xs border border-border-warm flex items-center justify-center shadow-sm">
                  {initiatedPayment.qrImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={initiatedPayment.qrImageUrl}
                      alt="Transaction-specific Dynamic UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : initiatedPayment.qrSvg ? (
                    <div
                      className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: initiatedPayment.qrSvg }}
                    />
                  ) : (
                    <span className="text-xs text-ink-sand">QR unavailable</span>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-white rounded-xs border border-border-warm space-y-2">
                  <Sparkles className="w-8 h-8 text-terracotta mx-auto" />
                  <p className="font-serif font-bold text-lg text-forest">
                    {currentStatus === "SUCCESSFUL"
                      ? "Thank You — Contribution Verified"
                      : `Transaction ${currentStatus}`}
                  </p>
                  {liveStatus?.receiptNumber && (
                    <p className="text-xs font-mono font-bold text-terracotta-dark">
                      Receipt: {liveStatus.receiptNumber}
                    </p>
                  )}
                </div>
              )}

              <div className="text-xs text-ink font-sans space-y-1">
                <div className="text-lg font-serif font-bold text-forest">
                  ₹{Number(initiatedPayment.amount).toLocaleString("en-IN")} INR
                </div>
                <div className="text-ink-sand">{initiatedPayment.programmeName}</div>
                <div className="font-mono text-[11px] text-terracotta-dark">
                  Ref: {initiatedPayment.donationReference}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={handleManualStatusRefresh}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Check Settlement Status</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setInitiatedPayment(null);
                    setLiveStatus(null);
                  }}
                >
                  Start New Contribution
                </Button>
              </div>
            </div>

            {/* Payment Transparency Instructions */}
            <div className="lg:col-span-7 space-y-4 font-sans">
              <h3 className="font-serif text-xl font-bold text-forest">
                How Dynamic QR Verification Works
              </h3>
              <ul className="space-y-2.5 text-sm text-ink">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-1" />
                  <span>
                    Scan the unique QR using BHIM, Google Pay, PhonePe, Paytm, or your bank&apos;s UPI app.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-terracotta shrink-0 mt-1" />
                  <span>
                    <strong>Strict Server Verification:</strong> Donations transition to Confirmed only upon authenticated webhook signature verification from our payment gateway — never from client clicks.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-terracotta shrink-0 mt-1" />
                  <span>
                    This dynamic QR is locked exclusively to order <code>{initiatedPayment.providerOrderId}</code> and expires automatically after 15 minutes if unpaid.
                  </span>
                </li>
              </ul>

              {liveStatus?.receiptAvailable && liveStatus.receiptNumber && (
                <div className="p-4 rounded-xs bg-forest text-white space-y-2">
                  <p className="text-xs font-semibold text-sand uppercase tracking-wider">
                    Official PDF Receipt Ready
                  </p>
                  <p className="text-xs text-cream">
                    Receipt <strong>{liveStatus.receiptNumber}</strong> has been emailed to your verified email (if provided) and is ready in your{" "}
                    <Link href="/portal/dashboard" className="underline text-sand font-semibold">
                      Donor Portal Dashboard
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleInitiate} className="space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-xs bg-red-50 border border-red-200 text-sm text-crimson flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Programme Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-forest block">
                1. Choose Verified MECT Programme
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(programmes.length > 0
                  ? programmes
                  : [
                      { id: 1, code: "EDUCATION_LEARNING", name: "Education & Learning (Shiksha Setu)", tagline: "Remedial coaching & college fees", description: "", generalFund: false, active: true, displayOrder: 1 },
                      { id: 2, code: "WOMEN_EMPOWERMENT", name: "Women Empowerment & Livelihoods (Swavalamban)", tagline: "Vocational tailoring toolkits", description: "", generalFund: false, active: true, displayOrder: 2 },
                      { id: 3, code: "SAFE_WATER_SANITATION", name: "Safe Water & Sanitation (Jal Seva)", tagline: "Clean drinking water access", description: "", generalFund: false, active: true, displayOrder: 3 },
                      { id: 4, code: "FOOD_SECURITY_RELIEF", name: "Food Security & Nutrition (Jan Ahar)", tagline: "Hygienic meals & relief", description: "", generalFund: false, active: true, displayOrder: 4 },
                      { id: 5, code: "COMMUNITY_WELFARE", name: "Community Welfare & Relief (Samaj Kalyan)", tagline: "Seasonal outreach & relief", description: "", generalFund: false, active: true, displayOrder: 5 },
                    ]
                ).map((prog) => {
                  const active = selectedCode === prog.code;
                  return (
                    <button
                      key={prog.code}
                      type="button"
                      onClick={() => setSelectedCode(prog.code)}
                      className={`p-3.5 text-left rounded-xs border transition-all ${
                        active
                          ? "bg-forest text-white border-sand shadow-sm"
                          : "bg-sand-light text-ink border-border-warm hover:border-terracotta/50"
                      }`}
                    >
                      <div className={`text-xs font-bold ${active ? "text-sand" : "text-terracotta-dark"}`}>
                        {prog.name}
                      </div>
                      <div className={`text-[11px] mt-0.5 ${active ? "text-cream/90" : "text-ink-sand"}`}>
                        {prog.tagline}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Selector (One-Time Only) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label htmlFor="smart-custom-amount" className="text-xs font-bold uppercase tracking-wider text-forest">
                  2. Contribution Amount (One-Time INR)
                </label>
                <span className="text-[11px] font-semibold text-ink-sand">
                  One-time voluntary contribution • No recurring mandate
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleAmountPick(val)}
                    className={`py-2.5 px-3 rounded-xs text-sm font-bold border transition-all ${
                      amount === val && Number(customAmountStr) === val
                        ? "bg-terracotta text-white border-terracotta-dark shadow-xs"
                        : "bg-cream text-forest border-border-warm hover:border-terracotta/50"
                    }`}
                  >
                    ₹{val.toLocaleString("en-IN")}
                  </button>
                ))}
                <Input
                  id="smart-custom-amount"
                  type="number"
                  min={10}
                  step={1}
                  value={customAmountStr}
                  onChange={(e) => {
                    setCustomAmountStr(e.target.value);
                    setAmount(Number(e.target.value) || 0);
                  }}
                  placeholder="Custom ₹"
                  className="font-bold text-center"
                />
              </div>
            </div>

            {/* Donor Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="smart-donor-name" className="text-xs font-bold text-forest block mb-1">
                  Full Name *
                </label>
                <Input
                  id="smart-donor-name"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Full name for internal ledger & receipt"
                />
              </div>
              <div>
                <label htmlFor="smart-donor-email" className="text-xs font-bold text-forest block mb-1">
                  Email Address (for PDF Receipt)
                </label>
                <Input
                  id="smart-donor-email"
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="smart-donor-phone" className="text-xs font-bold text-forest block mb-1">
                  Phone Number (Optional)
                </label>
                <Input
                  id="smart-donor-phone"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                />
              </div>
              <div>
                <label htmlFor="smart-donor-pan" className="text-xs font-bold text-forest block mb-1">
                  Optional PAN (Only if needed for tax record)
                </label>
                <Input
                  id="smart-donor-pan"
                  value={donorPan}
                  onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F (Optional)"
                  maxLength={10}
                  className="uppercase font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="smart-dedication" className="text-xs font-bold text-forest block mb-1">
                  Dedication or Purpose Note (Optional)
                </label>
                <Input
                  id="smart-dedication"
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder="Optional dedication or specific educational support note"
                  maxLength={300}
                />
              </div>
            </div>

            {/* Anonymous Donation Privacy Option */}
            <label className="flex items-start gap-3 p-3.5 rounded-xs bg-sand-light border border-border-warm cursor-pointer text-xs text-ink">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="mt-0.5 rounded border-terracotta text-terracotta focus:ring-terracotta"
              />
              <span>
                <strong className="text-forest block">Keep my donation anonymous on public receipts/displays</strong>
                Internal MECT accounting records still retain your verified details as required by Trust audit laws, while public receipts display &ldquo;Anonymous Donor&rdquo;.
              </span>
            </label>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border-warm">
              <span className="text-xs text-ink-sand">
                Or contribute directly via SBI UPI QR (<strong>86971610172@sbi</strong>) or NEFT/IMPS/RTGS to SBI Account <strong>33341302498</strong> below.
              </span>
              <Button type="submit" variant="primary" size="lg" disabled={isInitiating}>
                <QrCode className="w-4 h-4 mr-2" />
                <span>{isInitiating ? "Generating Dynamic QR..." : "Generate Dynamic UPI QR Payment"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}

