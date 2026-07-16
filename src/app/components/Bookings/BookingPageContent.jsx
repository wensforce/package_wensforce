"use client";

import { useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  INR,
  CURRENCIES,
  ZERO_DECIMAL,
  THREE_DECIMAL,
} from "../../(protected)/booking/booking-helpers";
import { useCurrency, roundForeign } from "../../hooks/useCurrency";

import SuccessState from "./Booking-page-components/SuccessState";
import PackageSummaryPanel from "./Booking-page-components/PackageSummaryPanel";
import CheckoutForm from "./Booking-page-components/CheckoutForm";

import { plans as mainPlans } from "../../data/plans";
import { plans as welcomePlans } from "../../data/welcomeIndia";

const welcomePlanIds = new Set(welcomePlans.map((p) => p.id));

const WELCOME_USD_PRICES = {
  "comfortable-arrival": 100,
  "arrive-in-style": 150,
  "arrival-in-grandeur": 370,
  "ultimate-convoy-matrix": 900,
  "end-to-end-concierge": 2100,
  "touch-red-carpet": 72,
  "maharani-maharaja": 215,
};

const plans = [...mainPlans, ...welcomePlans];
/* ── Pricing display helper (only needed here for displayPrice) ─────── */

const fmtForeign = (amount, code) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "…";
  const decimals = ZERO_DECIMAL.has(code) ? 0 : THREE_DECIMAL.has(code) ? 3 : 2;
  const sym = CURRENCIES.find((c) => c.code === code)?.symbol ?? "";
  return sym + Number(amount).toFixed(decimals);
};

/* ── Component ──────────────────────────────────────────────────────── */

export default function BookingPageContent({
  packageData,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const [submitted, setSubmitted] = useState(false);
  const [successForm, setSuccessForm] = useState(null);

  const slug = params?.id;
  const isWelcomeIndia = welcomePlanIds.has(packageData?.id) || welcomePlanIds.has(slug);
  const matchedWelcomeId = welcomePlanIds.has(packageData?.id) ? packageData.id : (welcomePlanIds.has(slug) ? slug : null);

  const urlCurrency = searchParams.get("currency");
  const initCurrency = urlCurrency && urlCurrency !== "INR" ? urlCurrency : "INR";

  const {
    currency: selectedCurrency,
    setCurrency: setSelectedCurrency,
    rate: currencyRate,
    rateLoading: currencyRateLoading,
    toForeign,
  } = useCurrency(initCurrency);

  const isFixedUSD = selectedCurrency === "USD" && isWelcomeIndia;

  /* Loading state */
  if (!packageData || !packageData.id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6EC] px-6">
        <div className="relative flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#C9A24B]/20 border-t-[#C9A24B] animate-spin mb-4" />
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-gray-400">
            Loading Package Details...
          </p>
        </div>
      </div>
    );
  }

  /* Success screen */
  if (submitted && successForm) {
    return (
      <SuccessState
        packageData={packageData}
        form={successForm}
        isWelcomeIndia={isWelcomeIndia}
      />
    );
  }

  const displayPrice = selectedCurrency === "INR"
    ? INR(packageData.discountedPrice)
    : (isFixedUSD && matchedWelcomeId
      ? fmtForeign(WELCOME_USD_PRICES[matchedWelcomeId], "USD")
      : (currencyRateLoading
        ? "…"
        : fmtForeign(
          roundForeign(packageData.discountedPrice / currencyRate, selectedCurrency),
          selectedCurrency,
        )
      )
    );

  return (
    <div>
      {/* Header bar */}
      <div
        className="flex items-center justify-between gap-2 px-3 sm:px-6 py-3 border-b"
        style={{ borderColor: "rgba(201,162,75,0.12)" }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs transition-colors flex-shrink-0"
        >
          <ArrowLeft size={13} />
          <span className="hidden xs:inline">Back</span>
        </button>

        <p className="flex-1 text-center text-[#C9A24B] font-bold text-[11px] sm:text-[15px] tracking-[0.12em] sm:tracking-[0.32em] uppercase truncate px-2">
          WENS Force · Secure Checkout
        </p>

        <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 flex-shrink-0">
          <Shield
            size={11}
            strokeWidth={1.5}
            style={{ color: "rgba(201,162,75,0.65)" }}
          />
          <span className="hidden md:inline">Secure &amp; Encrypted</span>
        </div>
      </div>

      {/* Main layout */}
      <div
        className="flex items-start justify-center p-3 sm:p-5 min-h-screen"
        style={{ backgroundColor: "#FAF6EC" }}
      >
        <div
          className="w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden rounded-2xl"
          style={{
            background: "white",
            boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
            border: "1px solid rgba(201,162,75,0.15)",
          }}
        >
          <PackageSummaryPanel
            packageData={packageData}
            displayPrice={displayPrice}
            isWelcomeIndia={isWelcomeIndia}
          />

          <CheckoutForm
            packageData={packageData}
            user={user}
            searchParams={searchParams}
            displayPrice={displayPrice}
            onSuccess={(form) => {
              setSuccessForm(form);
              setSubmitted(true);
            }}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            currencyRate={currencyRate}
            currencyRateLoading={currencyRateLoading}
            toForeign={toForeign}
            isWelcomeIndia={isWelcomeIndia}
            isFixedUSD={isFixedUSD}
            matchedWelcomeId={matchedWelcomeId}
            welcomePlanIds={welcomePlanIds}
            WELCOME_USD_PRICES={WELCOME_USD_PRICES}
          />
        </div>

        <div className="h-20 lg:hidden" />
      </div>
    </div>
  );
}
