import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchExpoById } from "../../lib/expoApi";
import { EXPO_FAQS } from "../../data/expoContent";
import {
  generateEventSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
} from "../../utils/expo/expoJsonLd";
import ExpoDetailClient from "./ExpoDetailClient";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const expo = await fetchExpoById(id);

  if (!expo) return {};

  const title = `${expo.name} – WENS Force Expo Arrival`;
  const description = `Attend ${expo.name} (${expo.city}, ${expo.eventStart}) with flight-tracked pickup, executive chauffeur, close protection officer & dedicated support. From ₹8,399. Book now.`;
  const url = `https://subscription.wensforce.com/expo/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      title,
      description,
      image: expo.cardImage
        ? `https://subscription.wensforce.com${expo.cardImage}`
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      image: expo.cardImage
        ? `https://subscription.wensforce.com${expo.cardImage}`
        : undefined,
    },
  };
}

export default async function ExpoDetailPage({ params }) {
  const { id } = await params;
  const expo = await fetchExpoById(id);

  if (!expo) {
    notFound();
  }

  const packages = Array.isArray(expo.packages) ? expo.packages : [];
  const faqSchema = generateFaqSchema(EXPO_FAQS);

  const eventSchema = generateEventSchema(expo);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://subscription.wensforce.com" },
    { name: "Expo Arrival", url: "https://subscription.wensforce.com/expo" },
    {
      name: expo.name,
      url: `https://subscription.wensforce.com/expo/${id}`,
    },
  ]);

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
        <ExpoDetailClient expo={expo} packages={packages} />
      </Suspense>
    </>
  );
}
