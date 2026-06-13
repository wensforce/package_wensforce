import { notFound } from 'next/navigation';
import { Suspense } from 'react';
//TODO: Change path and move to protected route
import { plans as mainPlans, getPlanById as getMainPlanById } from '@/app/data/plans';
import { plans as welcomePlans } from '@/app/data/welcomeIndia';
import BookingPageContent from '@/app/components/BookingPageContent';

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
