"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { FileText } from "lucide-react";

const TIPTAP_EXTENSIONS = [StarterKit, Underline];

export default function TermsAndConditionsSection({ plan }) {
  const html = useMemo(() => {
    if (!plan?.termsAndConditions) return null;
    try {
      return generateHTML(plan.termsAndConditions, TIPTAP_EXTENSIONS);
    } catch (err) {
      console.warn("Failed to generate HTML from termsAndConditions JSON", err);
      return null;
    }
  }, [plan?.termsAndConditions]);

  if (!html) return null;

  return (
    <section
      id="terms-conditions"
      className="py-20 px-6"
      style={{ backgroundColor: "#FAF6EC" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C9A24B] text-[9px] tracking-[0.5em] uppercase font-semibold mb-3">
            Subscription Details
          </p>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0B1E3F]">
            Terms &amp; Conditions
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Accent indicator line */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{
              background: "linear-gradient(90deg, #C9A24B, #f0c940, #C9A24B)",
            }}
          />

          <div className="flex items-center gap-2 mb-6 text-[#C9A24B]">
            <FileText size={18} strokeWidth={2} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Membership Policy
            </span>
          </div>

          <div
            className="tiptap-prose text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </section>
  );
}
