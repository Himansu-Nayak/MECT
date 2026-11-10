"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export function Accordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-border-warm border-y border-border-warm">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="py-4">
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between text-left gap-4 font-serif text-base sm:text-lg font-bold text-forest hover:text-terracotta-dark transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-terracotta"
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-terracotta shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="pt-3 pr-6 text-xs sm:text-sm text-ink-sand leading-relaxed animate-in fade-in duration-150">
                <p>{item.answer}</p>
                {item.category && (
                  <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider text-forest bg-sage px-2 py-0.5 rounded-xs">
                    {item.category}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
