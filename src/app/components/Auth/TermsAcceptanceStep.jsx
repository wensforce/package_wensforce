"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2, ExternalLink } from "lucide-react";

export default function TermsAcceptanceStep({
  onAccept,
  loading = false,
  error = "",
  successMessage = "",
  compact = false,
}) {
  return (
    <div className={`${compact ? "space-y-5" : "space-y-7"} animate-fade-in`}>
      <div className="space-y-1.5">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
          style={{
            background: "rgba(201,162,75,0.12)",
            border: "1px solid rgba(201,162,75,0.3)",
          }}
        >
          <ShieldCheck size={17} style={{ color: "var(--color-gold)" }} />
        </div>
        <h1
          className={`${compact ? "text-xl" : "text-3xl"} font-bold`}
          style={{
            color: "var(--color-navy)",
            fontFamily: "var(--font-playfair)",
          }}
        >
          Terms & Conditions
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Please accept our terms to continue using WENS Force.
        </p>
      </div>

      <div
        className={`rounded-2xl ${compact ? "p-4 sm:p-5" : "p-6 sm:p-8"} space-y-5 shadow-sm`}
        style={{
          background: "var(--color-white)",
          border: "1px solid var(--color-border)",
        }}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          By continuing, you agree to the WENS Force{" "}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "var(--color-gold)" }}
          >
            Terms & Conditions
            <ExternalLink size={12} />
          </Link>
          .
        </p>

        {error && (
          <p className="text-xs pl-0.5" style={{ color: "#C53030" }}>
            {error}
          </p>
        )}

        {successMessage && (
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs"
            style={{
              background: "#F0FFF4",
              border: "1px solid #9AE6B4",
              color: "#276749",
            }}
          >
            <CheckCircle2 size={13} />
            {successMessage}
          </div>
        )}

        <button
          type="button"
          onClick={() => !loading && onAccept?.()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background:
              "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)",
            color: "var(--color-white)",
          }}
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <>
              Accept & Continue
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
