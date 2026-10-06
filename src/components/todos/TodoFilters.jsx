import { PRIORITIES, SORTS } from '../../lib/todos.js'

const STATUSES = [
  { id: 'active', label: 'Active' },
  { id: 'done', label: 'Completed' },
  { id: 'all', label: 'All' },
]

const DUE_FILTERS = [
  { id: 'overdue', label: 'Overdue' },
  { id: 'today', label: 'Due today' },
  { id: 'week', label: 'Next 7 days' },
  { id: 'none', label: 'No date' },
]

export default function TodoFilters({
  query,
  onQuery,
  status,
  onStatus,
  priority,
  onPriority,
  due,
  onDue,
  sort,
  onSort,
  active,
  onReset,
}) {
  return (
    <div className="filters">
      <div className="search">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
        <input
          className="field search-field"
          type="search"
          placeholder="Search tasks and notes"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>

      <div className="filter-row">
        <div className="segmented" role="radiogroup" aria-label="Status">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={status === s.id}
              className="segment"
              onClick={() => onStatus(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <label className="sort">
          <span className="meta">Sort</span>
          <select className="select" value={sort} onChange={(e) => onSort(e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-row">
        <div className="tag-cloud" role="group" aria-label="Filter by priority and due date">
          {PRIORITIES.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip chip-prio"
              style={{ '--prio': `var(--prio-${p.id})` }}
              aria-pressed={priority === p.id}
              onClick={() => onPriority(priority === p.id ? null : p.id)}
            >
              <span className="prio-dot" aria-hidden="true" />
              {p.label}
            </button>
          ))}
          <span className="filter-divider" aria-hidden="true" />
          {DUE_FILTERS.map((d) => (
            <button
              key={d.id}
              type="button"
              className="chip"
              aria-pressed={due === d.id}
              onClick={() => onDue(due === d.id ? null : d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>

        {active && (
          <button type="button" className="btn-link" onClick={onReset}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
