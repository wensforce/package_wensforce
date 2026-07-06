import { notFound } from "next/navigation";
import api from "@/app/axios/axios";
import PlanVideoPlayer from "../../components/PlanVideoPlayer";
import MetaViewTracker from "@/app/components/MetaViewTracker";



import Header from "../sections/Header";
import Footer from "../sections/Footer";
import HeroSection from "../sections/HeroSection";
import ServicesSection from "../sections/ServiceSection";
import BreakdownSection from "../sections/BreakDownSection";
import FAQSection from "../sections/FaqSection";
import OtherPlansSection from "../sections/OtherPlansSection";

const WA_NUMBER = "917304607954";
const S3_BASE =
  "https://subscription-package-images.s3.ap-south-1.amazonaws.com";

// Presigned S3 URLs in the API response expire after 900s (see X-Amz-Expires
// in thumbnailUrl). Caching/statically generating this page would eventually
// serve broken/expired image links, so force it to render fresh every request.
export const dynamic = "force-dynamic";

const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

/**
 * The package-level thumbnailUrl comes back presigned from the API.
 * Nested `service` objects in the sample payload only include
 * `thumbnailUrlKey` (no presigned URL). We prefer a real `thumbnailUrl` if
 * the API ever adds one, and fall back to building a direct S3 URL from the
 * key otherwise. If the bucket is private, ask the backend to presign
 * service thumbnails the same way package thumbnails already are.
 */
function getServiceImage(service) {
  if (!service) return null;
  if (service.thumbnailUrl) return service.thumbnailUrl;
  if (service.thumbnailUrlKey) return `${S3_BASE}/${service.thumbnailUrlKey}`;
  return null;
}

async function getPackage(id) {
  try {
    const res = await api.get(`/package/${id}`);
    return res?.data?.data || null;
  } catch (err) {
    console.error("Failed to fetch package", id, err);
    return null;
  }
}

async function getOtherPackages() {
  try {
    const res = await api.get("/package/user");
    return res?.data?.data || [];
  } catch (err) {
    console.error("Failed to fetch package list", err);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const plan = await getPackage(id);
  if (!plan) return {};

  const title = `${plan.name} Membership — WENS Force`;
  const description = `${plan.description ? plan.description + ". " : ""}${plan.trips} curated journeys/year · ${[plan.vehicleType, plan.vehicleModel].filter(Boolean).join(" ")}. From ${INR(plan.discountedPrice)}/year.`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      images: plan.thumbnailUrl
        ? [{ url: plan.thumbnailUrl, width: 1200, height: 630, alt: plan.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: plan.thumbnailUrl ? [plan.thumbnailUrl] : [],
    },
  };
}

export default async function PlanDetailPage({ params }) {
  const { id } = await params;

  const [plan, otherPackagesRaw] = await Promise.all([
    getPackage(id),
    getOtherPackages(),
  ]);

  if (!plan) notFound();

  const otherPlans = otherPackagesRaw.filter((p) => p.id !== plan.id);

  // Section 2 only wants services that actually have an image.
  const includedServicesWithImage = (plan.packageServices || [])
    .filter((ps) => ps.service)
    .map((ps) => ({ ...ps, image: getServiceImage(ps.service) }))
    .filter((ps) => !!ps.image);

  const waMsg = `Hi WENS Force, I'm interested in the ${plan.name} membership (${INR(plan.discountedPrice)}/yr). Can you help me get started?`;
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div className="min-h-screen">
      <Header planName={plan.name} planId={plan.id} waUrl={waUrl} />
      <MetaViewTracker plan={plan} />

      {/* pt-16 offsets the fixed Header (h-16) above */}
      <div className="pt-16">
        {/* ── SECTION 1: Hero — identity, price, stats ── */}
        <HeroSection plan={plan} waUrl={waUrl} />

        {plan.video && (
          <PlanVideoPlayer
            videoUrl={plan.video}
            posterUrl={plan.thumbnailUrl}
            accentColor="#C9A24B"
            accentRgb="201,162,75"
            planName={plan.name}
          />
        )}

        {/* ── SECTION 2: What you get — services with images only ── */}
        <ServicesSection services={includedServicesWithImage} />

        {/* ── SECTION 3: Full breakdown + buy/whatsapp CTAs ── */}
        <BreakdownSection plan={plan} waUrl={waUrl} />

        {/* ── SECTION 4: FAQ ── */}
        <FAQSection plan={plan} />

        {/* ── SECTION 5: Other plans (from /package/user) ── */}
        <OtherPlansSection plans={otherPlans} currentId={plan.id} />
      </div>

      <Footer />
      
    </div>
  );
}
