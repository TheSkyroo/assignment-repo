import PropTypes from "prop-types";
import { formatNumber } from "../utils/helpers";

const FIELDS = [
  { key: "energy-kcal_100g", label: "Energy", unit: "kcal" },
  { key: "fat_100g", label: "Fat", unit: "g" },
  { key: "saturated-fat_100g", label: "Saturated Fat", unit: "g" },
  { key: "carbohydrates_100g", label: "Carbohydrates", unit: "g" },
  { key: "sugars_100g", label: "Sugars", unit: "g" },
  { key: "fiber_100g", label: "Fiber", unit: "g" },
  { key: "proteins_100g", label: "Proteins", unit: "g" },
  { key: "salt_100g", label: "Salt", unit: "g" },
];

export default function NutritionTable({ nutriments }) {
  if (!nutriments) {
    return <p className="text-gray-500 text-sm">Nutrition data not available.</p>;
  }

  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">Nutrient</th>
          <th className="text-right py-2 px-3 font-semibold text-gray-700 border border-gray-200">Per 100g</th>
        </tr>
      </thead>
      <tbody>
        {FIELDS.map(({ key, label, unit }) => (
          <tr key={key} className="even:bg-gray-50 hover:bg-green-50 transition-colors">
            <td className="py-2 px-3 text-gray-700 border border-gray-200">{label}</td>
            <td className="py-2 px-3 text-right text-gray-900 font-medium border border-gray-200">
              {nutriments[key] != null ? `${formatNumber(nutriments[key])} ${unit}` : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

NutritionTable.propTypes = {
  nutriments: PropTypes.object,
};
