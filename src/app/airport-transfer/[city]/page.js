import ReactDOM from "react-dom";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { getCity, getCitySlugs } from "../../data/airportTransfer";
import Header from "../../components/Header";
import AirportTransferPlans from "../../components/AirportTransferPlans";
import TrustStrip from "../../components/TrustStrip";
import TierQuiz from "../../components/TierQuiz";
import PressPartnerWall from "../../components/PressPartnerWall";
import ExitIntentPopup from "../../components/ExitIntentPopup";
import TestimonialsSection from "../../components/TestimonialsSection";
import FAQSection from "../../components/FAQSection";
import HeroSection from "../../components/HeroSection";
import JsonLd from "../../components/JsonLd";
import ScrollExpand from "../../components/ScrollExpand";
import MouseFollowBtn from "../../components/MouseFollowBtn";

const WA_NUMBER = "917304607954";
const BASE_URL = "https://subscription.wensforce.com";

export async function generateStaticParams() {
  return getCitySlugs().map((city) => ({ city }));
}

export async function generateMetadata({ params }) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};

  const { metadata } = city;
  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical:
        metadata.canonical ?? `${BASE_URL}/airport-transfer/${city.slug}`,
    },
  };
}

export default async function AirportTransferCityPage({
  params,
  searchParams,
}) {
  const { city: citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) notFound();

  const { videoUrl } = await searchParams;
  const path = `/airport-transfer/${city.slug}`;
  const heroWaUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    city.whatsappMessage,
  )}`;

  const headerCta = {
    label: "View Plans",
    href: `${path}#plans`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `WENS Force Airport Transfer ${city.name}`,
    itemListElement: city.plans.map((plan, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `WENS Force ${plan.name}`,
        description: plan.tagline,
        url: `${BASE_URL}/membership/${plan.id}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: plan.price,
          availability: "https://schema.org/InStock",
          url: `${BASE_URL}/booking/${plan.id}`,
        },
      },
    })),
  };

  const faqCtaMessage =
    city.faqSection?.cta?.message ??
    "Hi, I have a question about WENS Force membership.";

  const posterUrl = city.hero.posterUrl;

  ReactDOM.preload(posterUrl, { as: "image", fetchPriority: "high" }); // add

  return (
    <div className="min-h-screen relative">
      <JsonLd data={faqSchema} />
      <JsonLd data={itemListSchema} />
      <Suspense fallback={null}>
        <Header
          cta={headerCta}
          showNavLinks={city.slug !== "mumbai"}
        />
      </Suspense>

      <HeroSection
        videoUrl={videoUrl || city.hero.defaultVideoUrl}
        posterUrl={posterUrl}
        announcement={city.hero.announcement}
        eyebrow={city.hero.eyebrow}
        heading={city.hero.heading}
        addon={city.hero.addon}
        license={city.hero.license}
        subtitle={city.hero.subtitle}
        ctas={[
          { text: "View Plans", url: "#plans" },
          {
            text: "Talk to Our Concierge",
            url: heroWaUrl,
            variant: "secondary",
            showWhatsApp: true,
          },
        ]}
        trustItems={city.hero.trustItems}
      />

      <TrustStrip />

      <ScrollExpand
        src={city.scrollExpand.src}
        mediaType={city.scrollExpand.mediaType}
        alt={city.scrollExpand.alt}
        useWindowScroll
      >
        <MouseFollowBtn text="View Plans" url="#plans" />
      </ScrollExpand>

      <AirportTransferPlans plans={city.plans} />

      <TierQuiz catalog="airport-transfer" />

      <TestimonialsSection
        eyebrow={city.testimonialsSection.eyebrow}
        heading={city.testimonialsSection.heading}
        subheading={city.testimonialsSection.subheading}
        testimonials={city.testimonials}
      />

      <PressPartnerWall />

      <FAQSection
        eyebrow={city.faqSection.eyebrow}
        heading={city.faqSection.heading}
        subheading={city.faqSection.subheading}
        faqs={city.faqs}
        cta={{
          title: city.faqSection.cta.title,
          description: city.faqSection.cta.description,
          text: city.faqSection.cta.text,
          url: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(faqCtaMessage)}`,
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
              { name: "Privacy Policy", href: "/privacy-policy" },
              {
                name: "Terms & Conditions",
                href: "https://wensforce.com/disclaimer-terms-of-services/",
              },
              { name: "Membership Terms", href: "/terms" },
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
