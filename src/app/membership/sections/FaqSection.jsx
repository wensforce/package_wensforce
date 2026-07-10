import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQSection({ plan }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const faqs = [
    {
      q: `Can I convert my ${plan.trips} trips to local rides?`,
      a: "Yes — any unused curated journey can be converted into a local ride package (up to 8 hours / 80 km) at the standard conversion ratio. Just let your concierge know in advance.",
    },
    {
      q: "Can I upgrade to a higher plan later?",
      a: "Absolutely. You can upgrade to any higher membership tier at any time during your validity period — we'll adjust the difference on a pro-rata basis.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-6" style={{ backgroundColor: "#FAF6EC" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C9A24B] text-[9px] tracking-[0.5em] uppercase font-semibold mb-3">
            {plan.name} Specifics
          </p>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0B1E3F]">
            Questions about this plan
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i; // ← must be inside the map callback

            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#C9A24B]/40 shadow-md"
                    : "border-gray-200 hover:shadow-md hover:border-[#C9A24B]/30"
                }`}
              >
                {/* Question row */}
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen} // ← was "aria - expanded" (broken)
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

                {/* Answer — CSS grid-row height animation */}
                <div
                  className="transition-all duration-300 ease-in-out"
                  style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 font-light bg-gray-50/30">
                      {/* ↑ removed duplicate pt-0/pt-4 conflict */}
                      {faq.a}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}