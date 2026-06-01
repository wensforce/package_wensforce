import { MessageCircle, Phone } from "lucide-react";

const WA_NUMBER = "917304607954";
const WA_MSG = "Hi WENS Force! I need help with my booking.";

export default function SupportFooter() {
  return (
    <div
      className="mt-14 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(37,211,102,0.1)",
            border: "1px solid rgba(37,211,102,0.15)",
          }}
        >
          <Phone size={16} style={{ color: "#25D366" }} />
        </div>
        <div>
          <p className="text-white/65 text-sm font-semibold mb-0.5">
            Need help with your booking?
          </p>
          <p className="text-white/25 text-xs leading-relaxed">
            Our concierge team is available 24×7 — reach us on WhatsApp for
            instant support.
          </p>
        </div>
      </div>

      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MSG)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110 active:scale-95 shrink-0"
        style={{
          background: "#25D366",
          boxShadow: "0 4px 16px rgba(37,211,102,0.2)",
        }}
      >
        <MessageCircle size={15} />
        WhatsApp Support
      </a>
    </div>
  );
}
