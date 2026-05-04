'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Users, Navigation } from 'lucide-react';

export default function CarCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const cars = [
    {
      id: 1,
      name: 'BMW 7 Series',
      category: 'Luxury Sedan',
      price: '₹15,000/trip',
      image: 'bg-gradient-to-br from-blue-600 to-blue-800',
      specs: ['V12 Engine', '340 kmph max', 'Leather interior'],
      passengers: 4,
      features: ['Premium sound', 'Massage seats', 'Heated leather'],
    },
    {
      id: 2,
      name: 'Mercedes-AMG S',
      category: 'Performance Luxury',
      price: '₹18,000/trip',
      image: 'bg-gradient-to-br from-gray-700 to-gray-900',
      specs: ['4.0L Twin-Turbo', '315 kmph max', 'AMG tuned'],
      passengers: 4,
      features: ['AIRMATIC suspension', 'Burmester audio', 'Panoramic roof'],
    },
    {
      id: 3,
      name: 'Range Rover',
      category: 'Premium SUV',
      price: '₹16,000/trip',
      image: 'bg-gradient-to-br from-amber-700 to-amber-900',
      specs: ['3.0L V6', '280 kmph max', 'All-terrain'],
      passengers: 7,
      features: ['Terrain modes', 'Air suspension', 'Wifi connectivity'],
    },
    {
      id: 4,
      name: 'Audi A8',
      category: 'Tech-Forward Luxury',
      price: '₹14,000/trip',
      image: 'bg-gradient-to-br from-red-700 to-red-900',
      specs: ['3.0L TFSI', '305 kmph max', 'Matrix LED'],
      passengers: 4,
      features: ['Level 2 autonomy', 'Smart AI', 'Gesture control'],
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % cars.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay, cars.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % cars.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + cars.length) % cars.length);
    setAutoPlay(false);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#F1F3F5] relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#BF9F00] text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            Vehicle Collection
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Curated Fleet of Excellence
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto font-light">
            Every vehicle in our collection is handpicked, meticulously maintained, and driven by professional chauffeurs.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg border border-gray-100">
          {/* Slides Container */}
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            {cars.map((car, idx) => (
              <div
                key={car.id}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                {/* Car Image Background */}
                <div className={`absolute inset-0 ${car.image}`} />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

                {/* Car Details */}
                <div className="relative h-full flex flex-col justify-between p-8 md:p-12 text-white">
                  <div>
                    <p className="text-sm font-semibold tracking-widest uppercase text-[#e8c900] mb-2">
                      Featured Vehicle
                    </p>
                    <h3 className="text-4xl md:text-5xl font-bold mb-2">{car.name}</h3>
                    <p className="text-lg text-white/80 font-light">{car.category}</p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-4 mb-6">
                      {/* Specs */}
                      {car.specs.map((spec, i) => (
                        <div
                          key={i}
                          className="text-sm bg-white/10 backdrop-blur border border-white/20 px-3 py-1.5 rounded-full"
                        >
                          {spec}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-white/60 mb-1">Starting at</p>
                        <p className="text-3xl font-bold text-[#e8c900]">{car.price}</p>
                      </div>
                      <a
                        href="#plans"
                        className="bg-[#BF9F00] text-black font-semibold px-6 py-3 rounded-full hover:bg-[#a88a00] transition-all"
                      >
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between z-10">
            {/* Dots */}
            <div className="flex gap-2">
              {cars.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx);
                    setAutoPlay(false);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-[#BF9F00] w-8' : 'bg-white/40 w-2 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Arrow Buttons */}
            <div className="flex gap-3">
              <button
                onClick={prevSlide}
                onMouseEnter={() => setAutoPlay(false)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <ChevronLeft size={18} className="text-white" strokeWidth={2} />
              </button>
              <button
                onClick={nextSlide}
                onMouseEnter={() => setAutoPlay(false)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
              >
                <ChevronRight size={18} className="text-white" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Zap, label: 'Top Performance', value: '4.0L Twin-Turbo' },
            { icon: Users, label: 'Spacious Interior', value: 'Up to 7 seats' },
            { icon: Navigation, label: 'GPS Tracking', value: '24/7 Location' },
            {
              icon: ChevronRight,
              label: 'Professional Drivers',
              value: 'Verified & Licensed',
            },
          ].map((feature, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-all">
              <feature.icon size={24} className="text-[#BF9F00] mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs text-gray-600 font-medium mb-1">{feature.label}</p>
              <p className="text-sm font-bold text-gray-900">{feature.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
