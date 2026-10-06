export const MOODS = [
  { score: 1, label: 'Rough' },
  { score: 2, label: 'Low' },
  { score: 3, label: 'Okay' },
  { score: 4, label: 'Good' },
  { score: 5, label: 'Great' },
]

export const ENERGY = [
  { id: 'low', label: 'Low' },
  { id: 'steady', label: 'Steady' },
  { id: 'high', label: 'High' },
]

export const moodLabel = (score) =>
  MOODS.find((m) => m.score === score)?.label ?? 'No mood'

export const energyLabel = (id) => ENERGY.find((e) => e.id === id)?.label ?? null

/** Average mood across entries that recorded one, rounded to the nearest face. */
export function averageMood(entries) {
  const scored = entries.filter((e) => e.mood)
  if (scored.length === 0) return null
  const sum = scored.reduce((acc, e) => acc + e.mood, 0)
  return Math.round(sum / scored.length)
}
