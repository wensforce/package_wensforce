"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { packageApiUser } from "@/app/user-apis/package.api";
import PlanVideoPlayer from "../../components/MainPage/PlanVideoPlayer";
import MetaViewTracker from "@/app/components/MainPage/MetaViewTracker";
import { useDispatch, useSelector } from "react-redux";
import { setPackages } from "@/app/membership/slices/package-slice";
import {
  setPackage,
  getPackageById,
} from "@/app/membership/slices/detailed-package-slice";
import Header from "../sections/Header";
import Footer from "../sections/Footer";
import HeroSection from "../sections/HeroSection";
import ServicesSection from "../sections/ServiceSection";
import BreakdownSection from "../sections/BreakDownSection";
import FAQSection from "../sections/FaqSection";
import OtherPlansSection from "../sections/OtherPlansSection";
import { useExitIntent } from "@/app/hooks/useExitIntent";
import MediaSection from "../sections/MediaSection";
import TermsAndConditionsSection from "../sections/TermsAndConditionsSection";

const WA_NUMBER = "917304607954";
const S3_BASE =
  "https://subscription-package-images.s3.ap-south-1.amazonaws.com";

const INR = (n) => "₹" + Number(n).toLocaleString("en-IN");

function getServiceImage(service) {
  if (!service) return null;
  if (service.thumbnailUrl) return service.thumbnailUrl;
  if (service.thumbnailUrlKey) return `${S3_BASE}/${service.thumbnailUrlKey}`;
  return null;
}

export default function PlanDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const storePackages = useSelector((state) => state.packages.value);
  const detailedPlan = useSelector(getPackageById(id));

  const [plan, setPlan] = useState(null);
  const [otherPlans, setOtherPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [exitPopupVisible, setExitPopupVisible] = useState(false);

  // Only fire exit intent after the plan has loaded — no point nudging a blank page
  useExitIntent(() => {
    if (!plan) return false;
    setExitPopupVisible(true);
  });

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      setError(false);

      try {
        // ── Tier 1: detailedPackages store has this specific plan ──
        if (detailedPlan) {
          setPlan(detailedPlan);

          if (storePackages && storePackages.length > 0) {
            // otherPlans already in packages store, filter by same category
            setOtherPlans(
              storePackages.filter((p) => String(p.id) !== String(id) && p.category === detailedPlan.category),
            );
          } else {
            // detailedPlan found but no list yet — fetch list of same category
            const allPlansRes = await packageApiUser.fetchUserPackages(detailedPlan.category || "membership");
            const allPlans = allPlansRes?.data || [];
            setOtherPlans(allPlans.filter((p) => String(p.id) !== String(id)));
            dispatch(setPackages(allPlans));
          }

          setLoading(false);
          return;
        }

        // ── Tier 2: packages (list) store has this plan ──
        if (storePackages && storePackages.length > 0) {
          const foundPlan = storePackages.find(
            (p) => String(p.id) === String(id),
          );
          if (foundPlan) {
            setPlan(foundPlan);
            setOtherPlans(
              storePackages.filter((p) => String(p.id) !== String(id) && p.category === foundPlan.category),
            );
            dispatch(setPackage(foundPlan)); // promote into detailedPackages cache
            setLoading(false);
            return;
          }
        }

        // ── Tier 3: full API hit ──
        const fetchedPlan = await packageApiUser.getPackageById(id);
        if (!fetchedPlan) {
          setError(true);
          return;
        }

        const allPlansRes = await packageApiUser.fetchUserPackages(fetchedPlan.category || "membership");
        const allPlans = allPlansRes?.data || [];

        setPlan(fetchedPlan);
        setOtherPlans(
          allPlans.filter((p) => String(p.id) !== String(fetchedPlan.id)),
        );

        // Save to both stores
        dispatch(setPackage(fetchedPlan));
        dispatch(setPackages(allPlans));
      } catch (err) {
        console.error("Failed to fetch plan data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg animate-pulse">Loading plan...</p>
      </div>
    );
  }

  if (error || !plan) {
    return notFound();
  }

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

      <div className="pt-16">
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
        <MediaSection
          images={plan.images ?? []}
          videos={plan.videos ?? []}
        />
        <ServicesSection services={includedServicesWithImage} />
        <BreakdownSection plan={plan} waUrl={waUrl} />
        <FAQSection plan={plan} />
        <TermsAndConditionsSection plan={plan} />
        <OtherPlansSection plans={otherPlans} currentId={plan.id} />
      </div>

      <Footer />

      {/* ── Exit intent: concierge nudge ── */}
      {exitPopupVisible && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setExitPopupVisible(false)}
          />
          <div
            className="relative bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl animate-scale-in"
            style={{ boxShadow: "0 24px 64px rgba(11,30,63,0.25)" }}
          >
            <button
              onClick={() => setExitPopupVisible(false)}
              className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
            <p className="text-[#C9A24B] text-[10px] tracking-[0.4em] uppercase font-semibold mb-3">
              Still Deciding?
            </p>
            <h3 className="font-serif-display text-2xl font-bold text-[#0B1E3F] mb-2 leading-snug">
              Let our concierge answer your questions
            </h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-6">
              Not sure if the{" "}
              <span className="font-semibold text-[#0B1E3F]">{plan.name}</span>{" "}
              plan is right for you? Our concierge is available 24×7 — no
              commitment needed.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setExitPopupVisible(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="28"
                height="28"
                fill="white"
              >
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.543 11.543 0 01-5.88-1.604l-.42-.248-4.39 1.074 1.106-4.274-.272-.44A11.556 11.556 0 014.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.327-8.627c-.348-.174-2.055-1.014-2.374-1.13-.318-.115-.55-.174-.78.174-.23.348-.894 1.13-1.097 1.362-.201.231-.404.26-.752.086-.348-.174-1.47-.542-2.799-1.727-1.034-.922-1.732-2.062-1.934-2.41-.202-.348-.022-.536.152-.71.156-.155.348-.405.522-.607.174-.202.23-.348.348-.58.115-.231.058-.434-.03-.607-.086-.174-.78-1.882-1.07-2.578-.282-.677-.568-.585-.78-.596-.201-.01-.434-.012-.665-.012-.23 0-.607.086-.926.434-.318.348-1.214 1.186-1.214 2.892 0 1.707 1.243 3.356 1.417 3.588.174.231 2.447 3.734 5.928 5.234.83.358 1.478.572 1.982.732.833.265 1.59.227 2.19.138.668-.1 2.055-.84 2.346-1.652.29-.81.29-1.505.202-1.652-.086-.145-.318-.231-.665-.405z" />
              </svg>
              Chat with Concierge on WhatsApp
            </a>
            <button
              onClick={() => setExitPopupVisible(false)}
              className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              No thanks, I'll keep browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
