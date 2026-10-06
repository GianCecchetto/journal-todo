import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage.js'

export const THEMES = ['system', 'light', 'dark']

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('daybook.theme', 'system')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
  }, [theme])

  const cycle = () => setTheme(THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length])

  return { theme, setTheme, cycle }
}
