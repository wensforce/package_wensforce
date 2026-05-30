'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const WA_NUMBER = '917304607954';

const QUESTIONS = [
  {
    q: 'How often do you travel for business or family per year?',
    options: ['Less than 5 trips', '5–15 trips', '15+ trips'],
    scores: [1, 2, 3],
  },
  {
    q: 'Do you typically travel alone or with family?',
    options: ['Alone, mostly business', 'With spouse/acquaintances', 'Full family, often with children/parents'],
    scores: [1, 2, 3],
  },
  {
    q: 'How important is on-site security for you?',
    options: ['Nice to have', 'Important for some trips', 'Critical — always'],
    scores: [1, 2, 3],
  },
  {
    q: 'Do you visit religious destinations annually?',
    options: ['Rarely', '1–2 pilgrimages a year', 'Multiple, plus VIP access desired'],
    scores: [1, 2, 3],
  },
  {
    q: 'What level of vehicle do you currently use?',
    options: ['Sedan', 'Sedan + occasional SUV', 'Premium SUV, always'],
    scores: [1, 2, 3],
  },
];

const TIER_MAP = [
  { min: 5,  max: 7,  id: 'essential',  name: 'ESSENTIAL',  price: '₹24,999* + GST 18% Extra', tagline: 'Built for the frequent solo traveller.' },
  { min: 8,  max: 9,  id: 'executive',  name: 'EXECUTIVE',  price: '₹49,999* + GST 18% Extra', tagline: 'Built for the rising professional & growing family.' },
  { min: 10, max: 11, id: 'premium',    name: 'PREMIUM',    price: '₹74,999* + GST 18% Extra', tagline: 'Where armed protection meets pilgrimage convenience.' },
  { min: 12, max: 13, id: 'elite',      name: 'ELITE',      price: '₹99,999* + GST 18% Extra', tagline: 'Where C-suite executives travel.' },
  { min: 14, max: 15, id: 'sovereign',  name: 'SOVEREIGN',  price: '₹1,99,999* + GST 18% Extra', tagline: 'The pinnacle — no compromises, anywhere.' },
];

function getTier(total) {
  return TIER_MAP.find((t) => total >= t.min && total <= t.max) || TIER_MAP[2];
}

export default function TierQuiz() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const total = scores.reduce((a, b) => a + b, 0);
  const recommended = getTier(total);

  const handleOption = (score) => {
    setLeaving(true);
    setTimeout(() => {
      setScores([...scores, score]);
      setStep(step + 1);
      setLeaving(false);
    }, 250);
  };

  const handleAskConcierge = () => {
    const msg = `Hi WENS Force, I just took your tier quiz and got ${recommended.name} tier (${recommended.price}/year). I'd like to know more about this plan and how to get started. Please advise.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleBookNow = () => {
    router.push(`/booking/${recommended.id}`);
  };

  const reset = () => {
    setStarted(false);
    setStep(0);
    setScores([]);
    setSubmitted(false);
    setLeaving(false);
  };

  return (
    <section id="tier-quiz" className="py-20 px-6" style={{ backgroundColor: '#FAF6EC' }}>
      <div className="max-w-2xl mx-auto">

        {!started ? (
          /* Entry card */
          <div className="text-center">
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
              Not Sure Which Tier?
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B1E3F] mb-4">
              Find Your Tier in 60 Seconds
            </h2>
            <p className="text-gray-500 text-base font-light mb-8 max-w-sm mx-auto">
              Answer 5 quick questions and we&apos;ll recommend the perfect membership for your lifestyle — and send the brochure to your WhatsApp.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
              style={{ backgroundColor: '#0B1E3F' }}
            >
              Start the Quiz →
            </button>
          </div>
        ) : step < QUESTIONS.length ? (
          /* Question card */
          <div className={`bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 ${leaving ? 'quiz-out' : 'quiz-in'}`}>
            {/* Progress */}
            <div className="flex items-center gap-1.5 mb-8">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className="h-2 flex-1 rounded-full transition-all duration-300"
                  style={{ backgroundColor: i < step ? '#C9A24B' : i === step ? '#0B1E3F' : '#E2E8F0' }}
                />
              ))}
            </div>

            <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-3 font-medium">
              Question {step + 1} of {QUESTIONS.length}
            </p>
            <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#0B1E3F] mb-8 leading-snug">
              {QUESTIONS[step].q}
            </h3>

            <div className="space-y-3">
              {QUESTIONS[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOption(QUESTIONS[step].scores[i])}
                  className="w-full text-left px-5 py-4 rounded-2xl border-2 border-gray-100 text-gray-700 text-sm font-medium hover:border-[#C9A24B] hover:bg-[#FAF6EC] hover:text-[#0B1E3F] transition-all duration-200 min-h-[56px]"
                >
                  {opt}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button
                onClick={() => { setScores(scores.slice(0, -1)); setStep(step - 1); }}
                className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
        ) : submitted ? (
          /* Thank you */
          <div className="text-center bg-white rounded-3xl p-10 shadow-xl border border-gray-100 quiz-in">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#25D366' }}>
              <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#0B1E3F] mb-2">Sent to WhatsApp!</h3>
            <p className="text-gray-500 text-sm font-light mb-6">
              Your personalised <strong>{recommended.name}</strong> brochure is on its way. Our concierge will follow up within 30 minutes.
            </p>
            <button onClick={reset} className="text-[#C9A24B] text-sm font-semibold hover:underline">
              Retake the quiz →
            </button>
          </div>
        ) : (
          /* Result card */
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 quiz-in">
            <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-2 font-medium">Your Recommended Tier</p>
            <h2 className="font-serif-display text-4xl font-bold mb-1" style={{ color: '#C9A24B' }}>
              {recommended.name}
            </h2>

            <p className="text-gray-500 text-sm italic mb-6">{recommended.tagline}</p>

            {/* Tier image */}
            <div className="w-full aspect-[2/1] mb-6 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
              <img
                src={`/cards/${
                  recommended.id === 'essential' ? 'Sedan_Essential_Desktop.png'
                  : recommended.id === 'executive' ? 'BMW_Executive_v2.png'
                  : recommended.id === 'premium' ? 'GLC_Premium_v2.png'
                  : recommended.id === 'elite' ? 'S-Class_Elite_v2.jpg'
                  : recommended.id === 'sovereign' ? 'Defender_Sovereign_v2.png'
                  : 'Sedan_Essential_Desktop.png'
                }`}
                alt={recommended.name + ' car'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="bg-[#FAF6EC] rounded-2xl p-5 mb-8">
              <p className="text-[#0B1E3F] text-sm font-light leading-relaxed">
                Based on your answers, you&apos;ll get the most value from the{' '}
                <strong>{recommended.name}</strong> membership at{' '}
                <strong className="text-[#C9A24B]">{recommended.price}/year</strong>,{' '}
                all-inclusive.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleBookNow}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: '#0B1E3F' }}
              >
                Book {recommended.name} Now →
              </button>
              <button
                onClick={handleAskConcierge}
                className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl text-white font-semibold text-sm whitespace-nowrap transition-all hover:opacity-90 border-2"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
              >
                <svg viewBox="0 0 32 32" width="16" height="16" fill="white">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
                </svg>
                Ask Concierge on WhatsApp
              </button>
            </div>
            <button onClick={reset} className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors">
              ← Retake the quiz
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
