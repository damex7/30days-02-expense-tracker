import { useEffect, useState } from "react";

const KEY = "expense-tracker:theme";
const systemPrefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

// "light" or "dark". Follows the device setting until you press the toggle,
// then remembers your choice.
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return systemPrefersDark() ? "dark" : "light";
  });

  // Put the theme on <html> so the CSS in index.css can switch the colours.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  }

  return [theme, toggle];
}
