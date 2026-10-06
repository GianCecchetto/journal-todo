import { useState } from 'react'
import MoodFace from '../MoodFace.jsx'
import { energyLabel, moodLabel } from '../../lib/moods.js'
import { formatTime } from '../../lib/date.js'

const PREVIEW_LIMIT = 420

export default function EntryCard({ entry, onEdit, onDelete, onTagClick }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = entry.body.length > PREVIEW_LIMIT
  const body = isLong && !expanded ? `${entry.body.slice(0, PREVIEW_LIMIT)}…` : entry.body

  return (
    <article className="card entry">
      <div className="entry-head">
        <div className="entry-heading">
          {entry.mood && (
            <span
              className="mood-badge"
              style={{ '--mood': `var(--mood-${entry.mood})` }}
              title={moodLabel(entry.mood)}
            >
              <MoodFace score={entry.mood} size={20} title={moodLabel(entry.mood)} />
            </span>
          )}
          <div>
            {entry.title && <h3 className="entry-title">{entry.title}</h3>}
            <div className="entry-meta">
              <time dateTime={entry.createdAt}>{formatTime(entry.createdAt)}</time>
              {entry.energy && <span>· {energyLabel(entry.energy)} energy</span>}
              {entry.updatedAt && <span>· edited</span>}
            </div>
          </div>
        </div>

        <div className="entry-actions">
          <button type="button" className="btn-ghost" onClick={() => onEdit(entry)}>
            Edit
          </button>
          <button
            type="button"
            className="btn-ghost danger"
            onClick={() => onDelete(entry)}
          >
            Delete
          </button>
        </div>
      </div>

      <p className="entry-body">{body}</p>

      {isLong && (
        <button
          type="button"
          className="btn-link"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {entry.tags.length > 0 && (
        <div className="entry-tags">
          {entry.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="tag-ghost"
              onClick={() => onTagClick(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </article>
  )
}
