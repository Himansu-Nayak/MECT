"use client";

import React from "react";
import { PortalAuthProvider } from "@/context/PortalAuthContext";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalAuthProvider>{children}</PortalAuthProvider>;
}

