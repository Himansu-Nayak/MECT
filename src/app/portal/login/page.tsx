"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { requestPortalOtp, verifyPortalOtp } from "@/lib/portal-api";
import {
  Mail,
  Phone,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Loader2,
} from "lucide-react";

const OTP_LENGTH = 6;

function maskDestination(channel: "EMAIL" | "PHONE", value: string): string {
  const trimmed = value.trim();
  if (channel === "EMAIL") {
    return trimmed;
  }
  const digits = trimmed.replace(/\s+/g, "");
  if (digits.length <= 4) return digits;
  const visibleEnd = digits.slice(-4);
  const visibleStart = digits.startsWith("+") ? digits.slice(0, 3) : "";
  return `${visibleStart}${"•".repeat(Math.max(4, digits.length - visibleStart.length - 4))}${visibleEnd}`;
}

function toFriendlyAuthError(raw: unknown, channel: "EMAIL" | "PHONE", stage: "REQUEST" | "VERIFY"): string {
  const message = raw instanceof Error ? raw.message : "";
  const lower = message.toLowerCase();

  if (!message || lower.includes("failed to fetch") || lower.includes("reach the verification server")) {
    return "Unable to reach the verification service. Please check your connection and try again.";
  }
  if (lower.includes("wait ") && lower.includes("seconds")) {
    return message;
  }
  if (lower.includes("too many")) {
    return "Too many code requests in a short period. Please wait a few minutes and try again.";
  }
  if (stage === "REQUEST") {
    if (channel === "PHONE" && (lower.includes("unavailable") || lower.includes("sms"))) {
      return "Phone SMS verification is currently unavailable. Please select Email verification instead.";
    }
    if (lower.includes("valid email")) {
      return "Your email address appears invalid. Please check and try again.";
    }
    if (lower.includes("valid") && lower.includes("phone")) {
      return "Please enter a valid 10-digit mobile number or country-coded number (e.g. +919876543210).";
    }
    if (lower.includes("temporarily unavailable")) {
      return "Email verification is temporarily unavailable. Please try again shortly.";
    }
    return "We couldn't send your verification code. Please try again.";
  }

  if (lower.includes("expired")) {
    return "Your verification code has expired. Please request a new code.";
  }
  if (lower.includes("already been used")) {
    return "This verification code has already been used. Please request a new code.";
  }
  if (lower.includes("maximum")) {
    return "Maximum verification attempts reached. Please request a new 6-digit code.";
  }
  if (lower.includes("incorrect") || lower.includes("invalid") || lower.includes("no active")) {
    return "That code doesn't match. Please check and try again.";
  }
  return "We couldn't verify your code right now. Please try again.";
}

function PortalLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const { isAuthenticated, isLoading, session, setSessionFromOtp } = usePortalAuth();

  const [channel, setChannel] = useState<"EMAIL" | "PHONE">("EMAIL");
  const [target, setTarget] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [step, setStep] = useState<"REQUEST" | "VERIFY" | "VERIFIED">("REQUEST");

  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [expiresInSeconds, setExpiresInSeconds] = useState(600);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const otpInputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const joinedOtp = otpDigits.join("");

  useEffect(() => {
    if (!isLoading && isAuthenticated && session && step !== "VERIFIED") {
      const safeNext = nextPath && nextPath.startsWith("/") ? nextPath : null;
      if (safeNext) {
        router.replace(safeNext);
      } else if (!session.profileCompleted) {
        router.replace("/portal/welcome");
      } else {
        router.replace("/portal/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, session, nextPath, router, step]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (step === "VERIFY") {
      const timer = setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const validateTarget = (): string | null => {
    const trimmed = target.trim();
    if (!trimmed) {
      return channel === "EMAIL"
        ? "Please enter your email address."
        : "Please enter your mobile number with country code (e.g. +91 98765 43210).";
    }
    if (channel === "EMAIL") {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      if (!emailOk) return "Your email address is invalid.";
    } else {
      const cleaned = trimmed.replace(/[\s\-()]/g, "");
      if (!/^\+?[0-9]{10,15}$/.test(cleaned)) {
        return "Please enter a valid 10 to 15 digit mobile number.";
      }
    }
    return null;
  };

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submitting) return;

    setErrorMessage(null);
    setStatusMessage(null);

    const validationError = validateTarget();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const res = await requestPortalOtp({
        channel,
        target: target.trim(),
        purpose: "LOGIN",
      });
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setStep("VERIFY");
      setCooldown(res.cooldownSeconds || 60);
      setExpiresInSeconds(res.expiresInSeconds || 600);
      setStatusMessage(
        channel === "EMAIL"
          ? "Verification code sent successfully. Please check your inbox."
          : "Verification code sent successfully via SMS."
      );
    } catch (err: unknown) {
      setErrorMessage(toFriendlyAuthError(err, channel, "REQUEST"));
    } finally {
      setSubmitting(false);
    }
  };

  const submitVerify = async (codeToVerify: string) => {
    if (submitting) return;
    setErrorMessage(null);
    setStatusMessage(null);

    if (!/^[0-9]{6}$/.test(codeToVerify)) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setSubmitting(true);
    try {
      const auth = await verifyPortalOtp({
        channel,
        target: target.trim(),
        otpCode: codeToVerify,
        purpose: "LOGIN",
      });
      await setSessionFromOtp(auth);
      setStep("VERIFIED");
      setStatusMessage(
        channel === "EMAIL"
          ? "Your email has been verified successfully."
          : "Your mobile number has been verified successfully."
      );

      const safeNext = nextPath && nextPath.startsWith("/") ? nextPath : null;
      setTimeout(() => {
        if (safeNext) {
          router.push(safeNext);
        } else if (!auth.profileCompleted) {
          router.push("/portal/welcome");
        } else {
          router.push("/portal/dashboard");
        }
      }, 650);
    } catch (err: unknown) {
      setErrorMessage(toFriendlyAuthError(err, channel, "VERIFY"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitVerify(joinedOtp);
  };

  const handleDigitChange = (index: number, rawVal: string) => {
    const cleaned = rawVal.replace(/[^0-9]/g, "");
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = "";
      setOtpDigits(next);
      return;
    }

    // Handle mobile OS SMS/email autofill or multi-character input cleanly
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, OTP_LENGTH).split("");
      const next = Array(OTP_LENGTH).fill("");
      chars.forEach((ch, idx) => {
        next[idx] = ch;
      });
      setOtpDigits(next);
      const focusIdx = Math.min(chars.length, OTP_LENGTH - 1);
      otpInputsRef.current[focusIdx]?.focus();
      return;
    }

    const next = [...otpDigits];
    next[index] = cleaned;
    setOtpDigits(next);
    if (index < OTP_LENGTH - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        const next = [...otpDigits];
        next[index - 1] = "";
        setOtpDigits(next);
        otpInputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, idx) => {
      next[idx] = ch;
    });
    setOtpDigits(next);
    const focusIdx = Math.min(pasted.length - 1, OTP_LENGTH - 1);
    otpInputsRef.current[Math.max(0, focusIdx)]?.focus();
  };

  return (
    <div className="min-h-[82vh] bg-cream py-10 md:py-16">
      <Container className="max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Brand Header & Passwordless Explanation */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-terracotta bg-white shrink-0 shadow-xs">
                <Image
                  src="/images/mect-official-emblem.png"
                  alt="Mahaveer Educational & Charitable Trust Official Emblem"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover scale-[1.06]"
                />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-terracotta-dark">
                  Mahaveer Educational &amp; Charitable Trust
                </p>
                <p className="text-xs text-ink-sand">
                  Supporter &amp; Donor Portal
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-forest leading-tight">
                Welcome to the MECT Community
              </h1>
              <p className="text-sm text-ink-sand leading-relaxed">
                Sign in or create your account securely using your email address or mobile number.
              </p>
            </div>

            <Card padding="md" className="bg-white border border-border-warm space-y-3.5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-terracotta shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-forest">
                    Passwordless Security
                  </h2>
                  <p className="text-xs text-ink-sand mt-0.5 leading-relaxed">
                    Every session is verified with a one-time 6-digit code valid for 10 minutes—never stored in plaintext.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-forest shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-forest">
                    Your Personal Supporter Space
                  </h2>
                  <p className="text-xs text-ink-sand mt-0.5 leading-relaxed">
                    Manage your contact details, communication preferences, and verified contribution receipts in one private portal.
                  </p>
                </div>
              </div>
            </Card>

            <p className="text-xs text-ink-sand">
              Prefer to make an immediate contribution directly?{" "}
              <Link href="/donate" className="font-semibold text-terracotta-dark underline hover:text-forest">
                Visit our Donation Page
              </Link>
              .
            </p>
          </div>

          {/* Primary Authentication Card */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <Card padding="lg" className="bg-white border border-border-warm shadow-sm space-y-6">
              <div className="border-b border-border-warm pb-4 space-y-1">
                <h2 className="text-xl font-serif font-bold text-forest">
                  {step === "REQUEST"
                    ? "Sign In or Create Account"
                    : step === "VERIFY"
                      ? "Enter 6-Digit Verification Code"
                      : "You're Successfully Verified!"}
                </h2>
                <p className="text-xs text-ink-sand">
                  {step === "REQUEST"
                    ? "Choose how you'd like to receive your one-time verification code."
                    : step === "VERIFY"
                      ? "Enter the 6-digit security code below to continue safely."
                      : "Taking you into your MECT portal now."}
                </p>
              </div>

              {step !== "VERIFIED" && (
                <div
                  role="tablist"
                  aria-label="Verification method"
                  className="grid grid-cols-2 gap-2 p-1 bg-cream rounded-xs border border-border-warm"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={channel === "EMAIL"}
                    disabled={submitting}
                    onClick={() => {
                      setChannel("EMAIL");
                      setTarget("");
                      setOtpDigits(Array(OTP_LENGTH).fill(""));
                      setStep("REQUEST");
                      setErrorMessage(null);
                      setStatusMessage(null);
                    }}
                    aria-label="Email verification"
                    className={`min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 text-xs font-bold rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-terracotta whitespace-nowrap ${
                      channel === "EMAIL"
                        ? "bg-forest text-white shadow-xs"
                        : "text-forest hover:bg-sage/45"
                    }`}
                  >
                    <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Email<span className="hidden sm:inline"> verification</span></span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={channel === "PHONE"}
                    aria-label="Phone SMS verification"
                    disabled={submitting}
                    onClick={() => {
                      setChannel("PHONE");
                      setTarget("");
                      setOtpDigits(Array(OTP_LENGTH).fill(""));
                      setStep("REQUEST");
                      setErrorMessage(null);
                      setStatusMessage(null);
                    }}
                    className={`min-h-[44px] flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 text-xs font-bold rounded-xs transition-colors focus-visible:outline-2 focus-visible:outline-terracotta whitespace-nowrap ${
                      channel === "PHONE"
                        ? "bg-forest text-white shadow-xs"
                        : "text-forest hover:bg-sage/45"
                    }`}
                  >
                    <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Phone<span className="hidden sm:inline"> SMS verification</span></span>
                  </button>
                </div>
              )}

              {errorMessage && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xs bg-terracotta/10 border border-terracotta/40 flex items-start gap-2.5 text-xs text-terracotta-dark font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {statusMessage && (
                <div
                  role="status"
                  className="p-3.5 rounded-xs bg-sage/40 border border-forest/25 flex items-start gap-2.5 text-xs text-forest font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {step === "REQUEST" && (
                <form onSubmit={handleRequestOtp} noValidate className="space-y-5">
                  <Input
                    label={channel === "EMAIL" ? "Email Address" : "Mobile Number"}
                    type={channel === "EMAIL" ? "email" : "tel"}
                    value={target}
                    onChange={(e) => {
                      setTarget(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder={
                      channel === "EMAIL"
                        ? "e.g. name@example.com"
                        : "e.g. +91 98765 43210"
                    }
                    required
                    autoComplete={channel === "EMAIL" ? "email" : "tel"}
                  />

                  {channel === "PHONE" && (
                    <p className="text-xs text-ink-sand bg-sand-light/60 border border-border-warm rounded-xs p-3 leading-relaxed">
                      Enter a 10-digit Indian mobile number or international E.164 format. If SMS delivery is currently unavailable on your connection, you can use <strong>Email verification</strong> anytime.
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full min-h-[46px] py-3 bg-terracotta hover:bg-terracotta-dark text-white font-bold text-sm flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-forest"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Sending Verification Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit Code</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {step === "VERIFY" && (
                <form onSubmit={handleVerifyOtpSubmit} noValidate className="space-y-5">
                  <div className="p-3 bg-sand-light/60 border border-border-warm rounded-xs flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="text-ink-sand">Verification code sent to </span>
                      <strong className="text-forest break-all">
                        {maskDestination(channel, target)}
                      </strong>
                    </div>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => {
                        setStep("REQUEST");
                        setOtpDigits(Array(OTP_LENGTH).fill(""));
                        setErrorMessage(null);
                        setStatusMessage(null);
                      }}
                      className="text-terracotta-dark font-semibold underline hover:text-forest shrink-0 min-h-[36px] px-1"
                    >
                      Change
                    </button>
                  </div>

                  {/* Six Accessible Segmented OTP Digit Boxes */}
                  <div className="space-y-2">
                    <label
                      id="otp-group-label"
                      className="block text-xs font-bold uppercase tracking-wider text-forest"
                    >
                      6-Digit Verification Code
                    </label>
                    <div
                      role="group"
                      aria-labelledby="otp-group-label"
                      className="grid grid-cols-6 gap-1.5 sm:gap-2.5"
                    >
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpInputsRef.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={index === 0 ? 6 : 1}
                          autoComplete={index === 0 ? "one-time-code" : "off"}
                          aria-label={`Verification digit ${index + 1} of 6`}
                          value={digit}
                          disabled={submitting}
                          onChange={(e) => handleDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          className="w-full h-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold text-forest bg-cream/60 border border-border-warm rounded-xs focus:bg-white focus:border-terracotta focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta transition-colors"
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-ink-sand">
                      Tip: You can paste all 6 digits directly into the first box.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-sand">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-forest" aria-hidden="true" />
                      Expires in {Math.max(1, Math.round(expiresInSeconds / 60))} minutes
                    </span>
                    <button
                      type="button"
                      disabled={cooldown > 0 || submitting}
                      onClick={() => handleRequestOtp()}
                      className={`font-semibold min-h-[36px] ${
                        cooldown > 0 || submitting
                          ? "text-ink-sand/60 cursor-not-allowed"
                          : "text-terracotta-dark underline hover:text-forest"
                      }`}
                    >
                      {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend verification code"}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || joinedOtp.length !== 6}
                    className="w-full min-h-[46px] py-3 bg-forest hover:bg-forest-deep text-white font-bold text-sm flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-terracotta"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Verifying Your Code...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                        <span>Verify &amp; Continue</span>
                      </>
                    )}
                  </Button>
                </form>
              )}

              {step === "VERIFIED" && (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-sage/50 text-forest flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-serif font-bold text-forest">
                      Verification Confirmed
                    </p>
                    <p className="text-xs text-ink-sand">
                      Redirecting to your MECT supporter welcome screen...
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-cream text-sm text-ink-sand">
          Loading MECT Community Portal...
        </div>
      }
    >
      <PortalLoginInner />
    </Suspense>
  );
}
