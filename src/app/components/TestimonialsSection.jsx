'use client';

import { useState, useRef } from 'react';
import { X, Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const testimonials = [
  {
    name: 'Kartik Giri',
    role: 'Giri Zever Mahal Owner',
    plan: 'SOVEREIGN',
    avatar: '/testimonials/kartik_profile.png',
    profileUrl: 'https://www.instagram.com/_kaartikgiri/',
    bannerImage: '/testimonials/kartik_giri.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/kartik_giri.mp4',
    text: 'I\'ve had global concierge services. WENS Force is the first one that actually knows India — the temples, the airports, the security dynamics.',
  },
  {
    name: 'Mark Robber',
    role: 'American YouTuber, engineer and inventor',
    avatar: '/testimonials/mark_profile.png',
    profileUrl: 'https://www.instagram.com/markrober/',
    plan: 'ELITE',
    bannerImage: '/testimonials/mark_robber.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Mark_Robber.mp4',
    text: 'As a woman who travels frequently, the armed escort changed my confidence entirely. My RM knows my schedule before I tell her.',
  },
  {
    name: 'Pink Sweat',
    role: 'American R&B singer and songwriter',
    avatar: '/testimonials/pink_profile.png',
    profileUrl: 'https://www.instagram.com/pinksweats/',
    plan: 'SOVEREIGN',
    bannerImage: '/testimonials/pink_sweat.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Pink_Sweat.mp4',
    text: 'We joined as Executive, upgraded to Sovereign within three months. The difference is in how the family feels.',
  },
  {
    name: 'Turkey Princess',
    role: 'Princess',
    avatar: '/testimonials/no_profile.png',
    plan: 'PREMIUM',
    bannerImage: '/testimonials/turkey_princess.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/your_highness.mp4',
    text: 'I vetted the security protocol before joining. The risk assessment was sharper than what most corporates offer their CEOs.',
  },
  {
    name: 'Mo Vlog',
    role: 'Indian YouTuber with 3M+ subscribers',
    avatar: '/testimonials/mo_vlog_profile.png',
    profileUrl: 'https://www.instagram.com/movlogs/',
    plan: 'SOVEREIGN',
    bannerImage: '/testimonials/mo_vlog.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Movlog_car.mp4',
    text: 'I needed discretion, not drama. The car is there before I ask, the guard blends in, the concierge never asks twice.',
  },
  // {
  //   name: 'Rohan Agarwal',
  //   role: 'Returned NRI — Pune (formerly Singapore)',
  //   avatar: 'RA',
  //   plan: 'ELITE',
  //   bannerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&flip=h',
  //   videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  //   text: 'A friend referred me to WENS Force. Two weeks in, I upgraded from Executive to Elite within 60 days.',
  // },
];

function TestimonialCard({ testimonial, isPlaying, onPlay, onClose }) {
  const pointerStartX = useRef(null);
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (pointerStartX.current === null) return;
    const deltaX = Math.abs(e.clientX - pointerStartX.current);
    pointerStartX.current = null;
    if (deltaX > 50) { onClose(); return; }
    if (videoRef.current) {
      if (videoRef.current.paused) { videoRef.current.play(); setPaused(false); }
      else { videoRef.current.pause(); setPaused(true); }
    }
  };

  if (isPlaying) {
    return (
      <div className="relative rounded-3xl overflow-hidden h-96 flex flex-col">
        <div className="relative w-full h-full bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={testimonial.videoUrl}
            muted
            autoPlay
          />

          {/* Overlay — pointer events unify mouse+touch; touchAction:none prevents browser gesture hijack */}
          <div
            className="absolute inset-0 z-[80] cursor-pointer"
            style={{ touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          />

          {/* Paused indicator */}
          {paused && (
            <div className="absolute inset-0 flex items-center justify-center z-[85] pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                <Play size={32} className="text-white fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Close button — above overlay */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-3 right-3 cursor-pointer z-[90] w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all"
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
      onClick={() => onPlay()}
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
            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover rounded-full" />
          </div>
          <a onClick={(e)=>{
            e.stopPropagation();
          }} 
          target='_blank' href={testimonial.profileUrl} className="min-w-0 flex-1">
            <div className="text-white text-sm font-semibold line-clamp-1">{testimonial.name}</div>
            <div className="text-white/60 text-xs line-clamp-1">{testimonial.role}</div>
          </a>
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
  const [playingName, setPlayingName] = useState(null);

  return (
    <section style={{ backgroundColor: '#0B1E3F' }} className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
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
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
        loop
        slidesPerView={1.2}
        spaceBetween={20}
        grabCursor
        centeredSlides
        allowTouchMove={!playingName}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        breakpoints={{
          640:  { slidesPerView: 1.6, spaceBetween: 24 },
          1024: { slidesPerView: 2.2, spaceBetween: 28 },
          1280: { slidesPerView: 2.5, spaceBetween: 32 },
        }}
        style={{ paddingBottom: '8px' }}
      >
        {testimonials.map((testimonial, i) => (
          <SwiperSlide key={i} style={{ height: 'auto' }}>
            <div>
              <TestimonialCard
                testimonial={testimonial}
                isPlaying={playingName === testimonial.name}
                onPlay={() => setPlayingName(testimonial.name)}
                onClose={() => setPlayingName(null)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
