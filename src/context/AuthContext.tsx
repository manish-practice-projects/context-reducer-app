/**
 * INTERMEDIATE: AuthContext + useReducer
 * Demonstrates: combining useReducer with context, async actions via dispatch wrappers,
 *               split context pattern (state vs dispatch) for performance
 */
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  Dispatch,
} from "react";
import { authReducer, initialAuthState } from "../reducers/authReducer";
import type { AuthState, AuthAction, User } from "../types";

// ─── Split contexts: state and dispatch are separated so components
//     that only dispatch don't re-render when state changes ─────────────────────
const AuthStateContext = createContext<AuthState | null>(null);
const AuthDispatchContext = createContext<Dispatch<AuthAction> | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

// ─── Low-level hooks ──────────────────────────────────────────────────────────
export function useAuthState(): AuthState {
  const ctx = useContext(AuthStateContext);
  if (!ctx) throw new Error("useAuthState must be inside <AuthProvider>");
  return ctx;
}

export function useAuthDispatch(): Dispatch<AuthAction> {
  const ctx = useContext(AuthDispatchContext);
  if (!ctx) throw new Error("useAuthDispatch must be inside <AuthProvider>");
  return ctx;
}

// ─── High-level hook: wraps dispatch with async business logic ────────────────
export function useAuth() {
  const state = useAuthState();
  const dispatch = useAuthDispatch();

  const login = useCallback(
    async (email: string, _password: string) => {
      dispatch({ type: "LOGIN_REQUEST" });
      try {
        // Simulated async API call
        await new Promise((r) => setTimeout(r, 1200));
        if (email === "fail@test.com") throw new Error("Invalid credentials");
        const user: User = {
          id: "usr_1",
          name: "Alex Johnson",
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          role: email.includes("admin") ? "admin" : "editor",
        };
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: (err as Error).message });
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => dispatch({ type: "LOGOUT" }), [dispatch]);

  const updateProfile = useCallback(
    (updates: Partial<User>) => dispatch({ type: "UPDATE_PROFILE", payload: updates }),
    [dispatch]
  );

  return { ...state, login, logout, updateProfile };
}
