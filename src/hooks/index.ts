/**
 * Custom hooks that compose multiple contexts or add extra logic
 * Re-exported here for clean import paths
 */

// Re-export all context hooks from one entry point
export { useTheme } from "../context/ThemeContext";
export { useAuth, useAuthState, useAuthDispatch } from "../context/AuthContext";
export { useCart } from "../context/CartContext";
export { useNotifications } from "../context/NotificationContext";
export { useTaskContext } from "../context/TaskContext";
