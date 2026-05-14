export const GRADE_COLORS = {
  a: { bg: "bg-green-500", text: "text-white", label: "A" },
  b: { bg: "bg-lime-500", text: "text-white", label: "B" },
  c: { bg: "bg-yellow-400", text: "text-gray-900", label: "C" },
  d: { bg: "bg-orange-500", text: "text-white", label: "D" },
  e: { bg: "bg-red-500", text: "text-white", label: "E" },
};

export function getGradeColor(grade) {
  if (!grade) return { bg: "bg-gray-300", text: "text-gray-700", label: "?" };
  return GRADE_COLORS[grade.toLowerCase()] || { bg: "bg-gray-300", text: "text-gray-700", label: grade.toUpperCase() };
}

export function truncate(str, maxLen = 80) {
  if (!str) return "";
  return str.length > maxLen ? str.slice(0, maxLen) + "…" : str;
}

export function formatNumber(val, decimals = 1) {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return n.toFixed(decimals);
}

export function getProductImage(product) {
  return (
    product?.image_url ||
    product?.image_front_url ||
    product?.image_small_url ||
    null
  );
}

export function getProductName(product) {
  return product?.product_name || product?.product_name_en || "Unknown Product";
}

export function getProductCategory(product) {
  const cats = product?.categories || product?.categories_tags?.[0] || "";
  if (!cats) return "Uncategorized";
  const parts = cats.split(",");
  const first = parts[0].trim().replace(/^en:/, "");
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export function getBarcode(product) {
  return product?.code || product?.id || "";
}
