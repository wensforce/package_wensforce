"use client";

const WA_NUMBER = "917304607954";

export default function ReferralBanner() {
  const shareMsg =
    "I'm a member of @WENS_Force — India's only luxury subscription with VIP Darshan + Armed Protection. You can get ₹10,000 off any tier above Essential. Join here:";
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareMsg + " https://subscription.wensforce.com")}`;

  return (
    <section className="py-16 px-6" style={{ backgroundColor: "#0B1E3F" }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[#C9A24B] text-[10px] tracking-[0.5em] uppercase font-semibold mb-4">
          ★ Members Refer Members ★
        </p>

        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mb-4">
          Refer a Friend, Both Win.
        </h2>

        <p className="text-white/60 text-base font-light mb-2">
          When they join, you get{" "}
          <strong className="text-[#C9A24B]">
            ₹15,000 in WENS Travel Credits + 1 Free Premium Darshan.
          </strong>
        </p>
        <p className="text-white/60 text-base font-light mb-10">
          They get <strong className="text-white">₹10,000 off</strong> any tier
          above Essential.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[#0B1E3F] text-sm transition-all hover:opacity-90 hover:shadow-lg"
            style={{ backgroundColor: "#C9A24B" }}
          >
            Get My Referral Link
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white text-sm border border-[#25D366] hover:bg-[#25D366]/10 transition-all"
          >
            <svg viewBox="0 0 32 32" width="16" height="16" fill="#25D366">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
            </svg>
            Send via WhatsApp
          </a>
        </div>

        <p className="mt-6 text-white/30 text-xs font-light">
          Existing member?{" "}
          <a href="#" className="text-[#C9A24B] hover:underline">
            Sign in to view your referral dashboard →
          </a>
        </p>

        {/* Tier-up bonus */}
        <div className="mt-8 inline-block px-5 py-3 rounded-xl border border-white/10 bg-white/5">
          <p className="text-white/50 text-xs font-light">
            Refer 3 members → free tier upgrade for 3 months.{" "}
            <span className="text-[#C9A24B]">
              Top 5 referrers become WENS Ambassadors.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
