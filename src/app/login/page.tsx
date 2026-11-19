"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { requestPortalOtp, verifyPortalOtp } from "@/lib/portal-api";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Heart,
  Landmark,
  Loader2,
  Lock,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const phoneParam = searchParams.get("phone");
  const { isAuthenticated, isLoading, setSessionFromOtp } = usePortalAuth();

  const [phone, setPhone] = useState(phoneParam?.replace(/\D/g, "").slice(-10) || "");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [cooldown, setCooldown] = useState(0);
  const [requesting, setRequesting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const safeNext = nextParam && nextParam.startsWith("/") ? nextParam : "/portal/dashboard";
      router.replace(safeNext);
    }
  }, [isLoading, isAuthenticated, nextParam, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const normalizePhone = (raw: string): string => {
    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.length === 10) return `+91${cleaned}`;
    if (cleaned.length === 12 && cleaned.startsWith("91")) return `+${cleaned}`;
    return cleaned.length === 10 ? `+91${cleaned}` : raw.trim();
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
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

    const normalized = `+91${cleaned}`;
    setRequesting(true);
    try {
      const res = await requestPortalOtp({
        channel: "PHONE",
        target: normalized,
        purpose: "LOGIN",
      });
      setStep("OTP");
      setCooldown(res.cooldownSeconds || 60);
      setStatusMsg(`Verification code sent to ${normalized}. Enter the 6-digit code below.`);
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send verification code. Please try again.");
    } finally {
      setRequesting(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);

    const cleanedOtp = otpCode.trim().replace(/\D/g, "");
    if (cleanedOtp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    const normalized = normalizePhone(phone);
    setVerifying(true);
    try {
      const auth = await verifyPortalOtp({
        channel: "PHONE",
        target: normalized,
        otpCode: cleanedOtp,
        purpose: "LOGIN",
      });

      await setSessionFromOtp(auth);
      const safeNext = nextParam && nextParam.startsWith("/") ? nextParam : "/portal/dashboard";
      router.push(safeNext);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Invalid or expired verification code. Please check and retry.");
    } finally {
      setVerifying(false);
    }
  };

  const registerHref = nextParam
    ? `/register?next=${encodeURIComponent(nextParam)}&phone=${encodeURIComponent(phone)}`
    : `/register?phone=${encodeURIComponent(phone)}`;

  return (
    <div className="bg-[#FAF7F2] min-h-[calc(100vh-80px)] py-10 md:py-16">
      <Container className="max-w-5xl">
        <div className="bg-white border border-[#E6E1D8] rounded-xs shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* =========================================================================
              LEFT COLUMN: INSTITUTIONAL BRAND STORYTELLING (DESKTOP)
              ========================================================================= */}
          <div className="lg:col-span-5 bg-forest text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background Archival Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Trust Emblem & Header */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-terracotta bg-white shrink-0 shadow-sm">
                  <Image
                    src="/images/mect-official-emblem.png"
                    alt="Mahaveer Educational & Charitable Trust Emblem"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover scale-[1.06]"
                    priority
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-terracotta-light block">
                    Institutional Portal
                  </span>
                  <h2 className="font-serif font-bold text-lg text-white leading-tight">
                    Mahaveer Trust
                  </h2>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-sand block">
                  Registered Public Charitable Trust · Estd. 2013
                </span>
                <p className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                  Transparent Governance. Ground-Level Impact.
                </p>
                <p className="text-xs text-cream/80 leading-relaxed font-sans">
                  Access your verified donor dashboard, download serialized official Section 80G tax receipts with cryptographic SHA-256 seals, track manual SBI transfers, and monitor your direct contribution impact.
                </p>
              </div>

              {/* Statutory Credentials Badges */}
              <div className="pt-4 border-t border-white/15 space-y-2.5 text-[11px] font-mono">
                <div className="flex items-center justify-between text-cream/90">
                  <span>Trust PAN:</span>
                  <strong className="text-sand">AADTM5474F</strong>
                </div>
                <div className="flex items-center justify-between text-cream/90">
                  <span>Section 12A URN:</span>
                  <strong className="text-sand">AADTM5474FE20231</strong>
                </div>
                <div className="flex items-center justify-between text-cream/90">
                  <span>Section 80G URN:</span>
                  <strong className="text-sand">AADTM5474FF20241</strong>
                </div>
                <div className="flex items-center justify-between text-cream/90">
                  <span>CSR-1 Reg Number:</span>
                  <strong className="text-sand">CSR00067341</strong>
                </div>
              </div>
            </div>

            {/* Fiduciary Assurance Footer */}
            <div className="pt-6 border-t border-white/15 relative z-10 text-[11px] text-cream/70 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sand shrink-0" />
              <span>Zero-trust mobile authentication ensures auditable transparency.</span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: FOCUSED AUTHENTICATION FORM
              ========================================================================= */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
            <div className="space-y-6 max-w-md mx-auto w-full">
              
              <div>
                <Badge variant="forest" size="sm" className="mb-2">
                  Supporter &amp; Donor Login
                </Badge>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                  Sign In to MECT
                </h1>
                <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                  Enter your verified Indian mobile number to log in via one-time verification password.
                </p>
              </div>

              {/* Status / Feedback Notifications */}
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

              {/* Step 1: Mobile Input Form */}
              {step === "PHONE" && (
                <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
                  <div>
                    <label htmlFor="login-mobile-input" className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="h-11 px-3.5 bg-[#FAF7F2] border border-[#E6E1D8] rounded-xs font-mono font-bold text-sm text-forest flex items-center shrink-0">
                        +91 (India)
                      </div>
                      <Input
                        id="login-mobile-input"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="9853608113"
                        className="font-mono text-base font-bold flex-1"
                        autoFocus
                        required
                      />
                    </div>
                    <p className="text-[11px] text-ink-muted mt-1.5">
                      We will send a 6-digit OTP code to verify your supporter identity.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={requesting || phone.length < 10}
                    className="w-full shadow-sm"
                  >
                    {requesting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Sending Verification Code...</span>
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        <span>Send Login OTP</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: OTP Verification Form */}
              {step === "OTP" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                  <div className="p-3 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                        Verifying Number
                      </span>
                      <span className="font-mono font-bold text-forest text-sm">
                        +91 {phone}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("PHONE");
                        setOtpCode("");
                        setErrorMsg(null);
                      }}
                      className="text-xs text-terracotta-dark hover:text-forest font-semibold underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Change Number</span>
                    </button>
                  </div>

                  <div>
                    <label htmlFor="otp-digit-input" className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                      Enter 6-Digit OTP Code
                    </label>
                    <Input
                      id="otp-digit-input"
                      ref={otpInputRef}
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setOtpCode(val);
                        if (val.length === 6) {
                          setTimeout(() => {
                            const btn = document.getElementById("login-submit-button");
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
                    id="login-submit-button"
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={verifying || otpCode.length !== 6}
                    className="w-full shadow-sm"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Verifying &amp; Signing In...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2 stroke-[3]" />
                        <span>Verify &amp; Sign In</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-ink-muted">Didn&apos;t receive the code?</span>
                    {cooldown > 0 ? (
                      <span className="font-mono text-ink-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-terracotta" />
                        <span>Resend in {cooldown}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={requesting}
                        className="text-terracotta-dark font-bold hover:text-forest underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Navigation Switch to Create Account */}
              <div className="pt-6 border-t border-[#E6E1D8] text-center text-xs space-y-2">
                <p className="text-ink-muted">
                  New to Mahaveer Trust?{" "}
                  <Link
                    href={registerHref}
                    className="text-terracotta-dark font-bold hover:text-forest underline ml-1"
                  >
                    Create a Supporter Account
                  </Link>
                </p>
                <p className="text-[11px] text-ink-muted">
                  By signing in, you agree to MECT&apos;s{" "}
                  <Link href="/terms" className="underline hover:text-forest">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-forest">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

            </div>

            {/* Helpline Assistance */}
            <div className="mt-8 pt-4 border-t border-[#E6E1D8] text-center text-[11px] text-ink-muted">
              Need assistance? Call MECT Secretariat at{" "}
              <a href="tel:+919853608113" className="font-semibold text-terracotta-dark underline hover:text-forest">
                +91 9853608113
              </a>{" "}
              or email{" "}
              <a href="mailto:mect220@gmail.com" className="font-semibold text-terracotta-dark underline hover:text-forest">
                mect220@gmail.com
              </a>.
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF7F2]">
          <Loader2 className="w-8 h-8 animate-spin text-forest" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
