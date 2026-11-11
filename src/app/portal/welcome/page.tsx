"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePortalAuth } from "@/context/PortalAuthContext";
import {
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  Compass,
  Heart,
  UserCheck,
  ShieldCheck,
  Mail,
  Phone,
} from "lucide-react";

function PortalWelcomeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justCompleted = searchParams.get("completed") === "1";
  const { isAuthenticated, isLoading, dashboard, session } = usePortalAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/login?next=/portal/welcome");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || !dashboard) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-cream text-sm text-ink-sand">
        Preparing your MECT supporter welcome experience...
      </div>
    );
  }

  const { account, donationSummary } = dashboard;
  const fullName = account.profile?.fullName?.trim();
  const firstName = fullName ? fullName.split(/\s+/)[0] : null;
  const isProfileComplete = Boolean(account.profileCompleted || session?.profileCompleted);

  return (
    <div className="min-h-[82vh] bg-cream py-10 md:py-16">
      <Container className="max-w-3xl">
        <Card padding="lg" className="bg-white border border-border-warm shadow-sm overflow-hidden p-0">
          {/* Top Institutional Header */}
          <div className="bg-forest text-white px-6 py-7 sm:px-8 border-b-4 border-terracotta">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-sand bg-white shrink-0">
                <Image
                  src="/images/mect-official-emblem.png"
                  alt="Mahaveer Educational & Charitable Trust Official Emblem"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover scale-[1.05]"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-sand">
                  Mahaveer Educational &amp; Charitable Trust
                </p>
                <p className="text-xs text-sage/90">
                  Registered Supporter Portal &bull; Odisha, India
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-white/10 border border-white/20 text-[11px] font-semibold text-sand">
                <CheckCircle2 className="w-3.5 h-3.5 text-sand" aria-hidden="true" />
                <span>
                  {isProfileComplete ? "Verified Supporter Account Active" : "Contact Verified Successfully"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                {isProfileComplete && firstName
                  ? `Welcome, ${firstName}`
                  : "You're Successfully Verified!"}
              </h1>

              <p className="text-sm text-cream/90 leading-relaxed max-w-2xl">
                {isProfileComplete
                  ? "Your MECT account is ready. You can now manage your details, explore our initiatives and access your account whenever you need."
                  : "Welcome to the MECT community. Your contact information has been verified."}
              </p>
            </div>
          </div>

          {/* Account Status & Actions */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Account & Verification Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xs bg-cream border border-border-warm space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-sand">
                    Account Status
                  </span>
                  <Badge variant="forest" size="sm">
                    {account.isDonor ? "Verified Donor" : "Community Member"}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-forest flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-terracotta shrink-0" aria-hidden="true" />
                  <span>
                    {justCompleted
                      ? "Account created & profile saved"
                      : "Account active & passwordless verified"}
                  </span>
                </p>
              </div>

              <div className="p-4 rounded-xs bg-cream border border-border-warm space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-sand">
                    Profile Completion
                  </span>
                  <Badge variant={isProfileComplete ? "forest" : "warning"} size="sm">
                    {isProfileComplete ? "Completed" : "Action Needed"}
                  </Badge>
                </div>
                <div className="text-xs text-ink pt-1 space-y-0.5">
                  {account.primaryEmail && (
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-terracotta shrink-0" aria-hidden="true" />
                      <span className="truncate">{account.primaryEmail}</span>
                    </p>
                  )}
                  {account.primaryPhone && (
                    <p className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-forest shrink-0" aria-hidden="true" />
                      <span className="truncate">{account.primaryPhone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {!isProfileComplete ? (
              <div className="p-5 rounded-xs bg-sand-light border border-border-warm space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-serif font-bold text-forest">
                    Next Step: Complete Your Profile
                  </h2>
                  <p className="text-xs text-ink-sand leading-relaxed">
                    Add your full name, mailing address, and communication preferences so your supporter records are accurate whenever you engage with MECT.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/portal/profile?welcome=1">
                    <Button className="bg-terracotta hover:bg-terracotta-dark text-white font-bold text-sm px-5 py-2.5 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" aria-hidden="true" />
                      <span>Complete Your Profile</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/portal/dashboard">
                    <Button variant="outline" className="text-xs font-semibold">
                      Go to My Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {donationSummary.successfulCount > 0 && (
                  <p className="text-xs text-forest bg-sage/35 border border-forest/20 rounded-xs px-4 py-2.5">
                    You have <strong>{donationSummary.successfulCount}</strong> verified contribution receipt{donationSummary.successfulCount > 1 ? "s" : ""} recorded on your supporter ledger.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link href="/portal/dashboard" className="block">
                    <Button className="w-full h-full min-h-[46px] bg-forest hover:bg-forest-deep text-white font-bold text-xs flex items-center justify-center gap-2">
                      <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                      <span>Go to My Dashboard</span>
                    </Button>
                  </Link>

                  <Link href="/programmes" className="block">
                    <Button
                      variant="outline"
                      className="w-full h-full min-h-[46px] text-forest border-forest/30 hover:bg-sage/40 font-semibold text-xs flex items-center justify-center gap-2"
                    >
                      <Compass className="w-4 h-4 text-terracotta" aria-hidden="true" />
                      <span>Explore Our Programmes</span>
                    </Button>
                  </Link>

                  <Link href="/donate" className="block">
                    <Button
                      variant="outline"
                      className="w-full h-full min-h-[46px] text-terracotta-dark border-terracotta/40 hover:bg-sand-light font-semibold text-xs flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-terracotta" aria-hidden="true" />
                      <span>Make a Donation</span>
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default function PortalWelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-cream text-sm text-ink-sand">
          Loading welcome experience...
        </div>
      }
    >
      <PortalWelcomeInner />
    </Suspense>
  );
}

