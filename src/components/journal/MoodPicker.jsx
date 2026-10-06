import MoodFace from '../MoodFace.jsx'
import { MOODS } from '../../lib/moods.js'

export default function MoodPicker({ value, onChange }) {
  return (
    <div className="mood-picker" role="radiogroup" aria-label="Mood">
      {MOODS.map((mood) => {
        const selected = value === mood.score
        return (
          <button
            key={mood.score}
            type="button"
            role="radio"
            aria-checked={selected}
            className="mood-option"
            style={{ '--mood': `var(--mood-${mood.score})` }}
            // Tapping the selected face again clears it, so "no mood" stays reachable.
            onClick={() => onChange(selected ? null : mood.score)}
            title={mood.label}
          >
            <MoodFace score={mood.score} size={26} />
            <span className="mood-option-label">{mood.label}</span>
          </button>
        )
      })}
    </div>
  )
}
