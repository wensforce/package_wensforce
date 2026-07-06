export default function FAQSection({ plan }) {
  const faqs = [
    {
      q: `Can I convert my ${plan.trips} trips to local rides?`,
      a: 'Yes — any unused curated journey can be converted into a local ride package (up to 8 hours / 80 km) at the standard conversion ratio. Just let your concierge know in advance.',
    },
    {
      q: 'Can I upgrade to a higher plan later?',
      a: "Absolutely. You can upgrade to any higher membership tier at any time during your validity period — we'll adjust the difference on a pro-rata basis.",
    },
  ];

  return (
    <section id="faq" className="py-20 px-6" style={{ backgroundColor: '#FAF6EC' }}>
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
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#C9A24B]/30 transition-all duration-300 overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4.5 cursor-pointer font-semibold text-gray-800 hover:text-[#0B1E3F] transition-colors list-none gap-4">
                <span className="text-[15px] text-left py-0.5">{faq.q}</span>
                <span className="text-gray-400 text-2xl shrink-0 group-open:rotate-45 transition-transform duration-300 inline-block leading-none font-light">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 font-light bg-gray-50/30">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}