/**
 * ADVANCED: taskReducer
 * Demonstrates: undo/redo with history stack, batch operations,
 *               derived filtering/sorting inside selectors, optimistic updates
 */
import type { TaskState, TaskAction, Task, TaskPriority } from "../types";

const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

export const initialTaskState: TaskState = {
  tasks: [],
  filter: "all",
  sortBy: "createdAt",
  searchQuery: "",
  selectedIds: [],
  history: [],
  historyIndex: -1,
};

// ─── Snapshot helpers for undo/redo ──────────────────────────────────────────
function pushHistory(state: TaskState, tasks: Task[]): Pick<TaskState, "history" | "historyIndex"> {
  // Discard any "future" history when a new action is performed
  const base = state.history.slice(0, state.historyIndex + 1);
  const history = [...base, state.tasks].slice(-20); // keep max 20 snapshots
  return { history, historyIndex: history.length - 1 };
}

function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    // ── CRUD ────────────────────────────────────────────────────────────────
    case "ADD_TASK": {
      const task: Task = {
        ...action.payload,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const newTasks = [...state.tasks, task];
      return { ...state, tasks: newTasks, ...pushHistory(state, newTasks) };
    }

    case "UPDATE_TASK": {
      const { id, ...changes } = action.payload;
      const newTasks = state.tasks.map((t) =>
        t.id === id ? { ...t, ...changes, updatedAt: Date.now() } : t
      );
      return { ...state, tasks: newTasks, ...pushHistory(state, newTasks) };
    }

    case "DELETE_TASK": {
      const newTasks = state.tasks.filter((t) => t.id !== action.payload);
      return {
        ...state,
        tasks: newTasks,
        selectedIds: state.selectedIds.filter((id) => id !== action.payload),
        ...pushHistory(state, newTasks),
      };
    }

    case "BATCH_DELETE": {
      const ids = new Set(action.payload);
      const newTasks = state.tasks.filter((t) => !ids.has(t.id));
      return {
        ...state,
        tasks: newTasks,
        selectedIds: [],
        ...pushHistory(state, newTasks),
      };
    }

    case "MOVE_TASK": {
      const newTasks = state.tasks.map((t) =>
        t.id === action.payload.id
          ? { ...t, status: action.payload.status, updatedAt: Date.now() }
          : t
      );
      return { ...state, tasks: newTasks, ...pushHistory(state, newTasks) };
    }

    // ── Filter / Sort / Search ───────────────────────────────────────────────
    case "SET_FILTER":
      return { ...state, filter: action.payload };

    case "SET_SORT":
      return { ...state, sortBy: action.payload };

    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };

    // ── Selection ────────────────────────────────────────────────────────────
    case "TOGGLE_SELECT":
      return {
        ...state,
        selectedIds: state.selectedIds.includes(action.payload)
          ? state.selectedIds.filter((id) => id !== action.payload)
          : [...state.selectedIds, action.payload],
      };

    case "SELECT_ALL":
      return { ...state, selectedIds: state.tasks.map((t) => t.id) };

    case "DESELECT_ALL":
      return { ...state, selectedIds: [] };

    // ── Undo / Redo ──────────────────────────────────────────────────────────
    case "UNDO": {
      if (state.historyIndex < 0) return state;
      const tasks = state.history[state.historyIndex];
      return { ...state, tasks, historyIndex: state.historyIndex - 1 };
    }

    case "REDO": {
      const nextIndex = state.historyIndex + 1;
      if (nextIndex >= state.history.length) return state;
      const tasks = state.history[nextIndex];
      return { ...state, tasks, historyIndex: nextIndex };
    }

    default:
      return state;
  }
}

// ─── Selectors ────────────────────────────────────────────────────────────────
export function selectFilteredTasks(state: TaskState): Task[] {
  let tasks = state.tasks;

  if (state.filter !== "all") {
    tasks = tasks.filter((t) => t.status === state.filter);
  }

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return [...tasks].sort((a, b) => {
    switch (state.sortBy) {
      case "priority":
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      case "title":
        return a.title.localeCompare(b.title);
      case "createdAt":
      default:
        return b.createdAt - a.createdAt;
    }
  });
}

export function selectCanUndo(state: TaskState): boolean {
  return state.historyIndex >= 0;
}

export function selectCanRedo(state: TaskState): boolean {
  return state.historyIndex < state.history.length - 1;
}
