// ─── Theme ────────────────────────────────────────────────────────────────────
export type Theme = "light" | "dark";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "editor" | "viewer";
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
}

export type AuthAction =
  | { type: "LOGIN_REQUEST" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> };

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  coupon: string | null;
  discount: number;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "APPLY_COUPON"; payload: string }
  | { type: "REMOVE_COUPON" };

// ─── Notifications ────────────────────────────────────────────────────────────
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  createdAt: number;
}

export interface NotificationState {
  notifications: Notification[];
  maxVisible: number;
}

export type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: Omit<Notification, "id" | "createdAt"> }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_ALL" }
  | { type: "SET_MAX_VISIBLE"; payload: number };

// ─── Task Manager (Advanced) ──────────────────────────────────────────────────
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface TaskState {
  tasks: Task[];
  filter: TaskStatus | "all";
  sortBy: "createdAt" | "priority" | "title";
  searchQuery: string;
  selectedIds: string[];
  history: Task[][];
  historyIndex: number;
}

export type TaskAction =
  | { type: "ADD_TASK"; payload: Omit<Task, "id" | "createdAt" | "updatedAt"> }
  | { type: "UPDATE_TASK"; payload: { id: string } & Partial<Task> }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "BATCH_DELETE"; payload: string[] }
  | { type: "MOVE_TASK"; payload: { id: string; status: TaskStatus } }
  | { type: "SET_FILTER"; payload: TaskStatus | "all" }
  | { type: "SET_SORT"; payload: TaskState["sortBy"] }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "TOGGLE_SELECT"; payload: string }
  | { type: "SELECT_ALL" }
  | { type: "DESELECT_ALL" }
  | { type: "UNDO" }
  | { type: "REDO" };
