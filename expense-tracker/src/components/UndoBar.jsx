import { useEffect } from "react";

// Appears after a delete and disappears on its own after 6 seconds.
export default function UndoBar({ expense, onUndo, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer); // clean-up: cancel the timer if the bar closes early
  }, [expense, onClose]);

  return (
    <div role="status" className="rise fixed inset-x-4 bottom-20 sm:bottom-4 z-50 mx-auto flex max-w-md items-center justify-between gap-4 rounded-xl bg-ink px-5 py-3 text-surface shadow-lg">
      <p className="truncate">Deleted “{expense.description}”</p>
      <button type="button" onClick={onUndo} className="shrink-0 font-bold text-accent underline underline-offset-4">
        Undo
      </button>
    </div>
  );
}
