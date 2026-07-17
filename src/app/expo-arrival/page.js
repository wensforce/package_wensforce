'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plane, Car, Shield, MapPin, MessageCircle, Receipt, Check, Play, X, Phone, Mail, ChevronRight } from 'lucide-react';
import { plans as welcomePlans } from '../data/welcomeIndia';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');
const WA_PHONE = '917304607954'; // TODO: Replace with Zoho-fetched PSARA-compliant number

const PRIV_ICONS = {
  '✈️': Plane,
  '🚗': Car,
  '🛡️': Shield,
  '📍': MapPin,
  '📞': MessageCircle,
  '📋': Receipt,
};

// Cyclical card treatments for the "Explore other tiers" grid — same gradient-card
// pattern used on /membership/[id], applied by position so it works for any plan list.
const TIER_GRADIENTS = [
  'from-slate-700 via-slate-600 to-slate-800',
  'from-blue-900 via-indigo-800 to-blue-950',
  'from-gray-800 via-gray-700 to-gray-900',
  'from-[#2a1c00] via-[#6b4800] to-[#1a1000]',
  'from-[#0B1F3A] via-[#122B4E] to-[#081627]',
];

// Real guest arrival footage — same asset set used across the site's testimonials
const GALLERY_ITEMS = [
  { image: '/testimonials/kartik_giri.png', video: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/kartik_giri.mp4' },
  { image: '/testimonials/mark_robber.png', video: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Mark_Robber.mp4' },
  { image: '/testimonials/weronica_rodowicz.png', video: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Weronica.mp4' },
  { image: '/testimonials/pink_sweat.png', video: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Pink_Sweat.mp4' },
  { image: '/testimonials/mo_vlog.png', video: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/Movlog_car.mp4' },
  { image: '/testimonials/turkey_princess.png', video: 'https://d2zcmp43lwd2kr.cloudfront.net/videos/your_highness.mp4' },
];

// Money Expo 2026 context
const EXPO_EVENT = {
  name: 'Money Expo India 2026',
  dates: '29–30 Aug 2026',
  venue: 'Jio World Convention Centre, BKC',
  serviceWindow: '27–31 Aug 2026',
};

export default function ExpoArrivalPage() {
  // Hardcode to expo-executive-arrival package
  const plan = welcomePlans.find((p) => p.id === 'expo-executive-arrival');
  const otherPlans = welcomePlans.filter((p) => p.id !== plan?.id);
  const [activeTab, setActiveTab] = useState('overview');
  const [formStatus, setFormStatus] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightboxIndex(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex]);

  if (!plan) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Package not found</div>;
  }

  const handleWhatsAppClick = () => {
    // TODO: Fire whatsapp_click conversion event to Google Ads
    const text = `Hi WENS — Enquiry for ${plan.name} (${EXPO_EVENT.name}, ${EXPO_EVENT.serviceWindow})`;
    const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      package: plan.name,
      eventDates: EXPO_EVENT.serviceWindow,
      // TODO: Add hidden GCLID + UTM fields once tracking is configured
    };

    try {
      // TODO: Replace with Zoho CRM endpoint once credentials are configured
      console.log('Form submission (TODO: wire to Zoho):', data);
      setFormStatus('success');
      e.target.reset();
      setTimeout(() => setFormStatus(null), 3000);
    } catch (error) {
      console.error('Form error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 3000);
    }
  };


  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', system-ui, sans-serif; color: #191D24; background: #F7F6F2; line-height: 1.6; font-size: 16px; }

        :root {
          --navy: #0B1F3A; --navy2: #122B4E; --gold: #C9A227; --gold2: #E7CE7A;
          --paper: #F7F6F2; --ink: #191D24; --muted: #5C6270; --line: #E4E1D8;
          --wa: #1FA855; --amber: #B45309; --amberbg: #FFF7E8; --radius: 14px;
        }

        .eyebrow { font-size: 11px; letter-spacing: .22em; text-transform: uppercase; font-weight: 600; color: var(--gold); }
        h1, h2, h3 { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; line-height: 1.12; letter-spacing: .01em; }
        h2 { font-size: clamp(26px, 3.4vw, 38px); color: var(--navy); }
        .wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
        .sec { padding: 84px 0; }
        .sec-head { max-width: 640px; margin-bottom: 44px; }
        .sec-head p { color: var(--muted); margin-top: 12px; }

        /* Route line motif */
        .route { display: flex; align-items: center; gap: 10px; margin-top: 16px; }
        .route .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); }
        .route .line { flex: 1; max-width: 180px; border-top: 1.5px dashed var(--gold); opacity: .75; }
        .route .plane { font-size: 13px; color: var(--gold); }
        .route .tag { font-size: 11px; letter-spacing: .14em; font-weight: 600; color: var(--muted); }

        /* Nav */
        nav { position: sticky; top: 0; z-index: 50; background: rgba(11, 31, 58, .94); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(201, 162, 39, .25); }
        .nav-in { display: flex; align-items: center; justify-content: space-between; height: 62px; }
        .brand { font-family: 'Playfair Display', Georgia, serif; color: #fff; font-size: 19px; letter-spacing: .06em; text-decoration: none; }
        .brand b { color: var(--gold); font-weight: 700; }
        .nav-cta { display: flex; gap: 10px; }
        .btn { display: inline-block; font-weight: 600; font-size: 14px; text-decoration: none; border-radius: 10px; padding: 11px 20px; transition: all .15s ease; text-align: center; border: none; cursor: pointer; }
        .btn:hover { transform: translateY(-1px); }
        .btn-gold { background: linear-gradient(135deg, var(--gold), #B08A1E); color: #14181F; box-shadow: 0 4px 14px rgba(201, 162, 39, .35); }
        .btn-ghost { border: 1px solid rgba(255, 255, 255, .35); color: #fff; background: none; }
        .btn-wa { background: var(--wa); color: #fff; }
        .btn-lg { padding: 14px 26px; font-size: 15px; }

        /* Hero */
        header.hero { background: radial-gradient(1200px 600px at 78% -10%, #1D3B66 0%, var(--navy) 55%, #081627 100%); color: #fff; padding: 76px 0 90px; position: relative; overflow: hidden; }
        header.hero::after { content: ""; position: absolute; inset: auto 0 0 0; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); opacity: .6; }
        .hero-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 56px; align-items: center; }
        .hero h1 { font-size: clamp(38px, 5.2vw, 62px); color: #fff; }
        .hero h1 em { font-style: italic; color: var(--gold2); }
        .hero .sub { margin-top: 18px; color: #C7D0DE; font-size: 17px; max-width: 520px; }
        .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px; }
        .chip { font-size: 12.5px; font-weight: 600; letter-spacing: .04em; border: 1px solid rgba(231, 206, 122, .5); color: var(--gold2); border-radius: 999px; padding: 7px 14px; }
        .hero-actions { display: flex; gap: 12px; margin-top: 30px; flex-wrap: wrap; }

        /* Boarding pass card */
        .pass { background: linear-gradient(160deg, #101C2E, #0C1626); border: 1px solid rgba(201, 162, 39, .4); border-radius: 18px; box-shadow: 0 24px 60px rgba(0, 0, 0, .45); overflow: hidden; }
        .pass-top { padding: 26px 28px 20px; }
        .pass .k { font-size: 11px; letter-spacing: .2em; color: #8FA0B8; font-weight: 600; }
        .pass .plan { font-family: 'Playfair Display', Georgia, serif; font-size: 23px; color: #fff; margin-top: 6px; }
        .pass .price { margin-top: 14px; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
        .pass .inr { font-size: 40px; font-weight: 700; color: var(--gold2); font-family: 'Playfair Display', Georgia, serif; }
        .pass .usd { font-size: 14px; color: #9FB0C6; }
        .pass .allinc { font-size: 12px; color: #7E90A8; margin-top: 2px; }
        .pass-route { display: flex; align-items: center; gap: 12px; padding: 16px 28px; border-top: 1px dashed rgba(201, 162, 39, .45); border-bottom: 1px dashed rgba(201, 162, 39, .45); }
        .pr-code { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; color: #fff; letter-spacing: .06em; }
        .pr-line { flex: 1; border-top: 1.5px dashed var(--gold); opacity: .85; text-align: center; }
        .pr-line span { color: var(--gold); font-size: 14px; }
        .pr-sub { font-size: 10.5px; color: #7E90A8; letter-spacing: .1em; margin-top: 3px; }
        .pass-bottom { padding: 20px 28px 26px; }
        .pass-bottom .meta { display: flex; justify-content: space-between; font-size: 12.5px; color: #9FB0C6; margin-bottom: 16px; flex-wrap: wrap; gap: 6px; }
        .pass-bottom .btn { width: 100%; margin-top: 10px; }
        .finestar { font-size: 11px; color: #7E90A8; margin-top: 12px; }

        /* Stats */
        .stats { background: var(--navy2); color: #fff; padding: 26px 0; }
        .stats-in { display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
        .stat { flex: 1; min-width: 220px; text-align: center; }
        .stat b { display: block; font-family: 'Playfair Display', Georgia, serif; font-size: 19px; color: var(--gold2); }
        .stat span { font-size: 12.5px; color: #B6C2D4; letter-spacing: .05em; }

        /* Cards grid */
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 26px; transition: box-shadow .2s ease, transform .2s ease; }
        .card:hover { box-shadow: 0 14px 34px rgba(11, 31, 58, .10); transform: translateY(-2px); }
        .card .ic { width: 44px; height: 44px; border-radius: 10px; background: #F3E7C3; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .card .ic svg { width: 21px; height: 21px; color: #9C7A17; }
        .card h3 { font-size: 16.5px; font-weight: 700; color: var(--navy); }
        .card p { font-size: 14px; color: var(--muted); margin-top: 8px; }

        /* Tier grid (Explore other tiers) */
        .tier-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .tier-card { position: relative; display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; padding: 20px; min-height: 150px; text-decoration: none; box-shadow: 0 4px 16px rgba(0, 0, 0, .12); transition: transform .2s ease, box-shadow .2s ease; }
        .tier-card:hover { transform: translateY(-3px); box-shadow: 0 10px 26px rgba(0, 0, 0, .18); }
        .tier-card .t-name { font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #fff; margin-bottom: 12px; }
        .tier-card .t-price { font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 700; line-height: 1; color: #fff; margin-bottom: 3px; }
        .tier-card .t-note { font-size: 10px; font-weight: 400; color: rgba(255, 255, 255, .6); margin-bottom: 16px; }
        .tier-card .t-cta { display: inline-flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 700; letter-spacing: .02em; padding: 6px 11px; border-radius: 999px; background: rgba(255, 255, 255, .12); border: 1px solid rgba(255, 255, 255, .22); color: rgba(255, 255, 255, .88); margin-top: auto; width: fit-content; }
        .tier-card .t-cta svg { transition: transform .2s ease; }
        .tier-card:hover .t-cta svg { transform: translateX(2px); }
        @media(min-width: 640px) { .tier-grid { grid-template-columns: repeat(4, 1fr); } }

        /* Split panel + form */
        .split { display: grid; grid-template-columns: .9fr 1.1fr; gap: 30px; align-items: start; }
        .panel { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 30px; }
        .panel.dark { background: linear-gradient(165deg, var(--navy), #0A1930); color: #fff; border: 1px solid rgba(201, 162, 39, .35); }
        .kv { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed rgba(201, 162, 39, .35); font-size: 14px; }
        .kv:last-of-type { border-bottom: none; }
        .kv .k { color: #9FB0C6; }
        .kv .v { font-weight: 600; color: #fff; text-align: right; }

        label { display: block; font-size: 13px; font-weight: 600; margin: 16px 0 6px; color: var(--navy); }
        input, select { width: 100%; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; font-family: inherit; font-size: 15px; background: #FCFBF8; }
        input:focus, select:focus { border-color: var(--gold); outline: none; box-shadow: 0 0 0 3px rgba(201, 162, 39, .18); }
        .form-note { font-size: 12px; color: var(--muted); margin-top: 12px; }
        .form-note a { color: var(--gold); font-weight: 700; text-decoration: none; }

        /* Proof section */
        .proof-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: 26px; align-items: stretch; }
        .video-slot { min-height: 340px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 28px; }
        .t-cards { display: grid; gap: 16px; }
        .t-card { padding: 22px; }
        .t-card .q { font-family: 'Playfair Display', Georgia, serif; font-size: 16.5px; font-style: italic; color: #7A5A17; }
        .t-card .a { font-size: 12.5px; color: var(--amber); font-weight: 600; margin-top: 10px; }

        /* Gallery */
        .gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 160px; gap: 16px; }
        .g-tile { position: relative; border-radius: var(--radius); overflow: hidden; cursor: pointer; background: #0B1F3A; border: 1px solid rgba(201, 162, 39, .18); }
        .g-tile.big { grid-column: span 2; grid-row: span 2; }
        .g-tile > img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s ease, filter .25s ease; }
        .g-tile:hover > img { transform: scale(1.07); filter: brightness(.7); }
        .g-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 50px; height: 50px; border-radius: 50%; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; transition: transform .2s ease, background .2s ease, border-color .2s ease; z-index: 2; }
        .g-tile:hover .g-play { transform: translate(-50%, -50%) scale(1.1); background: var(--gold); border-color: var(--gold); }
        .g-play svg { color: #fff; transition: color .2s ease; }
        .g-tile:hover .g-play svg { color: #14181F; }
        .g-tile.big .g-play { width: 62px; height: 62px; }

        .lightbox-backdrop { position: fixed; inset: 0; background: rgba(6,12,24,.92); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .lightbox-box { position: relative; max-width: 480px; width: 100%; background: #0A1424; border-radius: 18px; border: 1px solid rgba(201, 162, 39, .35); overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,.6); }
        .lightbox-box video { width: 100%; max-height: 72vh; display: block; background: #000; }
        .lightbox-close { position: absolute; top: 12px; right: 12px; width: 38px; height: 38px; border-radius: 50%; background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.25); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; }
        .lightbox-close:hover { background: var(--gold); border-color: var(--gold); color: #14181F; }

        /* Placeholder */
        .ph { border: 1.5px dashed var(--amber); background: var(--amberbg); border-radius: var(--radius); }
        .ph-ribbon { display: inline-block; background: var(--amber); color: #fff; font-size: 10.5px; font-weight: 700; letter-spacing: .12em; padding: 4px 10px; border-radius: 6px; margin-bottom: 10px; }

        /* FAQ */
        details { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 0 22px; margin-bottom: 12px; }
        summary { cursor: pointer; font-weight: 600; font-size: 15.5px; color: var(--navy); padding: 18px 0; list-style: none; display: flex; justify-content: space-between; align-items: center; }
        summary::after { content: "+"; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: var(--gold); transition: transform .2s; }
        details[open] summary::after { transform: rotate(45deg); }
        details p { padding: 0 0 18px; color: var(--muted); font-size: 14.5px; }

        /* Closing */
        .closing { background: linear-gradient(180deg, var(--navy), #081627); color: #fff; text-align: center; padding: 90px 0; }
        .closing h2 { color: #fff; }
        .closing h2 em { color: var(--gold2); font-style: italic; }
        .closing p { color: #B6C2D4; max-width: 560px; margin: 16px auto 0; }
        .closing .hero-actions { justify-content: center; }

        /* Footer */
        footer { background: #071120; color: #8FA0B8; padding: 56px 0 90px; font-size: 13px; }
        .f-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 36px; }
        .f-grid h4 { color: #fff; font-size: 13px; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 14px; }
        .f-grid li { list-style: none; margin-bottom: 11px; }
        .f-grid a { text-decoration: none; color: #8FA0B8; transition: color .15s ease; }
        .f-grid a:hover { color: var(--gold2); }
        .f-contact li a { display: flex; align-items: center; gap: 9px; }
        .f-contact svg { color: var(--gold); flex-shrink: 0; }
        .f-addr { display: flex; gap: 9px; align-items: flex-start; color: #8FA0B8; }
        .f-addr svg { color: var(--gold); flex-shrink: 0; margin-top: 2px; }
        .legal { border-top: 1px solid rgba(255, 255, 255, .08); margin-top: 40px; padding-top: 20px; font-size: 12px; color: #5F7189; }

        /* Responsive */
        @media(max-width: 960px) {
          .hero-grid, .split, .proof-grid { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr 1fr; }
          .f-grid { grid-template-columns: 1fr; }
          .sec { padding: 60px 0; }
          .gallery-grid { grid-template-columns: repeat(3, 1fr); grid-auto-rows: 140px; }
        }
        @media(max-width: 600px) {
          .grid-3 { grid-template-columns: 1fr; }
          .nav-cta .btn-ghost { display: none; }
          .pass .inr { font-size: 34px; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 150px; }
          .g-tile.big { grid-column: span 2; grid-row: span 1; }
        }
      `}</style>

      {/* Sticky Nav */}
      <nav>
        <div className="wrap nav-in">
          <Link href="/" className="brand">WENS <b>FORCE</b></Link>
          <div className="nav-cta">
            <button className="btn btn-ghost" onClick={() => document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' })}>Enquire</button>
            <Link href="/booking/expo-executive-arrival" className="btn btn-gold">Book now</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">WENS Force · Expo Series · Mumbai</span>
            <h1>Your Mumbai arrival. <em>Handled.</em></h1>
            <p className="sub">Flight-tracked pickup, executive chauffeur and discreet close protection — airport to BKC, door to door, for the Money Expo India 2026 window (27–31 Aug).</p>
            <div className="chips">
              <span className="chip">1 curated journey</span>
              <span className="chip">Executive SUV</span>
              <span className="chip">1 CPO + 1 chauffeur</span>
              <span className="chip">24×7 concierge line</span>
            </div>
            <div className="hero-actions">
              <button className="btn btn-gold btn-lg" onClick={() => document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' })}>Reserve my arrival</button>
              <button className="btn btn-wa btn-lg" onClick={handleWhatsAppClick}>WhatsApp concierge</button>
            </div>
          </div>

          {/* Boarding Pass Card */}
          <aside className="pass" aria-label="Expo Executive Arrival plan summary">
            <div className="pass-top">
              <div className="k">FOUNDER-GRADE ARRIVAL · SINGLE TRIP</div>
              <div className="plan">{plan.name}</div>
              <div className="price">
                <span className="inr">{INR(plan.price)}</span>
                <span className="usd">≈ US${Math.round(plan.price / 95.3)}</span>
              </div>
              <div className="allinc">All-inclusive · per journey</div>
            </div>
            <div className="pass-route" aria-hidden="true">
              <div>
                <div className="pr-code">BOM</div>
                <div className="pr-sub">CSMIA · T2 ARRIVALS</div>
              </div>
              <div className="pr-line"><span>✈</span></div>
              <div style={{ textAlign: 'right' }}>
                <div className="pr-code">BKC</div>
                <div className="pr-sub">JIO WORLD CENTRE</div>
              </div>
            </div>
            <div className="pass-bottom">
              <div className="meta">
                <span>Validity: {EXPO_EVENT.serviceWindow}</span>
                <span>Flight-tracked</span>
              </div>
              <Link className="btn btn-gold" href="/booking/expo-executive-arrival" style={{ width: '100%', marginTop: '10px' }}>Book now — {INR(plan.price)}</Link>
              <button className="btn btn-wa" onClick={handleWhatsAppClick} style={{ width: '100%', marginTop: '10px' }}>WhatsApp enquiry</button>
              <p className="finestar">*All-inclusive of vehicle, chauffeur, one Close Protection Officer and taxes. Urgent bookings under 48h: +Rs 2,999 + taxes. See inclusions and terms below.</p>
            </div>
          </aside>
        </div>
      </header>

      {/* Stats Strip */}
      <div className="stats">
        <div className="wrap stats-in">
          <div className="stat"><b>Served at Money Expo 2025</b><span>VIP delegations, end to end</span></div>
          <div className="stat"><b>PSARA-licensed</b><span>Compliant protective operations</span></div>
          <div className="stat"><b>24×7 concierge line</b><span>One thread, whole expo window</span></div>
        </div>
      </div>

      {/* Inclusions Section */}
      <section className="sec" id="privileges">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Full breakdown</span>
            <h2>All included privileges</h2>
            <div className="route" aria-hidden="true">
              <span className="dot"></span><span className="line"></span><span className="plane">✈</span><span className="line"></span><span className="tag">DOOR TO DOOR</span>
            </div>
          </div>
          <div className="grid-3">
            {plan.privileges?.map((priv, idx) => {
              const Icon = PRIV_ICONS[priv.icon] || Check;
              return (
                <div key={idx} className="card">
                  <div className="ic"><Icon strokeWidth={1.75} /></div>
                  <h3>{priv.title}</h3>
                  <p>{priv.desc}</p>
                </div>
              );
            }) || (
              <>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="card">
                    <div className="ic"><Check strokeWidth={1.75} /></div>
                    <h3>Service {i}</h3>
                    <p>Description coming soon</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="sec" id="gallery" style={{ background: 'var(--navy)' }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow" style={{ color: 'var(--gold2)' }}>Real journeys, real guests</span>
            <h2 style={{ color: '#fff' }}>Moments we've delivered</h2>
            <p style={{ color: '#B6C2D4' }}>Arrivals handled the WENS way. Tap any frame to watch.</p>
          </div>
          <div className="gallery-grid">
            {GALLERY_ITEMS.map((g, idx) => (
              <div
                key={g.image}
                className={`g-tile ${idx === 0 ? 'big' : ''}`}
                onClick={() => setLightboxIndex(idx)}
                role="button"
                tabIndex={0}
                aria-label="Play video"
                onKeyDown={(e) => { if (e.key === 'Enter') setLightboxIndex(idx); }}
              >
                <img src={g.image} alt="" loading="lazy" />
                <div className="g-play"><Play size={idx === 0 ? 24 : 18} fill="currentColor" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div className="lightbox-backdrop" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-box" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close video">
              <X size={18} />
            </button>
            <video
              src={GALLERY_ITEMS[lightboxIndex].video}
              poster={GALLERY_ITEMS[lightboxIndex].image}
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}

      {/* Plan Summary + Form Split */}
      <section className="sec" id="reserve" style={{ background: '#EFEDE6' }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Reserve</span>
            <h2>Lock your arrival window</h2>
          </div>
          <div className="split">
            <div className="panel dark">
              <div className="eyebrow" style={{ marginBottom: '14px' }}>Plan summary</div>
              <div className="kv"><span className="k">Validity</span><span className="v">Travel {EXPO_EVENT.serviceWindow}</span></div>
              <div className="kv"><span className="k">Curated journeys</span><span className="v">1 (airport → hotel/BKC)</span></div>
              <div className="kv"><span className="k">Vehicle</span><span className="v">{plan.vehicle}</span></div>
              <div className="kv"><span className="k">Security</span><span className="v">1 CPO + 1 chauffeur</span></div>
              <div className="kv"><span className="k">Price</span><span className="v">{INR(plan.price)} · ≈ US${Math.round(plan.price / 95.3)}</span></div>
              <p style={{ fontSize: '12.5px', color: '#9FB0C6', marginTop: '18px' }}>Bringing a team? Delegation packages consolidate vehicles, protection and one invoice — ask below or on WhatsApp.</p>
            </div>

            <form className="panel" onSubmit={handleFormSubmit} noValidate>
              <label htmlFor="f-name">Full name</label>
              <input id="f-name" name="name" type="text" autoComplete="name" required />
              <label htmlFor="f-phone">WhatsApp / phone</label>
              <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+971 …" required />
              <label htmlFor="f-arrival">Arrival date & flight no.</label>
              <input id="f-arrival" name="arrival" type="text" placeholder="28 Aug · EK 500" required />
              <label htmlFor="f-package">Package interest</label>
              <select id="f-package" name="package" defaultValue={plan.name}>
                <option value={plan.name}>{plan.name} — {INR(plan.price)}</option>
              </select>
              <label htmlFor="f-pax">Number of travellers</label>
              <input id="f-pax" name="pax" type="number" min="1" max="40" defaultValue="1" />
              <input type="hidden" name="gclid" id="f-gclid" />
              <input type="hidden" name="utm_source" id="f-utm_source" />
              <input type="hidden" name="utm_medium" id="f-utm_medium" />
              <input type="hidden" name="utm_campaign" id="f-utm_campaign" />
              <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginTop: '22px', border: 'none', cursor: 'pointer', fontSize: '15px', padding: '14px 26px' }} disabled={formStatus === 'loading'}>
                {formStatus === 'loading' ? 'Submitting...' : 'Reserve my arrival'}
              </button>
              <p className="form-note">By submitting you agree to our <a href="https://wensforce.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', fontWeight: '700', textDecoration: 'none' }}>Privacy Policy</a>. We reply on WhatsApp within minutes during business hours.</p>
              {formStatus === 'success' && <div style={{ marginTop: '14px', background: '#E8F5EE', border: '1px solid #BFE3CF', color: '#155B36', padding: '12px 14px', borderRadius: '10px', fontSize: '13.5px' }}>✓ Thank you! We'll be in touch shortly.</div>}
              {formStatus === 'error' && <div style={{ marginTop: '14px', background: '#FEE', border: '1px solid #DCC', color: '#C33', padding: '12px 14px', borderRadius: '10px', fontSize: '13.5px' }}>Error submitting. Please try WhatsApp or try again.</div>}
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="sec" id="faq" style={{ background: '#EFEDE6' }}>
        <div className="wrap" style={{ maxWidth: '860px' }}>
          <div className="sec-head">
            <span className="eyebrow">Questions about this plan</span>
            <h2>Before you book</h2>
          </div>
          {plan.faqs?.map((faq, idx) => (
            <details key={idx}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Tier Ladder */}
      <section className="sec" id="tiers">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Compare options</span>
            <h2>Explore other tiers</h2>
            <p>All prices are all-inclusive of vehicle, chauffeur and security detail.</p>
          </div>
          <div className="tier-grid">
            {otherPlans.map((p, idx) => {
              const grad = TIER_GRADIENTS[idx % TIER_GRADIENTS.length];
              return (
                <Link
                  key={p.id}
                  href={`/membership/${p.id}`}
                  className={`tier-card bg-gradient-to-br ${grad}`}
                >
                  <span className="t-name">{p.name}</span>
                  <div className="t-price">{INR(p.price)}</div>
                  <div className="t-note">All Inclusive</div>
                  <span className="t-cta">
                    View plan
                    <ChevronRight size={9} strokeWidth={2.5} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="closing">
        <div className="wrap">
          <span className="eyebrow">29–30 August · Jio World Centre, BKC</span>
          <h2>Two days. One expo.<br /><em>Zero logistics on your mind.</em></h2>
          <p>Close Protection Officer slots for the expo window are limited by rostered strength — confirmed bookings are served first.</p>
          <div className="hero-actions" style={{ marginTop: '30px' }}>
            <button className="btn btn-gold btn-lg" onClick={() => document.getElementById('reserve')?.scrollIntoView({ behavior: 'smooth' })}>Reserve my arrival</button>
            <button className="btn btn-wa btn-lg" onClick={handleWhatsAppClick}>Enquire on WhatsApp</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="wa-note">
        <div className="wrap f-grid">
          <div>
            <h4>WENS Force International Pvt Ltd</h4>
            <ul>
              <li>CIN: <span style={{ color: 'var(--gold2)' }}>U80100MH2025PTC442268</span></li>
              <li>PSARA Licence No.: <span style={{ color: 'var(--gold2)' }}>PSA/L/21/MH/2026/MAY/3/6271</span></li>
              <li className="f-addr">
                <MapPin size={15} />
                <span>89, 2nd Flr, 138/148, Mahendra Chamber, Empire Building, Dr. Dadabhai Nowroji Road, Stock Exchange, Opp. CSMT Fort, Mumbai – 400001</span>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul className="f-contact">
              <li><a href="tel:+917304607954"><Phone size={15} /> +91 73046 07954</a></li>
              <li><a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} /> WhatsApp concierge</a></li>
              <li><a href="mailto:concierge@wensforce.com"><Mail size={15} /> concierge@wensforce.com</a></li>
            </ul>
          </div>
          <div>
            <h4>Policies</h4>
            <ul>
              <li><a href="https://wensforce.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="https://wensforce.com/disclaimer-terms-of-services/" target="_blank" rel="noopener noreferrer">Terms & Conditions</a></li>
              <li><a href="https://wensforce.com/cancellation-refund-policy/" target="_blank" rel="noopener noreferrer">Refund & Cancellation Policy</a></li>
              <li><Link href="/terms">Membership Terms</Link></li>
              <li><a href="https://wensforce.com/contact-us/" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="wrap legal">
          © {new Date().getFullYear()} WENS Force International Pvt Ltd. All rights reserved. "Money Expo India" is referenced factually as the event our clients attend; WENS Force is an independent service provider.
        </div>
      </footer>
    </>
  );
}