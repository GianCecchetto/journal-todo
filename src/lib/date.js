/** Local calendar day as YYYY-MM-DD (not UTC — avoids off-by-one near midnight). */
export function toDayKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

const dayKeyToDate = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const diffInDays = (aKey, bKey) =>
  Math.round((dayKeyToDate(aKey) - dayKeyToDate(bKey)) / 86400000)

/** "Today" / "Yesterday" / "Mon, 6 Oct 2026" */
export function formatDayLabel(key) {
  const delta = diffInDays(toDayKey(), key)
  if (delta === 0) return 'Today'
  if (delta === 1) return 'Yesterday'
  return dayKeyToDate(key).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: dayKeyToDate(key).getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  })
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { timeStyle: 'short' })
}

/** Entries grouped into [{ key, entries }], newest day first, newest entry first. */
export function groupByDay(entries) {
  const groups = new Map()
  for (const entry of entries) {
    if (!groups.has(entry.date)) groups.set(entry.date, [])
    groups.get(entry.date).push(entry)
  }
  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => ({
      key,
      entries: items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    }))
}

/** Consecutive days written, counting back from today (or yesterday, if today is blank). */
export function currentStreak(entries) {
  const days = [...new Set(entries.map((e) => e.date))].sort((a, b) => b.localeCompare(a))
  if (days.length === 0) return 0

  const gapToFirst = diffInDays(toDayKey(), days[0])
  if (gapToFirst > 1) return 0

  let streak = 1
  for (let i = 1; i < days.length; i++) {
    if (diffInDays(days[i - 1], days[i]) !== 1) break
    streak++
  }
  return streak
}

export function countSince(entries, days) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - (days - 1))
  const cutoffKey = toDayKey(cutoff)
  return entries.filter((e) => e.date >= cutoffKey).length
}
