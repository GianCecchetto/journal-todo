import { useEffect, useRef, useState } from 'react'
import MoodPicker from './MoodPicker.jsx'
import TagInput from './TagInput.jsx'
import { ENERGY } from '../../lib/moods.js'
import { toDayKey } from '../../lib/date.js'

export default function EntryForm({
  draft: initial,
  suggestions,
  submitLabel = 'Save entry',
  autoFocus = false,
  onSubmit,
  onCancel,
}) {
  const [draft, setDraft] = useState(initial)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (autoFocus) bodyRef.current?.focus()
  }, [autoFocus])

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const canSave = draft.body.trim().length > 0

  const submit = (e) => {
    e?.preventDefault()
    if (!canSave) return
    onSubmit({
      ...draft,
      title: draft.title.trim(),
      body: draft.body.trim(),
    })
  }

  const onBodyKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit(e)
    if (e.key === 'Escape' && onCancel) onCancel()
  }

  return (
    <form className="card entry-form" onSubmit={submit}>
      <input
        className="field field-title"
        placeholder="Title (optional)"
        value={draft.title}
        onChange={(e) => set({ title: e.target.value })}
      />

      <textarea
        ref={bodyRef}
        className="field field-body"
        placeholder="What happened today? How did it feel?"
        rows={6}
        value={draft.body}
        onChange={(e) => set({ body: e.target.value })}
        onKeyDown={onBodyKeyDown}
      />

      <div className="form-section">
        <span className="form-label">Mood</span>
        <MoodPicker value={draft.mood} onChange={(mood) => set({ mood })} />
      </div>

      <div className="form-grid">
        <div className="form-section">
          <span className="form-label">Energy</span>
          <div className="segmented" role="radiogroup" aria-label="Energy">
            {ENERGY.map((level) => (
              <button
                key={level.id}
                type="button"
                role="radio"
                aria-checked={draft.energy === level.id}
                className="segment"
                onClick={() =>
                  set({ energy: draft.energy === level.id ? null : level.id })
                }
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="form-label" htmlFor="entry-date">
            Date
          </label>
          <input
            id="entry-date"
            type="date"
            className="field field-date"
            value={draft.date}
            max={toDayKey()}
            onChange={(e) => set({ date: e.target.value || toDayKey() })}
          />
        </div>
      </div>

      <div className="form-section">
        <span className="form-label">Tags</span>
        <TagInput
          tags={draft.tags}
          onChange={(tags) => set({ tags })}
          suggestions={suggestions}
        />
      </div>

      <div className="form-actions">
        <span className="hint">
          <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to save
        </span>
        <div className="form-buttons">
          {onCancel && (
            <button type="button" className="btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn" disabled={!canSave}>
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
