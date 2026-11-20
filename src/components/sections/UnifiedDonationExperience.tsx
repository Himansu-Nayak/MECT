"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { DonationProgrammeCard } from "./DonationProgrammeCard";
import {
  DonationProgrammeItem,
  DonationStatusResponse,
  GatewayStatusResponse,
  InitiatedDonationResponse,
  PaymentConfigurationDto,
  PublicDonationConfigResponse,
  SubmitSbiUtrResponse,
  downloadPortalReceiptPdf,
  fetchDonationStatus,
  fetchPublicDonationConfig,
  initiateDonation,
  requestPortalOtp,
  submitManualSbiUtrClaim,
  updatePortalProfile,
  verifyCashfreePayment,
  verifyPortalOtp,
} from "@/lib/portal-api";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { MECT_ORG } from "@/config/org";
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
  FileText,
  Heart,
  Landmark,
  Loader2,
  Lock,
  Mail,
  Phone,
  QrCode,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
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

const ODISHA_DISTRICTS = [
  "Balangir",
  "Bargarh",
  "Sambalpur",
  "Sonepur (Subarnapur)",
  "Kalahandi",
  "Nuapada",
  "Jharsuguda",
  "Deogarh",
  "Sundargarh",
  "Boudh",
  "Angul",
  "Cuttack",
  "Khordha (Bhubaneswar)",
  "Puri",
  "Ganjam",
  "Koraput",
  "Rayagada",
  "Nabarangpur",
  "Malkangiri",
  "Kandhamal",
  "Nayagarh",
  "Kendrapara",
  "Jagatsinghpur",
  "Jajpur",
  "Bhadrak",
  "Balasore",
  "Mayurbhanj",
  "Keonjhar",
  "Dhenkanal",
  "Gajapati",
  "Other / Outside Odisha",
];

const STEPS = [
  { id: 1, label: "Programmes", title: "Explore Programmes" },
  { id: 2, label: "Amount", title: "Select Contribution" },
  { id: 3, label: "Verification", title: "Donor Authentication" },
  { id: 4, label: "Donor Profile", title: "Profile & Tax Details" },
  { id: 5, label: "Review", title: "Review & Statutory Disclosure" },
  { id: 6, label: "Payment", title: "Secure Payment & Receipt" },
] as const;

const FALLBACK_PUBLIC_CONFIG: PublicDonationConfigResponse = {
  programmes: [
    {
      id: 1,
      code: "SCHOLARSHIPS",
      name: "Higher Education Tuition Assistance (Shiksha Setu)",
      tagline: "Direct-to-college tuition fee sponsorship for merit scholars across Western Odisha",
      description: "Direct-to-college tuition assistance for economically challenged undergraduate and polytechnic scholars across Western Odisha.",
      generalFund: false,
      active: true,
      displayOrder: 1,
    },
    {
      id: 2,
      code: "JAL_SEVA",
      name: "Summer Safe Drinking Water Relief (Jal Seva)",
      tagline: "Purified water kiosks across transit points and hospital zones in Balangir",
      description: "Purified drinking water kiosks and cold hydration stations during 45°C peak summer heatwaves in Western Odisha.",
      generalFund: false,
      active: true,
      displayOrder: 2,
    },
    {
      id: 3,
      code: "WOMEN_LIVELIHOOD",
      name: "Women's Vocational Tailoring & Skilling (Swavalamban)",
      tagline: "Practical sewing craftsmanship and micro-enterprise development",
      description: "Certified garment construction, machine operation, and self-help tailoring training for rural women.",
      generalFund: false,
      active: true,
      displayOrder: 3,
    },
    {
      id: 4,
      code: "GENERAL_CHARITY",
      name: "Essential Community Welfare & Relief (Samaj Kalyan)",
      tagline: "Winter blankets, disaster response, and destitute patient aid at District Hospital",
      description: "Rapid relief, winter thermal distributions, and emergency patient attendant meals at Balangir District Hospital.",
      generalFund: true,
      active: true,
      displayOrder: 4,
    },
    {
      id: 5,
      code: "HANUMAN_MURTI",
      name: "Grand Hanuman Murti Cultural Project",
      tagline: "Proposed 80–100-foot cultural landmark • Segregated Sub-Ledger",
      description: "Strictly segregated sub-ledger donations for the proposed cultural monument in Balangir. Funds cannot cross-mingle.",
      generalFund: false,
      active: true,
      displayOrder: 5,
    },
  ],
  gatewayStatus: {
    provider: "SBI_DIRECT",
    configured: true,
    sandboxMode: false,
    dynamicQrSupported: true,
    reason: "Direct State Bank of India NEFT/RTGS and UPI Transfer Active",
  },
  config: {
    cashfreeEnabled: false,
    sbiQrEnabled: true,
    primaryMethod: "SBI_QR",
    fallbackEnabled: true,
    minAmount: 100,
    maxAmount: 5000000,
    presetAmounts: [500, 1000, 2500, 5000, 10000],
    generalFundEnabled: true,
    sbiBankName: MECT_ORG.bank.bankName,
    sbiAccountName: MECT_ORG.bank.accountHolder,
    sbiAccountNumber: MECT_ORG.bank.accountNumber,
    sbiIfsc: MECT_ORG.bank.ifsc,
    sbiBranch: MECT_ORG.bank.branch,
    sbiUpiId: MECT_ORG.bank.upiId,
    sbiQrImageUrl: "",
    paymentInstructions: "Please transfer the contribution directly using UPI or NEFT/RTGS to our official State Bank of India account. Enter your 12-digit UTR/transaction reference below for verified receipt reconciliation.",
    gatewayNoticeText: "Direct Verified Bank Transfer & UPI Mode Active. Offline reconciliation enabled.",
    statutoryStatus: "Valid AY 2024-25 to AY 2026-27 (Order dated 29-01-2024)",
    statutoryFinancialYear: "2026-27",
    statutoryUrn80g: "AADTM5474FF20241",
    statutoryUrn12a: "AADTM5474FE20231",
    statutoryClaimApproved: true,
    statutoryDisclosureText: "Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility. Official receipts with Trust PAN AADTM5474F are generated upon bank verification.",
  },
};

export function UnifiedDonationExperience() {
  const searchParams = useSearchParams();
  const { token: portalToken, dashboard: portalDashboard, isAuthenticated, setSessionFromOtp, logout } = usePortalAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [programmes, setProgrammes] = useState<DonationProgrammeItem[]>([]);
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatusResponse | null>(null);
  const [config, setConfig] = useState<PaymentConfigurationDto | null>(null);

  // Journey navigation
  const [step, setStep] = useState<number>(1);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [frequency, setFrequency] = useState<"ONE_TIME" | "MONTHLY">("ONE_TIME");
  const [amount, setAmount] = useState<number>(1000);
  const [customAmountStr, setCustomAmountStr] = useState<string>("1000");

  // Authentication states (Step 3)
  const [authChannel, setAuthChannel] = useState<"PHONE" | "EMAIL">("PHONE");
  const [phoneInput, setPhoneInput] = useState("");
  const [authEmailInput, setAuthEmailInput] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Donor profile & tax information (Step 4)
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Balangir");
  const [district, setDistrict] = useState("Balangir");
  const [stateName, setStateName] = useState("Odisha");
  const [pinCode, setPinCode] = useState("767001");
  const [country, setCountry] = useState("India");
  const [donorPan, setDonorPan] = useState("");
  const [dedicationMessage, setDedicationMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [communicationConsent, setCommunicationConsent] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Review & terms (Step 5)
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Payment states (Step 6)
  const [paymentChannel, setPaymentChannel] = useState<"CASHFREE" | "SBI_DIRECT">("CASHFREE");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Gateway & status states
  const [initiated, setInitiated] = useState<InitiatedDonationResponse | null>(null);
  const [gatewayStatusResult, setGatewayStatusResult] = useState<DonationStatusResponse | null>(null);
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  // Manual SBI UTR states
  const [utrReference, setUtrReference] = useState("");
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [paymentModeNote, setPaymentModeNote] = useState("UPI App Transfer");
  const [proofSummary, setProofSummary] = useState("");
  const [sbiSubmitted, setSbiSubmitted] = useState<SubmitSbiUtrResponse | null>(null);

  // Load public donation configuration & handle callback
  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const res = await fetchPublicDonationConfig();
        if (!active) return;

        // Hardened Bank Credential Guard: If database returns stale/differing values,
        // override with canonical src/config/org.ts and log warning
        const canonicalBank = MECT_ORG.bank;
        if (res?.config) {
          if (
            res.config.sbiAccountNumber !== canonicalBank.accountNumber ||
            res.config.sbiIfsc !== canonicalBank.ifsc ||
            res.config.sbiUpiId !== canonicalBank.upiId
          ) {
            console.warn(
              "[MECT BANK SAFETY] Remote DB bank credentials differ from canonical src/config/org.ts. Overriding DB values with canonical org.ts.",
              {
                dbAccount: res.config.sbiAccountNumber,
                canonicalAccount: canonicalBank.accountNumber,
                dbIfsc: res.config.sbiIfsc,
                canonicalIfsc: canonicalBank.ifsc,
                dbUpi: res.config.sbiUpiId,
                canonicalUpi: canonicalBank.upiId,
              }
            );
            res.config.sbiAccountNumber = canonicalBank.accountNumber;
            res.config.sbiIfsc = canonicalBank.ifsc;
            res.config.sbiUpiId = canonicalBank.upiId;
            res.config.sbiBankName = canonicalBank.bankName;
            res.config.sbiAccountName = canonicalBank.accountHolder;
            res.config.sbiBranch = canonicalBank.branch;
          }
        }

        setProgrammes(res.programmes);
        setGatewayStatus(res.gatewayStatus);
        setConfig(res.config);

        const paramProg = searchParams.get("programme");
        const matchedProg = paramProg
          ? res.programmes.find((p) => p.code.toLowerCase() === paramProg.toLowerCase())
          : null;
        setSelectedCode(matchedProg?.code || res.programmes[0]?.code || "");

        const paramAmount = searchParams.get("amount");
        const parsedAmount = paramAmount ? parseInt(paramAmount, 10) : NaN;
        const initialAmount =
          !isNaN(parsedAmount) && parsedAmount > 0
            ? parsedAmount
            : res.config.presetAmounts?.[1] || res.config.presetAmounts?.[0] || 1000;
        setAmount(initialAmount);
        setCustomAmountStr(String(initialAmount));

        // Advance step if returning from authentication with preselected parameters
        if (paramProg || paramAmount) {
          if (portalToken) {
            setStep(4);
          } else if (paramAmount) {
            setStep(3);
          }
        }

        const paramMethod = searchParams.get("method");
        if (paramMethod === "SBI_DIRECT" || (!res.config.cashfreeEnabled && res.config.sbiQrEnabled)) {
          setPaymentChannel("SBI_DIRECT");
        } else {
          setPaymentChannel(res.config.primaryMethod === "SBI_QR" ? "SBI_DIRECT" : "CASHFREE");
        }

        // Return callback check from payment gateway
        const returnRef = searchParams.get("donationRef");
        const returnOrder = searchParams.get("orderId");
        if (returnRef || returnOrder) {
          setStep(6);
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
      } catch {
        if (!active) return;
        const res = FALLBACK_PUBLIC_CONFIG;
        setProgrammes(res.programmes);
        setGatewayStatus(res.gatewayStatus);
        setConfig(res.config);

        const paramProg = searchParams.get("programme");
        const matchedProg = paramProg
          ? res.programmes.find((p) => p.code.toLowerCase() === paramProg.toLowerCase())
          : null;
        setSelectedCode(matchedProg?.code || res.programmes[0]?.code || "");

        const paramAmount = searchParams.get("amount");
        const parsedAmount = paramAmount ? parseInt(paramAmount, 10) : NaN;
        const initialAmount =
          !isNaN(parsedAmount) && parsedAmount > 0
            ? parsedAmount
            : res.config.presetAmounts?.[1] || 1000;
        setAmount(initialAmount);
        setCustomAmountStr(String(initialAmount));

        if (paramProg || paramAmount) {
          if (portalToken) {
            setStep(4);
          } else if (paramAmount) {
            setStep(3);
          }
        }
        setPaymentChannel("SBI_DIRECT");
        setLoadError(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    init();
    return () => {
      active = false;
    };
  }, [searchParams]);

  // Sync profile data from authenticated account
  const prefilledAccountRef = useRef<string | null>(null);
  useEffect(() => {
    if (!portalDashboard?.account) return;
    const acc = portalDashboard.account;
    const accountKey = acc.userUuid || acc.primaryEmail || acc.primaryPhone || "portal";
    if (prefilledAccountRef.current === accountKey) return;
    prefilledAccountRef.current = accountKey;

    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const p = acc.profile;
      if (p?.fullName) setDonorName((prev) => prev || p.fullName || "");
      if (acc.primaryEmail) setDonorEmail((prev) => prev || acc.primaryEmail || "");
      if (acc.primaryPhone) {
        setDonorPhone((prev) => prev || acc.primaryPhone || "");
        setPhoneInput((prev) => prev || acc.primaryPhone?.replace("+91", "") || "");
      }
      if (p?.addressLine) setAddressLine((prev) => prev || p.addressLine || "");
      if (p?.city) setCity((prev) => prev || p.city || "");
      if (p?.district) setDistrict((prev) => prev || p.district || "");
      if (p?.state) setStateName((prev) => prev || p.state || "");
      if (p?.pinCode) setPinCode((prev) => prev || p.pinCode || "");
    });
    return () => {
      active = false;
    };
  }, [portalDashboard]);

  // OTP resend timer countdown
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const selectedProgramme = useMemo(
    () => programmes.find((p) => p.code === selectedCode) || null,
    [programmes, selectedCode]
  );

  const presets = config?.presetAmounts?.length ? config.presetAmounts : [500, 1000, 2500, 5000, 10000];
  const minAmount = config?.minAmount ?? 100;
  const maxAmount = config?.maxAmount ?? 5000000;

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  const normalizePhone = (raw: string): string => {
    const cleaned = raw.trim().replace(/\D/g, "");
    if (cleaned.length === 10) return `+91${cleaned}`;
    if (cleaned.length === 12 && cleaned.startsWith("91")) return `+${cleaned}`;
    if (cleaned.length > 10 && raw.startsWith("+")) return raw.trim();
    return cleaned.length === 10 ? `+91${cleaned}` : raw.trim();
  };

  // Step validation
  const validateStep = (targetStep: number): boolean => {
    setActionError(null);
    setAuthError(null);

    // Step 1: Must select a programme
    if (targetStep >= 2 && !selectedCode) {
      setActionError("Please select a charitable programme to continue.");
      return false;
    }

    // Step 2: Must select a valid amount
    if (targetStep >= 3) {
      if (!Number.isFinite(amount) || amount < minAmount || amount > maxAmount) {
        setActionError(`Please enter a contribution between ₹${minAmount.toLocaleString("en-IN")} and ₹${maxAmount.toLocaleString("en-IN")}.`);
        return false;
      }
    }

    // Step 3: Must be authenticated via mobile OTP
    if (targetStep >= 4) {
      if (!isAuthenticated || !portalToken) {
        setAuthError("Mobile OTP authentication is required. Please verify your mobile number to proceed.");
        setStep(3);
        return false;
      }
    }

    // Step 4: Profile validation
    if (targetStep >= 5) {
      if (!donorName.trim()) {
        setActionError("Please enter your legal full name for tax accounting records.");
        return false;
      }
      if (!donorEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail.trim())) {
        setActionError("Please enter a valid email address so we can deliver your instant official receipt.");
        return false;
      }
      if (!addressLine.trim()) {
        setActionError("Please enter your postal address for official receipting.");
        return false;
      }
      if (!city.trim()) {
        setActionError("Please enter your city/town.");
        return false;
      }
      if (!district.trim()) {
        setActionError("Please select or enter your district.");
        return false;
      }
      if (!pinCode.trim() || !/^\d{6}$/.test(pinCode.trim())) {
        setActionError("Please enter a valid 6-digit postal PIN code.");
        return false;
      }
      if (donorPan.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(donorPan.trim().toUpperCase())) {
        setActionError("Optional PAN must be exactly 10 characters (e.g. ABCDE1234F).");
        return false;
      }
    }

    // Step 5: Terms accepted
    if (targetStep >= 6) {
      if (!termsAccepted) {
        setActionError("Please confirm your acceptance of MECT contribution terms and statutory disclosures.");
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

  // OTP Handling (Step 3)
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    let target = "";
    if (authChannel === "PHONE") {
      const normalized = normalizePhone(phoneInput);
      if (!/^\+91[6-9]\d{9}$/.test(normalized)) {
        setAuthError("Please enter a valid 10-digit Indian mobile number (e.g. 9853608113).");
        return;
      }
      target = normalized;
    } else {
      const cleanedEmail = (authEmailInput || donorEmail).trim().toLowerCase();
      if (!cleanedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
        setAuthError("Please enter a valid email address (e.g. donor@example.org).");
        return;
      }
      target = cleanedEmail;
    }

    setRequestingOtp(true);
    try {
      const res = await requestPortalOtp({
        channel: authChannel,
        target,
        purpose: "LOGIN",
      });
      setOtpSent(true);
      setOtpCooldown(res.cooldownSeconds || 60);
      if (authChannel === "PHONE") {
        setDonorPhone(target);
      } else {
        setDonorEmail(target);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send verification OTP.";
      setAuthError(msg);
      if (
        authChannel === "PHONE" &&
        (msg.toLowerCase().includes("sms") ||
          msg.toLowerCase().includes("unavailable") ||
          msg.toLowerCase().includes("email otp"))
      ) {
        setAuthChannel("EMAIL");
      }
    } finally {
      setRequestingOtp(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    const cleanedOtp = otpCode.trim();

    if (!/^\d{6}$/.test(cleanedOtp)) {
      setAuthError("Please enter the 6-digit verification code.");
      return;
    }

    const target =
      authChannel === "EMAIL"
        ? (authEmailInput || donorEmail).trim().toLowerCase()
        : normalizePhone(phoneInput);

    setVerifyingOtp(true);
    try {
      const authRes = await verifyPortalOtp({
        channel: authChannel,
        target,
        otpCode: cleanedOtp,
        purpose: "LOGIN",
      });

      await setSessionFromOtp(authRes);
      if (authRes.primaryPhone) setDonorPhone(authRes.primaryPhone);
      if (authRes.primaryEmail) setDonorEmail(authRes.primaryEmail);
      if (authRes.fullName) setDonorName(authRes.fullName);

      // Successfully authenticated -> advance to Step 4
      setStep(4);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Invalid or expired verification code.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Save profile & advance from Step 4 to Step 5
  const handleSaveProfileAndContinue = async () => {
    if (!validateStep(5)) return;
    if (!portalToken) return;

    setSavingProfile(true);
    setActionError(null);
    try {
      await updatePortalProfile(portalToken, {
        fullName: donorName.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        district: district.trim(),
        state: stateName.trim(),
        pinCode: pinCode.trim(),
        country: country.trim() || "India",
        panOptional: donorPan.trim() ? donorPan.trim().toUpperCase() : undefined,
      });
      setStep(5);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update donor profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Cashfree Checkout (Step 6)
  const handleCashfreeCheckout = async () => {
    if (!validateStep(6)) return;
    if (!portalToken) {
      setStep(3);
      setAuthError("Please complete mobile OTP authentication before paying.");
      return;
    }

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
          donorAddress: `${addressLine.trim()}, ${city.trim()}, ${district.trim()}, ${stateName.trim()} - ${pinCode.trim()}`,
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
              : "Online checkout modal could not open. You can retry or use our verified SBI direct transfer option."
          );
        }
      }

      const latest = await verifyCashfreePayment(
        resp.orderId || resp.providerOrderId || resp.donationReference
      ).catch(() => fetchDonationStatus(resp.donationReference));
      setGatewayStatusResult(latest);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to initiate payment session.");
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

  // Submit SBI UTR claim
  const handleSubmitSbiUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(6)) return;
    if (!portalToken) {
      setStep(3);
      setAuthError("Please complete mobile OTP authentication before submitting a UTR claim.");
      return;
    }

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
          donorAddress: `${addressLine.trim()}, ${city.trim()}, ${district.trim()}, ${stateName.trim()} - ${pinCode.trim()}`,
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

  const handleDownloadReceipt = async (receiptNum: string) => {
    if (!portalToken) return;
    setDownloadingReceipt(true);
    try {
      await downloadPortalReceiptPdf(portalToken, receiptNum);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to download PDF receipt.");
    } finally {
      setDownloadingReceipt(false);
    }
  };

  if (loading) {
    return (
      <Card padding="lg" className="border-[#E6E1D8] bg-white text-center py-16 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto mb-3.5" />
        <h3 className="font-serif font-bold text-forest text-lg">Loading MECT Donation Platform</h3>
        <p className="text-xs text-ink-muted mt-1">Connecting to verified statutory programmes and payment channels...</p>
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

  const fullDonorAddress = [addressLine, city, district, stateName, pinCode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      {/* Top Identity / Authentication Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E6E1D8] rounded-xs px-4 py-3.5 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs text-ink">
          {isAuthenticated && portalDashboard?.account ? (
            <>
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-forest">Authenticated Donor: </span>
                <span className="font-mono text-ink">
                  {portalDashboard.account.primaryPhone || portalDashboard.account.primaryEmail}
                </span>
                {donorName && <span className="text-ink-muted ml-1.5">({donorName})</span>}
                <span className="text-emerald-700 font-semibold ml-2">✓ Verified Mobile Identity</span>
              </div>
            </>
          ) : (
            <>
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-forest">Mandatory Mobile OTP Verification: </span>
                <span className="text-ink-muted">
                  Contributions require mobile authentication in Step 3 to ensure auditable statutory accounting.
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={config?.statutoryClaimApproved ? "forest" : "gold"} size="sm">
            {config?.statutoryFinancialYear || "FY 2026-27"} ·{" "}
            {config?.statutoryClaimApproved ? "Statutory Receipt" : "Official Receipt"}
          </Badge>
          {isAuthenticated && (
            <button
              type="button"
              onClick={logout}
              className="text-[11px] font-semibold text-terracotta-dark hover:text-forest underline ml-1"
            >
              Sign out
            </button>
          )}
        </div>
      </div>

      {/* 6-Step Progress Indicator */}
      <nav aria-label="Donation progress" className="bg-white border border-[#E6E1D8] rounded-xs p-3 sm:p-4 shadow-xs">
        <ol className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
          {STEPS.map((s) => {
            const isCompleted = step > s.id || isGatewaySuccess || Boolean(sbiSubmitted);
            const isCurrent = step === s.id && !isGatewaySuccess && !sbiSubmitted;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => !sbiSubmitted && !isGatewaySuccess && goToStep(s.id)}
                  className={`w-full flex flex-col items-center sm:items-start p-2 rounded-xs border text-left transition-all ${isCurrent
                    ? "bg-forest text-white border-forest font-bold shadow-xs"
                    : isCompleted
                      ? "bg-emerald-50 text-emerald-950 border-emerald-200 font-semibold"
                      : "bg-[#FAF7F2]/50 text-ink-muted border-[#E6E1D8] hover:bg-[#FAF7F2]"
                    }`}
                >
                  <div className="flex items-center gap-1.5 w-full">
                    <span
                      className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center shrink-0 font-mono ${isCurrent
                        ? "bg-white text-forest"
                        : isCompleted
                          ? "bg-emerald-700 text-white"
                          : "bg-white border border-[#D4CEBE] text-ink-muted"
                        }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.id}
                    </span>
                    <span className="text-[11px] font-mono hidden sm:inline opacity-80">
                      Step {s.id}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs truncate mt-1 w-full text-center sm:text-left">
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Action / Error Banner */}
      {actionError && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xs p-4 flex items-start gap-3 text-sm text-red-900 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{actionError}</div>
        </div>
      )}

      {/* =========================================================================
          STEP 1: EXPLORE CHARITABLE PROGRAMMES
          ========================================================================= */}
      {step === 1 && (
        <Card padding="lg" className="bg-white border-[#E6E1D8] space-y-6 shadow-xs">
          <div className="border-b border-[#E6E1D8] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-terracotta">
              Step 1 of 6 · Programme Selection
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest mt-0.5">
              Explore Approved Charitable Programmes
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              Every rupee donated to MECT is allocated strictly according to statutory trust provisions. Choose the specific initiative you wish to sponsor, or contribute to our General Community Welfare fund.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programmes.map((prog) => (
              <DonationProgrammeCard
                key={prog.code}
                programme={prog}
                selected={prog.code === selectedCode}
                onSelect={(code) => setSelectedCode(code)}
                onPresetSelect={(preset) => {
                  setAmount(preset);
                  setCustomAmountStr(String(preset));
                  goToStep(2);
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E6E1D8]">
            <span className="text-xs text-ink-muted">
              Selected: <strong className="text-forest">{selectedProgramme?.name}</strong>
            </span>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => goToStep(2)}
              className="shadow-sm"
            >
              <span>Continue to Contribution Amount</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* =========================================================================
          STEP 2: SELECT CONTRIBUTION AMOUNT & FREQUENCY
          ========================================================================= */}
      {step === 2 && (
        <Card padding="lg" className="bg-white border-[#E6E1D8] space-y-6 shadow-xs">
          <div className="border-b border-[#E6E1D8] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-terracotta">
              Step 2 of 6 · Contribution Sizing
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest mt-0.5">
              Choose Contribution Amount &amp; Frequency
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Supporting: <strong className="text-forest">{selectedProgramme?.name}</strong>. Permitted single contribution: ₹
              {minAmount.toLocaleString("en-IN")} – ₹{maxAmount.toLocaleString("en-IN")}.
            </p>
          </div>

          {/* Frequency Toggle */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-forest">
              Contribution Frequency
            </label>
            <div className="grid grid-cols-2 max-w-sm gap-2">
              <button
                type="button"
                onClick={() => setFrequency("ONE_TIME")}
                className={`py-2.5 px-4 rounded-xs border text-xs font-bold transition-colors ${frequency === "ONE_TIME"
                  ? "bg-forest text-white border-forest shadow-xs"
                  : "bg-[#FAF7F2] text-forest border-[#E6E1D8] hover:border-forest/50"
                  }`}
              >
                One-Time Gift
              </button>
              <button
                type="button"
                onClick={() => setFrequency("MONTHLY")}
                className={`py-2.5 px-4 rounded-xs border text-xs font-bold transition-colors ${frequency === "MONTHLY"
                  ? "bg-forest text-white border-forest shadow-xs"
                  : "bg-[#FAF7F2] text-forest border-[#E6E1D8] hover:border-forest/50"
                  }`}
              >
                Monthly Commitment
              </button>
            </div>
            {frequency === "MONTHLY" && (
              <p className="text-[11px] text-terracotta-dark font-medium mt-1">
                Monthly commitments help us plan ongoing scholarships and seasonal kiosks in advance.
              </p>
            )}
          </div>

          {/* Amount Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-forest">
              Select Preset Amount (INR)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
                    className={`py-3.5 px-4 rounded-xs border font-mono font-bold text-base transition-all duration-150 cursor-pointer ${active
                      ? "bg-forest text-white border-forest shadow-sm scale-[1.02]"
                      : "bg-[#FAF7F2] text-forest border-[#E6E1D8] hover:border-forest/60 hover:bg-[#FAF7F2]/80"
                      }`}
                  >
                    ₹{val.toLocaleString("en-IN")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="max-w-md space-y-1.5 pt-2">
            <label htmlFor="custom-amount-input" className="block text-xs font-bold uppercase tracking-wider text-forest">
              Or Enter Custom Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-ink-muted">
                ₹
              </span>
              <Input
                id="custom-amount-input"
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
                className="pl-8 font-mono text-lg font-bold"
                placeholder="1000"
              />
            </div>
            <p className="text-[11px] text-ink-muted">
              Minimum ₹{minAmount.toLocaleString("en-IN")} · Maximum ₹{maxAmount.toLocaleString("en-IN")}
            </p>
          </div>

          {/* Allocation Transparency Callout */}
          <div className="p-4 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8] text-xs text-ink space-y-1">
            <div className="font-bold text-forest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-terracotta" />
              <span>Direct Institutional Allocation Guarantee</span>
            </div>
            <p className="text-ink-muted leading-relaxed">
              100% of your voluntary contribution of <strong>₹{amount.toLocaleString("en-IN")}</strong> is credited directly to <strong>{selectedProgramme?.name}</strong>. No middleman deductions or administrative skimming.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E6E1D8]">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Programmes</span>
            </Button>
            <Button type="button" variant="primary" size="lg" onClick={() => goToStep(3)}>
              <span>Continue to Donor Verification</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* =========================================================================
          STEP 3: MANDATORY DONOR OTP AUTHENTICATION
          ========================================================================= */}
      {step === 3 && (
        <Card padding="lg" className="bg-white border-[#E6E1D8] space-y-6 shadow-xs">
          <div className="border-b border-[#E6E1D8] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-terracotta">
              Step 3 of 6 · Mandatory Security Verification
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest mt-0.5">
              Donor Authentication
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              To safeguard trust funds and comply with statutory donor verification mandates, every contribution must be authenticated via Mobile or Email OTP.
            </p>
          </div>

          {authError && (
            <div role="alert" className="p-4 rounded-xs bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{authError}</div>
            </div>
          )}

          {/* Scenario A: Already Authenticated */}
          {isAuthenticated && portalDashboard?.account ? (
            <div className="p-5 rounded-xs bg-emerald-50/60 border border-emerald-300 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-emerald-950 text-base">
                    Donor Identity Verified &amp; Active
                  </h3>
                  <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                    You are logged in as{" "}
                    <strong className="font-mono">
                      {portalDashboard.account.primaryPhone || portalDashboard.account.primaryEmail}
                    </strong>
                    . This contribution of <strong>₹{amount.toLocaleString("en-IN")}</strong> will automatically generate an official cryptographic PDF receipt linked directly to your Donor Portal.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => goToStep(4)}
                  className="bg-emerald-800 hover:bg-emerald-900"
                >
                  <span>Continue to Donor Profile</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    await logout();
                    setOtpSent(false);
                    setPhoneInput("");
                    setAuthEmailInput("");
                    setOtpCode("");
                  }}
                  className="text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Use Another Account</span>
                </Button>
              </div>
            </div>
          ) : (
            /* Scenario B: Not Authenticated -> Mobile / Email OTP Form */
            <div className="max-w-md space-y-5">
              {!otpSent ? (
                <div className="space-y-4">
                  {/* Channel Switcher Tabs */}
                  <div className="grid grid-cols-2 p-1 bg-[#FAF7F2] border border-[#E6E1D8] rounded-xs text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthChannel("PHONE");
                        setAuthError(null);
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xs transition-colors ${authChannel === "PHONE"
                        ? "bg-white text-forest shadow-xs font-bold border border-[#E6E1D8]"
                        : "text-ink-muted hover:text-forest"
                        }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Mobile OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthChannel("EMAIL");
                        setAuthError(null);
                      }}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xs transition-colors ${authChannel === "EMAIL"
                        ? "bg-white text-forest shadow-xs font-bold border border-[#E6E1D8]"
                        : "text-ink-muted hover:text-forest"
                        }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email OTP</span>
                    </button>
                  </div>

                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    {authChannel === "PHONE" ? (
                      <div>
                        <label htmlFor="donor-mobile-input" className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                          Enter Your 10-Digit Mobile Number
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="h-11 px-3.5 bg-[#FAF7F2] border border-[#E6E1D8] rounded-xs font-mono font-bold text-sm text-forest flex items-center shrink-0">
                            +91 (India)
                          </div>
                          <Input
                            id="donor-mobile-input"
                            type="tel"
                            maxLength={10}
                            value={phoneInput}
                            onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ""))}
                            placeholder="9853608113"
                            className="font-mono text-base font-bold flex-1"
                            autoFocus
                            required
                          />
                        </div>
                        <p className="text-[11px] text-ink-muted mt-1.5">
                          We will send a 6-digit one-time password (OTP) via SMS to verify your donor identity.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="donor-email-auth-input" className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                          Enter Your Email Address
                        </label>
                        <div className="relative">
                          <Input
                            id="donor-email-auth-input"
                            type="email"
                            value={authEmailInput || donorEmail}
                            onChange={(e) => {
                              setAuthEmailInput(e.target.value);
                              setDonorEmail(e.target.value);
                            }}
                            placeholder="donor@example.org"
                            className="font-mono text-base font-medium pl-10"
                            autoFocus
                            required
                          />
                          <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-ink-muted mt-1.5">
                          We will dispatch a 6-digit verification code directly to your email inbox.
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={
                        requestingOtp ||
                        (authChannel === "PHONE"
                          ? phoneInput.length < 10
                          : !(authEmailInput || donorEmail).trim())
                      }
                      className="w-full"
                    >
                      {requestingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span>Sending Verification Code...</span>
                        </>
                      ) : (
                        <>
                          {authChannel === "PHONE" ? (
                            <Phone className="w-4 h-4 mr-2" />
                          ) : (
                            <Mail className="w-4 h-4 mr-2" />
                          )}
                          <span>Send {authChannel === "PHONE" ? "Mobile" : "Email"} Verification Code</span>
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              ) : (
                /* OTP Input Form */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3.5 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                        OTP Sent To
                      </span>
                      <span className="font-mono font-bold text-forest text-sm">
                        {authChannel === "EMAIL"
                          ? (authEmailInput || donorEmail).trim().toLowerCase()
                          : normalizePhone(phoneInput)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode("");
                        setAuthError(null);
                      }}
                      className="text-xs text-terracotta-dark hover:text-forest font-semibold underline"
                    >
                      Change {authChannel === "EMAIL" ? "Email" : "Number"}
                    </button>
                  </div>

                  <div>
                    <label htmlFor="otp-digit-input" className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                      Enter 6-Digit Verification Code
                    </label>
                    <Input
                      id="otp-digit-input"
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setOtpCode(val);
                        if (val.length === 6) {
                          // Auto submit on 6 digits
                          setTimeout(() => {
                            const btn = document.getElementById("submit-otp-button");
                            btn?.click();
                          }, 100);
                        }
                      }}
                      placeholder="• • • • • •"
                      className="font-mono text-center text-2xl tracking-[0.5em] font-bold h-13"
                      autoFocus
                      required
                    />
                  </div>

                  <Button
                    id="submit-otp-button"
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={verifyingOtp || otpCode.length !== 6}
                    className="w-full"
                  >
                    {verifyingOtp ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2 stroke-[3]" />
                        <span>Verify &amp; Continue</span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-ink-muted">Didn&apos;t receive code?</span>
                    {otpCooldown > 0 ? (
                      <span className="font-mono text-ink-muted">Resend in {otpCooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={requestingOtp}
                        className="text-terracotta-dark font-bold hover:text-forest underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Dedicated Sign-In & Registration Quick Links */}
              <div className="pt-3 border-t border-[#E6E1D8] flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
                <span>Prefer using your registered account?</span>
                <div className="flex items-center gap-2 font-semibold">
                  <Link
                    href={`/login?next=${encodeURIComponent(`/donate?programme=${selectedCode}&amount=${amount}`)}`}
                    className="text-terracotta-dark hover:underline"
                  >
                    Sign In &rarr;
                  </Link>
                  <span className="text-ink-muted/50">&bull;</span>
                  <Link
                    href={`/register?next=${encodeURIComponent(`/donate?programme=${selectedCode}&amount=${amount}`)}`}
                    className="text-forest hover:underline"
                  >
                    Create Account &rarr;
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-[#E6E1D8]">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Amount</span>
            </Button>
            {isAuthenticated && (
              <Button type="button" variant="primary" size="lg" onClick={() => goToStep(4)}>
                <span>Continue to Profile</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* =========================================================================
          STEP 4: DONOR PROFILE & TAX INFORMATION
          ========================================================================= */}
      {step === 4 && (
        <Card padding="lg" className="bg-white border-[#E6E1D8] space-y-6 shadow-xs">
          <div className="border-b border-[#E6E1D8] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-terracotta">
              Step 4 of 6 · Donor Profile &amp; Statutory Receipting
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest mt-0.5">
              Donor Information &amp; Address
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              Under Indian Income-tax Act provisions, official donation receipts require legal name, postal address, and contact details. This data is securely preserved for statutory tax filings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="donor-legal-name" className="block text-xs font-bold text-forest mb-1">
                Legal Full Name <span className="text-red-600">*</span>
              </label>
              <Input
                id="donor-legal-name"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Ramesh Kumar Patel"
                required
              />
              <p className="text-[11px] text-ink-muted mt-1">
                As stated on your official government identification / PAN card.
              </p>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="donor-receipt-email" className="block text-xs font-bold text-forest mb-1">
                Receipt Delivery Email <span className="text-red-600">*</span>
              </label>
              <Input
                id="donor-receipt-email"
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="ramesh.patel@example.org"
                required
              />
              <p className="text-[11px] text-ink-muted mt-1">
                Your computer-signed PDF receipt will be instantly dispatched here.
              </p>
            </div>

            {/* Verified Phone or Optional Phone */}
            <div>
              <label htmlFor="donor-phone-input" className="block text-xs font-bold text-forest mb-1">
                Mobile Number{" "}
                {donorPhone ? (
                  <span className="text-emerald-700 font-semibold">(Verified ✓)</span>
                ) : (
                  <span className="text-ink-muted font-normal">(Optional)</span>
                )}
              </label>
              <Input
                id="donor-phone-input"
                type="tel"
                value={donorPhone || phoneInput}
                disabled={Boolean(donorPhone && authChannel === "PHONE")}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhoneInput(val);
                  if (val.length === 10) setDonorPhone(`+91${val}`);
                }}
                placeholder="9853608113"
                className={`font-mono text-forest ${donorPhone && authChannel === "PHONE" ? "bg-[#FAF7F2] cursor-not-allowed" : ""
                  }`}
              />
              <p className="text-[11px] text-ink-muted mt-1">
                {donorPhone && authChannel === "PHONE"
                  ? "Authenticated via 6-digit OTP in Step 3."
                  : "Enter a 10-digit mobile number for statutory updates and SMS receipt confirmation."}
              </p>
            </div>

            {/* Optional PAN */}
            <div>
              <label htmlFor="donor-pan-field" className="block text-xs font-bold text-forest mb-1">
                Permanent Account Number (PAN) <span className="text-ink-muted font-normal">(Optional)</span>
              </label>
              <Input
                id="donor-pan-field"
                value={donorPan}
                onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                maxLength={10}
                placeholder="ABCDE1234F"
                className="font-mono uppercase"
              />
              <p className="text-[11px] text-ink-muted mt-1">
                Optional identifier for statutory audit and accounting records.
              </p>
            </div>

            {/* Street Address */}
            <div className="md:col-span-2">
              <label htmlFor="donor-street-address" className="block text-xs font-bold text-forest mb-1">
                Postal Address / Locality <span className="text-red-600">*</span>
              </label>
              <Input
                id="donor-street-address"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="House No., Street Name, Landmark / Village"
                required
              />
            </div>

            {/* City / Town */}
            <div>
              <label htmlFor="donor-city-field" className="block text-xs font-bold text-forest mb-1">
                City / Town <span className="text-red-600">*</span>
              </label>
              <Input
                id="donor-city-field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Balangir"
                required
              />
            </div>

            {/* District */}
            <div>
              <label htmlFor="donor-district-select" className="block text-xs font-bold text-forest mb-1">
                District <span className="text-red-600">*</span>
              </label>
              <select
                id="donor-district-select"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-white border border-[#D4CEBE] rounded-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest"
                required
              >
                {ODISHA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label htmlFor="donor-state-field" className="block text-xs font-bold text-forest mb-1">
                State <span className="text-red-600">*</span>
              </label>
              <Input
                id="donor-state-field"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="Odisha"
                required
              />
            </div>

            {/* PIN Code */}
            <div>
              <label htmlFor="donor-pincode-field" className="block text-xs font-bold text-forest mb-1">
                PIN Code <span className="text-red-600">*</span>
              </label>
              <Input
                id="donor-pincode-field"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                placeholder="767001"
                className="font-mono"
                required
              />
            </div>

            {/* Dedication Note */}
            <div className="md:col-span-2">
              <label htmlFor="donor-dedication-note" className="block text-xs font-bold text-forest mb-1">
                Dedication / In Memoriam / Purpose Note (Optional)
              </label>
              <Input
                id="donor-dedication-note"
                value={dedicationMessage}
                onChange={(e) => setDedicationMessage(e.target.value)}
                maxLength={250}
                placeholder="e.g. In loving memory of late parents / for student exam fees"
              />
            </div>
          </div>

          {/* Privacy & Consent Options */}
          <div className="space-y-3 pt-3 border-t border-[#E6E1D8] text-xs text-ink">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="mt-0.5 accent-forest"
              />
              <span>
                Display my public acknowledgement as <strong>Anonymous Donor</strong> on the public wall (your statutory identity is securely retained for tax and audit purposes).
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={communicationConsent}
                onChange={(e) => setCommunicationConsent(e.target.checked)}
                className="mt-0.5 accent-forest"
              />
              <span>
                I consent to receive electronic donation receipts and programme impact reports from MECT in accordance with the Trust Privacy Policy.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E6E1D8]">
            <Button type="button" variant="outline" onClick={() => setStep(3)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Verification</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={savingProfile}
              onClick={handleSaveProfileAndContinue}
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>Review Contribution</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* =========================================================================
          STEP 5: REVIEW & STATUTORY DISCLOSURE
          ========================================================================= */}
      {step === 5 && (
        <Card padding="lg" className="bg-white border-[#E6E1D8] space-y-6 shadow-xs">
          <div className="border-b border-[#E6E1D8] pb-4">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-terracotta">
              Step 5 of 6 · Review &amp; Statutory Disclosures
            </span>
            <h2 className="font-serif text-2xl font-bold text-forest mt-0.5">
              Confirm Contribution Details
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Please review your contribution summary and statutory tax disclosures before proceeding to payment.
            </p>
          </div>

          {/* Breakdown Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF7F2] border border-[#E6E1D8] rounded-xs p-5">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Contribution Allocation
              </span>
              <div className="font-serif font-bold text-forest text-lg">
                {selectedProgramme?.name}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-bold text-3xl text-terracotta-dark">
                  ₹{amount.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-ink-muted">
                  ({frequency === "MONTHLY" ? "Monthly Commitment" : "One-Time Contribution"})
                </span>
              </div>
              {selectedProgramme?.code === "HANUMAN_MURTI" ? (
                <Badge variant="gold" size="sm">Segregated Sub-Ledger Guarantee</Badge>
              ) : (
                <Badge variant="forest" size="sm">100% Direct Programme Allocation</Badge>
              )}
            </div>

            <div className="space-y-1.5 text-xs border-t md:border-t-0 md:border-l border-[#E6E1D8] pt-3 md:pt-0 md:pl-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Donor Profile
              </span>
              <div>
                <strong className="text-forest text-sm">{donorName}</strong>{" "}
                {anonymous && <span className="text-ink-muted italic">(Publicly Anonymous)</span>}
              </div>
              <div className="text-ink font-mono">{donorPhone || phoneInput}</div>
              <div className="text-ink">{donorEmail}</div>
              <div className="text-ink-muted leading-relaxed">{fullDonorAddress}</div>
              {donorPan ? (
                <div className="font-mono text-forest font-semibold mt-1">
                  PAN: {donorPan} (Recorded on Receipt)
                </div>
              ) : (
                <div className="text-ink-muted mt-1">PAN: Not provided (General Receipt)</div>
              )}
              {dedicationMessage && (
                <div className="italic text-ink-muted mt-1 border-t border-[#E6E1D8] pt-1">
                  &ldquo;{dedicationMessage}&rdquo;
                </div>
              )}
            </div>
          </div>

          {/* Statutory Tax Disclosure Box */}
          <div className="p-4 rounded-xs bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>Statutory Compliance &amp; Legal Disclosure</span>
            </div>
            <p className="leading-relaxed">
              Mahaveer Educational &amp; Charitable Trust (MECT) holds statutory registration under Section 12A (URN:{" "}
              <strong className="font-mono">AADTM5474FE20231</strong>) and historical Section 80G order (URN:{" "}
              <strong className="font-mono">AADTM5474FF20241</strong>) with Trust PAN{" "}
              <strong className="font-mono">AADTM5474F</strong>. Tax treatment of contributions is subject to applicable law and confirmation of the Trust&apos;s current statutory eligibility.
            </p>
            <p className="text-[11px] text-amber-900/90 font-mono">
              Trust Deed Reg: No. 41042300063 / 2023, Balangir, Odisha.
            </p>
          </div>

          {/* Terms Acceptance */}
          <label className="flex items-start gap-2.5 p-3 rounded-xs border border-[#E6E1D8] bg-[#FAF7F2]/60 text-xs text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 accent-forest"
            />
            <span className="leading-relaxed">
              I confirm that this voluntary contribution is made exclusively from genuine domestic Indian bank funds, in compliance with the Indian Trusts Act and applicable taxation laws. I accept MECT&apos;s published charitable objectives and terms of donation.
            </span>
          </label>

          <div className="flex items-center justify-between pt-3 border-t border-[#E6E1D8]">
            <Button type="button" variant="outline" onClick={() => setStep(4)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Edit Details</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={!termsAccepted}
              onClick={() => goToStep(6)}
              className="shadow-sm"
            >
              <Lock className="w-4 h-4 mr-2" />
              <span>Proceed to Payment (₹{amount.toLocaleString("en-IN")})</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* =========================================================================
          STEP 6: SECURE PAYMENT & DIGITAL RECEIPT
          ========================================================================= */}
      {step === 6 && (
        <div className="space-y-6">
          {/* 1. Verified Success Screen (Instant Official Receipt) */}
          {isGatewaySuccess && gatewayStatusResult && (
            <Card padding="lg" className="bg-emerald-50/70 border-emerald-300 space-y-5 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl font-bold text-emerald-950">
                    Thank You — Contribution Verified
                  </h2>
                  <p className="text-sm text-emerald-900 leading-relaxed">
                    Your contribution of <strong>₹{gatewayStatusResult.amount.toLocaleString("en-IN")}</strong> to{" "}
                    <strong>{gatewayStatusResult.programmeName}</strong> has been successfully reconciled and settled.
                  </p>
                </div>
              </div>

              {/* Receipt Details Box */}
              <div className="p-4 rounded-xs bg-white border border-emerald-200 text-xs font-mono space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                  <span className="text-emerald-900">
                    Official Receipt: <strong>{gatewayStatusResult.receiptNumber || "Generated"}</strong>
                  </span>
                  <Badge variant="forest" size="sm">Cryptographic SHA-256 Verified</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-ink">
                  <div>Donation Reference: <strong>{gatewayStatusResult.donationReference}</strong></div>
                  <div>Settled At: <strong>{gatewayStatusResult.confirmedAt ? new Date(gatewayStatusResult.confirmedAt).toLocaleString("en-IN") : "Just now"}</strong></div>
                  <div>Payment Method: <strong>{gatewayStatusResult.paymentMethod}</strong></div>
                  <div>Donor Name: <strong>{donorName}</strong></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {gatewayStatusResult.receiptNumber && (
                  <Button
                    type="button"
                    variant="primary"
                    disabled={downloadingReceipt}
                    onClick={() => handleDownloadReceipt(gatewayStatusResult.receiptNumber!)}
                    className="bg-emerald-800 hover:bg-emerald-900"
                  >
                    {downloadingReceipt ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Downloading PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        <span>Download Official PDF Receipt</span>
                      </>
                    )}
                  </Button>
                )}
                <Link href="/portal/dashboard">
                  <Button variant="outline">Go to My Donor Dashboard</Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setGatewayStatusResult(null);
                    setInitiated(null);
                    setStep(1);
                  }}
                >
                  Make Another Contribution
                </Button>
              </div>
            </Card>
          )}

          {/* 2. SBI UTR Submitted Screen */}
          {sbiSubmitted && (
            <Card padding="lg" className="bg-amber-50/80 border-amber-300 space-y-5 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-700 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-2xl font-bold text-amber-950">
                      Claim Received
                    </h2>
                    <Badge variant="gold" size="sm">UNVERIFIED</Badge>
                  </div>
                  <p className="text-sm text-amber-900 mt-1 leading-relaxed">
                    Claim received. Reference: {sbiSubmitted.claimReference}. The Trust will check your transfer against its bank records before issuing a receipt.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-white/90 border border-amber-200 rounded-xs p-3.5 font-mono">
                <div>Claim Ref: <strong className="text-amber-950">{sbiSubmitted.claimReference}</strong></div>
                <div>Donation Ref: <strong className="text-amber-950">{sbiSubmitted.donationReference}</strong></div>
                <div>UTR: <strong className="text-amber-950">{sbiSubmitted.utrNormalized}</strong></div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/portal/dashboard">
                  <Button variant="primary" className="bg-amber-800 hover:bg-amber-900">
                    Track Claim in Donor Dashboard
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSbiSubmitted(null);
                    setStep(1);
                  }}
                >
                  Make Another Contribution
                </Button>
              </div>
            </Card>
          )}

          {/* 3. Reconciling / Pending Gateway State */}
          {!isGatewaySuccess && !sbiSubmitted && isGatewayPending && gatewayStatusResult && (
            <Card padding="lg" className="bg-blue-50/70 border-blue-200 space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-bold text-blue-950 text-lg">
                    Payment Processing — Reconciling with Bank
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-900 mt-1">
                    Donation reference <strong className="font-mono">{gatewayStatusResult.donationReference}</strong> is currently{" "}
                    <strong>{gatewayStatusResult.status}</strong>. Please do not initiate a double transfer.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="primary" onClick={handleRefreshGatewayStatus} disabled={refreshingStatus}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshingStatus ? "animate-spin" : ""}`} />
                  <span>{refreshingStatus ? "Reconciling..." : "Check Status Again"}</span>
                </Button>
              </div>
            </Card>
          )}

          {/* 4. Active Payment Channel Interface */}
          {!isGatewaySuccess && !sbiSubmitted && (
            <Card padding="lg" className="bg-white border-[#E6E1D8] space-y-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E1D8] pb-4">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-terracotta">
                    Step 6 of 6 · Payment Completion
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-forest mt-0.5">
                    Complete Contribution (₹{amount.toLocaleString("en-IN")})
                  </h2>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {selectedProgramme?.name} · {donorName} ({donorPhone || phoneInput})
                  </p>
                </div>

                {/* Channel Switcher */}
                <div className="flex gap-2 p-1 bg-[#FAF7F2] rounded-xs border border-[#E6E1D8]">
                  {config?.cashfreeEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentChannel("CASHFREE")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-colors ${paymentChannel === "CASHFREE"
                        ? "bg-forest text-white shadow-xs"
                        : "text-forest hover:bg-white"
                        }`}
                    >
                      Online Gateway
                    </button>
                  )}
                  {config?.sbiQrEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentChannel("SBI_DIRECT")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-colors ${paymentChannel === "SBI_DIRECT"
                        ? "bg-forest text-white shadow-xs"
                        : "text-forest hover:bg-white"
                        }`}
                    >
                      SBI Direct Bank Transfer / UTR
                    </button>
                  )}
                </div>
              </div>

              {/* PAYMENT CHANNEL 1: CASHFREE GATEWAY */}
              {paymentChannel === "CASHFREE" && config?.cashfreeEnabled && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8] space-y-2 text-xs text-ink">
                    <div className="font-bold text-forest text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-terracotta" />
                      <span>Instant Gateway Checkout (Cards, UPI QR, NetBanking)</span>
                    </div>
                    <p className="text-ink-muted leading-relaxed">
                      Secured by 256-bit TLS encryption. Upon successful payment verification, your official serialized receipt with cryptographic SHA-256 seal is generated immediately.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setStep(5)}>
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      <span>Back to Review</span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      disabled={submitting}
                      onClick={handleCashfreeCheckout}
                      className="shadow-sm"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span>Opening Secure Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-2 fill-current" />
                          <span>Pay ₹{amount.toLocaleString("en-IN")} via Gateway</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* PAYMENT CHANNEL 2: STATE BANK OF INDIA DIRECT TRANSFER */}
              {(paymentChannel === "SBI_DIRECT" || !config?.cashfreeEnabled) && config?.sbiQrEnabled && (
                <div className="space-y-6">
                  {/* Official SBI Bank Coordinates */}
                  <div className="p-5 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8] space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-forest" />
                        <h3 className="font-serif font-bold text-forest text-base">
                          State Bank of India — Official Trust Account
                        </h3>
                      </div>
                      <Badge variant="forest" size="sm">Verified Primary Account</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {/* Account Number */}
                      <div className="p-3 rounded-xs bg-white border border-[#E6E1D8] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                          Account Number
                        </span>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono font-bold text-forest text-sm">
                            {config.sbiAccountNumber || MECT_ORG.bank.accountNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyValue("acc", config.sbiAccountNumber || MECT_ORG.bank.accountNumber)}
                            className="text-terracotta hover:text-forest p-1"
                            title="Copy Account Number"
                          >
                            {copiedKey === "acc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* IFSC Code */}
                      <div className="p-3 rounded-xs bg-white border border-[#E6E1D8] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                          IFSC Code
                        </span>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono font-bold text-forest text-sm">
                            {config.sbiIfsc || MECT_ORG.bank.ifsc}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyValue("ifsc", config.sbiIfsc || MECT_ORG.bank.ifsc)}
                            className="text-terracotta hover:text-forest p-1"
                            title="Copy IFSC Code"
                          >
                            {copiedKey === "ifsc" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* UPI ID */}
                      <div className="p-3 rounded-xs bg-white border border-[#E6E1D8] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                          UPI VPA
                        </span>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono font-bold text-forest text-sm">
                            {config.sbiUpiId || MECT_ORG.bank.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyValue("upi", config.sbiUpiId || MECT_ORG.bank.upiId)}
                            className="text-terracotta hover:text-forest p-1"
                            title="Copy UPI ID"
                          >
                            {copiedKey === "upi" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Branch Name */}
                      <div className="p-3 rounded-xs bg-white border border-[#E6E1D8] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                          Branch
                        </span>
                        <div className="font-medium text-forest truncate text-xs">
                          {config.sbiBranch || MECT_ORG.bank.branch}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-ink-muted leading-relaxed">
                      Account Name: <strong>{config.sbiAccountName || MECT_ORG.bank.accountHolder}</strong> · Transfer using Google Pay, PhonePe, Paytm, or your banking app. Once completed, enter the 12-digit UTR reference below.
                    </p>
                  </div>

                  {/* Manual UTR Submission Form */}
                  <form onSubmit={handleSubmitSbiUtr} className="space-y-4 pt-2">
                    <div className="border-b border-[#E6E1D8] pb-2">
                      <h3 className="font-serif font-bold text-forest text-base">
                        Record Bank UTR / Transaction Reference
                      </h3>
                      <p className="text-xs text-ink-muted mt-0.5">
                        Your UTR enables our accounts desk to match your payment in our daily SBI bank statement and issue your official tax receipt.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* UTR Reference Input */}
                      <div>
                        <label htmlFor="sbi-utr-input" className="block text-xs font-bold text-forest mb-1">
                          12-Digit UTR / Transaction Reference <span className="text-red-600">*</span>
                        </label>
                        <Input
                          id="sbi-utr-input"
                          value={utrReference}
                          onChange={(e) => setUtrReference(e.target.value.toUpperCase())}
                          placeholder="e.g. 412345678901 or SBIN12345678"
                          className="font-mono text-base font-bold uppercase"
                          required
                        />
                        <p className="text-[11px] text-ink-muted mt-1">
                          Found on your UPI confirmation screen or bank SMS.
                        </p>
                      </div>

                      {/* Transfer Date */}
                      <div>
                        <label htmlFor="sbi-date-input" className="block text-xs font-bold text-forest mb-1">
                          Date of Transfer <span className="text-red-600">*</span>
                        </label>
                        <Input
                          id="sbi-date-input"
                          type="date"
                          value={transferDate}
                          onChange={(e) => setTransferDate(e.target.value)}
                          max={new Date().toISOString().slice(0, 10)}
                          required
                        />
                      </div>

                      {/* Payment Mode */}
                      <div>
                        <label htmlFor="sbi-mode-input" className="block text-xs font-bold text-forest mb-1">
                          Payment Mode
                        </label>
                        <select
                          id="sbi-mode-input"
                          value={paymentModeNote}
                          onChange={(e) => setPaymentModeNote(e.target.value)}
                          className="w-full h-10 px-3 text-sm bg-white border border-[#D4CEBE] rounded-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest"
                        >
                          <option value="UPI App Transfer">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                          <option value="NEFT">NEFT (National Electronic Funds Transfer)</option>
                          <option value="RTGS">RTGS (Real Time Gross Settlement)</option>
                          <option value="IMPS">IMPS (Immediate Payment Service)</option>
                          <option value="SBI Branch Deposit">Direct Cash / Cheque Deposit at Branch</option>
                        </select>
                      </div>

                      {/* Remitter / Note */}
                      <div>
                        <label htmlFor="sbi-proof-input" className="block text-xs font-bold text-forest mb-1">
                          Remitter Bank / Note (Optional)
                        </label>
                        <Input
                          id="sbi-proof-input"
                          value={proofSummary}
                          onChange={(e) => setProofSummary(e.target.value)}
                          placeholder="e.g. Transferred from HDFC A/c ending 1234"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#E6E1D8]">
                      <Button type="button" variant="outline" onClick={() => setStep(5)}>
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        <span>Back to Review</span>
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={submitting || !utrReference.trim()}
                        className="shadow-sm"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            <span>Submitting Claim...</span>
                          </>
                        ) : (
                          <>
                            <Landmark className="w-4 h-4 mr-2" />
                            <span>Submit SBI Bank Transfer Reference</span>
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
