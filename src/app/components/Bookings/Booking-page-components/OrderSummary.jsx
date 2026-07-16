"use client";

import { INR } from "@/app/(protected)/booking/booking-helpers";

export default function OrderSummary({
  packageName,
  isIndia,
  selectedCurrency,
  currencyRateLoading,
  // INR amounts
  price,
  gstAmount,
  indiaTotalINR,
  intlGstAmount,
  intlTotalINR,
  // Foreign amounts (pre-rounded numbers, not strings)
  intlTotalForeign,
  // Formatter helpers passed down from parent
  toForeign,
  fmtForeign,
  isWelcomeIndia,
  isFixedUSD,
}) {
  return (
    <div
      className="rounded-xl border p-3.5"
      style={{
        backgroundColor: "#fafaf8",
        borderColor: "rgba(201,162,75,0.12)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="#C9A24B"
          strokeWidth="1.6"
        >
          <path
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-[9px] font-bold text-gray-400 tracking-[0.3em] uppercase">
          Order Summary
        </p>
      </div>

      {/* Line items */}
      <div className="space-y-1.5">
        {/* Package price */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">{packageName}</span>
          <div className="text-right">
            <span className="text-gray-700 text-sm font-semibold tabular-nums">
              {isIndia ? `${INR(price)}*` : `${toForeign(price)}*`}
            </span>
            {!isIndia && !currencyRateLoading && (
              <p className="text-gray-400 text-[10px] tabular-nums">
                {INR(price)}*
              </p>
            )}
          </div>
        </div>

        {/* GST */}
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            {isWelcomeIndia ? (
              <span className="bg-green-50 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-green-200">
                Included
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                +18%
              </span>
            )}
            GST
          </span>
          <div className="text-right">
            <span className="text-gray-600 text-sm font-semibold tabular-nums">
              {isWelcomeIndia ? (
                "Included"
              ) : (
                `+${isIndia ? INR(gstAmount) : toForeign(intlGstAmount)}`
              )}
            </span>
            {!isWelcomeIndia && !isIndia && !currencyRateLoading && (
              <p className="text-gray-400 text-[10px] tabular-nums">
                +{INR(intlGstAmount)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Total */}
      <div
        className="flex justify-between items-end mt-2.5 pt-2.5 border-t"
        style={{ borderColor: "rgba(201,162,75,0.12)" }}
      >
        <span className="text-gray-900 text-sm font-bold">
          Total {isIndia ? "(INR)" : `(${selectedCurrency})`}
        </span>
        <div className="text-right">
          {isIndia ? (
            <span className="text-gray-900 text-lg font-black tabular-nums">
              {INR(indiaTotalINR)}
            </span>
          ) : (
            <>
              <span className="text-gray-900 text-lg font-black tabular-nums">
                {fmtForeign(intlTotalForeign, selectedCurrency)}
              </span>
              {!currencyRateLoading && intlTotalForeign !== null && (
                <p className="text-gray-400 text-[10px] mt-0.5 tabular-nums">
                  {isFixedUSD ? `Fixed package price: $${intlTotalForeign} USD` : `≈ ${INR(intlTotalINR)} · live rate`}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
