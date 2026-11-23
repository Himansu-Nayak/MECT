"use client";

import React from "react";
import dynamic from "next/dynamic";

const QuickActionDock = dynamic(
  () => import("@/components/QuickActionDock").then((mod) => mod.QuickActionDock),
  { ssr: false }
);

const HImChatbot = dynamic(
  () => import("@/components/ai/HImChatbot").then((mod) => mod.HImChatbot),
  { ssr: false }
);

export function ClientSupportWidgets() {
  return (
    <>
      <QuickActionDock />
      <HImChatbot />
    </>
  );
}
