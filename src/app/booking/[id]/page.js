import { notFound } from 'next/navigation';
import { plans, getPlanById } from '../../data/plans';
import BookingPageContent from '../../components/BookingPageContent';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

const ANCHOR_PRICES = {
  essential: 34999,
  executive: 64999,
  premium: 99999,
  elite: 130000,
  sovereign: 250000,
};

const FOUNDING_SPOTS = {
  essential: 82,
  executive: 71,
  premium: 58,
  elite: 73,
  sovereign: 41,
};

export async function generateStaticParams() {
  return plans.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const plan = getPlanById(id);
  if (!plan) return {};
  return {
    title: `Book ${plan.name} Membership — WENS Force`,
    description: `Reserve your ${plan.name} founding membership at ${INR(plan.price)}/year. ${plan.trips} curated journeys, ${plan.bodyguard}, VIP Darshan. Limited founding spots remaining.`,
  };
}

export default async function BookingPage({ params }) {
  const { id } = await params;
  const plan = getPlanById(id);
  if (!plan) notFound();

  return (
    <BookingPageContent
      plan={plan}
      anchorPrice={ANCHOR_PRICES[plan.id]}
      foundingSpots={FOUNDING_SPOTS[plan.id]}
    />
  );
}
