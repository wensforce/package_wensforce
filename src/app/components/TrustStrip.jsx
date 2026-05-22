
export default function TrustStrip() {
  const press = [
    { name: 'Mid Day', url: 'https://www.mid-day.com/buzzfeed/article/a-new-security-discipline-for-a-new-india-why-a-digital-framework-is-now-essential-for-public-trust-8060' },
    { name: 'Mumbai Times', url: 'https://mumbaitimes.org/wens-force-international-a-new-security-discipline-for-a-new-india/' },
    { name: 'Deccan Bharat', url: 'https://deccanbharat.com/wens-force-international-a-new-security-discipline-for-a-new-india/' },
    { name: 'Daily Hunt', url: 'http://m.dailyhunt.in/news/india/english/tycoon+world-epaper-dh4c6a646b987d48f5b87f17d40865f089/wens+force+international+a+new+security+discipline+for+a+new+india-newsid-dh4c6a646b987d48f5b87f17d40865f089_36213950d44e11f08bbf1a761810ba2e?sm=Y' },
    { name: 'Herald Post', url: 'https://heraldpost.in/wens-force-international-a-new-security-discipline-for-a-new-india/' },
  ];

  const partners = [
    'Visa Concierge', 'ICICI Emeralde', 'Taj Hotels', 'Marriott', 'Holy Places', 'ITC Hotels',
  ];

  return (
    <section className="py-10 px-6 border-y border-gray-200" style={{ backgroundColor: '#FAF6EC' }}>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* AS FEATURED IN */}
        <div>
          <p className="text-center text-[12px] tracking-[0.35em] text-black uppercase font-medium mb-5">
            We Are In NEWS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
            {press.map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors duration-300 cursor-pointer tracking-wide"
              >
                {name}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* OFFICIAL PARTNERS */}
        <div>
          <p className="text-center  text-[12px] tracking-[0.35em] text-black uppercase font-medium mb-5">
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
