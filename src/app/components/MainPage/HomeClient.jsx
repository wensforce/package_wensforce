"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPackages } from "@/app/membership/slices/package-slice";
import PlansSection from "@/app/components/MainPage/PlansSection";
import WelcomeIndiaCard from "@/app/components/MainPage/WelcomeIndiaCard";
import { ComparisonTable } from "@/app/components/Comparison-Table/ComparisonTable";
import api from "@/app/axios/axios";

export default function HomeClient({ welcomeIndia }) {
  const [packages, setPackagesLocal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const storePackages = useSelector((state) => state.packages.value);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        if (storePackages.length > 0) {
          console.log("package store hit");
          setPackagesLocal(storePackages);
        } else {
          const res = await api.get("/package/user");
          const data = res?.data?.data || [];
          console.log("api hit");
          setPackagesLocal(data);
          dispatch(setPackages(data));
        }
      } catch (err) {
        console.error("Failed to fetch packages:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        {/* Plans spotlight placeholder */}
        <section style={{ backgroundColor: "#FAF6EC" }}>
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table placeholder */}
        {welcomeIndia !== "true" && (
          <section style={{ backgroundColor: "#FAF6EC" }}>
            <div className="max-w-6xl mx-auto px-4 py-16">
              <div className="h-72 bg-gray-100 rounded-3xl animate-pulse" />
            </div>
          </section>
        )}
      </>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <section style={{ backgroundColor: "#FAF6EC" }}>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-400 text-sm">
          Could not load plans. Please refresh or contact support.
        </div>
      </section>
    );
  }

  // ── Rendered output ────────────────────────────────────────────────────────
  return (
    <>
      {/* ── PLANS SPOTLIGHT ── */}
      <section style={{ backgroundColor: "#FAF6EC" }}>
        {welcomeIndia === "true" ? (
          <WelcomeIndiaCard />
        ) : (
          <PlansSection packages={packages} />
        )}
      </section>

      {/* ── COMPARISON TABLE ── */}
      {welcomeIndia !== "true" && (
        <section style={{ backgroundColor: "#FAF6EC" }}>
          <ComparisonTable packages={packages} bestValueId={4} />
        </section>
      )}
    </>
  );
}
