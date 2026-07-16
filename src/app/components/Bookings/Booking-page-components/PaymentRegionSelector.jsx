"use client";

import { Check, Globe, IndianRupee } from "lucide-react";
import { INR, CURRENCIES } from "@/app/(protected)/booking/booking-helpers";

export default function PaymentRegionSelector({
  isIndia,
  price,
  selectedCurrency,
  currencyRate,
  currencyRateLoading,
  onMethodChange,
  onCurrencyChange,
  isFixedUSD,
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-[0.22em] uppercase">
        Payment Region
      </label>

      {/* India / International toggle */}
      <div className="grid grid-cols-2 gap-2">
        {/* India */}
        <button
          type="button"
          onClick={() => onMethodChange("india")}
          className={`relative py-3 px-3.5 rounded-xl border-2 transition-all text-left cursor-pointer ${
            isIndia
              ? "border-[#C9A24B] bg-amber-50/70"
              : "border-gray-200 bg-white hover:border-amber-200"
          }`}
        >
          {isIndia && (
            <span
              className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#C9A24B" }}
            >
              <Check size={9} strokeWidth={3.5} className="text-black" />
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg">
              <IndianRupee />
            </span>
            <div>
              <div
                className={`text-sm font-bold ${isIndia ? "text-amber-800" : "text-gray-700"}`}
              >
                India
              </div>
              <div
                className={`text-[11px] font-semibold tabular-nums ${isIndia ? "text-amber-600" : "text-gray-400"}`}
              >
                {INR(price)}* · INR
              </div>
            </div>
          </div>
        </button>

        {/* International */}
        <button
          type="button"
          onClick={() => onMethodChange("international")}
          className={`relative py-3 px-3.5 rounded-xl border-2 transition-all text-left cursor-pointer ${
            !isIndia
              ? "border-[#C9A24B] bg-amber-50/70"
              : "border-gray-200 bg-white hover:border-amber-200"
          }`}
        >
          {!isIndia && (
            <span
              className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#C9A24B" }}
            >
              <Check size={9} strokeWidth={3.5} className="text-black" />
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg">
              <Globe />
            </span>
            <div>
              <div
                className={`text-sm font-bold ${!isIndia ? "text-amber-800" : "text-gray-700"}`}
              >
                International
              </div>
              <div
                className={`text-[11px] font-semibold ${!isIndia ? "text-amber-600" : "text-gray-400"}`}
              >
                Multi-currency
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Currency dropdown — only when international */}
      {!isIndia && (
        <div className="mt-2.5">
          <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
            Select Currency
          </label>
          <div className="relative">
            <select
              value={selectedCurrency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-full pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/10 text-sm text-gray-700 outline-none transition-all bg-white appearance-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name} ({c.country})
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ▾
            </span>
          </div>

          {isFixedUSD ? (
            <p className="text-[10px] text-amber-600 mt-1 font-medium">
              Fixed USD package rate applied
            </p>
          ) : currencyRateLoading ? (
            <p className="text-[10px] text-amber-600 mt-1">
              Fetching live rate…
            </p>
          ) : (
            <p className="text-[10px] text-gray-400 mt-1">
              1 {selectedCurrency} ≈ {INR(Math.round(currencyRate))} · live rate
            </p>
          )}
        </div>
      )}
    </div>
  );
}
