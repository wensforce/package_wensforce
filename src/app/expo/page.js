import { Suspense } from "react";
import ExpoHub from "./ExpoHub";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Expo Arrival — Flight-Tracked Service for Trade Events — WENS Force",
  description:
    "Attend major conferences & expos with complete peace of mind. Flight-tracked pickup, executive chauffeur, close protection officer, dedicated relationship manager, GST invoicing. From ₹8,399 per trip.",
  alternates: { canonical: "https://subscription.wensforce.com/expo" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://subscription.wensforce.com/expo",
    title: "Expo Arrival — Flight-Tracked Service for Trade Events — WENS Force",
    description:
      "Attend major conferences & expos with complete peace of mind. Flight-tracked pickup, executive chauffeur, close protection officer, dedicated relationship manager, GST invoicing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expo Arrival — Flight-Tracked Service for Trade Events — WENS Force",
    description:
      "Attend major conferences & expos with complete peace of mind. Flight-tracked pickup, executive chauffeur, close protection officer, dedicated relationship manager, GST invoicing.",
  },
};

export default function ExpoPage() {
  return (
    <Suspense fallback={null}>
      <ExpoHub />
    </Suspense>
  );
}
