// motion: owner = Motion
"use client";

import React, { useState } from "react";
import { SmoothTab, type SmoothTabItem } from "@/components/motion/SmoothTab";

export interface FaqCategorySection {
  id: string;
  label: string;
  count: number;
  content: React.ReactNode;
}

export interface FaqFilterWrapperProps {
  sections: FaqCategorySection[];
}

export function FaqFilterWrapper({ sections }: FaqFilterWrapperProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const tabs: SmoothTabItem[] = [
    { id: "all", label: "All Topics" },
    ...sections.map((s) => ({ id: s.id, label: s.label, count: s.count })),
  ];

  const visibleSections =
    activeTab === "all"
      ? sections
      : sections.filter((s) => s.id === activeTab);

  return (
    <div className="space-y-12">
      <div className="flex justify-center px-4">
        <SmoothTab
          items={tabs}
          activeId={activeTab}
          onChange={setActiveTab}
          ariaLabel="Filter FAQ topics"
          layoutIdGroup="faq-category-tab"
        />
      </div>

      <div className="space-y-16">
        {visibleSections.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-24">
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
}

