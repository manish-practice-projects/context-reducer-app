/**
 * ADVANCED: useLocalStorage
 * Demonstrates: generic custom hook, useReducer for complex init, storage events
 */
import { useReducer, useCallback, useEffect } from "react";

type LocalStorageAction<T> =
  | { type: "SET"; payload: T }
  | { type: "REMOVE" };

function localStorageReducer<T>(
  _state: T | null,
  action: LocalStorageAction<T>
): T | null {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "REMOVE":
      return null;
    default:
      return _state;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  const init = (): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [state, dispatch] = useReducer(localStorageReducer<T>, null, init);

  const setValue = useCallback(
    (value: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        dispatch({ type: "SET", payload: value });
      } catch {
        /* storage quota exceeded */
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    localStorage.removeItem(key);
    dispatch({ type: "REMOVE" });
  }, [key]);

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          dispatch({ type: "SET", payload: JSON.parse(e.newValue) as T });
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return [state ?? initialValue, setValue, removeValue];
}
