import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useTheme } from "./hooks/useTheme.js";
import { expensesReducer } from "./state/expensesReducer.js";
import { makeSampleExpenses } from "./lib/sampleData.js";
import { formatMonth, monthOf, todayISO } from "./lib/format.js";
import { categoryById } from "./lib/categories.js";
import MonthSwitcher from "./components/MonthSwitcher.jsx";
import Summary from "./components/Summary.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import CategoryFilter from "./components/CategoryFilter.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import UndoBar from "./components/UndoBar.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import InfoButton from "./components/InfoButton.jsx";
import DataPanel from "./components/DataPanel.jsx";

export default function App() {
  // Saved in the browser
  const [expenses, setExpenses] = useLocalStorage("expense-tracker:expenses", []);
  const [budget, setBudget] = useLocalStorage("expense-tracker:budget", 0);

  const [theme, toggleTheme] = useTheme();

  // Only while the page is open
  const [month, setMonth] = useState(monthOf(todayISO()));
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [dataMessage, setDataMessage] = useState(null); // result of the last import

  // Run every change through the reducer, then save the result.
  const dispatch = (action) => setExpenses((current) => expensesReducer(current, action));

  // Derived data: calculated from state on each render, never stored separately.
  const monthExpenses = useMemo(() => expenses.filter((e) => monthOf(e.date) === month), [expenses, month]);
  const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = useMemo(() => {
    const totals = {};
    for (const e of monthExpenses) totals[e.category] = (totals[e.category] ?? 0) + e.amount;
    return totals;
  }, [monthExpenses]);
  const available = Object.keys(categoryById).filter((id) => byCategory[id]);
  const activeFilter = filter === "all" || byCategory[filter] ? filter : "all";
  const visible = activeFilter === "all" ? monthExpenses : monthExpenses.filter((e) => e.category === activeFilter);

  function handleSubmit(expense) {
    if (editing) {
      dispatch({ type: "updated", expense });
      setEditing(null);
    } else {
      dispatch({ type: "added", expense });
    }
    setMonth(monthOf(expense.date)); // show the month you just added to
  }

  function handleDelete(expense) {
    dispatch({ type: "deleted", id: expense.id });
    if (editing?.id === expense.id) setEditing(null);
    setLastDeleted(expense);
  }

  const closeUndo = useCallback(() => setLastDeleted(null), []);

  function handleImport({ expenses: incoming, budget: importedBudget }) {
    const existing = new Set(expenses.map((e) => e.id));
    const added = incoming.filter((e) => !existing.has(e.id)).length;
    dispatch({ type: "imported", expenses: incoming });
    if (importedBudget && !budget) setBudget(importedBudget); // don't overwrite a budget you've set
    if (added) {
      const newest = incoming.reduce((a, b) => (a.date > b.date ? a : b));
      setMonth(monthOf(newest.date)); // jump to the most recent imported month
    }
    return { added, duplicates: incoming.length - added };
  }

  function handleClearAll() {
    if (window.confirm("Delete all expenses and your budget? This can't be undone.")) {
      dispatch({ type: "replaced", expenses: [] });
      setBudget(0);
      setEditing(null);
      setDataMessage(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 py-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Expenses</h1>
        <div className="flex flex-wrap items-center gap-3">
          <MonthSwitcher month={month} onChange={setMonth} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[24rem_1fr] lg:gap-12">
        <aside className="space-y-8 lg:sticky lg:top-6">
          <Summary month={month} total={total} byCategory={byCategory} budget={budget} onBudgetChange={setBudget} />
          <ExpenseForm
            key={editing?.id ?? "new"} // a new key resets the form's state
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </aside>

        <main>
          {expenses.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-line p-8">
              <h2 className="text-xl font-bold">No expenses yet</h2>
              <p className="mt-2 max-w-md text-muted">
                Add your first one with the form. Everything is saved in this browser, so it will still be here next time.
              </p>
              <button type="button" onClick={() => dispatch({ type: "replaced", expenses: makeSampleExpenses() })}
                className="mt-5 rounded-lg border border-ink px-4 py-2 font-bold hover:bg-ink hover:text-surface">
                Load sample data
              </button>
              <DataPanel compact expenses={expenses} budget={budget} onImport={handleImport} message={dataMessage} setMessage={setDataMessage} />
            </div>
          ) : (
            <>
              {available.length > 0 && <CategoryFilter available={available} value={activeFilter} onChange={setFilter} />}
              <div className="mt-6">
                {visible.length ? (
                  <ExpenseList expenses={visible} editingId={editing?.id} onEdit={setEditing} onDelete={handleDelete} />
                ) : (
                  <p className="rounded-2xl border-2 border-dashed border-line p-8 text-muted">
                    Nothing spent in {formatMonth(month)}. Add an expense, or go back a month.
                  </p>
                )}
              </div>
              <DataPanel expenses={expenses} budget={budget} onImport={handleImport} onClearAll={handleClearAll} message={dataMessage} setMessage={setDataMessage} />
            </>
          )}
        </main>
      </div>

      <InfoButton />

      {lastDeleted && (
        <UndoBar
          key={lastDeleted.id}
          expense={lastDeleted}
          onUndo={() => { dispatch({ type: "restored", expense: lastDeleted }); setLastDeleted(null); }}
          onClose={closeUndo}
        />
      )}
    </div>
  );
}
