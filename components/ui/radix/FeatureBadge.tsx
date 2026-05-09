export function FeatureBadge({
  label,
  color = "gray",
}: {
  label: string;
  color?: "green" | "blue" | "purple" | "gray";
}) {
  const colors = {
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`
        text-[10px]
        px-2 py-0.5
        rounded-full
        border
        font-medium
        whitespace-nowrap
        ${colors[color]}
      `}
    >
      {label}
    </span>
  );
}
