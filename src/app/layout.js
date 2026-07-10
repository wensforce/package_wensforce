import { Playfair_Display, Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import FloatingWhatsApp from "./components/MainPage/FloatingWhatsApp";
import LiveActivityTicker from "./components/MainPage/LiveActivityTicker";
import JsonLd from "./components/MainPage/JsonLd";
// import GTMPageTracker from "./components/GTMPageTracker";
import { Analytics } from "@vercel/analytics/next";
import MetaPixelInit from "./components/MainPage/MetaPixelInit";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import Providers from "./provider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://subscription.wensforce.com";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "WENS Force — India's Only Luxury Travel + Armed Protection + VIP Darshan Subscription",
    template: "%s | WENS Force",
  },
  description:
    "Five tiers. One annual fee. Vehicle, bodyguard, and lifestyle privileges pre-arranged for the year. VIP Darshan at Tirupati, Vaishno Devi, Mahakaleshwar. PSARA-licensed security. From ₹24,999/year.",
  keywords: [
    "luxury travel subscription India",
    "VIP darshan Tirupati",
    "armed bodyguard service India",
    "PSARA licensed security",
    "premium car with driver India",
    "WENS Force membership",
  ],
  authors: [{ name: "WENS Force International Private Limited" }],
  creator: "WENS Force International Private Limited",
  verification: {
    google: "2YIY1he-4ib4Llzu-dsSYumockta8C1agDary9_byOc",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "WENS Force",
    title:
      "WENS Force — India's Only Luxury Travel + Armed Protection + VIP Darshan Subscription",
    description:
      "Five tiers. One annual fee. Vehicle, bodyguard, and lifestyle privileges pre-arranged for the year. VIP Darshan at Tirupati, Vaishno Devi, Mahakaleshwar. PSARA-licensed security. From ₹24,999/year.",
    images: [
      {
        url: "/og-default.webp",
        width: 1200,
        height: 630,
        alt: "WENS Force — Luxury Travel & Protection Subscription",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "WENS Force — India's Only Luxury Travel + Armed Protection + VIP Darshan Subscription",
    description:
      "Five tiers. One annual fee. Vehicle, bodyguard, and lifestyle privileges pre-arranged for the year. PSARA-licensed security. From ₹24,999/year.",
    images: ["/og-default.webp"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NVQRNTML');`,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Microsoft Clarity */}
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","wzmm5dme82");`,
          }}
        />
        {/* End Microsoft Clarity */}
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "WENS Force International Private Limited",
            alternateName: "WENS Force",
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-7304607954",
              contactType: "customer service",
              areaServed: "IN",
              availableLanguage: ["English", "Hindi"],
            },
            address: {
              "@type": "PostalAddress",
              streetAddress:
                "Mahindra Chamber, Stock Exchange, opp. CST Station",
              addressLocality: "South Mumbai",
              addressCountry: "IN",
            },
            sameAs: [
              "https://www.instagram.com/wensforce",
              "https://www.facebook.com/wensforce",
              "https://www.linkedin.com/company/wens-force",
              "https://x.com/wensforce",
              "https://www.youtube.com/@wensforce",
              "https://wensforce.com",
            ],
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NVQRNTML"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* <GTMPageTracker /> */}
        <Providers>
          <AuthProvider>
            {children}
            <MetaPixelInit />
            <FloatingWhatsApp />
            <LiveActivityTicker />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontFamily: "var(--font-inter)",
                  fontSize: "13px",
                },
              }}
            />
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
