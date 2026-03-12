/**
 * INTERMEDIATE: NotificationContext
 * Demonstrates: side-effects triggered from context (auto-dismiss timers),
 *               cleanup in useEffect, imperative API surface
 */
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { notificationReducer, initialNotificationState } from "../reducers/notificationReducer";
import type { Notification, NotificationType } from "../types";

interface NotificationContextValue {
  notifications: Notification[];
  notify: (type: NotificationType, title: string, message: string, duration?: number) => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialNotificationState);

  // Auto-dismiss: watch for new notifications with a duration
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    state.notifications.forEach((n) => {
      if (n.duration && n.duration > 0) {
        const elapsed = Date.now() - n.createdAt;
        const remaining = n.duration - elapsed;
        if (remaining > 0) {
          const t = setTimeout(() => {
            dispatch({ type: "REMOVE_NOTIFICATION", payload: n.id });
          }, remaining);
          timers.push(t);
        }
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [state.notifications]);

  const notify = useCallback(
    (type: NotificationType, title: string, message: string, duration = 4000) => {
      dispatch({ type: "ADD_NOTIFICATION", payload: { type, title, message, duration } });
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "CLEAR_ALL" });
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications: state.notifications, notify, dismiss, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be inside <NotificationProvider>");
  return ctx;
}
