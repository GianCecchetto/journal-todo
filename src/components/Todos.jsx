import { useMemo, useState } from 'react'
import TodoForm from './todos/TodoForm.jsx'
import TodoItem from './todos/TodoItem.jsx'
import TodoFilters from './todos/TodoFilters.jsx'
import Toast from './Toast.jsx'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useUndo } from '../hooks/useUndo.js'
import {
  blankTodo,
  dayOffsetKey,
  groupByBucket,
  isOverdue,
  matchesTodoQuery,
  normalizeTodo,
  sortTodos,
  todoStats,
} from '../lib/todos.js'
import { toDayKey } from '../lib/date.js'

const matchesDue = (todo, due) => {
  if (!due) return true
  if (due === 'overdue') return isOverdue(todo)
  if (due === 'today') return todo.due === toDayKey()
  if (due === 'week')
    return Boolean(todo.due) && todo.due >= toDayKey() && todo.due <= dayOffsetKey(7)
  return !todo.due
}

export default function Todos() {
  const [stored, setStored] = useLocalStorage('daybook.todos', [])
  const todos = useMemo(() => stored.map(normalizeTodo), [stored])

  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('active')
  const [priority, setPriority] = useState(null)
  const [due, setDue] = useState(null)
  const [sort, setSort] = useState('smart')
  const [showDone, setShowDone] = useState(true)
  const deleted = useUndo()

  const stats = useMemo(() => todoStats(todos), [todos])

  const matched = useMemo(
    () =>
      todos.filter(
        (t) =>
          matchesTodoQuery(t, query) &&
          (priority === null || t.priority === priority) &&
          matchesDue(t, due)
      ),
    [todos, query, priority, due]
  )

  const active = useMemo(
    () => sortTodos(matched.filter((t) => !t.done), sort),
    [matched, sort]
  )

  const completed = useMemo(
    () =>
      matched
        .filter((t) => t.done)
        .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')),
    [matched]
  )

  const filtersActive = Boolean(
    query || priority || due || status !== 'active' || sort !== 'smart'
  )

  const resetFilters = () => {
    setQuery('')
    setStatus('active')
    setPriority(null)
    setDue(null)
    setSort('smart')
  }

  const addTodo = (draft) =>
    setStored([
      ...todos,
      {
        ...draft,
        id: crypto.randomUUID(),
        done: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
      },
    ])

  const saveEdit = (draft) => {
    setStored(todos.map((t) => (t.id === editingId ? { ...t, ...draft } : t)))
    setEditingId(null)
  }

  const toggleTodo = (todo) =>
    setStored(
      todos.map((t) =>
        t.id === todo.id
          ? { ...t, done: !t.done, completedAt: t.done ? null : new Date().toISOString() }
          : t
      )
    )

  const deleteTodo = (todo) => {
    setStored(todos.filter((t) => t.id !== todo.id))
    deleted.schedule(todo)
  }

  const undoDelete = () => {
    if (!deleted.pending) return
    setStored([...todos, deleted.pending])
    deleted.clear()
  }

  const clearCompleted = () => setStored(todos.filter((t) => !t.done))

  // Due-date headings only make sense while the list is in due-date order.
  const activeGroups =
    sort === 'smart' ? groupByBucket(active) : [{ id: 'all', label: null, todos: active }]

  const renderRow = (todo) =>
    editingId === todo.id ? (
      <TodoForm
        key={todo.id}
        todo={todo}
        submitLabel="Save"
        startExpanded
        autoFocus
        onSubmit={saveEdit}
        onCancel={() => setEditingId(null)}
      />
    ) : (
      <TodoItem
        key={todo.id}
        todo={todo}
        onToggle={toggleTodo}
        onEdit={(t) => setEditingId(t.id)}
        onDelete={deleteTodo}
      />
    )

  const showActive = status !== 'done'
  const showCompleted = status !== 'active'
  const nothingVisible =
    (!showActive || active.length === 0) && (!showCompleted || completed.length === 0)
  const allDone = stats.total > 0 && stats.active === 0 && !filtersActive

  return (
    <section className="section">
      {todos.length > 0 && (
        <div className="stats">
          <div className="stat">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.dueToday}</span>
            <span className="stat-label">Due today</span>
          </div>
          <div className="stat">
            <span className={stats.overdue ? 'stat-value is-alert' : 'stat-value'}>
              {stats.overdue}
            </span>
            <span className="stat-label">Overdue</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.percent}%</span>
            <span className="stat-label">Done</span>
          </div>
        </div>
      )}

      <TodoForm todo={blankTodo()} onSubmit={addTodo} />

      {todos.length > 0 && (
        <>
          <div className="progress-block">
            <div className="progress-head">
              <span className="meta">
                {stats.done} of {stats.total} complete
              </span>
              {stats.done > 0 && (
                <button type="button" className="btn-link" onClick={clearCompleted}>
                  Clear completed
                </button>
              )}
            </div>
            <div
              className="progress"
              role="progressbar"
              aria-valuenow={stats.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tasks complete"
            >
              <span className="progress-fill" style={{ width: `${stats.percent}%` }} />
            </div>
          </div>

          <TodoFilters
            query={query}
            onQuery={setQuery}
            status={status}
            onStatus={setStatus}
            priority={priority}
            onPriority={setPriority}
            due={due}
            onDue={setDue}
            sort={sort}
            onSort={setSort}
            active={filtersActive}
            onReset={resetFilters}
          />
        </>
      )}

      {todos.length === 0 ? (
        <div className="empty">
          <h3 className="empty-title">No tasks yet</h3>
          <p>Add the first thing you want to get done — details are optional.</p>
        </div>
      ) : nothingVisible ? (
        <div className="empty">
          <h3 className="empty-title">{allDone ? 'All clear' : 'Nothing matches'}</h3>
          <p>
            {allDone
              ? 'Every task is done. Enjoy it.'
              : 'No tasks fit these filters.'}
          </p>
          {filtersActive && (
            <button type="button" className="btn-link" onClick={resetFilters}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="timeline">
          {showActive &&
            activeGroups.map((group) => (
              <div key={group.id} className="day-group">
                {group.label && (
                  <div className="day-head">
                    <h2
                      className={
                        group.id === 'overdue' ? 'day-label is-alert' : 'day-label'
                      }
                    >
                      {group.label}
                    </h2>
                    <span className="day-count">{group.todos.length}</span>
                  </div>
                )}
                <ul className="list">{group.todos.map(renderRow)}</ul>
              </div>
            ))}

          {showCompleted && completed.length > 0 && (
            <div className="day-group">
              <div className="day-head">
                <h2 className="day-label">Completed</h2>
                <span className="day-count">{completed.length}</span>
                <button
                  type="button"
                  className="btn-link"
                  aria-expanded={showDone}
                  onClick={() => setShowDone((v) => !v)}
                >
                  {showDone ? 'Hide' : 'Show'}
                </button>
              </div>
              {showDone && <ul className="list">{completed.map(renderRow)}</ul>}
            </div>
          )}
        </div>
      )}

      {deleted.pending && <Toast message="Task deleted" onAction={undoDelete} />}
    </section>
  )
}
