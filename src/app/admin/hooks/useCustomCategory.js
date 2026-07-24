import { useState, useEffect, useCallback } from "react";

const STANDARD_CATEGORIES = [
  "membership",
  "welcome_india",
  "corporate",
  "pilgrims",
  "multi-region",
  "all",
];

/**
 * Reusable hook for managing category selections with custom text input support.
 */
export function useCustomCategory({
  initialCategory = "",
  defaultCategories = STANDARD_CATEGORIES,
  fetchCategoriesFn = null,
} = {}) {
  const [categoriesList, setCategoriesList] = useState(defaultCategories);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [category, setCategoryState] = useState(initialCategory || defaultCategories[0] || "membership");

  // Fetch unique categories if fetchCategoriesFn is provided
  useEffect(() => {
    if (typeof fetchCategoriesFn === "function") {
      fetchCategoriesFn()
        .then((cats) => {
          if (Array.isArray(cats) && cats.length > 0) {
            const merged = Array.from(
              new Set([
                ...defaultCategories,
                ...cats.map((c) => c.toLowerCase().trim()),
              ])
            );
            setCategoriesList(merged);
          }
        })
        .catch(() => { });
    }
  }, []);

  // Sync state when initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      const cleanCat = initialCategory.trim().toLowerCase();
      setCategoryState(cleanCat);
      if (!categoriesList.includes(cleanCat)) {
        setIsCustomCategory(true);
        setCustomCategoryInput(initialCategory);
      } else {
        setIsCustomCategory(false);
        setCustomCategoryInput("");
      }
    }
  }, [initialCategory, categoriesList]);

  const setCategory = useCallback((val) => {
    const clean = val ? val.trim().toLowerCase() : "";
    setCategoryState(clean);
    if (clean && !categoriesList.includes(clean)) {
      setIsCustomCategory(true);
      setCustomCategoryInput(val);
    }
  }, [categoriesList]);

  const toggleCustomMode = useCallback(() => {
    setIsCustomCategory((prev) => {
      const next = !prev;
      if (next) {
        setCategoryState(customCategoryInput);
      } else {
        setCategoryState(categoriesList[0] || "membership");
      }
      return next;
    });
  }, [customCategoryInput, categoriesList]);

  const handleSelectChange = useCallback((e) => {
    const val = e.target.value;
    if (val === "__custom__") {
      setIsCustomCategory(true);
      setCategoryState(customCategoryInput);
    } else {
      setIsCustomCategory(false);
      setCategoryState(val);
    }
  }, [customCategoryInput]);

  const handleCustomInputChange = useCallback((e) => {
    const val = e.target.value;
    setCustomCategoryInput(val);
    setCategoryState(val);
  }, []);

  return {
    category,
    setCategory,
    categoriesList,
    isCustomCategory,
    setIsCustomCategory,
    customCategoryInput,
    setCustomCategoryInput,
    toggleCustomMode,
    handleSelectChange,
    handleCustomInputChange,
  };
}
