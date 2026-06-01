import { Car, Shield, CalendarDays, Hash, Wallet, LayoutGrid } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { PLAN_META, getPlanKeyFromOrderId, formatINR, formatDate, addOneYear } from "../lib/planMeta";

function DetailItem({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/30">
        <Icon size={10} />
        {label}
      </span>
      <span
        className="text-sm font-semibold"
        style={{ color: accent ? accent : "rgba(255,255,255,0.85)" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function BookingCard({ booking, index }) {
  const planKey = booking.plan || getPlanKeyFromOrderId(booking.orderId);
  const meta = PLAN_META[planKey];

  const accentColor = meta?.accentColor ?? "#C9A24B";
  const planLabel = meta?.label ?? booking.planLabel ?? "Membership";
  const trips = meta?.trips ?? "—";
  const vehicle = meta?.vehicle ?? "—";
  const bodyguard = meta?.bodyguard ?? "—";

  const shortOrderId =
    booking.orderId?.length > 26
      ? `${booking.orderId.slice(0, 26)}…`
      : booking.orderId ?? "—";

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group"
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Left accent strip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}55)` }}
      />

      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at top left, ${accentColor}0D 0%, transparent 60%)`,
        }}
      />

      <div className="pl-6 pr-5 py-5">
        {/* ── Top row: plan identity + status ── */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            {/* Plan badge */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold"
              style={{
                background: `${accentColor}1A`,
                border: `1px solid ${accentColor}33`,
                color: accentColor,
                fontFamily: "var(--font-playfair, serif)",
              }}
            >
              {planLabel.charAt(0)}
            </div>
            <div>
              <p
                className="text-[9px] font-bold tracking-[0.45em] uppercase mb-0.5"
                style={{ color: accentColor }}
              >
                WENS Force
              </p>
              <h3 className="text-white font-bold text-[17px] leading-tight">
                {planLabel}{" "}
                <span className="text-white/40 font-normal text-sm">Membership</span>
              </h3>
            </div>
          </div>
          <div className="shrink-0 mt-0.5">
            <StatusBadge status={booking.paymentStatus} />
          </div>
        </div>

        {/* ── Detail grid ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-4 p-4 rounded-xl mb-4"
          style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <DetailItem
            icon={LayoutGrid}
            label="Trips"
            value={`${trips} journeys`}
            accent={accentColor}
          />
          <DetailItem
            icon={Wallet}
            label="Paid"
            value={formatINR(booking.amount)}
            accent={accentColor}
          />
          <DetailItem
            icon={CalendarDays}
            label="Booked on"
            value={formatDate(booking.paidAt)}
          />
          <DetailItem
            icon={CalendarDays}
            label="Valid until"
            value={addOneYear(booking.paidAt)}
          />
        </div>

        {/* ── Perks pills ── */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { icon: Car, text: vehicle },
            { icon: Shield, text: bodyguard },
          ].map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Icon size={11} />
              {text}
            </span>
          ))}
        </div>

        {/* ── Order ID strip ── */}
        <div
          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg"
          style={{ background: "rgba(0,0,0,0.25)" }}
        >
          <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-white/25">
            <Hash size={10} />
            Order ID
          </span>
          <span className="text-white/40 text-[11px] font-mono tracking-wide">
            {shortOrderId}
          </span>
        </div>
      </div>
    </div>
  );
}
