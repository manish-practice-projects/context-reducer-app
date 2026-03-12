/**
 * INTERMEDIATE: authReducer
 * Demonstrates: pure reducer function, action union types, state transitions
 */
import type { AuthState, AuthAction } from "../types";

export const initialAuthState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, status: "loading", error: null };

    case "LOGIN_SUCCESS":
      return { user: action.payload, status: "authenticated", error: null };

    case "LOGIN_FAILURE":
      return { ...state, status: "error", error: action.payload };

    case "LOGOUT":
      return initialAuthState;

    case "UPDATE_PROFILE":
      if (!state.user) return state;
      return { ...state, user: { ...state.user, ...action.payload } };

    default:
      // Exhaustiveness check: TypeScript will warn if a case is missing
      return state;
  }
}
