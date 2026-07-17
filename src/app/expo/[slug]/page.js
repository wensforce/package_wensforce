import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getExpos, getExpoBySlug } from '../../data/expos';
import { plans as welcomePlans } from '../../data/welcomeIndia';
import { generateEventSchema, generateBreadcrumbSchema, generateFaqSchema } from '../../lib/expoJsonLd';
import ExpoDetailClient from './ExpoDetailClient';

const INR = (n) => '₹' + Number(n).toLocaleString('en-IN');

export async function generateStaticParams() {
  const expos = getExpos();
  return expos.map((expo) => ({
    slug: expo.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const expo = getExpoBySlug(slug);

  if (!expo) return {};

  const title = `${expo.name} – WENS Force Expo Arrival`;
  const description = `Attend ${expo.name} (${expo.city}, ${expo.eventStart}) with flight-tracked pickup, executive chauffeur, close protection officer & dedicated support. From ₹8,399. Book now.`;
  const url = `https://subscription.wensforce.com/expo/${slug}`;

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
      image: expo.cardImage
        ? `https://subscription.wensforce.com${expo.cardImage}`
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: expo.cardImage
        ? `https://subscription.wensforce.com${expo.cardImage}`
        : undefined,
    },
  };
}

export default async function ExpoDetailPage({ params }) {
  const { slug } = await params;
  const expo = getExpoBySlug(slug);

  if (!expo) {
    notFound();
  }

  // Fetch packages data from welcomePlans
  const packages = expo.packageIds
    .map((id) => welcomePlans.find((p) => p.id === id))
    .filter(Boolean);

  // Generate JSON-LD schemas
  const eventSchema = generateEventSchema(expo);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://subscription.wensforce.com' },
    { name: 'Expo Arrival', url: 'https://subscription.wensforce.com/expo' },
    { name: expo.name, url: `https://subscription.wensforce.com/expo/${slug}` },
  ]);

  // Build FAQ list for schema
  const genericFaqs = [
    {
      q: 'How fast can this service be activated?',
      a: 'Standard bookings 48h+ ahead; urgent bookings under 48 hours carry a Rs 2,999 + taxes surcharge (subject to availability).',
    },
    {
      q: 'What if my flight is delayed?',
      a: 'We track your flight and adjust pickup automatically; no penalty for airline delays.',
    },
    {
      q: 'Is the protection officer armed?',
      a: 'Deployments comply with PSARA and applicable state licensing; armed deployment only where lawful, licensed and pre-arranged in advance.',
    },
    {
      q: 'Payments & invoicing?',
      a: 'Cards, UPI and bank transfer; GST invoice provided. International cards accepted.',
    },
    {
      q: 'What is the cancellation policy?',
      a: 'Published cancellation policy applies — see the policy link in the footer.',
    },
  ];

  // Add templated FAQ entry
  const allFaqs = [
    ...genericFaqs,
    {
      q: `Is this service specific to ${expo.name}?`,
      a: `Yes — our Expo Arrival service is exclusively designed for delegates, speakers, and partners attending ${expo.name} (${expo.eventStart} to ${expo.eventEnd}). We provide flight-tracked pickup, executive chauffeur, dedicated close protection, and on-call return throughout the event window.`,
    },
    ...(expo.faqOverrides || []),
  ];

  const faqSchema = generateFaqSchema(allFaqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        suppressHydrationWarning
      />

      <Suspense fallback={null}>
        <ExpoDetailClient
          expo={expo}
          packages={packages}
          faqs={allFaqs}
        />
      </Suspense>
    </>
  );
}
