"use client";
import BookingPageContent from "@/app/components/Bookings/BookingPageContent";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useExitIntent } from "@/app/hooks/useExitIntent";
import { packageApiUser } from "@/app/user-apis/package.api";

export const BookingPage = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState({});
  const [abandonPopupVisible, setAbandonPopupVisible] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await packageApiUser.getPackageById(id);
        setPackageData(res);
      } catch (err) {
        console.error("Failed to fetch package", id, err);
        return null;
      }
    };

    fetchDetails();
  }, []);

  // Fire only after package data is available so the popup has context
  useExitIntent(
    () => { if (packageData?.name) setAbandonPopupVisible(true); },
    { scrollThreshold: 0.3 }, // lower threshold — checkout page is shorter
  );

  return (
    <>
      <Suspense fallback={null}>
        <BookingPageContent packageData={packageData} />
      </Suspense>

      {/* ── Exit intent: checkout abandonment recovery ── */}
      {abandonPopupVisible && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setAbandonPopupVisible(false)}
          />
          <div
            className="relative bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl animate-scale-in"
            style={{ boxShadow: "0 24px 64px rgba(11,30,63,0.25)" }}
          >
            <button
              onClick={() => setAbandonPopupVisible(false)}
              className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
              Wait — your spot isn&apos;t saved yet
            </p>
            <h3 className="font-serif-display text-2xl font-bold text-[#0B1E3F] mb-2 leading-snug">
              Don&apos;t lose your{" "}
              <span className="text-[#C9A24B]">{packageData?.name}</span> spot
            </h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-6">
              Founding spots are limited. Complete your reservation now — or chat
              with our concierge if you have any questions before paying.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setAbandonPopupVisible(false)}
                className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #C9A24B 0%, #e0b85a 100%)",
                  color: "#000",
                }}
              >
                Complete My Reservation →
              </button>
              <a
                href={`https://wa.me/917304607954?text=${encodeURIComponent(
                  `Hi WENS Force, I was trying to book the ${packageData?.name} plan but had some questions before completing payment.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setAbandonPopupVisible(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border-2 text-[#25D366] hover:bg-[#25D366]/5 transition-all"
                style={{ borderColor: "rgba(37,211,102,0.35)" }}
              >
                <svg viewBox="0 0 32 32" width="16" height="16" fill="#25D366">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
                </svg>
                Ask a question first
              </a>
            </div>
            <button
              onClick={() => setAbandonPopupVisible(false)}
              className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              No thanks
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingPage;
