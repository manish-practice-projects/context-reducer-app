import { ThemeToggle } from "../basic/ThemeToggle";
import { CartBadge } from "../intermediate/CartComponents";
import { useAuth } from "../../hooks";

interface NavBarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: "basic", label: "① Basic", desc: "ThemeContext" },
  { id: "intermediate", label: "② Intermediate", desc: "Auth + Cart" },
  { id: "advanced", label: "③ Advanced", desc: "Tasks + Undo/Redo" },
];

export function NavBar({ activePage, onNavigate }: NavBarProps) {
  const { user, status } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚛</span>
        <div>
          <span className="brand-title">Context & useReducer</span>
          <span className="brand-sub">React State Management</span>
        </div>
      </div>

      <div className="navbar-tabs">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-tab ${activePage === item.id ? "active" : ""}`}
          >
            <span className="tab-label">{item.label}</span>
            <span className="tab-desc">{item.desc}</span>
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        {(status === "authenticated" && user) && (
          <img src={user.avatar} alt={user.name} className="nav-avatar" title={user.name} />
        )}
        <CartBadge />
        <ThemeToggle />
      </div>
    </nav>
  );
}
