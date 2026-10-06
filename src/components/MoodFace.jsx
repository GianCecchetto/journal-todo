const MOUTHS = {
  1: 'M8.5 16.5 Q12 12.8 15.5 16.5',
  2: 'M8.5 15.8 Q12 13.6 15.5 15.8',
  3: 'M8.75 15.2 H15.25',
  4: 'M8.5 14.2 Q12 16.8 15.5 14.2',
  5: 'M8 13.6 Q12 18.2 16 13.6',
}

/** Mood as a line-drawn face, so it inherits color and needs no emoji font. */
export default function MoodFace({ score, size = 24, title }) {
  return (
    <svg
      className="mood-face"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      <circle cx="12" cy="12" r="9.25" />
      <circle cx="9" cy="9.75" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.75" r="0.9" fill="currentColor" stroke="none" />
      <path d={MOUTHS[score] ?? MOUTHS[3]} />
    </svg>
  )
}
