"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { packageApiUser } from "@/app/user-apis/package.api";
import PlanVideoPlayer from "../../components/MainPage/PlanVideoPlayer";
import MetaViewTracker from "@/app/components/MainPage/MetaViewTracker";
import { useDispatch, useSelector } from "react-redux";
import { setPackages } from "@/app/membership/slices/package-slice";
import { setPackage,getPackageById } from "@/app/membership/slices/detailed-package-slice";
import Header from "../sections/Header";
import Footer from "../sections/Footer";
import HeroSection from "../sections/HeroSection";
import ServicesSection from "../sections/ServiceSection";
import BreakdownSection from "../sections/BreakDownSection";
import FAQSection from "../sections/FaqSection";
import OtherPlansSection from "../sections/OtherPlansSection";
import { useExitIntent } from "@/app/hooks/useExitIntent";

const WA_NUMBER = "917304607954";
const S3_BASE = "https://subscription-package-images.s3.ap-south-1.amazonaws.com";

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
  const { isExitIntent } = useExitIntent(exitPopupVisible && !!plan);

  useEffect(() => {
    if (isExitIntent) setExitPopupVisible(true);
  }, [isExitIntent]);

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
            // otherPlans already in packages store
            setOtherPlans(storePackages.filter((p) => String(p.id) !== String(id)));
          } else {
            // detailedPlan found but no list yet — fetch list only
            const allPlansRes = await packageApiUser.fetchUserPackages();
            const allPlans = allPlansRes?.data || [];
            setOtherPlans(allPlans.filter((p) => String(p.id) !== String(id)));
            dispatch(setPackages(allPlans));
          }

          setLoading(false);
          return;
        }

        // ── Tier 2: packages (list) store has this plan ──
        if (storePackages && storePackages.length > 0) {
          const foundPlan = storePackages.find((p) => String(p.id) === String(id));
          if (foundPlan) {
            setPlan(foundPlan);
            setOtherPlans(storePackages.filter((p) => String(p.id) !== String(id)));
            dispatch(setPackage(foundPlan)); // promote into detailedPackages cache
            setLoading(false);
            return;
          }
        }

        // ── Tier 3: full API hit ──
        const [fetchedPlan, allPlansRes] = await Promise.all([
          packageApiUser.getPackageById(id),
          packageApiUser.fetchUserPackages(),
        ]);

        const allPlans = allPlansRes?.data || [];

        if (!fetchedPlan) {
          setError(true);
          return;
        }

        setPlan(fetchedPlan);
        setOtherPlans(allPlans.filter((p) => String(p.id) !== String(fetchedPlan.id)));

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

        <ServicesSection services={includedServicesWithImage} />
        <BreakdownSection plan={plan} waUrl={waUrl} />
        <FAQSection plan={plan} />
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
              plan is right for you? Our concierge is available 24×7 — no commitment needed.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setExitPopupVisible(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg viewBox="0 0 32 32" width="18" height="18" fill="white">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.668 4.799 1.836 6.793L2 30l7.393-1.812A13.918 13.918 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
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
