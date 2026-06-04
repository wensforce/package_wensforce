'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const services = [
  {
    name: 'Arrival in Comfort',
    bannerImage: '/cards/ComfortableArrival.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Arrival_in_comfort.mp4',
  },
  {
    name: 'Arrive in Style with Mercedes',
    bannerImage: '/cards/ArrivalWithMercedes.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Arrival_in_style.mp4',
  },
  {
    name: 'Arrival in Grandeur',
    bannerImage: '/cards/Grandeur.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Arrival_in_grandeur.mp4',
  },
  {
    name: 'Ultimate Convoy Matrix',
    bannerImage: '/cards/UltimateConvoy.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Ultimate_conyoy_matrix.mp4',
  },
  {
    name: 'End-to-End Concierge Service',
    bannerImage: '/cards/EndToEnd.png',
    videoUrl: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/End_to_end_concierge.mp4',
  },
];

const fmt = (s) => {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

function ServiceVideoCard({ service, isCenter, isPlaying, onPlay, onClose }) {
  const videoRef = useRef(null);
  const seekingRef = useRef(false);
  const [videoPaused, setVideoPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

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
      className="relative rounded-3xl overflow-hidden md:h-96 h-120 bg-black select-none group"
      style={{ cursor: !isPlaying && isCenter ? 'pointer' : 'default', zIndex: isCenter ? 2 : 1 }}
      onClick={!isPlaying && isCenter ? onPlay : undefined}
    >
      {!isCenter && <div className="absolute inset-0 z-10" style={{ cursor: 'default' }} />}

      {/* Thumbnail */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${service.bannerImage}')`,
          backgroundColor: 'rgba(11, 30, 63, 0.6)',
          backgroundBlendMode: 'overlay',
          opacity: isPlaying ? 0 : 1,
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Video */}
      <video
        ref={videoRef}
        src={service.videoUrl}
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
        onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
        onPlay={() => setVideoPaused(false)}
        onPause={() => setVideoPaused(true)}
        onEnded={() => setVideoPaused(true)}
      />

      {/* Info layer — visible when not playing */}
      <div
        className="absolute inset-0 flex flex-col justify-end"
        style={{
          opacity: isPlaying ? 0 : 1,
          pointerEvents: isPlaying ? 'none' : 'auto',
          transition: 'opacity 0.25s ease',
        }}
      >
        {/* Desktop hover play */}
        <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
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
        { service.category && <div className="mb-1">
            <span
              className="text-[9px] font-bold tracking-[0.4em] uppercase px-3 py-1 rounded-full"
              style={{ background: 'rgba(201,162,75,0.2)', color: '#C9A24B', border: '1px solid rgba(201,162,75,0.3)' }}
            >
              {service.category}
            </span>
          </div>}
          <div className="mt-2">
            <div className="text-white text-base font-bold leading-tight">{service.name}</div>
          </div>
        </div>
      </div>

      {/* Video controls layer */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isPlaying ? 1 : 0,
          pointerEvents: isPlaying ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      >
        <div className="absolute inset-0" style={{ zIndex: 10 }} onClick={togglePlay} />

        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 15, opacity: videoPaused ? 1 : 0, transition: 'opacity 0.2s ease' }}
        >
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
            <Play size={32} className="text-white fill-white ml-1" />
          </div>
        </div>

        <button
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all"
          style={{ zIndex: 30 }}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <X size={24} />
        </button>

        <div
          className="no-swipe absolute bottom-0 inset-x-0 px-4 pb-4 pt-8"
          style={{ zIndex: 30, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)' }}
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
              {videoPaused ? <Play size={20} className="fill-white" /> : <Pause size={20} className="fill-white" />}
            </button>

            <span className="text-white/60 text-xs tabular-nums flex-shrink-0">
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            <div className="ml-auto flex items-center gap-2">
              <button className="text-white hover:text-[#C9A24B] transition-colors flex-shrink-0" onClick={handleMute}>
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

export default function ServicesVideoSection() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [playingIndex, setPlayingIndex] = useState(null);

  return (
    <section style={{ backgroundColor: '#0B1E3F' }} className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
            Our Services
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mb-3">
            See What We Deliver
          </h2>
          <p className="text-white/40 text-base font-light">
            Every service, captured on camera. Click to watch.
          </p>
        </div>
      </div>

      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
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
        {services.map((s, i) => (
          <SwiperSlide key={s.name}>
            <ServiceVideoCard
              service={s}
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
