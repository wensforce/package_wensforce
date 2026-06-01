import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="mb-10">
      {/* Back navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs font-medium tracking-wide transition-colors mb-8 group"
      >
        <ArrowLeft
          size={14}
          className="transition-transform group-hover:-translate-x-0.5"
        />
        Back to Home
      </Link>

      {/* Title block */}
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-1"
          style={{
            background: "rgba(201,162,75,0.1)",
            border: "1px solid rgba(201,162,75,0.2)",
          }}
        >
          <LayoutDashboard size={20} style={{ color: "#C9A24B" }} />
        </div>

        <div>
          <p
            className="text-[10px] font-bold tracking-[0.5em] uppercase mb-1.5"
            style={{ color: "#C9A24B" }}
          >
            Member Portal
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white leading-none mb-3"
            style={{ fontFamily: "var(--font-playfair, serif)" }}
          >
            My Bookings
          </h1>
          <p className="text-white/35 text-sm font-light leading-relaxed max-w-sm">
            View all your WENS Force membership orders — trips, vehicle
            privileges, and protection included.
          </p>
        </div>
      </div>

      {/* Thin gold divider */}
      <div
        className="mt-8 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(201,162,75,0.4) 0%, rgba(201,162,75,0.08) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}
