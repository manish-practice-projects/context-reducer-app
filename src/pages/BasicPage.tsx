/**
 * BasicPage — covers createContext, useContext, Provider, custom hook
 */
import { ThemeToggle } from "../components/basic/ThemeToggle";
import { useTheme } from "../hooks";

function ConceptCard({ title, code, desc }: { title: string; code: string; desc: string }) {
  return (
    <div className="concept-card">
      <h3 className="concept-title">{title}</h3>
      <pre className="concept-code"><code>{code}</code></pre>
      <p className="concept-desc">{desc}</p>
    </div>
  );
}

export function BasicPage() {
  const { theme, isDark } = useTheme();

  return (
    <div className="page">
      <div className="page-header">
        <span className="page-badge">BASIC</span>
        <h1 className="page-title">React Context API</h1>
        <p className="page-subtitle">
          createContext · Provider · useContext · custom hooks
        </p>
      </div>

      <div className="demo-section">
        <h2 className="section-title">Live Demo</h2>
        <div className="demo-box">
          <p>Current theme from context: <strong>{theme}</strong></p>
          <ThemeToggle />
          <p className="demo-note">
            {isDark
              ? "🌙 Dark theme applied — all components see the same value via context."
              : "☀️ Light theme active — toggle to propagate change through the tree."}
          </p>
        </div>
      </div>

      <div className="concepts-grid">
        <ConceptCard
          title="1. createContext"
          code={`const ThemeContext = createContext<ThemeContextValue | null>(null);`}
          desc="Creates the context object. Pass a default value (or null + guard in custom hook)."
        />
        <ConceptCard
          title="2. Provider"
          code={`<ThemeContext.Provider value={value}>\n  {children}\n</ThemeContext.Provider>`}
          desc="Wraps the subtree that needs access. All consumers below will receive the value."
        />
        <ConceptCard
          title="3. useContext"
          code={`const ctx = useContext(ThemeContext);\nif (!ctx) throw new Error('...');`}
          desc="Subscribes a component to the nearest Provider above. Re-renders when value changes."
        />
        <ConceptCard
          title="4. Custom Hook"
          code={`export function useTheme() {\n  const ctx = useContext(ThemeContext);\n  if (!ctx) throw new Error(...);\n  return ctx;\n}`}
          desc="Always wrap useContext in a custom hook. It enforces provider usage and hides implementation."
        />
      </div>
    </div>
  );
}
