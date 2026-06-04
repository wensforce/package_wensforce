import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { plans as mainPlans, getPlanById as getMainPlanById } from '../../data/plans';
import { plans as welcomePlans } from '../../data/welcomeIndia';
import BookingPageContent from '../../components/BookingPageContent';

const allPlans = [...mainPlans, ...welcomePlans];
const getPlanById = (id) => allPlans.find((p) => p.id === id);

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

export async function generateStaticParams() {
  return allPlans.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const plan = getPlanById(id);
  if (!plan) return {};
  const title = `Book ${plan.name} Membership — WENS Force`;
  const description = `Reserve your ${plan.name} founding membership at ${INR(plan.price)}/year. ${plan.trips} curated journeys, ${plan.bodyguard}, VIP Darshan. Limited founding spots remaining.`;
  const url = `https://subscription.wensforce.com/booking/${id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BookingPage({ params }) {
  const { id } = await params;
  const plan = getPlanById(id);
  if (!plan) notFound();

  return (
    <Suspense fallback={null}>
      <BookingPageContent
        plan={plan}
        anchorPrice={plan.anchorPrice}
        foundingSpots={plan.confirmed}
      />
    </Suspense>
  );
}
