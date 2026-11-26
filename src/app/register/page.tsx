"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { isDonorPortalEnabled } from "@/config/portal";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { ProgressiveDonorAuth } from "@/components/auth/ProgressiveDonorAuth";
import { Loader2, ShieldCheck } from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const phoneParam = searchParams.get("phone");
  const emailParam = searchParams.get("email");
  const channelParam = searchParams.get("channel");

  const initialChannel: "PHONE" | "EMAIL" = "PHONE";

  const { isAuthenticated, isLoading } = usePortalAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const safeNext = nextParam && nextParam.startsWith("/") ? nextParam : "/portal/dashboard";
      router.replace(safeNext);
    }
  }, [isLoading, isAuthenticated, nextParam, router]);

  const loginHref = nextParam
    ? `/login?next=${encodeURIComponent(nextParam)}`
    : "/login";

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Container className="max-w-5xl">
        <Card className="bg-white shadow-xl rounded-sm border-[#E6E1D8] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          
          {/* =========================================================================
              LEFT COLUMN: INSTITUTIONAL HERITAGE & ASSURANCE
              ========================================================================= */}
          <div className="lg:col-span-5 bg-forest text-cream p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/90 via-forest to-forest-dark pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              {/* Emblem Header */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 bg-cream/10 rounded-full flex items-center justify-center p-2 border border-cream/20 shadow-inner">
                  <Image
                    src="/images/logo/mect-official-emblem.png"
                    alt="MECT Official Emblem"
                    width={40}
                    height={40}
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-sand block">
                    Donor Community
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
                  Join our Community of Dedicated Donors &amp; Patrons.
                </p>
                <p className="text-xs text-cream/80 leading-relaxed font-sans">
                  Register with your mobile number to view all your contributions in one place, claim historical SBI bank remittances, and download official 80G tax receipts.
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
                  <span>Historical 80G URN:</span>
                  <strong className="text-sand">AADTM5474FF20241</strong>
                </div>
                <div className="flex items-center justify-between text-cream/90">
                  <span>CSR-1 Reg Number:</span>
                  <strong className="text-sand">CSR00081063</strong>
                </div>
              </div>
            </div>

            {/* Trust Assurance Footer */}
            <div className="pt-6 border-t border-white/15 relative z-10 text-[11px] text-cream/70 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sand shrink-0" />
              <span>Zero-Spam Policy. Verified data encryption for every transaction.</span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: PROGRESSIVE DONOR AUTHENTICATION
              ========================================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div className="w-full max-w-md mx-auto my-auto">
              <ProgressiveDonorAuth
                initialIntent="REGISTER"
                initialChannel={initialChannel}
                initialPhone={phoneParam || ""}
                initialEmail={emailParam || ""}
                nextUrl={nextParam || "/portal/dashboard"}
                compact={true}
                headingOverride="Create Your Supporter Account"
                subheadingOverride="Enter your details to create your donor profile, track contributions, and download official tax receipts."
              />

              {/* Navigation Switch to Sign In */}
              <div className="pt-6 mt-6 border-t border-[#E6E1D8] text-center text-xs space-y-2">
                <p className="text-ink-muted">
                  Already registered?{" "}
                  <Link
                    href={loginHref}
                    className="text-terracotta-dark font-bold hover:text-forest underline ml-1"
                  >
                    Sign In to Your Account
                  </Link>
                </p>
                <p className="text-[11px] text-ink-muted">
                  By registering, you agree to MECT&apos;s{" "}
                  <Link href="/terms-and-conditions" className="underline hover:text-forest">
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
              <a href="tel:+919438295223" className="font-semibold text-terracotta-dark underline hover:text-forest">
                +91 94382 95223
              </a>{" "}
              or email{" "}
              <a href="mailto:mect220@gmail.com" className="font-semibold text-terracotta-dark underline hover:text-forest">
                mect220@gmail.com
              </a>.
            </div>
          </div>

        </Card>
      </Container>
    </div>
  );
}

export default function RegisterPage() {
  if (!isDonorPortalEnabled()) {
    notFound();
  }
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF7F2]">
          <Loader2 className="w-8 h-8 animate-spin text-forest" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
