import { categoryById } from "../lib/categories.js";
import { formatDay, formatMoney } from "../lib/format.js";

// Groups expenses by day, newest first, with a total for each day.
export default function ExpenseList({ expenses, editingId, onEdit, onDelete }) {
  const days = {};
  for (const e of expenses) (days[e.date] ??= []).push(e);
  const dates = Object.keys(days).sort().reverse();

  return (
    <div className="space-y-6">
      {dates.map((date) => {
        const items = days[date];
        const dayTotal = items.reduce((sum, e) => sum + e.amount, 0);
        return (
          <section key={date} aria-label={formatDay(date)}>
            <div className="flex items-baseline justify-between border-b border-line pb-2 text-sm">
              <h3 className="font-bold">{formatDay(date)}</h3>
              <span className="money text-muted">{formatMoney(dayTotal)}</span>
            </div>
            <ul>
              {items.map((e) => {
                const cat = categoryById[e.category] ?? categoryById.other;
                return (
                  <li key={e.id} className={`flex items-center gap-3 border-b border-line/60 py-3 ${editingId === e.id ? "bg-primary/10" : ""}`}>
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: cat.color }} aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{e.description}</p>
                      <p className="text-sm text-muted">{cat.label}</p>
                    </div>
                    <span className="money font-medium">{formatMoney(e.amount)}</span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => onEdit(e)} className="rounded-md px-2 py-1 text-sm text-muted hover:bg-line/60 hover:text-ink"
                        aria-label={`Edit ${e.description}`}>Edit</button>
                      <button type="button" onClick={() => onDelete(e)} className="rounded-md px-2 py-1 text-sm text-muted hover:bg-over/10 hover:text-over"
                        aria-label={`Delete ${e.description}`}>Delete</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
