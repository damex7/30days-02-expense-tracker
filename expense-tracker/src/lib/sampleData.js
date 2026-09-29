import { todayISO } from "./format.js";

// Demo expenses spread over the current month, so the app has something to show.
export function makeSampleExpenses() {
  const today = todayISO();
  const [y, m, d] = today.split("-").map(Number);
  const day = (n) => `${y}-${String(m).padStart(2, "0")}-${String(Math.max(1, Math.min(n, d))).padStart(2, "0")}`;
  const items = [
    ["Groceries at the market", 18500, "food", 1],
    ["Electricity token", 15000, "bills", 2],
    ["Bolt to work", 4200, "transport", 3],
    ["Data subscription", 8000, "bills", 5],
    ["Lunch with team", 6500, "food", 8],
    ["Pharmacy", 5200, "health", 10],
    ["Cinema tickets", 7000, "fun", 13],
    ["New shoes", 24000, "shopping", 15],
    ["Fuel", 12000, "transport", d - 1],
    ["Suya", 3000, "food", d],
  ];
  return items.map(([description, amount, category, n]) => ({
    id: crypto.randomUUID(),
    description,
    amount,
    category,
    date: day(n),
  }));
}
