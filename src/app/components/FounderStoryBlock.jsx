export default function FounderStoryBlock() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#0B1E3F' }}>
      <div className="max-w-5xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Photo */}
          <div className="relative">
            <div
              className="rounded-2xl overflow-hidden aspect-square max-w-sm mx-auto lg:mx-0 bg-white/5 border border-white/10 flex items-center justify-center"
              style={{ minHeight: 340 }}
            >
              {/* Placeholder portrait */}
              <div className="text-center p-12">
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
                  style={{ backgroundColor: '#C9A24B', color: '#0B1E3F' }}
                >
                  WF
                </div>
                <p className="text-white/30 text-xs font-light">Founder Portrait</p>
              </div>
            </div>
            {/* Decorative accent */}
            <div
              className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-10 blur-2xl"
              style={{ backgroundColor: '#C9A24B' }}
            />
          </div>

          {/* Story */}
          <div>
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-5">
              From the Founder
            </p>

            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mb-6 leading-snug">
              &ldquo;Why I Built WENS Force.&rdquo;
            </h2>

            <div className="space-y-4 text-white/65 text-[15px] leading-relaxed font-light">
              <p>
                After years arranging mobility for global executives and dignitaries, I noticed a gap.
                India&apos;s most discerning travellers — business families, NRIs, C-suite leaders,
                celebrities — were patching together services from six different vendors for a single trip.
              </p>
              <p>
                Vehicle from one. Bodyguard from another. VIP Darshan from a third. None of them spoke
                to each other. Service was inconsistent. Trust was uncertain.
              </p>
              <p>
                WENS Force is what I would have built if I were the customer. One subscription. One
                concierge. One annual fee. Everything pre-arranged. Quality I would put my own name on.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-white font-semibold text-sm">— Founder & CEO, WENS Force</p>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9A24B] text-sm font-medium hover:underline mt-1 inline-block"
              >
                Connect on LinkedIn →
              </a>
            </div>

            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
              </svg>
              Watch the 90-second founder video →
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
