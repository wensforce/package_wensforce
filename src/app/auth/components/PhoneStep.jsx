import { ArrowRight } from "lucide-react";
import { COUNTRIES } from "../data/countries";

export default function PhoneStep({ country, onCountryChange, phone, onPhoneChange, onSubmit, isLoading }) {
  const digits = phone.replace(/\D/g, "").slice(-10);
  const isValid = digits.length === 10;

  function handleCountryChange(e) {
    const found = COUNTRIES.find((c) => c.code === e.target.value);
    if (found) onCountryChange(found);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">

      {/* Country Code */}
      <div>
        <label
          className="block text-[10px] font-bold tracking-[0.3em] uppercase mb-2"
          style={{ color: "#94a3b8" }}
        >
          Country Code
        </label>
        <div
          className="relative rounded-2xl transition-all duration-200"
          style={{ border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
        >
          <select
            value={country.code}
            onChange={handleCountryChange}
            className="w-full appearance-none px-4 py-3.5 bg-transparent text-sm font-semibold outline-none cursor-pointer rounded-2xl pr-8"
            style={{ color: "#1e293b" }}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dial})
              </option>
            ))}
          </select>
          {/* chevron icon */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label
          className="block text-[10px] font-bold tracking-[0.3em] uppercase mb-2"
          style={{ color: "#94a3b8" }}
        >
          Mobile Number
        </label>
        <div
          className="flex items-center rounded-2xl transition-all duration-200"
          style={{
            border: `1.5px solid ${phone ? "#C9A24B" : "#e2e8f0"}`,
            background: "#ffffff",
            boxShadow: phone ? "0 0 0 3px rgba(201,162,75,0.08)" : "none",
          }}
        >
          {/* dial code prefix */}
          <span
            className="pl-4 pr-1 text-sm font-bold shrink-0 select-none"
            style={{ color: "#C9A24B" }}
          >
            {country.dial}
          </span>
          <input
            type="tel"
            value={phone}
              onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ""))}
            placeholder="98765 43210"
            className="flex-1 px-3 py-3.5 bg-transparent text-gray-800 placeholder-gray-300 text-sm outline-none"
            maxLength={15}
            inputMode="tel"
            autoComplete="tel"
            autoFocus
          />
        </div>
      </div>

      {/* CTA */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        style={{
          background: isValid
            ? "linear-gradient(135deg, #C9A24B 0%, #f0c940 50%, #C9A24B 100%)"
            : "#e2e8f0",
          color: isValid ? "#1a0f00" : "#94a3b8",
          boxShadow: isValid && !isLoading ? "0 8px 24px rgba(201,162,75,0.35)" : "none",
        }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            Send OTP
            <ArrowRight size={16} strokeWidth={2.5} />
          </>
        )}
      </button>

    </form>
  );
}
