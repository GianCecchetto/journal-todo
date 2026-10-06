import { toDayKey } from './date.js'

export const PRIORITIES = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

const RANK = { high: 0, medium: 1, low: 2 }

export const priorityLabel = (id) => PRIORITIES.find((p) => p.id === id)?.label ?? null
export const priorityRank = (id) => RANK[id] ?? 3

export const DUE_BUCKETS = [
  { id: 'overdue', label: 'Overdue' },
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'someday', label: 'No due date' },
]

const BUCKET_ORDER = DUE_BUCKETS.reduce((acc, b, i) => ({ ...acc, [b.id]: i }), {})

export function blankTodo() {
  return { text: '', notes: '', priority: null, due: null }
}

/** Backfills todos saved before priorities, due dates and notes existed. */
export function normalizeTodo(todo) {
  return {
    id: todo.id ?? crypto.randomUUID(),
    text: todo.text ?? '',
    notes: todo.notes ?? '',
    done: Boolean(todo.done),
    priority: todo.priority ?? null,
    due: todo.due ?? null,
    createdAt: todo.createdAt ?? new Date().toISOString(),
    completedAt: todo.completedAt ?? null,
  }
}

export function dayOffsetKey(offset) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return toDayKey(d)
}

export function dueBucket(todo) {
  if (!todo.due) return 'someday'
  if (todo.due < toDayKey()) return 'overdue'
  if (todo.due === toDayKey()) return 'today'
  if (todo.due === dayOffsetKey(1)) return 'tomorrow'
  return 'upcoming'
}

export const isOverdue = (todo) => !todo.done && Boolean(todo.due) && todo.due < toDayKey()

export function matchesTodoQuery(todo, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return todo.text.toLowerCase().includes(q) || todo.notes.toLowerCase().includes(q)
}

export const SORTS = [
  { id: 'smart', label: 'Smart' },
  { id: 'due', label: 'Due date' },
  { id: 'priority', label: 'Priority' },
  { id: 'newest', label: 'Newest' },
]

/** Undated items sort last on every date-based comparison. */
const byDue = (a, b) => (a.due ?? '9999').localeCompare(b.due ?? '9999')
const byCreated = (a, b) => b.createdAt.localeCompare(a.createdAt)

export function sortTodos(todos, sort) {
  const list = [...todos]
  if (sort === 'due') return list.sort((a, b) => byDue(a, b) || byCreated(a, b))
  if (sort === 'priority')
    return list.sort(
      (a, b) => priorityRank(a.priority) - priorityRank(b.priority) || byDue(a, b)
    )
  if (sort === 'newest') return list.sort(byCreated)
  return list.sort(
    (a, b) =>
      BUCKET_ORDER[dueBucket(a)] - BUCKET_ORDER[dueBucket(b)] ||
      priorityRank(a.priority) - priorityRank(b.priority) ||
      byCreated(a, b)
  )
}

export function groupByBucket(todos) {
  return DUE_BUCKETS.map(({ id, label }) => ({
    id,
    label,
    todos: todos.filter((t) => dueBucket(t) === id),
  })).filter((group) => group.todos.length > 0)
}

export function todoStats(todos) {
  const done = todos.filter((t) => t.done)
  return {
    total: todos.length,
    done: done.length,
    active: todos.length - done.length,
    overdue: todos.filter(isOverdue).length,
    dueToday: todos.filter((t) => !t.done && t.due === toDayKey()).length,
    percent: todos.length ? Math.round((done.length / todos.length) * 100) : 0,
  }
}
