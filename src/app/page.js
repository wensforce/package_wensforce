import Link from "next/link";
import {
  Car,
  Users,
  ShieldCheck,
  Gem,
  Crown,
  CheckCircle,
  Phone,
} from "lucide-react";
import { plans } from "./data/plans";
import Header from "./components/Header";
import HowItWorks from "./components/HowItWorks";
import PlansSection from "./components/PlansSection";
import TrustStrip from "./components/TrustStrip";
import WedgeBlock from "./components/WedgeBlock";
import TierQuiz from "./components/TierQuiz";
import PressPartnerWall from "./components/PressPartnerWall";
import FounderStoryBlock from "./components/FounderStoryBlock";
import ReferralBanner from "./components/ReferralBanner";
import ExitIntentPopup from "./components/ExitIntentPopup";
import TestimonialsSection from "./components/TestimonialsSection";
import HeroSection from "./components/HeroSection";
import FoundingMemberBanner from "./components/FoundingMemberBanner";
import JsonLd from "./components/JsonLd";

export const metadata = {
  title: "WENS Force — India's Only Luxury Travel + Armed Protection + VIP Darshan Subscription",
  description:
    "Five tiers. One annual fee. Vehicle, bodyguard, and lifestyle privileges pre-arranged for the year. VIP Darshan at Tirupati, Vaishno Devi, Mahakaleshwar. PSARA-licensed security. From ₹24,999/year.",
  alternates: { canonical: "https://subscription.wensforce.com" },
};
const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");
const WA_NUMBER = "917304607954";

const TIER_ICONS = {
  essential: Car,
  executive: Users,
  premium: ShieldCheck,
  elite: Gem,
  sovereign: Crown,
};

const faqs = [
  {
    q: "I'm sceptical about prepaying this much. How do I know WENS Force is real?",
    a: "Fair question. WENS Force alias WENS Force International Private Limited Headquarterd in Mahindra Chamber Stock Exchange opp. CST Station, South Mumbai is a registered company with a physical operations team across India & Dubai. Every member gets a dedicated concierge contact on WhatsApp immediately upon joining. You can also speak to our team before paying: +91-7304607954.",
  },
  {
    q: "What exactly happens in the first 24 hours after I join?",
    a: "Your dedicated concierge calls to introduce themselves and understand your preferences — vehicle type, usual routes, pilgrimage interests. Within 24 hours, your membership is activated and you're ready to book. Most members take their first trip within 72 hours.",
  },
  {
    q: "My schedule is unpredictable — will a car really be ready in 12 minutes?",
    a: "Yes. For Elite and Sovereign: 10–15 minute dispatch, 24×7, pre-positioned in your city. For Essential and Executive: 30–45 minutes for scheduled bookings; same-day bookings confirmed within the hour. We maintain standby fleets precisely for unplanned travel.",
  },
  {
    q: "Can my family use the membership when I travel abroad?",
    a: "Yes — all plans are Family-Transferable. Any household member (spouse, children, parents at the same address) can use your trips. Sovereign members additionally give their spouse a separate dedicated booking line, usable independently.",
  },
  {
    q: "What if I don't use all my trips in a year?",
    a: "Unused trips and time-bound vouchers lapse at the end of the 12-month period. However, your concierge will proactively remind you of unused credits each quarter so you never let them expire by accident. We also help you plan ahead so every trip is maximised.",
  },
  {
    q: "Is the armed bodyguard discreet, or will it look conspicuous?",
    a: "Discreet is the default. All guards are in plain clothes unless you specifically request uniformed security. They are briefed on your preferences during onboarding. Most members say their guests do not notice the security at all — only the smooth experience.",
  },
  {
    q: "Can I upgrade my tier mid-year if my needs change?",
    a: "Yes. Upgrade any time by paying the pro-rated difference for the remaining months. Your new benefits activate immediately. Remaining trip credits carry over at the new tier value. Call your concierge to arrange — it takes 30 minutes.",
  },
];

const COMPARISON_ROWS = [
  {
    label: "Privileges Worth",
    values: [
      INR(plans[0].freePerksWorth),
      INR(plans[1].freePerksWorth),
      INR(plans[2].freePerksWorth),
      INR(plans[3].freePerksWorth),
      INR(plans[4].freePerksWorth),
    ],
    highlight: true,
  },
  { label: "Curated Journeys / Year", values: ["3", "4", "5", "5", "5"] },
  {
    label: "Vehicle Class",
    values: [
      "Standard Sedan",
      "Standard SUV",
      "SUV + Armed",
      "Luxury Sedan",
      "Luxury SUV",
    ],
  },
  {
    label: "Security",
    values: ["MMA", "MMA", "✓ Armed", "✓ Armed", "✓ Armed"],
  },
  { label: "VIP Darshan Vouchers", values: ["1", "2", "3", "5", "Unlimited"] },
  {
    label: "Airport Lounge",
    values: ["1 visit", "2 visits", "3 visits", "Unlimited", "Unlimited"],
  },
  {
    label: "Heritage Fast-Track Pass",
    values: ["—", "1", "2", "3 + Guide", "5 + Guide"],
  },
  {
    label: "Concierge Level",
    values: [
      "Helpline",
      "Helpline",
      "Dedicated RM",
      "RM + Concierge",
      "Personal Suite",
    ],
  },
];

function ComparisonTable() {
  const waBase = `https://wa.me/${WA_NUMBER}?text=`;

  return (
    <section
      id="compare"
      className="w-full px-4 sm:px-8 py-16 max-w-6xl mx-auto"
    >
      <div className="text-center mb-10">
        <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
          Side by Side
        </p>
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-3">
          Compare All Five Tiers
        </h2>
        <p className="text-gray-500 text-base font-light max-w-md mx-auto">
          Every feature at a glance — so you choose with complete clarity.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-5 text-xs text-gray-400 w-44 font-normal" />
              {plans.map((plan) => {
                const TierIcon = TIER_ICONS[plan.id] || Car;
                const isHighlight = plan.isBestValue;
                return (
                  <th
                    key={plan.id}
                    className={[
                      "px-3 py-5 text-center",
                      isHighlight
                        ? "bg-[#C9A24B]/6 border-x border-[#C9A24B]/15"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={[
                          "w-8 h-8 rounded-xl flex items-center justify-center border",
                          isHighlight
                            ? "bg-[#C9A24B]/15 border-[#C9A24B]/25"
                            : "bg-gray-50 border-gray-100",
                        ].join(" ")}
                      >
                        <TierIcon
                          size={14}
                          strokeWidth={1.75}
                          className={
                            isHighlight ? "text-[#C9A24B]" : "text-gray-500"
                          }
                        />
                      </div>
                      <div
                        className={[
                          "text-xs font-bold tracking-wide",
                          isHighlight ? "text-[#C9A24B]" : "text-gray-600",
                        ].join(" ")}
                      >
                        {plan.name}
                      </div>
                      <div
                        className={[
                          "text-[10px]",
                          isHighlight ? "text-[#C9A24B]/60" : "text-gray-400",
                        ].join(" ")}
                      >
                        {INR(plan.price)}/yr
                      </div>
                      {plan.isBestValue && (
                        <div className="text-[9px] bg-[#C9A24B] text-black font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                          BEST VALUE
                        </div>
                      )}
                      {plan.isPopular && (
                        <div className="text-[9px] bg-[#0B1E3F] text-white font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                          MOST POPULAR
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr
                key={row.label}
                className={[
                  "border-b border-gray-50",
                  i % 2 !== 0 ? "bg-gray-50/40" : "",
                ].join(" ")}
              >
                <td
                  className={[
                    "px-6 py-3.5 text-xs",
                    row.highlight ? "font-bold text-gray-700" : "text-gray-500",
                  ].join(" ")}
                >
                  {row.label}
                </td>
                {row.values.map((val, j) => {
                  const isHighlight = plans[j].isBestValue;
                  return (
                    <td
                      key={j}
                      className={[
                        "px-3 py-3.5 text-center",
                        isHighlight
                          ? "bg-[#C9A24B]/6 border-x border-[#C9A24B]/15"
                          : "",
                      ].join(" ")}
                    >
                      {val === "✓ Armed" ? (
                        <span className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600">
                          <CheckCircle size={12} strokeWidth={2} />
                          Armed
                        </span>
                      ) : val === "—" ? (
                        <span className="text-gray-200 text-sm">—</span>
                      ) : (
                        <span
                          className={[
                            "text-xs",
                            row.highlight ? "font-bold" : "font-medium",
                            isHighlight ? "text-[#C9A24B]" : "text-gray-700",
                          ].join(" ")}
                        >
                          {val}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-100 bg-gray-50/50">
              <td className="px-6 py-4" />
              {plans.map((plan) => {
                const isHighlight = plan.isBestValue;
                const msg = encodeURIComponent(
                  `Hi WENS Force, I'd like to join the ${plan.name} membership (${INR(plan.price)}/yr). Please help me get started.`,
                );
                return (
                  <td
                    key={plan.id}
                    className={[
                      "px-3 py-4 text-center",
                      isHighlight
                        ? "bg-[#C9A24B]/6 border-x border-[#C9A24B]/15"
                        : "",
                    ].join(" ")}
                  >
                    <a
                      href={`${waBase}${msg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[10px] whitespace-nowrap font-bold px-3 py-2 rounded-xl transition-all hover:opacity-90"
                      style={{
                        backgroundColor: isHighlight ? "#C9A24B" : "#0B1E3F",
                        color: isHighlight ? "#000" : "#fff",
                      }}
                    >
                      Get Started
                    </a>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
          Your Questions
        </p>
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-3">
          Honest Answers
        </h2>
        <p className="text-gray-500 text-base font-light max-w-md mx-auto">
          The questions serious buyers ask — answered plainly.
        </p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 overflow-hidden"
          >
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-[#0B1E3F] transition-colors list-none gap-4">
              <span className="text-[15px] text-left">{faq.q}</span>
              <span className="text-gray-400 text-xl shrink-0 group-open:rotate-180 transition-transform duration-300 inline-block leading-none font-light">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 16.5a1 1 0 0 1-.707-.293l-5-5a1 1 0 0 1 1.414-1.414L12 14.086l4.293-4.293a1 1 0 0 1 1.414 1.414l-5 5A1 1 0 0 1 12 16.5z" />
                </svg>
              </span>
            </summary>
            <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 font-light bg-gray-50/30">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 p-7 bg-[#FAF6EC] border border-[#C9A24B]/20 rounded-2xl text-center">
        <p className="text-[#0B1E3F] font-semibold mb-1">
          Still have a question?
        </p>
        <p className="text-gray-500 text-sm font-light mb-4">
          Our concierge is available 24×7.
        </p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I have a question about WENS Force membership.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-sm transition-all hover:opacity-90"
          style={{ color: "#25D366" }}
        >
          <svg viewBox="0 0 32 32" width="16" height="16" fill="#25D366">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
          </svg>
          Ask on WhatsApp
        </a>
      </div>
    </section>
  );
}

export default function HomePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "WENS Force Membership Plans",
    "itemListElement": plans.map((plan, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Product",
        "name": `WENS Force ${plan.name} Membership`,
        "description": plan.tagline,
        "url": `https://subscription.wensforce.com/membership/${plan.id}`,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": plan.price,
          "availability": "https://schema.org/InStock",
          "url": `https://subscription.wensforce.com/booking/${plan.id}`,
        },
      },
    })),
  };

  return (
    <div className="min-h-screen relative">
      <JsonLd data={faqSchema} />
      <JsonLd data={itemListSchema} />
      <Header />

      {/* ── HERO (with announcement bar + full-screen video) ── */}
      <HeroSection />

      {/* ── TRUST STRIP ── */}
      <TrustStrip />

      {/* ── WEDGE BLOCK ── */}
      <WedgeBlock />

      {/* ── PLANS SPOTLIGHT ── */}
      <section style={{ backgroundColor: "#FAF6EC" }}>
        <PlansSection />
      </section>

      {/* ── TIER QUIZ ── */}
      <TierQuiz />

      {/* ── ALL PLANS GRID ── */}
      {/* <AllPlansGrid plans={plans} /> */}

      {/* ── COMPARISON TABLE ── */}
      <section style={{ backgroundColor: "#FAF6EC" }}>
        <ComparisonTable />
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      {/* ── PRESS & PARTNERS ── */}
      <PressPartnerWall />

      {/* ── FOUNDER STORY ── */}
      {/* <FounderStoryBlock /> */}

      {/* ── REFERRAL BANNER ── */}
      {/* <ReferralBanner /> */}

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── FOUNDING MEMBER BANNER ── */}
      <FoundingMemberBanner />

      {/* ── FOOTER ── */}
      <footer
        style={{ backgroundColor: "#060606" }}
        className="border-t border-white/5 py-10 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center gap-2 mb-3">
            <img src="/Logo.png" alt="WENS Force Logo" className="w-15 h-15" />
            <span className="text-[#C9A24B] font-bold text-sm tracking-[0.3em] uppercase">
              WENS Force International Private Limited
            </span>
          </div>
          <p className="text-gray-600 text-xs max-w-xs mx-auto mb-6 font-light">
            Where Every Journey Becomes an Arrival.
          </p>
          <div className="flex justify-center gap-6 text-xs text-gray-700 flex-wrap mb-6">
            {[
              {
                name: "Privacy Policy",
                href: "https://wensforce.com/privacy-policy/",
              },
              {
                name: "Terms & Conditions",
                href: "https://wensforce.com/disclaimer-terms-of-services/",
              },
              {
                name: "Refund Policy",
                href: "https://wensforce.com/cancellation-refund-policy/",
              },
              { name: "Contact Us", href: "https://wensforce.com/contact-us/" },
            ].map((item) => (
              <a
                key={item.name}
                target="_blank"
                href={item.href}
                className="hover:text-gray-500 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-700 mb-4">
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
            >
              <svg
                viewBox="0 0 32 32"
                width="13"
                height="13"
                fill="currentColor"
              >
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
              </svg>
              +91-73046 07954
            </a>
            <span className="text-gray-800">·</span>
            <a
              href="mailto:wensforce@gmail.com"
              className="hover:text-gray-500 transition-colors flex items-center gap-1"
            >
              <Phone size={11} />
              wensforce@gmail.com
            </a>
          </div>
          <p className="text-gray-800 text-xs">
            © 2026 WENS Force Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Sticky mobile CTA */}
      {/* <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0B1E3F]/97 backdrop-blur border-t border-white/8 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[9px] text-white uppercase tracking-widest">
              {plans[0].name}
            </div>
            <div className="text-[#ffce63] font-semibold text-sm">
              {plans[0].price} / yr &nbsp;·&nbsp; {plans[0].confirmed} of 100
              confirmed
            </div>
          </div>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi WENS Force, I want to claim ${plans[0].name} membership. Please guide me.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold py-2.5 px-4 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all hover:opacity-90"
            style={{ backgroundColor: "#25D366", color: "white" }}
          >
            <svg viewBox="0 0 32 32" width="12" height="12" fill="white">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
            </svg>
            Enquire Now
          </a>
        </div>
      </div> */}
      <div className="h-16 md:hidden" />

      {/* Exit intent popup */}
      <ExitIntentPopup />
    </div>
  );
}
