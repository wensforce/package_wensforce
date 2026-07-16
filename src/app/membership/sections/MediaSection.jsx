"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

export default function MediaSection({ images = [], videos = [] }) {
  const [lightbox, setLightbox] = useState(null); // { type: 'image'|'video', url: string }

  if (!images.length && !videos.length) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-2 text-center">
          Gallery
        </p>
        <h2 className="font-serif-display text-3xl font-bold text-[#0B1E3F] text-center mb-10">
          See It In Action
        </h2>

        {/* Images grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => setLightbox({ type: "image", url: img.url })}
              >
                <img
                  src={img.url}
                  alt={`Gallery ${img.order + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              </div>
            ))}
          </div>
        )}

        {/* Videos grid */}
        {videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="group relative aspect-video overflow-hidden rounded-2xl cursor-pointer bg-[#0B1E3F]/5"
                onClick={() => setLightbox({ type: "video", url: vid.url })}
              >
                <video
                  src={vid.url}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 transition-transform duration-200 group-hover:scale-110">
                    <Play size={22} className="translate-x-0.5 text-white" fill="white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 px-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.type === "image" ? (
              <img
                src={lightbox.url}
                className="w-full max-h-[85vh] object-contain rounded-xl"
              />
            ) : (
              <video
                src={lightbox.url}
                controls
                autoPlay
                className="w-full max-h-[85vh] rounded-xl"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}