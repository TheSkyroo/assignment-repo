import { useAppContext } from "../context/AppContext";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "grade-asc", label: "Nutrition Grade: Best first" },
  { value: "grade-desc", label: "Nutrition Grade: Worst first" },
];

export default function SortDropdown() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="relative">
      <select
        value={state.sortOption}
        onChange={(e) => dispatch({ type: "SET_SORT", payload: e.target.value })}
        className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        ▾
      </span>
    </div>
  );
}
