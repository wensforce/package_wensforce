import Link from 'next/link';
import {
  Car, Users, ShieldCheck, Gem, Crown,
  CheckCircle, Phone,
} from 'lucide-react';
import { plans } from './data/plans';
import Header from './components/Header';
import HowItWorks from './components/HowItWorks';
import PlansSection from './components/PlansSection';
import TrustStrip from './components/TrustStrip';
import WedgeBlock from './components/WedgeBlock';
import TierQuiz from './components/TierQuiz';
import PressPartnerWall from './components/PressPartnerWall';
import FounderStoryBlock from './components/FounderStoryBlock';
import ReferralBanner from './components/ReferralBanner';
import ExitIntentPopup from './components/ExitIntentPopup';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');
const WA_NUMBER = '917304607954';

const TIER_ICONS = {
  essential: Car,
  executive: Users,
  premium: ShieldCheck,
  elite: Gem,
  sovereign: Crown,
};

const FOUNDING_SPOTS = {
  essential: 82,
  executive: 71,
  premium: 58,
  elite: 73,
  sovereign: 41,
};

const testimonials = [
  {
    name: 'Rajan Desai',
    role: 'Managing Partner — Desai Capital Group, Mumbai',
    avatar: 'RD',
    plan: 'SOVEREIGN',
    text: 'I\'ve had global concierge services. WENS Force is the first one that actually knows India — the temples, the airports, the security dynamics. The Bhasm Aarti booking at Ujjain was something I thought was impossible to arrange. They had it done in 48 hours.',
  },
  {
    name: 'Dr. Priya Venkataraman',
    role: 'COO — Zenith Pharma, Bangalore',
    avatar: 'PV',
    plan: 'ELITE',
    text: 'As a woman who travels frequently across metros for board meetings, the armed escort changed my confidence entirely. My RM knows my schedule before I tell her. I haven\'t touched a travel app in eight months.',
  },
  {
    name: 'Rajiv Singhania',
    role: 'Business Family — Delhi NCR',
    avatar: 'RS',
    plan: 'SOVEREIGN',
    text: 'We joined as Executive for a year, upgraded to Sovereign within three months. The difference is not just in the service — it\'s in how the family feels. My wife uses her booking line independently. My parents did their Vaishno Devi pilgrimage without me worrying for a second.',
  },
  {
    name: 'Capt. (Retd.) Arun Sharma',
    role: 'Board Director — Infrastructure & Defence Advisory, Hyderabad',
    avatar: 'AS',
    plan: 'PREMIUM',
    text: 'I vetted the security protocol before joining. Ex-NSG trained guards, background-verified, rotated by city. The risk assessment they did for my travel pattern was sharper than what most corporates offer their CEOs. Worth every rupee.',
  },
  {
    name: 'Anjali Bhatnagar',
    role: 'Independent Film Producer, Mumbai',
    avatar: 'AB',
    plan: 'SOVEREIGN',
    text: 'I needed discretion, not drama. WENS Force delivers exactly that — the car is there before I ask, the guard blends in, the concierge never asks twice. When my family visits from Canada, I extend the booking line to them seamlessly.',
  },
  {
    name: 'Rohan Agarwal',
    role: 'Returned NRI — Pune (formerly Singapore)',
    avatar: 'RA',
    plan: 'ELITE',
    text: 'I came back to India after 12 years and was apprehensive about mobility and safety. A friend referred me to WENS Force. Two weeks in, I had done three trips, one pilgrimage, and two lounge visits. I upgraded from Executive to Elite within 60 days.',
  },
];

const faqs = [
  {
    q: "I'm sceptical about prepaying this much. How do I know WENS Force is real?",
    a: "Fair question. WENS Force is a registered company with a physical operations team across 9 cities. Every member gets a dedicated concierge contact on WhatsApp within 2 hours of joining. You can also speak to our team before paying: +91-7304607954.",
  },
  {
    q: 'What exactly happens in the first 24 hours after I join?',
    a: 'Within 2 hours: your concierge calls to introduce themselves and understand your preferences — vehicle type, usual routes, pilgrimage interests. Within 24 hours: your account is fully set up, your security profile is created, and you can book your first trip. Most members book within 72 hours.',
  },
  {
    q: 'My schedule is unpredictable — will a car really be ready in 12 minutes?',
    a: 'Yes. For Elite and Sovereign: 10–15 minute dispatch, 24×7, pre-positioned in your city. For Premium: 20-minute guarantee. For Essential and Executive: 30–45 minutes for scheduled bookings; same-day bookings confirmed within the hour. We maintain standby fleets precisely for unplanned travel.',
  },
  {
    q: 'Can my family use the membership when I travel abroad?',
    a: 'Yes — all plans are Family-Transferable. Any household member (spouse, children, parents at the same address) can use your trips. Sovereign members additionally give their spouse a separate dedicated booking line, usable independently.',
  },
  {
    q: "What if I don't use all my trips in a year?",
    a: 'Unused trips and time-bound vouchers lapse at the end of the 12-month period. However, your concierge will proactively remind you of unused credits each quarter so you never let them expire by accident. We also help you plan ahead so every trip is maximised.',
  },
  {
    q: 'Is the armed bodyguard discreet, or will it look conspicuous?',
    a: 'Discreet is the default. All guards are in plain clothes unless you specifically request uniformed security. They are briefed on your preferences during onboarding. Most members say their guests do not notice the security at all — only the smooth experience.',
  },
  {
    q: "What does 'VIP Darshan' actually mean — will I really skip the queue?",
    a: "Yes. WENS Force holds verified partnerships with temple trusts and official VIP darshan programmes. Your concierge books a specific time slot at the VIP/VVIP counter — not the general queue. For Bhasm Aarti at Mahakaleshwar (Sovereign), this is one of the rarest bookings in India — fewer than 20 VVIP spots exist per day.",
  },
  {
    q: 'Can I upgrade my tier mid-year if my needs change?',
    a: 'Yes. Upgrade any time by paying the pro-rated difference for the remaining months. Your new benefits activate immediately. Remaining trip credits carry over at the new tier value. Call your concierge to arrange — it takes 30 minutes.',
  },
];

const COMPARISON_ROWS = [
  {
    label: 'Privileges Worth',
    values: [
      INR(plans[0].freePerksWorth),
      INR(plans[1].freePerksWorth),
      INR(plans[2].freePerksWorth),
      INR(plans[3].freePerksWorth),
      INR(plans[4].freePerksWorth),
    ],
    highlight: true,
  },
  { label: 'Curated Journeys / Year', values: ['3', '4', '5', '5', '5'] },
  { label: 'Vehicle Class', values: ['Standard Sedan', 'Standard SUV', 'SUV + Armed', 'Luxury Sedan', 'Luxury SUV'] },
  { label: 'Security', values: ['Unarmed', 'Unarmed', '✓ Armed', '✓ Armed', '✓ Armed'] },
  { label: 'VIP Darshan Vouchers', values: ['1', '2', '3', '5', 'Unlimited'] },
  { label: 'Airport Lounge', values: ['1 visit', '2 visits', '3 visits', 'Unlimited', 'Unlimited'] },
  { label: 'Heritage Fast-Track Pass', values: ['—', '1', '2', '3 + Guide', '5 + Guide'] },
  { label: 'Concierge Level', values: ['Helpline', 'Helpline', 'Dedicated RM', 'RM + Concierge', 'Personal Suite'] },
];

function ComparisonTable() {
  const waBase = `https://wa.me/${WA_NUMBER}?text=`;

  return (
    <section id="compare" className="w-full px-4 sm:px-8 py-16 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">Side by Side</p>
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-3">
          Compare All Five Tiers
        </h2>
        <p className="text-gray-500 text-base font-light max-w-md mx-auto">
          Every feature at a glance — so you choose with complete clarity.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-5 text-xs text-gray-400 w-44 font-normal" />
              {plans.map((plan) => {
                const TierIcon = TIER_ICONS[plan.id] || Car;
                const isElite = plan.id === 'elite';
                return (
                  <th
                    key={plan.id}
                    className={['px-3 py-5 text-center', isElite ? 'bg-[#C9A24B]/6 border-x border-[#C9A24B]/15' : ''].join(' ')}
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={['w-8 h-8 rounded-xl flex items-center justify-center border', isElite ? 'bg-[#C9A24B]/15 border-[#C9A24B]/25' : 'bg-gray-50 border-gray-100'].join(' ')}>
                        <TierIcon size={14} strokeWidth={1.75} className={isElite ? 'text-[#C9A24B]' : 'text-gray-500'} />
                      </div>
                      <div className={['text-xs font-bold tracking-wide', isElite ? 'text-[#C9A24B]' : 'text-gray-600'].join(' ')}>
                        {plan.name}
                      </div>
                      <div className={['text-[10px]', isElite ? 'text-[#C9A24B]/60' : 'text-gray-400'].join(' ')}>
                        {INR(plan.price)}/yr
                      </div>
                      {isElite && (
                        <div className="text-[9px] bg-[#C9A24B] text-black font-bold px-2.5 py-0.5 rounded-full tracking-wide">
                          BEST VALUE
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={row.label} className={['border-b border-gray-50', i % 2 !== 0 ? 'bg-gray-50/40' : ''].join(' ')}>
                <td className={['px-6 py-3.5 text-xs', row.highlight ? 'font-bold text-gray-700' : 'text-gray-500'].join(' ')}>
                  {row.label}
                </td>
                {row.values.map((val, j) => {
                  const isElite = plans[j].id === 'elite';
                  return (
                    <td key={j} className={['px-3 py-3.5 text-center', isElite ? 'bg-[#C9A24B]/6 border-x border-[#C9A24B]/15' : ''].join(' ')}>
                      {val === '✓ Armed' ? (
                        <span className="flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600">
                          <CheckCircle size={12} strokeWidth={2} />
                          Armed
                        </span>
                      ) : val === '—' ? (
                        <span className="text-gray-200 text-sm">—</span>
                      ) : (
                        <span className={['text-xs', row.highlight ? 'font-bold' : 'font-medium', isElite ? 'text-[#C9A24B]' : 'text-gray-700'].join(' ')}>
                          {val}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-100 bg-gray-50/50">
              <td className="px-6 py-4" />
              {plans.map((plan) => {
                const isElite = plan.id === 'elite';
                const msg = encodeURIComponent(`Hi WENS Force, I'd like to join the ${plan.name} membership (${INR(plan.price)}/yr). Please help me get started.`);
                return (
                  <td key={plan.id} className={['px-3 py-4 text-center', isElite ? 'bg-[#C9A24B]/6 border-x border-[#C9A24B]/15' : ''].join(' ')}>
                    <a
                      href={`${waBase}${msg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[10px] font-bold px-3 py-2 rounded-xl transition-all hover:opacity-90"
                      style={{
                        backgroundColor: isElite ? '#C9A24B' : '#0B1E3F',
                        color: isElite ? '#000' : '#fff',
                      }}
                    >
                      Get Started
                    </a>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">Your Questions</p>
        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-3">
          Honest Answers
        </h2>
        <p className="text-gray-500 text-base font-light max-w-md mx-auto">
          The questions serious buyers ask — answered plainly.
        </p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 overflow-hidden"
          >
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-800 hover:text-[#0B1E3F] transition-colors list-none gap-4">
              <span className="text-[15px] text-left">{faq.q}</span>
              <span className="text-gray-400 text-xl shrink-0 group-open:rotate-45 transition-transform duration-300 inline-block leading-none font-light">+</span>
            </summary>
            <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 font-light bg-gray-50/30">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 p-7 bg-[#FAF6EC] border border-[#C9A24B]/20 rounded-2xl text-center">
        <p className="text-[#0B1E3F] font-semibold mb-1">Still have a question?</p>
        <p className="text-gray-500 text-sm font-light mb-4">Our concierge is available 24×7.</p>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi, I have a question about WENS Force membership.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-sm transition-all hover:opacity-90"
          style={{ color: '#25D366' }}
        >
          <svg viewBox="0 0 32 32" width="16" height="16" fill="#25D366">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
          </svg>
          Ask on WhatsApp
        </a>
      </div>
    </section>
  );
}

export default function HomePage() {
  const heroWaMsg = encodeURIComponent("Hi WENS Force, I'm exploring your subscription. Can you help me find the right tier?");
  const heroWaUrl = `https://wa.me/${WA_NUMBER}?text=${heroWaMsg}`;

  return (
    <div className="min-h-screen relative">
      <Header />

      {/* Founding 100 announcement bar */}
      <div style={{ backgroundColor: '#0B1E3F' }} className="text-white py-2.5 px-6 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-xs flex-wrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] inline-block" />
          <span className="text-white/70">Founding 100 Programme</span>
          <span className="text-[#C9A24B] font-semibold">·</span>
          <span className="text-white/90 font-medium">41 of 100 Sovereign spots confirmed</span>
          <span className="text-white/40 hidden sm:inline">—</span>
          <span className="text-white/55 hidden sm:inline">Charter members locked at current pricing permanently</span>
        </div>
      </div>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden pt-16 pb-24 px-6"
        style={{ backgroundColor: '#0B1E3F' }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A24B 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
        {/* Cream fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#C9A24B] text-[10px] tracking-[0.45em] uppercase font-semibold mb-5">
            Est. 2024 &nbsp;·&nbsp; India&apos;s Premium Subscription
          </p>

          <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] mb-6 tracking-tight">
            India&apos;s Only Subscription for<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #C9A24B, #f0c940, #C9A24B)' }}>
              Luxury Travel + Armed Protection
            </span>
          </h1>

          <p className="text-white/55 text-lg font-light mb-10 max-w-xl mx-auto">
            Five tiers. One annual fee. Everything pre-arranged for the year.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href={heroWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 py-4 px-9 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg viewBox="0 0 32 32" width="17" height="17" fill="white">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
              </svg>
              Talk to Our Concierge
            </a>
            <a
              href="#plans"
              className="flex items-center gap-2 border-2 border-white/20 text-white font-semibold py-4 px-9 rounded-full text-sm hover:border-[#C9A24B]/60 hover:text-[#C9A24B] transition-all"
            >
              View Plans
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-5 text-white/40 text-xs flex-wrap">
            <span>✓ Instant Activation</span>
            <span className="text-white/20">·</span>
            <span>✓ No Hidden Fees</span>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <TrustStrip />

      {/* ── WEDGE BLOCK ── */}
      <WedgeBlock />

      {/* ── PLANS SPOTLIGHT ── */}
      <section style={{ backgroundColor: '#FAF6EC' }}>
        <PlansSection />
      </section>

      {/* ── TIER QUIZ ── */}
      <TierQuiz />

      {/* ── ALL PLANS GRID ── */}
      {/* <AllPlansGrid plans={plans} /> */}

      {/* ── COMPARISON TABLE ── */}
      <section style={{ backgroundColor: '#FAF6EC' }}>
        <ComparisonTable />
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── TESTIMONIALS ── */}
      <section style={{ backgroundColor: '#0B1E3F' }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
              Member Stories
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mb-3">
              How Our Members Travel
            </h2>
            <p className="text-white/40 text-base font-light">
              HNI members across India — in their own words.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="group relative border rounded-2xl p-6 flex flex-col hover:border-white/15 transition-all duration-300"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} viewBox="0 0 16 16" className="w-3 h-3 fill-[#C9A24B]">
                      <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.7 4.12L8 10.4l-3.7 2.14.7-4.12L2 5.5l4.15-.75L8 1z"/>
                    </svg>
                  ))}
                </div>

                <p className="text-white/65 text-sm leading-relaxed flex-1 font-light mb-5 italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-black text-xs font-bold shrink-0"
                      style={{ background: 'linear-gradient(135deg, #C9A24B, #a88000)' }}
                    >
                      {t.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white text-sm font-semibold">{t.name}</div>
                      <div className="text-white/35 text-xs leading-snug">{t.role}</div>
                    </div>
                    <span
                      className="text-[9px] font-bold px-2 py-1 rounded-full shrink-0 border"
                      style={{ backgroundColor: 'rgba(201,162,75,0.12)', color: '#C9A24B', borderColor: 'rgba(201,162,75,0.2)' }}
                    >
                      {t.plan}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESS & PARTNERS ── */}
      <PressPartnerWall />

      {/* ── FOUNDER STORY ── */}
      {/* <FounderStoryBlock /> */}

      {/* ── REFERRAL BANNER ── */}
      {/* <ReferralBanner /> */}

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── FINAL CTA — FOUNDING 100 FRAME ── */}
      <section style={{ backgroundColor: '#0B1E3F' }} className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Crown size={18} strokeWidth={1.5} className="text-[#C9A24B]" />
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold">
              Founding 100 Programme
            </p>
            <Crown size={18} strokeWidth={1.5} className="text-[#C9A24B]" />
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-snug">
            The First 100 Sovereign Members<br />
            <span className="text-[#C9A24B]">Become Permanent Charter Members.</span>
          </h2>

          <p className="text-white/50 text-base font-light mb-8 leading-relaxed">
            Charter members lock current pricing for life — no annual increase, ever.<br />
            <strong className="text-white/70 font-medium">41 of 100 spots confirmed.</strong> The remaining 59 are open now.
          </p>

          {/* Founding spots mini-grid */}
          <div className="grid grid-cols-5 gap-3 mb-10 max-w-sm mx-auto">
            {['essential', 'executive', 'premium', 'elite', 'sovereign'].map((id) => (
              <div key={id} className="text-center">
                <div className="text-base font-bold text-[#C9A24B]">{FOUNDING_SPOTS[id]}</div>
                <div className="text-[9px] text-white/30 uppercase tracking-wide font-light leading-tight">{id}</div>
                <div className="text-[8px] text-white/20">of 100</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/membership/elite"
              className="flex items-center gap-2 font-bold py-4 px-9 rounded-full text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#C9A24B', color: '#000' }}
            >
              <Gem size={15} strokeWidth={2} />
              Claim Elite Membership
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi WENS Force, I want to learn about the Founding 100 Sovereign membership.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-white/70 font-medium py-4 px-8 rounded-full text-sm hover:border-white/40 hover:text-white transition-all"
            >
              Enquire About Sovereign →
            </a>
          </div>

          <p className="text-white/25 text-xs mt-6">
            wensforce.com &nbsp;·&nbsp; +91-73046 07954
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: '#060606' }} className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src="/logo.png" alt="WENS Force Logo" className="w-5 h-5" />
            <span className="text-[#C9A24B] font-bold text-sm tracking-[0.3em] uppercase">WENS Force</span>
          </div>
          <p className="text-gray-600 text-xs max-w-xs mx-auto mb-6 font-light">
            Where Every Journey Becomes an Arrival.
          </p>
          <div className="flex justify-center gap-6 text-xs text-gray-700 flex-wrap mb-6">
            {[{name:'Privacy Policy', href:'https://wensforce.com/privacy-policy/'}, {name:'Terms & Conditions', href:'https://wensforce.com/disclaimer-terms-of-services/'}, {name:'Refund Policy', href:'https://wensforce.com/cancellation-refund-policy/'}, {name:'Contact Us', href:'https://wensforce.com/contact-us/'}].map((item) => (
              <a key={item.name} target='_blank' href={item.href} className="hover:text-gray-500 transition-colors">
                {item.name}
              </a>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-700 mb-4">
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
            >
              <svg viewBox="0 0 32 32" width="13" height="13" fill="currentColor">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
              </svg>
              +91-73046 07954
            </a>
            <span className="text-gray-800">·</span>
            <a href="mailto:wensforce@gmail.com" className="hover:text-gray-500 transition-colors flex items-center gap-1">
              <Phone size={11} />
              wensforce@gmail.com
            </a>
          </div>
          <p className="text-gray-800 text-xs">© 2026 WENS Force Pvt. Ltd. All rights reserved.</p>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0B1E3F]/97 backdrop-blur border-t border-white/8 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[9px] text-white/40 uppercase tracking-widest">Elite Membership</div>
            <div className="text-[#C9A24B] font-semibold text-sm">₹99,999 / yr &nbsp;·&nbsp; 73 of 100 confirmed</div>
          </div>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi WENS Force, I want to claim Elite membership. Please guide me.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold py-2.5 px-4 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all hover:opacity-90"
            style={{ backgroundColor: '#25D366', color: 'white' }}
          >
            <svg viewBox="0 0 32 32" width="12" height="12" fill="white">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
            </svg>
            Enquire Now
          </a>
        </div>
      </div>
      <div className="h-16 md:hidden" />

      {/* Exit intent popup */}
      <ExitIntentPopup />
    </div>
  );
}
