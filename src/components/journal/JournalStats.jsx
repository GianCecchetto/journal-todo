import MoodFace from '../MoodFace.jsx'
import { averageMood, moodLabel } from '../../lib/moods.js'
import { countSince, currentStreak } from '../../lib/date.js'

export default function JournalStats({ entries }) {
  const streak = currentStreak(entries)
  const avg = averageMood(entries)

  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-value">{entries.length}</span>
        <span className="stat-label">{entries.length === 1 ? 'Entry' : 'Entries'}</span>
      </div>
      <div className="stat">
        <span className="stat-value">{streak}</span>
        <span className="stat-label">Day streak</span>
      </div>
      <div className="stat">
        <span className="stat-value">{countSince(entries, 7)}</span>
        <span className="stat-label">This week</span>
      </div>
      <div className="stat">
        <span className="stat-value stat-mood" style={{ '--mood': `var(--mood-${avg})` }}>
          {avg ? <MoodFace score={avg} size={26} title={moodLabel(avg)} /> : '—'}
        </span>
        <span className="stat-label">Avg mood</span>
      </div>
    </div>
  )
}
