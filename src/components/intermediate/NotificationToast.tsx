/**
 * INTERMEDIATE: NotificationToast + trigger button
 * Demonstrates: reading + writing to context, animated list
 */
import { useNotifications } from "../../hooks";
import type { NotificationType } from "../../types";

// ─── Toast list (rendered at app root level) ──────────────────────────────────
export function NotificationToastList() {
  const { notifications, dismiss } = useNotifications();

  return (
    <div className="toast-list" role="region" aria-label="Notifications">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`toast toast-${n.type}`}
          role="alert"
        >
          <div className="toast-body">
            <strong className="toast-title">{n.title}</strong>
            <p className="toast-message">{n.message}</p>
          </div>
          <button
            className="toast-close"
            onClick={() => dismiss(n.id)}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Demo trigger panel ───────────────────────────────────────────────────────
const DEMO_NOTIFICATIONS: Array<{
  type: NotificationType;
  title: string;
  message: string;
}> = [
  { type: "success", title: "Saved!", message: "Your changes have been saved." },
  { type: "error", title: "Error", message: "Something went wrong. Please try again." },
  { type: "warning", title: "Warning", message: "You have unsaved changes." },
  { type: "info", title: "Info", message: "A new update is available." },
];

export function NotificationTriggers() {
  const { notify, clearAll, notifications } = useNotifications();

  return (
    <div className="notif-panel">
      <div className="notif-buttons">
        {DEMO_NOTIFICATIONS.map((n) => (
          <button
            key={n.type}
            onClick={() => notify(n.type, n.title, n.message)}
            className={`btn btn-notif btn-notif-${n.type}`}
          >
            {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
          </button>
        ))}
      </div>
      {notifications.length > 0 && (
        <button onClick={clearAll} className="btn btn-sm btn-ghost">
          Clear all ({notifications.length})
        </button>
      )}
    </div>
  );
}
