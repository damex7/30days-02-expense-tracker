import { formatMonth, shiftMonth, todayISO, monthOf } from "../lib/format.js";

export default function MonthSwitcher({ month, onChange }) {
  const current = monthOf(todayISO());
  const btn = "grid h-9 w-9 place-items-center rounded-full border border-line text-lg hover:border-ink";

  return (
    <div className="flex items-center gap-2">
      <button type="button" className={btn} onClick={() => onChange(shiftMonth(month, -1))} aria-label="Previous month">
        ‹
      </button>
      <p className="min-w-40 text-center font-bold" aria-live="polite">{formatMonth(month)}</p>
      <button
        type="button"
        className={`${btn} disabled:opacity-30`}
        onClick={() => onChange(shiftMonth(month, 1))}
        disabled={month >= current}
        aria-label="Next month"
      >
        ›
      </button>
      {month !== current && (
        <button type="button" onClick={() => onChange(current)} className="ml-1 text-sm font-bold text-primary underline underline-offset-4">
          This month
        </button>
      )}
    </div>
  );
}
