"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { EXPO_FAQS } from "@/app/data/expoContent";

export default function ExpoFAQ({ faqs = EXPO_FAQS }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.q}
              className={`bg-white rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "border-[#C9A24B]/40 shadow-md"
                  : "border-gray-200 hover:shadow-md hover:border-[#C9A24B]/30"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between px-6 py-4 cursor-pointer gap-4 text-left"
              >
                <span
                  className={`text-[15px] font-semibold transition-colors duration-200 ${
                    isOpen ? "text-[#0B1E3F]" : "text-gray-800"
                  }`}
                >
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isOpen
                      ? "bg-[#C9A24B] border-[#C9A24B] text-white"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  {isOpen ? (
                    <Minus size={13} strokeWidth={2.5} />
                  ) : (
                    <Plus size={13} strokeWidth={2.5} />
                  )}
                </span>
              </button>
              <div
                className="transition-all duration-300 ease-in-out"
                style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-2 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-gray-50/30">
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
