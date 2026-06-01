import { Phone, Search, Loader2 } from "lucide-react";

export default function PhoneSearchForm({ phone, onChange, onSubmit, isLoading }) {
  return (
    <form onSubmit={onSubmit} className="mb-10">
      <label className="block text-[10px] font-bold tracking-[0.4em] uppercase text-white/35 mb-3">
        Registered Phone Number
      </label>

      <div
        className="flex gap-2 p-1.5 rounded-2xl transition-all duration-200 focus-within:ring-1"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          "--tw-ring-color": "rgba(201,162,75,0.3)",
        }}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-3 flex-1 min-w-0">
          <Phone size={15} className="text-white/25 shrink-0" />
          <input
            type="tel"
            value={phone}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. 98765 43210"
            className="bg-transparent text-white placeholder-white/20 text-sm flex-1 outline-none min-w-0"
            maxLength={15}
            inputMode="tel"
            autoComplete="tel"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading || !phone.replace(/\D/g, "").slice(-10).length}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          style={{
            background: "linear-gradient(135deg, #C9A24B 0%, #f0c940 50%, #C9A24B 100%)",
            boxShadow: "0 4px 20px rgba(201,162,75,0.25)",
            minWidth: 110,
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Searching…
            </>
          ) : (
            <>
              <Search size={14} />
              Look Up
            </>
          )}
        </button>
      </div>

      <p className="mt-2.5 text-white/20 text-xs">
        Enter the phone number you used when booking.
      </p>
    </form>
  );
}
