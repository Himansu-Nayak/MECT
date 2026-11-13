import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuickActionDock } from "@/components/QuickActionDock";
import { HImChatbot } from "@/components/ai/HImChatbot";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* WCAG 2.2 AA Accessible Skip Link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <QuickActionDock />
      <HImChatbot />
      <Footer />
    </>
  );
}

