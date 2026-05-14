import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductByBarcode } from "../services/api";
import { getProductImage, getProductName, getBarcode } from "../utils/helpers";
import GradeBadge from "../components/GradeBadge";
import NutritionTable from "../components/NutritionTable";
import ErrorBanner from "../components/ErrorBanner";
import { useCart } from "../hooks/useCart";

const PLACEHOLDER = "https://via.placeholder.com/400x300?text=No+Image";

export default function ProductDetailPage() {
  const { barcode } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { addToCart, isInCart } = useCart();

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setProduct(null);
    try {
      const res = await getProductByBarcode(barcode);
      if (res.data?.status === 0 || !res.data?.product) {
        setNotFound(true);
      } else {
        setProduct(res.data.product);
      }
    } catch (err) {
      const msg =
        err.code === "ECONNABORTED" || err.message?.includes("timeout")
          ? "OpenFoodFacts server is slow. Please wait a moment and try again."
          : "Failed to load product. Please retry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [barcode]);

  const inCart = product ? isInCart(getBarcode(product) || barcode) : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-700 transition-colors mb-6"
        >
          ← Back to Products
        </Link>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading product…</p>
          </div>
        )}

        {error && <ErrorBanner message={error} onRetry={fetchProduct} />}

        {notFound && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Product not found</h2>
            <p className="text-sm">No product found for barcode: {barcode}</p>
          </div>
        )}

        {product && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-80 flex-shrink-0 bg-gray-50 flex items-center justify-center p-8">
                <img
                  src={getProductImage(product) || PLACEHOLDER}
                  alt={getProductName(product)}
                  className="max-h-64 max-w-full object-contain"
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                />
              </div>

              {/* Header info */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                      {getProductName(product)}
                    </h1>
                    {product.brands && (
                      <p className="text-gray-500 text-sm mt-1">{product.brands}</p>
                    )}
                  </div>
                  <GradeBadge grade={product.nutrition_grades || product.nutrition_grade_fr} size="lg" />
                </div>

                {/* Labels/Tags */}
                {product.labels_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.labels_tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full"
                      >
                        {tag.replace(/^en:/, "").replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => addToCart({ ...product, code: getBarcode(product) || barcode })}
                  disabled={inCart}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-colors ${
                    inCart
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {inCart ? "In Cart" : "Add to Cart"}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 p-6 space-y-6">
              {/* Ingredients */}
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-2">Ingredients</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.ingredients_text || "Not available"}
                </p>
              </section>

              {/* Nutrition Table */}
              <section>
                <h2 className="text-base font-semibold text-gray-900 mb-3">Nutrition Facts</h2>
                <p className="text-xs text-gray-400 mb-3">Per 100g / 100ml</p>
                <div className="overflow-x-auto">
                  <NutritionTable nutriments={product.nutriments} />
                </div>
              </section>

              {/* Additional info */}
              {(product.quantity || product.packaging || product.countries) && (
                <section>
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Product Info</h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {product.quantity && (
                      <div>
                        <dt className="text-gray-500">Quantity</dt>
                        <dd className="text-gray-900 font-medium">{product.quantity}</dd>
                      </div>
                    )}
                    {product.packaging && (
                      <div>
                        <dt className="text-gray-500">Packaging</dt>
                        <dd className="text-gray-900 font-medium">{product.packaging}</dd>
                      </div>
                    )}
                    {product.countries && (
                      <div>
                        <dt className="text-gray-500">Countries</dt>
                        <dd className="text-gray-900 font-medium">{product.countries}</dd>
                      </div>
                    )}
                    {product.stores && (
                      <div>
                        <dt className="text-gray-500">Stores</dt>
                        <dd className="text-gray-900 font-medium">{product.stores}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
