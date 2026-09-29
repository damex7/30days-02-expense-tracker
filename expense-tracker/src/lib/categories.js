// Each category has a colour used in the budget strip and next to each expense.
export const categories = [
  { id: "food", label: "Food", color: "#0e7c4a" },
  { id: "transport", label: "Transport", color: "#2f6fce" },
  { id: "bills", label: "Bills", color: "#7a4fc9" },
  { id: "shopping", label: "Shopping", color: "#e0932b" },
  { id: "health", label: "Health", color: "#d6452f" },
  { id: "fun", label: "Entertainment", color: "#c94f9a" },
  { id: "other", label: "Other", color: "#6b7a71" },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
