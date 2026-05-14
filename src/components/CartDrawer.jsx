import PropTypes from "prop-types";
import { useCart } from "../hooks/useCart";
import { getProductImage, getProductName } from "../utils/helpers";

const PLACEHOLDER = "https://via.placeholder.com/64x64?text=?";

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateQty, totalItems } = useCart();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cart{" "}
            {totalItems > 0 && (
              <span className="text-sm font-normal text-gray-500">({totalItems} items)</span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-16">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-sm">Your cart is empty.</p>
            </div>
          ) : (
            cart.map(({ product, quantity }) => {
              const name = getProductName(product);
              const image = getProductImage(product) || PLACEHOLDER;
              return (
                <div key={product.code} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <img
                    src={image}
                    alt={name}
                    className="w-14 h-14 object-contain rounded-lg bg-white border border-gray-200 flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => updateQty(product.code, quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-bold transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQty(product.code, quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.code)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-lg"
                    title="Remove"
                  >
                    🗑
                  </button>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex justify-between text-sm font-semibold text-gray-900 mb-3">
              <span>Total items:</span>
              <span>{totalItems}</span>
            </div>
            <button className="w-full py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors">
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

CartDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
