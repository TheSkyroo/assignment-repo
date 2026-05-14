import { useAppContext } from "../context/AppContext";

export function useCart() {
  const { state, dispatch } = useAppContext();
  const { cart } = state;

  const addToCart = (product) => dispatch({ type: "CART_ADD", payload: product });
  const removeFromCart = (code) => dispatch({ type: "CART_REMOVE", payload: code });
  const updateQty = (code, quantity) => {
    if (quantity < 1) {
      dispatch({ type: "CART_REMOVE", payload: code });
    } else {
      dispatch({ type: "CART_UPDATE_QTY", payload: { code, quantity } });
    }
  };
  const clearCart = () => dispatch({ type: "CART_CLEAR" });

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const isInCart = (code) => cart.some((i) => i.product.code === code);

  return { cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, isInCart };
}
