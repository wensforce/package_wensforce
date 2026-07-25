'use client';

import {
  Zap, Handshake, Target, Sparkles,
} from 'lucide-react';

export default function CustomQuoteSection({ expo}) {

  return (
    <>

      <section id="custom-quote-section" style={{ background: '#0B1F3A' }} className="relative w-full overflow-hidden px-4 py-20 max-sm:py-12">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/3 -right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 -left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="mb-12 flex flex-col items-center text-center gap-4">
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40">
              <Sparkles size={14} className="text-[#E7CE7A]" />
              <span className="text-xs font-bold text-[#E7CE7A] uppercase tracking-widest">Premium Solutions</span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight max-sm:text-2xl leading-tight">
              Need a Custom Quote?
            </h2>
          </div>

        {/* Zoho Form */}
        <div className="relative z-10 max-w-2xl mx-auto rounded-2xl overflow-hidden ">
          <iframe
            src={`https://forms.zohopublic.in/wensforceinternational1/form/ExpoPackage/formperma/bRcFTZDPC_uIEmUNzs1rK0GmhafB3Zs6l1gWJ50meLM?expoName=${encodeURIComponent(expo?.name || "Not Specified")}`}
            width="100%"
            height="667px"
            style={{ border: 'none', display: 'block' }}
            title="Custom Quote Form"
          />
        </div>

        {/* Feature boxes */}
        <div className="relative z-10 mt-16 grid grid-cols-3 gap-6 max-sm:grid-cols-1">
          {[{ icon: Target, title: 'Expert Curation', desc: 'Hand-picked services for your unique needs' },
            { icon: Handshake, title: '24hr Response', desc: 'Quotes within a business day guaranteed' },
            { icon: Zap, title: 'Premium Care', desc: 'White-glove service from our specialist team' }].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-3 p-6 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/20 text-center hover:border-[#C9A227]/40 transition-all duration-300">
              <Icon size={24} className="mx-auto text-[#C9A227]" />
              <h3 className="font-bold text-white text-sm">{title}</h3>
              <p className="text-xs text-[#B8B2A8] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>
    </>
  );
}
