import Link from "next/link";

const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function OtherPlansSection({ plans, currentId }) {
  const list = (plans || []).filter((p) => p.id !== currentId);

  if (list.length === 0) return null;

  console.log(plans, "plans");

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#C9A24B] text-[9px] tracking-[0.5em] uppercase font-semibold mb-3">
            Compare Options
          </p>

          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0B1E3F]">
            Explore other tiers
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {list.map((p) => {
            const hasDiscount =
              p.regularPrice && p.regularPrice > p.discountedPrice;

            return (
              <Link
                key={p.id}
                href={`/membership/${p.id}`}
                className="group relative rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
                style={{ boxShadow: "0 4px 16px -4px rgba(0,0,0,0.12)" }}
              >
                <div
                  className="relative p-5 h-full flex flex-col bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(${p.thumbnailUrl})`,
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/55" />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <span className="text-[10px] font-black tracking-widest uppercase text-white mb-3">
                      {p.name}
                    </span>

                    {hasDiscount && (
                      <span className="text-[10px] line-through text-white/40">
                        {INR(p.regularPrice)}
                      </span>
                    )}

                    <div className="text-lg font-black leading-none mb-0.5 text-white">
                      {INR(p.discountedPrice)}*
                    </div>

                    <div className="text-[9px] font-light mb-4 text-white/70">
                      per year
                    </div>

                    <div className="mt-auto inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 w-fit">
                      View plan
                      <span className="group-hover:translate-x-0.5 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}