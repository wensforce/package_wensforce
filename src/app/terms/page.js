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
    body: "VIP Darshan, Heritage Monument access, lounge access, and partner privileges are subject to third-party schedules and availability. WENS Force facilitates bookings as part of concierge service.",
  },
  {
    title: "Renewal",
    body: "Subscribers receive priority renewal pricing and exclusive loyalty benefits in subsequent years.",
  },
  {
    title: "Confidentiality",
    body: "All client information, travel patterns, and personal details are strictly confidential. WENS Force operates under enforced NDAs across all staff.",
  },
  {
    title: "Referral Program — Eligibility",
    body: "The referral program is open to existing WENS Force subscribers and, where configured, to new users (referees) registering on the platform. A referral is valid only when the referee applies a unique referral code at the time of registration. Eligibility for rewards — and which party (referrer, referee, or both) qualifies — is determined solely by the program configuration active at the time the referral code is applied.",
  },
  {
    title: "Referral Program — Reward Structure",
    body: "Rewards under this program may be issued as platform coins, discount coupons, or any other benefit as determined by WENS Force at its sole discretion. The reward type, value, and recipient(s) are defined per program configuration and may differ across campaigns. WENS Force reserves the right to run asymmetric reward programs where the referrer and referee receive different rewards, or where only one party receives a reward.",
  },
  {
    title: "Referral Program — Reward Trigger",
    body: "A reward is generated only upon completion of the qualifying action defined for that program. Qualifying actions may include: (a) successful registration using the referral code, (b) purchase of a specific designated plan, or (c) purchase of any plan within a defined package category — as configured by WENS Force for that campaign. Applying a referral code alone does not guarantee reward generation unless registration is itself the defined trigger.",
  },
  {
    title: "Referral Program — Reward Lock-in",
    body: "The reward type and value applicable to a referral are locked at the rates published at the time the referee applies the referral code during registration. Subsequent changes to the program configuration — including reward value, reward type, or qualifying trigger — do not apply to referrals already registered, provided the qualifying action is completed within the validity window.",
  },
  {
    title: "Referral Program — Qualifying Window",
    body: "Where the qualifying trigger is a purchase (specific plan or category), the referee must complete the qualifying action before whichever occurs first: (a) the published end date of the referral program, or (b) any qualifying window duration specified at the time of referral code application. If no explicit end date or window duration is configured, the qualifying action must be completed while the referral program remains in an active state. Referrals where the qualifying action is not completed within the applicable window expire automatically and no reward is issued to either party, regardless of subsequent activity.",
  },,
  {
    title: "Referral Program — Program Suspension or Termination",
    body: "WENS Force reserves the right to pause, modify, or permanently discontinue the referral program or any active campaign at any time without prior notice. If the program is paused or closed at the time the qualifying action is completed, no reward will be generated or disbursed to either party — even if the referral was registered while the program was active. Rewards pending at the time of suspension or termination stand forfeited unless explicitly communicated otherwise by WENS Force.",
  },
  {
    title: "Referral Program — Coins & Coupons Usage",
    body: "Platform coins issued as referral rewards are redeemable only against eligible WENS Force purchases and carry no cash value. Discount coupons are non-transferable, valid for a defined period as stated at the time of issuance, and cannot be clubbed with other active offers unless explicitly permitted. Expired or unused coins and coupons are forfeited and cannot be reinstated.",
  },
  {
    title: "Referral Program — General Conditions",
    body: "Self-referrals, duplicate accounts, bulk code distribution, or any fraudulent use of referral codes will result in immediate disqualification of all associated referrals and may lead to account suspension. WENS Force's determination of reward eligibility, trigger completion, and disbursement is final and binding. These terms are governed by the version in effect at the time the referral code is applied.",
  },{
    title: "Referral Program — Reward Redemption Scope",
    body: "The redemption scope of any referral reward — whether coins or discount coupons — is defined at the program configuration level by WENS Force. A reward may be restricted to: (a) a specific plan or package, (b) a defined category of packages, or (c) any available WENS Force offering, as determined by the active campaign settings. The applicable redemption scope is communicated at the time of reward issuance. Attempting to redeem a reward against an ineligible plan or category will result in the reward being declined at checkout; the reward remains valid until its expiry date subject to redemption against an eligible offering. WENS Force reserves the right to modify the redemption scope of future rewards; rewards already issued retain the scope communicated at issuance.",
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
