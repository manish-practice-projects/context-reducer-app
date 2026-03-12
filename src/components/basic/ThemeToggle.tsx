/**
 * BASIC: ThemeToggle component
 * Consumes ThemeContext — simplest context consumer example
 */
import { useTheme } from "../../hooks";

export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${isDark ? "dark" : "light"}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="toggle-icon">{isDark ? "☀️" : "🌙"}</span>
      <span className="toggle-label">{isDark ? "Light" : "Dark"} Mode</span>
    </button>
  );
}
