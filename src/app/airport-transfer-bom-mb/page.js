import { Suspense } from "react";
import { Car, Phone, Shield, Star } from "lucide-react";
import { plans } from "../data/airportTransfer";
import Header from "../components/Header";
import HowItWorks from "../components/HowItWorks";
import AirportTransferPlans from "../components/AirportTransferPlans";
import TrustStrip from "../components/TrustStrip";
import WedgeBlock from "../components/WedgeBlock";
import TierQuiz from "../components/TierQuiz";
import PressPartnerWall from "../components/PressPartnerWall";
import ExitIntentPopup from "../components/ExitIntentPopup";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import HeroSection from "../components/HeroSection";
import JsonLd from "../components/JsonLd";
import ScrollExpand from "../components/ScrollExpand";
import MouseFollowBtn from "../components/MouseFollowBtn";

export const metadata = {
  title:
    "Mumbai Airport Transfer – Luxury Car, Chauffeur & Security | WENS Force International Pvt Ltd",
  description:
    "Flight-monitored BOM airport transfers with a bilingual chauffeur, luxury vehicle & dedicated protection officer — all managed from one command centre.",
  alternates: {
    canonical: "https://subscription.wensforce.com/airport-transfer-bom-mb",
  },
};

const WA_NUMBER = "917304607954";

const headerNav = [
  { label: "Plans", href: "/airport-transfer-bom-mb#plans" },
  { label: "How It Works", href: "/airport-transfer-bom-mb#how-it-works" },
  { label: "Testimonials", href: "/airport-transfer-bom-mb#testimonials" },
  { label: "Membership", href: "/" },
  { label: "Expo", href: "/expo" },
  { label: "Welcome India", href: "/?welcomeIndia=true" },
  { label: "Mumbai Darshan", href: "/airport-concierge-bom" },
  { label: "Airport Transfer", href: "/airport-transfer-bom-mb" },
];

const headerCta = {
  label: "View Plans",
  href: "/airport-transfer-bom-mb#plans",
};

const testimonials = [
  {
    name: "Customer 1",
    role: "Business Person",
    avatar: "/testimonials/no_profile.png",
    bannerImage: "/testimonials/Business Person customer-1.jpeg",
    videoUrl:
      "https://subscription-package.s3.ap-south-1.amazonaws.com/Packages+Videos/Testimonials/Business+Person+customer-1+.mp4",
  },
  {
    name: "Customer 2",
    role: "Business Person",
    avatar: "/testimonials/no_profile.png",
    bannerImage: "/testimonials/Business Person customer-2.png",
    videoUrl:
      "https://subscription-package.s3.ap-south-1.amazonaws.com/Packages+Videos/Testimonials/Business+Person+Customer-2.mp4",
  },
  {
    name: "Customer 3",
    role: "Business Person",
    avatar: "/testimonials/no_profile.png",
    bannerImage: "/testimonials/Business Person Customer-3.png",
    videoUrl:
      "https://subscription-package.s3.ap-south-1.amazonaws.com/Packages+Videos/Testimonials/Business+Person+Customer-3.mp4",
  },
  {
    name: "Vipul",
    role: "Business Person",
    avatar: "/testimonials/no_profile.png",
    plan: "LUXURY ARRIVAL",
    bannerImage: "/testimonials/Vipul Business person.jpeg",
    videoUrl:
      "https://subscription-package.s3.ap-south-1.amazonaws.com/Packages+Videos/Testimonials/Vipul+Business+person+.mp4",
  },
  {
    name: "Kartik Giri",
    role: "Giri Zever Mahal Owner",
    plan: "AEROBRIDGE WELCOME",
    avatar: "/testimonials/kartik_profile.png",
    profileUrl: "https://www.instagram.com/_kaartikgiri/",
    bannerImage: "/testimonials/Kartik Giri content creator.jpeg",
    videoUrl:
      "https://subscription-package.s3.ap-south-1.amazonaws.com/Packages+Videos/Testimonials/Kartik+Giri+content+creator+.mp4",
  },
  {
    name: "Pakashi",
    role: "Business Person",
    plan: "LUXURY ARRIVAL",
    bannerImage: "/testimonials/Pakashi Business person.jpeg",
    avatar: "/testimonials/Pakashi Business person.jpeg",
    videoUrl:
      "https://subscription-package.s3.ap-south-1.amazonaws.com/Packages+Videos/Testimonials/Pakashi+Business+Person+.mp4",
  },

  {
    name: "Customer 4",
    role: "Business Person",
    avatar: "/testimonials/no_profile.png",
    bannerImage: "/testimonials/Business Person Customer-4.jpeg",
    videoUrl:
      "https://subscription-package.s3.ap-south-1.amazonaws.com/Packages+Videos/Testimonials/Business+Person+Customer-4.mp4",
  },
  {
    name: "Customer 5",
    role: "Business Person",
    avatar: "/testimonials/no_profile.png",
    bannerImage: "/testimonials/Business Person Customer-5.jpeg",
    videoUrl:
      "https://subscription-package.s3.ap-south-1.amazonaws.com/Packages+Videos/Testimonials/Business+Person+Customer-5.mp4",
  },
];

const faqs = [
  {
    q: "How do I book an airport transfer?",
    a: "Choose a package under <b>View Plans</b>, or tap <b>Talk to Our Concierge</b> and share your flight details. Once confirmed, you get <b>one command-centre number</b> for the whole journey.",
  },
  {
    q: "What is the difference between Classic, Luxury and Aerobridge Welcome?",
    a: "All three are <b>single-use arrival packages</b> for Mumbai (BOM). They differ in vehicle, number of officers and how far into the terminal we meet you. <b>Classic Arrival</b> (<b>₹15,000 + 18% GST</b>): Mercedes E-Class, 1 unarmed PSO, luggage up to 60 kg. <b>Luxury Arrival</b> (<b>₹35,000 + 18% GST</b>): Mercedes GLS with escort car, 2 unarmed PSOs, luggage up to 70 kg. <b>Aerobridge Welcome</b> (<b>₹40,000 + 18% GST</b>): Mercedes V-Class, 1 unarmed PSO, luggage up to 100 kg.",
  },
  {
    q: "Can I book for a guest, family member or client?",
    a: "<b>Yes.</b> Share the passenger's name and flight details when booking. The greeting and placard are in their name, and <b>billing stays with you</b>.",
  },
  {
    q: "Which airport and terminal do you cover?",
    a: "Chhatrapati Shivaji Maharaj International Airport, Mumbai (<b>BOM</b>). Classic and Luxury guests are received at the <b>T2 arrival gate</b>.",
  },
  {
    q: "Where will I be met?",
    a: "Classic and Luxury guests are met with a <b>placard at the T2 arrival gate</b>. With <b>Aerobridge Welcome</b>, we meet you at the aerobridge, with a buggy porter and a <b>hands-free escort</b> to your car.",
  },
  {
    q: "What if my flight is delayed, early or diverted?",
    a: "<b>Flight monitoring is included in every package.</b> We track your live status and adjust the pickup automatically at <b>no extra charge</b>.",
  },
  {
    q: "Will the car be ready when I land?",
    a: "<b>Yes.</b> We stage the vehicle <b>before your flight arrives</b>, so the car is waiting for you, not the other way around.",
  },
  {
    q: "Who handles my luggage?",
    a: "A porter assists you to the car. Allowances are <b>60 kg (Classic)</b>, <b>70 kg (Luxury)</b> and <b>100 kg (Aerobridge Welcome)</b>. Tell us at booking if you have extra bags.",
  },
  {
    q: "Is VIP parking included?",
    a: "<b>Yes</b>, in all three packages.",
  },
  {
    q: "Are your officers licensed?",
    a: "<b>Yes.</b> WENS Force is a <b>PSARA-licensed</b> security company, operating since 2008 (Licence <b>PSA/L/21/MH/2026/3/6271</b>).",
  },
  {
    q: "Will the security presence look conspicuous?",
    a: "<b>No.</b> Our officers dress appropriately and keep a <b>low profile</b>. Protection should feel calm, not like a scene.",
  },
  {
    q: "Do you provide armed officers?",
    a: "Every package includes trained <b>unarmed</b> Personal Security Officers. <b>Armed protection can be arranged on request</b>, subject to the required clearances.",
  },
  {
    q: "Can I request a female officer?",
    a: "<b>Yes.</b> Mention it when booking so we can staff accordingly.",
  },
  {
    q: "What vehicles do you use?",
    a: "<b>Mercedes E-Class, GLS or V-Class</b> by package. If the exact car is unavailable, you get an equivalent such as a BMW 5 Series, Audi or Toyota Vellfire.",
  },
  {
    q: "Are chauffeurs bilingual?",
    a: "<b>Yes.</b> Every transfer comes with a <b>bilingual chauffeur</b>.",
  },
  {
    q: "Are prices inclusive of GST?",
    a: "<b>No.</b> <b>18% GST</b> is added on top, and the full amount is shown at checkout before you pay.",
  },
  {
    q: "What payment methods do you accept?",
    a: "<b>Cards, UPI and net-banking</b>, plus all major currencies and cards from <b>more than 195 sovereign countries</b> via our international payment gateway at checkout. For corporate bookings or GST invoices, the concierge can raise an invoice directly.",
  },
  {
    q: "What is your cancellation and refund policy?",
    a: "Cancellations and refunds follow our <b>Refund Policy</b> (https://wensforce.com/cancellation-refund-policy/). For any change, message the concierge and we will process it under those terms.",
  },
  {
    q: "Can my family use my package while I am abroad?",
    a: "<b>Yes.</b> Benefits can be extended to <b>immediate family</b> for their Mumbai arrivals. Coordinate through your concierge so the booking links to your account.",
  },
  {
    q: "Do you operate outside Mumbai?",
    a: "Our core airport-transfer operation is Mumbai (BOM). We have coverage in <b>9 major cities</b> (Mumbai, Delhi, Hyderabad, Bangalore, Pune, Chennai, Ahmedabad, Kolkata and Lucknow) and have onboarded collaborators <b>PAN India</b>. If you need an arrival elsewhere, ask the concierge and we'll tell you what's possible.",
  },
  {
    q: "How do I reach the concierge?",
    a: "Our desk is available <b>24×7</b> on WhatsApp and phone at <b>+91 73046 07954</b>, or by email at <b>concierge@wensforce.com</b>.",
  },
];

const DEFAULT_HERO_VIDEO =
  "https://d2zcmp43lwd2kr.cloudfront.net/videos/hero_video.mp4";

export default async function AirportTransferBomMbPage({ searchParams }) {
  const { videoUrl } = await searchParams;
  const heroWaUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    "Hi WENS Force, I'm exploring your Airport Transfer Bombay. Can you help me find the right tier?",
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
    name: "WENS Force Airport Transfer Mumbai",
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
          "LIVE — Mumbai Airport Transfers Now Accepting Bookings",
          // "Only 100 Slots Open This Week — PSARA-Licensed Protection Included",
          "Early Access Pricing Ends Soon — Lock Your Rate Before It's Gone",
        ]}
        eyebrow={`SINCE 2008 · MUMBAI AIRPORT TRANSFERS`}
        heading={[`Pay a Little More`, "Worry About Nothing"]}
        addon={{ value: "Aerobridge Welcome" }}
        license={{
          label: "PSARA LICENSE",
          value: "PSA/L/21/MH/2026/MAY/3/6271",
        }}
        subtitle="Flight monitoring, your welcome at the gate, a bilingual chauffeur, a luxury car and a PSARA-compliant protection officer, all run from one WENS Force command centre. One booking. One number. Nobody to chase."
        ctas={[
          { text: "View Plans", url: "#plans" },
          {
            text: "Talk to Our Concierge",
            url: heroWaUrl,
            variant: "secondary",
            showWhatsApp: true,
          },
        ]}
        trustItems={[
          "Flight Monitoring",
          "Aerobridge Welcome",
          "Bilingual Chauffeur",
          "Luxury Car",
          "PSARA-Compliant Officer",
          "Single Command Centre",
        ]}
      />

      <TrustStrip />

      <ScrollExpand
        src={
          "https://subscription-package.s3.ap-south-1.amazonaws.com/Packages+Videos/Main/main-section-2.mp4"
        }
        mediaType="video"
        alt="WENS Force Hero Video"
        useWindowScroll
      >
        <MouseFollowBtn text="View Plans" url="#plans" />
      </ScrollExpand>

      <AirportTransferPlans plans={plans} />

      <TierQuiz catalog="airport-transfer" />

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
