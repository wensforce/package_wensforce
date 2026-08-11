import Link from "next/link";
import { ShieldCheck, ArrowLeft, Shield } from "lucide-react";
import { TERMS } from "../constants/terms";

export const metadata = {
  title: "Terms & Conditions — WENS Force",
  description: "Terms and conditions governing WENS Force membership subscriptions.",
};

export default function TermsPage() {
  return (
    <>
      {/* ── Header bar ── */}
      <div
        className="flex items-center justify-between gap-2 px-3 sm:px-6 py-3 border-b bg-white"
        style={{ borderColor: "rgba(201,162,75,0.12)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-xs transition-colors flex-shrink-0"
        >
          <ArrowLeft size={13} />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
        <p className="flex-1 text-center text-[#C9A24B] font-bold text-[11px] sm:text-[15px] tracking-[0.12em] sm:tracking-[0.32em] uppercase truncate px-2">
          WENS Force · Terms & Conditions
        </p>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 flex-shrink-0">
          <Shield size={11} strokeWidth={1.5} style={{ color: "rgba(201,162,75,0.65)" }} />
          <span className="hidden md:inline">Legal</span>
        </div>
      </div>

      <main
        className="min-h-screen px-4 sm:px-6 py-12 sm:py-16"
        style={{ background: "var(--color-cream)" }}
      >
        <div className="max-w-3xl mx-auto">

          {/* Page header */}
          <div className="text-center mb-12 animate-fade-in">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
              style={{
                background: "rgba(201,162,75,0.12)",
                border: "1px solid rgba(201,162,75,0.3)",
              }}
            >
              <ShieldCheck size={22} style={{ color: "var(--color-gold)" }} />
            </div>

            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
              WENS Force
            </p>

            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-3">
              Terms You Should Know
            </h1>

            <p className="text-gray-500 text-base font-light max-w-md mx-auto">
              By activating a WENS Force membership you agree to the terms listed
              below. Please read them carefully.
            </p>

            <div
              className="mx-auto mt-6 rounded-full"
              style={{
                width: 48,
                height: 2,
                background: "linear-gradient(90deg, transparent, #C9A24B, transparent)",
              }}
            />
          </div>

          {/* Terms list */}
          <div className="space-y-3">
            {TERMS.map((term, i) => (
              <div
                key={term.title}
                className="flex gap-4 sm:gap-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 px-5 sm:px-6 py-5"
              >
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{
                    background: "rgba(201,162,75,0.12)",
                    border: "1px solid rgba(201,162,75,0.25)",
                    color: "var(--color-gold)",
                  }}
                >
                  {i + 1}
                </span>

                <div>
                  <h2 className="font-serif-display text-[15px] font-bold text-[#0B1E3F] mb-1.5">
                    {term.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-600 font-light">
                    {term.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-10 p-6 sm:p-7 bg-[#FAF6EC] border border-[#C9A24B]/20 rounded-2xl text-center">
            <p className="text-[#0B1E3F] font-semibold mb-1">
              Terms may be updated
            </p>
            <p className="text-gray-500 text-sm font-light">
              These terms are subject to change. Members will be notified of any
              material updates.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
