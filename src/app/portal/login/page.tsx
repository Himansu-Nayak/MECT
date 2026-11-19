"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function PortalLoginRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const q = searchParams.toString();
    router.replace(`/login${q ? `?${q}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF7F2] text-sm text-ink-muted">
      <Loader2 className="w-6 h-6 animate-spin text-forest mr-2" />
      <span>Redirecting to MECT Login...</span>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] bg-[#FAF7F2]" />}>
      <PortalLoginRedirect />
    </Suspense>
  );
}
