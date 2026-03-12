/**
 * INTERMEDIATE: LoginForm
 * Consumes AuthContext — shows async dispatch, loading/error states
 */
import { useState, FormEvent } from "react";
import { useAuth } from "../../hooks";

export function LoginForm() {
  const { login, status, error } = useAuth();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Sign In</h2>
      <p className="auth-hint">Try: <code>fail@test.com</code> to trigger error state</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === "loading"}
          />
        </div>

        {error && (
          <div className="auth-error" role="alert">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-primary"
        >
          {status === "loading" ? (
            <span className="spinner-inline">Signing in…</span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
