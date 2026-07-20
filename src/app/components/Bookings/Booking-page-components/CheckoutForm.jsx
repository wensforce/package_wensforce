"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";
import {
  Check,
  Shield,
  Lock,
  Headphones,
  MapPin,
  User,
  Mail,
  ArrowLeft,
} from "lucide-react";
import {
  INR,
  WA_NUMBER,
  GST_RATE,
  CITIES,
  CURRENCIES,
  ZERO_DECIMAL,
  THREE_DECIMAL,
} from "@/app/(protected)/booking/booking-helpers";
import PaymentRegionSelector from "./PaymentRegionSelector";
import OrderSummary from "./OrderSummary";
import { useCurrency } from "@/app/hooks/useCurrency";
import { useMetaEvents } from "@/app/hooks/useMetaEvents";
import { paymentApiUser } from "@/app/user-apis/payment.api";
import { bookingApiUser } from "@/app/user-apis/booking.api";
import { couponApiUser } from "@/app/user-apis/coupon.api";
import { authApiUser } from "@/app/user-apis/auth.api";

/* ── Pricing helpers (pure functions, no state) ───────────────────────── */

const fmtForeign = (amount, code) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "…";
  const decimals = ZERO_DECIMAL.has(code) ? 0 : THREE_DECIMAL.has(code) ? 3 : 2;
  const sym = CURRENCIES.find((c) => c.code === code)?.symbol ?? "";
  return sym + Number(amount).toFixed(decimals);
};

const roundForeign = (amount, code) => {
  if (ZERO_DECIMAL.has(code)) return Math.ceil(amount);
  if (THREE_DECIMAL.has(code)) return Math.ceil(amount * 1000) / 1000;
  return Math.ceil(amount * 100) / 100;
};

/* ── Component ────────────────────────────────────────────────────────── */

export default function CheckoutForm({
  packageData,
  user,
  searchParams,
  displayPrice,
  onSuccess,
  selectedCurrency,
  setSelectedCurrency,
  currencyRate,
  currencyRateLoading,
  toForeign,
  isWelcomeIndia,
  isFixedUSD,
  matchedWelcomeId,
  welcomePlanIds,
  WELCOME_USD_PRICES,
}) {
  const { trackLead } = useMetaEvents();

  /* ── Payment region & currency ── */
  const urlCurrency = searchParams.get("currency");
  const initMethod =
    urlCurrency && urlCurrency !== "INR" ? "international" : "india";

  const [paymentMethod, setPaymentMethod] = useState(initMethod);
  const isIndia = paymentMethod === "india";

  /* ── Form ── */
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
  });
  const [errors, setErrors] = useState({});

  /* ── Submission ── */
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState("");

  /* ── Coupon Code ── */
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [showCouponPanel, setShowCouponPanel] = useState(false);

  /* Pre-fill from auth */
  useEffect(() => {
    if (!user) return;
    const raw = (user.mobileNumber || "").replace(/\D/g, "");
    const phone = raw.length > 10 ? raw.slice(-10) : raw;
    setForm((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
      phone: isIndia ? phone : user.mobileNumber || "",
    }));
  }, [user, isIndia]); // eslint-disable-line

  /* ── Derived pricing ── */
  const price = packageData.discountedPrice;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const discountedBasePrice = Math.max(1, price - discountAmount);
  const effectiveGstRate = (isWelcomeIndia || packageData.gst === null || packageData.gst === undefined) ? 0 : Number(packageData.gst) / 100;
  const gstAmount = Math.ceil(discountedBasePrice * effectiveGstRate);
  const indiaTotalINR = discountedBasePrice + gstAmount;
  const intlGstAmount = Math.ceil(discountedBasePrice * effectiveGstRate);
  const intlTotalINR = discountedBasePrice + intlGstAmount;
  const intlTotalForeign = isFixedUSD
    ? (WELCOME_USD_PRICES[matchedWelcomeId] ?? null)
    : currencyRateLoading
      ? null
      : roundForeign(intlTotalINR / currencyRate, selectedCurrency);

  const customToForeign = (inrAmount) => {
    if (isFixedUSD && matchedWelcomeId) {
      const usdBase = WELCOME_USD_PRICES[matchedWelcomeId] ?? 0;
      const scaled = Math.round((inrAmount / (price || 1)) * usdBase);
      return fmtForeign(scaled, "USD");
    }
    return toForeign(inrAmount);
  };

  /* ── Coupon Handlers ── */
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await couponApiUser.validateCoupon(couponInput.trim(), packageData.id);
      if (res?.success && res?.data) {
        setAppliedCoupon({
          code: couponInput.trim().toUpperCase(),
          discountType: res.data.discountType,
          discountValue: res.data.discountValue,
          discountAmount: res.data.discountAmount,
        });
        toast.success(`Coupon ${couponInput.trim().toUpperCase()} applied successfully!`);
      } else {
        setCouponError(res?.message || "Invalid coupon code");
      }
    } catch (err) {
      setCouponError(err?.response?.data?.message || err?.message || "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    toast.info("Coupon code removed");
  };

  /* ── Handlers ── */
  const handleMethodChange = (method) => {
    setPaymentMethod(method);
    if (method !== "india") setSelectedCurrency("USD");
    setErrors({});
    setPayError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = "Please enter your full name";
    if (isIndia) {
      if (!form.phone.match(/^\d{10}$/))
        e.phone = "Enter a valid 10-digit number";
    } else {
      const c = form.phone.replace(/[\s\-()+]/g, "");
      if (c.length < 7 || !/^\d+$/.test(c))
        e.phone = "Enter a valid international number";
    }
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email address";
    return e;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setPayError("");
    setLoading(true);

    try {
      const payload = isIndia
        ? {
          amount: indiaTotalINR,
          currency: "INR",
          customerName: form.name.trim(),
          customerPhone: form.phone,
          customerEmail: form.email.trim(),
          packageId: packageData.id,
          planName: packageData.name,
          couponCode: appliedCoupon?.code || undefined,
        }
        : {
          amount: intlTotalForeign,
          currency: selectedCurrency,
          customerName: form.name.trim(),
          customerPhone: form.phone,
          customerEmail: form.email.trim(),
          packageId: packageData.id,
          planName: packageData.name,
          couponCode: appliedCoupon?.code || undefined,
        };

      await trackLead({
        value: isIndia ? indiaTotalINR : intlTotalForeign,
        phone: form.phone,
        userData: { fullName: form.name, email: form.email, city: form.city },
      });

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "pay_button_click",
        conversion_value: "0",
        currency: isIndia ? "INR" : selectedCurrency,
        customer_name: form.name.trim() || "Unknown",
        customer_phone: form.phone || "Unknown",
        service_city: form.city || "Unknown",
        plan_name: packageData.name || "Unknown",
      });

      const res = await paymentApiUser.createOrder(payload);
      const data = res.data;
console.log(data,"data")
      if (!data?.paymentSessionId)
        throw new Error(
          data?.error || "Could not initiate payment. Please try again.",
        );

      await Promise.all([
        bookingApiUser.createBooking({
          packageName: packageData.name,
          packageId: packageData.id,
          validity: packageData.validity.toString(),
          serviceCity: form.city || "Not specified",
          cashfreeId: data.order_id,
          currency: isIndia ? "INR" : selectedCurrency,
          purchaseAmount: isIndia ? indiaTotalINR : intlTotalForeign,
          purchaseDate: new Date().toISOString(),
        }),
        !user?.name || !user?.email || (!user?.city && form.city)
          ? authApiUser.updateProfile({
            name: form.name.trim(),
            email: form.email.trim(),
            city: form.city || "Not specified",
          })
          : Promise.resolve(),
      ]);

      
      const cashfree = await load({
        mode:
          process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
            ? "production"
            : "sandbox",
      });
      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (err) {
      setPayError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };


  /* ── JSX ── */
  return (
    <div
      className="flex-1 flex flex-col border-t lg:border-t-0 lg:border-l"
      style={{ borderColor: "rgba(201,162,75,0.15)", minHeight: 0 }}
    >
      {/* Gold accent line */}
      <div
        className="flex-shrink-0"
        style={{
          height: 2,
          background:
            "linear-gradient(90deg,#C9A24B 0%,#f0c940 50%,#C9A24B 100%)",
        }}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4">
          {/* Header row */}
          <div
            className="flex items-start justify-between gap-4 pb-4 mb-4 border-b"
            style={{ borderColor: "rgba(201,162,75,0.1)" }}
          >
            <div>
              <h2 className="text-[15px] font-bold text-gray-900 mb-0.5">
                Reserve Your Founding Spot
              </h2>
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-xl font-black tabular-nums"
                style={{ color: "#C9A24B" }}
              >
                {displayPrice}
              </p>
              <p className="text-gray-400 text-[10px] mt-0.5">
                {packageData.validity === "Single Trip" ? "single trip" : "per year"}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {/* Payment region */}
            <PaymentRegionSelector
              isIndia={isIndia}
              price={price}
              selectedCurrency={selectedCurrency}
              currencyRate={currencyRate}
              currencyRateLoading={currencyRateLoading}
              onMethodChange={handleMethodChange}
              onCurrencyChange={setSelectedCurrency}
              isFixedUSD={isFixedUSD}
            />

            {/* Row 1: Name + Phone */}
            <div className="grid grid-cols-2 gap-3">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div
                  className={`flex items-center border rounded-xl overflow-hidden transition-all ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 focus-within:border-[#C9A24B] focus-within:ring-2 focus-within:ring-[#C9A24B]/10 bg-white"}`}
                >
                  <span className="pl-3 text-gray-300 shrink-0">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rajan Mehta"
                    className="flex-1 px-2.5 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-300"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
                  {isIndia ? "Mobile No." : "WhatsApp No."}{" "}
                  <span className="text-red-400">*</span>
                </label>
                {isIndia ? (
                  <div
                    className={`flex items-center border rounded-xl overflow-hidden transition-all ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-200 focus-within:border-[#C9A24B] focus-within:ring-2 focus-within:ring-[#C9A24B]/10"}`}
                  >
                    <span className="px-2.5 py-2.5 text-xs text-gray-400 font-semibold border-r border-gray-200 bg-gray-50/80 shrink-0">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      placeholder="98765 43210"
                      className="flex-1 px-2.5 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-300"
                    />
                  </div>
                ) : (
                  <div
                    className={`flex items-center border rounded-xl overflow-hidden transition-all ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-200 focus-within:border-[#C9A24B] focus-within:ring-2 focus-within:ring-[#C9A24B]/10 bg-white"}`}
                  >
                    <span className="pl-3 shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        width="24"
                        height="24"
                        fill="#25D366"
                      >
                        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="+1 555 123 4567"
                      className="flex-1 px-2.5 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-300"
                    />
                  </div>
                )}
                {errors.phone && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Email + City */}
            <div className="grid grid-cols-2 gap-3">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
                  Email <span className="text-red-400">*</span>
                </label>
                <div
                  className={`flex items-center border rounded-xl overflow-hidden transition-all ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 focus-within:border-[#C9A24B] focus-within:ring-2 focus-within:ring-[#C9A24B]/10 bg-white"}`}
                >
                  <span className="pl-3 text-gray-300 shrink-0">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    className="flex-1 px-2.5 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-300"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
                  Service City
                </label>
                <div className="relative flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#C9A24B] focus-within:ring-2 focus-within:ring-[#C9A24B]/10 transition-all bg-white">
                  <span className="pl-3 text-gray-300 shrink-0">
                    <MapPin size={14} />
                  </span>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="flex-1 pl-2 pr-7 py-2.5 text-sm text-gray-700 outline-none bg-transparent appearance-none"
                  >
                    <option value="">Select City…</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ▾
                  </span>
                </div>
              </div>
            </div>

            {/* Promo / Coupon Code Section */}
            {!isWelcomeIndia && (
              <div className="border border-[#CBD5E0]/20 rounded-xl bg-white overflow-hidden transition-all duration-300 ease-in-out mt-4 shadow-sm">
                {/* Collapsible Header/Toggle */}
                <button
                  type="button"
                  onClick={() => setShowCouponPanel(!showCouponPanel)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#FAF6EC]/30 hover:bg-[#FAF6EC]/60 transition-colors text-left"
                >
                  <span className="text-xs font-bold text-[#0B1E3F] tracking-wide flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#C9A24B] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 00-2 2z"
                      />
                    </svg>
                    Have a promo or coupon code?
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      showCouponPanel ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Collapsible Content Container */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showCouponPanel
                      ? "max-h-[160px] border-t border-[#CBD5E0]/20 p-4 opacity-100"
                      : "max-h-0 opacity-0 p-0"
                  }`}
                >
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 tracking-[0.22em] uppercase">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="ENTER PROMO CODE"
                        disabled={couponLoading || appliedCoupon}
                        className="flex-1 px-3.5 py-2 border border-[#CBD5E0]/70 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#C9A24B] uppercase bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                      />
                      {appliedCoupon ? (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim() || couponLoading}
                          className="px-5 py-2 bg-[#C9A24B] text-white rounded-lg text-xs font-bold hover:bg-[#B58E3D] transition-colors disabled:opacity-60 flex items-center gap-1.5"
                        >
                          {couponLoading ? (
                            <div className="w-3.5 h-3.5 rounded-full border border-white/20 border-t-white animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </button>
                      )}
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-[10px] font-medium">{couponError}</p>
                    )}
                    {appliedCoupon && (
                      <p className="text-green-600 text-[10px] font-semibold flex items-center gap-1">
                        ✓ Code "{appliedCoupon.code}" applied successfully! (-{isIndia ? `₹${appliedCoupon.discountAmount}` : customToForeign(appliedCoupon.discountAmount)})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <OrderSummary
              packageName={packageData.name}
              isIndia={isIndia}
              selectedCurrency={selectedCurrency}
              currencyRateLoading={currencyRateLoading}
              price={price}
              discountAmount={discountAmount}
              gstAmount={gstAmount}
              indiaTotalINR={indiaTotalINR}
              intlGstAmount={intlGstAmount}
              intlTotalINR={intlTotalINR}
              intlTotalForeign={intlTotalForeign}
              toForeign={customToForeign}
              fmtForeign={fmtForeign}
              isWelcomeIndia={isWelcomeIndia}
              isFixedUSD={isFixedUSD}
              packageData={packageData}
            />

            {/* Pay button */}
            <button
              type="submit"
              id="pay-submit-btn"
              disabled={loading || (!isIndia && currencyRateLoading)}
              className="w-full cursor-pointer rounded-xl font-black tracking-wide transition-all hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg,#C9A24B 0%,#f0c940 50%,#C9A24B 100%)",
                color: "#000",
                boxShadow: "0 6px 24px rgba(201,162,75,0.45)",
                paddingTop: "13px",
                paddingBottom: "13px",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2 text-sm">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="rgba(0,0,0,0.2)"
                      strokeWidth="3"
                    />
                    <path
                      d="M12 2a10 10 0 0110 10"
                      stroke="#000"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Processing…
                </span>
              ) : (
                <span className="flex flex-col items-center gap-0.5">
                  <span className="flex items-center gap-2 text-[15px]">
                    <Lock size={13} strokeWidth={2.5} />
                    Pay{" "}
                    {isIndia
                      ? INR(indiaTotalINR)
                      : fmtForeign(intlTotalForeign, selectedCurrency)}
                  </span>
                  <span className="text-[10px] font-semibold opacity-65 tracking-widest uppercase">
                    Secure &amp; Encrypted Checkout
                  </span>
                </span>
              )}
            </button>

            {/* Note */}
            <p className="text-[11px] text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-600">Note:</span>{" "}
              Additional convenience charges may be applied during payment
              processing based on the selected payment method.
            </p>

            {/* SSL line */}
            <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
              <Shield
                size={11}
                strokeWidth={1.5}
                className="text-gray-300 shrink-0"
              />
              256-bit SSL encrypted · PCI-DSS compliant
            </p>

            {/* Error */}
            {payError && (
              <p className="text-center text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {payError}
              </p>
            )}
          </form>

          {/* WhatsApp fallback */}
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-300 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi WENS Force, I'm interested in the ${packageData.name} Package (${INR(price)}/yr). Can you send me more details?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border-2 text-[#25D366] hover:bg-[#25D366]/5 transition-all"
              style={{ borderColor: "rgba(37,211,102,0.3)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="28"
                height="28"
                fill="#25D366"
              >
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
              </svg>
              Have questions? Chat on WhatsApp
            </a>
          </div>

          {/* Terms */}
          <p className="text-center text-gray-400 text-[11px] mt-3 font-light leading-relaxed">
            By reserving, you agree to our{" "}
            <Link
              href="https://wensforce.com/disclaimer-terms-of-services/"
              target="_blank"
              className="underline hover:text-gray-600 transition-colors"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="https://wensforce.com/privacy-policy/"
              target="_blank"
              className="underline hover:text-gray-600 transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-5 mt-4 pb-4 flex-wrap">
            {[
              { Icon: Lock, title: "100% Secure", sub: "PCI DSS" },
              { Icon: Shield, title: "Trusted Members", sub: "Since 2023" },
              { Icon: Headphones, title: "24×7 Support", sub: "Always on" },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(201,162,75,0.1)" }}
                >
                  <Icon
                    size={13}
                    strokeWidth={1.5}
                    style={{ color: "#C9A24B" }}
                  />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-600">
                    {title}
                  </p>
                  <p className="text-[9px] text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
