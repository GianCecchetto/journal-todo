import { useState } from 'react'

const clean = (raw) => raw.trim().replace(/^#/, '').toLowerCase()

export default function TagInput({ tags, onChange, suggestions = [] }) {
  const [draft, setDraft] = useState('')

  const add = (raw) => {
    const tag = clean(raw)
    if (!tag || tags.includes(tag)) {
      setDraft('')
      return
    }
    onChange([...tags, tag])
    setDraft('')
  }

  const remove = (tag) => onChange(tags.filter((t) => t !== tag))

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(draft)
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      remove(tags[tags.length - 1])
    }
  }

  const unused = suggestions.filter((s) => !tags.includes(s)).slice(0, 5)

  return (
    <div className="tag-input-wrap">
      <div className="tag-input">
        {tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
            <button
              type="button"
              className="tag-remove"
              onClick={() => remove(tag)}
              aria-label={`Remove tag ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          className="tag-field"
          value={draft}
          placeholder={tags.length ? 'Add another' : 'Tags — press Enter'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          aria-label="Add tag"
        />
      </div>

      {unused.length > 0 && (
        <div className="tag-suggest">
          {unused.map((tag) => (
            <button key={tag} type="button" className="tag-ghost" onClick={() => add(tag)}>
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
