/**
 * INTERMEDIATE: notificationReducer
 * Demonstrates: auto-id generation in reducer, maxVisible logic, queue management
 */
import type { NotificationState, NotificationAction, Notification } from "../types";

export const initialNotificationState: NotificationState = {
  notifications: [],
  maxVisible: 5,
};

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      const notification: Notification = {
        ...action.payload,
        id: generateId(),
        createdAt: Date.now(),
      };
      const updated = [...state.notifications, notification];
      // Trim to maxVisible — oldest removed first
      const trimmed =
        updated.length > state.maxVisible
          ? updated.slice(updated.length - state.maxVisible)
          : updated;
      return { ...state, notifications: trimmed };
    }

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case "CLEAR_ALL":
      return { ...state, notifications: [] };

    case "SET_MAX_VISIBLE":
      return { ...state, maxVisible: action.payload };

    default:
      return state;
  }
}
