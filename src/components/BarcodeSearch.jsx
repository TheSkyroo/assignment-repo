import { useState } from "react";
import PropTypes from "prop-types";
import { getProductByBarcode } from "../services/api";
import ProductCard from "./ProductCard";
import ErrorBanner from "./ErrorBanner";

export default function BarcodeSearch() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const search = async (barcode) => {
    const code = (barcode || input).trim();
    if (!code) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    setResult(null);
    try {
      const res = await getProductByBarcode(code);
      if (res.data?.status === 0 || !res.data?.product) {
        setNotFound(true);
      } else {
        setResult(res.data.product);
      }
    } catch (err) {
      const msg =
        err.code === "ECONNABORTED" || err.message?.includes("timeout")
          ? "OpenFoodFacts server is slow. Please wait a moment and try again."
          : "Failed to fetch product. Please retry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    search();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
            #
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter barcode (e.g. 737628064502)"
            className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <ErrorBanner message={error} onRetry={() => search()} />}

      {notFound && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-3xl mb-2">🔍</div>
          <p>No product found for this barcode.</p>
        </div>
      )}

      {result && (
        <div className="max-w-xs mx-auto">
          <ProductCard product={result} />
        </div>
      )}
    </div>
  );
}
