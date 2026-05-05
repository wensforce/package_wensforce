export default function TrustStrip() {
  const press = [
    'Forbes India', 'The Economic Times', 'Business Standard', 'Mint Lounge', 'CNBC TV18',
  ];

  const partners = [
    'HDFC Infinia', 'ICICI Emeralde', 'Taj Hotels', 'Oberoi', 'Tirupati Devasthanam', 'ITC Hotels',
  ];

  return (
    <section className="py-10 px-6 border-y border-gray-200" style={{ backgroundColor: '#FAF6EC' }}>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* AS FEATURED IN */}
        <div>
          <p className="text-center text-[10px] tracking-[0.35em] text-gray-400 uppercase font-medium mb-5">
            As Featured In
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {press.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors duration-300 cursor-default tracking-wide"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* OFFICIAL PARTNERS */}
        <div>
          <p className="text-center text-[10px] tracking-[0.35em] text-gray-400 uppercase font-medium mb-5">
            Official Partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {partners.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-gray-400 hover:text-[#C9A24B] transition-colors duration-300 cursor-default tracking-wide"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
