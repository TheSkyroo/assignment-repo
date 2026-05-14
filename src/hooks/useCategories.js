import { useState, useEffect } from "react";
import { getCategories } from "../services/api";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategories();
      const all = res.data?.tags ?? [];
      const top50 = [...all]
        .sort((a, b) => (b.products ?? 0) - (a.products ?? 0))
        .slice(0, 50);
      setCategories(top50);
    } catch (err) {
      const msg =
        err.code === "ECONNABORTED" || err.message?.includes("timeout")
          ? "OpenFoodFacts server is slow. Please wait a moment and try again."
          : "Failed to load categories.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { categories, loading, error, retry: fetch };
}
