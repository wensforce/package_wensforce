'use client';

import { useEffect, useRef, useState } from 'react';
import { Car, ShieldCheck, Sparkles, Users, Navigation, Zap } from 'lucide-react';

export default function FeaturesSection() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Car,
      title: 'Luxury Vehicle Fleet',
      description: 'Access premium BMW, Mercedes, Audi, and Range Rover from our curated collection. From sedans to SUVs, every vehicle is maintained to the highest standards.',
      highlights: ['5-star maintained', 'Latest models', 'GPS tracking'],
      color: 'from-blue-600 to-blue-400',
    },
    {
      icon: ShieldCheck,
      title: 'Professional Bodyguards',
      description: 'Armed and unarmed security personnel, all licensed and background-verified. Discrete, professional, and dedicated to your safety 24/7.',
      highlights: ['Armed & trained', 'Background verified', 'Discrete service'],
      color: 'from-amber-600 to-amber-400',
    },
    {
      icon: Sparkles,
      title: 'Concierge Services',
      description: 'Dedicated relationship managers handle all your bookings, reservations, and special requests. Travel becomes effortless.',
      highlights: ['24/7 availability', 'Personal manager', 'Priority support'],
      color: 'from-purple-600 to-purple-400',
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-20 px-6 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#BF9F00]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 max-w-2xl mx-auto leading-tight">
            Everything for Your Luxury & Security Needs
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto font-light">
            One membership. Three world-class services. Seamlessly integrated for your peace of mind and prestige.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isVisible_ = isVisible;

            return (
              <div
                key={idx}
                className={`group relative rounded-3xl overflow-hidden transition-all duration-700 transform ${
                  isVisible_ ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } hover:shadow-2xl`}
                style={{
                  transitionDelay: isVisible_ ? `${idx * 150}ms` : '0ms',
                }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`} />

                {/* Card Content */}
                <div className="relative p-8 bg-white border border-gray-100 shadow-sm group-hover:border-gray-200 transition-all duration-300">
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-8 h-1 w-12 bg-gradient-to-r ${feature.color} rounded-b-full transition-all group-hover:w-20`} />

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} strokeWidth={1.5} className="text-gray-700" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#BF9F00] transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 font-light">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 mb-6">
                    {feature.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-xs text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#BF9F00]" />
                        {highlight}
                      </div>
                    ))}
                  </div>

                  {/* Learn More Link */}
                  <a
                    href="#plans"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#BF9F00] hover:gap-3 transition-all"
                  >
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
          {[
            { Icon: Navigation, label: 'Instant Dispatch', value: '10 min' },
            { Icon: Users, label: 'Dedicated Manager', value: '24/7' },
            { Icon: Zap, label: 'Priority Access', value: 'Always' },
          ].map((benefit, i) => (
            <div
              key={i}
              className="relative p-4 bg-gradient-to-br from-[#BF9F00]/8 to-transparent border border-[#BF9F00]/20 rounded-2xl text-center hover:border-[#BF9F00]/40 transition-all"
            >
              <benefit.Icon size={20} className="text-[#BF9F00] mx-auto mb-2" strokeWidth={1.5} />
              <div className="text-2xl font-bold text-gray-900 mb-1">{benefit.value}</div>
              <div className="text-xs text-gray-600 font-medium">{benefit.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
