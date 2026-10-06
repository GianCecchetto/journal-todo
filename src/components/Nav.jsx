const SECTIONS = [
  { id: 'journal', label: 'Journal' },
  { id: 'todos', label: 'Todos' },
]

export default function Nav({ section, onChange }) {
  return (
    <nav className="nav" aria-label="Sections">
      <span
        className="nav-thumb"
        style={{ transform: `translateX(${SECTIONS.findIndex((s) => s.id === section) * 100}%)` }}
        aria-hidden="true"
      />
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          className="nav-item"
          aria-current={section === s.id ? 'page' : undefined}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </nav>
  )
}
