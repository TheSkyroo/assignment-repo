import { useAppContext } from "../context/AppContext";
import { useCategories } from "../hooks/useCategories";

export default function CategoryFilter() {
  const { state, dispatch } = useAppContext();
  const { categories, loading } = useCategories();

  const handleChange = (e) => {
    dispatch({ type: "SET_CATEGORY", payload: e.target.value });
  };

  return (
    <div className="relative">
      <select
        value={state.selectedCategory}
        onChange={handleChange}
        className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer"
      >
        <option value="">All Categories{loading ? " (loading…)" : ""}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        ▾
      </span>
    </div>
  );
}
