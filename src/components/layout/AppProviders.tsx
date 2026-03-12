/**
 * AppProviders — composes all context providers
 * Demonstrates: provider nesting order (outermost = least dependent)
 */
import { ReactNode } from "react";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { NotificationProvider } from "../context/NotificationContext";
import { TaskProvider } from "../context/TaskContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    // Order: theme → auth → notifications → cart → task
    // (dependencies flow inward; inner providers can use outer context hooks)
    <ThemeProvider defaultTheme="dark">
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <TaskProvider>
              {children}
            </TaskProvider>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
