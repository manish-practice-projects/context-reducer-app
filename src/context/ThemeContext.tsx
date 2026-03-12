/**
 * BASIC: ThemeContext
 * Demonstrates: createContext, useContext, simple state toggle, provider pattern
 */
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Theme } from "../types";

// ─── Shape of the context value ───────────────────────────────────────────────
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

// ─── 1. Create context with a meaningful default (or null + guard) ─────────────
const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── 2. Provider component ────────────────────────────────────────────────────
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

// ─── 3. Custom hook — always expose a hook, never raw useContext ───────────────
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export { ThemeContext };
