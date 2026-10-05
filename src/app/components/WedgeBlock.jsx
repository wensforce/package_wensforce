import Link from "next/link";

function CardLink({ link }) {
  if (!link?.text || !link?.url) return null;

  const className =
    "text-[#C9A24B] text-sm font-semibold hover:text-[#F5E6BD] transition-colors flex items-center gap-1.5";
  const content = (
    <>
      {link.text}
      <span className="transition-transform group-hover:translate-x-1">→</span>
    </>
  );

  if (/^https?:\/\//.test(link.url)) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link.url} className={className}>
      {content}
    </Link>
  );
}

export default function WedgeBlock({
  eyebrow,
  heading,
  subheading,
  cards = [],
  note,
}) {
  return (
    <section className="py-20 px-6 bg-[#0B1E3F]">
      <div className="max-w-5xl mx-auto">
        {(eyebrow || heading || subheading) && (
          <div className="text-center mb-14">
            {eyebrow && (
              <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-4">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-white/40 text-sm mt-3 max-w-md mx-auto font-light">
                {subheading}
              </p>
            )}
          </div>
        )}

        {cards.length > 0 && (
          <div
            className={`grid grid-cols-1 gap-6 ${
              cards.length >= 3 ? "md:grid-cols-3" : cards.length === 2 ? "md:grid-cols-2" : ""
            }`}
          >
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={`${card.title}-${index}`}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col hover:bg-white/8 hover:border-[#C9A24B]/30 transition-all duration-300"
                >
                  {Icon && (
                    <div className="mb-6">
                      <Icon className="w-11 h-11 text-[#C9A24B]" strokeWidth={1.5} />
                    </div>
                  )}

                  {card.title && (
                    <h3 className="text-white font-bold text-lg leading-snug mb-3">
                      {card.title}
                    </h3>
                  )}

                  {card.description && (
                    <p className="text-white/55 text-sm leading-relaxed font-light flex-1 mb-6">
                      {card.description}
                    </p>
                  )}

                  <CardLink link={card.link} />
                </div>
              );
            })}
          </div>
        )}

        {note?.title && (
          <div className="mt-6 p-6 rounded-2xl border border-[#C9A24B]/20 bg-[#C9A24B]/5 text-center">
            <p className="text-[#C9A24B] font-semibold text-sm">
              {note.title}{" "}
              {note.description && (
                <span className="text-white/60 font-light">{note.description}</span>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
