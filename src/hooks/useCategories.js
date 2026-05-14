import { useState, useEffect } from "react";
import { getCategories } from "../services/api";

// Shown instantly while the API fetch is in flight, and used as fallback on error.
const FALLBACK_CATEGORIES = [
  { id: "beverages", name: "Beverages" },
  { id: "dairies", name: "Dairies" },
  { id: "snacks", name: "Snacks" },
  { id: "sugary-snacks", name: "Sugary Snacks" },
  { id: "cereals-and-their-products", name: "Cereals & Products" },
  { id: "plant-based-foods", name: "Plant-Based Foods" },
  { id: "meats", name: "Meats" },
  { id: "sauces", name: "Sauces" },
  { id: "biscuits-and-cakes", name: "Biscuits & Cakes" },
  { id: "frozen-foods", name: "Frozen Foods" },
  { id: "chocolate-products", name: "Chocolate Products" },
  { id: "breads", name: "Breads" },
  { id: "salty-snacks", name: "Salty Snacks" },
  { id: "breakfast-cereals", name: "Breakfast Cereals" },
  { id: "cheeses", name: "Cheeses" },
  { id: "waters", name: "Waters" },
  { id: "fruit-juices", name: "Fruit Juices" },
  { id: "sodas", name: "Sodas" },
  { id: "milk", name: "Milk" },
  { id: "yogurts", name: "Yogurts" },
  { id: "fish", name: "Fish" },
  { id: "seafood", name: "Seafood" },
  { id: "legumes", name: "Legumes" },
  { id: "nuts", name: "Nuts" },
  { id: "dried-fruits", name: "Dried Fruits" },
  { id: "pasta", name: "Pasta" },
  { id: "rice", name: "Rice" },
  { id: "soups", name: "Soups" },
  { id: "jams-and-marmalades", name: "Jams & Marmalades" },
  { id: "coffee", name: "Coffee" },
  { id: "teas", name: "Teas" },
  { id: "oils", name: "Oils" },
  { id: "vinegars", name: "Vinegars" },
  { id: "chips-and-crisps", name: "Chips & Crisps" },
  { id: "ice-creams", name: "Ice Creams" },
  { id: "beers", name: "Beers" },
  { id: "wines", name: "Wines" },
  { id: "chocolates", name: "Chocolates" },
  { id: "baby-foods", name: "Baby Foods" },
  { id: "herbs-and-spices", name: "Herbs & Spices" },
  { id: "canned-foods", name: "Canned Foods" },
  { id: "energy-drinks", name: "Energy Drinks" },
  { id: "spreads", name: "Spreads" },
  { id: "confectioneries", name: "Confectioneries" },
  { id: "condiments", name: "Condiments" },
  { id: "pastries", name: "Pastries" },
  { id: "dairy-desserts", name: "Dairy Desserts" },
  { id: "crackers", name: "Crackers" },
  { id: "fruit-compotes", name: "Fruit Compotes" },
  { id: "vegetables", name: "Vegetables" },
];

function parseTaxonomy(data) {
  return Object.entries(data)
    .filter(([key, val]) => key.startsWith("en:") && val?.name?.en)
    .map(([key, val]) => ({
      id: key.replace(/^en:/, ""),
      name: val.name.en,
      isTopLevel: !val.parents?.length,
    }))
    .sort((a, b) => {
      if (a.isTopLevel !== b.isTopLevel) return a.isTopLevel ? -1 : 1;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 50);
}

export function useCategories() {
  // Start with fallback so dropdown is usable immediately.
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFromApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategories();
      const parsed = parseTaxonomy(res.data || {});
      if (parsed.length > 0) setCategories(parsed);
    } catch {
      // Fallback list stays in place; silently skip.
      setError("Using cached categories — API unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromApi();
  }, []);

  return { categories, loading, error, retry: fetchFromApi };
}
