"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { downloadPortalReceiptPdf } from "@/lib/portal-api";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  Heart,
  Landmark,
  Loader2,
  Receipt,
  ShieldCheck,
} from "lucide-react";

function formatInr(val: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val || 0);
}

export default function PortalReceiptsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, token, dashboard } = usePortalAuth();

  const [downloadingNum, setDownloadingNum] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login?next=/portal/receipts");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleDownload = async (receiptNum: string) => {
    if (!token) return;
    setDownloadingNum(receiptNum);
    setErrorMsg(null);
    try {
      await downloadPortalReceiptPdf(token, receiptNum);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to download PDF receipt.");
    } finally {
      setDownloadingNum(null);
    }
  };

  if (isLoading || !dashboard) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-16">
        <Container className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto mb-3" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-ink-muted">
            Loading Official Receipts...
          </p>
        </Container>
      </div>
    );
  }

  const receiptsList = dashboard.donationHistory.filter(
    (item) => (item.status === "SUCCESSFUL" || item.status === "SUCCESS") && item.receiptNumber
  );

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
                Official Donation Payment Receipts
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted">
                Download serialized numbered Official Donation Receipts (PDF) for your accounting and financial records.
              </p>
            </div>

            <Badge variant="forest" size="sm">
              Historical 80G Order (URN: AADTM5474FF20241)
            </Badge>
          </div>

        {errorMsg && (
          <div role="alert" className="p-3.5 rounded-xs bg-red-50 border border-red-200 text-xs text-red-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Statutory Tax Certificate Information Banner */}
        <div className="p-4 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8] space-y-2 text-xs text-ink leading-relaxed">
          <div className="font-bold text-forest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-terracotta" />
            <span>Statutory Receipt Policy</span>
          </div>
          <p className="text-ink-muted">
            All voluntary contributions to MECT generate an official <strong>numbered receipt and payment acknowledgement</strong> bearing Trust PAN <strong>AADTM5474F</strong>. Tax treatment of contributions is subject to applicable law and confirmation of the Trust&apos;s current statutory eligibility.
          </p>
        </div>

        {/* Receipts Repository Grid */}
        {receiptsList.length === 0 ? (
          <Card padding="lg" className="bg-white border-[#E6E1D8] text-center py-16 space-y-3">
            <Receipt className="w-10 h-10 text-ink-muted mx-auto" />
            <h3 className="font-serif font-bold text-forest text-lg">No Receipts Issued Yet</h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Numbered receipts are issued after the Trust verifies your State Bank of India bank transfer or UPI payment against its bank records.
            </p>
            <div className="pt-2">
              <Link href="/donate">
                <Button variant="primary" size="sm">
                  Make a Contribution
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {receiptsList.map((item) => (
              <Card
                key={item.donationReference}
                padding="md"
                className="bg-white border-[#E6E1D8] shadow-xs hover:border-forest/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <FileCheck className="w-4 h-4 text-forest" />
                      <span className="font-mono font-bold text-forest text-sm">
                        {item.receiptNumber}
                      </span>
                      <Badge variant="forest" size="sm">
                        Numbered Receipt
                      </Badge>
                      <span className="text-[11px] text-ink-muted font-mono">
                        Issued: {new Date(item.confirmedAt || item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="text-xs text-ink font-semibold">
                      {item.programmeName}
                    </div>

                    <div className="text-[11px] text-ink-muted font-mono">
                      Donation Ref: {item.donationReference} · Method: {item.paymentMethod}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E6E1D8]">
                    <span className="font-mono font-bold text-forest text-lg sm:text-xl">
                      {formatInr(item.amount)}
                    </span>

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      disabled={downloadingNum === item.receiptNumber}
                      onClick={() => handleDownload(item.receiptNumber!)}
                      className="text-xs h-8 shadow-xs"
                    >
                      {downloadingNum === item.receiptNumber ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          <span>Download PDF Receipt</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </Container>
    </div>
    </>
  );
}
