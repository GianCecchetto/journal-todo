import { useMemo, useState } from 'react'
import EntryForm from './journal/EntryForm.jsx'
import EntryCard from './journal/EntryCard.jsx'
import JournalStats from './journal/JournalStats.jsx'
import JournalFilters from './journal/JournalFilters.jsx'
import Toast from './Toast.jsx'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useUndo } from '../hooks/useUndo.js'
import { allTags, blankDraft, matchesQuery, normalizeEntry } from '../lib/entries.js'
import { formatDayLabel, groupByDay } from '../lib/date.js'

export default function Journal() {
  const [stored, setStored] = useLocalStorage('daybook.entries', [])
  const entries = useMemo(() => stored.map(normalizeEntry), [stored])

  const [composing, setComposing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState(null)
  const [tag, setTag] = useState(null)
  const deleted = useUndo()

  const tags = useMemo(() => allTags(entries), [entries])

  const visible = useMemo(
    () =>
      entries.filter(
        (e) =>
          matchesQuery(e, query) &&
          (mood === null || e.mood === mood) &&
          (tag === null || e.tags.includes(tag))
      ),
    [entries, query, mood, tag]
  )

  const groups = useMemo(() => groupByDay(visible), [visible])
  const filtersActive = Boolean(query || mood !== null || tag !== null)

  const resetFilters = () => {
    setQuery('')
    setMood(null)
    setTag(null)
  }

  const createEntry = (draft) => {
    const now = new Date().toISOString()
    setStored([{ ...draft, id: crypto.randomUUID(), createdAt: now, updatedAt: null }, ...entries])
    setComposing(false)
  }

  const saveEdit = (draft) => {
    setStored(
      entries.map((e) =>
        e.id === editingId ? { ...e, ...draft, updatedAt: new Date().toISOString() } : e
      )
    )
    setEditingId(null)
  }

  const deleteEntry = (entry) => {
    setStored(entries.filter((e) => e.id !== entry.id))
    deleted.schedule(entry)
  }

  const undoDelete = () => {
    if (!deleted.pending) return
    setStored([deleted.pending, ...entries])
    deleted.clear()
  }

  const filterByTag = (name) => {
    setTag(name)
    setQuery('')
  }

  return (
    <section className="section">
      <JournalStats entries={entries} />

      {composing ? (
        <EntryForm
          draft={blankDraft()}
          suggestions={tags.map((t) => t.tag)}
          autoFocus
          onSubmit={createEntry}
          onCancel={() => setComposing(false)}
        />
      ) : (
        <button type="button" className="compose-trigger" onClick={() => setComposing(true)}>
          <span className="compose-plus" aria-hidden="true">+</span>
          New entry
        </button>
      )}

      {entries.length > 0 && (
        <JournalFilters
          query={query}
          onQuery={setQuery}
          mood={mood}
          onMood={setMood}
          tag={tag}
          onTag={setTag}
          tags={tags}
          active={filtersActive}
          onReset={resetFilters}
        />
      )}

      {entries.length === 0 ? (
        <div className="empty">
          <h3 className="empty-title">Your journal is empty</h3>
          <p>Write the first entry — note how the day felt and what stood out.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="empty">
          <h3 className="empty-title">No matches</h3>
          <p>Nothing fits these filters yet.</p>
          <button type="button" className="btn-link" onClick={resetFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="timeline">
          {groups.map((group) => (
            <div key={group.key} className="day-group">
              <div className="day-head">
                <h2 className="day-label">{formatDayLabel(group.key)}</h2>
                <span className="day-count">
                  {group.entries.length} {group.entries.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              <div className="list">
                {group.entries.map((entry) =>
                  editingId === entry.id ? (
                    <EntryForm
                      key={entry.id}
                      draft={entry}
                      suggestions={tags.map((t) => t.tag)}
                      submitLabel="Save changes"
                      autoFocus
                      onSubmit={saveEdit}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      onEdit={(e) => setEditingId(e.id)}
                      onDelete={deleteEntry}
                      onTagClick={filterByTag}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {deleted.pending && <Toast message="Entry deleted" onAction={undoDelete} />}
    </section>
  )
}
