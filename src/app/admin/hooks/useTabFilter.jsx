import { useState, useEffect } from "react";

export function useTabFilter(setPage) {
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    setPage?.(1);
  }, [activeTab, setPage]);

  return { activeTab, setActiveTab };
}