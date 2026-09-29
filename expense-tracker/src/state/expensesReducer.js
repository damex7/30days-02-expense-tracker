// All the ways the list of expenses can change, in one place.
// Components describe *what happened* (dispatch({ type: "added", ... }))
// and this function decides *how the list changes*.
export function expensesReducer(expenses, action) {
  switch (action.type) {
    case "added":
      return [...expenses, { ...action.expense, id: crypto.randomUUID() }];
    case "updated":
      return expenses.map((e) => (e.id === action.expense.id ? action.expense : e));
    case "deleted":
      return expenses.filter((e) => e.id !== action.id);
    case "restored":
      return [...expenses, action.expense];
    case "replaced":
      return action.expenses;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
