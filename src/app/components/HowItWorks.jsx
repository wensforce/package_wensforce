'use client';

import { useEffect, useRef, useState } from 'react';
import { Gem, Lock, Phone, Car, CheckCircle2 } from 'lucide-react';

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
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Choose Your Plan',
      description: 'Select from 5 carefully crafted membership tiers based on your travel frequency and security needs.',
      icon: Gem,
      color: 'from-blue-600 to-cyan-500',
    },
    {
      number: '02',
      title: 'Secure Payment',
      description: 'One annual payment through our secure gateway. No hidden charges, no surprises.',
      icon: Lock,
      color: 'from-purple-600 to-pink-500',
    },
    {
      number: '03',
      title: 'Onboarding Call',
      description: 'Your dedicated concierge calls within 2 hours to set preferences and answer questions.',
      icon: Phone,
      color: 'from-orange-600 to-red-500',
    },
    {
      number: '04',
      title: 'Book & Travel',
      description: 'Call 24/7 to book. Your luxury vehicle and protection arrive within 10 minutes.',
      icon: Car,
      color: 'from-green-600 to-emerald-500',
    },
    {
      number: '05',
      title: 'Enjoy & Rate',
      description: 'Experience premium service. Share feedback to help us serve you even better.',
      icon: CheckCircle2,
      color: 'from-indigo-600 to-blue-500',
    },
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-0 w-80 h-80 bg-[#BF9F00]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-blue-500/2 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#BF9F00] text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            Simple Process
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 max-w-2xl mx-auto">
            5 Steps to Membership
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto font-light">
            From selection to your first trip — we make the journey smooth and hassle-free.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-28 left-1/2 transform -translate-x-1/2 w-1 h-[calc(100%-120px)] bg-gradient-to-b from-[#BF9F00] via-[#BF9F00]/50 to-transparent" />

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isAnimated = isVisible;

              return (
                <div
                  key={idx}
                  className={`relative transition-all duration-700 transform ${
                    isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: isAnimated ? `${idx * 120}ms` : '0ms',
                  }}
                >
                  {/* Desktop line connector */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-28 left-[calc(100%-20px)] w-12 h-1 bg-gradient-to-r from-[#BF9F00]/30 to-transparent" />
                  )}

                  {/* Step card */}
                  <div className="flex flex-col items-center text-center lg:px-3">
                    {/* Icon circle */}
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} mb-6 flex items-center justify-center shadow-lg ring-4 ring-white transform transition-all hover:scale-110 cursor-pointer`}>
                      <StepIcon size={32} className="text-white" strokeWidth={1.5} />
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-900">{idx + 1}</span>
                      </div>
                    </div>

                    {/* Number badge */}
                    <div className="text-5xl font-bold text-gray-900/10 mb-2">{step.number}</div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-16 p-8 bg-gradient-to-r from-[#BF9F00]/8 to-blue-500/8 border border-[#BF9F00]/20 rounded-2xl">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-700 font-light text-lg mb-3">
              ✓ No long-term contracts &nbsp; • &nbsp; ✓ 15-day money-back guarantee &nbsp; • &nbsp; ✓ Instant benefits activation
            </p>
            <p className="text-gray-600 text-sm">
              Questions? Call our concierge at{' '}
              <a href="tel:+917304607954" className="font-semibold text-[#BF9F00] hover:text-[#a88a00]">
                +91-7304-607954
              </a>{' '}
              anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
