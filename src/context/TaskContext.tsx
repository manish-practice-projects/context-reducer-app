/**
 * ADVANCED: TaskContext
 * Demonstrates: context composition, lazy initializer, middleware-style logging,
 *               exposing selectors via context, optimistic UI pattern
 */
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  ReactNode,
  Dispatch,
} from "react";
import {
  taskReducer,
  initialTaskState,
  selectFilteredTasks,
  selectCanUndo,
  selectCanRedo,
} from "../reducers/taskReducer";
import type { TaskState, TaskAction, Task, TaskStatus, TaskPriority } from "../types";

interface TaskContextValue {
  // Raw state
  state: TaskState;
  dispatch: Dispatch<TaskAction>;
  // Derived
  filteredTasks: Task[];
  canUndo: boolean;
  canRedo: boolean;
  // Action helpers
  addTask: (title: string, description: string, priority: TaskPriority) => void;
  updateTask: (id: string, changes: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  batchDelete: () => void;
  undo: () => void;
  redo: () => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

// ─── Middleware-style logger wrapping dispatch ────────────────────────────────
function withLogger(dispatch: Dispatch<TaskAction>): Dispatch<TaskAction> {
  return (action) => {
    if (process.env.NODE_ENV !== "production") {
      console.group(`[TaskReducer] ${action.type}`);
      console.log("action →", action);
      console.groupEnd();
    }
    dispatch(action);
  };
}

// ─── Lazy initializer — runs once, not on every render ───────────────────────
function lazyInit(base: TaskState): TaskState {
  try {
    const stored = localStorage.getItem("tasks");
    if (stored) return { ...base, tasks: JSON.parse(stored) };
  } catch {
    /* ignore */
  }
  return base;
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(taskReducer, initialTaskState, lazyInit);
  const dispatch = useMemo(() => withLogger(rawDispatch), []);

  // Persist to localStorage on every tasks change
  useMemo(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    } catch {
      /* quota exceeded — silently ignore */
    }
  }, [state.tasks]);

  const addTask = useCallback(
    (title: string, description: string, priority: TaskPriority) =>
      dispatch({
        type: "ADD_TASK",
        payload: { title, description, priority, status: "todo", assignee: null, tags: [] },
      }),
    [dispatch]
  );

  const updateTask = useCallback(
    (id: string, changes: Partial<Task>) =>
      dispatch({ type: "UPDATE_TASK", payload: { id, ...changes } }),
    [dispatch]
  );

  const deleteTask = useCallback(
    (id: string) => dispatch({ type: "DELETE_TASK", payload: id }),
    [dispatch]
  );

  const moveTask = useCallback(
    (id: string, status: TaskStatus) =>
      dispatch({ type: "MOVE_TASK", payload: { id, status } }),
    [dispatch]
  );

  const batchDelete = useCallback(
    () => dispatch({ type: "BATCH_DELETE", payload: state.selectedIds }),
    [dispatch, state.selectedIds]
  );

  const undo = useCallback(() => dispatch({ type: "UNDO" }), [dispatch]);
  const redo = useCallback(() => dispatch({ type: "REDO" }), [dispatch]);

  const value = useMemo<TaskContextValue>(
    () => ({
      state,
      dispatch,
      filteredTasks: selectFilteredTasks(state),
      canUndo: selectCanUndo(state),
      canRedo: selectCanRedo(state),
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      batchDelete,
      undo,
      redo,
    }),
    [state, dispatch, addTask, updateTask, deleteTask, moveTask, batchDelete, undo, redo]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be inside <TaskProvider>");
  return ctx;
}
