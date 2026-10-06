import { useEffect, useRef, useState } from 'react'
import { PRIORITIES, dayOffsetKey } from '../../lib/todos.js'
import { toDayKey } from '../../lib/date.js'

const QUICK_DATES = [
  { label: 'Today', offset: 0 },
  { label: 'Tomorrow', offset: 1 },
  { label: 'Next week', offset: 7 },
]

export default function TodoForm({
  todo,
  submitLabel = 'Add',
  startExpanded = false,
  autoFocus = false,
  onSubmit,
  onCancel,
}) {
  const [draft, setDraft] = useState(todo)
  const [expanded, setExpanded] = useState(startExpanded)
  const textRef = useRef(null)

  useEffect(() => {
    if (autoFocus) textRef.current?.focus()
  }, [autoFocus])

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const canSave = draft.text.trim().length > 0

  const submit = (e) => {
    e?.preventDefault()
    if (!canSave) return
    onSubmit({ ...draft, text: draft.text.trim(), notes: draft.notes.trim() })
    if (!onCancel) {
      setDraft({ text: '', notes: '', priority: null, due: null })
      setExpanded(false)
      textRef.current?.focus()
    }
  }

  return (
    <form className="card todo-form" onSubmit={submit}>
      <div className="todo-form-row">
        <input
          ref={textRef}
          className="field"
          placeholder="What needs doing?"
          value={draft.text}
          onChange={(e) => set({ text: e.target.value })}
          onKeyDown={(e) => e.key === 'Escape' && onCancel?.()}
        />
        <button
          type="button"
          className="icon-btn"
          aria-expanded={expanded}
          aria-label={expanded ? 'Hide details' : 'Show details'}
          title={expanded ? 'Hide details' : 'Priority, due date, notes'}
          onClick={() => setExpanded((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d={expanded ? 'M6 14.5 12 9l6 5.5' : 'M6 9.5 12 15l6-5.5'} />
          </svg>
        </button>
        <button type="submit" className="btn" disabled={!canSave}>
          {submitLabel}
        </button>
      </div>

      {expanded && (
        <div className="todo-form-details">
          <div className="form-section">
            <span className="form-label">Priority</span>
            <div className="segmented" role="radiogroup" aria-label="Priority">
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={draft.priority === p.id}
                  className="segment segment-prio"
                  style={{ '--prio': `var(--prio-${p.id})` }}
                  onClick={() => set({ priority: draft.priority === p.id ? null : p.id })}
                >
                  <span className="prio-dot" aria-hidden="true" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <span className="form-label">Due</span>
            <div className="due-controls">
              {QUICK_DATES.map((q) => {
                const key = dayOffsetKey(q.offset)
                return (
                  <button
                    key={q.label}
                    type="button"
                    className="chip"
                    aria-pressed={draft.due === key}
                    onClick={() => set({ due: draft.due === key ? null : key })}
                  >
                    {q.label}
                  </button>
                )
              })}
              <input
                type="date"
                className="field field-date"
                value={draft.due ?? ''}
                min={toDayKey()}
                aria-label="Due date"
                onChange={(e) => set({ due: e.target.value || null })}
              />
              {draft.due && (
                <button type="button" className="btn-ghost" onClick={() => set({ due: null })}>
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="form-section">
            <span className="form-label">Notes</span>
            <textarea
              className="field field-notes"
              rows={2}
              placeholder="Extra detail (optional)"
              value={draft.notes}
              onChange={(e) => set({ notes: e.target.value })}
            />
          </div>

          {onCancel && (
            <div className="form-actions">
              <div className="form-buttons">
                <button type="button" className="btn-ghost" onClick={onCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn" disabled={!canSave}>
                  {submitLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  )
}
