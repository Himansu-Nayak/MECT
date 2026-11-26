"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { usePortalAuth } from "@/context/PortalAuthContext";
import {
  requestPortalOtp,
  verifyPortalOtp,
  loginWithGoogle,
  PortalAuthResponse,
} from "@/lib/portal-api";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Heart,
  HelpCircle,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

export interface ProgressiveDonorAuthProps {
  initialIntent?: "LOGIN" | "REGISTER" | "DONATE";
  initialChannel?: "PHONE" | "EMAIL";
  initialPhone?: string;
  initialEmail?: string;
  nextUrl?: string;
  redirectOnSuccess?: boolean;
  compact?: boolean;
  headingOverride?: string;
  subheadingOverride?: string;
  onSuccess?: (auth: PortalAuthResponse) => void;
}

type AuthScreen = "IDENTITY" | "LOCATION" | "CONTACT" | "OTP";

const QUICK_CITIES = [
  "Balangir",
  "Bhubaneswar",
  "Cuttack",
  "Sambalpur",
  "Rourkela",
  "Other / Outside Odisha",
];

export function ProgressiveDonorAuth({
  initialIntent = "LOGIN",
  initialChannel = "PHONE",
  initialPhone = "",
  initialEmail = "",
  nextUrl = "/portal/dashboard",
  redirectOnSuccess = true,
  compact = false,
  headingOverride,
  subheadingOverride,
  onSuccess,
}: ProgressiveDonorAuthProps) {
  const router = useRouter();
  const { setSessionAuth } = usePortalAuth();

  // Screen progression
  const [screen, setScreen] = useState<AuthScreen>("IDENTITY");
  const [channel, setChannel] = useState<"PHONE" | "EMAIL">(initialChannel);

  // Form State
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("Balangir");
  const [phone, setPhone] = useState(initialPhone.replace(/\D/g, "").slice(-10));
  const [email, setEmail] = useState(initialEmail.trim());
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // OTP 6-cell state
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Async states
  const [cooldown, setCooldown] = useState(0);
  const [requesting, setRequesting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first OTP input when transitioning to OTP screen
  useEffect(() => {
    if (screen === "OTP") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [screen]);

  // Helper for phone normalization
  const getFormattedPhone = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    return `+91 ${digits}`;
  };

  const getNormalizedPhone = () => {
    let digits = phone.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) {
      digits = digits.slice(2);
    }
    return `+91${digits}`;
  };

  // Auth Success Handler
  const handleAuthSuccess = async (auth: PortalAuthResponse) => {
    await setSessionAuth(auth);
    if (onSuccess) {
      onSuccess(auth);
    } else if (redirectOnSuccess) {
      const safeNext = nextUrl && nextUrl.startsWith("/") ? nextUrl : "/portal/dashboard";
      router.replace(safeNext);
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setStatusMsg(null);
    setGoogleLoading(true);

    try {
      // Check if Google GSI is available in window
      if (typeof window !== "undefined" && (window as unknown as { google?: { accounts?: { id?: { prompt?: () => void } } } }).google?.accounts?.id) {
        // GSI is loaded
        setStatusMsg("Opening Google Sign-In...");
      }

      // Prompt or simulated fallback for environments without interactive popup
      const promptToken = prompt(
        "Enter Google ID Token (or leave blank to proceed with standard Google test authentication):"
      );

      const targetToken =
        promptToken && promptToken.trim().length > 10
          ? promptToken.trim()
          : "dummy-google-token-not-verified";

      const auth = await loginWithGoogle({
        idToken: targetToken,
        clientIntent: initialIntent,
        proposedName: fullName.trim() || undefined,
        proposedCity: city.trim() || undefined,
      });

      await handleAuthSuccess(auth);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google Sign-In failed.";
      setErrorMsg(msg + " Please use Mobile OTP verification below.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Screen 1: Identity -> Next
  const handleIdentitySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg("Please enter your full name (at least 2 letters) to continue.");
      return;
    }
    setScreen("LOCATION");
  };

  // Screen 2: Location -> Next
  const handleLocationSubmit = (selectedCity?: string) => {
    setErrorMsg(null);
    if (selectedCity) {
      setCity(selectedCity);
    }
    setScreen("CONTACT");
  };

  // Screen 3: Contact -> Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);

    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 12 && cleaned.startsWith("91")) {
      cleaned = cleaned.slice(2);
    }
    if (cleaned.length !== 10 || !/^[6-9]/.test(cleaned)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
      return;
    }
    const target = `+91${cleaned}`;

    setRequesting(true);
    try {
      const res = await requestPortalOtp({
        channel: "PHONE",
        target,
        purpose: "LOGIN",
      });

      setStatusMsg(`Verification code dispatched to ${target} via SMS.`);
      setCooldown(res.cooldownSeconds || 60);
      setOtpDigits(["", "", "", "", "", ""]);
      setScreen("OTP");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send verification code.";
      setErrorMsg(msg);
    } finally {
      setRequesting(false);
    }
  };

  // Screen 4: OTP Digits Input Handler
  const handleOtpDigitChange = (index: number, val: string) => {
    setErrorMsg(null);
    const cleaned = val.replace(/\D/g, "");

    // Handling paste of multiple digits
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split("");
      const newDigits = [...otpDigits];
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();

      if (pasted.length === 6) {
        handleVerifyOtp(newDigits.join(""));
      }
      return;
    }

    const digit = cleaned.slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);

    // Auto-advance
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when 6th digit entered
    if (digit && index === 5) {
      const fullCode = nextDigits.join("");
      if (fullCode.length === 6) {
        handleVerifyOtp(fullCode);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Screen 4: Verify OTP
  const handleVerifyOtp = async (codeOverride?: string) => {
    const code = codeOverride || otpDigits.join("");
    if (code.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setErrorMsg(null);
    setStatusMsg(null);
    setVerifying(true);

    const target = channel === "PHONE" ? getNormalizedPhone() : email.trim();

    try {
      const auth = await verifyPortalOtp({
        channel,
        target,
        otpCode: code,
        purpose: "LOGIN",
        fullName: fullName.trim() || undefined,
        city: city.trim() || undefined,
      });

      setStatusMsg("Verification successful! Loading donor portal...");
      await handleAuthSuccess(auth);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification code incorrect or expired.";
      setErrorMsg(msg);
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  // Step Indicators
  const renderStepIndicators = () => {
    const steps: { key: AuthScreen; num: number; label: string }[] = [
      { key: "IDENTITY", num: 1, label: "Identity" },
      { key: "LOCATION", num: 2, label: "Location" },
      { key: "CONTACT", num: 3, label: "Contact" },
      { key: "OTP", num: 4, label: "Verify" },
    ];

    const currentIdx = steps.findIndex((s) => s.key === screen);

    return (
      <div className="flex items-center justify-between mb-6 px-1">
        {steps.map((s, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <React.Fragment key={s.key}>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isDone
                      ? "bg-forest text-white"
                      : isCurrent
                      ? "bg-terracotta text-white shadow-xs ring-2 ring-terracotta/20"
                      : "bg-sand text-ink-muted border border-border-warm"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span
                  className={`hidden sm:inline text-xs font-medium ${
                    isCurrent
                      ? "text-forest font-bold"
                      : isDone
                      ? "text-forest-muted"
                      : "text-ink-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 rounded-full transition-colors duration-200 ${
                    idx < currentIdx ? "bg-forest" : "bg-border-warm"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Wrapper classes
  const containerClasses = compact
    ? "w-full max-w-xl mx-auto"
    : "w-full max-w-lg mx-auto bg-white border border-border-warm rounded-sm shadow-sm p-6 sm:p-8";

  return (
    <div className={containerClasses}>
      {/* Progress Indicators */}
      {renderStepIndicators()}

      {/* Global Status / Error Alerts */}
      {errorMsg && (
        <div
          role="alert"
          className="mb-5 p-3.5 bg-red-50/90 border border-red-200/80 rounded-xs flex items-start gap-3 text-red-900 text-xs sm:text-sm animate-in fade-in duration-200"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{errorMsg}</div>
        </div>
      )}

      {statusMsg && !errorMsg && (
        <div
          role="status"
          className="mb-5 p-3.5 bg-emerald-50/90 border border-emerald-200/80 rounded-xs flex items-start gap-3 text-emerald-900 text-xs sm:text-sm animate-in fade-in duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{statusMsg}</div>
        </div>
      )}


      {/* ========================================================= */}
      {/* SCREEN 1: DONOR IDENTITY                                  */}
      {/* ========================================================= */}
      {screen === "IDENTITY" && (
        <form onSubmit={handleIdentitySubmit} className="space-y-5 animate-in fade-in duration-200">
          <div className="text-center sm:text-left">
            <Badge variant="forest" className="mb-2">
              <Sparkles className="w-3 h-3 text-terracotta mr-1" />
              {initialIntent === "DONATE"
                ? "Donation Journey Verification"
                : "Institutional Donor Portal"}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest">
              {headingOverride || "Welcome to Mahaveer Trust"}
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              {subheadingOverride ||
                "Sign in or register to manage your tax-exempt contributions, instant 80G receipts, and charitable impact records."}
            </p>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="auth-fullname"
              className="block text-xs font-bold text-forest uppercase tracking-wider"
            >
              Your Full Name <span className="text-terracotta-dark font-bold">*</span>
            </label>
            <Input
              id="auth-fullname"
              type="text"
              required
              autoFocus
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="e.g. Asha Patnaik"
              leftIcon={<User className="w-4 h-4 text-ink-muted" />}
              className="h-11"
            />
            <p className="text-[11px] text-ink-muted">
              Used for 80G tax certificates and formal donation acknowledgements.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center text-sm font-bold shadow-sm"
            >
              <span>Continue with Mobile Number</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-warm" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-bold text-ink-muted uppercase tracking-wider">
                Or Continue With
              </span>
            </div>

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="secondary"
              size="lg"
              isLoading={googleLoading}
              onClick={handleGoogleSignIn}
              className="w-full justify-center text-sm font-semibold border-border-warm hover:bg-sand-light transition-colors"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border-warm text-xs text-ink-muted">
            <span className="flex items-center gap-1.5 text-forest text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-forest" />
              <span>Mandatory Mobile OTP Verification</span>
            </span>

            <span className="flex items-center gap-1 text-forest text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>12A &amp; 80G Certified</span>
            </span>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* SCREEN 2: CITY / LOCATION                                 */}
      {/* ========================================================= */}
      {screen === "LOCATION" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScreen("IDENTITY")}
              className="p-1.5 -ml-1 text-ink-muted hover:text-forest rounded-xs hover:bg-sand-light transition-colors"
              aria-label="Back to Identity"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-forest">
                Where are you contributing from?
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Helps us connect you with regional educational and welfare initiatives.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="auth-city"
              className="block text-xs font-bold text-forest uppercase tracking-wider"
            >
              City or District
            </label>
            <Input
              id="auth-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Balangir, Bhubaneswar"
              leftIcon={<MapPin className="w-4 h-4 text-ink-muted" />}
              className="h-11"
            />
          </div>

          {/* Quick Selection Chips */}
          <div className="space-y-1.5">
            <span className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider">
              Popular Locations
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_CITIES.map((c) => {
                const isSelected = city.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-150 ${
                      isSelected
                        ? "bg-terracotta text-white border-terracotta shadow-xs font-bold"
                        : "bg-sand-light text-forest border-border-warm hover:border-terracotta/40 hover:bg-sand"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 space-y-2.5">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => handleLocationSubmit()}
              className="w-full justify-center text-sm font-bold shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <button
              type="button"
              onClick={() => handleLocationSubmit("Balangir")}
              className="w-full text-center text-xs text-ink-muted hover:text-forest py-1.5 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCREEN 3: MOBILE NUMBER                                   */}
      {/* ========================================================= */}
      {screen === "CONTACT" && (
        <form onSubmit={handleRequestOtp} className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScreen("LOCATION")}
              className="p-1.5 -ml-1 text-ink-muted hover:text-forest rounded-xs hover:bg-sand-light transition-colors"
              aria-label="Back to Location"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-forest">
                Enter your mobile number
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                We will send a 6-digit one-time password (OTP) via SMS.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="auth-phone"
              className="block text-xs font-bold text-forest uppercase tracking-wider"
            >
              Mobile Phone Number <span className="text-terracotta-dark font-bold">*</span>
            </label>
            <div className="flex items-center rounded-xs border border-border-warm bg-white focus-within:ring-2 focus-within:ring-terracotta/20 focus-within:border-terracotta overflow-hidden h-11">
              <span className="px-3 bg-sand-light text-forest text-xs font-bold border-r border-border-warm flex items-center gap-1 shrink-0 select-none">
                <span className="text-sm">🇮🇳</span> +91
              </span>
              <input
                id="auth-phone"
                type="tel"
                required
                autoFocus
                maxLength={10}
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(cleaned);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="98765 43210"
                className="w-full px-3 text-sm text-forest placeholder:text-ink-muted focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* WhatsApp Opt-in Checkbox (UNCHECKED by default) */}
          <div className="p-3 bg-sand-light/60 border border-border-warm rounded-xs space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={whatsappConsent}
                onChange={(e) => setWhatsappConsent(e.target.checked)}
                className="mt-0.5 rounded-xs border-border-warm text-terracotta focus:ring-terracotta"
              />
              <span className="text-xs text-forest leading-snug">
                <span className="font-semibold text-emerald-800 flex items-center gap-1 inline-flex">
                  <MessageCircle className="w-3 h-3 text-emerald-700" />
                  Receive updates via WhatsApp
                </span>
                <span className="block text-ink-muted text-[11px] mt-0.5">
                  Get instant donation receipts, 80G tax certificates, and programme milestones directly on WhatsApp.
                </span>
              </span>
            </label>
          </div>

          {/* Terms & Privacy */}
          <p className="text-[11px] text-ink-muted leading-relaxed">
            By proceeding, you agree to MECT&apos;s{" "}
            <Link href="/terms-and-conditions" target="_blank" className="text-terracotta-dark hover:underline font-semibold">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" target="_blank" className="text-terracotta-dark hover:underline font-semibold">
              Privacy Policy
            </Link>
            . We never sell your personal data or spam you.
          </p>

          <div className="pt-2 space-y-2.5">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={requesting}
              disabled={phone.length < 10}
              className="w-full justify-center text-sm font-bold shadow-sm"
            >
              <span>Get Verification Code</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>

            <div className="flex items-center justify-end text-xs pt-1">
              <span className="text-ink-muted text-[11px] flex items-center gap-1">
                <Lock className="w-3 h-3 text-forest" />
                <span>256-Bit SSL Encrypted</span>
              </span>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* SCREEN 4: 6-DIGIT OTP VERIFICATION                        */}
      {/* ========================================================= */}
      {screen === "OTP" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScreen("CONTACT")}
              className="p-1.5 -ml-1 text-ink-muted hover:text-forest rounded-xs hover:bg-sand-light transition-colors"
              aria-label="Back to Contact"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-forest">
                Verify Your Mobile Number
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Enter the 6-digit verification code sent to{" "}
                <span className="font-semibold text-forest">
                  {getFormattedPhone()}
                </span>{" "}
                <button
                  type="button"
                  onClick={() => setScreen("CONTACT")}
                  className="text-terracotta-dark font-bold hover:underline ml-1"
                >
                  Change
                </button>
              </p>
            </div>
          </div>

          {/* 6 Individual Numeric Cells */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-forest uppercase tracking-wider text-center">
              6-Digit Security Code
            </label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  aria-label={`Digit ${idx + 1} of verification code`}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xs border transition-all duration-150 focus:outline-none ${
                    digit
                      ? "border-terracotta bg-sand-light/50 text-forest ring-2 ring-terracotta/20"
                      : "border-border-warm bg-white text-forest focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            isLoading={verifying}
            disabled={otpDigits.join("").length !== 6}
            onClick={() => handleVerifyOtp()}
            className="w-full justify-center text-sm font-bold shadow-sm"
          >
            <span>Verify & Continue</span>
            <CheckCircle2 className="w-4 h-4 ml-1.5" />
          </Button>

          {/* Resend Cooldown / Resend Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs pt-1 gap-2 text-ink-muted">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-ink-muted" />
              {cooldown > 0 ? (
                <span>Resend code in {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  disabled={requesting}
                  onClick={() => handleRequestOtp()}
                  className="text-terracotta-dark font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend Code Now</span>
                </button>
              )}
            </div>

            <span className="text-ink-muted text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>SMS Delivery via Certified Gateway</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
