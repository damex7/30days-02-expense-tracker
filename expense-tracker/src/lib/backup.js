import { categoryById } from "./categories.js";
import { todayISO } from "./format.js";

// Starts a download of `text` as a file, without any server.
function download(filename, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// A full backup: everything needed to restore the app on another device.
export function exportBackup(expenses, budget) {
  const data = { app: "expense-tracker", version: 1, exportedAt: new Date().toISOString(), budget, expenses };
  download(`expenses-backup-${todayISO()}.json`, JSON.stringify(data, null, 2), "application/json");
}

// A spreadsheet-friendly copy for Excel or Google Sheets (not re-importable).
export function exportCSV(expenses) {
  const cell = (value) => `"${String(value).replace(/"/g, '""')}"`; // quote every cell safely
  const rows = [...expenses]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => [e.date, cell(e.description), cell(categoryById[e.category]?.label ?? e.category), e.amount].join(","));
  download(`expenses-${todayISO()}.csv`, ["Date,Description,Category,Amount", ...rows].join("\n"), "text/csv");
}

// Reads a backup file's text and returns clean data, or throws a friendly error.
// Never trust a file's contents: check every field before it touches the app.
export function parseBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("That file isn't a valid backup. Choose the .json file you downloaded.");
  }

  const list = Array.isArray(data) ? data : data?.expenses;
  if (!Array.isArray(list)) throw new Error("No expenses were found in that file.");

  const expenses = list
    .filter(
      (e) =>
        e &&
        typeof e.description === "string" && e.description.trim() &&
        Number(e.amount) > 0 &&
        /^\d{4}-\d{2}-\d{2}$/.test(e.date)
    )
    .map((e) => ({
      id: typeof e.id === "string" && e.id ? e.id : crypto.randomUUID(),
      description: e.description.trim().slice(0, 200),
      amount: Number(e.amount),
      category: categoryById[e.category] ? e.category : "other",
      date: e.date,
    }));

  if (!expenses.length) throw new Error("None of the expenses in that file could be read.");

  const budget = Number(data?.budget) > 0 ? Number(data.budget) : null;
  return { expenses, budget, skipped: list.length - expenses.length };
}
