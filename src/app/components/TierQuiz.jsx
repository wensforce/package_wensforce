"use client";

import { useState, Suspense } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { plans as membershipPlans } from "../data/plans";
import { plans as welcomeIndiaPlans } from "../data/welcomeIndia";
import { plans as airportConciergePlans } from "../data/airportConcierge";
import { plans as airportTransferPlans } from "../data/airportTransfer";

const WA_NUMBER = "917304607954";

const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

function planById(list, id) {
  return list.find((p) => p.id === id);
}

function buildTiers(list, entries) {
  return entries.map(({ id, min, max, tagline }) => {
    const plan = planById(list, id);
    return {
      min,
      max,
      id: plan?.id || id,
      name: plan?.name || id,
      tagline: tagline || plan?.tagline || "",
      price: plan ? `${INR(plan.price)}* + GST 18% Extra` : "",
      image: plan?.image || "/Logo.png",
    };
  });
}

const MEMBERSHIP_QUESTIONS = [
  {
    q: "How often do you travel for business or family per year?",
    options: ["Less than 5 trips", "5–15 trips", "15+ trips"],
    scores: [1, 2, 3],
  },
  {
    q: "Do you typically travel alone or with family?",
    options: [
      "Alone, mostly business",
      "With spouse/acquaintances",
      "Full family, often with children/parents",
    ],
    scores: [1, 2, 3],
  },
  {
    q: "How important is on-site security for you?",
    options: ["Nice to have", "Important for some trips", "Critical — always"],
    scores: [1, 2, 3],
  },
  {
    q: "Do you visit religious destinations annually?",
    options: [
      "Rarely",
      "1–2 pilgrimages a year",
      "Multiple, plus VIP access desired",
    ],
    scores: [1, 2, 3],
  },
  {
    q: "What level of vehicle do you currently use?",
    options: ["Sedan", "Sedan + occasional SUV", "Premium SUV, always"],
    scores: [1, 2, 3],
  },
];

const ARRIVAL_QUESTIONS = [
  {
    q: "How often do you arrive at Indian airports?",
    options: ["Rarely / once a year", "A few times a year", "Monthly or more"],
    scores: [1, 2, 3],
  },
  {
    q: "Who usually travels with you on arrival?",
    options: ["Just me", "Couple / small group", "Family or larger party"],
    scores: [1, 2, 3],
  },
  {
    q: "How important is personal security on arrival?",
    options: ["Nice to have", "Preferred for most trips", "Essential every time"],
    scores: [1, 2, 3],
  },
  {
    q: "Do you need meet & assist inside the terminal?",
    options: [
      "Just a car at the curb",
      "Help from arrivals to the car",
      "Full concierge from plane to doorstep",
    ],
    scores: [1, 2, 3],
  },
  {
    q: "What vehicle experience do you prefer?",
    options: ["Reliable sedan / SUV", "Luxury sedan", "Luxury MPV + escort"],
    scores: [1, 2, 3],
  },
];

const TRANSFER_QUESTIONS = [
  {
    q: "How often do you need Mumbai airport transfers?",
    options: ["Occasionally", "A few times a year", "Frequently"],
    scores: [1, 2, 3],
  },
  {
    q: "Who typically rides with you?",
    options: ["Solo", "2–3 people", "Family / group of 4+"],
    scores: [1, 2, 3],
  },
  {
    q: "How important is security during the transfer?",
    options: ["Not needed", "One officer preferred", "Escort / convoy level"],
    scores: [1, 2, 3],
  },
  {
    q: "How much luggage do you usually travel with?",
    options: ["Light (1–2 bags)", "Standard (upto 3)", "Heavy / multiple bags"],
    scores: [1, 2, 3],
  },
  {
    q: "What vehicle do you prefer for the transfer?",
    options: ["Sedan", "Premium camry / SUV", "Luxury MPV"],
    scores: [1, 2, 3],
  },
];

const CATALOGS = {
  membership: {
    productWord: "membership",
    priceUnit: "/year",
    eyebrow: "Not Sure Which Tier?",
    headline: "Find Your Tier in 60 Seconds",
    blurb:
      "Answer 5 quick questions and we'll recommend the perfect membership for your lifestyle — and send the brochure to your WhatsApp.",
    questions: MEMBERSHIP_QUESTIONS,
    tiers: buildTiers(membershipPlans, [
      {
        id: "essential",
        min: 5,
        max: 7,
        tagline: "Built for the frequent solo traveller.",
      },
      {
        id: "executive",
        min: 8,
        max: 9,
        tagline: "Built for the rising professional & growing family.",
      },
      {
        id: "premium",
        min: 10,
        max: 11,
        tagline: "Where armed protection meets pilgrimage convenience.",
      },
      {
        id: "elite",
        min: 12,
        max: 13,
        tagline: "Where C-suite executives travel.",
      },
      {
        id: "sovereign",
        min: 14,
        max: 15,
        tagline: "The pinnacle — no compromises, anywhere.",
      },
    ]),
  },
  "welcome-india": {
    productWord: "package",
    priceUnit: "",
    eyebrow: "Not Sure Which Package?",
    headline: "Find Your Arrival Package in 60 Seconds",
    blurb:
      "Answer 5 quick questions and we'll recommend the Welcome India package that fits your arrival — then connect you with our concierge.",
    questions: ARRIVAL_QUESTIONS,
    tiers: buildTiers(welcomeIndiaPlans, [
      {
        id: "touch-red-carpet",
        min: 5,
        max: 7,
        tagline: "A clean, assured airport transfer with security.",
      },
      {
        id: "comfortable-arrival",
        min: 8,
        max: 9,
        tagline: "Premium arrival comfort without the fuss.",
      },
      {
        id: "arrive-in-style",
        min: 10,
        max: 11,
        tagline: "Mercedes-led style for a memorable arrival.",
      },
      {
        id: "arrival-in-grandeur",
        min: 12,
        max: 13,
        tagline: "Elevated grandeur for VIP first impressions.",
      },
      {
        id: "ultimate-convoy-matrix",
        min: 14,
        max: 15,
        tagline: "Full convoy assurance for the highest stakes.",
      },
    ]),
  },
  "airport-concierge": {
    productWord: "package",
    priceUnit: "",
    eyebrow: "Not Sure Which Package?",
    headline: "Find Your Concierge Package in 60 Seconds",
    blurb:
      "Answer 5 quick questions and we'll recommend the Mumbai airport concierge package that matches how you arrive.",
    questions: ARRIVAL_QUESTIONS,
    tiers: buildTiers(airportConciergePlans, [
      {
        id: "fearless-arrival",
        min: 5,
        max: 7,
        tagline: "SUV + chauffeur + bodyguard — clean and assured.",
      },
      {
        id: "luxury-arrival",
        min: 8,
        max: 9,
        tagline: "Luxury sedan arrival with personal security.",
      },
      {
        id: "aerobridge-welcome",
        min: 10,
        max: 11,
        tagline: "Inside-airport concierge plus luxury transfer.",
      },
      {
        id: "signature-plane-to-doorstep",
        min: 12,
        max: 13,
        tagline: "Plane-to-doorstep with armed protection.",
      },
      {
        id: "sovereign-arrival",
        min: 14,
        max: 15,
        tagline: "Escort-level arrival for the highest assurance.",
      },
    ]),
  },
  "airport-transfer": {
    productWord: "package",
    priceUnit: "",
    eyebrow: "Not Sure Which Transfer?",
    headline: "Find Your Transfer Package in 60 Seconds",
    blurb:
      "Answer 5 quick questions and we'll recommend the Mumbai airport transfer that fits your ride, security, and group size.",
    questions: TRANSFER_QUESTIONS,
    tiers: buildTiers(airportTransferPlans, [
      {
        id: "transfer-fearless-arrival",
        min: 5,
        max: 8,
        tagline: "Mercedes E-Class with chauffeur and personal security.",
      },
      {
        id: "transfer-luxury-arrival",
        min: 9,
        max: 11,
        tagline: "GLS SUV with escort car and 2 security officers.",
      },
      {
        id: "transfer-aerobridge-welcome",
        min: 12,
        max: 15,
        tagline: "Hands-free aerobridge welcome with V-Class transfer.",
      },
    ]),
  },
};

function detectCatalog(pathname, searchParams) {
  if (pathname?.includes("airport-transfer")) return "airport-transfer";
  if (pathname?.includes("airport-concierge")) return "airport-concierge";
  if (searchParams?.get("welcomeIndia") === "true") return "welcome-india";
  return "membership";
}

function getTier(tiers, total) {
  return tiers.find((t) => total >= t.min && total <= t.max) || tiers[Math.floor(tiers.length / 2)];
}

export default function TierQuiz({ catalog: catalogProp }) {
  return (
    <Suspense fallback={null}>
      <TierQuizInner catalog={catalogProp} />
    </Suspense>
  );
}

function TierQuizInner({ catalog: catalogProp }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const catalogKey =
    catalogProp && CATALOGS[catalogProp]
      ? catalogProp
      : detectCatalog(pathname, searchParams);
  const catalog = CATALOGS[catalogKey] || CATALOGS.membership;
  const questions = catalog.questions;

  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const total = scores.reduce((a, b) => a + b, 0);
  const recommended = getTier(catalog.tiers, total);

  const handleOption = (score) => {
    setLeaving(true);
    setTimeout(() => {
      setScores([...scores, score]);
      setStep(step + 1);
      setLeaving(false);
    }, 250);
  };

  const handleAskConcierge = () => {
    const unit = catalog.priceUnit ? catalog.priceUnit : "";
    const msg = `Hi WENS Force, I just took your quiz and got ${recommended.name} (${recommended.price}${unit}). I'd like to know more about this ${catalog.productWord} and how to get started. Please advise.`;
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  const handleBookNow = () => {
    router.push(`/booking/${recommended.id}`);
  };

  const reset = () => {
    setStarted(false);
    setStep(0);
    setScores([]);
    setSubmitted(false);
    setLeaving(false);
  };

  return (
    <section
      id="tier-quiz"
      className="py-20 px-6"
      style={{ backgroundColor: "#FAF6EC" }}
    >
      <div className="max-w-2xl mx-auto">
        {!started ? (
          <div className="text-center">
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
              {catalog.eyebrow}
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-4">
              {catalog.headline}
            </h2>
            <p className="text-gray-500 text-base font-light mb-8 max-w-sm mx-auto">
              {catalog.blurb}
            </p>
            <button
              onClick={() => setStarted(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
              style={{ backgroundColor: "#0B1E3F" }}
            >
              Start the Quiz →
            </button>
          </div>
        ) : step < questions.length ? (
          <div
            className={`bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 ${leaving ? "quiz-out" : "quiz-in"}`}
          >
            <div className="flex items-center gap-1.5 mb-8">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className="h-2 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      i < step ? "#C9A24B" : i === step ? "#0B1E3F" : "#E2E8F0",
                  }}
                />
              ))}
            </div>

            <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-3 font-medium">
              Question {step + 1} of {questions.length}
            </p>
            <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#0B1E3F] mb-8 leading-snug">
              {questions[step].q}
            </h3>

            <div className="space-y-3">
              {questions[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOption(questions[step].scores[i])}
                  className="w-full text-left px-5 py-4 rounded-2xl border-2 border-gray-100 text-gray-700 text-sm font-medium hover:border-[#C9A24B] hover:bg-[#FAF6EC] hover:text-[#0B1E3F] transition-all duration-200 min-h-[56px]"
                >
                  {opt}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={() => {
                  setScores(scores.slice(0, -1));
                  setStep(step - 1);
                }}
                className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
        ) : submitted ? (
          <div className="text-center bg-white rounded-3xl p-10 shadow-xl border border-gray-100 quiz-in">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#0B1E3F] mb-2">
              Sent to WhatsApp!
            </h3>
            <p className="text-gray-500 text-sm font-light mb-6">
              Your personalised <strong>{recommended.name}</strong> brochure is
              on its way. Our concierge will follow up within 30 minutes.
            </p>
            <button
              onClick={reset}
              className="text-[#C9A24B] text-sm font-semibold hover:underline"
            >
              Retake the quiz →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 quiz-in">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-2 font-medium">
              Your Recommended {catalog.productWord === "membership" ? "Tier" : "Package"}
            </p>
            <h2
              className="font-serif-display text-4xl font-bold mb-1"
              style={{ color: "#C9A24B" }}
            >
              {recommended.name}
            </h2>

            <p className="text-gray-500 text-sm italic mb-6">
              {recommended.tagline}
            </p>

            <div className="w-full aspect-[2/1] mb-6 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recommended.image}
                alt={recommended.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="bg-[#FAF6EC] rounded-2xl p-5 mb-8">
              <p className="text-[#0B1E3F] text-sm font-light leading-relaxed">
                Based on your answers, you&apos;ll get the most value from the{" "}
                <strong>{recommended.name}</strong> {catalog.productWord} at{" "}
                <strong className="text-[#C9A24B]">
                  {recommended.price}
                  {catalog.priceUnit}
                </strong>
                {catalog.productWord === "membership" ? ", all-inclusive." : "."}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleBookNow}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "#0B1E3F" }}
              >
                Book {recommended.name} Now →
              </button>
              <button
                onClick={handleAskConcierge}
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl text-white font-semibold text-sm whitespace-nowrap transition-all hover:opacity-90 border-2"
                style={{ backgroundColor: "#25D366", borderColor: "#25D366" }}
              >
                <svg viewBox="0 0 32 32" width="16" height="16" fill="white">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
                </svg>
                Ask Concierge on WhatsApp
              </button>
            </div>
            <button
              onClick={reset}
              className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Retake the quiz
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
