import { categoryById } from "../lib/categories.js";

export default function CategoryFilter({ available, value, onChange }) {
  const options = ["all", ...available];
  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
      {options.map((id) => {
        const active = value === id;
        return (
          <button
            key={id} type="button" aria-pressed={active} onClick={() => onChange(id)}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm ${
              active ? "border-ink bg-ink text-surface" : "border-line bg-surface hover:border-ink"
            }`}
          >
            {id !== "all" && <span className="h-2.5 w-2.5 rounded-full" style={{ background: categoryById[id]?.color }} aria-hidden="true" />}
            {id === "all" ? "All" : categoryById[id]?.label}
          </button>
        );
      })}
    </div>
  );
}
