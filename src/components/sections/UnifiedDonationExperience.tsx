"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  DonationProgrammeItem,
  DonationStatusResponse,
  GatewayStatusResponse,
  InitiatedDonationResponse,
  PaymentConfigurationDto,
  SubmitSbiUtrResponse,
  fetchDonationStatus,
  fetchPublicDonationConfig,
  initiateDonation,
  submitManualSbiUtrClaim,
  verifyCashfreePayment,
} from "@/lib/portal-api";
import { usePortalAuth } from "@/context/PortalAuthContext";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  Heart,
  Landmark,
  Loader2,
  Lock,
  QrCode,
  RefreshCw,
  ShieldCheck,
  UserCheck,
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
      reject(new Error("Unable to load Cashfree Checkout SDK. You can retry or use our verified SBI bank transfer option."));
    };
    document.head.appendChild(script);
  });
  return cashfreeScriptPromise;
}

const STEPS = [
  { id: 1, label: "Programme" },
  { id: 2, label: "Amount" },
  { id: 3, label: "Donor Info" },
  { id: 4, label: "Review" },
  { id: 5, label: "Payment" },
] as const;

export function UnifiedDonationExperience() {
  const searchParams = useSearchParams();
  const { token: portalToken, dashboard: portalDashboard } = usePortalAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [programmes, setProgrammes] = useState<DonationProgrammeItem[]>([]);
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatusResponse | null>(null);
  const [config, setConfig] = useState<PaymentConfigurationDto | null>(null);
  const signedInIdentity = portalDashboard?.account?.primaryEmail || portalDashboard?.account?.primaryPhone || null;

  const [step, setStep] = useState<number>(1);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [amount, setAmount] = useState<number>(1500);
  const [customAmountStr, setCustomAmountStr] = useState<string>("1500");

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorPan, setDonorPan] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [dedicationMessage, setDedicationMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [communicationConsent, setCommunicationConsent] = useState(true);

  const [paymentChannel, setPaymentChannel] = useState<"CASHFREE" | "SBI_DIRECT">("CASHFREE");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Gateway & status states
  const [initiated, setInitiated] = useState<InitiatedDonationResponse | null>(null);
  const [gatewayStatusResult, setGatewayStatusResult] = useState<DonationStatusResponse | null>(null);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  // Manual SBI UTR states
  const [utrReference, setUtrReference] = useState("");
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [paymentModeNote, setPaymentModeNote] = useState("UPI App Transfer");
  const [proofSummary, setProofSummary] = useState("");
  const [sbiSubmitted, setSbiSubmitted] = useState<SubmitSbiUtrResponse | null>(null);

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const res = await fetchPublicDonationConfig();
        if (!active) return;

        setProgrammes(res.programmes);
        setGatewayStatus(res.gatewayStatus);
        setConfig(res.config);

        const paramProg = searchParams.get("programme");
        const matchedProg = paramProg
          ? res.programmes.find((p) => p.code.toLowerCase() === paramProg.toLowerCase())
          : null;
        setSelectedCode(matchedProg?.code || res.programmes[0]?.code || "");

        const defaultPreset = res.config.presetAmounts?.[1] || res.config.presetAmounts?.[0] || 1000;
        setAmount(defaultPreset);
        setCustomAmountStr(String(defaultPreset));

        const paramMethod = searchParams.get("method");
        if (paramMethod === "SBI_DIRECT" || (!res.config.cashfreeEnabled && res.config.sbiQrEnabled)) {
          setPaymentChannel("SBI_DIRECT");
        } else {
          setPaymentChannel(res.config.primaryMethod === "SBI_QR" ? "SBI_DIRECT" : "CASHFREE");
        }

        // Check return callback from Cashfree
        const returnRef = searchParams.get("donationRef");
        const returnOrder = searchParams.get("orderId");
        if (returnRef || returnOrder) {
          setStep(5);
          try {
            const verified = returnOrder
              ? await verifyCashfreePayment(returnOrder)
              : await fetchDonationStatus(returnRef!);
            if (active) setGatewayStatusResult(verified);
          } catch {
            if (returnRef && active) {
              const fallbackStatus = await fetchDonationStatus(returnRef).catch(() => null);
              if (fallbackStatus && active) setGatewayStatusResult(fallbackStatus);
            }
          }
        }
      } catch (err) {
        if (active) {
          setLoadError(err instanceof Error ? err.message : "Unable to load donation configuration.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    init();
    return () => {
      active = false;
    };
  }, [searchParams]);

  const prefilledAccountRef = useRef<string | null>(null);

  useEffect(() => {
    if (!portalDashboard?.account) return;
    const acc = portalDashboard.account;
    const accountKey = acc.userUuid || acc.primaryEmail || acc.primaryPhone || "portal";
    if (prefilledAccountRef.current === accountKey) return;
    prefilledAccountRef.current = accountKey;

    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      if (acc.profile?.fullName) setDonorName((prev) => prev || acc.profile?.fullName || "");
      if (acc.primaryEmail) setDonorEmail((prev) => prev || acc.primaryEmail || "");
      if (acc.primaryPhone) setDonorPhone((prev) => prev || acc.primaryPhone || "");
      if (acc.profile?.addressLine) {
        const formatted = [
          acc.profile.addressLine,
          acc.profile.city,
          acc.profile.state,
          acc.profile.pinCode,
        ]
          .filter(Boolean)
          .join(", ");
        setDonorAddress((prev) => prev || formatted);
      }
    });
    return () => {
      active = false;
    };
  }, [portalDashboard]);

  const selectedProgramme = useMemo(
    () => programmes.find((p) => p.code === selectedCode) || null,
    [programmes, selectedCode]
  );

  const presets = config?.presetAmounts?.length ? config.presetAmounts : [500, 1000, 1500, 3000, 5000, 10000];
  const minAmount = config?.minAmount ?? 1;
  const maxAmount = config?.maxAmount ?? 10000000;

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  const validateStep = (targetStep: number): boolean => {
    setActionError(null);
    if (targetStep >= 2 && !selectedCode) {
      setActionError("Please select a charitable programme.");
      return false;
    }
    if (targetStep >= 3) {
      if (!Number.isFinite(amount) || amount < minAmount || amount > maxAmount) {
        setActionError(`Please enter a contribution between ₹${minAmount.toLocaleString("en-IN")} and ₹${maxAmount.toLocaleString("en-IN")}.`);
        return false;
      }
    }
    if (targetStep >= 4) {
      if (!donorName.trim()) {
        setActionError("Please enter your full name for accounting records.");
        return false;
      }
      if (!donorEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail.trim())) {
        setActionError("Please enter a valid email address so we can deliver your receipt.");
        return false;
      }
      if (donorPan.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(donorPan.trim().toUpperCase())) {
        setActionError("Optional PAN must be 10 characters (e.g. ABCDE1234F).");
        return false;
      }
    }
    return true;
  };

  const goToStep = (next: number) => {
    if (next <= step || validateStep(next)) {
      setStep(next);
    }
  };

  const handleCashfreeCheckout = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    setActionError(null);

    try {
      const resp = await initiateDonation(
        {
          programmeCode: selectedCode,
          amount,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          donorPhone: donorPhone.trim() || undefined,
          donorAddress: donorAddress.trim() || undefined,
          donorPan: donorPan.trim() ? donorPan.trim().toUpperCase() : undefined,
          dedicationMessage: dedicationMessage.trim() || undefined,
          anonymous,
          paymentMethod: "GATEWAY_CHECKOUT",
        },
        portalToken
      );

      setInitiated(resp);

      if (resp.paymentSessionId) {
        try {
          await ensureCashfreeSdkLoaded();
          const cf = window.Cashfree?.({
            mode: resp.checkoutEnvironment === "production" ? "production" : "sandbox",
          });
          if (cf) {
            const outcome = await cf.checkout({
              paymentSessionId: resp.paymentSessionId,
              redirectTarget: "_modal",
            });
            if (outcome?.error) {
              // Refresh backend status before concluding failure
              const latest = await verifyCashfreePayment(
                resp.orderId || resp.providerOrderId || resp.donationReference
              ).catch(() => fetchDonationStatus(resp.donationReference));
              setGatewayStatusResult(latest);
              return;
            }
          }
        } catch (sdkErr) {
          setActionError(
            sdkErr instanceof Error
              ? sdkErr.message
              : "Online gateway checkout could not open. You can retry or use our verified SBI bank transfer option."
          );
        }
      }

      const latest = await verifyCashfreePayment(
        resp.orderId || resp.providerOrderId || resp.donationReference
      ).catch(() => fetchDonationStatus(resp.donationReference));
      setGatewayStatusResult(latest);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to initiate online payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefreshGatewayStatus = async () => {
    const ref = gatewayStatusResult?.donationReference || initiated?.donationReference;
    const ord = gatewayStatusResult?.orderId || initiated?.orderId;
    if (!ref) return;
    setRefreshingStatus(true);
    setActionError(null);
    try {
      const latest = ord
        ? await verifyCashfreePayment(ord)
        : await fetchDonationStatus(ref);
      setGatewayStatusResult(latest);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to refresh payment status.");
    } finally {
      setRefreshingStatus(false);
    }
  };

  const handleSubmitSbiUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    if (!utrReference.trim() || utrReference.trim().length < 8) {
      setActionError("Please enter a valid 8–40 character UTR / bank transaction reference.");
      return;
    }
    setSubmitting(true);
    setActionError(null);
    try {
      const res = await submitManualSbiUtrClaim(
        {
          programmeCode: selectedCode,
          amount,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          donorPhone: donorPhone.trim() || undefined,
          donorAddress: donorAddress.trim() || undefined,
          donorPan: donorPan.trim() ? donorPan.trim().toUpperCase() : undefined,
          dedicationMessage: dedicationMessage.trim() || undefined,
          anonymous,
          communicationConsent,
          utrReference: utrReference.trim(),
          transferDate,
          paymentModeNote: paymentModeNote.trim() || undefined,
          proofSummary: proofSummary.trim() || undefined,
          existingDonationReference: gatewayStatusResult?.donationReference || initiated?.donationReference,
        },
        portalToken
      );
      setSbiSubmitted(res);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to submit SBI transfer reference.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card padding="lg" className="border-border-soft bg-white text-center py-14">
        <Loader2 className="w-7 h-7 animate-spin text-forest mx-auto mb-3" />
        <p className="text-sm text-ink-muted">Loading MECT verified donation channels and programmes...</p>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card padding="lg" className="border-red-200 bg-red-50/70">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif font-bold text-red-900">Donation Configuration Unavailable</h3>
            <p className="text-sm text-red-800 mt-1">{loadError}</p>
          </div>
        </div>
      </Card>
    );
  }

  const isGatewayFailed =
    gatewayStatusResult &&
    ["FAILED", "USER_DROPPED", "CANCELLED", "EXPIRED"].includes(gatewayStatusResult.status);
  const isGatewayPending =
    gatewayStatusResult &&
    ["PENDING", "CREATED"].includes(gatewayStatusResult.status);
  const isGatewaySuccess = gatewayStatusResult?.status === "SUCCESSFUL";

  return (
    <div className="space-y-6">
      {/* Top Identity / Guest vs Signed-In Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-border-soft rounded-xs px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs text-ink">
          {signedInIdentity ? (
            <>
              <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Signed in as <strong className="text-forest">{signedInIdentity}</strong> — this contribution will automatically link to your Donor Portal.
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-terracotta-dark shrink-0" />
              <span>
                <strong>Guest Checkout Enabled</strong> — no account required. Existing donors can{" "}
                <Link href="/portal/login?next=/donate" className="text-terracotta-dark font-bold underline hover:text-forest">
                  sign in via OTP
                </Link>{" "}
                or claim guest receipts later.
              </span>
            </>
          )}
        </div>
        <Badge variant={config?.statutoryClaimApproved ? "forest" : "gold"} size="sm">
          {config?.statutoryFinancialYear || "FY 2026-27"} ·{" "}
          {config?.statutoryClaimApproved ? "80G Active" : "Institutional Receipt"}
        </Badge>
      </div>

      {/* 5-Step Progress Indicator */}
      <nav aria-label="Donation progress" className="bg-white border border-border-soft rounded-xs p-3 sm:p-4">
        <ol className="grid grid-cols-5 gap-1.5 sm:gap-3">
          {STEPS.map((s) => {
            const done = step > s.id || isGatewaySuccess || Boolean(sbiSubmitted);
            const current = step === s.id && !isGatewaySuccess && !sbiSubmitted;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => !sbiSubmitted && !isGatewaySuccess && goToStep(s.id)}
                  className={`w-full flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 px-2 py-2 rounded-xs border text-center sm:text-left transition-colors ${
                    current
                      ? "bg-forest text-white border-forest font-bold"
                      : done
                      ? "bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold"
                      : "bg-cream/50 text-ink-muted border-border-soft"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center shrink-0 font-mono ${
                      current
                        ? "bg-white text-forest"
                        : done
                        ? "bg-emerald-600 text-white"
                        : "bg-white border border-border-soft text-ink-muted"
                    }`}
                  >
                    {done ? <Check className="w-3 h-3" /> : s.id}
                  </span>
                  <span className="text-[11px] sm:text-xs truncate">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {actionError && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xs p-4 flex items-start gap-3 text-sm text-red-900">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div className="flex-1">{actionError}</div>
        </div>
      )}

      {/* STEP 1: Select Programme */}
      {step === 1 && (
        <Card padding="lg" className="bg-white border-border-soft space-y-5">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
              Step 1 — Select Charitable Programme
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Choose the MECT programme your voluntary contribution will support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {programmes.map((prog) => {
              const selected = prog.code === selectedCode;
              return (
                <button
                  key={prog.code}
                  type="button"
                  onClick={() => setSelectedCode(prog.code)}
                  className={`text-left p-4 rounded-xs border transition-all ${
                    selected
                      ? "border-forest bg-forest/5 ring-2 ring-forest/20"
                      : "border-border-soft bg-cream/30 hover:border-forest/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-serif font-bold text-forest text-base">{prog.name}</div>
                      {prog.tagline && (
                        <div className="text-xs font-semibold text-terracotta-dark mt-0.5">{prog.tagline}</div>
                      )}
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        selected ? "bg-forest border-forest text-white" : "border-border-soft bg-white"
                      }`}
                    >
                      {selected && <Check className="w-3 h-3" />}
                    </span>
                  </div>
                  {prog.description && (
                    <p className="text-xs text-ink-muted mt-2 leading-relaxed">{prog.description}</p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="button" variant="primary" size="lg" onClick={() => goToStep(2)}>
              <span>Continue to Amount</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Select Amount */}
      {step === 2 && (
        <Card padding="lg" className="bg-white border-border-soft space-y-5">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
              Step 2 — Select Contribution Amount
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Supporting <strong>{selectedProgramme?.name}</strong>. Permitted single contribution: ₹
              {minAmount.toLocaleString("en-IN")} – ₹{maxAmount.toLocaleString("en-IN")}.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {presets.map((val) => {
              const active = amount === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setAmount(val);
                    setCustomAmountStr(String(val));
                  }}
                  className={`py-3.5 px-4 rounded-xs border font-mono font-bold text-base transition-all ${
                    active
                      ? "bg-forest text-white border-forest shadow-sm"
                      : "bg-cream/40 text-forest border-border-soft hover:border-forest/50"
                  }`}
                >
                  ₹{val.toLocaleString("en-IN")}
                </button>
              );
            })}
          </div>

          <div className="max-w-sm space-y-1.5">
            <label htmlFor="custom-donation-amount" className="block text-xs font-semibold text-forest uppercase tracking-wider">
              Or Enter Custom Amount (INR)
            </label>
            <Input
              id="custom-donation-amount"
              type="number"
              min={minAmount}
              max={maxAmount}
              step="1"
              value={customAmountStr}
              onChange={(e) => {
                setCustomAmountStr(e.target.value);
                const parsed = Number(e.target.value);
                setAmount(Number.isFinite(parsed) ? parsed : 0);
              }}
              className="font-mono text-base font-bold"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back</span>
            </Button>
            <Button type="button" variant="primary" size="lg" onClick={() => goToStep(3)}>
              <span>Continue to Donor Info</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Donor Information */}
      {step === 3 && (
        <Card padding="lg" className="bg-white border-border-soft space-y-5">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
              Step 3 — Donor Information
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              We collect only the details needed for your official receipt and statutory ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="donor-full-name" className="block text-xs font-semibold text-forest mb-1">
                Full Name <span className="text-red-600">*</span>
              </label>
              <Input
                id="donor-full-name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Rajesh Kumar Jain"
                required
              />
            </div>

            <div>
              <label htmlFor="donor-email" className="block text-xs font-semibold text-forest mb-1">
                Email Address (for PDF receipt) <span className="text-red-600">*</span>
              </label>
              <Input
                id="donor-email"
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="donor-phone" className="block text-xs font-semibold text-forest mb-1">
                Mobile Number (Optional)
              </label>
              <Input
                id="donor-phone"
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="+91 98XXXXXXXX"
              />
            </div>

            <div>
              <label htmlFor="donor-pan" className="block text-xs font-semibold text-forest mb-1">
                PAN (Optional — for statutory Form 10BD records)
              </label>
              <Input
                id="donor-pan"
                value={donorPan}
                onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                maxLength={10}
                placeholder="ABCDE1234F"
                className="font-mono uppercase"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="donor-address" className="block text-xs font-semibold text-forest mb-1">
                Postal Address (Optional)
              </label>
              <Input
                id="donor-address"
                value={donorAddress}
                onChange={(e) => setDonorAddress(e.target.value)}
                placeholder="House/Street, City, State, PIN Code"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="donor-dedication" className="block text-xs font-semibold text-forest mb-1">
                Dedication / Purpose Note (Optional)
              </label>
              <Input
                id="donor-dedication"
                value={dedicationMessage}
                onChange={(e) => setDedicationMessage(e.target.value)}
                maxLength={250}
                placeholder="In memory of / dedicated to..."
              />
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-border-soft text-xs text-ink">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="mt-0.5 accent-forest"
              />
              <span>Display my public acknowledgement as <strong>Anonymous Donor</strong> (internal accounting still retains my verified name).</span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={communicationConsent}
                onChange={(e) => setCommunicationConsent(e.target.checked)}
                className="mt-0.5 accent-forest"
              />
              <span>I consent to receive donation receipt confirmations and programme impact updates in accordance with MECT&apos;s Privacy Policy.</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back</span>
            </Button>
            <Button type="button" variant="primary" size="lg" onClick={() => goToStep(4)}>
              <span>Review Donation</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Review & Choose Payment Channel */}
      {step === 4 && (
        <Card padding="lg" className="bg-white border-border-soft space-y-5">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
              Step 4 — Review &amp; Payment Method
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Verify your contribution details and statutory disclosure before proceeding to payment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-cream/40 border border-border-soft rounded-xs p-4 text-sm">
            <div className="space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-muted">Programme &amp; Amount</div>
              <div className="font-serif font-bold text-forest text-base">{selectedProgramme?.name}</div>
              <div className="font-mono font-bold text-2xl text-terracotta-dark">₹{amount.toLocaleString("en-IN")}</div>
            </div>
            <div className="space-y-1 text-xs text-ink">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-muted">Donor Details</div>
              <div><strong>{donorName}</strong> {anonymous ? "(Publicly Anonymous)" : ""}</div>
              <div>{donorEmail}</div>
              {donorPhone && <div>{donorPhone}</div>}
              {donorPan && <div className="font-mono">PAN: {donorPan}</div>}
              {donorAddress && <div className="text-ink-muted">{donorAddress}</div>}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-forest">Select Payment Channel</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config?.cashfreeEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentChannel("CASHFREE")}
                  className={`p-4 rounded-xs border text-left transition-all ${
                    paymentChannel === "CASHFREE"
                      ? "border-forest bg-forest/5 ring-2 ring-forest/20"
                      : "border-border-soft bg-white hover:border-forest/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-serif font-bold text-forest">
                      <CreditCard className="w-4 h-4 text-terracotta-dark" />
                      <span>Cashfree Online Checkout</span>
                    </span>
                    <Badge variant="forest" size="sm">Primary</Badge>
                  </div>
                  <p className="text-xs text-ink-muted mt-1.5">
                    Instant UPI, Cards, NetBanking &amp; Wallets with automatic server-verified PDF receipt.
                  </p>
                </button>
              )}

              {config?.sbiQrEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentChannel("SBI_DIRECT")}
                  className={`p-4 rounded-xs border text-left transition-all ${
                    paymentChannel === "SBI_DIRECT"
                      ? "border-forest bg-forest/5 ring-2 ring-forest/20"
                      : "border-border-soft bg-white hover:border-forest/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-serif font-bold text-forest">
                      <Landmark className="w-4 h-4 text-terracotta-dark" />
                      <span>SBI Direct UPI / Bank Transfer</span>
                    </span>
                    <Badge variant="gold" size="sm">Verified Manual</Badge>
                  </div>
                  <p className="text-xs text-ink-muted mt-1.5">
                    Pay directly via SBI UPI QR / NEFT / IMPS and submit your UTR for accounts verification.
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* Statutory Eligibility Disclosure */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xs p-3.5 text-xs text-amber-950 space-y-1">
            <div className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>Statutory &amp; Processing Disclosure ({config?.statutoryFinancialYear})</span>
            </div>
            <p className="leading-relaxed">{config?.statutoryDisclosureText}</p>
            <p className="text-amber-900/90">{config?.gatewayNoticeText}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => setStep(3)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Edit Info</span>
            </Button>
            <Button type="button" variant="primary" size="lg" onClick={() => setStep(5)}>
              <Lock className="w-4 h-4 mr-2" />
              <span>Proceed to Payment</span>
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: Payment & Verification */}
      {step === 5 && (
        <div className="space-y-5">
          {/* Verified Success Screen (Cashfree) */}
          {isGatewaySuccess && gatewayStatusResult && (
            <Card padding="lg" className="bg-emerald-50/70 border-emerald-300 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-serif text-xl font-bold text-emerald-950">
                    Thank You — Donation Verified
                  </h2>
                  <p className="text-sm text-emerald-900 mt-1">
                    Reference <strong className="font-mono">{gatewayStatusResult.donationReference}</strong> for{" "}
                    <strong>₹{gatewayStatusResult.amount.toLocaleString("en-IN")}</strong> ({gatewayStatusResult.programmeName}) is confirmed.
                  </p>
                  {gatewayStatusResult.receiptNumber && (
                    <p className="text-xs text-emerald-900 mt-1 font-mono">
                      Official Receipt: <strong>{gatewayStatusResult.receiptNumber}</strong>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/portal/dashboard">
                  <Button variant="primary">Open Donor Portal &amp; Download Receipt</Button>
                </Link>
              </div>
            </Card>
          )}

          {/* SBI UTR Submission Success (Pending Verification, NOT Final Receipt) */}
          {sbiSubmitted && (
            <Card padding="lg" className="bg-amber-50/80 border-amber-300 space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-7 h-7 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-xl font-bold text-amber-950">
                      SBI Transfer Claim Submitted — Pending Verification
                    </h2>
                    <Badge variant="gold" size="sm">{sbiSubmitted.claimStatus}</Badge>
                  </div>
                  <p className="text-sm text-amber-900 mt-1.5 leading-relaxed">{sbiSubmitted.message}</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-white/80 border border-amber-200 rounded-xs p-3 font-mono">
                    <div>Claim Ref: <strong>{sbiSubmitted.claimReference}</strong></div>
                    <div>Donation Ref: <strong>{sbiSubmitted.donationReference}</strong></div>
                    <div>UTR: <strong>{sbiSubmitted.utrNormalized}</strong></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/portal/dashboard">
                  <Button variant="primary">Track Verification in Donor Portal</Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSbiSubmitted(null);
                    setInitiated(null);
                    setGatewayStatusResult(null);
                    setStep(1);
                  }}
                >
                  Make Another Contribution
                </Button>
              </div>
            </Card>
          )}

          {/* Cashfree Pending / Unknown Reconciliation View */}
          {!isGatewaySuccess && !sbiSubmitted && isGatewayPending && gatewayStatusResult && (
            <Card padding="lg" className="bg-blue-50/70 border-blue-200 space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-bold text-blue-950 text-lg">
                    Payment Processing — Please Do Not Pay Twice
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-900 mt-1">
                    Donation reference <strong className="font-mono">{gatewayStatusResult.donationReference}</strong> is currently{" "}
                    <strong>{gatewayStatusResult.status}</strong>. Check status below before attempting any new payment.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="primary" onClick={handleRefreshGatewayStatus} disabled={refreshingStatus}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshingStatus ? "animate-spin" : ""}`} />
                  <span>{refreshingStatus ? "Reconciling..." : "Reconcile Payment Status"}</span>
                </Button>
              </div>
            </Card>
          )}

          {/* Cashfree Intelligent Failure Fallback */}
          {!isGatewaySuccess && !sbiSubmitted && isGatewayFailed && gatewayStatusResult && (
            <Card padding="lg" className="bg-red-50/70 border-red-200 space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-bold text-red-950 text-lg">
                    Your payment could not be completed. You can try again or use our verified SBI bank transfer option.
                  </h3>
                  <p className="text-xs text-red-900 mt-1">
                    Original reference: <strong className="font-mono">{gatewayStatusResult.donationReference}</strong> (Status:{" "}
                    {gatewayStatusResult.status}). If money was debited, click Reconcile first before paying again.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={handleRefreshGatewayStatus} disabled={refreshingStatus}>
                  <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshingStatus ? "animate-spin" : ""}`} />
                  <span>Reconcile First</span>
                </Button>
                <Button type="button" variant="primary" onClick={handleCashfreeCheckout} disabled={submitting}>
                  <span>Retry Cashfree</span>
                </Button>
                {config?.sbiQrEnabled && (
                  <Button type="button" variant="secondary" onClick={() => setPaymentChannel("SBI_DIRECT")}>
                    <Landmark className="w-4 h-4 mr-1.5" />
                    <span>Switch to Verified SBI Transfer</span>
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Active Payment Channel Cards */}
          {!isGatewaySuccess && !sbiSubmitted && (
            <Card padding="lg" className="bg-white border-border-soft space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-soft pb-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-forest">
                    Step 5 — Complete Contribution (₹{amount.toLocaleString("en-IN")})
                  </h2>
                  <p className="text-xs text-ink-muted">
                    {selectedProgramme?.name} · {donorName} ({donorEmail})
                  </p>
                </div>
                <div className="flex gap-2">
                  {config?.cashfreeEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentChannel("CASHFREE")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xs border ${
                        paymentChannel === "CASHFREE"
                          ? "bg-forest text-white border-forest"
                          : "bg-cream/50 text-forest border-border-soft"
                      }`}
                    >
                      Cashfree
                    </button>
                  )}
                  {config?.sbiQrEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentChannel("SBI_DIRECT")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xs border ${
                        paymentChannel === "SBI_DIRECT"
                          ? "bg-forest text-white border-forest"
                          : "bg-cream/50 text-forest border-border-soft"
                      }`}
                    >
                      SBI Direct / UTR
                    </button>
                  )}
                </div>
              </div>

              {paymentChannel === "CASHFREE" && config?.cashfreeEnabled && (
                <div className="space-y-4">
                  <div className="bg-cream/40 border border-border-soft rounded-xs p-4 text-xs sm:text-sm text-ink space-y-2">
                    <div className="font-semibold text-forest flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-terracotta-dark" />
                      <span>Cashfree Secure Payment Gateway ({gatewayStatus?.checkoutEnvironment || "production"})</span>
                    </div>
                    <p className="text-ink-muted">
                      Your order is created and verified exclusively on MECT&apos;s server. Receipts are issued only after authenticated gateway verification.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(4)}>
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      <span>Back to Review</span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={handleCashfreeCheckout}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span>Opening Secure Checkout...</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-2 fill-current" />
                          <span>Pay ₹{amount.toLocaleString("en-IN")} via Cashfree</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {paymentChannel === "SBI_DIRECT" && config?.sbiQrEnabled && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Official SBI QR & Bank Details */}
                  <div className="lg:col-span-5 space-y-4 bg-cream/40 border border-border-soft rounded-xs p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-terracotta-dark" />
                        <span>Official SBI UPI QR</span>
                      </span>
                      <a
                        href={config.sbiQrImageUrl}
                        download="mect-sbi-upi-qr.png"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-dark hover:text-forest underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download QR</span>
                      </a>
                    </div>

                    <div className="bg-white border border-border-soft rounded-xs p-3 flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={config.sbiQrImageUrl}
                        alt="Official State Bank of India UPI QR for Mahaveer Educational & Charitable Trust"
                        className="w-48 h-48 object-contain"
                      />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xs p-3 text-xs text-amber-950 leading-relaxed">
                      <strong>Beneficiary Verification Warning:</strong> {config.paymentInstructions}
                    </div>

                    <div className="space-y-2 text-xs">
                      {[
                        { key: "upi", label: "UPI ID", value: config.sbiUpiId },
                        { key: "holder", label: "Account Name", value: config.sbiAccountName },
                        { key: "acct", label: "Account Number", value: config.sbiAccountNumber },
                        { key: "ifsc", label: "IFSC Code", value: config.sbiIfsc },
                        { key: "branch", label: "Branch", value: `${config.sbiBankName} — ${config.sbiBranch}` },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between gap-2 bg-white border border-border-soft rounded-xs px-2.5 py-2">
                          <div className="min-w-0">
                            <div className="text-[10px] uppercase text-ink-muted">{item.label}</div>
                            <div className="font-mono font-semibold text-forest truncate">{item.value}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyValue(item.key, item.value)}
                            className="p-1.5 text-ink-muted hover:text-forest shrink-0"
                            aria-label={`Copy ${item.label}`}
                          >
                            {copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Structured UTR Submission Form */}
                  <form onSubmit={handleSubmitSbiUtr} className="lg:col-span-7 space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-forest text-lg">
                        Submit Your SBI UTR / Bank Reference
                      </h3>
                      <p className="text-xs text-ink-muted mt-1">
                        After transferring <strong>₹{amount.toLocaleString("en-IN")}</strong>, enter your UTR below. MECT Finance will verify the credit against our SBI statement before issuing your official PDF receipt.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="sm:col-span-2">
                        <label htmlFor="sbi-utr" className="block text-xs font-semibold text-forest mb-1">
                          UTR / UPI Transaction Reference <span className="text-red-600">*</span>
                        </label>
                        <Input
                          id="sbi-utr"
                          value={utrReference}
                          onChange={(e) => setUtrReference(e.target.value.toUpperCase())}
                          placeholder="e.g. 412345678901 or SBINR52026..."
                          className="font-mono uppercase"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="sbi-date" className="block text-xs font-semibold text-forest mb-1">
                          Transfer Date <span className="text-red-600">*</span>
                        </label>
                        <Input
                          id="sbi-date"
                          type="date"
                          max={new Date().toISOString().slice(0, 10)}
                          value={transferDate}
                          onChange={(e) => setTransferDate(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="sbi-mode" className="block text-xs font-semibold text-forest mb-1">
                          Transfer Channel / Remitter Name
                        </label>
                        <Input
                          id="sbi-mode"
                          value={paymentModeNote}
                          onChange={(e) => setPaymentModeNote(e.target.value)}
                          placeholder="UPI App / NEFT / IMPS"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="sbi-proof" className="block text-xs font-semibold text-forest mb-1">
                          Additional Payment Reference / Notes (Optional)
                        </label>
                        <Input
                          id="sbi-proof"
                          value={proofSummary}
                          onChange={(e) => setProofSummary(e.target.value)}
                          placeholder="Bank app transaction ID or remitter bank name"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <Button type="button" variant="outline" onClick={() => setStep(4)}>
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        <span>Back to Review</span>
                      </Button>
                      <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            <span>Submitting UTR...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            <span>Submit UTR for Verification</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
