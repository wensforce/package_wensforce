import { Inbox, SearchX } from "lucide-react";
import BookingCard from "./BookingCard";

export function EmptyState({ searched }) {
  const Icon = searched ? SearchX : Inbox;

  const title = searched
    ? "No bookings found"
    : "Enter your phone number above";

  const description = searched
    ? "We couldn't find any bookings for this number on this device. Try the number you registered with, or contact support."
    : "Your memberships and journeys will appear here once you search.";

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: "rgba(201,162,75,0.07)",
          border: "1px solid rgba(201,162,75,0.12)",
        }}
      >
        <Icon size={26} style={{ color: "rgba(201,162,75,0.55)" }} />
      </div>
      <h3 className="text-white/70 font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/25 text-sm font-light max-w-xs leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function BookingsList({ bookings }) {
  return (
    <div>
      {/* Result count */}
      <p className="text-white/30 text-xs font-medium tracking-wide mb-5">
        Showing{" "}
        <span className="text-white/70 font-semibold">{bookings.length}</span>{" "}
        booking{bookings.length !== 1 ? "s" : ""}
      </p>

      <div className="flex flex-col gap-4">
        {bookings.map((booking, i) => (
          <BookingCard key={booking.orderId ?? i} booking={booking} index={i} />
        ))}
      </div>
    </div>
  );
}
