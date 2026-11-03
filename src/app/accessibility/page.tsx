import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Accessibility,
  Eye,
  Keyboard,
  Monitor,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility Statement — MAHAVIR TRUST",
  description:
    "Commitment to digital accessibility, WCAG 2.2 Level AA compliance, and universal inclusion for all users of the MAHAVIR TRUST portal.",
};

const TECHNICAL_MEASURES = [
  {
    icon: Eye,
    title: "High Contrast & Typographic Legibility",
    description:
      "Color palettes are calibrated to exceed WCAG 2.2 Level AA requirements. Body typography (#4A5568 / #1C2421) on ivory canvas (#FDFBF7) provides a minimum contrast ratio of 7:1 (exceeding the 4.5:1 threshold). Primary headings in deep forest (#0B3B24) exceed 10:1 contrast.",
  },
  {
    icon: Keyboard,
    title: "Full Keyboard Operability & Focus Traps Elimination",
    description:
      "All interactive elements—including mega-menus, navigation links, form inputs, accordions, and action buttons—are fully navigable via standard keyboard tab sequences. Clear, high-visibility 2px focus rings (focus:ring-2 focus:ring-[#C5A059]) are provided for all interactive states.",
  },
  {
    icon: Monitor,
    title: "Semantic HTML Landmarks & Screen Reader Support",
    description:
      "Every page is structured using native HTML5 landmark elements (<header>, <nav>, <main>, <section>, <footer>) with a strict heading hierarchy (single <h1> per page). All form controls feature explicit <label> associations with unique identifiers and ARIA attributes (aria-expanded, aria-required).",
  },
  {
    icon: Smartphone,
    title: "Touch Target Sizing & Responsive Zoom",
    description:
      "All touch targets and interactive controls are sized to meet or exceed the 44 × 44 CSS pixel recommendation. The interface supports browser zoom magnification up to 200% without horizontal scrolling or loss of programmatic content.",
  },
  {
    icon: Sparkles,
    title: "Reduced Motion & Vestibular Safety",
    description:
      "The portal honors user operating system preferences for reduced motion (prefers-reduced-motion: reduce). Dynamic animations, marquee carousels, and transitions automatically convert to static or subtle fade states to prevent vestibular disorientation.",
  },
];

const COMPATIBILITY_TOOLS = [
  { name: "NVDA (NonVisual Desktop Access)", platform: "Windows (Firefox, Chrome, Edge)", status: "Fully Supported" },
  { name: "JAWS (Job Access With Speech)", platform: "Windows (Chrome, Edge)", status: "Fully Supported" },
  { name: "Apple VoiceOver", platform: "macOS & iOS (Safari)", status: "Fully Supported" },
  { name: "Google TalkBack", platform: "Android (Chrome)", status: "Fully Supported" },
  { name: "Screen Magnification Tools", platform: "Windows Magnifier, macOS Zoom", status: "Tested up to 200%" },
];

export default function AccessibilityPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Inclusion & Access"
        title="Digital Accessibility Statement"
        description="Ensuring equal access to educational resources, scholarship guidelines, and institutional communications for all users across Odisha, adhering to WCAG 2.2 Level AA standards."
        breadcrumbs={[{ label: "Accessibility Statement" }]}
      />

      {/* 2. Cross-Navigation Policy Tabs */}
      <section className="bg-[#F7F4EE] border-b border-[#0B3B24]/10 py-4">
        <Container size="narrow">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium">
            <Link
              href="/terms"
              className="py-2 px-4 rounded-xs bg-[#FDFBF7] text-[#0B3B24] border border-[#0B3B24]/15 hover:bg-[#0B3B24]/5 transition-colors"
            >
              Terms of Engagement
            </Link>
            <Link
              href="/privacy"
              className="py-2 px-4 rounded-xs bg-[#FDFBF7] text-[#0B3B24] border border-[#0B3B24]/15 hover:bg-[#0B3B24]/5 transition-colors"
            >
              Privacy & Confidentiality
            </Link>
            <span className="py-2 px-4 rounded-xs bg-[#0B3B24] text-white font-semibold">
              Accessibility Statement
            </span>
          </div>
        </Container>
      </section>

      {/* 3. Main Accessibility Section */}
      <section className="py-16 md:py-24 bg-[#FDFBF7]">
        <Container size="narrow">
          <SectionHeader
            badge="Universal Design"
            title="Our Commitment to Digital Equity"
            subtitle="MAHAVIR TRUST believes that digital access is a fundamental prerequisite for educational opportunity across Odisha."
          />

          <div className="mt-8 space-y-6 text-xs sm:text-sm text-[#4A5568] leading-relaxed">
            <p>
              We are committed to providing a dignified, barrier-free digital experience for all visitors, including students, guardians, educators, and volunteers who rely on assistive technologies or connect over low-bandwidth mobile networks in rural and tribal districts.
            </p>
          </div>

          {/* Technical Measures */}
          <div className="mt-12 space-y-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B3B24]">
              Core Technical Accessibility Measures (WCAG 2.2 AA)
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {TECHNICAL_MEASURES.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <Card key={idx} variant="elevated" className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 flex items-center justify-center text-[#0B3B24] shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#0B3B24]">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed pl-13">
                      {item.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Assistive Technology Compatibility Table */}
          <div className="mt-14 space-y-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B3B24]">
              Assistive Technology Compatibility Matrix
            </h3>

            <div className="overflow-x-auto border border-[#0B3B24]/15 rounded-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B3B24] text-white">
                  <tr>
                    <th className="py-3 px-4 font-serif font-semibold">Assistive Technology</th>
                    <th className="py-3 px-4 font-serif font-semibold">Platform & Browsers</th>
                    <th className="py-3 px-4 font-serif font-semibold">Support Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B3B24]/10 bg-[#FDFBF7]">
                  {COMPATIBILITY_TOOLS.map((tool, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F4EE]">
                      <td className="py-3 px-4 font-medium text-[#0B3B24]">{tool.name}</td>
                      <td className="py-3 px-4 text-[#4A5568]">{tool.platform}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B3B24] bg-[#0B3B24]/10 py-0.5 px-2 rounded-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0B3B24]" />
                          {tool.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feedback & Remediation Desk */}
          <div className="mt-14">
            <Card variant="dark" className="p-8 space-y-4 border border-[#C5A059]/40">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-[#C5A059]/20 flex items-center justify-center text-[#E4C88A] shrink-0 mt-1">
                  <Accessibility className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-serif text-lg font-bold text-[#E4C88A]">
                    Accessibility Feedback & Remediation Desk
                  </h4>
                  <p className="text-xs text-white/85 leading-relaxed">
                    We welcome feedback on the accessibility of our website. If you encounter any difficulty accessing information, completing a registration form, or reading institutional reports, please email our administrative team at <code className="text-[#E4C88A] font-mono">contact@mahavirtrust.org</code> with the subject line <strong>[ACCESSIBILITY_FEEDBACK]</strong>.
                  </p>
                  <p className="text-[11px] text-[#E4C88A]">
                    SLA: All accessibility feedback is logged in our technical registry and acknowledged within 48 business hours.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <span className="text-[11px] text-white/60">
                  Standards Reference: WCAG 2.2 Level AA | GIGW (Guidelines for Indian Government Websites)
                </span>
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="!border-[#E4C88A] !text-[#E4C88A] hover:!bg-[#E4C88A]/10 text-xs">
                    <Mail className="w-3.5 h-3.5 mr-1.5" />
                    Submit Accessibility Report
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
