import { Suspense } from "react";
import { Car, Phone, Shield, Star } from "lucide-react";
import { plans } from "../data/airportConcierge";
import testimonials from "../data/testimonials";
import Header from "../components/Header";
import HowItWorks from "../components/HowItWorks";
import AirportConciergePlans from "../components/AirportConciergePlans";
import TrustStrip from "../components/TrustStrip";
import WedgeBlock from "../components/WedgeBlock";
import TierQuiz from "../components/TierQuiz";
import PressPartnerWall from "../components/PressPartnerWall";
import ExitIntentPopup from "../components/ExitIntentPopup";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import HeroSection from "../components/HeroSection";
import JsonLd from "../components/JsonLd";

export const metadata = {
  title:
    "WENS Force — India's Only Luxury Travel + Armed Protection + Darshan Subscription",
  description:
    "Five tiers. One annual fee. Vehicle, bodyguard, and lifestyle privileges pre-arranged for the year. Darshan at Tirupati, Vaishno Devi, Mahakaleshwar. PSARA-licensed security. From ₹24,999/year.",
  alternates: {
    canonical: "https://subscription.wensforce.com/airport-concierge-bom",
  },
};

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

const headerNav = [
  { label: "Plans", href: "/airport-concierge-bom#plans" },
  { label: "How It Works", href: "/airport-concierge-bom#how-it-works" },
  { label: "Testimonials", href: "/airport-concierge-bom#testimonials" },
  { label: "Membership", href: "/" },
  { label: "Expo", href: "/expo" },
  { label: "Welcome India", href: "/?welcomeIndia=true" },
  { label: "Mumbai Darshan", href: "/airport-concierge-bom" },
  { label: "Airport Transfer", href: "/airport-transfer-bom-mb" },
];

const headerCta = { label: "View Plans", href: "/airport-concierge-bom#plans" };

const DEFAULT_HERO_VIDEO =
  "https://d2zcmp43lwd2kr.cloudfront.net/videos/hero_video.mp4";

export default async function AirportConciergeBomPage({ searchParams }) {
  const { videoUrl } = await searchParams;
  const heroWaUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    "Hi WENS Force, I'm exploring your subscription. Can you help me find the right tier?",
  )}`;
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
    name: "WENS Force Airport Concierge Mumbai",
    itemListElement: plans.map((plan, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `WENS Force ${plan.name}`,
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
        <Header navItems={headerNav} cta={headerCta} />
      </Suspense>

      <HeroSection
        videoUrl={videoUrl || DEFAULT_HERO_VIDEO}
        announcement={[
          "Founding 100 Programme",
          "Limited Sovereign spots available",
          "Charter members locked at current pricing permanently",
        ]}
        eyebrow={"Est. 2008\u00A0·\u00A0India's Premium Subscription"}
        heading={[
          "India's Only Luxury Mumbai Darshan for",
          "Luxury Travel + Close Protection",
        ]}
        addon={{ value: "Darshan" }}
        license={{
          label: "PSARA LICENSE",
          value: "PSA/L/21/MH/2026/MAY/3/6271",
        }}
        subtitle="Five tiers. One annual fee. Everything pre-arranged for the year."
        ctas={[
          { text: "View Plans", url: "#plans" },
          {
            text: "Talk to Our Concierge",
            url: heroWaUrl,
            variant: "secondary",
            showWhatsApp: true,
          },
        ]}
        trustItems={["Instant Activation", "No Hidden Fees"]}
      />

      <TrustStrip />

      <WedgeBlock
        eyebrow="India's Only"
        heading="Three Things Only WENS Force Does in India."
        subheading="Blacklane has chauffeurs. Wheely has chauffeurs. Uber Black has chauffeurs. Nobody else has this combination."
        cards={[
          {
            icon: Star,
            title: "Darshan, Booked For You",
            description:
              "Tirupati Suprabhatam. Vaishno Devi Helicopter. Mahakaleshwar Bhasm Aarti. Booked in your name within 48 hours by your personal concierge.",
            link: {
              text: "Available from Premium tier",
              url: "/membership/premium",
            },
          },
          {
            icon: Shield,
            title: "Armed Protection, Vetted & Trained",
            description:
              "Ex-Defence and ex-Police personnel. PSARA-Compliant under Indian law. NDA-bound. Briefed on your full itinerary 24 hours in advance.",
            link: {
              text: "Available from Premium tier",
              url: "/membership/premium",
            },
          },
          {
            icon: Car,
            title: "Luxury Vehicles, Ready in 10 Minutes",
            description:
              "Mercedes E-Class, BMW 7 Series, Audi Q7. Pre-positioned across cities. Average dispatch time under 12 minutes, guaranteed.",
            link: {
              text: "Available from Essential tier",
              url: "/membership/essential",
            },
          },
        ]}
        note={{
          title: "Family-Transferable.",
          description:
            "One subscription. Your spouse, children, and parents — all covered. Sovereign members get a dedicated booking line for their spouse.",
        }}
      />

      <section style={{ backgroundColor: "#FAF6EC" }}>
        <AirportConciergePlans plans={plans} />
      </section>

      <TierQuiz catalog="airport-concierge" />

      <HowItWorks />

      <TestimonialsSection
        eyebrow="Member Stories"
        heading="How Our Members Travel"
        subheading="HNI members across India — in their own words. Click to watch their stories."
        testimonials={testimonials}
      />

      <PressPartnerWall />

      <FAQSection
        eyebrow="Your Questions"
        heading="Honest Answers"
        subheading="The questions serious buyers ask — answered plainly."
        faqs={faqs}
        cta={{
          title: "Still have a question?",
          description: "Our concierge is available 24×7.",
          text: "Ask on WhatsApp",
          url: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I have a question about WENS Force membership.")}`,
        }}
      />

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
                href: "/privacy-policy",
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

      <div className="h-16 md:hidden" />

      <ExitIntentPopup />
    </div>
  );
}
