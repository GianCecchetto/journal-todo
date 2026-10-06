import { useEffect, useRef, useState } from 'react'

/** Holds the last removed item for a few seconds so it can be restored. */
export function useUndo(timeout = 7000) {
  const [pending, setPending] = useState(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const schedule = (item) => {
    setPending(item)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setPending(null), timeout)
  }

  const clear = () => {
    setPending(null)
    clearTimeout(timer.current)
  }

  return { pending, schedule, clear }
}
