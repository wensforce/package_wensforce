import { useState, useMemo } from "react";

/**
 * Custom hook for searching and filtering packages in memory.
 * @param {Array} packagesList - List of package objects
 */
export function usePackageSearch(packagesList = []) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPackages = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) {
      return packagesList;
    }
    const q = searchQuery.toLowerCase().trim();
    return packagesList.filter(
      (pkg) =>
        pkg.name?.toLowerCase().includes(q) ||
        String(pkg.id).includes(q) ||
        pkg.category?.toLowerCase().includes(q)
    );
  }, [packagesList, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredPackages,
  };
}
