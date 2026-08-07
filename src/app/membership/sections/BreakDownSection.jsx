import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { formatPackageValidity } from '@/app/utils/formatPackageValidity';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function BreakdownSection({ plan, waUrl }) {
  const allServices = plan.packageServices || [];
  const hasDiscount = plan.regularPrice && plan.regularPrice > plan.discountedPrice;

  const summaryRows = [
    { label: 'Validity', val: formatPackageValidity(plan.validity) },
    { label: 'Curated Journeys', val: `${plan.trips} per year` },
    { label: 'Vehicle', val: [plan.vehicleType, plan.vehicleModel].filter(Boolean).join(' · ') },
    { label: 'Security', val: plan.bodyguardType || 'Standard' },
    ...(hasDiscount ? [{ label: 'Regular Price', val: INR(plan.regularPrice) }] : []),
    { label: 'Your Price', val: INR(plan.discountedPrice) },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-14">
          {/* LEFT: privileges breakdown */}
          <div>
            <p
              className="text-[9px] font-bold tracking-[0.5em] uppercase mb-3"
              style={{ color: '#C9A24B' }}
            >
              Full Breakdown
            </p>
            <h2
              className="font-black mb-10 text-[#0B1E3F]"
              style={{ fontSize: 'clamp(24px,3.5vw,36px)' }}
            >
              All Included Privileges
            </h2>

            {allServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allServices.map((ps, i) => (
                  <div
                    key={ps.id ?? i}
                    className="p-5 rounded-2xl border bg-slate-50 border-slate-100 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 border bg-slate-50 border-slate-100">
                      <CheckCircle size={18} strokeWidth={1.5} className="text-[#C9A24B]" />
                    </div>
                    <h4 className="text-[14px] font-bold leading-snug mb-1.5 text-gray-900">
                      {ps.service?.title}
                      {ps.count > 1 && <span className="text-[#C9A24B]"> ×{ps.count}</span>}
                    </h4>
                    {ps.service?.description && (
                      <p className="text-[11px] font-light leading-snug text-slate-400">
                        {ps.service.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 font-light">
                Service details for this plan will be added soon.
              </p>
            )}
          </div>

          {/* RIGHT: sticky summary + CTAs */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="rounded-2xl overflow-hidden border bg-slate-50 border-slate-100">
              <div className="px-5 py-4 border-b border-black/[0.06]">
                <p className="text-[9px] font-bold tracking-[0.35em] uppercase text-gray-300">
                  Plan Summary
                </p>
              </div>
              <div className="p-5">
                {summaryRows.map(({ label, val }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center gap-3 py-3 border-b last:border-0 border-black/[0.06]"
                  >
                    <span className="text-[11px] font-medium text-slate-400">{label}</span>
                    <span className="text-[12px] font-bold text-gray-900 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                href={`/booking/${plan.id}`}
                className="flex items-center justify-center gap-2 w-full py-4 px-4 rounded-2xl font-black text-black text-sm transition-all hover:shadow-2xl hover:-translate-y-0.5 text-center leading-snug"
                style={{
                  background: 'linear-gradient(135deg,#C9A24B 0%,#f0c940 50%,#C9A24B 100%)',
                  boxShadow: '0 6px 24px rgba(201,162,75,0.45)',
                }}
              >
                Buy {plan.name} — {INR(plan.discountedPrice)}
                <span>→</span>
              </Link>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#25D366', color: 'white' }}
              >
                <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
        </svg>
                Have Questions? WhatsApp Us
              </a>

              <p className="text-center text-[10px] text-slate-400">
                No Hidden Fees · Instant Activation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}