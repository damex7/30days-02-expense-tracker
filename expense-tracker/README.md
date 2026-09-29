# Expense Tracker (Day 2 of 30)

Track spending by month and category, with a monthly budget. Built with React, Vite and Tailwind CSS.
Data is saved in the browser with localStorage, so there's no account or backend.

## Features
- Add, edit and delete expenses (with undo)
- Categories, dates and a total per day
- Month switcher and category filter
- Monthly budget strip that fills by category and turns red when you go over
- Data saved in the browser; "Load sample data" for a quick demo

## Run it
    npm install
    npm run dev

## Where each concept lives
| Concept | File |
| --- | --- |
| Controlled form + validation | src/components/ExpenseForm.jsx |
| useReducer-style state changes | src/state/expensesReducer.js, used in src/App.jsx |
| Custom hook + localStorage | src/hooks/useLocalStorage.js |
| Derived data with useMemo | src/App.jsx (totals, byCategory, filtering) |
| Resetting a form with `key` | src/App.jsx (`<ExpenseForm key=...>`) |
| Effect clean-up (timer) | src/components/UndoBar.jsx |
| Currency formatting (Intl) | src/lib/format.js |

To use another currency, change CURRENCY and LOCALE in src/lib/format.js.
