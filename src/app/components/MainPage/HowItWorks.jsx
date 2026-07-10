"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Choose & Activate",
    time: "60 seconds",
    description:
      "Select your tier, complete a quick KYC, and make a single secure annual payment. Your membership activates instantly.",
    color: "#C9A24B",
  },
  {
    num: "02",
    title: "Onboard & Personalise",
    time: "Within 12 hours",
    description:
      "Your dedicated concierge calls to set vehicle preferences, security needs, travel patterns, and pilgrimage wishes.",
    color: "#0B1E3F",
  },
  {
    num: "03",
    title: "Travel & Enjoy",
    time: "Anytime, all year",
    description:
      "Call, WhatsApp, or app — your vehicle and bodyguard are ready in under 12 minutes, any time you need them.",
    color: "#2F855A",
  },
];

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
            Simple Process
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-3">
            From Selection to First Trip in 3 Steps
          </h2>
          <p className="text-gray-500 text-base font-light max-w-md mx-auto">
            Most members are fully onboarded within 4 hours of payment.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 relative">
          {/* Gold connector line (desktop) */}
          <div
            className="hidden lg:block absolute top-16 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-0.5 z-0"
            style={{
              background: "linear-gradient(90deg, #C9A24B, #0B1E3F, #2F855A)",
            }}
          />

          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col items-center text-center px-8 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isVisible ? `${idx * 180}ms` : "0ms" }}
            >
              {/* Number badge */}
              <div
                className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-6 shadow-lg"
                style={{ backgroundColor: step.color }}
              >
                {idx + 1}
              </div>

              {/* Time badge */}
              <span
                className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                style={{
                  backgroundColor: `${step.color}18`,
                  color: step.color,
                }}
              >
                {step.time}
              </span>

              <h3 className="font-serif-display text-xl font-bold text-[#0B1E3F] mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="#plans"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg"
            style={{ backgroundColor: "#0B1E3F" }}
          >
            Start with Step 1 — Choose Your Tier →
          </Link>
          <p className="text-gray-400 text-xs mt-4 font-light">
            ✓ No long-term lock-in &nbsp;·&nbsp; ✓ Instant activation
          </p>
        </div>
      </div>
    </section>
  );
}
