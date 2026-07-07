"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
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

  const [plan, setPlan] = useState(null);
  const [otherPlans, setOtherPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      setError(false);

      try {
        const [planRes, allPlansRes] = await Promise.all([
          api.get(`/package/${id}`),
          api.get("/package/user"),
        ]);

        const fetchedPlan = planRes?.data?.data || null;
        const allPlans = allPlansRes?.data?.data || [];

        if (!fetchedPlan) {
          setError(true);
          return;
        }

        setPlan(fetchedPlan);
        setOtherPlans(allPlans.filter((p) => p.id !== fetchedPlan.id));
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
    </div>
  );
}