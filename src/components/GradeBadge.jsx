import PropTypes from "prop-types";
import { getGradeColor } from "../utils/helpers";

export default function GradeBadge({ grade, size = "sm" }) {
  const { bg, text, label } = getGradeColor(grade);
  const sizeClass = size === "lg" ? "w-12 h-12 text-xl font-bold" : "w-7 h-7 text-xs font-bold";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${bg} ${text} ${sizeClass}`}
      title={`Nutrition grade: ${label}`}
    >
      {label}
    </span>
  );
}

GradeBadge.propTypes = {
  grade: PropTypes.string,
  size: PropTypes.oneOf(["sm", "lg"]),
};
