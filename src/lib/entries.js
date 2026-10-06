import { toDayKey } from './date.js'

export function blankDraft() {
  return {
    date: toDayKey(),
    title: '',
    body: '',
    mood: null,
    energy: null,
    tags: [],
  }
}

/** Backfills entries saved by earlier versions, which had no date/mood/tags. */
export function normalizeEntry(entry) {
  const createdAt = entry.createdAt ?? new Date().toISOString()
  return {
    id: entry.id ?? crypto.randomUUID(),
    title: entry.title ?? '',
    body: entry.body ?? '',
    mood: entry.mood ?? null,
    energy: entry.energy ?? null,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    date: entry.date ?? toDayKey(createdAt),
    createdAt,
    updatedAt: entry.updatedAt ?? null,
  }
}

export function matchesQuery(entry, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    entry.title.toLowerCase().includes(q) ||
    entry.body.toLowerCase().includes(q) ||
    entry.tags.some((tag) => tag.toLowerCase().includes(q))
  )
}

export function allTags(entries) {
  const counts = new Map()
  for (const entry of entries) {
    for (const tag of entry.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }))
}
