'use client';

import { useState, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
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
    text: "I've had global concierge services. WENS Force is the first one that actually knows India — the temples, the airports, the security dynamics.",
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
    role: 'Dubai-based Iranian YouTuber and vlogger with 11M+ subscribers',
    avatar: '/testimonials/mo_vlog_profile.png',
    profileUrl: 'https://www.instagram.com/movlogs/',
    plan: 'SOVEREIGN',
    bannerImage: '/testimonials/mo_vlog.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Movlog_car.mp4',
    text: "I needed discretion, not drama. The car is there before I ask, the guard blends in, the concierge never asks twice.",
  },
];

function VideoPlayer({ testimonial, onClose }) {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); }
    else { v.pause(); setPaused(true); }
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.currentTime = (val / 100) * v.duration;
    setProgress(val);
  };

  const handleVolume = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  };

  const handleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next && volume === 0) { v.volume = 0.5; setVolume(0.5); }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden h-96 bg-black select-none">

      {/* Video */}
      <video
        ref={videoRef}
        src={testimonial.videoUrl}
        autoPlay
        muted={muted}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        onTimeUpdate={() => {
          const v = videoRef.current;
          if (!v) return;
          setCurrentTime(v.currentTime);
          setProgress((v.currentTime / v.duration) * 100 || 0);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
      />

      {/* Tap-to-pause area — z-10, sits BELOW controls (z-30) */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ zIndex: 10 }}
        onClick={togglePlay}
      />

      {/* Paused indicator */}
      {paused && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 20 }}
        >
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
            <Play size={32} className="text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Close button — z-30 */}
      <button
        className="absolute top-3 right-3 cursor-pointer w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all"
        style={{ zIndex: 30 }}
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {/* Controls bar — z-30, physically above tap overlay so clicks go here first */}
      <div
        className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-8"
        style={{
          zIndex: 30,
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)',
        }}
      >
        {/* Progress */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleSeek}
          className="w-full cursor-pointer mb-3 block"
          style={{ accentColor: '#C9A24B', height: '4px' }}
        />

        {/* Controls row */}
        <div className="flex items-center gap-3">
          <button
            className="cursor-pointer text-white hover:text-[#C9A24B] transition-colors flex-shrink-0"
            onClick={togglePlay}
          >
            {paused
              ? <Play size={20} className="fill-white" />
              : <Pause size={20} className="fill-white" />}
          </button>

          <span className="text-white/60 text-xs tabular-nums flex-shrink-0">
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              className="cursor-pointer text-white hover:text-[#C9A24B] transition-colors flex-shrink-0"
              onClick={handleMute}
            >
              {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="w-16 cursor-pointer"
              style={{ accentColor: '#C9A24B', height: '4px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial, isPlaying, onPlay, onClose }) {
  if (isPlaying) {
    return <VideoPlayer testimonial={testimonial} onClose={onClose} />;
  }

  return (
    <div
      className="group relative rounded-3xl overflow-hidden cursor-pointer h-96 flex flex-col justify-end"
      onClick={onPlay}
    >
      {/* Banner */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: `url('${testimonial.bannerImage}')`,
          backgroundColor: 'rgba(11, 30, 63, 0.6)',
          backgroundBlendMode: 'overlay',
        }}
      />

      {/* Desktop hover play */}
      <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
        <div className="w-16 h-16 rounded-full bg-[#C9A24B] flex items-center justify-center shadow-lg">
          <Play size={32} className="text-black fill-black" />
        </div>
      </div>

      {/* Mobile play badge */}
      <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-[#C9A24B] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 sm:hidden">
        <Play size={20} className="text-black fill-black" />
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black via-black/50 to-transparent" />

      {/* Member info */}
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full shrink-0 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #C9A24B, #a88000)' }}
          >
            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
          </div>
          <a
            href={testimonial.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1"
            onClick={(e) => e.stopPropagation()}
          >
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

      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
        loop
        centeredSlides
        slidesPerView={1.2}
        spaceBetween={20}
        grabCursor={false}
        allowTouchMove
        style={{ cursor: 'pointer', paddingBottom: '8px' }}
        onSlideChange={() => setPlayingName(null)}
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 1, slideShadows: false }}
        breakpoints={{
          640:  { slidesPerView: 1.6, spaceBetween: 24 },
          1024: { slidesPerView: 2.2, spaceBetween: 28 },
          1280: { slidesPerView: 2.5, spaceBetween: 32 },
        }}
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i} style={{ height: 'auto' }}>
            <TestimonialCard
              testimonial={t}
              isPlaying={playingName === t.name}
              onPlay={() => setPlayingName(t.name)}
              onClose={() => setPlayingName(null)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
