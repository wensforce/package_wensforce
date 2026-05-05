import Link from 'next/link';

const BLOCKS = [
  {
    title: 'In the Press',
    body: 'Featured in Forbes India, ET, Business Standard, Mint Lounge, CNBC TV18.',
    cta: 'Read coverage →',
    href: '#',
  },
  {
    title: 'Bank & Hospitality Partners',
    body: 'Co-branded benefits with HDFC Infinia, ICICI Emeralde, Taj Hotels, Oberoi, ITC.',
    cta: 'View partners →',
    href: '#',
  },
  {
    title: 'Religious Trust Partnerships',
    body: 'Authorised facilitator: Tirupati Devasthanam, Vaishno Devi Shrine Board, Mahakaleshwar.',
    cta: 'Plan a pilgrimage →',
    href: '#',
  },
];

export default function PressPartnerWall() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
            Our Network
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F]">
            Trusted by India&apos;s Best
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOCKS.map((block, i) => (
            <div
              key={i}
              className="group bg-[#FAF6EC] border border-[#C9A24B]/15 rounded-2xl p-8 flex flex-col hover:border-[#C9A24B]/40 hover:shadow-md transition-all duration-300"
            >
              <h3 className="text-[#0B1E3F] font-bold text-lg mb-3 leading-snug">
                {block.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light flex-1 mb-6">
                {block.body}
              </p>
              <Link
                href={block.href}
                className="text-[#C9A24B] text-sm font-semibold hover:text-[#0B1E3F] transition-colors flex items-center gap-1.5"
              >
                {block.cta}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
