"use client";

import { usePackages } from "../../hooks/usePackages";
import PlansSection from "./PlansSection";
import { ComparisonTable } from "../Comparison-Table/ComparisonTable";
import FoundingMemberBanner from "./FoundingMemberBanner";

export default function HomeClient({ slot, welcomeIndia }) {
  const { packages, loading, error } = usePackages();
  // Both slots call the same hook.
  // plans slot  → fires the fetch, dispatches to store
  // founding slot → isFetching guard skips the fetch,
  //                 receives data via selector when store updates

  if (slot === "founding") {
    return (
      <FoundingMemberBanner
        packages={packages} // ← now correctly reads storePackages
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <>
      <PlansSection
        packages={packages}
        loading={loading}
        error={error}
        welcomeIndia={welcomeIndia}
      />
      <ComparisonTable packages={packages} loading={loading} />
    </>
  );
}
