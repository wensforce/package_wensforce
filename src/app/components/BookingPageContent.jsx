"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {load} from "@cashfreepayments/cashfree-js"
import {
  Check,
  Shield,
  ArrowLeft,
  Lock,
  Car,
  Users,
  RotateCcw,
  Calendar,
  Headphones,
  Star,
  MapPin,
  User,
  Mail,
  Globe,
  IndianRupee,
} from "lucide-react";
import { useMetaEvents } from "../hooks/useMetaEvents";
import api from "../axios/axios";
import { useAuth } from "../context/AuthContext";

import {
  INR,
  WA_NUMBER,
  GST_RATE,
  CITIES,
  CURRENCIES,
  ZERO_DECIMAL,
  THREE_DECIMAL,
} from "../(protected)/booking/booking-helpers";

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

/* ─────────────────────────────────────────────────────────────────────────
   PACKAGE CAPSULES
───────────────────────────────────────────────────────────────────────── */
const formatVehicleType = (v) => {
  if (!v) return "";
  const u = v.toUpperCase();
  return ["SUV", "MPV", "EV", "VIP", "VAN", "MUV"].includes(u)
    ? u
    : v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
};

const buildCapsules = (pkg) => {
  const items = [];
  if (pkg.trips)
    items.push({
      Icon: RotateCcw,
      text: `${pkg.trips} Trip${pkg.trips !== 1 ? "s" : ""}`,
    });
  if (pkg.validity)
    items.push({
      Icon: Calendar,
      text: `${pkg.validity} Month${pkg.validity !== 1 ? "s" : ""} Validity`,
    });
  if (pkg.vehicleModel && pkg.vehicleType)
    items.push({
      Icon: Car,
      text: `${pkg.vehicleModel} · ${formatVehicleType(pkg.vehicleType)}`,
    });
  else if (pkg.vehicleModel) items.push({ Icon: Car, text: pkg.vehicleModel });
  else if (pkg.vehicleType)
    items.push({ Icon: Car, text: formatVehicleType(pkg.vehicleType) });
  if (pkg.bodyguardType)
    items.push({ Icon: Shield, text: `${pkg.bodyguardType} Security` });
  return items;
};

const SERVICE_ICONS = [
  Star,
  Headphones,
  MapPin,
  Users,
  Lock,
  Car,
  Shield,
  Check,
];

/* ─────────────────────────────────────────────────────────────────────────
   SUCCESS STATE
───────────────────────────────────────────────────────────────────────── */
function SuccessState({ packageData, form }) {
  const price = packageData.discountedPrice;
  const waMsg = encodeURIComponent(
    `Hi WENS Force! I just reserved the ${packageData.name} Package (${INR(price)}/yr).\n\nName: ${form.name}\nMobile: ${form.phone}\nCity: ${form.city || "Not specified"}\n\nPlease send the payment link.`,
  );
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,162,75,0.35) 0%, transparent 70%)",
        }}
      />
      <div className="relative max-w-lg w-full">
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#C9A24B,#f0c940)",
              boxShadow:
                "0 0 0 8px rgba(201,162,75,0.12),0 16px 48px rgba(201,162,75,0.4)",
            }}
          >
            <Check size={36} strokeWidth={3} className="text-black" />
          </div>
        </div>
        <p
          className="text-center text-[9px] font-bold tracking-[0.55em] uppercase mb-3"
          style={{ color: "#C9A24B" }}
        >
          Spot Reserved
        </p>
        <h1 className="text-center text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
          You&apos;re In,
          <br />
          {form.name.split(" ")[0]}!
        </h1>
        <p className="text-center text-white/50 text-base font-light mb-2">
          Your <strong className="text-[#C9A24B]">{packageData.name}</strong>{" "}
          founding spot is secured.
        </p>
        <p className="text-center text-white/40 text-sm font-light mb-10">
          Our concierge will call{" "}
          <span className="text-white/65">{form.phone}</span> within 12 hours.
        </p>
        <div className="relative flex items-start justify-center mb-10 px-4">
          <div
            className="absolute top-4 left-[calc(50%-60px)] right-[calc(50%-60px)] h-px"
            style={{ background: "rgba(201,162,75,0.2)" }}
          />
          {[
            { label: "Spot Reserved", sub: "Right now", done: true },
            { label: "Concierge Calls", sub: "Within 12 hours", done: false },
            { label: "Package Active", sub: "After payment", done: false },
          ].map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center relative z-10 w-28"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-3 border-2"
                style={{
                  backgroundColor: s.done
                    ? "#C9A24B"
                    : "rgba(255,255,255,0.06)",
                  borderColor: s.done ? "#C9A24B" : "rgba(255,255,255,0.12)",
                  color: s.done ? "#000" : "rgba(255,255,255,0.3)",
                }}
              >
                {s.done ? (
                  <Check size={13} strokeWidth={3} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <p
                className={`text-[11px] font-semibold text-center leading-tight ${s.done ? "text-[#C9A24B]" : "text-white/35"}`}
              >
                {s.label}
              </p>
              <p className="text-[10px] text-white/20 text-center mt-0.5">
                {s.sub}
              </p>
            </div>
          ))}
        </div>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-bold text-white text-sm mb-3 hover:opacity-90 transition-all"
          style={{
            backgroundColor: "#25D366",
            boxShadow: "0 8px 24px rgba(37,211,102,0.25)",
          }}
        >
          <svg viewBox="0 0 32 32" width="18" height="18" fill="white">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
          </svg>
          Connect on WhatsApp Now
        </a>
        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 text-white/20 text-xs hover:text-white/45 transition-colors"
        >
          <ArrowLeft size={12} /> Back to wensforce.com
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   Props:
     packageData   — the `data` object from packages API response
     foundingSpots — spots already taken (0-100)
───────────────────────────────────────────────────────────────────────── */
export default function BookingPageContent({
  packageData,
  foundingSpots = 30,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [payError, setPayError] = useState("");

  const urlCurrency = searchParams.get("currency");
  const initMethod =
    urlCurrency && urlCurrency !== "INR" ? "international" : "india";
  const initCurrency =
    urlCurrency && urlCurrency !== "INR" ? urlCurrency : "USD";

  const [paymentMethod, setPaymentMethod] = useState(initMethod);
  const [selectedCurrency, setSelectedCurrency] = useState(initCurrency);
  const [currencyRate, setCurrencyRate] = useState(94);
  const [currencyRateLoading, setCurrencyRateLoading] = useState(false);

  const price = packageData?.discountedPrice || 0;
  const anchorPrice = packageData?.regularPrice || 0;
  const hasDiscount = anchorPrice > price;
  const isIndia = paymentMethod === "india";

  /* pre-fill from auth */
  useEffect(() => {
    if (!user) return;
    const raw = (user.mobileNumber || "").replace(/\D/g, "");
    const phone = raw.length > 10 ? raw.slice(-10) : raw;
    setForm((f) => ({
      ...f,
      name: user.name || "",
      email: user.email || "",
      phone: isIndia ? phone : user.mobileNumber || "",
    }));
  }, [user, paymentMethod]); // eslint-disable-line

  /* exchange rate */
  useEffect(() => {
    if (isIndia) return;
    setCurrencyRateLoading(true);
    fetch(`/api/exchange-rate?currency=${selectedCurrency}`)
      .then((r) => r.json())
      .then((d) => setCurrencyRate(d.rate || 94))
      .catch(() => {})
      .finally(() => setCurrencyRateLoading(false));
  }, [paymentMethod, selectedCurrency]); // eslint-disable-line

  /* check if packageData is still loading */
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

  /* pricing */
  const gstAmount = Math.ceil(price * GST_RATE);
  const indiaTotalINR = price + gstAmount;
  const intlGstAmount = Math.ceil(price * GST_RATE);
  const intlTotalINR = price + intlGstAmount;
  const intlTotalForeign = currencyRateLoading
    ? null
    : roundForeign(intlTotalINR / currencyRate, selectedCurrency);

  const toForeign = (inrAmount) =>
    currencyRateLoading
      ? "…"
      : fmtForeign(
          roundForeign(inrAmount / currencyRate, selectedCurrency),
          selectedCurrency,
        );

  const currencyData =
    CURRENCIES.find((c) => c.code === selectedCurrency) ?? CURRENCIES[0];
  const spotsLeft = 100 - foundingSpots;
  const intlPriceForeign = currencyRateLoading
    ? null
    : roundForeign(price / currencyRate, selectedCurrency);

  const displayPrice = isIndia
    ? INR(price)
    : fmtForeign(intlPriceForeign, selectedCurrency);

  /* handlers */
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

  // const { trackLead } = useMetaEvents();

  const handlePaymentSubmit = async (method) => {
    const formErrors = validate();
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setPayError("");
    setLoading(true);
    try {
      const isIntl = method !== "india";
      const payload = isIntl
        ? {
            amount: intlTotalForeign,
            currency: selectedCurrency,
            customerName: form.name.trim(),
            customerPhone: form.phone,
            customerEmail: form.email.trim(),
            packageId: packageData.id,
            planName: packageData.name,
          }
        : {
            amount: indiaTotalINR,
            currency: "INR",
            customerName: form.name.trim(),
            customerPhone: form.phone,
            customerEmail: form.email.trim(),
            packageId: packageData.id,
            planName: packageData.name,
          };

      // await trackLead({
      //   value: isIntl ? intlTotalForeign : indiaTotalINR,
      //   phone: form.phone,
      //   userData: { fullName: form.name, email: form.email, city: form.city },
      // });

      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/create-order`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      console.log(payload,"payload")
      const res = await api.post('/payment/create-order',payload)
      console.log(res,"res")
      const data = res.data?.data;

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

      if (!res.ok || !data.payment_session_id)
        throw new Error(
          data.error || "Could not initiate payment. Please try again.",
        );

      await Promise.all([
        api.post("/booking", {
          packageName: packageData.name,
          packageId: packageData.id,
          validity: packageData.validity,
          serviceCity: form.city || "Not specified",
          cashfreeId: data.order_id,
          currency: isIndia ? "INR" : selectedCurrency,
          purchaseAmount: isIndia ? indiaTotalINR : intlTotalForeign,
          purchaseDate: new Date().toISOString(),
        }),
        !user?.name || !user?.email || (!user?.city && form.city)
          ? api.put("/auth/update-profile", {
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
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (err) {
      setPayError(err.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  if (submitted) return <SuccessState packageData={packageData} form={form} />;

  const capsules = buildCapsules(packageData);

  /* ── JSX ──────────────────────────────────────────────────────────────── */
  return (
    <div>
      {/* In-card header bar */}
      <div
        className="flex items-center justify-between gap-2 px-3 sm:px-6 py-3 border-b"
        style={{ borderColor: "rgba(201,162,75,0.12)" }}
      >
        {/* Left */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs transition-colors flex-shrink-0"
        >
          <ArrowLeft size={13} />
          <span className="hidden xs:inline">Back</span>
        </button>

        {/* Center */}
        <p className="flex-1 text-center text-[#C9A24B] font-bold text-[11px] sm:text-[15px] tracking-[0.12em] sm:tracking-[0.32em] uppercase truncate px-2">
          WENS Force · Secure Checkout
        </p>

        {/* Right */}
        <div className="flex items-center justify-end gap-1 text-[10px] text-gray-400 flex-shrink-0">
          <Shield
            size={11}
            strokeWidth={1.5}
            style={{ color: "rgba(201,162,75,0.65)" }}
          />
          <span className="hidden md:inline">Secure &amp; Encrypted</span>
        </div>
      </div>
      <div
        className="flex items-start justify-center p-3 sm:p-5 min-h-screen"
        style={{ backgroundColor: "#FAF6EC" }}
      >
        {/* ── Single white card ── */}
        <div
          className="w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden rounded-2xl"
          style={{
            background: "white",
            boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
            border: "1px solid rgba(201,162,75,0.15)",
          }}
        >
          {/* ════════════════════════════════════════════════════════════
            LEFT — thumbnail card + info below (matches screenshot)
        ════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col flex-shrink-0 w-full lg:w-[44%] overflow-y-auto">
            <div className="flex flex-col   ">
              {/* ── Thumbnail (partial height, not full) ── */}
              {/* Wrapper adds the side margins */}
              <div className="px-4 sm:px-5 pt-4 w-full">
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    borderRadius: "16px",
                    height: "clamp(220px, 52vw, 340px)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={packageData.thumbnailUrl}
                    alt={packageData.name}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ filter: "brightness(0.52) saturate(0.85)" }}
                  />

                  {/* Gradient */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.05) 75%, transparent 100%)",
                    }}
                  />

                  {/* Text block */}
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                      padding: "clamp(14px, 3.5vw, 24px)",
                      paddingTop: "clamp(48px, 10vw, 90px)",
                    }}
                  >
                    <p
                      className="font-semibold uppercase tracking-[0.45em]"
                      style={{
                        color: "#C9A24B",
                        fontSize: "clamp(7.5px, 1.1vw, 10px)",
                        marginBottom: "clamp(3px, 0.6vw, 6px)",
                      }}
                    >
                      Membership{" "}
                      {String(packageData.id || "01").padStart(2, "0")}
                    </p>

                    <h2
                      className="font-black text-white uppercase leading-none"
                      style={{
                        fontSize: "clamp(26px, 6vw, 44px)",
                        letterSpacing: "0.02em",
                        marginBottom: "clamp(4px, 0.8vw, 8px)",
                      }}
                    >
                      {packageData.name}
                    </h2>

                    {packageData.tagline && (
                      <p
                        className="text-white/60 font-light leading-snug"
                        style={{ fontSize: "clamp(11px, 1.5vw, 14px)" }}
                      >
                        {packageData.tagline}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Info section below thumbnail ── */}
              <div className="px-5 pt-5 pb-4 space-y-4">
                {/* Price row */}
                <div>
                  <div className="flex items-end gap-3 flex-wrap mb-1">
                    <span
                      className="font-black tabular-nums text-gray-900 leading-none"
                      style={{ fontSize: "clamp(24px, 3vw, 32px)" }}
                    >
                      {displayPrice}
                    </span>
                    <span className="text-gray-400 text-xs mb-1">
                      GST 18% Extra · / year, all-inclusive
                    </span>
                    {hasDiscount && (
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border mb-1"
                        style={{
                          color: "#C9A24B",
                          borderColor: "rgba(201,162,75,0.4)",
                          background: "rgba(201,162,75,0.07)",
                        }}
                      >
                        Save {INR(anchorPrice - price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Capsules section */}
                {capsules.length > 0 && (
                  <div
                    className="rounded-xl p-3.5"
                    style={{
                      background: "#fafaf8",
                      border: "1px solid rgba(201,162,75,0.18)",
                    }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {capsules.map(({ Icon, text }, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                          style={{
                            background: "rgba(201,162,75,0.08)",
                            color: "#6b5a2e",
                            border: "1px solid rgba(201,162,75,0.22)",
                          }}
                        >
                          <Icon
                            size={11}
                            strokeWidth={2}
                            style={{ color: "#C9A24B" }}
                          />
                          {text}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* What's Included */}
                {packageData.packageServices?.length > 0 && (
                  <div>
                    <p
                      className="text-[9px] font-bold tracking-[0.4em] uppercase mb-3"
                      style={{ color: "#888" }}
                    >
                      What&apos;s Included
                    </p>
                    <ul className="space-y-0">
                      {packageData.packageServices.slice(0, 6).map((ps, i) => {
                        const IconComp =
                          SERVICE_ICONS[i % SERVICE_ICONS.length];
                        return (
                          <li
                            key={ps.service?.id ?? i}
                            className="flex items-center justify-between gap-3 py-2.5"
                            style={{
                              borderBottom:
                                i <
                                Math.min(
                                  packageData.packageServices.length,
                                  6,
                                ) -
                                  1
                                  ? "1px solid rgba(0,0,0,0.05)"
                                  : "none",
                            }}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                style={{ background: "rgba(201,162,75,0.15)" }}
                              >
                                <Check
                                  size={10}
                                  strokeWidth={3}
                                  style={{ color: "#C9A24B" }}
                                />
                              </div>
                              <span className="text-gray-700 text-[13px] font-light">
                                {ps.count > 1 ? `${ps.count}× ` : ""}
                                {ps.service?.title ?? "Included Service"}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
            RIGHT — header bar + scrollable form
        ════════════════════════════════════════════════════════════ */}
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

            {/* Scrollable form area */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4">
                {/* Reserve spot header row */}
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
                    <p className="text-gray-400 text-[10px] mt-0.5">per year</p>
                  </div>
                </div>

                {/* ── FORM ── */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePaymentSubmit(paymentMethod);
                  }}
                  className="space-y-4"
                >
                  {/* Payment Region */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-[0.22em] uppercase">
                      Payment Region
                    </label>
                    <div className="grid grid-cols-2 gap-2 ">
                      {/* India */}
                      <button
                        type="button"
                        onClick={() => handleMethodChange("india")}
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
                            <Check
                              size={9}
                              strokeWidth={3.5}
                              className="text-black"
                            />
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
                        onClick={() => handleMethodChange("international")}
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
                            <Check
                              size={9}
                              strokeWidth={3.5}
                              className="text-black"
                            />
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

                    {/* Currency selector */}
                    {!isIndia && (
                      <div className="mt-2.5">
                        <label className="block text-[10px] font-bold text-gray-400 mb-1.5 tracking-[0.22em] uppercase">
                          Select Currency
                        </label>
                        <div className="relative">
                          <select
                            value={selectedCurrency}
                            onChange={(e) =>
                              setSelectedCurrency(e.target.value)
                            }
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
                        {currencyRateLoading ? (
                          <p className="text-[10px] text-amber-600 mt-1">
                            Fetching live rate…
                          </p>
                        ) : (
                          <p className="text-[10px] text-gray-400 mt-1">
                            1 {selectedCurrency} ≈{" "}
                            {INR(Math.round(currencyRate))} · live rate
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Row 1: Full Name + Phone */}
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
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="e.g. Rajan Mehta"
                          className="flex-1 px-2.5 py-2.5 text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-300"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-[10px] mt-1">
                          {errors.name}
                        </p>
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
                                phone: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10),
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
                          onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                          }
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

                  {/* Order Summary */}
                  <div
                    className="rounded-xl border p-3.5"
                    style={{
                      backgroundColor: "#fafaf8",
                      borderColor: "rgba(201,162,75,0.12)",
                    }}
                  >
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
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          {packageData.name}
                        </span>
                        <div className="text-right">
                          <span className="text-gray-700 text-sm font-semibold tabular-nums">
                            {isIndia
                              ? INR(price) + "*"
                              : toForeign(price) + "*"}
                          </span>
                          {!isIndia && !currencyRateLoading && (
                            <p className="text-gray-400 text-[10px] tabular-nums">
                              {INR(price)}*
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            +18%
                          </span>
                          GST
                        </span>
                        <div className="text-right">
                          <span className="text-gray-600 text-sm font-semibold tabular-nums">
                            +
                            {isIndia
                              ? INR(gstAmount)
                              : toForeign(intlGstAmount)}
                          </span>
                          {!isIndia && !currencyRateLoading && (
                            <p className="text-gray-400 text-[10px] tabular-nums">
                              +{INR(intlGstAmount)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
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
                            {!currencyRateLoading &&
                              intlTotalForeign !== null && (
                                <p className="text-gray-400 text-[10px] mt-0.5 tabular-nums">
                                  ≈ {INR(intlTotalINR)} · live rate
                                </p>
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

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

                {/* WhatsApp section */}
                <div className="mt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[11px] text-gray-300 font-medium">
                      or
                    </span>
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
                    {
                      Icon: Shield,
                      title: "Trusted Members",
                      sub: "Since 2023",
                    },
                    {
                      Icon: Headphones,
                      title: "24×7 Support",
                      sub: "Always on",
                    },
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
              {/* closes px-6 py-4 */}
            </div>
            {/* closes overflow-y-auto */}
          </div>
          {/* closes right flex-col */}
        </div>
        {/* closes white card */}

       
        <div className="h-20 lg:hidden" />
      </div>
    </div>
  );
}
