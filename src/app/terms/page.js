import { ShieldCheck } from "lucide-react";

const TERMS = [
  {
    title: "Validity",
    body: "All subscriptions are valid for 12 months from the date of activation. Unused trips and privileges lapse at expiry — they cannot be carried forward or refunded.",
  },
  {
    title: "Booking Window",
    body: "Minimum 4-hour advance booking notice. Same-day bookings subject to fleet availability and may incur a priority surcharge.",
  },
  {
    title: "Trip Conversions",
    body: "Mixed redemptions (Sedan↔SUV / Airport↔Local) are permitted up to 2 conversions per package, subject to fleet availability and surcharge applicable based on location and vehicle.",
  },
  {
    title: "Service Area",
    body: "Available across Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, and select Tier-2 cities. Outstation trips on request with Pro Rata Basis.",
  },
  {
    title: "Cancellation",
    body: "Free cancellation up to 4 hours before scheduled pickup. Cancellations within 4 hours count as a redeemed trip.",
  },
  {
    title: "Privileges",
    body: "Darshan, Heritage Monument access, lounge access, and partner privileges are subject to third-party schedules and availability. WENS Force facilitates bookings as part of concierge service.",
  },
  {
    title: "Renewal",
    body: "Subscribers receive priority renewal pricing and exclusive loyalty benefits in subsequent years.",
  },
  {
    title: "Confidentiality",
    body: "All client information, travel patterns, and personal details are strictly confidential. WENS Force operates under enforced NDAs across all staff.",
  },
];

export const metadata = {
  title: "Terms & Conditions — WENS Force",
  description: "Terms and conditions governing WENS Force membership subscriptions.",
};

export default function TermsPage() {
  return (
    <main
      className="min-h-screen px-4 py-16"
      style={{ backgroundColor: "#0B1E3F" }}
    >
      {/* Top glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,162,75,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div
            className="rounded-2xl flex items-center justify-center mb-5"
            style={{
              width: 52,
              height: 52,
              background: "rgba(201,162,75,0.08)",
              border: "1px solid rgba(201,162,75,0.2)",
            }}
          >
            <ShieldCheck size={22} style={{ color: "#C9A24B" }} />
          </div>

          <p
            className="text-[9px] font-black tracking-[0.55em] uppercase mb-3"
            style={{ color: "#C9A24B" }}
          >
            WENS Force
          </p>

          <h1
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-playfair, serif)" }}
          >
            Terms You Should Know
          </h1>

          <p className="text-sm text-slate-400 max-w-sm">
            By activating a WENS Force membership you agree to the terms listed
            below. Please read them carefully.
          </p>

          {/* Gold divider */}
          <div
            className="mt-6 rounded-full"
            style={{
              width: 48,
              height: 2,
              background: "linear-gradient(90deg, transparent, #C9A24B, transparent)",
            }}
          />
        </div>

        {/* Terms list */}
        <div className="flex flex-col gap-4">
          {TERMS.map((term, i) => (
            <div
              key={term.title}
              className="flex gap-5 rounded-2xl px-6 py-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Number badge */}
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                style={{
                  background: "rgba(201,162,75,0.12)",
                  border: "1px solid rgba(201,162,75,0.25)",
                  color: "#C9A24B",
                }}
              >
                {i + 1}
              </span>

              <div>
                <h2
                  className="text-sm font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-playfair, serif)" }}
                >
                  {term.title}
                </h2>
                <p className="text-sm leading-relaxed text-slate-400">
                  {term.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-10">
          These terms are subject to change. Members will be notified of any
          material updates.
        </p>
      </div>
    </main>
  );
}
