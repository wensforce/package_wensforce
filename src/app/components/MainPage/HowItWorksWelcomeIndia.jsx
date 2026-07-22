"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Shield, CalendarDays, Compass, ArrowRight, Sparkles } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Secure Your Membership",
    time: "Instant Activation",
    description:
      "Select your travel tier and activate your annual subscription. Your membership is protected with secure pricing immediately.",
    color: "#C9A24B",
    icon: Shield,
  },
  {
    num: "02",
    title: "Plan with Your Concierge",
    time: "Pre-arrival Setup",
    description:
      "Your dedicated concierge registers your arrival, coordinates VIP temple darshans, maps preferred routes, and designs security details.",
    color: "#C9A24B",
    icon: CalendarDays,
  },
  {
    num: "03",
    title: "Experience Seamless Travel",
    time: "24/7 Priority Access",
    description:
      "Upon landing or request, your luxury vehicle and PSARA-licensed bodyguard are dispatch-ready in 12 minutes.",
    color: "#C9A24B",
    icon: Compass,
  },
];

export default function HowItWorksWelcomeIndia() {
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden bg-[#f0ece2]"
    >
      {/* Background grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#C9A24B 1px, transparent 1px), linear-gradient(90deg, #C9A24B 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Decorative Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] rounded-full blur-[130px] pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,162,75,0.2) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A24B]/35 bg-[#C9A24B]/8 text-[#a07830] text-[10px] tracking-[0.25em] uppercase font-semibold mb-4">
            <Sparkles size={11} className="animate-pulse" />
            Simple Process
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1E3F] mb-4 tracking-tight leading-tight">
            How It Works
          </h2>
          <p className="text-gray-500 text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
            From activation to your first journey, we make luxury travel in India absolutely effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 relative">
          {/* Connector Line (Desktop) */}
          <div
            className="hidden lg:block absolute top-[52px] left-[15%] right-[15%] h-[1.5px] opacity-40 z-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, #C9A24B 20%, #C9A24B 80%, transparent)",
            }}
          />

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`group relative flex flex-col items-center text-center p-8 rounded-2xl border transition-all duration-700 bg-white border-gray-200/80 hover:border-[#C9A24B]/40 hover:bg-[#FFF] ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: isVisible ? `${idx * 150}ms` : "0ms",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(201, 162, 75, 0.09)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.01)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Connector Dot */}
                <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center">
                  <div className="w-[11px] h-[11px] rounded-full bg-[#C9A24B] border-4 border-[#FAF6EC] shadow-[0_0_8px_rgba(201,162,75,0.6)]" />
                </div>

                {/* Icon wrapper */}
                <div
                  className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 shadow-sm border bg-[#FAF6EC] border-[#C9A24B]/20"
                >
                  <Icon size={24} className="text-[#a07830]" />
                  {/* Step Index floating badge */}
                  <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-[#C9A24B] text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {step.num}
                  </span>
                </div>

                {/* Time Badge */}
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-4 bg-[#C9A24B]/10 border border-[#C9A24B]/20 text-[#a07830]">
                  {step.time}
                </span>

                <h3 className="text-xl font-bold text-[#0B1E3F] mb-3 group-hover:text-[#a07830] transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-light max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="#plans"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-[#050B14] text-sm tracking-wider uppercase transition-all hover:scale-105 hover:shadow-[0_10px_32px_rgba(201,162,75,0.35)]"
            style={{
              background: "linear-gradient(135deg, #C9A24B 0%, #E6C073 100%)",
            }}
          >
            Choose Your Tier
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
          <p className="text-gray-400 text-xs mt-4 font-light">
            No lock-ins &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; Fully transferable to family
          </p>
        </div>
      </div>
    </section>
  );
}
