import { useCallback, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { searchProductsByName, getProductsByCategory } from "../services/api";

export function useProducts() {
  const { state, dispatch } = useAppContext();
  const stateRef = useRef(state);
  stateRef.current = state;

  // Always holds the AbortController for the currently in-flight request.
  const abortRef = useRef(null);

  const fetchProducts = useCallback(
    async (opts = {}) => {
      // Cancel any previous in-flight request immediately.
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const { searchQuery, selectedCategory, page } = stateRef.current;
      const query    = opts.query    !== undefined ? opts.query    : searchQuery;
      const category = opts.category !== undefined ? opts.category : selectedCategory;
      const pageNum  = opts.page     !== undefined ? opts.page     : page;
      const append   = opts.append   ?? false;

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR",   payload: null });

      try {
        const res = category
          ? await getProductsByCategory(category, pageNum, controller.signal)
          : await searchProductsByName(query || "chocolate", pageNum, controller.signal);

        // If this request was superseded, bail silently — don't touch state.
        if (controller.signal.aborted) return;

        const fetched = res.data?.products ?? [];
        const count   = res.data?.count    ?? 0;

        dispatch({ type: append ? "APPEND_PRODUCTS" : "SET_PRODUCTS", payload: fetched });
        dispatch({ type: "SET_HAS_MORE", payload: pageNum * 24 < count });
      } catch (err) {
        // Aborted requests are not errors — ignore them completely.
        if (err.name === "CanceledError" || err.name === "AbortError" || controller.signal.aborted) return;

        const msg =
          err.code === "ECONNABORTED" || err.message?.includes("timeout")
            ? "OpenFoodFacts server is slow. Please wait a moment and try again."
            : "OpenFoodFacts server may be slow. Please retry in a moment.";
        dispatch({ type: "SET_ERROR", payload: msg });
      } finally {
        // Only clear the loading flag if we're still the active request.
        if (!controller.signal.aborted) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
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
