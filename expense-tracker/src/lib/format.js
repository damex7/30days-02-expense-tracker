// Change CURRENCY and LOCALE to use a different currency, e.g. "USD" and "en-US".
const CURRENCY = "NGN";
const LOCALE = "en-NG";

const money = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0, // ₦5,000 rather than ₦5,000.00
  maximumFractionDigits: 2,
});

export const formatMoney = (amount) => money.format(amount);

// Dates are stored as "YYYY-MM-DD" strings, which sort correctly as text.
export function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export const monthOf = (isoDate) => isoDate.slice(0, 7); // "2026-09-28" -> "2026-09"

export function shiftMonth(month, delta) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonth(month) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function formatDay(isoDate) {
  const today = todayISO();
  if (isoDate === today) return "Today";
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}
