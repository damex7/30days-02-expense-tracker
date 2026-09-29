import { useEffect, useState } from "react";

// Works like useState, but the value is saved in the browser and survives a refresh.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue; // storage blocked or data corrupted: start fresh
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or blocked: the app keeps working, it just won't persist
    }
  }, [key, value]);

  return [value, setValue];
}
