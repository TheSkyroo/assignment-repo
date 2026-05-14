import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import GradeBadge from "./GradeBadge";
import { getProductImage, getProductName, getProductCategory, getBarcode, truncate } from "../utils/helpers";
import { useCart } from "../hooks/useCart";

const PLACEHOLDER = "https://via.placeholder.com/300x200?text=No+Image";

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const barcode = getBarcode(product);
  const name = getProductName(product);
  const category = getProductCategory(product);
  const image = getProductImage(product) || PLACEHOLDER;
  const grade = product?.nutrition_grades || product?.nutrition_grade_fr || null;
  const ingredients = truncate(product?.ingredients_text || "", 80);
  const inCart = isInCart(barcode);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <Link to={barcode ? `/product/${barcode}` : "#"} className="block">
        <div className="relative h-48 bg-gray-50 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={barcode ? `/product/${barcode}` : "#"} className="hover:text-green-700 transition-colors">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">{name}</h3>
        </Link>
        {category && (
          <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full self-start mb-2 truncate max-w-full">
            {category}
          </span>
        )}
        {ingredients && (
          <p className="text-xs text-gray-500 mb-3 flex-1">{ingredients}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <GradeBadge grade={grade} />
          <button
            onClick={() => addToCart({ ...product, code: barcode })}
            disabled={inCart}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              inCart
                ? "bg-gray-100 text-gray-400 cursor-default"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {inCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
