import { useState } from "react";
import { categories } from "../lib/categories.js";
import { todayISO } from "../lib/format.js";

const empty = { description: "", amount: "", category: "food", date: todayISO() };

// A controlled form: every input's value lives in React state.
// Used for both adding and editing; `initial` is the expense being edited.
export default function ExpenseForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial ? { ...initial, amount: String(initial.amount) } : empty);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault(); // stop the browser reloading the page
    const next = {};
    if (!values.description.trim()) next.description = "Enter what you spent on.";
    if (!(Number(values.amount) > 0)) next.amount = "Enter an amount greater than 0.";
    if (!values.date) next.date = "Choose a date.";
    setErrors(next);
    if (Object.keys(next).length) return;

    onSubmit({ ...values, description: values.description.trim(), amount: Number(values.amount) });
    if (!initial) setValues({ ...empty, category: values.category, date: values.date }); // ready for the next one
  }

  const field = "mt-1 w-full rounded-lg border bg-surface px-3 py-2.5";
  const border = (name) => (errors[name] ? "border-over" : "border-line");

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-line bg-surface p-5" aria-labelledby="form-title">
      <h2 id="form-title" className="text-lg font-bold">{initial ? "Edit expense" : "Add an expense"}</h2>

      <div className="mt-4 space-y-4">
        <label className="block text-sm">
          What for
          <input
            value={values.description} onChange={update("description")} placeholder="e.g. Groceries"
            aria-invalid={!!errors.description} aria-describedby="err-description"
            className={`${field} ${border("description")}`}
          />
          {errors.description && <span id="err-description" className="mt-1 block text-over">{errors.description}</span>}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            Amount (₦)
            <input
              type="number" min="0" step="any" inputMode="decimal" value={values.amount} onChange={update("amount")}
              aria-invalid={!!errors.amount} aria-describedby="err-amount"
              className={`money ${field} ${border("amount")}`}
            />
            {errors.amount && <span id="err-amount" className="mt-1 block text-over">{errors.amount}</span>}
          </label>
          <label className="block text-sm">
            Date
            <input
              type="date" value={values.date} max={todayISO()} onChange={update("date")}
              aria-invalid={!!errors.date}
              className={`${field} ${border("date")}`}
            />
            {errors.date && <span className="mt-1 block text-over">{errors.date}</span>}
          </label>
        </div>

        <label className="block text-sm">
          Category
          <select value={values.category} onChange={update("category")} className={`${field} border-line`}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex gap-2">
        <button className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-bold text-on-primary hover:bg-ink hover:text-surface">
          {initial ? "Save changes" : "Add expense"}
        </button>
        {initial && (
          <button type="button" onClick={onCancel} className="rounded-lg border border-line px-4 py-2.5 font-bold">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
