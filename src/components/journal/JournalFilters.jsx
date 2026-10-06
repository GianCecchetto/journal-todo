import MoodFace from '../MoodFace.jsx'
import { MOODS } from '../../lib/moods.js'

export default function JournalFilters({
  query,
  onQuery,
  mood,
  onMood,
  tag,
  onTag,
  tags,
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
          placeholder="Search entries and tags"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>

      <div className="filter-row">
        <div className="mood-filter" role="group" aria-label="Filter by mood">
          {MOODS.map((m) => (
            <button
              key={m.score}
              type="button"
              className="mood-chip"
              style={{ '--mood': `var(--mood-${m.score})` }}
              aria-pressed={mood === m.score}
              title={`Only ${m.label}`}
              onClick={() => onMood(mood === m.score ? null : m.score)}
            >
              <MoodFace score={m.score} size={20} title={m.label} />
            </button>
          ))}
        </div>

        {active && (
          <button type="button" className="btn-link" onClick={onReset}>
            Clear filters
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="tag-cloud">
          {tags.slice(0, 12).map(({ tag: name, count }) => (
            <button
              key={name}
              type="button"
              className="chip"
              aria-pressed={tag === name}
              onClick={() => onTag(tag === name ? null : name)}
            >
              #{name} <span className="chip-count">{count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
