import { Suspense } from "react";
import { Phone } from "lucide-react";
import { plans } from "../data/plans";
import Header from "../components/MainPage/Header";
import HowItWorksWelcomeIndia from "../components/MainPage/HowItWorksWelcomeIndia";
import TrustStrip from "../components/MainPage/TrustStrip";
import WedgeBlock from "../components/MainPage/WedgeBlock";
import TierQuiz from "../components/MainPage/TierQuiz";
import PressPartnerWall from "../components/MainPage/PressPartnerWall";
import ExitIntentPopup from "../components/MainPage/ExitIntentPopup";
import TestimonialsSection from "../components/MainPage/TestimonialsSection";
import HeroSection from "../components/MainPage/HeroSection";
import JsonLd from "../components/MainPage/JsonLd";
import ServicesVideoSection from "../components/MainPage/ServicesVideoSection";
import { ComparisonTable } from "../components/Comparison-Table/ComparisonTable";
import PlansSection from "../components/MainPage/PlansSection";
import FoundingMemberBanner from "../components/MainPage/Offer";
import WelcomeIndiaCard from "../components/MainPage/WelcomeIndiaCard";
// export const metadata = {
//   title:
//     "WENS Force — India's Only Luxury Travel + Armed Protection + VIP Darshan Subscription",
//   description:
//     "Five tiers. One annual fee. Vehicle, bodyguard, and lifestyle privileges pre-arranged for the year. VIP Darshan at Tirupati, Vaishno Devi, Mahakaleshwar. PSARA-licensed security. From ₹24,999/year.",
//   alternates: { canonical: "https://subscription.wensforce.com" },
// };
const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");
const WA_NUMBER = "917304607954";

const faqs = [
  {
    q: "I'm sceptical about prepaying this much. How do I know WENS Force is real?",
    a: "Fair question. WENS Force alias WENS Force International Private Limited Headquartered in Mahendra Chamber Stock Exchange opp. CST Station, South Mumbai is a registered company with a physical operations team across India & Dubai. Every member gets a dedicated concierge contact on WhatsApp immediately upon joining. You can also speak to our team before paying: +91-7304607954.",
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
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="28"
            height="28"
            fill="#25D366"
          >
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
          </svg>
          Ask on WhatsApp
        </a>
      </div>
    </section>
  );
}

export default async function WelcomeIndiaPage({ searchParams }) {
  const { welcomeIndia } = await searchParams;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "WENS Force Membership Plans",
    itemListElement: plans.map((plan, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `WENS Force ${plan.name} Membership`,
        description: plan.tagline,
        url: `https://subscription.wensforce.com/membership/${plan.id}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: plan.price,
          availability: "https://schema.org/InStock",
          url: `https://subscription.wensforce.com/booking/${plan.id}`,
        },
      },
    })),
  };

  return (
    <div className="min-h-screen relative">
      <JsonLd data={faqSchema} />
      <JsonLd data={itemListSchema} />
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      {/* ── HERO (with announcement bar + full-screen video) ── */}
      <HeroSection welcomeIndia={welcomeIndia} />

      {/* ── TRUST STRIP ── */}
      <TrustStrip />
<ServicesVideoSection />

      {/* ── WEDGE BLOCK ── */}
      {/* <WedgeBlock /> */}

      {/* ── PLANS SPOTLIGHT ── */}
      <section style={{ backgroundColor: "#FAF6EC" }}>
        <PlansSection category="welcome_india" />
      </section>


      {/* ── ALL PLANS GRID ── */}
      {/* <AllPlansGrid plans={plans} /> */}

      {/* ── COMPARISON TABLE ── */}
      {welcomeIndia !== "true" && (
        <section style={{ backgroundColor: "#FAF6EC" }}>
          <ComparisonTable />
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <HowItWorksWelcomeIndia />

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      

      {/* ── FOUNDER STORY ── */}
      {/* <FounderStoryBlock /> */}

      {/* ── REFERRAL BANNER ── */}
      {/* <ReferralBanner /> */}

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── FOUNDING MEMBER BANNER ── */}
      <FoundingMemberBanner category="welcome_india" />

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
          <p className="text-sm text-[#C9A24B] mb-1">
            CIN : U80100MH2025PTC442268
          </p>
          <p className="text-sm text-[#C9A24B] mb-2">
            PSARA Licence : PSA/L/21/MH/2026/MAY/3/6271
          </p>
          <p className="text-[#C9A24B] text-xs max-w-xs mx-auto mb-4 font-light">
            Where Every Journey Becomes an Arrival.
          </p>
          <p className="text-gray-600 text-xs max-w-sm mx-auto mb-6 font-light leading-relaxed">
            89, 2nd Flr, 138/148, Mahendra Chamber, Empire Building,
            <br />
            Dr. Dadabhai Nowroji Road, Stock Exchange,
            <br />
            Opp. CSMT Fort, Mumbai – 400001
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
                name: "Membership Terms",
                href: "/terms",
              },
              {
                name: "Refund Policy",
                href: "https://wensforce.com/cancellation-refund-policy/",
              },
              { name: "Contact Us", href: "https://wensforce.com/contact-us/" },
            ].map((item) => (
              <a
                key={item.name}
                target={item.href.startsWith("/") ? "_self" : "_blank"}
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
              href="mailto:concierge@wensforce.com"
              className="hover:text-gray-500 transition-colors flex items-center gap-1"
            >
              <Phone size={11} />
              concierge@wensforce.com
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
