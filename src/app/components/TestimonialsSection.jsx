'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  },
  {
    name: 'Mark Robber',
    role: 'American YouTuber, engineer and inventor',
    avatar: '/testimonials/mark_profile.png',
    profileUrl: 'https://www.instagram.com/markrober/',
    plan: 'ELITE',
    bannerImage: '/testimonials/mark_robber.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Mark_Robber.mp4',
  },
  {
    name: 'Pink Sweat',
    role: 'American R&B singer and songwriter',
    avatar: '/testimonials/pink_profile.png',
    profileUrl: 'https://www.instagram.com/pinksweats/',
    plan: 'SOVEREIGN',
    bannerImage: '/testimonials/pink_sweat.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Pink_Sweat.mp4',
  },
  {
    name: 'Turkey Princess',
    role: 'Princess',
    avatar: '/testimonials/no_profile.png',
    plan: 'PREMIUM',
    bannerImage: '/testimonials/turkey_princess.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/your_highness.mp4',
  },
  {
    name: 'Mo Vlog',
    role: 'Dubai-based Iranian YouTuber and vlogger with 11M+ subscribers',
    avatar: '/testimonials/mo_vlog_profile.png',
    profileUrl: 'https://www.instagram.com/movlogs/',
    plan: 'SOVEREIGN',
    bannerImage: '/testimonials/mo_vlog.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Movlog_car.mp4',
  },
];

const fmt = (s) => {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

function TestimonialCard({ testimonial, isCenter, isPlaying, onPlay, onClose }) {
  const videoRef = useRef(null);
  const seekingRef = useRef(false);
  const [videoPaused, setVideoPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Play/pause driven by parent — no component remount, just effect
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
    return () => { v.pause(); };
  }, [isPlaying]);

  const togglePlay = useCallback((e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play().catch(() => {}) : v.pause();
  }, []);

  const handleMute = useCallback((e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next && volume === 0) { v.volume = 0.5; setVolume(0.5); }
  }, [muted, volume]);

  const stopProp = useCallback((e) => e.stopPropagation(), []);

  return (
    <div
      className="relative rounded-3xl overflow-hidden h-96 bg-black select-none group"
      style={{ cursor: !isPlaying && isCenter ? 'pointer' : 'default' }}
      onClick={!isPlaying && isCenter ? onPlay : undefined}
    >
      {/* Block all clicks on non-center cards */}
      {!isCenter && <div className="absolute inset-0 z-50" style={{ cursor: 'default' }} />}

      {/* Thumbnail — fades out when video plays */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${testimonial.bannerImage}')`,
          backgroundColor: 'rgba(11, 30, 63, 0.6)',
          backgroundBlendMode: 'overlay',
          opacity: isPlaying ? 0 : 1,
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Video — always in DOM, opacity-transitions in/out to prevent jitter */}
      <video
        ref={videoRef}
        src={testimonial.videoUrl}
        preload="none"
        muted={muted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 0.25s ease',
          pointerEvents: 'none',
        }}
        onTimeUpdate={() => {
          if (seekingRef.current) return;
          const v = videoRef.current;
          if (v && v.duration) {
            setCurrentTime(v.currentTime);
            setProgress((v.currentTime / v.duration) * 100);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onPlay={() => setVideoPaused(false)}
        onPause={() => setVideoPaused(true)}
        onEnded={() => setVideoPaused(true)}
      />

      {/* Card info layer — visible when not playing */}
      <div
        className="absolute inset-0 flex flex-col justify-end"
        style={{
          opacity: isPlaying ? 0 : 1,
          pointerEvents: isPlaying ? 'none' : 'auto',
          transition: 'opacity 0.25s ease',
        }}
      >
        {/* Desktop hover play */}
        <div className="absolute  inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
          {isCenter && (
            <div className="w-16 h-16 rounded-full bg-[#C9A24B] flex items-center justify-center shadow-lg">
              <Play size={32} className="text-black fill-black ml-1" />
            </div>
          )}
        </div>

        {/* Mobile play badge */}
        {isCenter && (
          <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-[#C9A24B] flex items-center justify-center shadow-lg sm:hidden">
            <Play size={20} className="text-black fill-black" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full shrink-0 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #C9A24B, #a88000)' }}
            >
              <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
            </div>
            {testimonial.profileUrl ? (
              <a
                href={testimonial.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1"
                onClick={stopProp}
              >
                <div className="text-white text-sm font-semibold line-clamp-1">{testimonial.name}</div>
                <div className="text-white/60 text-xs line-clamp-1">{testimonial.role}</div>
              </a>
            ) : (
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm font-semibold line-clamp-1">{testimonial.name}</div>
                <div className="text-white/60 text-xs line-clamp-1">{testimonial.role}</div>
              </div>
            )}
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

      {/* Video controls layer — visible when playing */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isPlaying ? 1 : 0,
          pointerEvents: isPlaying ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      >
        {/* Tap-to-toggle behind all controls */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 10 }}
          onClick={togglePlay}
        />

        {/* Paused indicator */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            zIndex: 15,
            opacity: videoPaused ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
            <Play size={32} className="text-white fill-white ml-1" />
          </div>
        </div>

        {/* Close */}
        <button
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all"
          style={{ zIndex: 30 }}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <X size={24} />
        </button>

        {/* Controls bar — .no-swipe stops Swiper from stealing these touches */}
        <div
          className="no-swipe absolute bottom-0 inset-x-0 px-4 pb-4 pt-8"
          style={{
            zIndex: 30,
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)',
          }}
          onClick={stopProp}
          onTouchStart={stopProp}
          onTouchMove={stopProp}
        >
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={(e) => {
              const v = videoRef.current;
              if (!v || !v.duration) return;
              const val = parseFloat(e.target.value);
              v.currentTime = (val / 100) * v.duration;
              setProgress(val);
            }}
            onTouchStart={(e) => { seekingRef.current = true; e.stopPropagation(); }}
            onTouchEnd={() => { seekingRef.current = false; }}
            onMouseDown={() => { seekingRef.current = true; }}
            onMouseUp={() => { seekingRef.current = false; }}
            className="w-full cursor-pointer mb-3 block"
            style={{ accentColor: '#C9A24B', height: '4px', touchAction: 'none' }}
          />

          <div className="flex items-center gap-3">
            <button
              className="text-white hover:text-[#C9A24B] transition-colors flex-shrink-0"
              style={{ zIndex: 31 }}
              onClick={togglePlay}
            >
              {videoPaused
                ? <Play size={20} className="fill-white" />
                : <Pause size={20} className="fill-white" />}
            </button>

            <span className="text-white/60 text-xs tabular-nums flex-shrink-0">
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            <div className="ml-auto flex items-center gap-2">
              <button
                className="text-white hover:text-[#C9A24B] transition-colors flex-shrink-0"
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
                onChange={(e) => {
                  const v = videoRef.current;
                  if (!v) return;
                  const val = parseFloat(e.target.value);
                  v.volume = val;
                  v.muted = val === 0;
                  setVolume(val);
                  setMuted(val === 0);
                }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="w-16 cursor-pointer"
                style={{ accentColor: '#C9A24B', height: '4px', touchAction: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [playingIndex, setPlayingIndex] = useState(null);

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
        centeredSlides
        initialSlide={2}
        slidesPerView={1.2}
        spaceBetween={20}
        loop
        grabCursor
        noSwipingSelector=".no-swipe"
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 1, slideShadows: false }}
        onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
          setPlayingIndex(null);
        }}
        style={{ paddingBottom: '8px' }}
        breakpoints={{
          640:  { slidesPerView: 1.6, spaceBetween: 24 },
          1024: { slidesPerView: 2.2, spaceBetween: 28 },
          1280: { slidesPerView: 2.5, spaceBetween: 32 },
        }}
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={t.name}>
            <TestimonialCard
              testimonial={t}
              isCenter={i === activeIndex}
              isPlaying={i === playingIndex}
              onPlay={() => setPlayingIndex(i)}
              onClose={() => setPlayingIndex(null)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

