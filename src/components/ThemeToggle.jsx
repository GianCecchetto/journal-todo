const ICONS = {
  system: (
    <>
      <rect x="2.75" y="4" width="18.5" height="12.5" rx="2" />
      <path d="M8.5 20h7" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </>
  ),
  dark: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
}

const NEXT_LABEL = { system: 'light', light: 'dark', dark: 'system' }

export default function ThemeToggle({ theme, onCycle }) {
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onCycle}
      title={`Theme: ${theme} — switch to ${NEXT_LABEL[theme]}`}
      aria-label={`Theme: ${theme}. Switch to ${NEXT_LABEL[theme]}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
        {ICONS[theme]}
      </svg>
    </button>
  )
}
