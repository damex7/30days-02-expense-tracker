import { useRef } from "react";

const PORTFOLIO_URL = "https://abrahmanabubakar.vercel.app/";

// A round "i" button fixed in the corner that opens an "About this app" panel.
// It uses the browser's built-in <dialog>, which gives us for free:
// Esc to close, focus kept inside while open, and the page behind made inert.
export default function InfoButton() {
  const dialog = useRef(null);

  const open = () => dialog.current.showModal();
  const close = () => dialog.current.close();

  // Clicking the dark area outside the panel closes it.
  const closeOnBackdrop = (e) => {
    if (e.target === dialog.current) close();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="About this app"
        title="About this app"
        className="fixed bottom-4 right-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-primary font-serif text-lg font-bold italic text-on-primary shadow-lg hover:bg-ink hover:text-surface"
      >
        i
      </button>

      <dialog
        ref={dialog}
        onClick={closeOnBackdrop}
        aria-labelledby="about-title"
        className="m-auto w-[min(34rem,calc(100%-2rem))] rounded-2xl border border-line bg-surface p-0 text-ink"
      >
        <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <h2 id="about-title" className="text-xl font-extrabold tracking-tight">About this app</h2>
            <button type="button" onClick={close} aria-label="Close" className="-mr-2 -mt-1 rounded-full px-2 text-2xl leading-none text-muted hover:text-ink">
              ×
            </button>
          </div>

          <p className="mt-3 text-muted">
            A simple expense tracker for seeing where your money goes each month, and whether you're staying within your budget.
          </p>

          <h3 className="mt-6 font-bold">How to use it</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5">
            <li>Add an expense with the form: what it was for, the amount, the date and a category.</li>
            <li>Set a monthly budget. The strip fills up by category and turns red if you go over.</li>
            <li>Use the arrows at the top to look back at past months, and the category buttons to filter the list.</li>
            <li>Edit or delete any expense. Deleted one by mistake? Press Undo straight away.</li>
            <li>Switch between light and dark mode with the moon or sun button.</li>
          </ol>

          <h3 className="mt-6 font-bold">Your privacy</h3>
          <p className="mt-2">
            Everything you enter is saved only in this browser, on this device. Nothing is sent to a server, so no one else can see it,
            including me. Clearing your browser's data will delete it.
          </p>

          <p className="mt-6 border-t border-line pt-4 text-sm text-muted">
            Built by{" "}
            <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className="font-bold text-primary underline underline-offset-4">
              Abdrahman Abubakar
            </a>{" "}
            as Day 2 of a 30-day development challenge.
          </p>
        </div>
      </dialog>
    </>
  );
}
