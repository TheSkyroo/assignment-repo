import { createContext, useContext, useReducer, useEffect } from "react";
import PropTypes from "prop-types";

const AppContext = createContext(null);

const initialState = {
  searchQuery: "",
  barcodeQuery: "",
  selectedCategory: "",
  sortOption: "name-asc",
  products: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null,
  cart: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload, page: 1, products: [], hasMore: true, selectedCategory: "" };
    case "SET_BARCODE_QUERY":
      return { ...state, barcodeQuery: action.payload };
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload, page: 1, products: [], hasMore: true, searchQuery: "" };
    case "SET_SORT":
      return { ...state, sortOption: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "APPEND_PRODUCTS":
      return { ...state, products: [...state.products, ...action.payload] };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_HAS_MORE":
      return { ...state, hasMore: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CART_ADD": {
      const existing = state.cart.find((i) => i.product.code === action.payload.code);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.product.code === action.payload.code ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, { product: action.payload, quantity: 1 }] };
    }
    case "CART_REMOVE":
      return { ...state, cart: state.cart.filter((i) => i.product.code !== action.payload) };
    case "CART_UPDATE_QTY":
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.product.code === action.payload.code ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    case "CART_CLEAR":
      return { ...state, cart: [] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const saved = (() => {
    try {
      const raw = localStorage.getItem("food-cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const [state, dispatch] = useReducer(reducer, { ...initialState, cart: saved });

  useEffect(() => {
    try {
      localStorage.setItem("food-cart", JSON.stringify(state.cart));
    } catch {
      // ignore storage errors
    }
  }, [state.cart]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
