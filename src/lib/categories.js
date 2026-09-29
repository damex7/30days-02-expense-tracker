// Category colours for the Adire theme. They're mid-tones chosen to stay
// visible on both the light and dark backgrounds, and none of them is red,
// so they can't be confused with the over-budget warning.
export const categories = [
  { id: "food", label: "Food", color: "#f2a93b" },        // marigold
  { id: "transport", label: "Transport", color: "#3fa7d6" }, // sky
  { id: "bills", label: "Bills", color: "#6f7ff0" },       // light indigo
  { id: "shopping", label: "Shopping", color: "#e9679a" }, // hibiscus
  { id: "health", label: "Health", color: "#34b08a" },     // leaf
  { id: "fun", label: "Entertainment", color: "#a86ce0" }, // violet
  { id: "other", label: "Other", color: "#8a90ae" },       // slate
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
