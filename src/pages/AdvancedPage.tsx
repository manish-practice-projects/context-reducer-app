/**
 * AdvancedPage — undo/redo, lazy init, middleware dispatch, batch operations
 */
import { TaskBoard } from "../components/advanced/TaskBoard";

function ConceptCard({ title, code, desc }: { title: string; code: string; desc: string }) {
  return (
    <div className="concept-card">
      <h3 className="concept-title">{title}</h3>
      <pre className="concept-code"><code>{code}</code></pre>
      <p className="concept-desc">{desc}</p>
    </div>
  );
}

export function AdvancedPage() {
  return (
    <div className="page">
      <div className="page-header">
        <span className="page-badge page-badge-green">ADVANCED</span>
        <h1 className="page-title">Task Manager</h1>
        <p className="page-subtitle">
          Undo/Redo · Lazy init · Middleware dispatch · Batch ops · localStorage persistence
        </p>
      </div>

      <section className="demo-section">
        <h2 className="section-title">Live Kanban Board</h2>
        <p className="demo-note">
          Add tasks, move between columns, select multiple and batch-delete, undo/redo changes.
          State is persisted in localStorage automatically.
        </p>
        <TaskBoard />
      </section>

      <div className="concepts-grid">
        <ConceptCard
          title="Undo / Redo Stack"
          code={`// In reducer:\ncase 'ADD_TASK': {\n  const newTasks = [...state.tasks, task];\n  return {\n    ...state, tasks: newTasks,\n    history: [...state.history.slice(0, state.historyIndex+1), state.tasks],\n    historyIndex: state.historyIndex + 1\n  };\n}\ncase 'UNDO':\n  return { ...state,\n    tasks: state.history[state.historyIndex],\n    historyIndex: state.historyIndex - 1\n  };`}
          desc="History is stored as an array of task snapshots inside the reducer state. Undo/Redo by moving the historyIndex pointer."
        />
        <ConceptCard
          title="Lazy Initializer"
          code={`// useReducer 3rd arg: init fn runs ONCE\nconst [state, dispatch] = useReducer(\n  taskReducer,\n  initialState,\n  (base) => {\n    const stored = localStorage.getItem('tasks');\n    return stored ? { ...base, tasks: JSON.parse(stored) } : base;\n  }\n);`}
          desc="Pass a 3rd argument to useReducer. The function runs once at mount, enabling expensive initial computations (like reading from storage)."
        />
        <ConceptCard
          title="Middleware-style Dispatch"
          code={`function withLogger(dispatch) {\n  return (action) => {\n    console.group(action.type);\n    console.log('action:', action);\n    console.groupEnd();\n    dispatch(action); // call original\n  };\n}\nconst dispatch = useMemo(\n  () => withLogger(rawDispatch), []\n);`}
          desc="Wrap the raw dispatch in a function to add logging, analytics, or guards — without changing the reducer."
        />
        <ConceptCard
          title="Selectors co-located with Reducer"
          code={`// taskReducer.ts (same file):\nexport function selectFilteredTasks(state) {\n  let tasks = state.tasks;\n  if (state.filter !== 'all')\n    tasks = tasks.filter(t => t.status === state.filter);\n  // ...sort, search\n  return tasks;\n}\n\n// In component:\nconst tasks = selectFilteredTasks(state);`}
          desc="Pure selector functions transform raw state into what components need. Co-locate with the reducer for easy maintenance."
        />
        <ConceptCard
          title="Batch Operations"
          code={`case 'BATCH_DELETE': {\n  const ids = new Set(action.payload);\n  return {\n    ...state,\n    tasks: state.tasks.filter(t => !ids.has(t.id)),\n    selectedIds: []\n  };\n}`}
          desc="Handle multiple items in a single dispatch for atomic updates — avoids multiple renders and keeps history clean."
        />
        <ConceptCard
          title="Context + useMemo for stability"
          code={`const value = useMemo(() => ({\n  state, dispatch,\n  filteredTasks: selectFilteredTasks(state),\n  addTask, updateTask, // memoized with useCallback\n}), [state, dispatch, addTask, updateTask]);\n\nreturn (\n  <TaskContext.Provider value={value}>\n    {children}\n  </TaskContext.Provider>\n);`}
          desc="Memoize the context value object so consumers only re-render when state actually changes, not on every parent render."
        />
      </div>
    </div>
  );
}
