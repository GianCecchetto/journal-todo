import { useState } from 'react'
import Nav from './components/Nav.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import Journal from './components/Journal.jsx'
import Todos from './components/Todos.jsx'
import { useTheme } from './hooks/useTheme.js'

export default function App() {
  const [section, setSection] = useState('journal')
  const { theme, cycle } = useTheme()

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <h1 className="brand-name">Daybook</h1>
        </div>
        <div className="header-right">
          <Nav section={section} onChange={setSection} />
          <ThemeToggle theme={theme} onCycle={cycle} />
        </div>
      </header>

      <main className="main" key={section}>
        {section === 'journal' ? <Journal /> : <Todos />}
      </main>
    </div>
  )
}
