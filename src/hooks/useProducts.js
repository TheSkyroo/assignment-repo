import { useCallback, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { searchProductsByName, getProductsByCategory } from "../services/api";

const ERROR_MSG = "OpenFoodFacts server may be slow. Please retry in a moment.";

export function useProducts() {
  const { state, dispatch } = useAppContext();
  const stateRef = useRef(state);
  stateRef.current = state;

  const fetchProducts = useCallback(
    async (opts = {}) => {
      const { searchQuery, selectedCategory, page } = stateRef.current;
      const query = opts.query !== undefined ? opts.query : searchQuery;
      const category = opts.category !== undefined ? opts.category : selectedCategory;
      const pageNum = opts.page !== undefined ? opts.page : page;
      const append = opts.append ?? false;

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        let fetched = [];
        let hasMore = false;

        if (category) {
          const res = await getProductsByCategory(category);
          fetched = res.data?.products ?? [];
          hasMore = false;
        } else {
          const q = query || "food";
          const res = await searchProductsByName(q, pageNum);
          fetched = res.data?.products ?? [];
          const count = res.data?.count ?? 0;
          hasMore = pageNum * 24 < count;
        }

        if (append) {
          dispatch({ type: "APPEND_PRODUCTS", payload: fetched });
        } else {
          dispatch({ type: "SET_PRODUCTS", payload: fetched });
        }
        dispatch({ type: "SET_HAS_MORE", payload: hasMore });
      } catch (err) {
        const msg =
          err.code === "ECONNABORTED" || err.message?.includes("timeout")
            ? "OpenFoodFacts server is slow. Please wait a moment and try again."
            : ERROR_MSG;
        dispatch({ type: "SET_ERROR", payload: msg });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [dispatch]
  );

  const loadMore = useCallback(async () => {
    const { page } = stateRef.current;
    const nextPage = page + 1;
    dispatch({ type: "SET_PAGE", payload: nextPage });
    await fetchProducts({ page: nextPage, append: true });
  }, [fetchProducts, dispatch]);

  return { products: state.products, fetchProducts, loadMore };
}
