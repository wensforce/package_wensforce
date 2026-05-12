'use client';

import { useState } from 'react';
import { X, Play } from 'lucide-react';

const testimonials = [
  {
    name: 'Kartik Giri',
    role: 'Managing Partner — Desai Capital Group, Mumbai',
    avatar: 'KG',
    plan: 'SOVEREIGN',
    bannerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    videoUrl: 'https://subscription-wensforce-prod.s3.ap-south-1.amazonaws.com/videos/kartik_giri.mp4',
    text: 'I\'ve had global concierge services. WENS Force is the first one that actually knows India — the temples, the airports, the security dynamics.',
  },
  {
    name: 'Mark Robber',
    role: 'COO — Zenith Pharma, Bangalore',
    avatar: 'MR',
    plan: 'ELITE',
    bannerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=400&fit=crop',
    videoUrl: 'https://subscription-wensforce-prod.s3.ap-south-1.amazonaws.com/videos/Mark_Robber.mp4',
    text: 'As a woman who travels frequently, the armed escort changed my confidence entirely. My RM knows my schedule before I tell her.',
  },
  {
    name: 'Rajiv Singhania',
    role: 'Business Family — Delhi NCR',
    avatar: 'RS',
    plan: 'SOVEREIGN',
    bannerImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    text: 'We joined as Executive, upgraded to Sovereign within three months. The difference is in how the family feels.',
  },
  {
    name: 'Capt. (Retd.) Arun Sharma',
    role: 'Board Director — Infrastructure & Defence Advisory, Hyderabad',
    avatar: 'AS',
    plan: 'PREMIUM',
    bannerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    text: 'I vetted the security protocol before joining. The risk assessment was sharper than what most corporates offer their CEOs.',
  },
  {
    name: 'Anjali Bhatnagar',
    role: 'Independent Film Producer, Mumbai',
    avatar: 'AB',
    plan: 'SOVEREIGN',
    bannerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=400&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    text: 'I needed discretion, not drama. The car is there before I ask, the guard blends in, the concierge never asks twice.',
  },
  {
    name: 'Rohan Agarwal',
    role: 'Returned NRI — Pune (formerly Singapore)',
    avatar: 'RA',
    plan: 'ELITE',
    bannerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&flip=h',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    text: 'A friend referred me to WENS Force. Two weeks in, I upgraded from Executive to Elite within 60 days.',
  },
];

function TestimonialCard({ testimonial }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className="relative rounded-3xl overflow-hidden h-96 flex flex-col">
        {/* Video Container */}
        <div className="relative w-full h-full bg-black">
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-cover"
              src={testimonial.videoUrl}
                controls  
                muted
                autoPlay
            />
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative rounded-3xl overflow-hidden cursor-pointer h-96 flex flex-col justify-end"
      onClick={() => setIsPlaying(true)}
    >
      {/* Banner Image Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: `url('${testimonial.bannerImage}')`,
          backgroundColor: 'rgba(11, 30, 63, 0.6)',
          backgroundBlendMode: 'overlay',
        }}
      />

      {/* Play Button Overlay - Desktop Hover */}
      <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
        <div className="w-16 h-16 rounded-full bg-[#C9A24B] flex items-center justify-center shadow-lg">
          <Play size={32} className="text-black fill-black" />
        </div>
      </div>

      {/* Play Button Badge - Mobile Only */}
      <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-[#C9A24B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 sm:hidden">
        <Play size={20} className="text-black fill-black" />
      </div>

      {/* Gradient Overlay at Bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black via-black/50 to-transparent" />

      {/* Member Info at Bottom */}
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #C9A24B, #a88000)' }}
          >
            {testimonial.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white text-sm font-semibold line-clamp-1">{testimonial.name}</div>
            <div className="text-white/60 text-xs line-clamp-1">{testimonial.role}</div>
          </div>
        </div>
        <span
          className="inline-block text-[8px] font-bold px-2.5 py-1 rounded-full border"
          style={{
            backgroundColor: 'rgba(201,162,75,0.2)',
            color: '#C9A24B',
            borderColor: 'rgba(201,162,75,0.4)',
          }}
        >
          {testimonial.plan}
        </span>
      </div>
    </div>
  );
}



export default function TestimonialsSection() {
  return (
    <section style={{ backgroundColor: '#0B1E3F' }} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
            Member Stories
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mb-3">
            How Our Members Travel
          </h2>
          <p className="text-white/40 text-base font-light">
            HNI members across India — in their own words. Click to watch their stories.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
