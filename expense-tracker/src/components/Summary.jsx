import { useState } from "react";
import { categoryById } from "../lib/categories.js";
import { formatMoney, formatMonth } from "../lib/format.js";

// The month's total, the budget strip, and a breakdown by category.
export default function Summary({ month, total, byCategory, budget, onBudgetChange }) {
  const [editingBudget, setEditingBudget] = useState(false);
  const [draft, setDraft] = useState(budget ? String(budget) : "");

  const over = budget > 0 && total > budget;
  const scale = Math.max(budget, total) || 1; // the strip's full width in Naira
  const rows = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  function saveBudget(e) {
    e.preventDefault();
    const value = Number(draft);
    onBudgetChange(value > 0 ? value : 0);
    setEditingBudget(false);
  }

  return (
    <section aria-labelledby="summary-title">
      <h2 id="summary-title" className="text-muted">Spent in {formatMonth(month)}</h2>
      <p className={`money mt-1 text-4xl font-semibold tracking-tight sm:text-5xl ${over ? "text-over" : ""}`}>
        {formatMoney(total)}
      </p>

      {budget > 0 && (
        <p className="mt-2 text-muted">
          of {formatMoney(budget)} budget,{" "}
          <span className={`font-bold ${over ? "text-over" : "text-green"}`}>
            {over ? `${formatMoney(total - budget)} over` : `${formatMoney(budget - total)} left`}
          </span>
        </p>
      )}

      {/* Budget strip: each category is a segment; the line marks the budget. */}
      <div className="relative mt-5">
        <div className="flex h-5 overflow-hidden rounded-full bg-line/70" role="img"
          aria-label={budget ? `${Math.round((total / budget) * 100)}% of budget used` : "Spending by category"}>
          {rows.map(([id, amount]) => (
            <div key={id} style={{ width: `${(amount / scale) * 100}%`, background: categoryById[id]?.color }} />
          ))}
        </div>
        {budget > 0 && over && (
          <div className="absolute -top-1 h-7 w-0.5 bg-ink" style={{ left: `${(budget / scale) * 100}%` }} aria-hidden="true" />
        )}
      </div>

      {editingBudget ? (
        <form onSubmit={saveBudget} className="mt-4 flex items-end gap-2">
          <label className="flex-1 text-sm">
            <span className="text-muted">Monthly budget</span>
            <input
              type="number" min="0" step="any" inputMode="decimal" autoFocus
              value={draft} onChange={(e) => setDraft(e.target.value)}
              className="money mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2"
            />
          </label>
          <button className="rounded-lg bg-green px-4 py-2 font-bold text-surface">Save</button>
          <button type="button" onClick={() => setEditingBudget(false)} className="px-2 py-2 text-sm text-muted">Cancel</button>
        </form>
      ) : (
        <button type="button" onClick={() => { setDraft(budget ? String(budget) : ""); setEditingBudget(true); }} className="mt-3 text-sm font-bold text-green underline underline-offset-4">
          {budget > 0 ? "Change budget" : "Set a monthly budget"}
        </button>
      )}

      {rows.length > 0 && (
        <ul className="mt-6 space-y-2">
          {rows.map(([id, amount]) => (
            <li key={id} className="flex items-center gap-3 text-sm">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: categoryById[id]?.color }} aria-hidden="true" />
              <span className="flex-1">{categoryById[id]?.label ?? id}</span>
              <span className="money">{formatMoney(amount)}</span>
              <span className="money w-10 text-right text-muted">{Math.round((amount / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
