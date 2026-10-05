"use client";

import { useState } from "react";

const INITIAL_VISIBLE = 6;

function renderAnswer(text) {
  if (typeof text !== "string" || !text.includes("<b>")) return text;
  const parts = text.split(/(<\/?b>)/);
  let bold = false;
  return parts.map((part, i) => {
    if (part === "<b>") {
      bold = true;
      return null;
    }
    if (part === "</b>") {
      bold = false;
      return null;
    }
    if (!part) return null;
    if (bold) {
      return (
        <strong key={i} className="font-semibold text-gray-500">
          {part}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" width="16" height="16" fill="#25D366" aria-hidden="true">
      <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
    </svg>
  );
}

export default function FAQSection({
  eyebrow,
  heading,
  subheading,
  faqs = [],
  cta,
}) {
  const [openIndex, setOpenIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const showWhatsApp = /wa\.me|whatsapp/i.test(cta?.url || "");
  const visibleFaqs = faqs.slice(0, visibleCount);
  const hasMore = visibleCount < faqs.length;

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      {(eyebrow || heading || subheading) && (
        <div className="text-center mb-12">
          {eyebrow && (
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-3">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-gray-500 text-base font-light max-w-md mx-auto">
              {subheading}
            </p>
          )}
        </div>
      )}

      {faqs.length > 0 && (
        <>
          <div className="max-h-[32rem] overflow-y-auto pr-1 space-y-3 pb-5">
            {visibleFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={`${faq.q}-${i}`}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(i)}
                    className="flex w-full items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-[#0B1E3F] transition-colors gap-4 text-left"
                  >
                    <span className="text-[15px]">{faq.q}</span>
                    <span
                      className={`text-gray-400 shrink-0 transition-transform duration-300 inline-block leading-none ${isOpen ? "rotate-180" : ""}`}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M12 16.5a1 1 0 0 1-.707-.293l-5-5a1 1 0 0 1 1.414-1.414L12 14.086l4.293-4.293a1 1 0 0 1 1.414 1.414l-5 5A1 1 0 0 1 12 16.5z" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 font-light bg-gray-50/30">
                      {renderAnswer(faq.a)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount(faqs.length)}
                className="inline-flex items-center justify-center rounded-full border border-[#0B1E3F]/20 bg-white px-6 py-2.5 text-sm font-semibold text-[#0B1E3F] hover:border-[#C9A24B] hover:text-[#8a7028] transition-colors"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      {cta?.text && cta?.url && (
        <div className="mt-10 p-7 bg-[#FAF6EC] border border-[#C9A24B]/20 rounded-2xl text-center">
          {cta.title && (
            <p className="text-[#0B1E3F] font-semibold mb-1">{cta.title}</p>
          )}
          {cta.description && (
            <p className="text-gray-500 text-sm font-light mb-4">{cta.description}</p>
          )}
          <a
            href={cta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-sm transition-all hover:opacity-90"
            style={{ color: "#25D366" }}
          >
            {showWhatsApp && <WhatsAppIcon />}
            {cta.text}
          </a>
        </div>
      )}
    </section>
  );
}
