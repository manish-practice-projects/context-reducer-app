/**
 * ADVANCED: TaskBoard
 * Demonstrates: complex state + undo/redo + batch ops + real-time filtering
 */
import { useState } from "react";
import { useTaskContext } from "../../hooks";
import type { TaskStatus, TaskPriority, Task } from "../../types";

const COLUMNS: { status: TaskStatus; label: string; emoji: string }[] = [
  { status: "todo", label: "To Do", emoji: "📋" },
  { status: "in-progress", label: "In Progress", emoji: "⚙️" },
  { status: "done", label: "Done", emoji: "✅" },
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

// ─── Add Task Form ────────────────────────────────────────────────────────────
function AddTaskForm() {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask(title.trim(), description.trim(), priority);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="add-task-form">
      <input
        placeholder="Task title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        className="task-input"
      />
      <input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="task-input"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        className="task-select"
      >
        <option value="low">🟢 Low</option>
        <option value="medium">🟡 Medium</option>
        <option value="high">🔴 High</option>
      </select>
      <button onClick={handleAdd} className="btn btn-primary" disabled={!title.trim()}>
        + Add Task
      </button>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({ task }: { task: Task }) {
  const { deleteTask, moveTask, dispatch, state } = useTaskContext();
  const isSelected = state.selectedIds.includes(task.id);

  return (
    <div className={`task-card priority-${task.priority} ${isSelected ? "selected" : ""}`}>
      <div className="task-card-header">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => dispatch({ type: "TOGGLE_SELECT", payload: task.id })}
          className="task-checkbox"
        />
        <span
          className="priority-dot"
          style={{ background: PRIORITY_COLORS[task.priority] }}
          title={task.priority}
        />
        <span className="task-title">{task.title}</span>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-card-footer">
        <div className="task-move-btns">
          {COLUMNS.filter((c) => c.status !== task.status).map((col) => (
            <button
              key={col.status}
              onClick={() => moveTask(task.id, col.status)}
              className="btn btn-xs btn-ghost"
              title={`Move to ${col.label}`}
            >
              → {col.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => deleteTask(task.id)}
          className="btn btn-xs btn-danger-ghost"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────
function TaskColumn({ status, label, emoji }: (typeof COLUMNS)[0]) {
  const { filteredTasks } = useTaskContext();
  const columnTasks = filteredTasks.filter((t) => t.status === status);

  return (
    <div className="task-column">
      <div className="column-header">
        <span>{emoji}</span>
        <h3>{label}</h3>
        <span className="column-count">{columnTasks.length}</span>
      </div>
      <div className="column-body">
        {columnTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {columnTasks.length === 0 && (
          <p className="column-empty">No tasks here</p>
        )}
      </div>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function TaskToolbar() {
  const { state, dispatch, canUndo, canRedo, batchDelete } = useTaskContext();

  return (
    <div className="task-toolbar">
      <div className="toolbar-left">
        <input
          placeholder="Search tasks…"
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
          className="search-input"
        />

        <select
          value={state.sortBy}
          onChange={(e) =>
            dispatch({ type: "SET_SORT", payload: e.target.value as typeof state.sortBy })
          }
          className="task-select"
        >
          <option value="createdAt">Sort: Newest</option>
          <option value="priority">Sort: Priority</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      <div className="toolbar-right">
        <button onClick={() => dispatch({ type: "UNDO" })} disabled={!canUndo} className="btn btn-sm btn-ghost">
          ↩ Undo
        </button>
        <button onClick={() => dispatch({ type: "REDO" })} disabled={!canRedo} className="btn btn-sm btn-ghost">
          Redo ↪
        </button>

        {state.selectedIds.length > 0 && (
          <>
            <button onClick={batchDelete} className="btn btn-sm btn-danger">
              🗑 Delete ({state.selectedIds.length})
            </button>
            <button onClick={() => dispatch({ type: "DESELECT_ALL" })} className="btn btn-sm btn-ghost">
              ✕ Deselect
            </button>
          </>
        )}

        <button
          onClick={() => dispatch({ type: "SELECT_ALL" })}
          className="btn btn-sm btn-ghost"
        >
          ☑ Select All
        </button>
      </div>
    </div>
  );
}

// ─── Board Root ───────────────────────────────────────────────────────────────
export function TaskBoard() {
  return (
    <div className="task-board">
      <AddTaskForm />
      <TaskToolbar />
      <div className="task-columns">
        {COLUMNS.map((col) => (
          <TaskColumn key={col.status} {...col} />
        ))}
      </div>
    </div>
  );
}
