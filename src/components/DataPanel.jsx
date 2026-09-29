import { useRef } from "react";
import { exportBackup, exportCSV, parseBackup } from "../lib/backup.js";

// Privacy note plus backup, export, import and clear.
// `message` lives in App, so it survives when the empty state is replaced by the list.
export default function DataPanel({ expenses, budget, onImport, onClearAll, message, setMessage, compact = false }) {
  const fileInput = useRef(null); // lets a normal button open the hidden file picker

  async function handleFile(event) {
    const file = event.target.files[0];
    event.target.value = ""; // allows choosing the same file again later
    if (!file) return;
    try {
      const result = parseBackup(await file.text());
      const { added, duplicates } = onImport(result);
      const parts = [`Imported ${added} expense${added === 1 ? "" : "s"}`];
      if (duplicates) parts.push(`${duplicates} already here`);
      if (result.skipped) parts.push(`${result.skipped} couldn't be read`);
      setMessage({ type: "ok", text: parts.join(", ") + "." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  }

  const button = "rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-bold hover:border-ink";
  const hasData = expenses.length > 0;

  return (
    <section aria-labelledby="data-title" className={compact ? "mt-5" : "mt-12 rounded-2xl border border-line p-5"}>
      {!compact && (
        <>
          <h2 id="data-title" className="font-bold">Your data</h2>
          <p className="mt-1 max-w-prose text-sm text-muted">
            Your expenses are saved only in this browser, on this device. Nothing is sent to a server, so no one else
            can see them. Download a backup to keep them safe or move them to another device.
          </p>
        </>
      )}
      {compact && <h2 id="data-title" className="sr-only">Restore a backup</h2>}

      <div className={`${compact ? "" : "mt-4"} flex flex-wrap gap-2`}>
        {hasData && (
          <>
            <button type="button" className={button} onClick={() => exportBackup(expenses, budget)}>Download backup</button>
            <button type="button" className={button} onClick={() => exportCSV(expenses)}>Export to spreadsheet (CSV)</button>
          </>
        )}
        <button type="button" className={button} onClick={() => fileInput.current.click()}>
          {compact ? "Restore from a backup" : "Import backup"}
        </button>
        <input ref={fileInput} type="file" accept=".json,application/json" onChange={handleFile} className="hidden" />
        {hasData && !compact && (
          <button type="button" onClick={onClearAll} className="px-2 py-2 text-sm text-muted underline underline-offset-4 hover:text-over">
            Clear all data
          </button>
        )}
      </div>

      <p role="status" className={`mt-3 text-sm ${message?.type === "error" ? "text-over" : "text-primary"}`}>
        {message?.text}
      </p>
    </section>
  );
}
