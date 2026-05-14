import PropTypes from "prop-types";
import { useAppContext } from "../context/AppContext";
import { useCategories } from "../hooks/useCategories";

export default function CategoryFilter() {
  const { state, dispatch } = useAppContext();
  const { categories, loading, error, retry } = useCategories();

  const handleChange = (e) => {
    dispatch({ type: "SET_CATEGORY", payload: e.target.value });
  };

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <span>Categories failed to load.</span>
        <button onClick={retry} className="underline hover:no-underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={state.selectedCategory}
        onChange={handleChange}
        disabled={loading}
        className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white disabled:opacity-60 cursor-pointer"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id || cat.url} value={cat.id?.replace("en:", "") || cat.name}>
            {cat.name} ({cat.products?.toLocaleString() ?? "?"})
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        ▾
      </span>
    </div>
  );
}
