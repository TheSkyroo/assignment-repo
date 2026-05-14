import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { useProducts } from "../hooks/useProducts";
import { useDebounce } from "../hooks/useDebounce";
import SearchBar from "../components/SearchBar";
import BarcodeSearch from "../components/BarcodeSearch";
import CategoryFilter from "../components/CategoryFilter";
import SortDropdown from "../components/SortDropdown";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import ErrorBanner from "../components/ErrorBanner";
import { getProductName } from "../utils/helpers";

const GRADE_ORDER = { a: 1, b: 2, c: 3, d: 4, e: 5 };

function sortProducts(products, sortOption) {
  const arr = [...products];
  if (sortOption === "name-asc") {
    arr.sort((a, b) => getProductName(a).localeCompare(getProductName(b)));
  } else if (sortOption === "name-desc") {
    arr.sort((a, b) => getProductName(b).localeCompare(getProductName(a)));
  } else if (sortOption === "grade-asc") {
    arr.sort((a, b) => {
      const ga = GRADE_ORDER[(a.nutrition_grades || a.nutrition_grade_fr || "z").toLowerCase()] ?? 99;
      const gb = GRADE_ORDER[(b.nutrition_grades || b.nutrition_grade_fr || "z").toLowerCase()] ?? 99;
      return ga - gb;
    });
  } else if (sortOption === "grade-desc") {
    arr.sort((a, b) => {
      const ga = GRADE_ORDER[(a.nutrition_grades || a.nutrition_grade_fr || "").toLowerCase()] ?? -1;
      const gb = GRADE_ORDER[(b.nutrition_grades || b.nutrition_grade_fr || "").toLowerCase()] ?? -1;
      return gb - ga;
    });
  }
  return arr;
}

export default function HomePage() {
  const { state, dispatch } = useAppContext();
  const { fetchProducts, loadMore } = useProducts();
  const { searchQuery, selectedCategory, sortOption, products, isLoading, error, hasMore } = state;
  const [activeTab, setActiveTab] = useState("name");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    fetchProducts({ query: debouncedQuery, category: selectedCategory, page: 1, append: false });
  }, [debouncedQuery, selectedCategory]);

  const sorted = useMemo(() => sortProducts(products, sortOption), [products, sortOption]);

  const handleSearchChange = (val) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: val });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Food Product Explorer</h1>
          <p className="text-gray-500 text-sm">Discover nutritional info for thousands of products</p>
        </div>

        {/* Search Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
          <div className="flex gap-1 mb-3 bg-gray-100 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("name")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "name" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Name Search
            </button>
            <button
              onClick={() => setActiveTab("barcode")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "barcode" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Barcode Search
            </button>
          </div>

          {activeTab === "name" ? (
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          ) : (
            <BarcodeSearch />
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 lg:cursor-default"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <span>Filters & Sort</span>
                <span className="lg:hidden">{filtersOpen ? "▲" : "▼"}</span>
              </button>
              <div className={`px-4 pb-4 space-y-4 ${filtersOpen ? "block" : "hidden lg:block"}`}>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Category
                  </label>
                  <CategoryFilter />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Sort By
                  </label>
                  <SortDropdown />
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {error ? (
              <ErrorBanner
                message={error}
                onRetry={() => fetchProducts({ query: debouncedQuery, category: selectedCategory, page: 1, append: false })}
              />
            ) : (
              <>
                {!isLoading && sorted.length === 0 && !error && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm mt-1">Try a different search term or category</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sorted.map((product) => (
                    <ProductCard
                      key={product.code || product.id || Math.random()}
                      product={product}
                    />
                  ))}
                  {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>

                {!isLoading && hasMore && sorted.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
