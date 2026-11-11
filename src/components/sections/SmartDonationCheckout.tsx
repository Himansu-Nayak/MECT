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
  verifyCashfreePayment,
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
  CreditCard,
  Loader2,
} from "lucide-react";

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: "_self" | "_blank" | "_modal";
      }) => Promise<{
        error?: { message?: string };
        redirect?: boolean;
        paymentDetails?: { paymentMessage?: string };
      }>;
    };
  }
}

const CASHFREE_SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";
let cashfreeScriptPromise: Promise<void> | null = null;

function ensureCashfreeSdkLoaded(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser required"));
  if (typeof window.Cashfree === "function") return Promise.resolve();
  if (cashfreeScriptPromise) return cashfreeScriptPromise;

  cashfreeScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CASHFREE_SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Cashfree SDK")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = CASHFREE_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      cashfreeScriptPromise = null;
      reject(new Error("Unable to load Cashfree Checkout SDK. Please check network/ad-blocker or use direct SBI bank transfer."));
    };
    document.head.appendChild(script);
  });
  return cashfreeScriptPromise;
}

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
  const [isLaunchingGateway, setIsLaunchingGateway] = useState(false);
  const [isVerifyingReturn, setIsVerifyingReturn] = useState(false);
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

    // If donor returned via Cashfree return_url (?order_id=...), verify strictly server-side
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const returnOrderId = params.get("order_id");
      if (returnOrderId && returnOrderId.trim()) {
        const orderIdToVerify = returnOrderId.trim();
        void (async () => {
          await Promise.resolve();
          if (!active) return;
          setIsVerifyingReturn(true);
          try {
            const st = await verifyCashfreePayment(orderIdToVerify);
            if (!active) return;
            setLiveStatus(st);
          } catch (err: unknown) {
            if (!active) return;
            setErrorMsg(err instanceof Error ? err.message : "Unable to verify returned payment status.");
          } finally {
            if (active) setIsVerifyingReturn(false);
          }
        })();
      }
    }

    return () => { active = false; };
  }, []);

  // Safe background status polling while payment is PENDING
  useEffect(() => {
    const refToPoll = initiatedPayment?.donationReference || liveStatus?.donationReference;
    if (!refToPoll) return;
    if (liveStatus && ["SUCCESSFUL", "FAILED", "USER_DROPPED", "EXPIRED", "REFUNDED"].includes(liveStatus.status)) {
      return;
    }

    const timer = setInterval(async () => {
      try {
        const st =
          initiatedPayment?.provider === "CASHFREE" || liveStatus?.provider === "CASHFREE"
            ? await verifyCashfreePayment(initiatedPayment?.providerOrderId || liveStatus?.orderId || refToPoll)
            : await fetchDonationStatus(refToPoll);
        setLiveStatus(st);
      } catch {
        // Silent retry
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [initiatedPayment, liveStatus]);

  const resetCheckoutState = () => {
    setInitiatedPayment(null);
    setLiveStatus(null);
    setErrorMsg(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("order_id")) {
        url.searchParams.delete("order_id");
        window.history.replaceState({}, "", url.pathname + url.search + url.hash);
      }
    }
  };

  const handleAmountPick = (val: number) => {
    setAmount(val);
    setCustomAmountStr(String(val));
  };

  const launchCashfreeModal = async (session: InitiatedDonationResponse) => {
    if (!session.paymentSessionId) return;
    setErrorMsg(null);
    setIsLaunchingGateway(true);
    try {
      await ensureCashfreeSdkLoaded();
      if (typeof window.Cashfree !== "function") {
        throw new Error("Cashfree Checkout SDK did not initialize.");
      }
      const mode = session.checkoutEnvironment === "production" ? "production" : "sandbox";
      const cashfree = window.Cashfree({ mode });
      const result = await cashfree.checkout({
        paymentSessionId: session.paymentSessionId,
        redirectTarget: "_modal",
      });
      if (result?.error?.message) {
        setErrorMsg(result.error.message);
      }
      // Regardless of modal close or redirect resolution, confirm status strictly from MECT backend
      const verified = await verifyCashfreePayment(session.providerOrderId || session.donationReference);
      setLiveStatus(verified);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to open Cashfree Checkout window.");
    } finally {
      setIsLaunchingGateway(false);
    }
  };

  const handleManualStatusRefresh = async () => {
    const ref = initiatedPayment?.donationReference || liveStatus?.donationReference;
    if (!ref) return;
    try {
      const st =
        initiatedPayment?.provider === "CASHFREE" || liveStatus?.provider === "CASHFREE"
          ? await verifyCashfreePayment(initiatedPayment?.providerOrderId || liveStatus?.orderId || ref)
          : await fetchDonationStatus(ref);
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

      const method = gatewayStatus?.provider === "CASHFREE" ? "GATEWAY_CHECKOUT" : "UPI_QR";
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
          paymentMethod: method,
        },
        portalToken
      );

      setInitiatedPayment(res);
      setLiveStatus(null);
      if (res.provider === "CASHFREE" && res.paymentSessionId) {
        await launchCashfreeModal(res);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to initiate online donation checkout.");
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
            {gatewayStatus?.provider === "CASHFREE" ? (
              <>
                <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Smart One-Time Donation &amp; Cashfree Secure Checkout</span>
              </>
            ) : (
              <>
                <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Smart One-Time Donation &amp; Dynamic UPI QR</span>
              </>
            )}
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
        {!loadingConfig &&
          gatewayStatus &&
          !gatewayStatus.configured &&
          (gatewayStatus.provider === "CASHFREE" || !gatewayStatus.sandboxMode) && (
          <div className="p-4 rounded-xs bg-sand-light border border-terracotta/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
            <div className="flex items-start gap-2.5 text-ink">
              <AlertCircle className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" />
              <div>
                <strong className="text-forest block">Online Payment Gateway Pending Activation</strong>
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

        {initiatedPayment || liveStatus || isVerifyingReturn ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Payment Status / Cashfree / Dynamic QR Display Card */}
            <div className="lg:col-span-5 bg-sand-light border-2 border-sand rounded-xs p-6 text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-forest text-cream text-[11px] font-bold uppercase tracking-wider">
                {currentStatus === "SUCCESSFUL" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sand" />
                    <span>Payment Verified &amp; Confirmed</span>
                  </>
                ) : currentStatus === "EXPIRED" || currentStatus === "FAILED" || currentStatus === "USER_DROPPED" ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-sand" />
                    <span>Status: {currentStatus}</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-sand animate-pulse" />
                    <span>
                      {isVerifyingReturn
                        ? "Verifying With Cashfree Server..."
                        : `Awaiting Verified Settlement (${currentStatus})`}
                    </span>
                  </>
                )}
              </div>

              {isVerifyingReturn ? (
                <div className="p-6 bg-white rounded-xs border border-border-warm space-y-3">
                  <Loader2 className="w-8 h-8 text-forest mx-auto animate-spin" />
                  <p className="text-xs font-semibold text-forest">
                    Confirming authoritative settlement status with Cashfree...
                  </p>
                </div>
              ) : (currentStatus === "PENDING" || currentStatus === "CREATED") &&
                initiatedPayment?.provider !== "CASHFREE" &&
                liveStatus?.provider !== "CASHFREE" ? (
                <div className="mx-auto w-56 h-56 bg-white p-3 rounded-xs border border-border-warm flex items-center justify-center shadow-sm">
                  {initiatedPayment?.qrImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={initiatedPayment.qrImageUrl}
                      alt="Transaction-specific Dynamic UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : initiatedPayment?.qrSvg ? (
                    <div
                      className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: initiatedPayment.qrSvg }}
                    />
                  ) : (
                    <span className="text-xs text-ink-sand">QR unavailable</span>
                  )}
                </div>
              ) : (currentStatus === "PENDING" || currentStatus === "CREATED") ? (
                <div className="p-6 bg-white rounded-xs border border-border-warm space-y-2.5">
                  <CreditCard className="w-8 h-8 text-forest mx-auto" />
                  <p className="font-serif font-bold text-base text-forest">
                    Cashfree Secure Checkout Session Ready
                  </p>
                  <p className="text-xs text-ink-sand">
                    Pay securely via UPI, Cards, or NetBanking. Click &ldquo;Open Cashfree Checkout&rdquo; below if the window did not open automatically.
                  </p>
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
                  {liveStatus?.paymentGroup && (
                    <p className="text-[11px] text-ink-sand uppercase">
                      Mode: {liveStatus.paymentGroup}
                    </p>
                  )}
                </div>
              )}

              <div className="text-xs text-ink font-sans space-y-1">
                <div className="text-lg font-serif font-bold text-forest">
                  ₹{Number(liveStatus?.amount ?? initiatedPayment?.amount ?? amount).toLocaleString("en-IN")} INR
                </div>
                <div className="text-ink-sand">
                  {liveStatus?.programmeName ?? initiatedPayment?.programmeName ?? "MECT Programme"}
                </div>
                <div className="font-mono text-[11px] text-terracotta-dark">
                  Ref: {liveStatus?.donationReference ?? initiatedPayment?.donationReference ?? "—"}
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {initiatedPayment?.provider === "CASHFREE" && initiatedPayment.paymentSessionId && liveStatus?.status !== "SUCCESSFUL" && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={isLaunchingGateway}
                    onClick={() => launchCashfreeModal(initiatedPayment)}
                  >
                    {isLaunchingGateway ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    <span>{isLaunchingGateway ? "Opening Cashfree..." : "Open Cashfree Checkout"}</span>
                  </Button>
                )}
                <Button type="button" variant="secondary" size="sm" onClick={handleManualStatusRefresh}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Check Settlement Status</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetCheckoutState}
                >
                  Start New Contribution
                </Button>
              </div>
            </div>

            {/* Payment Transparency Instructions */}
            <div className="lg:col-span-7 space-y-4 font-sans">
              <h3 className="font-serif text-xl font-bold text-forest">
                {initiatedPayment?.provider === "CASHFREE" || liveStatus?.provider === "CASHFREE"
                  ? "How Cashfree Online Verification Works"
                  : "How Dynamic QR Verification Works"}
              </h3>
              <ul className="space-y-2.5 text-sm text-ink">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-terracotta shrink-0 mt-1" />
                  <span>
                    {initiatedPayment?.provider === "CASHFREE" || liveStatus?.provider === "CASHFREE"
                      ? "Complete payment securely inside Cashfree using UPI apps, Debit/Credit Cards, or NetBanking."
                      : "Scan the unique QR using BHIM, Google Pay, PhonePe, Paytm, or your bank's UPI app."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-terracotta shrink-0 mt-1" />
                  <span>
                    <strong>Strict Server Verification:</strong> Donations transition to Confirmed only upon authenticated webhook signature &amp; server-side order verification — never from client URL params.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-terracotta shrink-0 mt-1" />
                  <span>
                    This checkout session is locked exclusively to order{" "}
                    <code>{initiatedPayment?.providerOrderId || liveStatus?.orderId || liveStatus?.donationReference}</code>.
                    {liveStatus?.bankReference ? ` Gateway Bank Ref: ${liveStatus.bankReference}.` : ""}
                  </span>
                </li>
              </ul>

              {(liveStatus?.status === "FAILED" || liveStatus?.status === "USER_DROPPED" || liveStatus?.status === "EXPIRED") && (
                <div className="p-4 rounded-xs bg-amber-50 border border-amber-200 space-y-2">
                  <p className="text-xs font-bold text-terracotta-dark uppercase tracking-wider">
                    Payment Not Completed ({liveStatus.status})
                  </p>
                  <p className="text-xs text-ink">
                    {liveStatus.failureReason ||
                      "Your transaction was cancelled or dropped before settlement. No donation was recorded."}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={resetCheckoutState}
                    >
                      Try Payment Again
                    </Button>
                    <a
                      href="#bank-details"
                      className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-forest border border-forest/30 rounded-xs hover:bg-sage/30"
                    >
                      Use Direct SBI Transfer / QR
                    </a>
                  </div>
                </div>
              )}

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
                {gatewayStatus?.provider === "CASHFREE" ? (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>{isInitiating ? "Initiating Cashfree Checkout..." : "Proceed to Cashfree Secure Checkout"}</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    <span>{isInitiating ? "Generating Dynamic QR..." : "Generate Dynamic UPI QR Payment"}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}

