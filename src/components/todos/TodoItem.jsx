import { isOverdue, priorityLabel } from '../../lib/todos.js'
import { formatDayLabel } from '../../lib/date.js'

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(todo)

  return (
    <li className={todo.done ? 'card todo is-done' : 'card todo'}>
      <label className="todo-check">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo)}
          aria-label={todo.done ? `Reopen ${todo.text}` : `Complete ${todo.text}`}
        />
        <span className="checkbox" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
      </label>

      <div className="todo-main">
        <span className="todo-text">{todo.text}</span>

        {(todo.priority || todo.due || todo.notes) && (
          <div className="todo-tags">
            {todo.priority && (
              <span
                className="prio-pill"
                style={{ '--prio': `var(--prio-${todo.priority})` }}
              >
                <span className="prio-dot" aria-hidden="true" />
                {priorityLabel(todo.priority)}
              </span>
            )}
            {todo.due && (
              <span className={overdue ? 'due-pill is-overdue' : 'due-pill'}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
                  <path d="M3.5 10h17M8.5 3.5v3M15.5 3.5v3" />
                </svg>
                {formatDayLabel(todo.due)}
                {overdue && <span className="sr-only"> (overdue)</span>}
              </span>
            )}
            {todo.notes && <span className="note-flag">Note</span>}
          </div>
        )}

        {todo.notes && <p className="todo-notes">{todo.notes}</p>}
      </div>

      <div className="todo-actions">
        <button type="button" className="btn-ghost" onClick={() => onEdit(todo)}>
          Edit
        </button>
        <button type="button" className="btn-ghost danger" onClick={() => onDelete(todo)}>
          Delete
        </button>
      </div>
    </li>
  )
}
